#Author: Heidi Leung
#Purpose: generate two prepared clothing datasets for IGEN330 DAID; one for men, one for women
####### each prepared dataset (.json) should hold 20 items
#Use Instruction: run python gen_preset.py in terminal

import json
import random

def load_dataset(filename):
    """Loads the dataset from a JSON file."""
    with open(filename, "r", encoding = "utf-8") as file:
        return json.load(file)

def filter_by_gender(items, gender, num_items = 20):
    """Filters the dataset based on gender and selects 20 random items."""
    filtered_items = [item for item in items if item["attributes"].get("gender") == gender]
    return random.sample(filtered_items, min(num_items, len(filtered_items)))  # Ensure max 20 items

def save_to_json(data, filename):
    """Saves the filtered data to a JSON file."""
    with open(filename, "w", encoding = "utf-8") as file:
        json.dump(data, file, indent = 4)

if __name__ == "__main__":
    dataset_file = "dataset.json"
    
    # Load dataset
    clothing_items = load_dataset(dataset_file)
    
    # Filter datasets
    women_clothing = filter_by_gender(clothing_items, "Women")
    men_clothing = filter_by_gender(clothing_items, "Men")
    
    # Save filtered datasets
    save_to_json(women_clothing, "women_preset.json")
    save_to_json(men_clothing, "men_preset.json")

    print(f"Generated {len(women_clothing)} women's clothing items in women_preset.json")
    print(f"Generated {len(men_clothing)} men's clothing items in men_preset.json")
