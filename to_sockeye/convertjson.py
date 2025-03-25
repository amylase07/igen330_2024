import os
import json

# Define dataset folder paths
text_folder = "./IGEN330_DATA/txt_folder"
image_folder = "./IGEN330_DATA/images_folder"  # Assuming images are stored in this folder
output_json = "dataset.json"

# List to store formatted entries
dataset = []

# Iterate over text files
for txt_file in os.listdir(text_folder):
    if txt_file.endswith(".txt"):
        txt_path = os.path.join(text_folder, txt_file)
        
        # Read text content and parse attributes
        attributes = {}
        with open(txt_path, "r", encoding="utf-8") as file:
            for line in file:
                key, value = line.strip().split(": ", 1)
                attributes[key] = value

        # Check if corresponding image exists
        image_filename = f"{attributes['id']}.jpg"
        image_path = os.path.join(image_folder, image_filename)
        
        if not os.path.exists(image_path):
            print(f"Skipping {txt_file}: No corresponding image found for ID {attributes['id']}")
            continue  # Skip this text file if the image doesn't exist

        # Construct JSON structure
        entry = {
            "image": image_filename,
            "text": attributes["productDisplayName"],
            "attributes": {
                "type": attributes["articleType"],
                "color": attributes["baseColour"],
                "season": attributes["season"],
                "usage": attributes["usage"],
                "gender": attributes["gender"],
                "category": attributes["masterCategory"],
                "subCategory": attributes["sub"]
            }
        }

        # Add entry to dataset list
        dataset.append(entry)

# Save dataset as JSON file
with open(output_json, "w", encoding="utf-8") as json_file:
    json.dump(dataset, json_file, indent=4)

print(f"JSON file saved: {output_json}")