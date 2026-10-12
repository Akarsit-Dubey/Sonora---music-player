export interface GenreCategory {
  id: string;
  name: string;
  gradient: string;
  iconName: string;
  description: string;
}

export const GENRES: GenreCategory[] = [
  {
    id: 'synthwave',
    name: 'Synthwave',
    gradient: 'from-[#ff007f]/40 to-[#7928ca]/40 border-[#ff007f]/30',
    iconName: 'Radio',
    description: 'Analog synthesizers, 80s nostalgia & nocturnal drives',
  },
  {
    id: 'lofi',
    name: 'Lo-Fi Beats',
    gradient: 'from-[#fb923c]/40 to-[#ea580c]/40 border-[#fb923c]/30',
    iconName: 'Coffee',
    description: 'Dusty vinyl warmth, tape wobble & study sessions',
  },
  {
    id: 'deephouse',
    name: 'Deep House',
    gradient: 'from-[#06b6d4]/40 to-[#0284c7]/40 border-[#06b6d4]/30',
    iconName: 'Disc',
    description: 'Hypnotic sub rhythms & twilight dancefloors',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    gradient: 'from-[#38bdf8]/40 to-[#6366f1]/40 border-[#38bdf8]/30',
    iconName: 'CloudRain',
    description: 'Endless reverb decays, modular drones & sonic spaces',
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    gradient: 'from-[#10b981]/40 to-[#047857]/40 border-[#10b981]/30',
    iconName: 'Zap',
    description: 'Aggressive distortion, dystopia & industrial drive',
  },
  {
    id: 'neosoul',
    name: 'Neo-Soul',
    gradient: 'from-[#f43f5e]/40 to-[#be123c]/40 border-[#f43f5e]/30',
    iconName: 'Heart',
    description: 'Soulful chords, buttery grooves & vintage character',
  },
  {
    id: 'electronic',
    name: 'Electronic',
    gradient: 'from-[#a855f7]/40 to-[#7e22ce]/40 border-[#a855f7]/30',
    iconName: 'Cpu',
    description: 'Algorithmic arrangements, counterpoint & modulation',
  },
  {
    id: 'dnb',
    name: 'Drum & Bass',
    gradient: 'from-[#eab308]/40 to-[#ca8a04]/40 border-[#eab308]/30',
    iconName: 'Activity',
    description: '170+ BPM breakbeats, Reese basses & rapid velocity',
  },
];
