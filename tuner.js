const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser, dataArray;

const noteElem = document.getElementById("note");
const freqElem = document.getElementById("freq");
const levelElem = document.getElementById("level");
const canvas = document.getElementById("needle");
const ctx = canvas.getContext("2d");

// Generate chromatic scale from C2 to C7
function generateChromaticScale() {
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
  const notes = [];
  
  // Generate notes from C2 (65.41 Hz) to C7 (2093.00 Hz)
  for (let octave = 2; octave <= 6; octave++) {
    for (let i = 0; i < 12; i++) {
      const noteName = noteNames[i];
      // A4 = 440 Hz, using equal temperament
      // Formula: freq = 440 * 2^((n-69)/12) where n is MIDI note number
      const midiNote = (octave + 1) * 12 + i;
      const freq = 440 * Math.pow(2, (midiNote - 69) / 12);
      notes.push({ note: `${noteName}${octave}`, freq });
    }
  }
  
  return notes;
}

const NOTES = generateChromaticScale();

function closestNote(freq) {
  return NOTES.reduce((prev, curr) =>
    Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
  );
}

function drawNeedle(offset) {
  const centerX = 150;
  const centerY = 150;
  const radius = 120;

  ctx.clearRect(0, 0, 300, 300);
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#aaa";
  ctx.stroke();

  const angle = (offset / 50) * Math.PI / 3;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle));
  ctx.strokeStyle = Math.abs(offset) < 1 ? "lime" : "red";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;

  // Compute RMS first
  let sumSquares = 0;
  for (let i = 0; i < SIZE; i++) {
    sumSquares += buf[i] * buf[i];
  }
  const rms = Math.sqrt(sumSquares / SIZE);

  // Display audio level
  levelElem.textContent = (rms * 100).toFixed(2) + "%";

  // Much lower threshold for maximum sensitivity
  if (rms < 0.0005) return -1;

  let bestOffset = -1;
  let bestCorr = 0;

  // Wider range for better pitch detection (32 Hz to 2000+ Hz)
  for (let offset = 20; offset < 1024; offset++) {
    let corr = 0;
    for (let i = 0; i < SIZE - offset; i++) {
      corr += buf[i] * buf[i + offset];
    }
    corr /= (SIZE - offset);
    if (corr > bestCorr) {
      bestCorr = corr;
      bestOffset = offset;
    }
  }

  const detectedFreq = bestOffset > 0 ? sampleRate / bestOffset : -1;
  console.log("Autocorrelated pitch:", detectedFreq);

  return detectedFreq;
}


async function startTuner() {
  console.log("Starting tuner function...");
  
  // Check if browser supports necessary APIs
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    throw new Error("Browser doesn't support microphone access");
  }
  
  console.log("Requesting microphone stream...");
  const stream = await navigator.mediaDevices.getUserMedia({ 
    audio: {
      echoCancellation: false,
      noiseSuppression: false,
      autoGainControl: false
    } 
  });
  
  console.log("Got stream, creating audio nodes...");
  const source = audioContext.createMediaStreamSource(stream);
  
  // Add a gain node to amplify the input
  const gainNode = audioContext.createGain();
  gainNode.gain.value = 3.0; // Amplify input by 3x (reduced from 5x for stability)
  
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 4096; // Increased for better frequency resolution
  analyser.smoothingTimeConstant = 0.5; // Less smoothing for faster response
  
  // Connect: source -> gain -> analyser
  source.connect(gainNode);
  gainNode.connect(analyser);
  
  dataArray = new Float32Array(analyser.fftSize);
  
  console.log("Tuner started! Sample rate:", audioContext.sampleRate);
  console.log("FFT Size:", analyser.fftSize);

  function update() {
    analyser.getFloatTimeDomainData(dataArray);
    const pitch = autoCorrelate(dataArray, audioContext.sampleRate);

    console.log("Detected pitch:", pitch);

    if (pitch > 30 && pitch < 4000) {
      const closest = closestNote(pitch);
      freqElem.textContent = pitch.toFixed(2);
      noteElem.textContent = closest.note;
      noteElem.style.color = "lime";
      const offset = pitch - closest.freq;
      console.log(`Note: ${closest.note}, Freq: ${pitch.toFixed(2)}, Offset: ${offset.toFixed(2)}`);
      drawNeedle(offset);
    } else {
      noteElem.textContent = "--";
      noteElem.style.color = "white";
      freqElem.textContent = "--";
      drawNeedle(0);
    }

    requestAnimationFrame(update);
  }

  update();
}

document.getElementById("start-btn").addEventListener("click", async () => {
  console.log("Button clicked!");
  const btn = document.getElementById("start-btn");
  btn.textContent = "Starting...";
  
  try {
    console.log("Requesting microphone access...");
    await startTuner();
    btn.disabled = true;
    btn.textContent = "Tuner Running ✓";
    console.log("Tuner successfully started!");
  } catch (err) {
    alert("Microphone access denied or error: " + err.message);
    console.error("Error starting tuner:", err);
    btn.textContent = "Start Tuner (Failed - Try Again)";
  }
});
