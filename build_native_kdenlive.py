import csv
import os
import uuid

csv_path = "/home/tim/studio_project/master_media_inventory.csv"
output_file = "/home/tim/Videos/fluid_motion_master.kdenlive"

clips = []
if os.path.exists(csv_path):
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            file_path = row.get('File Path') or row.get('path') or row.get('File') or ''
            if file_path.endswith('.mp4') and os.path.exists(file_path):
                clips.append(file_path)

print(f"[*] Found {len(clips)} MP4 files to insert into Kdenlive timeline.")

doc_uuid = str(uuid.uuid4())
fps = 30
clip_frames = 150 # 5 seconds per clip
total_frames = len(clips) * clip_frames

# Build Producers XML
producers_xml = ""
playlist_entries_xml = ""

for idx, clip_path in enumerate(clips, start=1):
    prod_id = f"producer_{idx}"
    producers_xml += f'''  <producer id="{prod_id}" in="0" out="{clip_frames - 1}">
    <property name="resource">{clip_path}</property>
    <property name="kdenlive:clipname">{os.path.basename(clip_path)}</property>
  </producer>\n'''
    playlist_entries_xml += f'  <entry producer="{prod_id}" in="0" out="{clip_frames - 1}"/>\n'

# Complete, Valid Kdenlive XML structure
kdenlive_xml = f'''<?xml version='1.0' encoding='utf-8'?>
<mlt LC_NUMERIC="C" version="7.0.0" title="Fluid Motion Master" producer="main_bin">
  <profile frame_rate_num="30" frame_rate_den="1" width="1920" height="1080" display_aspect_num="16" display_aspect_den="9" colorspace="709"/>
  
{producers_xml}
  <playlist id="main_bin">
    <property name="xml_retain">1</property>
  </playlist>

  <playlist id="playlist_v1">
{playlist_entries_xml}  </playlist>

  <tractor id="maintractor" in="0" out="{total_frames}">
    <property name="kdenlive:projectTractor">1</property>
    <track producer="playlist_v1"/>
  </tractor>

  <kdenlivedoc version="1.1" uuid="{{{doc_uuid}}}">
    <bin/>
  </kdenlivedoc>
</mlt>
'''

with open(output_file, "w", encoding="utf-8") as f:
    f.write(kdenlive_xml)

print(f"[✓] Native Kdenlive project built cleanly: {output_file}")
