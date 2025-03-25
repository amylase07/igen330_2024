import os
import shutil
import json

# output_folder = "/mnt/d/IGEN330_DATA/txt_folder_new"
# txt_folder = "/mnt/d/IGEN330_DATA/txt_folder"
# img_folder = "/mnt/d/IGEN330_DATA/images_folder"

# os.makedirs(output_folder, exist_ok=True)

# # Extract IDs (filenames without extensions)
# txt_files = os.listdir(txt_folder)
# txt_ID = set([file.split(".")[0] for file in txt_files])
# jpeg_files = os.listdir(img_folder)
# jpeg_ID = set([file.split(".")[0] for file in jpeg_files])


# # Find matching IDs
# matching_ids = txt_ID.intersection(jpeg_ID)

# # Copy matched .txt files to the new folder
# for file_id in matching_ids:
#     txt_file_path = os.path.join(txt_folder, file_id + ".txt")
#     new_txt_path = os.path.join(output_folder, file_id + ".txt")
#     shutil.copy(txt_file_path, new_txt_path)

# print(f"Copied {len(matching_ids)} matched text files to {output_folder}")

train_set = "./dataset/train.json"

with open(train_set, "r") as file:
    data = json.load(file)

print(len(data))

