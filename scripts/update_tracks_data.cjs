const fs = require('fs');
const path = require('path');

const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, 'real_songs_metadata.json'), 'utf8'));

const existingTracks = [
  { id: 'hindi-track-1', artistId: 'artist-anuv', genre: 'Hindi Indie', mood: 'Hindi Indie & Acoustic', bpm: 86, desc: 'Intimate acoustic fingerpicking guitar layered with heartfelt poetry of unspoken love.' },
  { id: 'hindi-track-2', artistId: 'artist-kushagra', genre: 'Desi Lo-Fi', mood: 'Chill & Late-Night', bpm: 78, desc: 'Nostalgic late-night lo-fi tape saturation, subtle rain texture, and warm mellow keys.' },
  { id: 'hindi-track-3', artistId: 'artist-shashwat', genre: 'Sufi & Soul', mood: 'Sufi & Soul', bpm: 92, desc: 'Contemporary electro-sufi fusion with hypnotic sub frequencies and resonant vocal textures.' },
  { id: 'hindi-track-4', artistId: 'artist-anuv', genre: 'Hindi Indie', mood: 'Romantic Hindi', bpm: 74, desc: 'Tender acoustic declarations of eternal partnership against the quiet backdrop of monsoon rain.' },
  { id: 'hindi-track-5', artistId: 'artist-shreya', genre: 'Trending Hindi', mood: 'Trending Hindi', bpm: 110, desc: 'Soul-stirring romantic ballad reflecting the restless pursuit of a wandering heart.' },
  { id: 'hindi-track-6', artistId: 'artist-vishal', genre: 'Romantic Evenings', mood: 'Romantic Evenings', bpm: 82, desc: 'Warm melodic duet blending acoustic guitar with intimate soul-stirring vocal harmonies.' },
  { id: 'hindi-track-7', artistId: 'artist-gajendra', genre: 'Nostalgia Rewind', mood: 'Nostalgia Rewind', bpm: 124, desc: 'Legendary indie heart-touching anthem of yearnings, memories, and bittersweet nostalgia.' },
  { id: 'hindi-track-8', artistId: 'artist-arijit', genre: 'Romantic Evenings', mood: 'Romantic Evenings', bpm: 80, desc: 'Soulful acoustic interpretation with heartfelt pathos, classical nuances, and tender warmth.' },
  { id: 'hindi-track-9', artistId: 'artist-sachin', genre: 'Bollywood Party', mood: 'Bollywood Party', bpm: 128, desc: 'High-octane club dance phenomenon with contagious brass, pulsating electro bass, and unstoppable party energy.' },
  { id: 'hindi-track-10', artistId: 'artist-jasleen', genre: 'Trending Hindi', mood: 'Trending Hindi', bpm: 104, desc: 'Breezy viral love ballad uniting acoustic guitar strings with acoustic percussion and soaring falsetto.' },
  { id: 'hindi-track-11', artistId: 'artist-anuv', genre: 'Hindi Indie', mood: 'Hindi Indie & Acoustic', bpm: 72, desc: 'Stripped-down indie acoustic storytelling exploring beauty, vulnerability, and longing.' },
  { id: 'hindi-track-12', artistId: 'artist-arijit', genre: 'Trending Hindi', mood: 'Trending Hindi', bpm: 96, desc: 'Modern cinematic romantic anthem featuring expansive acoustic guitar and sweeping vocal dynamics.' },
  { id: 'hindi-track-13', artistId: 'artist-arijit', genre: 'Bollywood Party', mood: 'Bollywood Party', bpm: 120, desc: 'Irresistible modern dance groove packed with bouncy bass, infectious vocal chemistry, and pop hooks.' },
  { id: 'hindi-track-14', artistId: 'artist-arijit', genre: 'Romantic Evenings', mood: 'Romantic Evenings', bpm: 88, desc: 'Acoustic-driven folk-pop ballad with hauntingly beautiful melodies and tender romantic longing.' },
  { id: 'hindi-track-15', artistId: 'artist-jasleen', genre: 'Trending Hindi', mood: 'Romantic Hindi', bpm: 85, desc: 'Melodramatic Punjabi-Hindi folk ballad of enduring lovers separated by distant horizons.' },
  { id: 'hindi-track-16', artistId: 'artist-arijit', genre: 'Trending Hindi', mood: 'Trending Hindi', bpm: 94, desc: 'Modern timeless classic celebrating saffron hues, divine connection, and transcendent romance.' },
  { id: 'hindi-track-17', artistId: 'artist-arijit', genre: 'Heartbreak Anthems', mood: 'Heartbreak Anthems', bpm: 76, desc: 'Poignant acoustic ballad of emotional catharsis, lingering separation, and unrequited love.' },
  { id: 'hindi-track-18', artistId: 'artist-arijit', genre: 'Bollywood Party', mood: 'Bollywood Party', bpm: 116, desc: 'Wanderlust-infused acoustic pop anthem celebrating spontaneous adventures and boundless freedom.' },
  { id: 'hindi-track-19', artistId: 'artist-arijit', genre: 'Romantic Evenings', mood: 'Romantic Evenings', bpm: 90, desc: 'Heartwarming acoustic ode to finding absolute contentment in the arms of one true love.' },
  { id: 'hindi-track-20', artistId: 'artist-jasleen', genre: 'Hindi Indie', mood: 'Hindi Indie & Acoustic', bpm: 84, desc: 'Delicate acoustic tapestry exploring timeless romance and poetic escapism.' },
];

const albumMap = {
  'hindi-track-1': { albumId: 'album-arz', albumTitle: 'Gulaab & Lamhe' },
  'hindi-track-2': { albumId: 'album-finding-her', albumTitle: 'Finding Her' },
  'hindi-track-3': { albumId: 'album-arz', albumTitle: 'Dhurandhar' },
  'hindi-track-4': { albumId: 'album-arz', albumTitle: 'Jo Tum Mere Ho' },
  'hindi-track-5': { albumId: 'album-arz', albumTitle: 'Ek Tha Tiger' },
  'hindi-track-6': { albumId: 'album-zara-hatke', albumTitle: 'Tum Ho Toh' },
  'hindi-track-7': { albumId: 'album-nostalgia', albumTitle: 'Table No. 21' },
  'hindi-track-8': { albumId: 'album-humpty', albumTitle: 'Humpty Sharma Ki Dulhania' },
  'hindi-track-9': { albumId: 'album-stree-2', albumTitle: 'Stree 2' },
  'hindi-track-10': { albumId: 'album-heeriye', albumTitle: 'Heeriye' },
  'hindi-track-11': { albumId: 'album-husn', albumTitle: 'Husn' },
  'hindi-track-12': { albumId: 'album-dunki', albumTitle: 'Dunki' },
  'hindi-track-13': { albumId: 'album-jawan', albumTitle: 'Jawan' },
  'hindi-track-14': { albumId: 'album-bhediya', albumTitle: 'Bhediya' },
  'hindi-track-15': { albumId: 'album-shershaah', albumTitle: 'Shershaah' },
  'hindi-track-16': { albumId: 'album-kesariya', albumTitle: 'Brahmastra' },
  'hindi-track-17': { albumId: 'album-tamasha', albumTitle: 'Tamasha' },
  'hindi-track-18': { albumId: 'album-yjhd', albumTitle: 'Yeh Jawaani Hai Deewani' },
  'hindi-track-19': { albumId: 'album-zara-hatke', albumTitle: 'Zara Hatke Zara Bachke' },
  'hindi-track-20': { albumId: 'album-baar-baar', albumTitle: 'Baar Baar Dekho' },
};

function cleanTitle(name) {
  return name
    .replace(/\s*\(From.*?\)/i, '')
    .replace(/\s*-\s*Single/i, '')
    .replace(/\s*Coke Studio Bharat/i, '')
    .replace(/\s*\(Remix\)/i, '')
    .trim();
}

const tracksArray = metadata.map((m, idx) => {
  const extra = existingTracks[idx] || {};
  const alb = albumMap[m.id] || { albumId: 'album-arz', albumTitle: m.albumName };
  return {
    id: m.id,
    title: cleanTitle(m.trackName),
    artistId: extra.artistId || 'artist-arijit',
    artistName: m.artistName,
    albumId: alb.albumId || 'album-arz',
    albumTitle: alb.albumTitle || m.albumName,
    duration: 30,
    genre: extra.genre || 'Trending Hindi',
    mood: extra.mood || 'Romantic Hindi',
    language: 'Hindi',
    playbackStatus: 'playable',
    artworkUrl: m.artworkUrl,
    audioUrl: m.localAudioUrl,
    year: parseInt(m.releaseDate, 10) || 2024,
    bpm: extra.bpm || 90,
    playCount: 1400000 + (idx * 234150),
    hasSyncedLyrics: true,
    description: extra.desc,
    externalStreamingUrl: m.previewUrl,
  };
});

const content = `import type { Track } from '../types/music';\n\nexport const TRACKS: Track[] = ${JSON.stringify(tracksArray, null, 2)};\n`;

const targetFile = path.join(__dirname, '..', 'src', 'data', 'tracks.ts');
fs.writeFileSync(targetFile, content);
console.log(`Successfully updated ${targetFile} with ${tracksArray.length} authentic tracks!`);
