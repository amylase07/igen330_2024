#Author: Heidi Leung
#Purpose: generate two prepared clothing datasets for IGEN330 DAID; one for men, one for women
####### each prepared dataset (.json) should hold 20 items
#Use Instruction: run python gen_preset.py in terminal

import json
import random

# Constants
TOTAL_ITEMS = 20
MAX_TOPWEAR = 7
MAX_BOTTOMWEAR = 7
INITIAL_MAX_PER_TYPE = 2
FALLBACK_MAX_PER_TYPE = 3
INITIAL_MAX_SEASON = 7
FALLBACK_MAX_SEASON = 8
INITIAL_MAX_USAGE = 7
FALLBACK_MAX_USAGE = 8

# Allowed values
ALLOWED_TYPES = {'Shirts', 'Jeans', 'Track Pants', 'Tshirts', 'Tops', 'Sweatshirts', 
        'Waistcoat', 'Shorts', 'Innerwear Vests', 'Rain Jacket', 'Dresses', 
        'Night suits', 'Skirts', 'Blazers', 'Shrug', 'Camisoles', 'Capris', 
        'Tunics', 'Jackets', 'Lounge Pants', 'Sweaters', 'Tracksuits', 
        'Swimwear', 'Nightdress', 'Leggings', 'Jumpsuit', 'Suspenders', 
        'Stockings', 'Kurtas', 'Tights', 'Lounge Tshirts', 'Lounge Shorts', 
        'Shapewear', 'Jeggings', 'Rompers', 'Belts', 'Kurtis', 
        'Rain Trousers', 'Suits'}
#should we remove some of these tags?

ALLOWED_SUBCATEGORIES = {'Topwear', 'Bottomwear', 'Innerwear', 'Dress', 'Loungewear and Nightwear'}
ALLOWED_SEASONS = {'Fall', 'Summer', 'Winter', 'Spring'}
ALLOWED_USAGES = {'Casual', 'Formal', 'Sports', 'NA', 'Smart Casual', 'Party', 'Travel'}

DEFAULT_USAGE = "Casual"  
DEFAULT_SEASON = "Summer"  
DEFAULT_TYPE = "Tshirts"  
DEFAULT_SUBCATEGORY = "Topwear"  

def load_dataset(filename):
    with open(filename, "r", encoding="utf-8") as file:
        return json.load(file)

def filter_items(items, max_per_usage, max_per_season, max_per_type, max_topwear, max_bottomwear, total_required):
    random.shuffle(items)
    
    usage_counts = {usage: 0 for usage in ALLOWED_USAGES}
    season_counts = {season: 0 for season in ALLOWED_SEASONS}
    type_counts = {atype: 0 for atype in ALLOWED_TYPES}
    subcategory_counts = {sub: 0 for sub in ALLOWED_SUBCATEGORIES}
    
    filtered_items = []
    
    for item in items:
        if len(filtered_items) >= total_required:
            break
        
        attributes = item.get("attributes", {})

        usage = attributes.get("usage", DEFAULT_USAGE)
        season = attributes.get("season", DEFAULT_SEASON)
        item_type = attributes.get("type", DEFAULT_TYPE)
        subcategory = attributes.get("subCategory", DEFAULT_SUBCATEGORY)

        if usage not in ALLOWED_USAGES:
            usage = DEFAULT_USAGE
        if season not in ALLOWED_SEASONS:
            season = DEFAULT_SEASON
        if item_type not in ALLOWED_TYPES:
            item_type = DEFAULT_TYPE
        if subcategory not in ALLOWED_SUBCATEGORIES:
            subcategory = DEFAULT_SUBCATEGORY

        if usage_counts[usage] >= max_per_usage:
            continue
        if season_counts[season] >= max_per_season:
            continue
        if type_counts[item_type] >= max_per_type:
            continue
        if subcategory_counts[subcategory] >= (MAX_TOPWEAR if subcategory == "Topwear" else MAX_BOTTOMWEAR):
            continue

        filtered_items.append(item)
        usage_counts[usage] += 1
        season_counts[season] += 1
        type_counts[item_type] += 1
        subcategory_counts[subcategory] += 1

    return filtered_items

def filter_by_gender(items, gender):
    gender_filtered = [item for item in items if item.get("attributes", {}).get("gender") == gender]

    # Step 1: Apply initial filtering (strict)
    filtered_items = filter_items(
        gender_filtered,
        max_per_usage=INITIAL_MAX_USAGE,
        max_per_season=INITIAL_MAX_SEASON,
        max_per_type=INITIAL_MAX_PER_TYPE,
        max_topwear=MAX_TOPWEAR,
        max_bottomwear=MAX_BOTTOMWEAR,
        total_required=TOTAL_ITEMS
    )

    # Step 2: If < 20 items, allow up to 3 per type
    if len(filtered_items) < TOTAL_ITEMS:
        filtered_items = filter_items(
            gender_filtered,
            max_per_usage=INITIAL_MAX_USAGE,
            max_per_season=INITIAL_MAX_SEASON,
            max_per_type=FALLBACK_MAX_PER_TYPE,
            max_topwear=MAX_TOPWEAR,
            max_bottomwear=MAX_BOTTOMWEAR,
            total_required=TOTAL_ITEMS
        )

    # Step 3: If < 20 items, increase max_season to 8
    if len(filtered_items) < TOTAL_ITEMS:
        filtered_items = filter_items(
            gender_filtered,
            max_per_usage=INITIAL_MAX_USAGE,
            max_per_season=FALLBACK_MAX_SEASON,
            max_per_type=FALLBACK_MAX_PER_TYPE,
            max_topwear=MAX_TOPWEAR,
            max_bottomwear=MAX_BOTTOMWEAR,
            total_required=TOTAL_ITEMS
        )

    # Step 4: If < 20 items, increase max_usage to 8
    if len(filtered_items) < TOTAL_ITEMS:
        filtered_items = filter_items(
            gender_filtered,
            max_per_usage=FALLBACK_MAX_USAGE,
            max_per_season=FALLBACK_MAX_SEASON,
            max_per_type=FALLBACK_MAX_PER_TYPE,
            max_topwear=MAX_TOPWEAR,
            max_bottomwear=MAX_BOTTOMWEAR,
            total_required=TOTAL_ITEMS
        )

    # Step 5: Ensure we still respect the max_per_type limit at 3
    type_counts = {}
    final_filtered = []
    for item in filtered_items:
        item_type = item.get("attributes", {}).get("type", DEFAULT_TYPE)
        if type_counts.get(item_type, 0) < FALLBACK_MAX_PER_TYPE:
            final_filtered.append(item)
            type_counts[item_type] = type_counts.get(item_type, 0) + 1

    return final_filtered[:TOTAL_ITEMS]  # Ensure exactly 20 items

def save_to_json(data, filename):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, indent=4)

if __name__ == "__main__":
    dataset_file = "dataset.json"
    clothing_items = load_dataset(dataset_file)
    
    women_clothing = filter_by_gender(clothing_items, "Women")
    men_clothing = filter_by_gender(clothing_items, "Men")
    
    save_to_json(women_clothing, "women_preset.json")
    save_to_json(men_clothing, "men_preset.json")
    
    print(f"Generated {len(women_clothing)} women's clothing items in women_preset.json")
    print(f"Generated {len(men_clothing)} men's clothing items in men_preset.json")