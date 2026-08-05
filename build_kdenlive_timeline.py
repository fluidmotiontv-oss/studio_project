import csv
import xml.etree.ElementTree as ET
from xml.dom import minidom
import os

csv_path = "/home/tim/studio_project/master_media_inventory.csv"
output_kdenlive = "/home/tim/Videos/fluid_motion_master_timeline.kdenlive"

clips = []
if os.path.exists(csv_path):
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Gather local mp4 video files
            file_path = row.get('File Path') or row.get('path') or row.get('File')
            if file_path and file_path.endswith('.mp4') and os.path.exists(file_path):
                clips.append(file_path)

print(f"[*] Found {len(clips)} MP4 clips to insert into Kdenlive timeline.")

# Build basic MLT / Kdenlive XML tree structure
mlt = ET.Element("mlt", version="7.0.0", producer="main_bin")
profile = ET.SubElement(mlt, "profile", frame_rate_num="30", frame_rate_den="1", width="1920", height="1080")

# Add Producers (Media Source Bin)
playlist = ET.SubElement(mlt, "playlist", id="playlist0")

for idx, clip in enumerate(clips):
    producer_id = f"producer_{idx}"
    producer = ET.SubElement(mlt, "producer", id=producer_id, in_="0", out_="150") # 5-sec default duration
    ET.SubElement(producer, "property", name="resource").text = clip
    
    # Add clip entry to main timeline track
    ET.SubElement(playlist, "entry", producer=producer_id, in_="0", out_="150")

# Format and write to file
xml_str = minidom.parseString(ET.tostring(mlt)).toprettyxml(indent="  ")
with open(output_kdenlive, "w", encoding="utf-8") as f:
    f.write(xml_str)

print(f"[✓] Created Kdenlive Project: {output_kdenlive}")
