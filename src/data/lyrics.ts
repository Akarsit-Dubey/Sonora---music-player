import type { TrackLyrics } from '../types/lyrics';

export const BUILT_IN_LYRICS: Record<string, TrackLyrics> = {
  // 1. Arz Kiya Hai (Indie Acoustic)
  'hindi-track-1': {
    trackId: 'hindi-track-1',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Acoustic strumming intro)' },
      { time: 3.5, text: 'Arz kiya hai rooh ki dastaan...' },
      { time: 7.8, text: 'Khwaab jo dekhe the humne wahan' },
      { time: 12.4, text: 'Kuchh lafz bache hain tere bina' },
      { time: 17.0, text: 'Kya tum bhi sunte ho meri sadaa?' },
      { time: 22.2, text: '♪ (Melodic acoustic breakdown)' },
      { time: 26.5, text: 'Har shaam dhali ek yaad ke sang' },
      { time: 31.0, text: 'Rang saare tere, saari meri berang' },
      { time: 36.2, text: 'Bas itna sa arz kiya hai...' },
      { time: 40.0, text: '♪ (Outro fade)' },
    ],
  },

  // 2. Finding Her (Indie Chill / Ambient)
  'hindi-track-2': {
    trackId: 'hindi-track-2',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Warm tape Rhodes & rainfall)' },
      { time: 4.2, text: 'Dhoondhta raha un galiyon mein tujhe' },
      { time: 8.8, text: 'Jahan hawaaon ne chhua tha mujhe' },
      { time: 13.5, text: 'Kahan kho gayi woh haseen roshni?' },
      { time: 18.0, text: 'Yeh raat bachi hai aur tanha main hi' },
      { time: 23.0, text: 'Finding her in every passing street...' },
      { time: 28.2, text: 'Har aahat pe rukti hai dil ki yeh beat' },
      { time: 33.0, text: 'Kash tu laut aaye phir se yahin' },
      { time: 36.0, text: '♪ (Gentle piano fade)' },
    ],
  },

  // 3. Gehra Hua (Deep Electro-Sufi)
  'hindi-track-3': {
    trackId: 'hindi-track-3',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Four-on-the-floor pulse & synth)' },
      { time: 4.0, text: 'Silsila yeh gehra hua...' },
      { time: 8.5, text: 'Rooh pe tera pehra hua' },
      { time: 13.2, text: 'Doobte gaye hum shaam ke sang' },
      { time: 17.8, text: 'Ishq ka rang sunehra hua' },
      { time: 22.5, text: '♪ (Rolling sub-bass & lead)' },
      { time: 27.0, text: 'Kaisi yeh fiza, kaisa fitoor' },
      { time: 31.5, text: 'Paas hoke bhi tu kyun hai door?' },
      { time: 35.8, text: 'Gehra hua... silsila gehra hua' },
    ],
  },

  // 4. Jo Tum Mere Ho (Acoustic Ballad)
  'hindi-track-4': {
    trackId: 'hindi-track-4',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Ethereal ambient harmony)' },
      { time: 5.0, text: 'Jo tum mere ho, to khauf kya?' },
      { time: 10.5, text: 'Yeh zameen kya hai, yeh aasmaan kya?' },
      { time: 16.2, text: 'Tujhse shuru, tujhpe khatam' },
      { time: 21.8, text: 'Mere har lafz ka karwaan' },
      { time: 28.0, text: '♪ (Ambient string swell)' },
      { time: 33.5, text: 'Sitaron se aage ek jahan hai naya' },
      { time: 39.0, text: 'Jahan sirf tera mera aashiyana mila' },
      { time: 43.5, text: '♪ (Dissolving shimmer)' },
    ],
  },

  // 5. Saiyaara (Midnight Drive / Electro Groove)
  'hindi-track-5': {
    trackId: 'hindi-track-5',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Aggressive synthwave drive)' },
      { time: 4.2, text: 'Saiyaara re... aawara dil mera' },
      { time: 8.6, text: 'Kyun dhoondhe tu manzil ka kinara?' },
      { time: 13.0, text: 'Raaton ke shehar mein udaan bhari' },
      { time: 17.5, text: 'Toota taara ban ke gira be-sahara' },
      { time: 22.0, text: '♪ (Driving cybernetic bass drop)' },
      { time: 26.8, text: 'Neon roshni mein tera hi chehra' },
      { time: 31.2, text: 'Saiyaara re saiyaara...' },
      { time: 36.0, text: '♪ (Staccato synth outro)' },
    ],
  },

  // 6. Tum Ho Toh (Neo-Soul / Warm Groove)
  'hindi-track-6': {
    trackId: 'hindi-track-6',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Velvet neo-soul chords & pocket beat)' },
      { time: 4.0, text: 'Tum ho toh har lamha khasa lage' },
      { time: 8.5, text: 'Yeh jahan be-matlab bhi pyara lage' },
      { time: 13.0, text: 'Chalti hawa mein khushboo ghuli' },
      { time: 17.8, text: 'Jab se teri nazron se nazar mili' },
      { time: 22.5, text: '♪ (Soulful guitar lick)' },
      { time: 27.0, text: 'Tum ho toh zindagi mein sukoon hai' },
      { time: 31.5, text: 'Haan yehi mera sabse bada junoon hai' },
      { time: 35.0, text: '♪ (Smooth fade out)' },
    ],
  },

  // 7. Mann Mera (High-BPM Electronic)
  'hindi-track-7': {
    trackId: 'hindi-track-7',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Fast breakbeat velocity intro)' },
      { time: 4.0, text: 'Mann mera udd chala hawaaon sang' },
      { time: 8.2, text: 'Bekhabar, be-iraada, leke naye rang' },
      { time: 12.5, text: 'Raftaar tez hai, dhadkan be-lagaam' },
      { time: 17.0, text: 'Likh diya tere naam yeh subah yeh shaam' },
      { time: 21.5, text: '♪ (High-energy drum and bass drop)' },
      { time: 26.2, text: 'Mann mera sambhalti nahi ab dor' },
      { time: 30.8, text: 'Kheencha chala aaye teri hi ore!' },
      { time: 34.5, text: '♪ (Speed rush outro)' },
    ],
  },

  // 8. Samjhawan (Acoustic Downtempo)
  'hindi-track-8': {
    trackId: 'hindi-track-8',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Crystalline pluck & warm pad)' },
      { time: 4.5, text: 'Main tenu samjhawan ki...' },
      { time: 9.0, text: 'Na tere baajon lagda ji' },
      { time: 14.0, text: 'Tu ki jaane pyar mera' },
      { time: 18.5, text: 'Main karaan intezaar tera' },
      { time: 23.5, text: '♪ (Reflective melodic arpeggio)' },
      { time: 28.0, text: 'Dil dharakda tere naam se' },
      { time: 32.5, text: 'Kyun juda tu har aaram se?' },
      { time: 37.0, text: 'Main tenu samjhawan ki...' },
    ],
  },

  // 9. Aaj Ki Raat (Lo-Fi Rainy Beats)
  'hindi-track-9': {
    trackId: 'hindi-track-9',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Tokyo rain & nostalgic Rhodes keys)' },
      { time: 4.0, text: 'Aaj ki raat bachi hai thodi' },
      { time: 8.5, text: 'Chupke se neendein khwaab ne chori' },
      { time: 13.0, text: 'Barsaat ki boondon mein teri pukaar' },
      { time: 17.5, text: 'Kaisi yeh uljhan, kaisa khumaar?' },
      { time: 22.0, text: '♪ (Soft lo-fi drum swing)' },
      { time: 26.5, text: 'Aaj ki raat tham jaaye zara' },
      { time: 31.0, text: 'Tere bina dil rehta hai dara dara' },
      { time: 35.5, text: '♪ (Rain drops & soft chime fade)' },
    ],
  },

  // 10. Heeriye (Melodic Cosmic Techno)
  'hindi-track-10': {
    trackId: 'hindi-track-10',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Cosmic pulse & bass resonance)' },
      { time: 4.5, text: 'Heeriye meri, tu kahan chhupi hai?' },
      { time: 9.0, text: 'Sitaron ki basti mein dhoondhi teri nishaani' },
      { time: 14.0, text: 'Saansein thami hain tere intezaar mein' },
      { time: 18.8, text: 'Likh di yeh rooh teri hi kahani' },
      { time: 24.0, text: '♪ (Deep melodic techno progression)' },
      { time: 29.0, text: 'Heeriye... heeriye...' },
      { time: 34.0, text: 'Sadaa meri sun le heeriye' },
      { time: 39.5, text: '♪ (Atmospheric decay)' },
    ],
  },

  // 11. Husn (Progressive Indian Symphony - Extended 6min)
  'hindi-track-11': {
    trackId: 'hindi-track-11',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Algorithmic orchestral strings & piano)' },
      { time: 12.0, text: 'Dekho dekho kaisa yeh husn tera' },
      { time: 19.5, text: 'Jahan bikhra hai noor sunehra' },
      { time: 28.0, text: 'Khamoshi mein bhi gunjti hai dhun' },
      { time: 36.5, text: 'Tu sun zara mere dil ki pukaar' },
      { time: 48.0, text: '♪ (Polyphonic piano arpeggio movement)' },
      { time: 64.0, text: 'Bas baatein hain ya sach mein hai pyar?' },
      { time: 78.5, text: 'Kyun behta hai aansoon ban ke qarar?' },
      { time: 95.0, text: '♪ (Full orchestral crescendo)' },
      { time: 120.0, text: 'Husn tera ek khwaab suhana' },
      { time: 145.0, text: 'Jise dhoondhta phirta yeh zamana' },
    ],
  },

  // 12. O Maahi (Algorithmic Movement II - Extended 7min)
  'hindi-track-12': {
    trackId: 'hindi-track-12',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Intricate dual-synth counterpoint)' },
      { time: 15.0, text: 'O Maahi tere bina jee na sakein' },
      { time: 24.5, text: 'Dard-e-dil kisi se keh na sakein' },
      { time: 36.0, text: 'Teri aahat pe qurban yeh zindagani' },
      { time: 48.0, text: 'Amrit si meethi teri prem kahani' },
      { time: 65.0, text: '♪ (Dynamic drum modulation)' },
      { time: 85.0, text: 'Rasta tu hi, manzil tu hi' },
      { time: 105.0, text: 'Mere har lafz ki mehfil tu hi' },
    ],
  },

  // 13. Chaleya (Progressive Synth Motion - Extended 5min)
  'hindi-track-13': {
    trackId: 'hindi-track-13',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Pulsing bass groove & syncopation)' },
      { time: 10.0, text: 'Chaleya ishq ki raahon mein be-parwah' },
      { time: 19.0, text: 'Na hosh hai apna, na fikar koi yahan' },
      { time: 30.5, text: 'Teri aankhon mein dooba yeh aalam' },
      { time: 42.0, text: 'Mil gaya humein apna humdum' },
      { time: 55.0, text: '♪ (High-energy arpeggiator build)' },
      { time: 70.0, text: 'Chaleya re chaleya dil yeh bawra' },
    ],
  },

  // 14. Apna Bana Le (Harmonic Flow - Extended 5min)
  'hindi-track-14': {
    trackId: 'hindi-track-14',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Warm syncopated piano & analog leads)' },
      { time: 11.5, text: 'Apna bana le piya, apna bana le' },
      { time: 21.0, text: 'Dil ke kisi kone mein basaa le' },
      { time: 32.0, text: 'Chhod ke duniya ke saare fasane' },
      { time: 44.5, text: 'Aaye hain teri dehliz sajaane' },
      { time: 60.0, text: '♪ (Melodic strings dynamic lift)' },
      { time: 75.0, text: 'Tu hi mera subah, tu hi mera shaam' },
    ],
  },

  // 15. Ranjha (Soulful Folk Ballad)
  'hindi-track-15': {
    trackId: 'hindi-track-15',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Acoustic folk strumming & flute)' },
      { time: 3.5, text: 'Ranjha ve mahi mera ranjha ve...' },
      { time: 8.0, text: 'Kyun chhod gaya tu tanha ve?' },
      { time: 13.0, text: 'Dard judai da sehna mushqil' },
      { time: 17.5, text: 'Tere baajon kiven jeeve mera dil?' },
      { time: 22.0, text: '♪ (Deep soulful bass groove)' },
      { time: 26.5, text: 'Rabba mere nu pukaar karaan' },
      { time: 31.0, text: 'Har pal tera intezaar karaan' },
      { time: 35.0, text: '♪ (Folk whistle fade)' },
    ],
  },

  // 16. Kesariya (Saffron Melodic Ambient)
  'hindi-track-16': {
    trackId: 'hindi-track-16',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Warm ambient pulse & acoustic chords)' },
      { time: 4.0, text: 'Kesariya tera ishq hai piya...' },
      { time: 8.5, text: 'Rang jaaun jo main haath lagaun' },
      { time: 13.2, text: 'Din beete saare teri fikr mein' },
      { time: 17.8, text: 'Rain saari teri khair manaun' },
      { time: 22.5, text: '♪ (Golden synthesizer swell)' },
      { time: 27.0, text: 'Kajal ki siyahi se likhi' },
      { time: 31.2, text: 'Hain tune jaane kitnon ki love storiyaan' },
      { time: 36.5, text: 'Kesariya tera ishq hai piya...' },
    ],
  },

  // 17. Agar Tum Saath Ho (Melancholic Ethereal Space)
  'hindi-track-17': {
    trackId: 'hindi-track-17',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Haunting ambient drone & soft piano)' },
      { time: 5.0, text: 'Pal bhar theher jaao, dil yeh sambhal jaaye' },
      { time: 10.5, text: 'Kaise tumhe rokein, aansoon nikal aaye' },
      { time: 16.2, text: 'Agar tum saath ho...' },
      { time: 21.0, text: 'Har gham aasan ho, har dard dhuaan ho' },
      { time: 27.5, text: '♪ (Strings swell & emotional resonance)' },
      { time: 33.0, text: 'Behte hue lamhe tham jaate yahin' },
      { time: 38.5, text: 'Agar tum saath ho... sirf tum saath ho' },
      { time: 43.5, text: '♪ (Gentle silence)' },
    ],
  },

  // 18. Ilahi (Wanderlust Retro Rhythm)
  'hindi-track-18': {
    trackId: 'hindi-track-18',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Energetic acoustic strum & retro kicks)' },
      { time: 4.0, text: 'Shaamein malang si, raatein surmayi' },
      { time: 8.2, text: 'Hawaaon ne naye geet sunaye' },
      { time: 12.8, text: 'Khul gaya aasmaan, badal chhat gaye' },
      { time: 17.0, text: 'Har mod pe naye raaste aaye' },
      { time: 21.5, text: '♪ (Driving melodic chorus drop)' },
      { time: 26.0, text: 'Ilahi mera jee aaye aaye!' },
      { time: 30.5, text: 'Manmaani karne ki baari aayi' },
      { time: 35.0, text: 'Ilahi... udta chala main hawaaon mein' },
      { time: 40.0, text: '♪ (Uplifting chime outro)' },
    ],
  },

  // 19. Phir Aur Kya Chahiye (Sweet Midnight Ballad)
  'hindi-track-19': {
    trackId: 'hindi-track-19',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Mellow electric keys & gentle vinyl crackle)' },
      { time: 3.8, text: 'Tu hai toh mujhe phir aur kya chahiye?' },
      { time: 8.2, text: 'Kisi ki na madad, na dua chahiye' },
      { time: 13.0, text: 'Tu hai toh zindagi khush-numa hai' },
      { time: 17.5, text: 'Tere bin yeh jahan be-wajah hai' },
      { time: 22.0, text: '♪ (Gentle bass & guitar warmth)' },
      { time: 26.5, text: 'Tu hai toh mujhe phir aur kya chahiye...' },
      { time: 31.0, text: 'Bas tera saath, bas tera pyar chahiye' },
      { time: 35.0, text: '♪ (Warm tape fade)' },
    ],
  },

  // 20. Kho Gaye Hum Kahan (Acoustic Rain Harmony)
  'hindi-track-20': {
    trackId: 'hindi-track-20',
    synced: true,
    source: 'Verified SONORA Studio Transcription',
    lines: [
      { time: 0.0, text: '♪ (Delicate rain drops & soft fingerpicking)' },
      { time: 4.0, text: 'Kho gaye hum kahan, rangon ke iss jahan mein' },
      { time: 8.8, text: 'Chupke se aake bas gaye iss armaan mein' },
      { time: 13.5, text: 'Kagaz ki kashtiyan, meethi si mastiyan' },
      { time: 18.0, text: 'Chhote se khwaab the, haseen si bastiyan' },
      { time: 22.5, text: '♪ (Wistful guitar & shaker groove)' },
      { time: 27.0, text: 'Rooth gaye raste ya mil gayi manzil?' },
      { time: 31.5, text: 'Kho gaye hum kahan... haan kho gaye hum kahan' },
      { time: 36.0, text: '♪ (Gentle chime decay)' },
    ],
  },
};
