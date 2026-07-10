// Shared header + footer, injected into every page for a consistent design system.
// Usage: <div id="site-header"></div> ... <div id="site-footer"></div>
// <script src="BASE/js/layout.js" data-base="BASE"></script>  (BASE = "./" or "../")

(function () {
  const scriptEl = document.currentScript;
  const BASE = (scriptEl && scriptEl.dataset.base) || "./";
  const path = location.pathname;

  const SITE_PAGES = [
    { title: "English Typing Test", url: BASE + "english/index.html", kw: "english type speed test qwerty" },
    { title: "Bangla Typing Test", url: BASE + "bangla/index.html", kw: "bangla bengali type speed test avro bijoy" },
    { title: "Practice", url: BASE + "practice/index.html", kw: "practice category beginner easy medium hard custom" },
    { title: "Typing Lessons", url: BASE + "lessons/index.html", kw: "lessons learn finger placement keyboard guide avro bijoy unicode" },
    { title: "Typing Tips", url: BASE + "tips/index.html", kw: "tips articles blog advice" },
    { title: "WPM Calculator", url: BASE + "tools/index.html#wpm", kw: "wpm calculator tool" },
    { title: "CPM Calculator", url: BASE + "tools/index.html#cpm", kw: "cpm calculator tool" },
    { title: "Progress Tracker", url: BASE + "tools/index.html#progress", kw: "progress tracker statistics" },
    { title: "Leaderboard", url: BASE + "leaderboard/index.html", kw: "leaderboard best score ranking" },
    { title: "Certificate", url: BASE + "certificate/index.html", kw: "certificate download pdf print" },
    { title: "Statistics & History", url: BASE + "stats/index.html", kw: "stats history graph export" },
    { title: "Blog", url: BASE + "blog/index.html", kw: "blog articles" },
    { title: "FAQ", url: BASE + "faq/index.html", kw: "faq questions help" },
    { title: "About", url: BASE + "about.html", kw: "about mission vision" },
    { title: "Contact", url: BASE + "contact.html", kw: "contact support email" },
  ];

  const headerHTML = `
  <div class="scroll-progress" id="scroll-progress"></div>
  <header class="site-header">
    <div class="header-inner">
      <a class="logo" href="${BASE}index.html">⌨ TypingTest</a>

      <button class="search-btn" id="search-open-btn" title="Search (Ctrl+K)">🔍 <span class="search-kbd">Ctrl K</span></button>

      <nav class="main-nav" id="main-nav">
        <button class="nav-close-btn" id="nav-close-btn" aria-label="Close menu">✕</button>
        <a href="${BASE}index.html">Home</a>
        <a href="${BASE}english/index.html">English Typing</a>
        <a href="${BASE}bangla/index.html">Bangla Typing</a>

        <div class="nav-dropdown">
          <button class="nav-dropdown-btn">Practice ▾</button>
          <div class="mega-menu">
            <div class="mega-col">
              <h4>Practice</h4>
              <a href="${BASE}english/index.html">English Practice</a>
              <a href="${BASE}bangla/index.html">Bangla Practice</a>
              <a href="${BASE}practice/index.html#beginner">Beginner</a>
              <a href="${BASE}practice/index.html#easy">Easy</a>
              <a href="${BASE}practice/index.html#medium">Medium</a>
              <a href="${BASE}practice/index.html#hard">Hard</a>
              <a href="${BASE}practice/index.html#expert">Expert</a>
              <a href="${BASE}practice/index.html#random">Random Practice</a>
              <a href="${BASE}practice/index.html#custom">Custom Practice</a>
            </div>
          </div>
        </div>

        <div class="nav-dropdown">
          <button class="nav-dropdown-btn">Lessons ▾</button>
          <div class="mega-menu">
            <div class="mega-col">
              <h4>Lessons</h4>
              <a href="${BASE}lessons/index.html#english">English Typing Lessons</a>
              <a href="${BASE}lessons/index.html#bangla">Bangla Typing Lessons</a>
              <a href="${BASE}lessons/index.html#fingers">Finger Placement</a>
              <a href="${BASE}lessons/index.html#keyboard">Keyboard Guide</a>
              <a href="${BASE}lessons/index.html#avro">Avro Guide</a>
              <a href="${BASE}lessons/index.html#bijoy">Bijoy Guide</a>
              <a href="${BASE}lessons/index.html#unicode">Unicode Guide</a>
            </div>
          </div>
        </div>

        <div class="nav-dropdown">
          <button class="nav-dropdown-btn">Tools ▾</button>
          <div class="mega-menu">
            <div class="mega-col">
              <h4>Tools</h4>
              <a href="${BASE}tools/index.html#wpm">WPM Calculator</a>
              <a href="${BASE}tools/index.html#cpm">CPM Calculator</a>
              <a href="${BASE}certificate/index.html">Typing Certificate</a>
              <a href="${BASE}stats/index.html">Typing Statistics</a>
              <a href="${BASE}tools/index.html#progress">Progress Tracker</a>
            </div>
          </div>
        </div>

        <div class="nav-dropdown">
          <button class="nav-dropdown-btn">Resources ▾</button>
          <div class="mega-menu">
            <div class="mega-col">
              <h4>Resources</h4>
              <a href="${BASE}tips/index.html">Typing Tips</a>
              <a href="${BASE}blog/index.html">Blog</a>
              <a href="${BASE}faq/index.html">FAQ</a>
              <a href="${BASE}lessons/index.html#shortcuts">Keyboard Shortcuts</a>
            </div>
          </div>
        </div>

        <a href="${BASE}leaderboard/index.html">Leaderboard</a>
        <a href="${BASE}certificate/index.html">Certificates</a>
        <a href="${BASE}blog/index.html">Blog</a>
        <a href="${BASE}about.html">About</a>
        <a href="${BASE}contact.html">Contact</a>
      </nav>
      <div class="nav-backdrop" id="nav-backdrop"></div>

      <div class="header-actions">
        <button id="theme-toggle" title="Switch theme">🎨</button>
        <button id="sound-toggle" title="Toggle sound">🔊</button>
        <button id="lang-toggle" title="Switch language">${path.includes("/bangla/") ? "EN" : "বাং"}</button>
        <a class="cta-btn" href="${BASE}english/index.html">Start Typing</a>
        <button id="mobile-menu-btn" aria-label="Menu">☰</button>
      </div>
    </div>
  </header>

  <div class="search-overlay" id="search-overlay">
    <div class="search-overlay-box">
      <input type="text" id="site-search" placeholder="Search tests, lessons, tools... (Esc to close)" autocomplete="off">
      <div class="search-section" id="search-recent-wrap" style="display:none;">
        <h5>Recent Searches</h5>
        <div class="search-chip-row" id="search-recent"></div>
      </div>
      <div class="search-section">
        <h5>Popular</h5>
        <div class="search-chip-row" id="search-popular"></div>
      </div>
      <div class="search-results open" id="search-results"></div>
    </div>
  </div>`;

  const footerHTML = `
  <section class="footer-cta">
    <h2>Start Improving Your Typing Speed Today</h2>
    <p>Free, no sign-up, works in English and Bangla.</p>
    <div class="hero-cta">
      <a class="primary-btn" href="${BASE}english/index.html">Start Typing</a>
      <a class="primary-btn alt" href="${BASE}english/index.html">English Test</a>
      <a class="primary-btn alt" href="${BASE}bangla/index.html">Bangla Test</a>
    </div>
  </section>

  <footer class="site-footer">
    <div class="footer-grid">
      <div class="footer-col">
        <a class="logo" href="${BASE}index.html">⌨ TypingTest</a>
        <p class="footer-desc">A free English &amp; Bangla typing speed test platform with real-word datasets, multiple difficulty levels, and detailed progress tracking. Our mission is free, high-quality typing practice for everyone.</p>
        <div class="footer-social">
          <a href="https://github.com/Jahangirhussen/typing-test" target="_blank" rel="noopener" aria-label="GitHub">🐙</a>
          <a href="#" aria-label="Facebook">📘</a>
          <a href="#" aria-label="LinkedIn">💼</a>
          <a href="#" aria-label="X (Twitter)">✕</a>
          <a href="#" aria-label="Instagram">📷</a>
          <a href="#" aria-label="YouTube">▶️</a>
          <a href="mailto:support@typingtest.example" aria-label="Email">✉️</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Typing Tests</h4>
        <a href="${BASE}english/index.html">English Typing Test</a>
        <a href="${BASE}bangla/index.html">Bangla Typing Test</a>
        <a href="${BASE}practice/index.html#beginner">Beginner Test</a>
        <a href="${BASE}practice/index.html#expert">Advanced Test</a>
        <a href="${BASE}practice/index.html#random">Random Practice</a>
        <a href="${BASE}practice/index.html#custom">Custom Practice</a>
        <a href="${BASE}practice/index.html">Daily Challenge</a>
      </div>
      <div class="footer-col">
        <h4>Learning</h4>
        <a href="${BASE}lessons/index.html">Typing Lessons</a>
        <a href="${BASE}tips/index.html">Typing Tips</a>
        <a href="${BASE}lessons/index.html#fingers">Finger Placement Guide</a>
        <a href="${BASE}lessons/index.html#keyboard">Keyboard Guide</a>
        <a href="${BASE}lessons/index.html#avro">Avro Typing Guide</a>
        <a href="${BASE}lessons/index.html#bijoy">Bijoy Typing Guide</a>
        <a href="${BASE}lessons/index.html#unicode">Unicode Typing Guide</a>
        <a href="${BASE}faq/index.html">FAQ</a>
      </div>
      <div class="footer-col">
        <h4>Tools</h4>
        <a href="${BASE}tools/index.html#wpm">WPM Calculator</a>
        <a href="${BASE}tools/index.html#cpm">CPM Calculator</a>
        <a href="${BASE}stats/index.html">Typing Statistics</a>
        <a href="${BASE}tools/index.html#progress">Progress Tracker</a>
        <a href="${BASE}certificate/index.html">Typing Certificate</a>
        <a href="${BASE}stats/index.html">Typing History</a>
      </div>
      <div class="footer-col">
        <h4>Resources</h4>
        <a href="${BASE}blog/index.html">Blog</a>
        <a href="${BASE}blog/index.html">Latest Articles</a>
        <a href="${BASE}lessons/index.html#shortcuts">Typing Shortcuts</a>
        <a href="${BASE}faq/index.html">Accessibility Guide</a>
        <a href="${BASE}contact.html">Help Center</a>
        <a href="${BASE}contact.html">Contact</a>
      </div>
      <div class="footer-col">
        <h4>Company</h4>
        <a href="${BASE}about.html">About</a>
        <a href="${BASE}contact.html">Contact</a>
        <a href="${BASE}privacy-policy.html">Privacy Policy</a>
        <a href="${BASE}terms-and-conditions.html">Terms &amp; Conditions</a>
        <a href="${BASE}cookie-policy.html">Cookie Policy</a>
        <a href="${BASE}disclaimer.html">Disclaimer</a>
        <a href="${BASE}sitemap.xml">Sitemap</a>
      </div>
    </div>

    <div class="footer-newsletter">
      <div>
        <h4>Subscribe to our newsletter</h4>
        <p class="footer-desc">Occasional updates on new features and datasets. No spam.</p>
      </div>
      <form class="newsletter-form" onsubmit="event.preventDefault(); this.reset(); alert('Thanks for subscribing!');">
        <input type="email" placeholder="Your email" required>
        <button type="submit">Subscribe</button>
      </form>
    </div>

    <div class="footer-bottom">
      <span>&copy; ${new Date().getFullYear()} TypingTest. All rights reserved. Made with ❤️</span>
      <span class="footer-version">v1.0</span>
      <a class="footer-github" href="https://github.com/Jahangirhussen/typing-test" target="_blank" rel="noopener">GitHub Repo</a>
      <a class="footer-github" href="https://jahangirhussen.github.io/typing-test/" target="_blank" rel="noopener">Live Demo</a>
      <button id="back-to-top">↑ Top</button>
    </div>
  </footer>`;

  document.addEventListener("DOMContentLoaded", () => {
    const headerMount = document.getElementById("site-header");
    const footerMount = document.getElementById("site-footer");
    if (headerMount) headerMount.outerHTML = headerHTML;
    if (footerMount) footerMount.outerHTML = footerHTML;

    // Highlight the active nav link for the current page
    document.querySelectorAll(".main-nav > a, .mega-col a").forEach((a) => {
      const linkPath = new URL(a.href, location.href).pathname.replace(/\/index\.html$/, "/");
      const curPath = path.replace(/\/index\.html$/, "/");
      if (linkPath === curPath) a.classList.add("active");
    });

    // Scroll progress bar + sticky header shadow/shrink
    const progress = document.getElementById("scroll-progress");
    const headerEl = document.querySelector(".site-header");
    window.addEventListener("scroll", () => {
      const h = document.documentElement;
      if (progress) progress.style.width = (h.scrollTop / (h.scrollHeight - h.clientHeight) * 100) + "%";
      if (headerEl) headerEl.classList.toggle("scrolled", h.scrollTop > 10);
    });

    // Mobile off-canvas menu
    const mobileBtn = document.getElementById("mobile-menu-btn");
    const nav = document.getElementById("main-nav");
    const navClose = document.getElementById("nav-close-btn");
    const navBackdrop = document.getElementById("nav-backdrop");
    const closeNav = () => { nav.classList.remove("open"); navBackdrop.classList.remove("open"); };
    if (mobileBtn && nav) {
      mobileBtn.addEventListener("click", () => { nav.classList.add("open"); navBackdrop.classList.add("open"); });
    }
    if (navClose) navClose.addEventListener("click", closeNav);
    if (navBackdrop) navBackdrop.addEventListener("click", closeNav);

    // Language toggle: jump to the equivalent English/Bangla test page
    const langBtn = document.getElementById("lang-toggle");
    if (langBtn) {
      langBtn.addEventListener("click", () => {
        location.href = path.includes("/bangla/") ? BASE + "english/index.html" : BASE + "bangla/index.html";
      });
    }

    // Back to top
    const topBtn = document.getElementById("back-to-top");
    if (topBtn) topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

    // Search overlay: Ctrl+K / search button to open, Esc to close, recent + popular chips
    const searchOverlay = document.getElementById("search-overlay");
    const searchInput = document.getElementById("site-search");
    const resultsBox = document.getElementById("search-results");
    const openSearchBtn = document.getElementById("search-open-btn");
    const recentWrap = document.getElementById("search-recent-wrap");
    const recentBox = document.getElementById("search-recent");
    const popularBox = document.getElementById("search-popular");
    const POPULAR = SITE_PAGES.slice(0, 5);

    function getRecentSearches() {
      return JSON.parse(localStorage.getItem("typingRecentSearches") || "[]");
    }
    function pushRecentSearch(page) {
      let recent = getRecentSearches().filter((p) => p.url !== page.url);
      recent.unshift(page);
      recent = recent.slice(0, 6);
      localStorage.setItem("typingRecentSearches", JSON.stringify(recent));
    }
    function renderChips(container, pages) {
      container.innerHTML = pages.map(p => `<a class="search-chip" href="${p.url}">${p.title}</a>`).join("");
    }
    function openSearch() {
      if (!searchOverlay) return;
      searchOverlay.classList.add("open");
      const recent = getRecentSearches();
      if (recent.length) { recentWrap.style.display = "block"; renderChips(recentBox, recent); }
      else { recentWrap.style.display = "none"; }
      renderChips(popularBox, POPULAR);
      searchInput.value = "";
      resultsBox.innerHTML = "";
      setTimeout(() => searchInput.focus(), 50);
    }
    function closeSearch() { if (searchOverlay) searchOverlay.classList.remove("open"); }

    if (openSearchBtn) openSearchBtn.addEventListener("click", openSearch);
    if (searchOverlay) {
      searchOverlay.addEventListener("click", (e) => { if (e.target === searchOverlay) closeSearch(); });
    }
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
      if (e.key === "Escape") { closeSearch(); if (nav) closeNav(); }
    });

    if (searchInput && resultsBox) {
      searchInput.addEventListener("input", () => {
        const q = searchInput.value.trim().toLowerCase();
        if (!q) { resultsBox.innerHTML = ""; return; }
        const matches = SITE_PAGES.filter(p => (p.title + " " + p.kw).toLowerCase().includes(q)).slice(0, 8);
        resultsBox.innerHTML = matches.map(p => `<a href="${p.url}" data-title="${p.title}">${p.title}</a>`).join("") || `<div class="no-match">No results</div>`;
        resultsBox.querySelectorAll("a").forEach((a) => {
          a.addEventListener("click", () => pushRecentSearch({ title: a.dataset.title, url: a.getAttribute("href") }));
        });
      });
    }

    // Announcement bar dismiss (persists via localStorage)
    const announcement = document.getElementById("announcement-bar");
    const announcementClose = document.getElementById("announcement-close");
    if (announcement) {
      if (localStorage.getItem("typingAnnouncementDismissed") === "1") announcement.style.display = "none";
    }
    if (announcementClose) {
      announcementClose.addEventListener("click", () => {
        announcement.style.display = "none";
        localStorage.setItem("typingAnnouncementDismissed", "1");
      });
    }

    if (typeof initTheme === "function") initTheme();
    if (typeof initSound === "function") initSound();
  });
})();
