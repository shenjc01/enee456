# ENEE456 Extra Credit Project - Visual Cryptography

This project implements a (2,2) visual cryptography scheme that splits a black-and-white image into two secure shares. Each share alone reveals nothing. When overlaid, the original image becomes visible to the human eye.

## How it works
- Each pixel is expanded into a 2×2 block in both shares.
- White pixels use identical blocks; black pixels use complementary blocks.
- The shares are visually combined to reconstruct the image.

## Tools Used
- Python
- NumPy
- Pillow (PIL)

## Running the Code
1. Put your input image in `input_images/sample.png` (black-and-white PNG).
2. Run: `src/visual_crypto.py`
3. Shares and output will be in `output_shares/`.

## Output
- `share1.png`
- `share2.png`
- `reconstructed.png` (overlay result)
