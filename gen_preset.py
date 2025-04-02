#Author: Heidi Leung
#Purpose: generate two prepared clothing datasets for IGEN330 DAID; one for men, one for women
####### each prepared dataset (.json) should hold 20 items
#Use Instruction: run python gen_preset.py in terminal

import json
import random

# Constants
TOTAL_ITEMS = 20  #Set the number of items in the final preset file
MAX_TOPWEAR = 7
MAX_BOTTOMWEAR = 7
INITIAL_MAX_PER_TYPE = 2 
FALLBACK_MAX_PER_TYPE = 3

# Allowed types for the "type" attribute
ALLOWED_TYPES = {
    'Shirts', 'Jeans', 'Track Pants', 'Tshirts', 'Tops', 'Sweatshirts', 'Waistcoat', 'Shorts', 'Innerwear Vests', 'Rain Jacket'
}

# Allowed subCategories
ALLOWED_SUBCATEGORIES = {
    'Topwear', 'Bottomwear', 'Innerwear', 'Dress', 'Loungewear and Nightwear'
}

def load_dataset(filename):
    """Load the dataset from a JSON file."""
    with open(filename, "r", encoding = "utf-8") as file:
        return json.load(file)

def select_items(items, max_per_type, max_topwear, max_bottomwear, total_required):
    """
    Selects items while enforcing constraints:
    - No more than `max_per_type` items of the same type
    - No more than `max_topwear` items labeled "Topwear"
    - No more than `max_bottomwear` items labeled "Bottomwear"
    """
    type_groups = {atype: [] for atype in ALLOWED_TYPES}
    subcategory_counts = {"Topwear": 0, "Bottomwear": 0}
    other_items = []

    # Group items by type and subCategory
    for item in items:
        item_type = item.get("attributes", {}).get("type")
        subcategory = item.get("attributes", {}).get("subCategory")

        if item_type in ALLOWED_TYPES:
            type_groups[item_type].append(item)
        elif subcategory in ALLOWED_SUBCATEGORIES:
            other_items.append(item)

    # Shuffle for randomness
    for atype in type_groups:
        random.shuffle(type_groups[atype])
    random.shuffle(other_items)

    selected_items = []
    type_counts = {atype: 0 for atype in ALLOWED_TYPES}

    # Prioritize picking items while adhering to constraints
    while len(selected_items) < total_required:
        added_any = False
        for atype in ALLOWED_TYPES:
            if len(selected_items) >= total_required:
                break
            if type_counts[atype] < max_per_type and type_groups[atype]:
                item = type_groups[atype][0]
                subcategory = item.get("attributes", {}).get("subCategory")

                # Check Topwear/Bottomwear constraints
                if subcategory == "Topwear" and subcategory_counts["Topwear"] >= max_topwear:
                    continue
                if subcategory == "Bottomwear" and subcategory_counts["Bottomwear"] >= max_bottomwear:
                    continue

                # Select item
                selected_items.append(type_groups[atype].pop(0))
                type_counts[atype] += 1
                subcategory_counts[subcategory] = subcategory_counts.get(subcategory, 0) + 1
                added_any = True

        if not added_any:
            break  # Stop if no more items can be added without violating constraints

    # Fill remaining slots with other items
    while len(selected_items) < total_required and other_items:
        selected_items.append(other_items.pop(0))

    return selected_items

def filter_by_gender(items, gender):
    """
    Filters items for a specific gender and selects TOTAL_ITEMS:
    1. Tries with max_per_type = 2
    2. If fewer than TOTAL_ITEMS, retries with max_per_type = 3
    """
    gender_filtered = [item for item in items if item.get("attributes", {}).get("gender") == gender]

    # Attempt selection with strict per-type limit
    selected_items = select_items(
        gender_filtered, max_per_type=INITIAL_MAX_PER_TYPE,
        max_topwear=MAX_TOPWEAR, max_bottomwear=MAX_BOTTOMWEAR,
        total_required=TOTAL_ITEMS
    )

    # If not enough items, increase the type limit to 3
    if len(selected_items) < TOTAL_ITEMS:
        selected_items = select_items(
            gender_filtered, max_per_type=FALLBACK_MAX_PER_TYPE,
            max_topwear=MAX_TOPWEAR, max_bottomwear=MAX_BOTTOMWEAR,
            total_required=TOTAL_ITEMS
        )

    return selected_items

def save_to_json(data, filename):
    """Save the data to a JSON file."""
    with open(filename, "w", encoding = "utf-8") as file:
        json.dump(data, file, indent = 4)

if __name__ == "__main__":
    dataset_file = "dataset.json"
    
    # Load the dataset
    clothing_items = load_dataset(dataset_file)
    
    # Process items for each gender independently.
    # If one gender can meet the target with a limit of 2, it stays at 2.
    women_clothing = filter_by_gender(clothing_items, "Women")
    men_clothing = filter_by_gender(clothing_items, "Men")
    
    # Save results to separate JSON files
    save_to_json(women_clothing, "women_preset.json")
    save_to_json(men_clothing, "men_preset.json")
    
    print(f"Generated {len(women_clothing)} women's clothing items in women_preset.json")
    print(f"Generated {len(men_clothing)} men's clothing items in men_preset.json")
