import numpy as np
from PIL import Image
import random
import os

pattern_A = (np.array([[1, 0], [0, 1]]), np.array([[1, 0], [0, 1]]))
pattern_B = (np.array([[0, 1], [1, 0]]), np.array([[0, 1], [1, 0]]))
patterns = [pattern_A, pattern_B]

def complement(pattern):
    return 1 - pattern

def binarize_image(image_path, threshold=128):
    image = Image.open(image_path).convert('L')
    image = image.point(lambda p: 255 if p > threshold else 0)
    return np.array(image)

def generate_shares(binary_img):
    h, w = binary_img.shape
    share1 = np.zeros((h * 2, w * 2), dtype=np.uint8)
    share2 = np.zeros((h * 2, w * 2), dtype=np.uint8)

    for i in range(h):
        for j in range(w):
            pixel = binary_img[i, j]
            base_pattern = random.choice(patterns)

            if pixel == 255:  # white
                p1, p2 = base_pattern
            else:  # black
                p1, p2 = base_pattern[0], complement(base_pattern[0])

            share1[i*2:i*2+2, j*2:j*2+2] = p1 * 255
            share2[i*2:i*2+2, j*2:j*2+2] = p2 * 255

    return share1, share2

def save_share(share, filename):
    Image.fromarray(share).save(filename)

def overlay_shares(share1, share2):
    return np.minimum(share1, share2)

def visual_crypto(image_path, output_dir="output_shares"):
    os.makedirs(output_dir, exist_ok=True)
    binary_img = binarize_image(image_path)
    s1, s2 = generate_shares(binary_img)

    save_share(s1, os.path.join(output_dir, "share1.png"))
    save_share(s2, os.path.join(output_dir, "share2.png"))

    combined = overlay_shares(s1, s2)
    save_share(combined, os.path.join(output_dir, "reconstructed.png"))

    print("Done! Shares saved in", output_dir)

# Run the script
if __name__ == "__main__":
    visual_crypto("input_images/sample.jpg")
