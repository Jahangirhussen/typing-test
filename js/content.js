// Dataset loading + no-repeat random content selection.

const DATASET_PATHS = {
  english: {
    words: "../data/english/words.json",
    sentences: "../data/english/sentences.json",
    quotes: "../data/english/quotes.json",
    general: "../data/english/paragraphs.json",
    ielts: "../data/english/ielts.json",
    academic: "../data/english/academic.json",
    business: "../data/english/business.json",
    technology: "../data/english/technology.json",
    programming: "../data/english/programming.json",
  },
  bangla: {
    words: "../data/bangla/words.json",
    sentences: "../data/bangla/sentences.json",
    quotes: "../data/bangla/quotes.json",
    general: "../data/bangla/paragraphs.json",
    news: "../data/bangla/news.json",
    academic: "../data/bangla/academic.json",
    literature: "../data/bangla/literature.json",
    technology: "../data/bangla/technology.json",
  },
};

// Word count targets per duration (seconds), buffered so fast typists never run out.
const DURATION_WORD_TARGETS = {
  15: 150,
  30: 300,
  60: 600,
  120: 1200,
  180: 1800,
  300: 3000,
  600: 6000,
};

function wordsForDuration(seconds) {
  if (DURATION_WORD_TARGETS[seconds]) return DURATION_WORD_TARGETS[seconds];
  // Custom duration: >= 500 words per minute requested.
  return Math.ceil((seconds / 60) * 500);
}

const _datasetCache = {};

async function loadDataset(lang, category) {
  const cacheKey = lang + ":" + category;
  if (_datasetCache[cacheKey]) return _datasetCache[cacheKey];
  const path = DATASET_PATHS[lang] && DATASET_PATHS[lang][category];
  if (!path) throw new Error("Unknown dataset: " + lang + "/" + category);
  const res = await fetch(path);
  const json = await res.json();
  _datasetCache[cacheKey] = json;
  return json;
}

// --- No-repeat "recently used" tracking, per dataset key, via localStorage ---

const RECENT_HISTORY_LIMIT = 40;

function recentKey(lang, category) {
  return "typingRecent_" + lang + "_" + category;
}

function getRecentIds(lang, category) {
  return JSON.parse(localStorage.getItem(recentKey(lang, category)) || "[]");
}

function pushRecentId(lang, category, id) {
  const key = recentKey(lang, category);
  let recent = getRecentIds(lang, category);
  recent.push(id);
  if (recent.length > RECENT_HISTORY_LIMIT) recent = recent.slice(recent.length - RECENT_HISTORY_LIMIT);
  localStorage.setItem(key, JSON.stringify(recent));
}

function resetRecent(lang, category) {
  localStorage.removeItem(recentKey(lang, category));
}

// Pick one entry from `items` (array of {id, text, ...}) avoiding recently used ids.
// If all items have been used recently, reset history and pick fresh.
function pickUnused(lang, category, items) {
  let recent = getRecentIds(lang, category);
  let candidates = items.filter((it) => !recent.includes(it.id));
  if (candidates.length === 0) {
    resetRecent(lang, category);
    candidates = items;
  }
  const pick = candidates[Math.floor(Math.random() * candidates.length)];
  pushRecentId(lang, category, pick.id);
  return pick;
}

function shuffledCopy(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// --- Public content builders ---

// Difficulty filters applied on top of the word pool (word length in characters).
const DIFFICULTY_LENGTH_RANGES = {
  beginner: [1, 4],
  easy: [1, 6],
  medium: [3, 8],
  hard: [6, 12],
  expert: [8, 30],
};

function applyDifficulty(pool, difficulty) {
  if (!difficulty || !DIFFICULTY_LENGTH_RANGES[difficulty]) return pool;
  const [min, max] = DIFFICULTY_LENGTH_RANGES[difficulty];
  const filtered = pool.filter((w) => w.length >= min && w.length <= max);
  return filtered.length >= 20 ? filtered : pool;
}

// mode: "words" | "sentences" | "quotes" | "general" | "ielts" | "academic" | "business" | "technology" | "programming" | "news" | "literature"
// wordTier: "top200" | "top1000" | "top5000" (only used when mode === "words")
// difficulty: "beginner" | "easy" | "medium" | "hard" | "expert" (optional)
async function buildContent({ lang, mode, wordTier, duration, difficulty }) {
  const targetWords = wordsForDuration(duration);

  if (mode === "words") {
    const data = await loadDataset(lang, "words");
    let pool;
    if (lang === "bangla") {
      pool = data.common.concat(data.academic || [], data.news || []);
    } else {
      pool = data[wordTier] || data.top1000 || data.top200;
    }
    pool = applyDifficulty(pool, difficulty);
    const shuffled = shuffledCopy(pool);
    const out = [];
    let i = 0;
    while (out.length < targetWords) {
      if (i >= shuffled.length) i = 0;
      out.push(shuffled[i]);
      i++;
    }
    return out.join(" ");
  }

  // Unit-based modes: sentences, quotes, or any paragraph category.
  const data = await loadDataset(lang, mode);
  const items = Array.isArray(data) ? data : (data.sentences || data.quotes || data.paragraphs);
  const category = mode;

  const parts = [];
  let wordCount = 0;
  let guard = 0;
  while (wordCount < targetWords && guard < 5000) {
    guard++;
    const picked = pickUnused(lang, category, items);
    parts.push(picked.text);
    wordCount += picked.text.split(/\s+/).filter(Boolean).length;
  }
  return parts.join(" ");
}
