# 🎵 Chromatic Tuner

A real-time chromatic tuner built with vanilla JavaScript and the Web Audio API. Detects any musical note (C, C#, D, D#, E, F, F#, G, G#, A, A#, B) across multiple octaves and provides visual feedback on pitch accuracy.

![Chromatic Tuner Demo](https://img.shields.io/badge/Status-Live-brightgreen)

---

## ✨ Features

- **🎸 Chromatic Note Detection** - Detects all 12 notes across octaves 2-6
- **📊 Real-Time Frequency Analysis** - Uses autocorrelation for accurate pitch detection
- **🎯 Visual Tuning Indicator** - Interactive needle shows how close you are to perfect pitch
- **🔊 Audio Level Display** - Shows current microphone input level
- **🎨 Clean, Modern UI** - Dark theme with color-coded feedback

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, or Safari)
- A microphone
- Python (for local development)

### Installation & Usage

1. **Clone the repository**
   ```bash
   git clone https://github.com/aaravhmodi/guitartuner.git
   cd guitartuner
   ```

2. **Start a local server**
   ```bash
   python -m http.server 8000
   ```
   *Note: Microphone access requires HTTPS or localhost*

3. **Open in browser**
   ```
   http://localhost:8000
   ```

4. **Start tuning!**
   - Click "Start Tuner"
   - Allow microphone access
   - Play or sing a note
   - Watch the needle turn green when you're in tune!

---

## 🔧 How It Works

### Technologies Used

- **Web Audio API** - Captures and processes microphone input
- **Autocorrelation Algorithm** - Detects fundamental frequency
- **Canvas API** - Renders the visual tuning needle
- **Equal Temperament Tuning** - A4 = 440 Hz standard

### Algorithm

1. Captures audio input from microphone with 3x gain amplification
2. Analyzes audio using FFT (Fast Fourier Transform) with 4096 sample size
3. Applies autocorrelation to detect the fundamental frequency
4. Matches detected frequency to the nearest chromatic note
5. Displays offset from perfect pitch with visual feedback

---

## 📂 Project Structure

```plaintext
guitartuner/
│
├── index.html      # Main HTML structure
├── style.css       # Styling and UI design
├── tuner.js        # Core tuning logic and Web Audio API
└── README.md       # Project documentation
```

---

## 🎯 Features Breakdown

| Feature | Description |
|---------|-------------|
| **Note Detection** | Detects any chromatic note (C through B with sharps) |
| **Octave Range** | Covers C2 (65 Hz) to B6 (1976 Hz) |
| **Accuracy** | Green indicator when within ±1 Hz of target |
| **Sensitivity** | Adjustable RMS threshold (0.0005 default) |
| **Visual Feedback** | Needle and color-coded note display |

---

## 🛠️ Technical Details

- **Sample Rate**: 48kHz (browser-dependent)
- **FFT Size**: 4096 samples
- **Frequency Range**: 30 Hz - 4000 Hz
- **Gain Amplification**: 3x
- **Smoothing**: 0.5 (balances responsiveness and stability)

---

## 🎨 UI Elements

- **Start Button** - Initiates microphone access and tuner
- **Needle Display** - Visual indicator of pitch offset
- **Note Display** - Shows detected note (turns green when detected)
- **Frequency Display** - Shows exact frequency in Hz
- **Audio Level** - Shows microphone input level percentage

---

## 📝 Future Improvements

- [ ] Add support for different tuning standards (432 Hz, 415 Hz)
- [ ] Implement instrument-specific tuning presets
- [ ] Add pitch history graph
- [ ] Include strobe tuner mode
- [ ] Save tuning history/sessions

---

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

---

## 👨‍💻 Author

**Aarav Modi**
- GitHub: [@aaravhmodi](https://github.com/aaravhmodi)
- LinkedIn: [Aarav Modi](https://www.linkedin.com/in/aaravhmodi)
- Email: aarav.modi@uwaterloo.ca

---

## 📄 License

This project is open source and available under the MIT License.

---

## 🙏 Acknowledgments

- Built with the Web Audio API
- Inspired by professional chromatic tuners
- Uses autocorrelation algorithm for pitch detection

---

**⭐ If you found this useful, consider giving it a star!**

