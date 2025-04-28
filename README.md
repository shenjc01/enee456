# Visual Cryptography Web App

This project implements a simple and intuitive **Visual Cryptography Generator**, allowing users to upload an image, choose between **Black-and-White** or **Color** encryption modes, and generate secure **shares** that reveal the secret image only when stacked.

Built fully with **HTML**, **CSS**, and **JavaScript**, and hosted using **GitHub Pages**.

## 🚀 Live Demo

👉 [Click here to try it out!](https://shenjc01.github.io/visual_cryptography_/)  

## 🎯 Features

- **Upload your own image** (JPEG, PNG supported)
- **Choose encryption mode**:
  - **Black-and-White** Visual Cryptography (using pixel expansion and random patterns)
  - **Color** Visual Cryptography (using random share generation and modular addition)
- **Instantly view**:
  - Share 1
  - Share 2
  - Reconstructed original image
- **Download** the generated shares
- **Responsive, clean, and modern** interface
- Fully **client-side** (no server needed, 100% privacy)

## 🛠️ How It Works

- In **Black-and-White mode**:
  - Image is binarized.
  - Each pixel is expanded into a 2×2 pattern using random or complementary patterns.
- In **Color mode**:
  - Share 1 is random noise.
  - Share 2 is generated such that (Share1 + Share2) mod 256 reconstructs the original RGB pixel values.


