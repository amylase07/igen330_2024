import numpy as np
from PIL import Image
import matplotlib.pyplot as plt

def determine_weather_suitability(image):
    """
    Determines whether a shirt is suitable for warm or cold weather based on sleeve length.
    Assumes 'shirt' category (label = 6).
    """
    # Resize and convert to grayscale
    img = Image.fromarray(image.numpy().squeeze() * 255).convert('L')
    img_resized = img.resize((28, 28))  # Normalize to fixed size
    img_array = np.array(img_resized)

    # Threshold the image (simple binary segmentation)
    threshold = 100
    binary_image = (img_array > threshold).astype(np.uint8)

    # Calculate sleeve length based on pixel distribution
    vertical_sum = binary_image.sum(axis=1)
    sleeve_length = vertical_sum[:14].sum()  # Analyze top half of the image

    # Rule-based heuristic for weather suitability
    if sleeve_length > 100:  # Arbitrary threshold for "long sleeves"
        return "cold"
    else:
        return "warm"

# # Example: Annotate shirts in the dataset
# annotated_data = []
# for img, label in fashion_mnist:
#     if label == 6:  # Shirt category
#         weather_label = determine_weather_suitability(img)
#     else:
#         weather_label = weather_mapping[label]
#     annotated_data.append((img, label, weather_label))
