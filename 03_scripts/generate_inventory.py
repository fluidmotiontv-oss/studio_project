import os, json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = BASE_DIR / "01_raw_assets"
CONF_DIR = BASE_DIR / "04_config"

media_files = []
for root, _, files in os.walk(RAW_DIR):
    for f in files:
        if f.lower().endswith(('.mp4', '.mov', '.avi', '.wav', '.mp3')):
            media_files.append(os.path.join(root, f))

CONF_DIR.mkdir(exist_ok=True)
inventory_path = CONF_DIR / "audit_inventory.json"

with open(inventory_path, "w") as f:
    json.dump({"media_assets": media_files}, f, indent=2)

print(f"✓ Created fresh inventory with {len(media_files)} files at: {inventory_path}")
