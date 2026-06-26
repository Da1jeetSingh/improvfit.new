#!/usr/bin/env node
/**
 * Downloads stock assets for IMPROV demo video.
 */
import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const ASSETS = path.resolve("video/assets");

const CRICKET_CLIPS = [
  {
    name: "cricket-1.mp4",
    url: "https://videos.pexels.com/video-files/5752728/5752728-uhd_2560_1440_25fps.mp4",
  },
  {
    name: "cricket-2.mp4",
    url: "https://videos.pexels.com/video-files/5752699/5752699-uhd_2560_1440_25fps.mp4",
  },
  {
    name: "training-1.mp4",
    url: "https://videos.pexels.com/video-files/4761412/4761412-uhd_2560_1440_25fps.mp4",
  },
];

async function generateCricketFallbacks() {
  const cricketDir = path.join(ASSETS, "cricket");
  await mkdir(cricketDir, { recursive: true });

  const clips = [
    {
      name: "cricket-1.mp4",
      filter:
        `color=c=0x1a4d2e:s=1080x1920:d=5,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='TRAINING':fontsize=120:fontcolor=white@0.15:x=(w-text_w)/2:y=(h-text_h)/2,` +
        `zoompan=z='1.0+0.05*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=${30}`,
    },
    {
      name: "cricket-2.mp4",
      filter:
        `color=c=0x0b4f3a:s=1080x1920:d=5,` +
        `drawbox=x=40:y=576:w=1000:h=768:color=0x003d2b@0.6:t=fill,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='AVG  28.4':fontsize=64:fontcolor=white@0.7:x=80:y=672,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='SR   112':fontsize=64:fontcolor=white@0.5:x=80:y=864,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='???':fontsize=120:fontcolor=0xA8C4B4@0.8:x=880:y=730,` +
        `zoompan=z='1.0+0.04*on/150':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1080x1920:fps=${30}`,
    },
    {
      name: "training-1.mp4",
      filter:
        `color=c=0x001f16:s=1080x1920:d=5,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='NETS SESSION':fontsize=72:fontcolor=white@0.2:x=(w-text_w)/2:y=480,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='Am I getting better?':fontsize=48:fontcolor=0xA8C4B4:x=(w-text_w)/2:y=1056,` +
        `fade=t=in:st=0:d=0.5,fps=${30}`,
    },
  ];

  for (const clip of clips) {
    const dest = path.join(cricketDir, clip.name);
    if (!existsSync(dest)) {
      console.log(`Generating ${clip.name}...`);
      execSync(
        `ffmpeg -y -f lavfi -i "${clip.filter}" -t 5 -c:v libx264 -preset fast -crf 20 "${dest}"`,
        { stdio: "inherit" },
      );
    }
  }
}

async function generateMusic() {
  const dest = path.join(ASSETS, "music.mp3");
  if (existsSync(dest)) return;

  console.log("Generating background music...");
  execSync(
    `ffmpeg -y -f lavfi -i "sine=frequency=220:duration=200" ` +
      `-f lavfi -i "sine=frequency=330:duration=200" ` +
      `-f lavfi -i "sine=frequency=440:duration=200" ` +
      `-filter_complex "` +
      `[0:a]volume=0.04[a0];[1:a]volume=0.03[a1];[2:a]volume=0.02[a2];` +
      `[a0][a1][a2]amix=inputs=3:duration=longest,` +
      `lowpass=f=800,afade=t=in:st=0:d=3,afade=t=out:st=197:d=3" ` +
      `-t 200 -c:a libmp3lame -b:a 128k "${dest}"`,
    { stdio: "inherit" },
  );
}

async function download(url, dest) {
  console.log(`Downloading ${path.basename(dest)}...`);
  execSync(`curl -fsSL -o "${dest}" "${url}"`, { stdio: "inherit" });
}

async function createLaptopFrame() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1600" height="1000" viewBox="0 0 1600 1000" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a1a1a"/>
      <stop offset="100%" style="stop-color:#0d0d0d"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="12" stdDeviation="24" flood-opacity="0.45"/>
    </filter>
  </defs>
  <!-- Laptop base -->
  <rect x="80" y="60" width="1440" height="860" rx="24" fill="url(#bg)" filter="url(#shadow)"/>
  <!-- Screen bezel -->
  <rect x="120" y="100" width="1360" height="780" rx="8" fill="#0a0a0a"/>
  <!-- Screen area (transparent - will be filled by video) -->
  <rect x="140" y="120" width="1320" height="740" fill="#f5f5f5"/>
  <!-- Camera dot -->
  <circle cx="800" cy="88" r="4" fill="#333"/>
  <!-- Keyboard hint -->
  <rect x="200" y="900" width="1200" height="16" rx="8" fill="#2a2a2a"/>
  <rect x="500" y="940" width="600" height="8" rx="4" fill="#333"/>
</svg>`;

  const svgPath = path.join(ASSETS, "laptop-frame.svg");
  await writeFile(svgPath, svg);

  execSync(
    `ffmpeg -y -i "${svgPath}" -frames:v 1 "${path.join(ASSETS, "laptop-frame.png")}"`,
    { stdio: "inherit" },
  );
}

async function createLogoPng() {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="300" viewBox="0 0 800 300" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="300" fill="transparent"/>
  <g fill="#003d2b" transform="translate(280, 80)">
    <path d="M6 140 L68 140 L68 84 Z"/>
    <path d="M77 140 L92 140 L92 84 L77 70 Z M98.5 140 L113.5 140 L113.5 63 L98.5 49 Z M116 140 L131 140 L131 42 L116 28 Z"/>
  </g>
  <text x="400" y="220" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="700" fill="#003d2b" letter-spacing="8">IMPROV</text>
</svg>`;

  const svgPath = path.join(ASSETS, "logo.svg");
  await writeFile(svgPath, svg);
  execSync(
    `ffmpeg -y -i "${svgPath}" -frames:v 1 "${path.join(ASSETS, "logo.png")}"`,
    { stdio: "inherit" },
  );
}

async function main() {
  await mkdir(ASSETS, { recursive: true });
  await mkdir(path.join(ASSETS, "cricket"), { recursive: true });

  for (const clip of CRICKET_CLIPS) {
    const dest = path.join(ASSETS, "cricket", clip.name);
    try {
      await download(clip.url, dest);
    } catch {
      console.warn(`Failed to download ${clip.name}, will use generated fallback`);
    }
  }

  await generateCricketFallbacks();

  try {
    await download(
      "https://cdn.pixabay.com/download/audio/2022/10/25/audio_1234e7d29d.mp3?filename=corporate-technology-140064.mp3",
      path.join(ASSETS, "music.mp3"),
    );
  } catch {
    console.warn("Music download failed, generating ambient track");
    await generateMusic();
  }

  await createLaptopFrame();
  await createLogoPng();
  console.log("Assets ready in", ASSETS);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
