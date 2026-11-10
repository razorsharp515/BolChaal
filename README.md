# BolChaal: Gamified Marathi Language Learning Platform

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38B2AC.svg)](https://tailwindcss.com/)
[![Web Audio API](https://img.shields.io/badge/Web_Audio-Procedural_Synthesis-brightgreen.svg)]()
[![Web Speech API](https://img.shields.io/badge/Web_Speech-TTS_Pronunciation-orange.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**BolChaal** is an interactive, gamified single-page application built with React and Tailwind CSS designed to teach everyday Marathi vocabulary and sentence structures through bite-sized, engaging lessons.

---

## ✨ Features

- **🎮 Gamified Learning Loop:**
  - 5-heart life system with Game Over states and one-click restart.
  - XP progression reward system with streak tracking and visual celebration animations.
  - Real-time animated progress bars tracking lesson completion percentage.

- **🔊 Procedural Audio Engine (Web Audio API):**
  - Synthesizes dynamic sound frequencies in real time using `AudioContext`, `OscillatorNode`, and `GainNode`.
  - Tri-tone rising chord for correct answers and pitch-ramped triangle waves for incorrect attempts — **zero external MP3/WAV assets required**.

- **🗣️ Dynamic Text-to-Speech (Web Speech API):**
  - Integrated `SpeechSynthesisUtterance` with regional voice detection targeting Marathi (`mr-IN`) and Hindi (`hi-IN`) fallbacks.
  - Automatically cancels active utterances upon unmount or rapid clicks to eliminate audio overlaps.

- **🧩 Diverse Exercise Modes:**
  - **Multiple-Choice Translation:** Real-time validation with instant phonetic pronunciation previews.
  - **Match the Pairs:** Interactive two-column link matching featuring randomized Fisher-Yates-style state shuffling and selection state cues.

- **🌗 Adaptive UI/UX:**
  - Full Dark Mode and Light Mode support with smooth CSS gradients and glassmorphism styling.
  - Responsive layout optimized for both desktop and mobile viewports.

---

## 🛠️ Tech Stack

- **Frontend:** React 18 (Hooks: `useState`, `useEffect`)
- **Styling:** Tailwind CSS, Lucide React Icons
- **Audio APIs:** Web Audio API (Synthesizer), Web Speech API (TTS)
- **Tooling:** Vite, ES Modules

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16.0 or higher)
- npm or pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/razorsharp515/BolChaal.git
   cd BolChaal
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser at `http://localhost:5173` to start learning!

---

## 📄 License
This project is open-source and licensed under the [MIT License](LICENSE).
