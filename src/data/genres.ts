export interface GenreCategory {
  id: string;
  name: string;
  gradient: string;
  iconName: string;
  description: string;
}

export const GENRES: GenreCategory[] = [
  {
    id: 'trending-india',
    name: 'Trending Hindi',
    gradient: 'from-[#D4FF00]/30 to-[#84CC16]/20 border-[#D4FF00]/40',
    iconName: 'Flame',
    description: 'Chart-topping Bollywood hits, viral sensations & nationwide favorites',
  },
  {
    id: 'romantic-hindi',
    name: 'Romantic Hindi',
    gradient: 'from-[#f43f5e]/40 to-[#be123c]/40 border-[#f43f5e]/30',
    iconName: 'Heart',
    description: 'Soul-stirring love ballads, monsoon romance & intimate duets',
  },
  {
    id: 'hindi-indie',
    name: 'Hindi Indie',
    gradient: 'from-[#38bdf8]/40 to-[#0284c7]/40 border-[#38bdf8]/30',
    iconName: 'Compass',
    description: 'Acoustic fingerpicking, bedroom songwriters & authentic poetry',
  },
  {
    id: 'chill-latenight',
    name: 'Desi Lo-Fi',
    gradient: 'from-[#fb923c]/40 to-[#ea580c]/40 border-[#fb923c]/30',
    iconName: 'Coffee',
    description: 'Dusty vinyl tape saturation, nostalgic chords & 2 AM introspection',
  },
  {
    id: 'bollywood-party',
    name: 'Bollywood Party',
    gradient: 'from-[#eab308]/40 to-[#ca8a04]/40 border-[#eab308]/30',
    iconName: 'Zap',
    description: 'High-octane club bangers, heavy dholak drops & dancefloor energy',
  },
  {
    id: 'heartbreak',
    name: 'Heartbreak Anthems',
    gradient: 'from-[#a855f7]/40 to-[#7e22ce]/40 border-[#a855f7]/30',
    iconName: 'HeartCrack',
    description: 'Cathartic emotional ballads, painful separation & poignant verses',
  },
  {
    id: 'nostalgia',
    name: 'Nostalgia Rewind',
    gradient: 'from-[#10b981]/40 to-[#047857]/40 border-[#10b981]/30',
    iconName: 'Sparkles',
    description: 'Golden 2010s classics, timeless melodies & cherished cinema memories',
  },
  {
    id: 'sufi-soul',
    name: 'Sufi & Soul',
    gradient: 'from-[#6366f1]/40 to-[#4338ca]/40 border-[#6366f1]/30',
    iconName: 'Sun',
    description: 'Spiritual transcendence, classical harmonium counterpoint & deep longing',
  },
];
