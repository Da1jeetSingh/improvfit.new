#!/usr/bin/env node
/**
 * Records IMPROV product demo sections using Playwright.
 * Output: video/raw/*.webm
 */
import { mkdir, rm } from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";

const BASE_URL = process.env.DEMO_URL ?? "http://localhost:3000";
const OUT_DIR = path.resolve("video/raw");

async function smoothScroll(page, distance, durationMs = 1200) {
  await page.evaluate(
    async ({ distance, durationMs }) => {
      const start = window.scrollY;
      const startTime = performance.now();
      await new Promise((resolve) => {
        function step(now) {
          const t = Math.min(1, (now - startTime) / durationMs);
          const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
          window.scrollTo(0, start + distance * eased);
          if (t < 1) requestAnimationFrame(step);
          else resolve(undefined);
        }
        requestAnimationFrame(step);
      });
    },
    { distance, durationMs },
  );
}

async function smoothType(page, selector, text, delay = 45) {
  await page.click(selector, { delay: 80 });
  for (const char of text) {
    await page.keyboard.type(char, { delay });
  }
}

async function smoothMove(page, x, y) {
  await page.mouse.move(x, y, { steps: 25 });
}

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function recordSection(name, setupFn, durationMs = 8000) {
  const sectionDir = path.join(OUT_DIR, name);
  await rm(sectionDir, { recursive: true, force: true });
  await mkdir(sectionDir, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-dev-shm-usage", "--no-sandbox"],
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    recordVideo: {
      dir: sectionDir,
      size: { width: 1440, height: 900 },
    },
    colorScheme: "light",
  });

  const page = await context.newPage();
  page.setDefaultTimeout(30000);

  try {
    await setupFn(page);
    await wait(durationMs);
  } finally {
    await context.close();
    await browser.close();
  }

  const { readdir } = await import("node:fs/promises");
  const files = await readdir(sectionDir);
  const webm = files.find((f) => f.endsWith(".webm"));
  if (!webm) throw new Error(`No recording for ${name}`);
  return path.join(sectionDir, webm);
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  console.log("Recording landing...");
  const landing = await recordSection("landing", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/landing`, { waitUntil: "networkidle" });
    await wait(800);
    await smoothScroll(page, 600, 2000);
    await wait(400);
    await smoothScroll(page, 500, 1800);
    await wait(400);
    await smoothScroll(page, -300, 1000);
  }, 7000);

  console.log("Recording signup...");
  const signup = await recordSection("signup", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/signup`, { waitUntil: "networkidle" });
    await wait(600);
    await smoothMove(page, 720, 380);
    await smoothType(page, "[data-video-demo='email-input']", "alex.chen@cricket.com");
    await wait(300);
    await smoothMove(page, 720, 480);
    await smoothType(page, "[data-video-demo='password-input']", "Improv2026!");
    await wait(400);
    await page.hover("[data-video-demo='submit-btn']");
    await wait(600);
    await page.click("[data-video-demo='submit-btn']");
    await wait(800);
  }, 6000);

  console.log("Recording onboarding...");
  const onboarding = await recordSection("onboarding", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/onboarding`, { waitUntil: "networkidle" });
    await wait(700);
    await page.getByRole("button", { name: "All Rounder" }).click();
    await wait(900);
    await page.getByRole("button", { name: "Right", exact: true }).first().click();
    await wait(500);
    await page.getByRole("button", { name: "Top order" }).click();
    await wait(500);
    await page.getByRole("button", { name: "Continue" }).click();
    await wait(900);
    await page.getByRole("button", { name: "Right", exact: true }).first().click();
    await wait(500);
    await page.getByRole("button", { name: "Medium Pace" }).click();
    await wait(500);
    await page.getByRole("button", { name: "Continue" }).click();
    await wait(900);
    await smoothType(
      page,
      "[data-video-demo='goal-input']",
      "Raise batting average to 40+",
      35,
    );
    await wait(500);
    await page.getByRole("button", { name: "Continue" }).click();
    await wait(900);
    await page.getByRole("button", { name: "Enter IMPROV" }).hover();
    await wait(800);
  }, 14000);

  console.log("Recording dashboard...");
  const dashboard = await recordSection("dashboard", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/dashboard`, { waitUntil: "networkidle" });
    await wait(1000);
    await smoothScroll(page, 400, 1500);
    await wait(600);
    await smoothScroll(page, 500, 1800);
    await wait(600);
    await smoothScroll(page, 350, 1200);
    await wait(600);
    await smoothScroll(page, -600, 1500);
    await wait(500);
  }, 12000);

  console.log("Recording stats...");
  const stats = await recordSection("stats", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/stats`, { waitUntil: "networkidle" });
    await wait(1000);
    await smoothScroll(page, 300, 1200);
    await wait(800);
    await smoothScroll(page, 400, 1400);
    await wait(600);
  }, 7000);

  console.log("Recording insights...");
  const insights = await recordSection("insights", async (page) => {
    await page.goto(`${BASE_URL}/video-demo/insights`, { waitUntil: "networkidle" });
    await wait(1000);
    await smoothScroll(page, 250, 1000);
    await wait(700);
    await smoothScroll(page, 350, 1200);
    await wait(700);
    await smoothScroll(page, -200, 800);
    await wait(500);
  }, 8000);

  const manifest = {
    landing,
    signup,
    onboarding,
    dashboard,
    stats,
    insights,
    recordedAt: new Date().toISOString(),
  };

  const { writeFile } = await import("node:fs/promises");
  await writeFile(
    path.join(OUT_DIR, "manifest.json"),
    JSON.stringify(manifest, null, 2),
  );

  console.log("Done. Manifest:", manifest);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
