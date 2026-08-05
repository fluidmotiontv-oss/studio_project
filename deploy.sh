#!/bin/bash
# Fluid Motion Unified Studio — Auto-Deploy Script
# Run this from your local machine after cloning your repo

set -e

REPO_URL="https://github.com/fluidmotiontv-oss/D9Enigma.git"
REPO_DIR="D9Enigma-temp"
SOURCE_DIR="fluid-motion-unified-studio"
BRANCH="main"

echo "🐉 Fluid Motion Unified Studio — Deploy Script"
echo "================================================"

# Check if source exists
if [ ! -d "$SOURCE_DIR" ]; then
    echo "❌ Error: $SOURCE_DIR directory not found!"
    echo "   Extract the zip file first, then run this script from the same folder."
    exit 1
fi

# Clone or use existing repo
if [ -d "$REPO_DIR" ]; then
    echo "📁 Using existing $REPO_DIR"
    cd "$REPO_DIR"
    git pull origin "$BRANCH" || true
    cd ..
else
    echo "📥 Cloning $REPO_URL..."
    git clone "$REPO_URL" "$REPO_DIR"
fi

# Create unified-studio subdirectory in repo
mkdir -p "$REPO_DIR/unified-studio"

# Copy all files
echo "📦 Copying files..."
cp -r "$SOURCE_DIR/"* "$REPO_DIR/unified-studio/"

# Create .gitignore
cat > "$REPO_DIR/unified-studio/.gitignore" << 'EOF'
node_modules/
dist/
.env
.DS_Store
*.log
.vite/
EOF

cd "$REPO_DIR"

# Stage, commit, push
echo "📝 Staging files..."
git add unified-studio/

echo "💾 Committing..."
git commit -m "feat: Fluid Motion Unified Studio v1.2

- TV Automation Deck with camera switching, playlist, cue timeline
- Dawn Engine with Web Audio API synthesis (5 patterns, 6 channels)
- Radio Tuner with 10 genres, auto-spot, live stream routing
- YouTube integration: IFrame player + Invidious audio extraction
- Talkback microphone per channel
- File drop audio routing
- Dragon 9 v6 Clock with 36-station global sync
- Unified Broadcast Queue (YouTube, Radio, File, Synth, TV Cue, D9 events)
- 22 D9Enigma modules: Stargaze, Plasma, Portal, Garden, Healer + 17 placeholders
- Cross-module sync via EventBus
- Modular React/Vite/Tailwind architecture

Built by Tim Doing | Fluid Motion TV | Dragon Nine" || echo "⚠️ Nothing new to commit"

echo "🚀 Pushing to origin/$BRANCH..."
git push origin "$BRANCH"

echo ""
echo "✅ DONE!"
echo "   View at: https://github.com/fluidmotiontv-oss/D9Enigma/tree/main/unified-studio"
echo "   Deploy to: https://fluidmotiontv-oss.github.io/D9Enigma/unified-studio/"

# Optional: cleanup
read -p "🧹 Remove temp directory? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    cd ..
    rm -rf "$REPO_DIR"
    echo "   Cleaned up."
fi
