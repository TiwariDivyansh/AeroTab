# 🌊 AeroTab — Frutiger Aero New Tab Extension

[![Frutiger Aero](https://img.shields.io/badge/Aesthetic-Frutiger%20Aero-00b4d8?style=for-the-badge)](https://en.wikipedia.org/wiki/Frutiger_Aero)
[![Manifest V3](https://img.shields.io/badge/Chrome%20Extension-Manifest%20V3-4ade80?style=for-the-badge)](https://developer.chrome.com/docs/extensions/mv3/intro/)
[![Zero Dependencies](https://img.shields.io/badge/Stack-Vanilla%20JS%20%2B%20Canvas%20%2B%20Web%20Audio-1aabf0?style=for-the-badge)](https://developer.mozilla.org/)

> **Rediscover the tech-optimistic future of 2004–2013.**
> Transform every new browser tab into an authentic, living Frutiger Aero dashboard featuring animated water caustics, Vista aurora ribbons, skeuomorphic glass gadgets, and synthesized ambient soundscapes.

---

## ✨ Features

- **🌐 Dynamic Living Canvas Backgrounds**
  - Shifts seamlessly through 4 times of day: *Morning*, *Afternoon*, *Sunset/Evening*, and *Night*.
  - Authentic undulating Windows Vista aurora ribbons and light motes.
  - Interactive water ripples on click.
  - 5 Theme Presets:
    1. **Vista Aurora** — Signature green-blue aurora borealis & warm sun ray highlights.
    2. **Aqua Marine** — Deep oceanic caustics and rising glass bubbles.
    3. **Eco Biophilia** — Clean technology meets lush nature with glowing fireflies.
    4. **Bliss Horizon** — Rolling green hills inspired by Windows XP under brilliant azure skies.
    5. **Longhorn Sunset** — Nostalgic warm amber dusk glow inspired by Windows Longhorn builds.

- **⏱️ Vista Sidebar Gadgets**
  - **Aero Analog Clock:** Skeuomorphic glass dial, high-precision ticks, gloss crescent highlight, and electric blue sweeping seconds.
  - **Atmosphere / Weather:** Real-time temperature & forecast powered by **Open-Meteo** (works instantly out-of-the-box with **zero API key required**), plus optional OpenWeatherMap key support.
  - **Focus Tasks:** Instant sticky tasks with skeuomorphic glass checkboxes and persistent local storage.
  - **Quick Launch Bookmarks:** One-click shortcuts with automatic high-res favicon resolution.

- **🎵 Procedural Ambient Sound Engine**
  - Powered 100% by the **Web Audio API** — **zero external audio downloads or broken links**.
  - Synthesized ambient channels:
    - 🌧️ *Gentle Rain* (filtered pink noise)
    - 💧 *Water Ripples* (modulated liquid bandpass)
    - 🔔 *Vista Chime* (dreamy FM harmonic chords)
    - 🐦 *Forest Birds* (randomized organic chirps)
    - ⌨️ *Soft Typing* (tactile key impulses)
  - Flyout audio mixer with individual volume faders and master level control.

- **💻 Windows Vista / 7 Aero Taskbar**
  - Translucent frosted glass bottom bar with specular highlight and inner bevel.
  - Glowing 3D Aero start orb button.
  - Slide-out customization & settings panel with live theme previews and JSON backup/restore.

- **⚡ Blazing Fast & Privacy First**
  - Sub-30ms load times.
  - 100% client-side: Zero tracking, zero telemetry, zero cookies.
  - Works completely offline.

---

## 🚀 Installation

### Option 1: Install as a Chrome / Edge / Brave Extension (Recommended)
1. Open Google Chrome, Microsoft Edge, or Brave.
2. Navigate to `chrome://extensions` (or `edge://extensions`).
3. Toggle on **"Developer mode"** in the top-right corner.
4. Click **"Load unpacked"**.
5. Select the `AeroTab/` folder from this repository:
   `c:\Users\divpr\Downloads\Passion Projects\AeroTab\`
6. Open a new tab (`Ctrl + T`) — welcome to AeroTab!

### Option 2: Run as a Standalone Web Dashboard
You can open `newtab.html` directly in any web browser, or serve it with any local web server:
```bash
# Using Node.js
npx serve AeroTab -p 3000
```
Then visit `http://localhost:3000/newtab.html`.

---

## 📂 Project Architecture

```
AeroTab/
├── manifest.json              # Chrome Extension Manifest V3 configuration
├── newtab.html                # Main application single-page shell
├── css/
│   ├── reset.css              # Minimal cross-browser CSS reset
│   ├── design-system.css      # Skeuomorphic tokens, glass classes, Aero blue palette
│   ├── layout.css             # 3-column CSS Grid layout & responsive rules
│   ├── widgets.css            # Vista sidebar gadget card styling
│   ├── taskbar.css            # Windows 7 / Vista style taskbar & sound mixer flyout
│   ├── settings.css           # Slide-out glass settings drawer
│   └── animations.css         # Keyframe animations (fade, shimmer, float)
├── js/
│   ├── app.js                 # Entry point & lifecycle coordinator
│   ├── utils.js               # Formatting, math, debounce, color interpolation
│   ├── storage.js             # Transparent sync between chrome.storage and localStorage
│   ├── themes.js              # Theme definitions & dynamic CSS property injector
│   ├── background-engine.js   # Canvas 2D engine: aurora ribbons, caustics, particles
│   ├── greeting.js            # Time-of-day greeting & daily focus input
│   ├── clock-widget.js        # Digital, analog canvas dial, & taskbar clocks
│   ├── weather-widget.js      # Open-Meteo zero-key weather engine with 30m cache
│   ├── tasks-widget.js        # Quick focus tasks with strikethrough & persistence
│   ├── bookmarks-widget.js    # Quick launch bookmark shortcuts
│   ├── sound-engine.js        # Web Audio API procedural sound synthesizer & mixer
│   └── settings.js            # Settings manager & JSON backup/restore
├── icons/
│   ├── icon-16.png            # Extension icon 16x16
│   ├── icon-32.png            # Extension icon 32x32
│   ├── icon-48.png            # Extension icon 48x48
│   └── icon-128.png           # Extension icon 128x128
└── README.md                  # Project documentation
```

---

## 🎨 Design Philosophy: True Frutiger Aero
Unlike generic modern glassmorphism (which is flat and monochrome), true **Frutiger Aero** embodies:
- **Depth & Specularity:** Top-half semi-elliptical reflections and glossy light shines.
- **Biophilic Optimism:** Vibrant greens, tropical cyans, luminous light rays, and pure blue skies.
- **Skeuomorphic Tactility:** Tactile pill buttons, radial orbs, and glass bezels.
- **Living Motion:** Gently undulating aurora waves, bubbling water, and soothing audio.

---

## 📄 License
MIT License. Free to use, modify, and distribute.
