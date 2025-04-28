import numpy as np
from PIL import Image
import random
import os

def visual_crypto_color_true(image_path, output_dir="output_shares_color"):
    os.makedirs(output_dir, exist_ok=True)

    image = Image.open(image_path).convert('RGB')
    img_array = np.array(image).astype(np.int16)
    h, w, c = img_array.shape

    share1 = np.random.randint(0, 256, size=(h, w, c), dtype=np.uint8).astype(np.int16)

    share2 = (img_array - share1) % 256
    share1 = share1 % 256

    Image.fromarray(share1.astype(np.uint8)).save(os.path.join(output_dir, "color_share1.png"))
    Image.fromarray(share2.astype(np.uint8)).save(os.path.join(output_dir, "color_share2.png"))

    reconstructed = (share1 + share2) % 256
    Image.fromarray(reconstructed.astype(np.uint8)).save(os.path.join(output_dir, "color_reconstructed.png"))

    print(f"True color shares and reconstructed image saved in '{output_dir}'.")

if __name__ == "__main__":
    visual_crypto_color_true("input_images/sample.png")
