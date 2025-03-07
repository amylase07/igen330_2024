import os
import json

# Define dataset folder paths
text_folder = "./sample_data_330/text"
output_json = "sample_dataset.json"

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

        # Construct JSON structure
        entry = {
            "image": f"{attributes['id']}.jpg",
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
