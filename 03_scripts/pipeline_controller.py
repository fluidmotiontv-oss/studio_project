import json, os, random, uuid
import xml.etree.ElementTree as ET
from pathlib import Path

# --- DYNAMIC PROJECT PATHS ---
SCRIPT_DIR = Path(__file__).resolve().parent          # 03_scripts/
BASE_DIR = SCRIPT_DIR.parent                          # studio_project/

AUDIT_JSON = BASE_DIR / "04_config" / "audit_inventory.json"
OUTPUT_KDENLIVE = BASE_DIR / "05_exports" / "scenic_dawnengine_edit_v2.kdenlive"

def run_pipeline():
    print("🚀 Initializing DawnEngine Pipeline v2 Reset...")
    
    if not AUDIT_JSON.exists():
        print(f"❌ Missing catalog: {AUDIT_JSON}")
        return

    with open(AUDIT_JSON, "r") as f:
        data = json.load(f)

    # Handle dictionary structure from generate_inventory.py
    if isinstance(data, dict) and "media_assets" in data:
        all_paths = [p for p in data["media_assets"] if os.path.exists(p)]
    else:
        all_paths = []
        def extract(obj):
            if isinstance(obj, dict):
                for v in obj.values():
                    extract(v)
            elif isinstance(obj, list):
                for item in obj:
                    extract(item)
            elif isinstance(obj, str) and os.path.exists(obj):
                all_paths.append(obj)
        extract(data)

    video_clips = [p for p in set(all_paths) if p.lower().endswith(('.mp4', '.mov', '.avi'))]
    audio_clips = [p for p in set(all_paths) if p.lower().endswith(('.wav', '.mp3'))]

    print(f"✓ Verified {len(video_clips)} active video clips on disk.")
    print(f"✓ Verified {len(audio_clips)} active audio tracks on disk.")

    if not video_clips:
        print("❌ No video clips found in inventory to build timeline.")
        return

    # Root MLT Document
    root = ET.Element("mlt", {
        "LC_NUMERIC": "C",
        "version": "7.22.0",
        "title": "DawnEngine Scenic Reset"
    })

    # HD Profile
    ET.SubElement(root, "profile", {
        "description": "HD 1080p 25 fps",
        "width": "1920", "height": "1080",
        "frame_rate_num": "25", "frame_rate_den": "1",
        "display_aspect_num": "16", "display_aspect_den": "9",
        "progressive": "1", "colorspace": "709"
    })

    # Select Clips
    selected_video = random.sample(video_clips, min(40, len(video_clips)))
    selected_audio = audio_clips[0] if audio_clips else None

    # 1. Register Bin Producers & Master Playlist
    bin_playlist = ET.SubElement(root, "playlist", id="main_bin")
    
    # Audio Producer
    if selected_audio:
        prod_a = ET.SubElement(root, "producer", id="producer_audio", in_="0", out="9000")
        ET.SubElement(prod_a, "property", name="resource").text = selected_audio
        ET.SubElement(prod_a, "property", name="kdenlive:id").text = "producer_audio"
        ET.SubElement(bin_playlist, "entry", producer="producer_audio")
        print(f"✓ Selected audio master: {selected_audio}")

    # Video Producers
    for idx, clip_path in enumerate(selected_video):
        pid = f"producer_v_{idx}"
        prod_v = ET.SubElement(root, "producer", id=pid, in_="0", out="100")
        ET.SubElement(prod_v, "property", name="resource").text = clip_path
        ET.SubElement(prod_v, "property", name="kdenlive:id").text = pid
        ET.SubElement(bin_playlist, "entry", producer=pid)

    # 2. Timeline Track Playlists
    playlist_v = ET.SubElement(root, "playlist", id="playlist_video")
    for idx in range(len(selected_video)):
        ET.SubElement(playlist_v, "entry", producer=f"producer_v_{idx}", in_="0", out="99")

    playlist_a = ET.SubElement(root, "playlist", id="playlist_audio")
    if selected_audio:
        ET.SubElement(playlist_a, "entry", producer="producer_audio", in_="0", out="8999")

    # 3. Multitrack Tractor Assembly
    tractor = ET.SubElement(root, "tractor", id="maintractor")
    multitrack = ET.SubElement(tractor, "multitrack")
    ET.SubElement(multitrack, "track", producer="playlist_video")
    ET.SubElement(multitrack, "track", producer="playlist_audio")

    # Save to file
    tree = ET.ElementTree(root)
    ET.indent(tree, space="  ")
    tree.write(str(OUTPUT_KDENLIVE), encoding="utf-8", xml_declaration=True)
    print(f"🎉 New Timeline Created: {OUTPUT_KDENLIVE}")

if __name__ == "__main__":
    run_pipeline()
