# 🎵 Chromatic Tuner

A real-time chromatic tuner that detects any musical note using the Web Audio API.

## Features

- Detects all 12 chromatic notes (C, C#, D, D#, E, F, F#, G, G#, A, A#, B)
- Visual needle indicator shows pitch accuracy
- Real-time frequency and audio level display
- Works with any instrument or voice

## Usage

1. Clone the repository:
   ```bash
   git clone https://github.com/aaravhmodi/guitartuner.git
   cd guitartuner
   ```

2. Start a local server (required for microphone access):
   ```bash
   python -m http.server 8000
   ```

3. Open `http://localhost:8000` in your browser

4. Click "Start Tuner" and allow microphone access

5. Play a note and watch the needle turn green when you're in tune!

## Technologies

- JavaScript (Web Audio API)
- HTML5 Canvas
- Autocorrelation pitch detection algorithm

## Author

**Aarav Modi** - [GitHub](https://github.com/aaravhmodi) • [LinkedIn](https://www.linkedin.com/in/aaravhmodi)

