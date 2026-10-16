const fs = require('fs');
const path = require('path');

const TRACK_QUERIES = [
  { id: 'hindi-track-1', query: 'Arz Kiya Hai Anuv Jain' },
  { id: 'hindi-track-2', query: 'Finding Her Kushagra' },
  { id: 'hindi-track-3', query: 'Gehra Hua Dhurandhar Shashwat Sachdev' },
  { id: 'hindi-track-4', query: 'Jo Tum Mere Ho Anuv Jain' },
  { id: 'hindi-track-5', query: 'Saiyaara Ek Tha Tiger' },
  { id: 'hindi-track-6', query: 'Tum Ho Toh Vishal Mishra Saiyaara' },
  { id: 'hindi-track-7', query: 'Mann Mera Gajendra Verma Table No 21' },
  { id: 'hindi-track-8', query: 'Samjhawan Humpty Sharma Ki Dulhania Arijit Singh' },
  { id: 'hindi-track-9', query: 'Aaj Ki Raat Stree 2 Sachin Jigar' },
  { id: 'hindi-track-10', query: 'Heeriye Jasleen Royal Arijit Singh' },
  { id: 'hindi-track-11', query: 'Husn Anuv Jain' },
  { id: 'hindi-track-12', query: 'O Maahi Dunki Arijit Singh' },
  { id: 'hindi-track-13', query: 'Chaleya Jawan Arijit Singh' },
  { id: 'hindi-track-14', query: 'Apna Bana Le Bhediya Arijit Singh' },
  { id: 'hindi-track-15', query: 'Ranjha Shershaah B Praak' },
  { id: 'hindi-track-16', query: 'Kesariya Brahmastra Arijit Singh' },
  { id: 'hindi-track-17', query: 'Agar Tum Saath Ho Tamasha Arijit Singh' },
  { id: 'hindi-track-18', query: 'Ilahi Yeh Jawaani Hai Deewani Arijit Singh' },
  { id: 'hindi-track-19', query: 'Phir Aur Kya Chahiye Zara Hatke Zara Bachke Arijit Singh' },
  { id: 'hindi-track-20', query: 'Kho Gaye Hum Kahan Baar Baar Dekho Jasleen Royal' },
];

async function run() {
  const results = [];
  const audioDir = path.join(__dirname, '..', 'public', 'audio');
  if (!fs.existsSync(audioDir)) {
    fs.mkdirSync(audioDir, { recursive: true });
  }

  for (const item of TRACK_QUERIES) {
    console.log(`Searching for ${item.id}: "${item.query}"...`);
    try {
      const searchUrl = `https://itunes.apple.com/search?term=${encodeURIComponent(item.query)}&country=IN&media=music&limit=3`;
      const res = await fetch(searchUrl);
      const data = await res.json();
      
      const match = data.results && data.results.find(r => r.previewUrl);
      if (!match) {
        console.error(`No preview found for ${item.id}`);
        continue;
      }

      console.log(`Found: "${match.trackName}" by "${match.artistName}"`);
      const audioPath = path.join(audioDir, `${item.id}.m4a`);
      
      console.log(`Downloading audio from ${match.previewUrl}...`);
      const audioRes = await fetch(match.previewUrl);
      const audioBuffer = await audioRes.arrayBuffer();
      fs.writeFileSync(audioPath, Buffer.from(audioBuffer));

      const artwork = match.artworkUrl100
        ? match.artworkUrl100.replace('100x100bb', '600x600bb')
        : '';

      results.push({
        id: item.id,
        trackName: match.trackName,
        artistName: match.artistName,
        albumName: match.collectionName || match.trackName,
        artworkUrl: artwork,
        previewUrl: match.previewUrl,
        localAudioUrl: `/audio/${item.id}.m4a`,
        fileSize: audioBuffer.byteLength,
        releaseDate: match.releaseDate ? match.releaseDate.substring(0, 4) : '2023',
      });
      console.log(`Saved ${item.id}.m4a (${audioBuffer.byteLength} bytes)`);
    } catch (err) {
      console.error(`Error processing ${item.id}:`, err);
    }
  }

  const outputPath = path.join(__dirname, 'real_songs_metadata.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  console.log(`\nAll done! Saved metadata for ${results.length} tracks to ${outputPath}`);
}

run();
