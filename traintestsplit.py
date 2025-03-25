import os
import random
import json
from sklearn.model_selection import train_test_split

# Define paths
text_folder = "/mnt/d/IGEN330_DATA/txt_folder_new"
image_folder = "/mnt/d/IGEN330_DATA/images_folder"
output_folder = "./dataset"

# Create output folder if it doesn't exist
os.makedirs(output_folder, exist_ok=True)

# Get all .txt and .jpeg files
txt_files = [f for f in os.listdir(text_folder) if f.endswith(".txt")]
jpg_files = [f for f in os.listdir(image_folder) if f.endswith(".jpg")]

# Debugging: Print the lists of files
print(f"Found {len(txt_files)} .txt files: {txt_files}")
print(f"Found {len(jpg_files)} .jpg files: {jpg_files}")

# Ensure matching .txt and .jpeg files
file_pairs = []
for txt_file in txt_files:
    jpg_file = txt_file.replace(".txt", ".jpg")
    if jpg_file in jpg_files:
        file_pairs.append((txt_file, jpg_file))
        print(file_pairs[0])

# Debugging: Print the list of file pairs
print(f"Found {len(file_pairs)} matching pairs: {file_pairs}")

# Check if any pairs were found
if len(file_pairs) == 0:
    raise ValueError("No matching pairs of .txt and .jpeg files found. Check your folders and filenames.")

# Shuffle the pairs
random.shuffle(file_pairs)

# Split into train, validation, and test sets
train_pairs, test_pairs = train_test_split(file_pairs, test_size=0.2, random_state=42)  # 80% train, 20% test
val_pairs, test_pairs = train_test_split(test_pairs, test_size=0.5, random_state=42)    # 10% validation, 10% test

# Save the splits
def save_split(split_name, pairs):
    split_data = []
    for txt_file, jpeg_file in pairs:
        # Read text content
        txt_path = os.path.join(text_folder, txt_file)
        if not os.path.exists(txt_path):
            print(f"Warning: {txt_path} does not exist. Skipping.")
            continue
        with open(txt_path, "r") as f:
            text_content = f.read()

        # Append data
        split_data.append({
            "text_file": txt_file,
            "image_file": jpeg_file,
            "text": text_content,
        })

    # Save to JSON
    output_path = os.path.join(output_folder, f"{split_name}.json")
    with open(output_path, "w") as f:
        json.dump(split_data, f, indent=4)
    print(f"Saved {len(split_data)} pairs to {output_path}")

save_split("train", train_pairs)
save_split("val", val_pairs)
save_split("test", test_pairs)

print("Dataset split and saved successfully!")