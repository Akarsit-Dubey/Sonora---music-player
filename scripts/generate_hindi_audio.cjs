// Generates Hindi Indie, Sufi, Romantic, and Lo-Fi Acoustic audio tracks locally
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const NUM_CHANNELS = 2; // Stereo
const BYTES_PER_SAMPLE = 2; // 16-bit

function createWavHeader(numFrames) {
  const dataSize = numFrames * NUM_CHANNELS * BYTES_PER_SAMPLE;
  const buffer = Buffer.alloc(44);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(NUM_CHANNELS, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(SAMPLE_RATE * NUM_CHANNELS * BYTES_PER_SAMPLE, 28);
  buffer.writeUInt16LE(NUM_CHANNELS * BYTES_PER_SAMPLE, 32);
  buffer.writeUInt16LE(BYTES_PER_SAMPLE * 8, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

function m2f(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

const hindiTracks = [
  {
    filename: 'sufi-acoustic.wav',
    durationSec: 42,
    bpm: 86,
    // D minor Raag Bhairavi / Kafi scale: D, E, F, G, A, Bb, C
    scale: [50, 52, 53, 55, 57, 58, 60, 62],
    chords: [
      [38, 50, 57, 62, 65], // Dm
      [34, 46, 53, 58, 62], // Bb
      [36, 48, 55, 60, 64], // C
      [33, 45, 52, 57, 60], // Am
    ],
    type: 'indie_acoustic'
  },
  {
    filename: 'desi-lofi.wav',
    durationSec: 38,
    bpm: 78,
    // G minor Raag Asavari: G, A, Bb, C, D, Eb, F
    scale: [43, 46, 48, 50, 53, 55, 58, 62],
    chords: [
      [31, 43, 50, 55, 58], // Gm
      [39, 51, 58, 63, 67], // Eb
      [34, 46, 53, 58, 62], // Bb
      [36, 48, 55, 60, 63], // Cm
    ],
    type: 'desi_lofi'
  },
  {
    filename: 'bollywood-romance.wav',
    durationSec: 44,
    bpm: 92,
    // F major / D minor romantic ballad
    scale: [41, 45, 48, 52, 53, 57, 60, 65],
    chords: [
      [41, 53, 60, 65, 69], // Fmaj7
      [38, 50, 57, 60, 65], // Dm7
      [34, 46, 53, 58, 62], // Bb
      [36, 48, 55, 60, 64], // C
    ],
    type: 'romance'
  },
  {
    filename: 'monsoon-melody.wav',
    durationSec: 40,
    bpm: 74,
    // Raag Megh / Malhar mood
    scale: [50, 53, 55, 57, 60, 62, 65],
    chords: [
      [38, 50, 57, 62], // Dm
      [36, 48, 55, 60], // Csus2
      [34, 46, 53, 58], // Bbsus2
      [38, 50, 57, 60], // Dm7
    ],
    type: 'monsoon'
  },
  {
    filename: 'punjabi-pop.wav',
    durationSec: 36,
    bpm: 110,
    // Energetic Punjabi rhythm
    scale: [48, 51, 53, 55, 58, 60, 63],
    chords: [
      [36, 48, 55, 60], // Cm
      [39, 51, 58, 63], // Eb
      [34, 46, 53, 58], // Bb
      [32, 44, 51, 56], // Ab
    ],
    type: 'punjabi'
  },
  {
    filename: 'nostalgia-ghazal.wav',
    durationSec: 45,
    bpm: 72,
    // Raag Yaman / Kalyan: C, D, E, F#, G, A, B
    scale: [48, 50, 52, 54, 55, 57, 59, 60],
    chords: [
      [36, 48, 52, 55], // C
      [38, 50, 54, 57], // D
      [33, 45, 48, 52], // Am
      [35, 47, 50, 55], // G
    ],
    type: 'ghazal'
  },
];

function generateTrack(tConfig, outPath) {
  const numFrames = Math.floor(tConfig.durationSec * SAMPLE_RATE);
  const pcmBuffer = Buffer.alloc(numFrames * NUM_CHANNELS * BYTES_PER_SAMPLE);

  const beatSec = 60 / tConfig.bpm;
  const numChords = tConfig.chords.length;

  for (let i = 0; i < numFrames; i++) {
    const time = i / SAMPLE_RATE;
    const currentBeat = time / beatSec;
    const chordIndex = Math.floor(currentBeat / 4) % numChords;
    const chord = tConfig.chords[chordIndex];
    const beatPhase = currentBeat % 1.0;
    const barPhase = currentBeat % 4.0;

    let sigL = 0;
    let sigR = 0;

    // 1. Percussion (Tabla / Dholak / Soft boom-bap pulse)
    if (tConfig.type === 'punjabi') {
      // Dhol rhythm on 0, 1.5, 2, 3.5
      const isDhol = (barPhase < 0.2) || (barPhase >= 1.4 && barPhase < 1.6) || (barPhase >= 2.0 && barPhase < 2.2);
      if (isDhol) {
        const dTime = (beatPhase % 0.5) * beatSec;
        const kick = Math.sin(dTime * 2 * Math.PI * (110 * Math.exp(-dTime * 28))) * Math.exp(-dTime * 15) * 0.45;
        sigL += kick; sigR += kick;
      }
      // Clap on 1 and 3
      if ((barPhase >= 1.0 && barPhase < 1.25) || (barPhase >= 3.0 && barPhase < 3.25)) {
        const clap = (Math.random() * 2 - 1) * Math.exp(-beatPhase * 20) * 0.25;
        sigL += clap; sigR += clap;
      }
    } else {
      // Gentle Tabla / Acoustic rhythm
      const isDayan = (barPhase < 0.18) || (barPhase >= 2.0 && barPhase < 2.18);
      if (isDayan) {
        const tTime = beatPhase * beatSec;
        // Resonant tabla bayan sub + harmonic
        const sub = Math.sin(tTime * 2 * Math.PI * (90 * Math.exp(-tTime * 20))) * Math.exp(-tTime * 12) * 0.35;
        sigL += sub; sigR += sub;
      }
      // Tabla Dayan high metallic ring on beat 1 & 3
      if ((barPhase >= 1.0 && barPhase < 1.2) || (barPhase >= 3.0 && barPhase < 3.2)) {
        const sTime = (barPhase % 1.0) * beatSec;
        const tone = Math.sin(sTime * 2 * Math.PI * 340) * Math.exp(-sTime * 30) * 0.18;
        const snap = (Math.random() * 2 - 1) * Math.exp(-sTime * 40) * 0.12;
        sigL += (tone + snap); sigR += (tone + snap);
      }
    }

    // 2. Warm Bass Foundation
    const rootFreq = m2f(chord[0]);
    const bass = Math.sin(time * 2 * Math.PI * rootFreq) * 0.28;
    sigL += bass; sigR += bass;

    // 3. Acoustic Fingerpicking Guitar / Harmonium Chords
    for (let c = 1; c < chord.length; c++) {
      const freq = m2f(chord[c]);
      // Fingerpick pattern: arp on 1/2 beats
      const arpBeat = (currentBeat * 2) % chord.length;
      const isPick = Math.floor(arpBeat) === c;
      const pickPhase = (currentBeat * 2) % 1.0;
      const pickEnv = isPick ? Math.exp(-pickPhase * 5) : 0.25;

      const osc = (Math.sin(time * 2 * Math.PI * freq) + 0.3 * Math.sin(time * 2 * Math.PI * freq * 2)) * 0.08 * pickEnv;
      sigL += osc * (c % 2 === 0 ? 0.8 : 0.4);
      sigR += osc * (c % 2 === 0 ? 0.4 : 0.8);
    }

    // 4. Soulful Melodic Lead (Bansuri Flute / Sarod feel)
    const leadStep = Math.floor(currentBeat * 2) % tConfig.scale.length;
    const leadMidi = tConfig.scale[leadStep] + 12;
    const leadFreq = m2f(leadMidi);
    const leadPhase = (currentBeat * 2) % 1.0;
    const leadEnv = Math.exp(-leadPhase * 3.5);
    // Add subtle Indian vibrato / meend
    const vibrato = 1.0 + 0.015 * Math.sin(time * 2 * Math.PI * 5.5);
    const lead = Math.sin(time * 2 * Math.PI * (leadFreq * vibrato)) * leadEnv * 0.12;

    sigL += lead * 0.6;
    sigR += lead * 0.4;

    // Fade in / out
    let env = 1.0;
    if (time < 1.5) env = time / 1.5;
    if (time > tConfig.durationSec - 2.5) env = Math.max(0, (tConfig.durationSec - time) / 2.5);

    sigL = Math.max(-0.95, Math.min(0.95, sigL * env));
    sigR = Math.max(-0.95, Math.min(0.95, sigR * env));

    const offset = i * NUM_CHANNELS * BYTES_PER_SAMPLE;
    pcmBuffer.writeInt16LE(Math.floor(sigL * 32767), offset);
    pcmBuffer.writeInt16LE(Math.floor(sigR * 32767), offset + 2);
  }

  const header = createWavHeader(numFrames);
  const fd = fs.openSync(outPath, 'w');
  fs.writeSync(fd, header);
  fs.writeSync(fd, pcmBuffer);
  fs.closeSync(fd);
  console.log(`Generated Hindi Audio: ${tConfig.filename} (${tConfig.durationSec}s)`);
}

const outDir = path.join(__dirname, '..', 'public', 'audio');
for (const t of hindiTracks) {
  generateTrack(t, path.join(outDir, t.filename));
}
console.log('All Hindi audio tracks created successfully!');
