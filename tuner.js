const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let analyser, dataArray;

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
  const rms = Math.sqrt(buf.reduce((sum, val) => sum + val * val, 0) / SIZE);
  if (rms < 0.01) return -1;

  let bestOffset = -1;
  let bestCorr = 0;

  for (let offset = 32; offset < 512; offset++) {
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
      const closest = closestNote(pitch);
      freqElem.textContent = pitch.toFixed(2);
      noteElem.textContent = closest.note;
      drawNeedle(pitch - closest.freq);
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
