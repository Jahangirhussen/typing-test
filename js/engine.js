class TypingEngine {
  constructor({ lang, mode = "words", wordTier = "top1000", difficulty = "medium", textEl, inputEl, statsEls, duration = 30, onFinish, onReady }) {
    this.lang = lang;
    this.mode = mode;
    this.wordTier = wordTier;
    this.difficulty = difficulty;
    this.textEl = textEl;
    this.inputEl = inputEl;
    this.statsEls = statsEls;
    this.duration = duration;
    this.onFinish = onFinish;
    this.onReady = onReady;
    this.bind();
    this.reset();
  }

  async reset() {
    this.words = "";
    this.typed = "";
    this.startTime = null;
    this.timer = null;
    this.timeLeft = this.duration;
    this.errors = 0;
    this.correctChars = 0;
    this.finished = false;
    this.inputEl.value = "";
    this.inputEl.disabled = true;
    this.textEl.textContent = "Loading...";

    this.words = await buildContent({
      lang: this.lang,
      mode: this.mode,
      wordTier: this.wordTier,
      difficulty: this.difficulty,
      duration: this.duration,
    });

    this.inputEl.disabled = false;
    this.renderText();
    this.updateStats();
    if (this.onReady) this.onReady();
  }

  extendIfNeeded() {
    // Content is preloaded generously per duration; nothing to do mid-test.
  }

  bind() {
    this.inputEl.addEventListener("input", () => this.onInput());
    this.inputEl.addEventListener("keydown", (e) => {
      if (e.key === "Tab") { e.preventDefault(); this.reset(); }
    });
  }

  focus() { this.inputEl.focus(); }

  renderText() {
    const typedLen = this.typed.length;
    let html = "";
    for (let i = 0; i < this.words.length; i++) {
      const ch = this.words[i];
      let cls = "";
      if (i < typedLen) {
        cls = this.typed[i] === ch ? "correct" : "incorrect";
      } else if (i === typedLen) {
        cls = "current";
      }
      html += `<span class="${cls}">${ch === " " ? "&nbsp;" : ch}</span>`;
    }
    this.textEl.innerHTML = html;
  }

  onInput() {
    if (this.finished) return;
    if (!this.startTime) this.start();

    const prevLen = this.typed.length;
    this.typed = this.inputEl.value;

    this.correctChars = 0;
    this.errors = 0;
    for (let i = 0; i < this.typed.length; i++) {
      if (this.typed[i] === this.words[i]) this.correctChars++;
      else this.errors++;
    }

    if (typeof playKeySound === "function" && this.typed.length > prevLen) {
      const lastIdx = this.typed.length - 1;
      if (this.typed[lastIdx] === this.words[lastIdx]) playKeySound();
      else playErrorSound();
    }

    this.renderText();
    this.updateStats();
  }

  start() {
    this.startTime = Date.now();
    this.timer = setInterval(() => {
      this.timeLeft--;
      if (this.timeLeft <= 0) this.finish();
      this.updateStats();
    }, 1000);
  }

  elapsedMinutes() {
    if (!this.startTime) return 0;
    return (Date.now() - this.startTime) / 60000;
  }

  computeWPM() {
    const mins = this.elapsedMinutes();
    if (mins <= 0) return 0;
    return Math.round((this.correctChars / 5) / mins);
  }

  computeCPM() {
    const mins = this.elapsedMinutes();
    if (mins <= 0) return 0;
    return Math.round(this.correctChars / mins);
  }

  computeAccuracy() {
    const total = this.typed.length;
    if (total === 0) return 100;
    return Math.round((this.correctChars / total) * 100);
  }

  updateStats() {
    const wpm = this.computeWPM();
    const cpm = this.computeCPM();
    const acc = this.computeAccuracy();
    if (this.statsEls.wpm) this.statsEls.wpm.textContent = wpm;
    if (this.statsEls.cpm) this.statsEls.cpm.textContent = cpm;
    if (this.statsEls.accuracy) this.statsEls.accuracy.textContent = acc + "%";
    if (this.statsEls.time) this.statsEls.time.textContent = this.timeLeft;
  }

  finish() {
    this.finished = true;
    clearInterval(this.timer);
    this.inputEl.disabled = true;
    const result = {
      wpm: this.computeWPM(),
      cpm: this.computeCPM(),
      accuracy: this.computeAccuracy(),
      errors: this.errors,
      correctChars: this.correctChars,
      totalChars: this.typed.length,
      duration: this.duration,
      lang: this.lang,
      date: new Date().toISOString(),
    };
    saveResult(result);
    if (this.onFinish) this.onFinish(result);
  }
}

function saveResult(result) {
  const key = "typingHistory";
  const history = JSON.parse(localStorage.getItem(key) || "[]");
  history.push(result);
  localStorage.setItem(key, JSON.stringify(history));

  const bestKey = "typingBest_" + result.lang;
  const best = JSON.parse(localStorage.getItem(bestKey) || "null");
  if (!best || result.wpm > best.wpm) {
    localStorage.setItem(bestKey, JSON.stringify(result));
  }
}

function getBest(lang) {
  return JSON.parse(localStorage.getItem("typingBest_" + lang) || "null");
}

function getHistory() {
  return JSON.parse(localStorage.getItem("typingHistory") || "[]");
}
