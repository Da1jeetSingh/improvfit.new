#!/usr/bin/env node
/**
 * Composes IMPROV product demo video — 1080x1920 vertical for Instagram Reels.
 */
import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";

const ROOT = path.resolve("video");
const RAW = path.join(ROOT, "raw");
const ASSETS = path.join(ROOT, "assets");
const WORK = path.join(ROOT, "work");
const OUT = path.join(ROOT, "output");

const W = 1080;
const H = 1920;
const FPS = 30;

function run(cmd) {
  console.log(`\n> ${cmd}\n`);
  execSync(cmd, { stdio: "inherit", shell: "/bin/bash" });
}

function ff(cmd) {
  run(`ffmpeg -y ${cmd}`);
}

function probeDuration(file) {
  const out = execSync(
    `ffprobe -v error -show_entries format=duration -of csv=p=0 "${file}"`,
    { encoding: "utf8" },
  ).trim();
  return parseFloat(out);
}

function normalizeInput(input, output, maxDuration) {
  const dur = Math.min(probeDuration(input), maxDuration);
  ff(
    `-i "${input}" -t ${dur} -vf "fps=${FPS},setpts=PTS-STARTPTS,format=yuv420p" -an -c:v libx264 -preset fast -crf 18 "${output}"`,
  );
  return dur;
}

function buildHook() {
  const out = path.join(WORK, "01-hook.mp4");
  const cricketDir = path.join(ASSETS, "cricket");
  const clips = ["cricket-1.mp4", "cricket-2.mp4", "training-1.mp4"]
    .map((f) => path.join(cricketDir, f))
    .filter(existsSync);

  if (clips.length === 0) {
    ff(
      `-f lavfi -i color=c=0x003d2b:s=${W}x${H}:d=14 -vf "` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='Most cricketers train for years':fontsize=52:fontcolor=white:` +
        `x=(w-text_w)/2:y=h*0.38:enable='between(t,1,6)',` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='but never know if they are actually improving.':fontsize=44:fontcolor=0xA8C4B4:` +
        `x=(w-text_w)/2:y=h*0.46:enable='between(t,1.5,6)',` +
        `fade=t=in:st=0:d=0.8,fade=t=out:st=12:d=1.5,fps=${FPS}" ` +
        `-t 14 -c:v libx264 -preset fast -crf 18 "${out}"`,
    );
    return out;
  }

  const parts = [];
  for (let i = 0; i < clips.length; i++) {
    const part = path.join(WORK, `hook-part-${i}.mp4`);
    ff(
      `-i "${clips[i]}" -t 4.5 -vf "` +
        `scale=${W}:${H}:force_original_aspect_ratio=increase,crop=${W}:${H},` +
        `eq=brightness=-0.05:saturation=1.1,` +
        `fps=${FPS},format=yuv420p" -an -c:v libx264 -preset fast -crf 20 "${part}"`,
    );
    parts.push(part);
  }

  const listFile = path.join(WORK, "hook-list.txt");
  writeFileSync(
    listFile,
    parts.map((p) => `file '${p}'`).join("\n"),
  );

  const concat = path.join(WORK, "hook-concat.mp4");
  ff(`-f concat -safe 0 -i "${listFile}" -c copy "${concat}"`);

  ff(
    `-i "${concat}" -vf "` +
      `drawbox=x=0:y=0:w=iw:h=ih:color=0x003d2b@0.55:t=fill,` +
      `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
      `text='Most cricketers train for years':fontsize=50:fontcolor=white:` +
      `x=(w-text_w)/2:y=h*0.35:enable='between(t,0.5,4)',` +
      `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
      `text='but never know if they are actually improving.':fontsize=40:fontcolor=0xA8C4B4:` +
      `x=(w-text_w)/2:y=h*0.42:enable='between(t,1,4.5)',` +
      `fade=t=in:st=0:d=0.5,fade=t=out:st=12:d=1.2,fps=${FPS}" ` +
      `-t 13.5 -c:v libx264 -preset fast -crf 18 "${out}"`,
  );

  return out;
}

function buildLaptopSegment(input, output, duration, label) {
  const frame = path.join(ASSETS, "laptop-frame.png");
  const normalized = path.join(WORK, `norm-${path.basename(output)}`);

  normalizeInput(input, normalized, duration);

  const totalFrames = Math.ceil(duration * FPS);
  const zoomExpr = `1.0+0.06*sin(2*PI*on/${Math.max(totalFrames, 1)})`;
  const panX = `iw/2-(iw/zoom/2)+25*sin(on/40)`;
  const panY = `ih/2-(ih/zoom/2)+15*cos(on/55)`;

  ff(
    `-i "${normalized}" -loop 1 -i "${frame}" -filter_complex "` +
      `[0:v]scale=1320:740:force_original_aspect_ratio=decrease,` +
      `pad=1320:740:(ow-iw)/2:(oh-ih)/2:color=0xf5f5f5,setsar=1[screen];` +
      `[1:v][screen]overlay=140:120:format=auto,format=rgba[laptop];` +
      `[laptop]scale=1000:-1,pad=${W}:${H}:(ow-iw)/2:(oh-ih)/2:color=0x001f16,` +
      `zoompan=z='${zoomExpr}':x='${panX}':y='${panY}':d=1:s=${W}x${H}:fps=${FPS},` +
      `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
      `text='${label}':fontsize=36:fontcolor=white@0.9:` +
      `x=60:y=80:enable='between(t,0.3,2.5)',` +
      `fade=t=in:st=0:d=0.4,fade=t=out:st=${(duration - 0.5).toFixed(2)}:d=0.5,format=yuv420p" ` +
      `-t ${duration} -c:v libx264 -preset fast -crf 18 "${output}"`,
  );
}

function buildClosing() {
  const out = path.join(WORK, "07-closing.mp4");
  const logo = path.join(ASSETS, "logo.png");
  const dash = path.join(WORK, "norm-closing-dash.mp4");
  const manifest = JSON.parse(readFileSync(path.join(RAW, "manifest.json"), "utf8"));

  if (existsSync(manifest.dashboard)) {
    normalizeInput(manifest.dashboard, dash, 8);
  }

  if (existsSync(dash) && existsSync(logo)) {
    ff(
      `-i "${dash}" -loop 1 -i "${logo}" -f lavfi -i color=c=0x001f16:s=${W}x${H}:d=18 -filter_complex "` +
        `[0:v]scale=1320:740:force_original_aspect_ratio=decrease,` +
        `pad=1320:740:(ow-iw)/2:(oh-ih)/2:color=0xf5f5f5[screen];` +
        `[2:v][screen]overlay=(W-w)/2+0:(H-h)/2-80:format=auto,` +
        `zoompan=z='min(1.0+on*0.0003,1.05)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=${W}x${H}:fps=${FPS}[bg];` +
        `[bg][1:v]overlay=(W-w)/2:(H-h)/2+280:format=auto,format=rgba[composed];` +
        `[composed]drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='Stop guessing. Start improving.':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h*0.62:enable='between(t,4,16)',` +
        `fade=t=in:st=0:d=0.6,fade=t=out:st=16:d=1.2,format=yuv420p" ` +
        `-t 18 -c:v libx264 -preset fast -crf 18 "${out}"`,
    );
  } else {
    ff(
      `-f lavfi -i color=c=0x001f16:s=${W}x${H}:d=18 -loop 1 -i "${logo}" -filter_complex "` +
        `[1:v]scale=500:-1[logo];` +
        `[0:v][logo]overlay=(W-w)/2:(H-h)/2-60,` +
        `drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:` +
        `text='Stop guessing. Start improving.':fontsize=48:fontcolor=white:` +
        `x=(w-text_w)/2:y=h*0.65:enable='between(t,2,16)',` +
        `fade=t=in:st=0:d=0.8,fps=${FPS},format=yuv420p" ` +
        `-t 18 -c:v libx264 -preset fast -crf 18 "${out}"`,
    );
  }

  return out;
}

function concatAll(segments, output) {
  const listFile = path.join(WORK, "final-list.txt");
  writeFileSync(
    listFile,
    segments.map((s) => `file '${s}'`).join("\n"),
  );

  const silent = path.join(WORK, "final-silent.mp4");
  ff(`-f concat -safe 0 -i "${listFile}" -c copy "${silent}"`);

  const music = path.join(ASSETS, "music.mp3");
  if (existsSync(music)) {
    const totalDur = probeDuration(silent);
    ff(
      `-i "${silent}" -i "${music}" -filter_complex "` +
        `[1:a]afade=t=in:st=0:d=2,afade=t=out:st=${(totalDur - 3).toFixed(2)}:d=3,` +
        `volume=0.22,atrim=0:${totalDur}[music];` +
        `[music]apad=pad_dur=${totalDur}[aout]" ` +
        `-map 0:v -map "[aout]" -c:v copy -c:a aac -b:a 192k -shortest "${output}"`,
    );
  } else {
    ff(`-i "${silent}" -c copy "${output}"`);
  }
}

async function main() {
  await rm(WORK, { recursive: true, force: true });
  await mkdir(WORK, { recursive: true });
  await mkdir(OUT, { recursive: true });

  const manifest = JSON.parse(readFileSync(path.join(RAW, "manifest.json"), "utf8"));

  console.log("Building hook...");
  const hook = buildHook();

  console.log("Building UI segments...");
  const landing = path.join(WORK, "02-landing.mp4");
  const signup = path.join(WORK, "03-signup.mp4");
  const onboarding = path.join(WORK, "04-onboarding.mp4");
  const dashboard = path.join(WORK, "05-dashboard.mp4");
  const stats = path.join(WORK, "05b-stats.mp4");
  const insights = path.join(WORK, "06-insights.mp4");

  buildLaptopSegment(manifest.landing, landing, 14, "IMPROV");
  buildLaptopSegment(manifest.signup, signup, 13, "Get started");
  buildLaptopSegment(manifest.onboarding, onboarding, 28, "Personalize your profile");
  buildLaptopSegment(manifest.dashboard, dashboard, 24, "Your dashboard");
  buildLaptopSegment(manifest.stats, stats, 12, "Track progress");
  buildLaptopSegment(manifest.insights, insights, 22, "AI-powered insights");

  console.log("Building closing...");
  const closing = buildClosing();

  const segments = [hook, landing, signup, onboarding, dashboard, stats, insights, closing];

  const finalOut = path.join(OUT, "improv-demo-reel.mp4");
  console.log("Concatenating final video...");
  concatAll(segments, finalOut);

  const dur = probeDuration(finalOut);
  console.log(`\n✓ Final video: ${finalOut}`);
  console.log(`  Duration: ${dur.toFixed(1)}s (${W}x${H})`);

  if (dur > 180) {
    console.warn("Warning: video exceeds 3 minutes, trimming...");
    const trimmed = path.join(OUT, "improv-demo-reel-trimmed.mp4");
    ff(`-i "${finalOut}" -t 180 -c copy "${trimmed}"`);
    run(`mv "${trimmed}" "${finalOut}"`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
