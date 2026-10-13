# SONORA V2 — Hindi Music Experience & Synchronized Lyrics

**SONORA** is a premium, high-fidelity music streaming web application designed with an editorial aesthetic, deep charcoal surfaces, and restrained electric-lime accents. SONORA V2 elevates the platform into a curated **Hindi & Indian Indie music experience** with an interactive **Synchronized Lyrics engine**, custom LRC file import, and 100% playable local audio tracks.

> **Tagline**: *"Find your frequency."*

---

## ✨ What's New in SONORA V2

### 🎤 1. Synchronized Lyrics Experience
- **Dedicated Lyrics Button**: A high-visibility `Mic2` toggle in the persistent bottom player (and `Ctrl+L` shortcut) opens an immersive lyrics panel.
- **Dynamic Backdrop & Ambient Blur**: Features an art-directed backdrop derived from the currently playing album artwork with deep scrim gradients to maintain ultra-crisp legibility.
- **Real-Time Active Line Synchronization**: Smoothly tracks the exact playback timestamp of the audio engine. The current lyric line is highlighted in electric lime and rendered with high visual weight, while past/future lines fade to lower opacity.
- **Auto-Scroll with Smart Resumption**: Automatically centers the active line. Users can scroll freely, and clicking any line will re-engage auto-scroll.
- **Click-to-Seek**: Click any timestamped lyric line to instantly jump playback to that exact second in the track.
- **Custom LRC File Importer**: Bring your own lyrics! Users can click **Import LRC** to load standard `.lrc` files from disk. Imported lyrics are validated, parsed, and stored permanently in `localStorage` with a `CUSTOM LRC` badge.
- **Graceful Unavailable State**: Tracks without synchronized lyrics display a polite, informative state with a single-click link to search external verified sources on Google/Genius.

### 🇮🇳 2. Curated Hindi Music Catalogue
The previous demo collection has been replaced with an authentic 20-track curated Hindi catalog across 6 signature categories:
1. **Trending Hindi & Bollywood**: *Jo Tum Mere Ho*, *Kesariya*, *Apna Bana Le*, *Chaleya*, *O Maahi*.
2. **Romantic Hindi Melodies**: *Samjhawan*, *Tum Ho Toh*, *Heeriye*, *Ranjha*, *Phir Aur Kya Chahiye*.
3. **Indie & Acoustic Soundscapes**: *Husn*, *Arz Kiya Hai*, *Kho Gaye Hum Kahan*, *Finding Her*, *Gehra Hua*.
4. **Chill, Late-Night & Desi Lo-Fi**: *Baarishein (Midnight Acoustic)*, *Kyun (Late Night Waves)*, *Chhaliya (Desi Lo-Fi Rework)*.
5. **Bollywood Party & High-Energy**: *Aaj Ki Raat*, *Ilahi*.
6. **Nostalgic Favorites**: *Mann Mera*, *Agar Tum Saath Ho*.

### 👤 Featured Artists & Sound Architects
Includes rich profiles, listener metrics, genres, and biographies for 11 iconic artists:
- **Anuv Jain** (Indie Acoustic, Folk Pop)
- **Arijit Singh** (Bollywood, Romantic Playback)
- **Jasleen Royal** (Indie Pop, Acoustic)
- **Prateek Kuhad** (Indie Folk, Acoustic)
- **Vishal Mishra** (Sufi, Bollywood Romance)
- **Shreya Ghoshal** (Classical, Filmi Melody)
- **Sachin-Jigar** (Electronic Dance, Bollywood)
- **Kushagra** (Alternative Indie)
- **Gajendra Verma** (Pop, Heartbreak)
- **Shashwat Sachdev** (Cinematic Fusion)
- **B Praak** (Punjabi Soul, Melodrama)

---

## 🎧 Audio Playback & Persistent Engine

- **Headless Audio Engine**: Built around a single, persistent `HTMLAudioElement` that remains mounted and uninterrupted during in-app navigation across all routes.
- **Verified Local Audio (100% Playable)**: Every single track in the catalog maps to an actual playable audio file bundled directly in `/public/audio/`. Includes 6 custom-synthesized Indian acoustic/Sufi/Desi Lo-Fi tracks with authentic bansuri flute and tabla percussion, alongside studio electronic compositions.
- **Full Playback Controls**: Play, pause, scrub/seek, skip next, return previous, dynamic volume control with mute toggle, repeat modes (`off`, `all`, `one`), and non-destructive queue shuffling.
- **Isolated High-Frequency Store**: Audio progress (`timeupdate`) runs in an isolated Zustand store so only progress seekers and timestamp indicators re-render—keeping the entire page and queue buttery smooth at 60+ FPS.
- **Hardware Media Keys & Lockscreen**: Full integration with the `navigator.mediaSession` API for system media key control, lockscreen metadata, and artwork display.
- **Autoplay Handling**: Gracefully catches browser autoplay policy blocks and manages loading/buffering states with zero console panics.

---

## 🧭 Navigation & Core Areas

1. **Sidebar Navigation**:
   - Original SONORA wordmark and geometric sound frequency branding.
   - Quick routes to **Home**, **Discover**, **Search**, **Your Library**, and **Liked Songs**.
   - User playlists list with live count badges and a dedicated **Create Playlist** trigger.
2. **Home Page**:
   - Dynamic time-of-day greeting (*"Late Night Frequencies"*, *"Good Morning"*, *"Good Evening"*).
   - Featured editorial album banner (*Gulaab & Lamhe* by Anuv Jain) with one-click album playback.
   - "Recently Played" quick rotation shelf.
   - "Trending in India" curated Hindi picks shelf.
   - Curated Hindi compilations and mood discovery portals.
3. **Discover Page**:
   - Interactive Hindi mood & genre filter pills with live track counts.
   - Featured artists horizon with round avatars and bios.
   - Notable album releases and curated compilation cards.
4. **Instant Search**:
   - Reactive search input that filters in real-time across track titles, artists, albums, and genres.
   - Dedicated category tiles when empty, and multi-category results (Artists, Songs, Albums).
5. **Your Library**:
   - Unified overview with tabs for **All**, **Playlists**, **Liked Songs**, and **Albums**.
   - Multi-field sorting by Recently Added, Track Title (A–Z), and Artist Name.
6. **Queue Drawer**:
   - Slide-out queue overlay showing the currently playing track and upcoming queue.
   - Jump directly to any track, remove tracks, or clear the queue.

---

## ⌨️ Keyboard Shortcuts

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
| `Ctrl + L` | Toggle Synchronized Lyrics |
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

3. **Run automated test suite**:
   ```bash
   npm test
   ```

4. **Run linter**:
   ```bash
   npm run lint
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

6. **Preview the production build**:
   ```bash
   npm run preview
   ```

---

## 🧪 Testing & Verification

The project includes unit and integration tests powered by Vitest and Happy-DOM:
- **`src/test/lyrics.test.ts`**: Verifies LRC parser accuracy, timestamp conversion, active line indexing, serialization, and `useLyricsStore` actions.
- **`src/test/app.test.tsx`**: Verifies full application integration, navigation, search filtering for Hindi artists, lyrics modal opening/closing, and shortcut modals.
- **`src/test/playerStore.test.ts`**: Verifies playback state machine, queue manipulation, repeat modes, and volume control.
- **`src/test/libraryStore.test.ts`**: Verifies playlist creation, like/unlike toggles, and safe persistence.
- **`src/test/utils.test.ts`**: Verifies timestamp formatting and SVG artwork generation.

All 32 tests pass cleanly with 0 warnings and 0 errors in linting and TypeScript compilation.

---

## 🛠️ Architecture & Tech Stack

- **Framework**: React 19 with TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v3 with custom SONORA theme tokens
- **Routing**: React Router v7 (`BrowserRouter`, nested layouts, dynamic route params)
- **State Management**: Zustand v5
  - `playerStore`: Core audio controls, queue ordering, volume, shuffle, repeat
  - `progressStore`: High-frequency audio playback progress (`timeupdate`)
  - `lyricsStore`: Synchronized lyrics modal state, fullscreen toggle, custom LRC file importer
  - `libraryStore`: User playlists, liked tracks, recently played history with `safeStorage`
  - `uiStore`: Toasts, modals, drawer toggles
- **Persistence**: Safe `localStorage` layer (`safeStorage`) with in-memory fallback for cross-session storage
- **Icons**: Lucide React
