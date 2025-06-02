// tuner.js
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser = null;
let dataArray = null;

const noteElem = document.getElementById("note");
const freqElem = document.getElementById("freq");
const canvas = document.getElementById("needle");
const ctx = canvas.getContext("2d");

const NOTES = [
  { note: 'E2', freq: 82.41 },
  { note: 'A2', freq: 110.00 },
  { note: 'D3', freq: 146.83 },
  { note: 'G3', freq: 196.00 },
  { note: 'B3', freq: 246.94 },
  { note: 'E4', freq: 329.63 },
];

function closestNote(freq) {
  return NOTES.reduce((prev, curr) => (
    Math.abs(curr.freq - freq) < Math.abs(prev.freq - freq) ? curr : prev
  ));
}

function drawNeedle(offset) {
  const centerX = 150;
  const centerY = 150;
  const radius = 120;

  ctx.clearRect(0, 0, 300, 300);

  // Circle outline
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = "#aaa";
  ctx.stroke();

  // Needle
  const angle = (offset / 50) * Math.PI / 3; // ±60°
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.lineTo(centerX + radius * Math.sin(angle), centerY - radius * Math.cos(angle));
  ctx.strokeStyle = offset === 0 ? "lime" : "red";
  ctx.lineWidth = 4;
  ctx.stroke();
}

function autoCorrelate(buf, sampleRate) {
  // A basic autocorrelation-based pitch detection
  const SIZE = buf.length;
  const rms = Math.sqrt(buf.reduce((a, b) => a + b * b, 0) / SIZE);
  if (rms < 0.01) return -1;

  let bestOffset = -1;
  let bestCorrelation = 0;

  for (let offset = 32; offset < 512; offset++) {
    let correlation = 0;
    for (let i = 0; i < SIZE - offset; i++) {
      correlation += buf[i] * buf[i + offset];
    }
    correlation = correlation / (SIZE - offset);
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation;
      bestOffset = offset;
    }
  }

  return bestOffset > 0 ? sampleRate / bestOffset : -1;
}

async function startTuner() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioContext.createMediaStreamSource(stream);
  analyser = audioContext.createAnalyser();
  analyser.fftSize = 2048;

  source.connect(analyser);
  dataArray = new Float32Array(analyser.fftSize);

  function update() {
    analyser.getFloatTimeDomainData(dataArray);
    const pitch = autoCorrelate(dataArray, audioContext.sampleRate);
    if (pitch > 50) {
      freqElem.textContent = pitch.toFixed(2);
      const closest = closestNote(pitch);
      noteElem.textContent = closest.note;
      const offset = pitch - closest.freq;
      drawNeedle(offset);
    } else {
      noteElem.textContent = "--";
      freqElem.textContent = "--";
      drawNeedle(0);
    }
    requestAnimationFrame(update);
  }

  update();
}

startTuner();
