import os
import urllib.request
import re
import json

base_dir = os.path.expanduser("~/studio_project/sites")

# Target sites and search/scrape profile endpoints
sites = {
    "holiday_park": {
        "name": "Port Waikato Holiday Park",
        "raw_dir": os.path.join(base_dir, "holiday_park/raw_media"),
        "scrapes": [
            "https://www.portwaikatoholidaypark.co.nz"
        ]
    },
    "port_wharf_store": {
        "name": "Port Waikato Wharf Store (pee dub)",
        "raw_dir": os.path.join(base_dir, "port_wharf_store/raw_media"),
        "scrapes": [
            "https://www.facebook.com/portwaikatowharfstore"
        ]
    }
}

headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'}

for key, site in sites.items():
    print("=" * 65)
    print(f"[*] SCRAPING PRESENCE FOR: {site['name'].upper()}")
    print("=" * 65)
    
    os.makedirs(site["raw_dir"], exist_ok=True)
    img_count = 0
    
    for url in site["scrapes"]:
        try:
            print(f"[*] Fetching content from: {url}")
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=10) as response:
                html = response.read().decode('utf-8', errors='ignore')
                
                # Extract image URLs (JPG, PNG, WEBP)
                img_urls = re.findall(r'src=["\'](https?://[^"\']+\.(?:jpg|jpeg|png|webp))["\']', html, re.IGNORECASE)
                
                for img_url in set(img_urls):
                    if img_count >= 10:  # Grab up to 10 key images per site
                        break
                    img_name = f"scraped_asset_{img_count + 1:02d}.jpg"
                    save_path = os.path.join(site["raw_dir"], img_name)
                    
                    try:
                        print(f"    + Downloading asset: {img_url[:60]}...")
                        img_req = urllib.request.Request(img_url, headers=headers)
                        with urllib.request.urlopen(img_req, timeout=5) as img_res, open(save_path, 'wb') as f:
                            f.write(img_res.read())
                        img_count += 1
                    except Exception as e:
                        continue
        except Exception as e:
            print(f"[!] Direct scrape note for {url}: {e}")
            print(f"    (Will fallback to photo inventory assets or manual local images if site blocks scraper)")

    print(f"[✓] Harvester completed for {site['name']}. {img_count} assets saved to {site['raw_dir']}\n")
