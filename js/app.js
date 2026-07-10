// Shared UI features: theme, sound, header wiring.

const THEMES = ["dark", "light", "blue", "green", "contrast"];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("typingTheme", theme);
}

function initTheme() {
  const saved = localStorage.getItem("typingTheme") || "dark";
  applyTheme(saved);
  const btn = document.getElementById("theme-toggle");
  if (btn) {
    btn.addEventListener("click", () => {
      const cur = localStorage.getItem("typingTheme") || "dark";
      const next = THEMES[(THEMES.indexOf(cur) + 1) % THEMES.length];
      applyTheme(next);
    });
  }
}

function isSoundOn() {
  return localStorage.getItem("typingSound") !== "off";
}

function initSound() {
  const btn = document.getElementById("sound-toggle");
  if (!btn) return;
  const sync = () => { btn.textContent = isSoundOn() ? "🔊" : "🔇"; };
  sync();
  btn.addEventListener("click", () => {
    localStorage.setItem("typingSound", isSoundOn() ? "off" : "on");
    sync();
  });
}

let _audioCtx = null;
function beep(freq, duration) {
  if (!isSoundOn()) return;
  try {
    _audioCtx = _audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const osc = _audioCtx.createOscillator();
    const gain = _audioCtx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.05;
    osc.connect(gain);
    gain.connect(_audioCtx.destination);
    osc.start();
    gain.gain.exponentialRampToValueAtTime(0.0001, _audioCtx.currentTime + duration);
    osc.stop(_audioCtx.currentTime + duration);
  } catch (e) { /* audio not available */ }
}

function playKeySound() { beep(600, 0.03); }
function playErrorSound() { beep(180, 0.08); }
function playFinishSound() { beep(880, 0.25); }

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initSound();
});
