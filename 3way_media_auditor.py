import os
import time

TARGET_DIRECTORIES = [
    os.path.expanduser("~/studio_project"),
]

MEDIA_EXTENSIONS = {'.mp4', '.mov', '.mkv', '.avi', '.wav', '.mp3', '.flac', '.png', '.jpg', '.csv', '.json', '.py', '.jsx', '.js', '.html', '.css', '.kdenlive'}
IGNORE_DIR_PATTERNS = ['.venv', 'venv', 'node_modules', '.git', '.dist-info', '.egg-info', '__pycache__']

def run_audit(target_dirs=None):
    if target_dirs is None:
        target_dirs = TARGET_DIRECTORIES

    total_files = 0
    verified_files = 0
    missing_or_empty_files = 0
    total_size_bytes = 0
    discrepancies = []
    file_type_counts = {}

    start_time = time.time()

    for directory in target_dirs:
        if not os.path.exists(directory):
            discrepancies.append({
                "id": directory,
                "issue": "Directory path unmapped or unreachable"
            })
            continue

        for root, dirs, files in os.walk(directory):
            if any(ignore_dir in root for ignore_dir in IGNORE_DIR_PATTERNS):
                continue

            for file in files:
                ext = os.path.splitext(file)[1].lower()
                
                if ext in MEDIA_EXTENSIONS:
                    total_files += 1
                    file_path = os.path.join(root, file)

                    try:
                        file_stat = os.stat(file_path)
                        size = file_stat.st_size

                        # Allow empty __init__.py files as valid package markers
                        if size == 0 and file != '__init__.py':
                            missing_or_empty_files += 1
                            discrepancies.append({
                                "id": file,
                                "issue": f"Zero-byte empty file found in {os.path.basename(root)}"
                            })
                        else:
                            verified_files += 1
                            total_size_bytes += size

                        ext_label = ext if ext else "no_ext"
                        file_type_counts[ext_label] = file_type_counts.get(ext_label, 0) + 1

                    except (PermissionError, FileNotFoundError) as e:
                        missing_or_empty_files += 1
                        discrepancies.append({
                            "id": file,
                            "issue": f"Access error: {str(e)}"
                        })

    elapsed_time = round(time.time() - start_time, 2)
    size_mb = round(total_size_bytes / (1024 * 1024), 2)
    size_formatted = f"{round(size_mb / 1024, 2)} GB" if size_mb > 1024 else f"{size_mb} MB"

    return {
        "status": "success",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "scan_time_seconds": elapsed_time,
        "total_files": total_files,
        "verified_files": verified_files,
        "missing_files": missing_or_empty_files,
        "total_storage_used": size_formatted,
        "file_types": file_type_counts,
        "recent_discrepancies": discrepancies[:10]
    }

if __name__ == "__main__":
    import json
    print(json.dumps(run_audit(), indent=2))
