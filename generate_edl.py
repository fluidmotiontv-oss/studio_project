import csv
import os

csv_path = "/home/tim/studio_project/master_media_inventory.csv"
output_edl = "/home/tim/Videos/fluid_motion_sequence.edl"

clips = []
if os.path.exists(csv_path):
    with open(csv_path, mode='r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            # Match MP4 media files
            file_path = row.get('File Path') or row.get('path') or row.get('File') or ''
            if file_path.endswith('.mp4') and os.path.exists(file_path):
                clips.append(file_path)

print(f"[*] Found {len(clips)} MP4 clips for EDL generation.")

edl_lines = [
    "TITLE: FLUID_MOTION_MASTER_TIMELINE",
    "FCM: NON-DROP FRAME\n"
]

# Standard 30fps timecode helper (5 seconds per clip = 150 frames)
def frames_to_tc(total_frames):
    fps = 30
    h = total_frames // (3000 * 30)
    m = (total_frames // 1800) % 60
    s = (total_frames // 30) % 60
    f = total_frames % 30
    return f"{h:02d}:{m:02d}:{s:02d}:{f:02d}"

current_record_frame = 0
clip_duration_frames = 150 # 5-second preview cut per clip

for idx, clip in enumerate(clips, start=1):
    reel_name = f"AX{idx:03d}"
    src_in = "00:00:00:00"
    src_out = frames_to_tc(clip_duration_frames)
    
    rec_in = frames_to_tc(current_record_frame)
    current_record_frame += clip_duration_frames
    rec_out = frames_to_tc(current_record_frame)

    # Format: Event# Reel Track Edit In Out RecordIn RecordOut
    edl_lines.append(f"{idx:03d}  {reel_name}  V     C        {src_in} {src_out} {rec_in} {rec_out}")
    edl_lines.append(f"* FROM CLIP: {os.path.basename(clip)}")
    edl_lines.append(f"* FILE PATH: {clip}\n")

with open(output_edl, "w", encoding="utf-8") as f:
    f.write("\n".join(edl_lines))

print(f"[✓] Successfully generated CMX3600 EDL: {output_edl}")
