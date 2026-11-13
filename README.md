# SmartPark – Modern Parking & Live Monitoring Dashboard

A premium parking-operations dashboard for tracking vehicles, monitoring parking bays in real time, logging movements, and viewing analytics. It runs fully in the browser, can be installed as a PWA, and can be packaged as an Android APK.

## Features

- **Dashboard** – live occupancy, available bays, entries and exits today, occupancy rate
- **Parking map** – interactive bay grid grouped by zone (VIP & EV, covered canopy, and more)
- **Auto Car Sense** – simulated plate-recognition gates that log entry timestamps automatically
- **Live Monitoring** – real-time view of vehicles currently inside
- **Vehicle Management & Movements** – check-in/check-out records, durations, search by plate
- **Reports & Analytics** and **Revenue & Payments**
- **Notifications**, **Staff Management**, **Settings**
- Animated **opening intro video** with music (skippable)
- Light/dark theme, responsive layout with mobile bottom navigation
- Installable as a PWA, Android APK ready (Capacitor)

> The app currently uses built-in demo data (`src/data`). No backend or API key is required.

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS 4 · Lucide icons · vite-plugin-pwa · Capacitor (Android)

## Getting Started

Requirements: Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with TypeScript |
| `npm run android:sync` | Build and sync the web app into the Android project |
| `npm run android:open` | Open the Android project in Android Studio |

## Project Structure

```
public/            Icons and intro.mp4 (opening video)
src/
  App.tsx          App shell, navigation, state
  main.tsx         Entry point (shows the intro first)
  components/      Views, modals, navigation, IntroSplash
  data/            Demo data
  hooks/           usePWAInstall
capacitor.config.json   Android app settings
ANDROID_APK_GUIDE.md    Step-by-step APK instructions
```

## Opening Intro

`src/components/IntroSplash.tsx` plays `public/intro.mp4` full screen at launch. If the device blocks autoplay with sound, it plays muted and shows a **Tap for sound** button. To change the intro, replace `public/intro.mp4`.

## Build the Android APK

Full steps are in [ANDROID_APK_GUIDE.md](ANDROID_APK_GUIDE.md). In short:

```bash
npm install @capacitor/core @capacitor/android
npm install -D @capacitor/cli
npx cap add android
npm run android:sync
npm run android:open     # then Build > Build APK(s) in Android Studio
```

No Android Studio? Push the project to GitHub and use the included workflow in `.github/workflows/android.yml` (Actions tab → *Build Android APK* → Run workflow), then download the APK from the run's artifacts.

## Deploy as a PWA

Upload the built site (`dist/`) to any HTTPS host such as Netlify or Vercel. The app includes a web manifest and service worker, so it can be installed from the browser or packaged with [PWABuilder](https://www.pwabuilder.com).

## Notes

- Keep your Android signing keystore safe; it is required for every future update.
- Never put secret API keys in the app code, because anything shipped in an APK or web app can be extracted.
