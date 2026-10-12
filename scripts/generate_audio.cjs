// Generates rich, melodic, multi-layered WAV audio tracks locally
// Ensures 100% offline playback reliability with zero external dependencies
const fs = require('fs');
const path = require('path');

const SAMPLE_RATE = 44100;
const NUM_CHANNELS = 2; // Stereo
const BYTES_PER_SAMPLE = 2; // 16-bit

function createWavHeader(numFrames) {
  const dataSize = numFrames * NUM_CHANNELS * BYTES_PER_SAMPLE;
  const buffer = Buffer.alloc(44);

  // RIFF identifier
  buffer.write('RIFF', 0);
  // file length minus 8
  buffer.writeUInt32LE(36 + dataSize, 4);
  // RIFF type
  buffer.write('WAVE', 8);
  // format chunk identifier
  buffer.write('fmt ', 12);
  // format chunk length
  buffer.writeUInt32LE(16, 16);
  // sample format (1 is PCM)
  buffer.writeUInt16LE(1, 20);
  // channels
  buffer.writeUInt16LE(NUM_CHANNELS, 22);
  // sample rate
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  // byte rate (sample rate * block align)
  buffer.writeUInt32LE(SAMPLE_RATE * NUM_CHANNELS * BYTES_PER_SAMPLE, 28);
  // block align
  buffer.writeUInt16LE(NUM_CHANNELS * BYTES_PER_SAMPLE, 32);
  // bits per sample
  buffer.writeUInt16LE(BYTES_PER_SAMPLE * 8, 34);
  // data chunk identifier
  buffer.write('data', 36);
  // data chunk length
  buffer.writeUInt32LE(dataSize, 40);

  return buffer;
}

// Convert MIDI note number to frequency in Hz
function m2f(m) {
  return 440 * Math.pow(2, (m - 69) / 12);
}

// Low-pass filter implementation
class LowPassFilter {
  constructor(cutoff, sampleRate) {
    const rc = 1.0 / (cutoff * 2 * Math.PI);
    const dt = 1.0 / sampleRate;
    this.alpha = dt / (rc + dt);
    this.prev = 0;
  }
  process(sample) {
    this.prev = this.prev + this.alpha * (sample - this.prev);
    return this.prev;
  }
}

// Track definitions with musical parameters
const tracksToGenerate = [
  {
    filename: 'neon-horizon.wav',
    title: 'Neon Horizon',
    bpm: 112,
    durationSec: 42,
    scale: [48, 51, 53, 55, 58, 60, 63, 65], // C minor pentatonic / dorian
    chords: [
      [36, 48, 55, 60, 63], // Cm
      [32, 44, 51, 56, 60], // Ab
      [34, 46, 53, 58, 62], // Bb
      [39, 51, 58, 63, 67], // Eb
    ],
    style: 'synthwave',
  },
  {
    filename: 'midnight-chill.wav',
    title: 'Midnight Chill',
    bpm: 82,
    durationSec: 36,
    scale: [53, 57, 60, 62, 65, 69, 72], // F major / D minor
    chords: [
      [41, 53, 60, 64, 69], // Fmaj9
      [45, 57, 60, 64, 67], // Am7
      [38, 50, 57, 60, 65], // Dm9
      [43, 55, 58, 62, 67], // Gm7
    ],
    style: 'lofi',
  },
  {
    filename: 'solar-drift.wav',
    title: 'Solar Drift',
    bpm: 124,
    durationSec: 38,
    scale: [45, 48, 52, 55, 57, 60, 64], // A minor
    chords: [
      [33, 45, 52, 57, 60], // Am
      [36, 48, 55, 60, 64], // C
      [38, 50, 57, 62, 65], // Dm
      [35, 47, 55, 59, 62], // G
    ],
    style: 'deephouse',
  },
  {
    filename: 'celestial-echoes.wav',
    title: 'Celestial Echoes',
    bpm: 68,
    durationSec: 45,
    scale: [46, 50, 53, 58, 62, 65, 70], // Bb lydian
    chords: [
      [34, 46, 53, 58, 62], // Bb
      [38, 50, 57, 62, 65], // Dm
      [39, 51, 58, 63, 67], // Eb
      [36, 48, 55, 60, 63], // Cm
    ],
    style: 'ambient',
  },
  {
    filename: 'electric-pulse.wav',
    title: 'Electric Pulse',
    bpm: 128,
    durationSec: 38,
    scale: [40, 43, 45, 47, 50, 52, 55], // E minor
    chords: [
      [28, 40, 47, 52, 55], // Em
      [31, 43, 50, 55, 59], // G
      [29, 41, 48, 53, 57], // F
      [26, 38, 45, 50, 53], // D
    ],
    style: 'cyberpunk',
  },
  {
    filename: 'velvet-groove.wav',
    title: 'Velvet Groove',
    bpm: 88,
    durationSec: 36,
    scale: [41, 45, 48, 50, 53, 57, 60], // F neo-soul
    chords: [
      [41, 53, 60, 65, 69], // Fmaj7
      [40, 52, 59, 64, 67], // Em7
      [38, 50, 57, 62, 65], // Dm7
      [43, 55, 58, 62, 65], // Gm7
    ],
    style: 'neosoul',
  },
  {
    filename: 'hyper-velocity.wav',
    title: 'Hyper Velocity',
    bpm: 160,
    durationSec: 36,
    scale: [43, 46, 48, 50, 53, 55, 58], // G minor
    chords: [
      [31, 43, 50, 55, 58], // Gm
      [34, 46, 53, 58, 62], // Bb
      [32, 44, 51, 56, 60], // Ab
      [29, 41, 48, 53, 56], // F
    ],
    style: 'dnb',
  },
  {
    filename: 'prism-light.wav',
    title: 'Prism Light',
    bpm: 100,
    durationSec: 40,
    scale: [48, 52, 55, 59, 60, 64, 67], // C major
    chords: [
      [36, 48, 55, 59, 64], // Cmaj7
      [33, 45, 52, 57, 60], // Am7
      [38, 50, 57, 62, 65], // Dm7
      [35, 47, 55, 59, 62], // G
    ],
    style: 'downtempo',
  }
];

function generateTrack(tConfig, outPath) {
  const numFrames = Math.floor(tConfig.durationSec * SAMPLE_RATE);
  const pcmBuffer = Buffer.alloc(numFrames * NUM_CHANNELS * BYTES_PER_SAMPLE);

  const beatSec = 60 / tConfig.bpm;
  const chordLenBeats = 4;
  const numChords = tConfig.chords.length;

  const filterL = new LowPassFilter(tConfig.style === 'lofi' ? 2200 : (tConfig.style === 'ambient' ? 1800 : 7500), SAMPLE_RATE);
  const filterR = new LowPassFilter(tConfig.style === 'lofi' ? 2200 : (tConfig.style === 'ambient' ? 1800 : 7500), SAMPLE_RATE);

  // Delay line for stereo reverb/echo
  const delaySamples = Math.floor(SAMPLE_RATE * (beatSec * 0.75));
  const delayBufL = new Float32Array(delaySamples);
  const delayBufR = new Float32Array(delaySamples);
  let delayIndex = 0;

  for (let i = 0; i < numFrames; i++) {
    const time = i / SAMPLE_RATE;
    const currentBeat = time / beatSec;
    const chordIndex = Math.floor(currentBeat / chordLenBeats) % numChords;
    const chord = tConfig.chords[chordIndex];
    const beatPhase = currentBeat % 1.0;
    const barPhase = currentBeat % 4.0;

    let sigL = 0;
    let sigR = 0;

    // 1. Kick Drum (on beats 0, 1, 2, 3 for 4-on-floor or 0, 2 for lofi/chill)
    let isKick = false;
    if (tConfig.style === 'deephouse' || tConfig.style === 'cyberpunk') {
      isKick = beatPhase < 0.18;
    } else if (tConfig.style === 'synthwave') {
      isKick = (currentBeat % 2.0 < 0.18) || (currentBeat % 4.0 >= 2.5 && currentBeat % 4.0 < 2.68);
    } else if (tConfig.style === 'dnb') {
      isKick = (currentBeat % 4.0 < 0.15) || (currentBeat % 4.0 >= 2.5 && currentBeat % 4.0 < 2.65);
    } else if (tConfig.style !== 'ambient') {
      isKick = (currentBeat % 4.0 < 0.18) || (currentBeat % 4.0 >= 2.5 && currentBeat % 4.0 < 2.68);
    }

    if (isKick) {
      const kTime = (currentBeat % (tConfig.style === 'deephouse' ? 1.0 : 2.0)) * beatSec;
      const kPitch = Math.max(45, 140 * Math.exp(-kTime * 35));
      const kEnv = Math.exp(-kTime * 18);
      const kick = Math.sin(kTime * 2 * Math.PI * kPitch) * kEnv * 0.45;
      sigL += kick;
      sigR += kick;
    }

    // 2. Snare / Clap (on beats 1 and 3 in a 4-beat bar)
    const isSnare = (barPhase >= 1.0 && barPhase < 1.3) || (barPhase >= 3.0 && barPhase < 3.3);
    if (isSnare && tConfig.style !== 'ambient') {
      const sPhase = ((barPhase >= 3.0 ? barPhase - 3.0 : barPhase - 1.0) * beatSec);
      const sEnv = Math.exp(-sPhase * 16);
      const noise = (Math.random() * 2 - 1) * sEnv * 0.22;
      const tone = Math.sin(sPhase * 2 * Math.PI * 180) * sEnv * 0.15;
      sigL += (noise + tone);
      sigR += (noise + tone);
    }

    // 3. Hi-Hats (every 1/2 or 1/4 beat)
    const hatStep = (currentBeat * 4) % 1.0;
    if (hatStep < 0.12 && tConfig.style !== 'ambient') {
      const hEnv = Math.exp(-hatStep * beatSec * 60);
      const hat = (Math.random() * 2 - 1) * hEnv * 0.08;
      sigL += hat * 0.8;
      sigR += hat * 1.1;
    }

    // 4. Bassline
    const rootMidi = chord[0];
    const bassFreq = m2f(rootMidi);
    const bassEnv = 0.5 + 0.5 * Math.sin(currentBeat * Math.PI * 2);
    let bass = 0;
    if (tConfig.style === 'cyberpunk' || tConfig.style === 'synthwave') {
      // Sawtooth-like bass
      const bPhase = (time * bassFreq) % 1.0;
      bass = (bPhase * 2 - 1) * 0.22 * bassEnv;
    } else {
      // Warm sine/tri bass
      bass = Math.sin(time * 2 * Math.PI * bassFreq) * 0.32;
    }
    sigL += bass;
    sigR += bass;

    // 5. Chords Pad / Keys
    for (let c = 1; c < chord.length; c++) {
      const cFreq = m2f(chord[c]);
      // Dual oscillator with slight detune for lush thickness
      const osc1 = Math.sin(time * 2 * Math.PI * cFreq);
      const osc2 = Math.sin(time * 2 * Math.PI * (cFreq * 1.002));
      const pad = (osc1 * 0.6 + osc2 * 0.4) * 0.08;
      sigL += pad * (c % 2 === 0 ? 0.7 : 0.9);
      sigR += pad * (c % 2 === 0 ? 0.9 : 0.7);
    }

    // 6. Arpeggio / Lead Melody
    const arpRate = tConfig.style === 'synthwave' || tConfig.style === 'deephouse' ? 4 : 2;
    const arpStep = Math.floor(currentBeat * arpRate) % tConfig.scale.length;
    const arpMidi = tConfig.scale[arpStep] + 12; // Octave higher
    const arpFreq = m2f(arpMidi);
    const arpPhase = (currentBeat * arpRate) % 1.0;
    const arpEnv = Math.exp(-arpPhase * 4.5);
    const lead = Math.sin(time * 2 * Math.PI * arpFreq) * arpEnv * 0.12;

    // Pan arpeggio smoothly across stereo field
    const panL = 0.5 + 0.4 * Math.sin(time * 1.5);
    const panR = 1.0 - panL;
    sigL += lead * panL;
    sigR += lead * panR;

    // 7. Subtle Delay / Reverb feed
    const echoL = delayBufL[delayIndex] * 0.35;
    const echoR = delayBufR[delayIndex] * 0.35;
    delayBufL[delayIndex] = sigL + echoR * 0.2;
    delayBufR[delayIndex] = sigR + echoL * 0.2;
    delayIndex = (delayIndex + 1) % delaySamples;

    sigL += echoL * 0.4;
    sigR += echoR * 0.4;

    // Filter
    sigL = filterL.process(sigL);
    sigR = filterR.process(sigR);

    // Fade in and fade out
    let masterEnv = 1.0;
    if (time < 1.5) masterEnv = time / 1.5;
    if (time > tConfig.durationSec - 2.5) masterEnv = Math.max(0, (tConfig.durationSec - time) / 2.5);

    sigL *= masterEnv;
    sigR *= masterEnv;

    // Soft clip / limiter
    const clampL = Math.max(-0.95, Math.min(0.95, sigL));
    const clampR = Math.max(-0.95, Math.min(0.95, sigR));

    const intSampleL = Math.floor(clampL * 32767);
    const intSampleR = Math.floor(clampR * 32767);

    const offset = i * NUM_CHANNELS * BYTES_PER_SAMPLE;
    pcmBuffer.writeInt16LE(intSampleL, offset);
    pcmBuffer.writeInt16LE(intSampleR, offset + 2);
  }

  const header = createWavHeader(numFrames);
  const fd = fs.openSync(outPath, 'w');
  fs.writeSync(fd, header);
  fs.writeSync(fd, pcmBuffer);
  fs.closeSync(fd);
  console.log(`Generated: ${tConfig.filename} (${tConfig.durationSec}s, ${tConfig.style})`);
}

const outDir = path.join(__dirname, '..', 'public', 'audio');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

console.log('Generating audio tracks in:', outDir);
for (const track of tracksToGenerate) {
  const filePath = path.join(outDir, track.filename);
  generateTrack(track, filePath);
}
console.log('All audio tracks generated successfully!');
