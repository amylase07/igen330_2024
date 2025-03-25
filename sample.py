import os
import torch
import torch.distributed as dist
from transformers import AutoTokenizer, CLIPImageProcessor, LlavaForConditionalGeneration, TrainingArguments, Trainer, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training
import json
from PIL import Image
from torch.utils.data import Dataset
from torchvision.transforms import Compose, Resize, ToTensor
from datetime import timedelta

# Initialize distributed environment
local_rank = int(os.environ["LOCAL_RANK"])
world_size = int(os.environ["WORLD_SIZE"])
if local_rank == 0:
    print(f"Rank {local_rank}: Starting process, world_size={world_size}")
dist.init_process_group(backend="nccl", timeout=timedelta(seconds=1800))
torch.cuda.set_device(local_rank)
if local_rank == 0:
    print(f"Rank {local_rank}: DDP initialized, device set to {local_rank}")

output_dir = "./llava-clothing"
json_dir = "/scratch/st-mponga1-1/amybchoi/IGEN330_script/to_sockeye"  # Where train.json, val.json, test.json live
img_dir = "/arc/project/st-mponga1-1/amybchoi/IGEN330_DATA"  # Where images_folder lives
if local_rank == 0:
    os.makedirs(output_dir, exist_ok=True)
    print(f"Rank {local_rank}: Output directory: {output_dir}")

model_name = "liuhaotian/llava-v1.5-7b"
if local_rank == 0:
    print(f"Rank {local_rank}: Loading tokenizer from {model_name}")
processor = AutoTokenizer.from_pretrained(model_name, use_fast=False)
image_processor = CLIPImageProcessor.from_pretrained(
    "openai/clip-vit-large-patch14-336",
    size={"height": 336, "width": 336},
    do_rescale=False
)

image_token = "<image>"
if image_token not in processor.special_tokens_map.get("additional_special_tokens", []):
    processor.add_tokens([image_token])
    if local_rank == 0:
        print(f"Rank {local_rank}: Added {image_token} to tokenizer. New vocab size: {len(processor)}")

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True
)

if local_rank == 0:
    print(f"Rank {local_rank}: Loading model {model_name} with 4-bit quantization...")
model = LlavaForConditionalGeneration.from_pretrained(
    model_name,
    quantization_config=bnb_config,
    torch_dtype=torch.float16,
    device_map={"": local_rank}
)
if local_rank == 0:
    print(f"Rank {local_rank}: Model loaded, resizing embeddings...")
model.resize_token_embeddings(len(processor))

if local_rank == 0:
    print(f"Rank {local_rank}: Preparing model for k-bit training...")
model = prepare_model_for_kbit_training(model, use_gradient_checkpointing=False)

lora_config = LoraConfig(
    r=8,
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

if local_rank == 0:
    print(f"Rank {local_rank}: Applying LoRA configuration...")
model = get_peft_model(model, lora_config)
if local_rank == 0:
    model.print_trainable_parameters()

for i in range(torch.cuda.device_count()):
    if local_rank == i:
        print(f"Rank {local_rank}: GPU {i} after model load: {torch.cuda.memory_allocated(i) / 1024**3:.2f} GiB allocated, "
              f"{torch.cuda.memory_reserved(i) / 1024**3:.2f} GiB reserved")

torch.cuda.empty_cache()
import gc
gc.collect()

# Load datasets
train_json_path = os.path.join(json_dir, "train.json")
val_json_path = os.path.join(json_dir, "val.json")
test_json_path = os.path.join(json_dir, "test.json")

if local_rank == 0:
    print(f"Rank {local_rank}: Checking file access...")
    for path in [train_json_path, val_json_path, test_json_path]:
        print(f"Rank {local_rank}: {path} exists: {os.path.exists(path)}, readable: {os.access(path, os.R_OK)}")

if local_rank == 0:
    print(f"Rank {local_rank}: Loading train.json from {train_json_path}")
try:
    with open(train_json_path, "r") as f:
        train_data = json.load(f)
    if local_rank == 0:
        print(f"Rank {local_rank}: Loaded {len(train_data)} entries from train.json")
except Exception as e:
    if local_rank == 0:
        print(f"Rank {local_rank}: Failed to load train.json: {str(e)}")
    raise

if local_rank == 0:
    print(f"Rank {local_rank}: Loading val.json from {val_json_path}")
try:
    with open(val_json_path, "r") as f:
        val_data = json.load(f)
    if local_rank == 0:
        print(f"Rank {local_rank}: Loaded {len(val_data)} entries from val.json")
except Exception as e:
    if local_rank == 0:
        print(f"Rank {local_rank}: Failed to load val.json: {str(e)}")
    raise

if local_rank == 0:
    print(f"Rank {local_rank}: Loading test.json from {test_json_path}")
try:
    with open(test_json_path, "r") as f:
        test_data = json.load(f)
    if local_rank == 0:
        print(f"Rank {local_rank}: Loaded {len(test_data)} entries from test.json")
except Exception as e:
    if local_rank == 0:
        print(f"Rank {local_rank}: Failed to load test.json: {str(e)}")
    raise

class ClothingDataset(Dataset):
    def __init__(self, dataset):
        self.dataset = dataset
        self.skipped = 0
        if local_rank == 0:
            print(f"Rank {local_rank}: Initialized dataset with {len(dataset)} entries")

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        try:
            return preprocess_data(self.dataset[idx])
        except Exception as e:
            if local_rank == 0:
                print(f"Rank {local_rank}: Skipped sample {idx}: {str(e)}")
            self.skipped += 1
            return self.__getitem__((idx + 1) % len(self.dataset))

train_dataset = ClothingDataset(train_data)
if local_rank == 0:
    print(f"Rank {local_rank}: Train dataset size: {len(train_dataset)}, skipped: {train_dataset.skipped}")
val_dataset = ClothingDataset(val_data)
test_dataset = ClothingDataset(test_data)
if local_rank == 0:
    print(f"Rank {local_rank}: Test dataset size: {len(test_dataset)}, skipped: {test_dataset.skipped}")

img_folder = os.path.join(img_dir, "images_folder")
if local_rank == 0:
    print(f"Rank {local_rank}: Image folder: {img_folder}, exists: {os.path.exists(img_folder)}")

transform = Compose([
    Resize((336, 336)),
    ToTensor(),
])

def preprocess_data(example):
    image_file = example["image_file"]
    image_path = os.path.join(img_folder, image_file)
    image = Image.open(image_path).convert("RGB")
    image = transform(image)
    image_inputs = image_processor(image, return_tensors="pt")
    metadata = example["text"]
    prompt = (
        f"{image_token} Describe this clothing item:\n{metadata}\n"
        f"Recommend an outfit using this item for a casual day out:"
    )
    target = "Pair this with blue jeans and white sneakers for a casual day out."
    text_inputs = processor(
        prompt,
        padding="max_length",
        truncation=True,
        max_length=256,
        return_tensors="pt"
    )
    target_inputs = processor(
        target,
        padding="max_length",
        truncation=True,
        max_length=256,
        return_tensors="pt"
    )
    inputs = {
        "pixel_values": image_inputs["pixel_values"].squeeze(0),
        "input_ids": text_inputs["input_ids"].squeeze(0),
        "attention_mask": text_inputs["attention_mask"].squeeze(0),
        "labels": target_inputs["input_ids"].squeeze(0),
    }
    return inputs

def collate_fn(batch):
    return {
        "pixel_values": torch.stack([item["pixel_values"] for item in batch]),
        "input_ids": torch.stack([item["input_ids"] for item in batch]),
        "attention_mask": torch.stack([item["attention_mask"] for item in batch]),
        "labels": torch.stack([item["labels"] for item in batch]),
    }

training_args = TrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=1,
    gradient_accumulation_steps=4,
    num_train_epochs=5,
    learning_rate=2e-4,
    warmup_steps=50,
    weight_decay=0.01,
    fp16=True,
    save_steps=200,
    save_total_limit=2,
    eval_strategy="epoch",
    logging_steps=20,
    logging_dir="./logs",
    report_to="tensorboard",
    dataloader_pin_memory=True,
    dataloader_drop_last=True,
    max_grad_norm=1.0,
    gradient_checkpointing=False,
)

if local_rank == 0:
    print(f"Rank {local_rank}: Initializing Trainer...")
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=val_dataset,
    data_collator=collate_fn
)

for i in range(torch.cuda.device_count()):
    if local_rank == i:
        print(f"Rank {local_rank}: GPU {i} before training: {torch.cuda.memory_allocated(i) / 1024**3:.2f} GiB allocated, "
              f"{torch.cuda.memory_reserved(i) / 1024**3:.2f} GiB reserved")

if local_rank == 0:
    print(f"Rank {local_rank}: Starting training...")
trainer.train()

if local_rank == 0:
    model.save_pretrained("llava-clothing-qlora-v1")
    processor.save_pretrained("llava-clothing-qlora-v1")
    print(f"Rank {local_rank}: Fine-tuned adapters saved to llava-clothing-qlora-v1")

    print(f"Rank {local_rank}: Starting testing on single GPU...")
    dist.destroy_process_group()
    model.eval()
    try:
        test_results = trainer.evaluate(test_dataset)
        print(f"Rank {local_rank}: Test results: {test_results}")
    except Exception as e:
        print(f"Rank {local_rank}: Testing failed with error: {str(e)}")
else:
    dist.destroy_process_group()

torch.cuda.empty_cache()
if local_rank == 0:
    print(f"Rank {local_rank}: GPU memory cleared.")