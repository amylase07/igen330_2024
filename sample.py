from transformers import AutoTokenizer, CLIPImageProcessor, LlavaForConditionalGeneration, TrainingArguments, Trainer
import torch
import json
import os
from PIL import Image
from torch.utils.data import Dataset
from torchvision.transforms import Compose, Resize, ToTensor

# Create the output directory if it doesn't exist
output_dir = "./llava-clothing"
os.makedirs(output_dir, exist_ok=True)
print(f"Output directory created: {output_dir}")

# Load the pre-trained LLaVA model
model_name = "liuhaotian/llava-v1.5-7b"
processor = AutoTokenizer.from_pretrained(model_name, use_fast=False)
image_processor = CLIPImageProcessor.from_pretrained(
    "openai/clip-vit-base-patch32",
    size={"height": 336, "width": 336},  # Set the expected image size
    do_rescale=False  # Disable rescaling in the processor
)


# Load dataset
with open("dataset.json", "r") as f:
    dataset = json.load(f)

# Image folder
img_folder = "/arc/project/st-mponga1-1/amybchoi/IGEN330_DATA/images_folder"

# Define image transformations
transform = Compose([
    Resize((336, 336)),  # Resize to CLIP's expected input size (336x336)
    ToTensor(),           # Convert to tensor
])

def preprocess_data(example):
    # Load and process the image
    image_file = example["image"]
    image_path = os.path.join(img_folder, image_file)
    image = Image.open(image_path).convert("RGB")
    print(f"Original image size: {image.size}")  # Debug: Check original size
    image = transform(image)  # Apply transformations
    print(f"Resized image size: {image.shape}")  # Debug: Check resized size
    image_inputs = image_processor(image, return_tensors="pt")
    print(f"Processed image size: {image_inputs['pixel_values'].shape}")  # Debug: Check final size

    # Process text with padding and truncation
    text_inputs = processor(
        example["text"],
        padding="max_length",  # Ensure padding to max_length
        truncation=True,       # Ensure truncation to max_length
        max_length=128,        # Set max_length
        return_tensors="pt"
    )

    # Combine everything
    inputs = {
        "pixel_values": image_inputs["pixel_values"].squeeze(0),
        "input_ids": text_inputs["input_ids"].squeeze(0),
        "attention_mask": text_inputs["attention_mask"].squeeze(0),
        "labels": text_inputs["input_ids"].squeeze(0)
    }

    return inputs

class ClothingDataset(Dataset):
    def __init__(self, dataset):
        self.dataset = dataset

    def __len__(self):
        return len(self.dataset)

    def __getitem__(self, idx):
        return preprocess_data(self.dataset[idx])

train_dataset = ClothingDataset(dataset)  # Use a smaller dataset for testing

print("Dataset loaded.")

model = LlavaForConditionalGeneration.from_pretrained(model_name)

# Training setup
training_args = TrainingArguments(
    output_dir=output_dir,
    per_device_train_batch_size=1,  # Reduced batch size
    gradient_accumulation_steps=4,  # Gradient accumulation
    num_train_epochs=3,
    save_steps=100,
    save_total_limit=2,
    fp16=True,  # Enable mixed precision
)

trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
)

# Train the model
print("Starting training...")
trainer.train()

# Save the fine-tuned model
model.save_pretrained("llava-clothing-model-v1")
print("Fine-tuned model saved to llava-clothing-model-v1")

# Clear GPU memory
if torch.cuda.is_available():
    torch.cuda.empty_cache()
    print("GPU memory cleared.")