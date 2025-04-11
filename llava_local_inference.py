import os
import sys
from PIL import Image
import torch
import json
import random

os.environ["PYTORCH_CUDA_ALLOC_CONF"] = "expandable_segments:True"

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from llava.model.builder import load_pretrained_model
from llava.mm_utils import get_model_name_from_path, process_images, tokenizer_image_token
from llava.constants import IMAGE_TOKEN_INDEX, DEFAULT_IMAGE_TOKEN
from llava.conversation import conv_templates, SeparatorStyle

MODEL_BASE_PATH = "./llava-1.5v-7b"
MODEL_NAME = "liuhaotian/llava-v1.5-7b"
LOCAL_MODEL_PATH = os.path.join(MODEL_BASE_PATH, MODEL_NAME)
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
OUTPUT_FORMAT = "text: \"id: {id}\ngender: {gender}\nmasterCategory: Apparel\nsub: {sub}\narticleType: {articleType}\nbaseColour: {baseColour}\nseason: {season}\nusage: {usage}\nproductDisplayName: {productDisplayName}\n\""

img_dir = "/mnt/d/IGEN330_DATA/images_folder"

tokenizer = None
model = None
image_processor = None
women_preset = os.path.join("./igen330_2024", "women_preset.json")
men_preset = os.path.join("./igen330_2024", "men_preset.json")

def load_model():
    global tokenizer, model, image_processor
    if model is None:
        print("Loading LLaVA model from local path...")
        tokenizer, model, image_processor, _ = load_pretrained_model(
            model_path=MODEL_NAME,
            model_base=None,
            model_name=get_model_name_from_path(LOCAL_MODEL_PATH),
            load_4bit=True,
            device=DEVICE,
            torch_dtype=torch.float16,
        )
        model.eval()
        print("Model loaded successfully.")

def describe_clothing(image_path, clothing_id):
    load_model()
    
    # if gender == "women" or gender == "female":
    #     with open(women_preset, "r") as f:
    #         closet = json.load(f)
    # elif gender == "men" or gender == "male":
    #     with open(men_preset, "r") as f:
    #         closet = json.load(f)
    # else:
    #     print("The input gender unsupported or not specified. Random sample from closet.")
    #     with open("val.json", "r") as f:
    #         preset_closet = json.load(f)
    #         closet = random.sample([item["text"] for item in preset_closet], 20)

    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
    image = Image.open(image_path).convert("RGB")
    image_tensor = process_images([image], image_processor, model.config).to(DEVICE).to(torch.float16)
    
    if image_tensor.dim() == 3:
        image_tensor = image_tensor.unsqueeze(0)
    print("Image tensor shape:", image_tensor.shape)
    print("Image tensor dtype:", image_tensor.dtype)

    conv = conv_templates["v1"].copy()
    conv.append_message(conv.roles[0], DEFAULT_IMAGE_TOKEN + "\n" + (
        f"Describe the clothing in this image in this exact format:\n"
        f"id: {clothing_id}\nmasterCategory: Apparel\n"
        f"sub: [Topwear/Bottomwear/Footwear/etc.]\narticleType: [Shirt/Jeans/Dress/etc.]\n"
        f"baseColour: [color]\nseason: [Spring/Summer/Fall/Winter]\n"
        f"usage: [Casual/Formal/Sports]\nproductDisplayName: [Short clothing description]"
    ))
    conv.append_message(conv.roles[1], None)
    prompt = conv.get_prompt()
    input_ids = tokenizer_image_token(prompt, tokenizer, IMAGE_TOKEN_INDEX, return_tensors="pt")
    
    if input_ids is None:
        raise ValueError("tokenizer_image_token returned None")
    input_ids = input_ids.unsqueeze(0).to(DEVICE)
    print("Tokenized Input IDs:", input_ids.tolist()[0])
    print("Input IDs shape:", input_ids.shape)

    with torch.no_grad():
        output_ids = model.generate(
            inputs=input_ids,
            images=image_tensor,
            max_new_tokens=2048,
            do_sample=False,
        )

    description = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(f"Raw model output: {description}")

    if "id:" in description:
        lines = description.split("\n")
        fields = {line.split(":")[0].strip(): line.split(":")[1].strip() for line in lines if ":" in line}
        formatted_description = OUTPUT_FORMAT.format(
            id=clothing_id,
            gender=fields.get("gender", "Unknown"),
            sub=fields.get("sub", "Unknown"),
            articleType=fields.get("articleType", "Unknown"),
            baseColour=fields.get("baseColour", "Unknown"),
            season=fields.get("season", "Unknown"),
            usage=fields.get("usage", "Unknown"),
            productDisplayName=fields.get("productDisplayName", "Unknown Clothing")
        )
    else:
        print("Warning: Model did not produce structured output.")
        formatted_description = OUTPUT_FORMAT.format(
            id=clothing_id,
            gender="Unknown",
            sub="Unknown",
            articleType="Unknown",
            baseColour="Unknown",
            season="Unknown",
            usage="Unknown",
            productDisplayName="Unknown Clothing"
        )
    return formatted_description

def describe_clothing_in_sentence(image_path):
    load_model()
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image not found at {image_path}")
    image = Image.open(image_path).convert("RGB")
    image_tensor = process_images([image], image_processor, model.config).to(DEVICE).to(torch.float16)
    
    if image_tensor.dim() == 3:
        image_tensor = image_tensor.unsqueeze(0)
    print("Image tensor shape:", image_tensor.shape)
    print("Image tensor dtype:", image_tensor.dtype)

    conv = conv_templates["v1"].copy()
    conv.append_message(conv.roles[0], DEFAULT_IMAGE_TOKEN + "\nDescribe the clothing in this image in detail.")
    conv.append_message(conv.roles[1], None)
    prompt = conv.get_prompt()
    input_ids = tokenizer_image_token(prompt, tokenizer, IMAGE_TOKEN_INDEX, return_tensors="pt")
    
    if input_ids is None:
        raise ValueError("tokenizer_image_token returned None")
    input_ids = input_ids.unsqueeze(0).to(DEVICE)
    print("Tokenized Input IDs:", input_ids.tolist()[0])

    with torch.no_grad():
        output_ids = model.generate(
            inputs=input_ids,
            images=image_tensor,
            max_new_tokens=2048,
            do_sample=False,
        )

    sentence_description = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(f"Raw model output (sentence): {sentence_description}")
    return sentence_description

def combine_descriptions(formatted, sentence_description):
    if "productDisplayName:" in formatted:
        lines = formatted.split("\n")
        for i, line in enumerate(lines):
            if line.startswith("productDisplayName:"):
                lines[i] = f"productDisplayName: {sentence_description}"
        return "\n".join(lines)
    return formatted

def recommend_outfit(weather, occasion, gender):
    load_model()

    if gender == "women" or gender == "female":
        with open(women_preset, "r") as f:
            closet = json.load(f)
    elif gender == "men" or gender == "male":
        with open(men_preset, "r") as f:
            closet = json.load(f)
    else:
        print("The input gender unsupported or not specified. Random sample from closet.")
        with open("val.json", "r") as f:
            preset_closet = json.load(f)
            closet = random.sample([item["text"] for item in preset_closet], 20)
    
    if not closet:
        print("Closet is empty - returning default response.")
        return "Closet is empty.", ""
    
    if isinstance(closet[0], dict):
        if "text" in closet[0]:
            closet_str = "\n".join(item["text"] for item in closet)
        else:
            closet_str = "\n".join(
                f"id: {item.get('id', 'unknown')}\ngender: {item.get('gender', 'Unknown')}\n"
                f"sub: {item.get('sub', 'Unknown')}\narticleType: {item.get('articleType', 'Unknown')}\n"
                f"baseColour: {item.get('baseColour', 'Unknown')}"
                for item in closet
            )
    else:
        closet_str = "\n".join(closet)
    
    print("Closet contents:")
    print(closet_str)
    
    prompt = (
        f"Based on these closet items:\n{closet_str}\n"
        f"Recommend an outfit for {weather} weather, {occasion} occasion, {gender} gender. "
        f"Format your response exactly like this:\n"
        f"Outfit: [describe the outfit here]\n"
        f"prompt: [Stable Diffusion prompt to visualize the outfit]"
    )
    print("Prompt for outfit recommendation:")
    print(prompt)
    
    input_ids = tokenizer(prompt, return_tensors="pt").input_ids.to(DEVICE)
    print("Input IDs shape (recommend):", input_ids.shape)
    print("Tokenized Input IDs:", input_ids.tolist()[0])
    
    with torch.no_grad():
        output_ids = model.generate(
            inputs=input_ids,
            max_new_tokens=2048,
            do_sample=True,
            temperature=0.7,
            top_p=0.9,
            images=None
        )
    
    recommendation = tokenizer.decode(output_ids[0], skip_special_tokens=True)
    print(f"Full recommendation (raw output): {recommendation}")
    
    if prompt in recommendation:
        recommendation = recommendation.replace(prompt, "").strip()
    
    if "Outfit:" in recommendation and "prompt:" in recommendation:
        outfit_part, prompt_part = recommendation.split("prompt:", 1)
        outfit = outfit_part.replace("Outfit:", "").strip()
        stable_diffusion_prompt = prompt_part.strip()
    else:
        print("Warning: Model did not follow the expected format.")
        outfit = recommendation if recommendation else "No outfit recommended."
        stable_diffusion_prompt = "No Stable Diffusion prompt generated."
    
    return outfit, stable_diffusion_prompt

def main():
    load_model()
    
    clothing_ids = ["custom_inference_001", "custom_inference_002"]
    image_paths = [os.path.join(img_dir, f"{cid}.jpg") for cid in clothing_ids]
    
    combined_clothing_descriptions = []
    
    for clothing_id, image_path in zip(clothing_ids, image_paths):
        formatted_description = describe_clothing(image_path, clothing_id, gender="women")
        sentence_description = describe_clothing_in_sentence(image_path)
        final_description = combine_descriptions(formatted_description, sentence_description)
        combined_clothing_descriptions.append(final_description)
        print(f"\nFinal Description for {clothing_id}:\n{final_description}\n")
        torch.cuda.empty_cache()

    weather, occasion, gender = "sunny", "casual", "female"
    outfit, stable_diffusion_prompt = recommend_outfit(weather, occasion, gender)
    print("\nOutfit Recommendation:\n", outfit)
    print("\nStable Diffusion Prompt:\n", stable_diffusion_prompt)

if __name__ == "__main__":
    main()