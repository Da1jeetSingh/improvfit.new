#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/../.."

echo "=== IMPROV Demo Video Pipeline ==="

echo "[1/4] Installing dependencies..."
npm install --silent
npx playwright install chromium 2>/dev/null || true

echo "[2/4] Downloading assets..."
node video/scripts/download-assets.mjs

echo "[3/4] Starting dev server..."
npm run dev &
DEV_PID=$!
sleep 8

cleanup() {
  kill $DEV_PID 2>/dev/null || true
}
trap cleanup EXIT

for i in {1..30}; do
  if curl -sf http://localhost:3000/video-demo/landing > /dev/null 2>&1; then
    echo "Dev server ready."
    break
  fi
  sleep 2
done

echo "[4/4] Recording & composing..."
node video/scripts/record.mjs
node video/scripts/compose.mjs

echo ""
echo "Done! Output: video/output/improv-demo-reel.mp4"
