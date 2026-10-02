"""
Dataset Downloader Module for CrowdFundAI
Downloads the legitimate public Kickstarter dataset (ks-projects-201801.csv) to data/raw/.
"""

import os
import sys
import urllib.request

DATASET_URL = "https://raw.githubusercontent.com/mganopolsky/kickstarter/master/data/ks-projects-201801.csv"
RAW_DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "raw")
RAW_DATA_PATH = os.path.join(RAW_DATA_DIR, "ks-projects-201801.csv")


def download_kickstarter_dataset(force: bool = False) -> str:
    """
    Downloads the Kickstarter 2018 dataset if not already present.
    Returns path to the downloaded dataset.
    """
    os.makedirs(RAW_DATA_DIR, exist_ok=True)

    if os.path.exists(RAW_DATA_PATH) and not force:
        print(f"Dataset already exists at: {RAW_DATA_PATH}")
        return RAW_DATA_PATH

    print(f"Downloading legitimate Kickstarter dataset from:\n{DATASET_URL}")
    print("Saving to:", RAW_DATA_PATH)

    try:
        req = urllib.request.Request(DATASET_URL, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(RAW_DATA_PATH, 'wb') as out_file:
            # Stream download
            chunk_size = 1024 * 1024
            while True:
                chunk = response.read(chunk_size)
                if not chunk:
                    break
                out_file.write(chunk)

        print(f"Download complete! File size: {os.path.getsize(RAW_DATA_PATH):,} bytes")
        return RAW_DATA_PATH
    except Exception as e:
        print(f"Error downloading dataset: {e}")
        print("\nManual Setup Instructions:")
        print("1. Download 'ks-projects-201801.csv' from Kaggle (https://www.kaggle.com/datasets/kemical/kickstarter-projects).")
        print(f"2. Place the file in: {os.path.abspath(RAW_DATA_DIR)}")
        raise e


if __name__ == "__main__":
    download_kickstarter_dataset()
