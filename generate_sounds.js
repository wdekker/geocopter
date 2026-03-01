import fs from 'fs';
import pkg from 'wavefile';
const { WaveFile } = pkg;
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outDir = path.join(__dirname, 'public', 'sounds');

// Ensure directory exists
if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

// Configuration
const sampleRate = 44100;

// Helper to generate a wave file and save it
function saveWave(filename, samples) {
    let wav = new WaveFile();
    // 1 channel, sampleRate, 16-bit
    wav.fromScratch(1, sampleRate, '16', samples);
    fs.writeFileSync(path.join(outDir, filename), wav.toBuffer());
    console.log(`Saved ${filename}`);
}

// 1. Success Sound (Bright Chime - Perfect 5th chord)
// Duration: 0.8s
function createSuccessSound() {
    const duration = 0.8;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    // Frequencies for a C major chord roll (C5, E5, G5, C6)
    const baseFreq = 523.25;
    const freqs = [baseFreq, baseFreq * 1.25, baseFreq * 1.5, baseFreq * 2];

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        let sample = 0;

        // Arpeggiated chime
        freqs.forEach((freq, index) => {
            const delay = index * 0.1;
            if (t > delay) {
                // simple FM synthesis for a bell sound
                const fm = Math.sin(2 * Math.PI * (freq * 2.5) * (t - delay)) * 2;
                let s = Math.sin(2 * Math.PI * freq * (t - delay) + fm);

                // Fast decay envelope for each note
                const decay = Math.max(0, Math.exp(-6 * (t - delay)));
                sample += s * decay;
            }
        });

        // Master envelope
        const masterDecay = Math.max(0, 1 - (t / duration));

        // Scale and convert to 16-bit PCM
        samples[i] = Math.max(-32768, Math.min(32767, sample * 8000 * masterDecay));
    }
    saveWave('success.wav', samples);
}

// 2. Start Game (Ascending Sweep)
// Duration: 1.0s
function createStartSound() {
    const duration = 1.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // Frequency sweeps from 200Hz to 800Hz
        const freq = 200 + (600 * t);

        // Square wave for retro feel
        let s = Math.sign(Math.sin(2 * Math.PI * freq * t));

        // Add a secondary pulse
        s += Math.sign(Math.sin(2 * Math.PI * (freq * 1.5) * t)) * 0.5;

        // Envelope: quick attack, slow release
        const attack = Math.min(1, t * 10);
        const release = Math.max(0, 1 - Math.pow(t / duration, 2));
        const env = attack * release;

        samples[i] = Math.max(-32768, Math.min(32767, s * 6000 * env));
    }
    saveWave('start.wav', samples);
}

// 3. Game Over (Descending Sweep / Crash)
// Duration: 1.5s
function createFinishSound() {
    const duration = 1.5;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;

        // Descending frequency 400Hz to 50Hz
        const freq = 400 * Math.exp(-2 * t);

        // Sawtooth wave
        let s = (2 * ((freq * t) - Math.floor(freq * t + 0.5)));

        // Add white noise for impact
        s += (Math.random() * 2 - 1) * Math.max(0, 1 - t * 4);

        // Envelope
        const release = Math.max(0, Math.exp(-1.5 * t));

        samples[i] = Math.max(-32768, Math.min(32767, s * 8000 * release));
    }
    saveWave('finish.wav', samples);
}

// 4. Helicopter Hover (Constant Low Rhythmic Thump + Noise)
// Duration: 2.0s (meant to be looped)
function createHoverSound() {
    const duration = 2.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    // Rotor speed (beats per second)
    const rotorSpeed = 12;

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;

        // Low frequency thud (pink noise / lowpass filtered white noise approximation)
        let noise = (Math.random() * 2 - 1) * 0.5;
        // add low sine for sub-bass "wub"
        noise += Math.sin(2 * Math.PI * 60 * t);

        // Amplitude modulation to simulate blades slicing air
        // Math.abs(Math.sin) creates strong pulses
        const am = Math.pow(Math.abs(Math.sin(Math.PI * rotorSpeed * t)), 2);

        // Keep volume fairly low since it's a background loop
        samples[i] = Math.max(-32768, Math.min(32767, noise * am * 4000));
    }
    saveWave('chopper.wav', samples);
}

console.log('Generating game audio assets...');
createSuccessSound();
createStartSound();
createFinishSound();
createHoverSound();
console.log('Done!');

// 5. Propeller Aircraft (High Pitch, Fast AM, buzz)
// Duration: 1.0s loop
function createPropellerSound() {
    const duration = 1.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);
    const rpm = 45; // Faster than chopper

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // Base tone - higher than chopper, bit of a sawtooth
        let s = (Math.sin(2 * Math.PI * 120 * t) + 0.5 * Math.sin(2 * Math.PI * 240 * t));
        
        // Add broadband noise
        const noise = (Math.random() * 2 - 1) * 0.4;
        s += noise;

        // Amplitude modulation for propeller slicing
        const am = 0.5 + 0.5 * Math.sin(2 * Math.PI * rpm * t);
        
        samples[i] = Math.max(-32768, Math.min(32767, s * am * 4000));
    }
    saveWave('propeller.wav', samples);
}

// 6. Jet Engine (White noise + Highpass hiss + low rumble)
function createJetSound() {
    const duration = 1.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        const hiss = noise * 0.8;
        const rumble = Math.sin(2 * Math.PI * 80 * t) * 0.3;
        
        // Small modulation to make it alive
        const am = 0.9 + 0.1 * Math.sin(2 * Math.PI * 2 * t);
        
        samples[i] = Math.max(-32768, Math.min(32767, (hiss + rumble) * am * 5000));
    }
    saveWave('jet.wav', samples);
}

// 7. UFO (Theremin wobble, sine wave oscillator)
function createUFOSound() {
    const duration = 2.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        // Wobble frequency between 400Hz and 600Hz
        const lfo = Math.sin(2 * Math.PI * 2 * t); // 2 wobbles per second
        const freq = 500 + 100 * lfo;
        
        // Pure sine with a sub-octave
        let s = Math.sin(2 * Math.PI * freq * t) + 0.3 * Math.sin(2 * Math.PI * (freq / 2) * t);
        
        // Tremolo (AM)
        const am = 0.7 + 0.3 * Math.sin(2 * Math.PI * 6 * t);
        
        samples[i] = Math.max(-32768, Math.min(32767, s * am * 3000));
    }
    saveWave('ufo.wav', samples);
}

// 8. Rocket (Deep distorted noise, low freq emphasis)
function createRocketSound() {
    const duration = 1.0;
    const numSamples = sampleRate * duration;
    const samples = new Int16Array(numSamples);

    for (let i = 0; i < numSamples; i++) {
        const t = i / sampleRate;
        const noise = (Math.random() * 2 - 1);
        
        // Heavy low freq rumble
        const rumble = Math.sin(2 * Math.PI * 40 * t) * 1.5 + Math.sin(2 * Math.PI * 60 * t);
        
        // Clipping distortion
        let s = noise * 0.4 + rumble;
        if (s > 1.0) s = 1.0;
        if (s < -1.0) s = -1.0;

        // Slight uneven thrust sputtering
        const am = 0.8 + 0.2 * Math.random();
        
        samples[i] = Math.max(-32768, Math.min(32767, s * am * 7000));
    }
    saveWave('rocket.wav', samples);
}

createPropellerSound();
createJetSound();
createUFOSound();
createRocketSound();
