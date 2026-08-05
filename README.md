# 🐉 Fluid Motion Unified Studio v1.2

**Dragon 9 v6 | TV Automation + Dawn Engine + Radio Tuner + YouTube + 36-Station Sync + 22 D9Enigma Modules**

A unified single-page web application for Fluid Motion TV — the future of sovereign broadcasting.

---

## 🚀 Quick Start (Local)

```bash
npm install
npm run dev
```

Open `http://localhost:3000`

```bash
npm run build
```

---

## 🚀 Deploy to GitHub Pages

### Automated (One Command)

```bash
./deploy.sh
```

Then enable GitHub Actions in repo Settings → Pages.

### Manual

See `MANUAL_DEPLOY.md` for step-by-step instructions.

---

## 📁 Architecture

```
src/
├── services/          # Framework-agnostic business logic
│   ├── EventBus.js
│   ├── StateManager.js
│   ├── Dragon9Time.js          # v6 algorithm + 36 stations
│   ├── AudioEngine.js          # Web Audio API synthesizer
│   ├── RadioStationService.js  # Streams + mic
│   ├── AudioRouter.js          # Per-channel routing
│   ├── YouTubeService.js       # IFrame + Invidious
│   ├── UnifiedPlaylistService.js # Master broadcast queue
│   └── ModuleRegistry.js       # 22 D9Enigma modules
├── hooks/             # React bindings
└── components/
    ├── layout/        # Dashboard shell
    ├── shared/        # Header, Clock, Station Grid, Sync, Status
    ├── tv/            # TV Automation Deck + YouTube Player
    ├── audio/         # Dawn Engine + Radio + File Drop + YouTube Mixer
    ├── playlist/      # Unified Broadcast Queue
    └── modules/       # D9Enigma floating windows
```

---

## 🐉 Dragon 9 Time System v6

Exact port of [fluidmotiontv-clock](https://fluidmotiontv-oss.github.io/Fluidmotiontv-clock/)

- **54-minute hours**, **26-hour day**, **two 13-hour cycles**
- **Two 18-minute Apex periods** (11:51–12:09 & 23:51–00:09)
- **Root number** 1-9, **Hue** cycling 184.5° base
- **36 synced stations**: Auckland, Sydney, Tokyo, Seoul, Singapore, Hong Kong, Perth, Bangkok, Jakarta, Mumbai, Dubai, Moscow, Nairobi, Cairo, Paris, London, Casablanca, Azores, Rio, Buenos Aires, Santiago, New York, Miami, Chicago, Mexico City, Denver, Phoenix, Los Angeles, Vancouver, Anchorage, Honolulu, Tahiti, American Samoa, Fiji, Brisbane, Berlin

---

## 🎛️ Dawn Engine — Audio System

### Synthesizer (Web Audio API)
- **5 Patterns**: Dub, Reggae, House, Techno, Ambient
- **6 Channels**: Kick, Snare, Hi-Hat, Bass, Pad, Lead
- Real-time 16-step sequencer, BPM 60-200

### Radio Tuner
- **10 Genres**: Reggae, Dub, House, Techno, Ambient, Talkback, Jazz, Classical, News, Sports
- Live Icecast/Shoutcast streams
- Auto-spot stations across channels
- Quick-switch all channels to genre

### YouTube Integration
- **TV Deck**: IFrame player for video playback
- **Dawn Engine**: Invidious audio extraction → routed to mixer channels

### Talkback / Microphone
- WebRTC `getUserMedia` per channel
- "On Air" indicator

### File Playback
- Drag & drop MP3/WAV/OGG
- Assign to any channel

### Channel Source Router
Each channel independently switches between: 🔧 Synth | 📻 Radio | ▶️ YouTube | 🎙️ Mic | 📁 File

---

## 📺 TV Automation Deck

- **4-Camera Switching** with health monitoring
- **Playlist Queue** (video / live / graphic)
- **Cue Timeline** with HTML5 Canvas playhead
- **Stream Health** sparkline
- **YouTube Player** embedded
- **LIVE/Standby** mode

---

## 📋 Unified Broadcast Queue

Master queue supporting all content types with auto-advance:

| Type | Action |
|------|--------|
| YouTube | Loads in TV Deck player |
| Radio | Tunes station to channel |
| File | Plays local audio on channel |
| Synth | Sets pattern, routes to synthesis |
| TV Cue | Switches camera, triggers overlay |
| D9 Event | Time-based automation |

---

## 🧩 D9Enigma Modules (22)

### Implemented with Live Visuals
| Module | Description |
|--------|-------------|
| Stargaze | 200 twinkling stars + constellations |
| Plasma | Real-time plasma energy field |
| Portal | Spiral particle dimensional portal |
| Garden | Generative swaying plants + fireflies |
| Healer | Binaural beat generator (Delta→Gamma, 432Hz, 528Hz) |

### Registered (Ready for Your Code)
Sequencer, Tuner, Radio, Surf, Kite Rider, Infinity Racer, Pyro Drummer, Artist Gallery, Exhibition, Accountant, Harmony Exchange, Node Fabric, Universal Bridge, Designer, Dragon 8 Editor

---

## 🔗 Cross-Module Sync

| Event | Trigger | Action |
|-------|---------|--------|
| D9_APEX_ENTER | Clock hits apex | Audio → ambient |
| D9_APEX_EXIT | Apex ends | Audio → house |
| TV_CUE_TRIGGER | Take pressed | Audio auto-starts |
| AUDIO_BEAT | Step 0 | TV overlay pulse |

---

## ⚡ Build Optimizations

- Zero external runtime dependencies
- Vite manual chunks
- Terser minification
- Self-contained

---

## 🏛️ Server Architecture Recommendation

**Frontend:** Static hosting (GitHub Pages / Vercel) — **FREE**

**Backend services** (optional, $5-10/mo VPS):
- Self-hosted Invidious (reliable YouTube audio)
- WebSocket sync hub (multi-user broadcast control)
- yt-dlp API service
- Sovereign ISP mesh bootstrap node

See `MANUAL_DEPLOY.md` for Docker Compose setup.

---

## 📜 License

Fluid Motion TV / Dragon Nine — Tim Doing

*"Fluid Motion of the Future"*
