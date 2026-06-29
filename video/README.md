# IMPROV Product Demo Video

Professional SaaS product demo for Instagram Reels (1080×1920 vertical).

## Output

`video/output/improv-demo-reel.mp4`

## Build

```bash
chmod +x video/build.sh
./video/build.sh
```

Or step by step:

```bash
npm install
node video/scripts/download-assets.mjs
npm run dev   # in another terminal
node video/scripts/record.mjs
node video/scripts/compose.mjs
```

## Structure

| Segment | Duration | Content |
|---------|----------|---------|
| Hook | ~14s | Cricket footage + opening line |
| Landing | ~14s | IMPROV landing page scroll |
| Sign up | ~13s | Account creation flow |
| Onboarding | ~28s | Player profile personalization |
| Dashboard | ~24s | Performance metrics & activity |
| Stats | ~12s | Progress charts |
| AI Insights | ~22s | Coach insights & recommendations |
| Closing | ~18s | "Stop guessing. Start improving." + logo |

## Demo Routes

Recording uses `/video-demo/*` routes with mock data (no Supabase required):

- `/video-demo/landing`
- `/video-demo/signup`
- `/video-demo/onboarding`
- `/video-demo/dashboard`
- `/video-demo/stats`
- `/video-demo/insights`

## Technical Notes

- Screen recordings captured at 1440×900 @2x via Playwright
- Composited inside laptop mockup with smooth camera movement
- No dashboard cropping — full UI visible with dynamic zoom
- Royalty-free cricket footage from Pexels
- Background music from Pixabay (corporate/tech style)
