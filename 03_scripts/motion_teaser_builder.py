import os
import subprocess
import glob

base_dir = os.path.expanduser("~/studio_project/sites")

sites = [
    {
        "name": "Holiday Park",
        "raw": os.path.join(base_dir, "holiday_park/raw_media"),
        "render": os.path.join(base_dir, "holiday_park/renders/holiday_park_revamp_teaser.mp4"),
        "title": "PORT WAIKATO HOLIDAY PARK - COASTAL RE-IMAGINED"
    },
    {
        "name": "Port Wharf Store (pee dub)",
        "raw": os.path.join(base_dir, "port_wharf_store/raw_media"),
        "render": os.path.join(base_dir, "port_wharf_store/renders/port_wharf_store_teaser.mp4"),
        "title": "PORT WHARF STORE - DIGITAL HUB & TEASER"
    }
]

for s in sites:
    print("=" * 65)
    print(f"[*] BUILDING MOTION TEASER FOR: {s['name']}")
    print("=" * 65)
    
    # Find all JPG/PNG/WEBP/MP4 files in raw_media
    image_files = sorted(glob.glob(os.path.join(s["raw"], "*.[jJ][pP][gG]")) + 
                        glob.glob(os.path.join(s["raw"], "*.[pP][nN][gG]")))
    
    os.makedirs(os.path.dirname(s["render"]), exist_ok=True)
    
    if not image_files:
        print(f"[!] No images found in {s['raw']}.")
        print(f"[*] Drop any photos or screenshots of {s['name']} in there and re-run!")
        continue

    # Convert static images into 4-second motion clips (1080p)
    motion_clips = []
    for idx, img in enumerate(image_files[:8], start=1):
        temp_clip = os.path.join(s["raw"], f"motion_{idx:02d}.mp4")
        print(f"    + Converting photo {os.path.basename(img)} to 1080p motion clip...")
        
        # FFmpeg Ken-Burns style scale/pan
        ffmpeg_cmd = [
            "ffmpeg", "-y", "-loop", "1", "-i", img,
            "-vf", "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,zoompan=z='min(zoom+0.0015,1.15)':d=120:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1920x1080",
            "-c:v", "libx264", "-t", "4", "-pix_fmt", "yuv420p", temp_clip
        ]
        subprocess.run(ffmpeg_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if os.path.exists(temp_clip):
            motion_clips.append(temp_clip)

    if motion_clips:
        print(f"[*] Stitching {len(motion_clips)} motion clips with melt-7...")
        melt_cmd = ["melt-7", "-profile", "atsc_1080p_30"]
        for mc in motion_clips:
            melt_cmd.append(mc)
        melt_cmd.extend(["-consumer", f"avformat:{s['render']}", "vcodec=libx264", "acodec=aac", "realtime=-1"])
        
        subprocess.run(melt_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        print(f"[✓] REVAMP TEASER COMPLETE: {s['render']}\n")

