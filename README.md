# SONORA — Find your frequency

**SONORA** is a premium, high-fidelity music streaming web application designed with an editorial aesthetic, deep charcoal surfaces, and restrained electric-lime accents. It provides an uninterrupted, responsive listening experience with genuine audio playback, local offline-ready audio tracks, persistent state, intuitive queue control, and rich editorial metadata.

---

## ✨ Features

### 🎧 Audio Playback & Persistent Engine
- **Headless Audio Engine**: Built around a single, persistent `HTMLAudioElement` that remains mounted and uninterrupted during in-app navigation across all routes.
- **Full Playback Controls**: Play, pause, scrub/seek, skip to next, return to previous/restart, dynamic volume control with mute toggle, repeat modes (`off`, `all`, `one`), and non-destructive queue shuffling.
- **Isolated High-Frequency Store**: Audio progress (`timeupdate`) runs in an isolated Zustand store so only the progress seeker and timestamp indicators re-render—keeping the entire page and queue buttery smooth at 60+ FPS.
- **Hardware Media Keys & Lockscreen**: Full integration with the `navigator.mediaSession` API for system media key control, lockscreen metadata, and artwork display.
- **Autoplay Handling**: Gracefully catches browser autoplay policy blocks and manages loading/buffering states with zero console panics.

### 📚 Curated Library & Legally Usable Audio
- **14 Verified, Playable Tracks**: Includes 10 original multi-track synthesized WAV compositions across various genres (Synthwave, Lo-Fi, Deep House, Ambient, Cyberpunk, Neo-Soul, Drum & Bass, Downtempo) and 4 extended studio electronic MP3s from the open-source SoundHelix project.
- **100% Offline Capability**: All audio files are bundled directly in `/public/audio/`, guaranteeing instant playback without network delays, CORS errors, or third-party stream rot.
- **Deterministic Artwork Fallbacks**: If remote cover art fails to load or the device is offline, an integrated SVG generator creates custom, themed geometric waveforms with artist initials matching the product aesthetic.

### 🧭 Navigation & Core Areas
1. **Sidebar Navigation**:
   - Original SONORA wordmark and geometric sound frequency branding.
   - Quick routes to **Home**, **Discover**, **Search**, **Your Library**, and **Liked Songs**.
   - User playlists list with live count badges and a dedicated **Create Playlist** trigger.
2. **Home Page**:
   - Dynamic time-of-day greeting (*"Late Night Frequencies"*, *"Good Morning"*, *"Good Evening"*).
   - Editorial featured album banner with instant playback.
   - Recently played rotation shelf.
   - Curated editorial playlists and recommended soundscapes.
   - Mood & genre discovery portals.
3. **Discover Page**:
   - Interactive genre filter pills with live track counts.
   - Featured sound architects (artists) with bios and follower metrics.
   - Notable album releases and curated compilation cards.
4. **Instant Search**:
   - Reactive search input that filters in real-time across track titles, artists, albums, and genres.
   - Visual category cards when empty, and clearly formatted multi-category results (Artists, Songs, Albums).
   - Helpful, zero-clutter empty states with suggested search queries.
5. **Your Library**:
   - Unified overview with tabs for **All**, **Playlists**, **Liked & Tracks**, and **Albums**.
   - Multi-field sorting by Recently Added, Track Title (A–Z), and Artist Name.
   - Special **Liked Songs** tile and quick creation actions.
6. **Custom & Editorial Playlists**:
   - Editorial headers with cover art, total duration, track count, and curator badges.
   - Play All and Shuffle Play actions.
   - Create, edit title/description, add tracks, remove tracks, and delete custom playlists with safe confirmation dialogs.
7. **Queue Drawer**:
   - Slide-out queue overlay showing the currently playing track and upcoming queue.
   - Jump directly to any upcoming track, remove individual tracks, or clear the queue.
   - Visual live equalizer bars indicating active playback.

### ⌨️ Keyboard Shortcuts
| Key | Action |
| --- | --- |
| `Space` or `K` | Play / Pause |
| `J` / `←` | Seek backward 5 seconds |
| `L` / `→` | Seek forward 5 seconds |
| `Shift + N` | Next track |
| `Shift + P` | Previous track |
| `↑` / `↓` | Volume up / down (5% increments) |
| `M` | Mute / Unmute toggle |
| `S` | Toggle Shuffle |
| `R` | Cycle Repeat (`off` → `all` → `one`) |
| `Q` | Toggle Play Queue drawer |
| `?` | Show Keyboard Shortcuts cheat sheet |
| `Esc` | Close open drawers, modals, and menus |

*Note: All playback shortcuts are disabled when typing inside search or modal inputs.*

---

## 🚀 Installation & Local Development

### Prerequisites
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

### Steps to Run

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the local development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173) in your browser.

3. **Run automated tests**:
   ```bash
   npm test
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```
   Preview the production build locally:
   ```bash
   npm run preview
   ```

---

## 🎵 Audio Attribution & Licensing

All audio tracks bundled in this application are legally usable, royalty-free, or open-source:
1. **Original Synthesized Compositions** (`public/audio/*.wav`):
   - *Neon Horizon*, *Midnight Chill*, *Solar Drift*, *Celestial Echoes*, *Electric Pulse*, *Velvet Groove*, *Hyper Velocity*, *Prism Light*, *Tokyo Rain*, *Astral Drift*.
   - Composed and generated for SONORA. Public Domain / CC0 equivalent.
2. **SoundHelix Studio Sessions** (`public/audio/soundhelix-*.mp3`):
   - *Odyssey Phase I* (SoundHelix-Song-1)
   - *Parallel Waves* (SoundHelix-Song-2)
   - *Equinox Motion* (SoundHelix-Song-3)
   - *Cascade Spectrum* (SoundHelix-Song-8)
   - Created by Thomas Schürger via SoundHelix (algorithmic music engine). Licensed under [Creative Commons Attribution-ShareAlike 2.0 Generic (CC BY-SA 2.0)](https://creativecommons.org/licenses/by-sa/2.0/).

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 with TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v3 with custom SONORA theme tokens
- **Routing**: React Router v7 (`BrowserRouter`, nested layouts, dynamic route params)
- **State Management**: Zustand v5
  - `playerStore`: Core audio controls, queue ordering, volume, shuffle, repeat
  - `progressStore`: High-frequency audio playback progress
  - `libraryStore`: User playlists, liked tracks, recently played history with `safeStorage`
  - `uiStore`: Toasts, modals, drawer toggles
- **Persistence**: Safe `localStorage` layer with in-memory fallback for cross-session storage
- **Icons**: Lucide React
