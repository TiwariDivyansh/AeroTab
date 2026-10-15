/**
 * AeroTab Omni-Search Widget
 * Features 3D skeuomorphic Frutiger Aero gel search capsule,
 * multi-engine switching (Google, YouTube, DuckDuckGo, Bing, Wikipedia),
 * URL auto-detection, keyboard shortcut (/), and tactile feedback.
 */

const SearchWidget = {
  formEl: null,
  inputEl: null,
  engineBtn: null,
  dropdownMenu: null,
  engineIconEl: null,
  currentEngine: 'google',

  engines: {
    google: {
      name: 'Google',
      icon: '🔍',
      url: 'https://www.google.com/search?q=',
      placeholder: 'Search the web with Google...'
    },
    youtube: {
      name: 'YouTube',
      icon: '📺',
      url: 'https://www.youtube.com/results?search_query=',
      placeholder: 'Search YouTube videos & music...'
    },
    duckduckgo: {
      name: 'DuckDuckGo',
      icon: '🦆',
      url: 'https://duckduckgo.com/?q=',
      placeholder: 'Search privately with DuckDuckGo...'
    },
    bing: {
      name: 'Bing',
      icon: '🌐',
      url: 'https://www.bing.com/search?q=',
      placeholder: 'Search the web with Bing...'
    },
    wikipedia: {
      name: 'Wikipedia',
      icon: '📚',
      url: 'https://en.wikipedia.org/wiki/Special:Search?search=',
      placeholder: 'Search Wikipedia encyclopedia...'
    }
  },

  init: async function() {
    this.formEl = document.getElementById('omni-search-form');
    this.inputEl = document.getElementById('omni-search-input');
    this.engineBtn = document.getElementById('search-engine-btn');
    this.dropdownMenu = document.getElementById('engine-dropdown-menu');
    this.engineIconEl = document.getElementById('current-engine-icon');

    if (!this.formEl || !this.inputEl) return;

    // Load saved engine preference
    try {
      const savedEngine = localStorage.getItem('aerotab_search_engine');
      if (savedEngine && this.engines[savedEngine]) {
        this.setEngine(savedEngine, false);
      } else {
        this.setEngine('google', false);
      }
    } catch (e) {
      this.setEngine('google', false);
    }

    // Bind engine dropdown toggle
    if (this.engineBtn) {
      this.engineBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleDropdown();
      });
    }

    // Engine option click handlers
    if (this.dropdownMenu) {
      this.dropdownMenu.querySelectorAll('.engine-option').forEach(option => {
        option.addEventListener('click', (e) => {
          e.stopPropagation();
          const engineKey = option.getAttribute('data-engine');
          if (engineKey) {
            this.setEngine(engineKey, true);
            this.closeDropdown();
          }
        });
      });
    }

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (this.dropdownMenu && !e.target.closest('#search-engine-selector')) {
        this.closeDropdown();
      }
    });

    // Form submit handler
    this.formEl.addEventListener('submit', (e) => {
      e.preventDefault();
      this.executeSearch();
    });

    // Global hotkey: press '/' or 'Ctrl+K' to focus search
    window.addEventListener('keydown', (e) => {
      const isInputFocused = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
      if (e.key === '/' && !isInputFocused) {
        e.preventDefault();
        this.inputEl.focus();
        this.inputEl.select();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        this.inputEl.focus();
        this.inputEl.select();
      }
    });
  },

  setEngine: function(engineKey, playSfx = true) {
    if (!this.engines[engineKey]) return;
    this.currentEngine = engineKey;
    const info = this.engines[engineKey];

    if (this.engineIconEl) {
      this.engineIconEl.textContent = info.icon;
    }

    if (this.inputEl) {
      this.inputEl.placeholder = info.placeholder;
    }

    if (this.dropdownMenu) {
      this.dropdownMenu.querySelectorAll('.engine-option').forEach(opt => {
        opt.classList.toggle('active', opt.getAttribute('data-engine') === engineKey);
      });
    }

    try {
      localStorage.setItem('aerotab_search_engine', engineKey);
    } catch (e) {}

    if (playSfx && window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
      SoundEngine.playGlassClick();
    }
  },

  toggleDropdown: function() {
    if (!this.dropdownMenu) return;
    const isClosed = this.dropdownMenu.style.display === 'none' || !this.dropdownMenu.style.display;
    if (isClosed) {
      this.dropdownMenu.style.display = 'flex';
      if (window.SoundEngine && typeof SoundEngine.playHoverShimmer === 'function') {
        SoundEngine.playHoverShimmer();
      }
    } else {
      this.closeDropdown();
    }
  },

  closeDropdown: function() {
    if (this.dropdownMenu) {
      this.dropdownMenu.style.display = 'none';
    }
  },

  executeSearch: function() {
    const rawQuery = this.inputEl.value.trim();
    if (!rawQuery) return;

    if (window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
      SoundEngine.playGlassClick();
    }

    // Check if input is a direct URL
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;
    if (urlPattern.test(rawQuery)) {
      const targetUrl = rawQuery.startsWith('http://') || rawQuery.startsWith('https://')
        ? rawQuery
        : `https://${rawQuery}`;
      window.location.href = targetUrl;
      return;
    }

    // Execute engine search query
    const engine = this.engines[this.currentEngine] || this.engines.google;
    const searchUrl = `${engine.url}${encodeURIComponent(rawQuery)}`;
    window.location.href = searchUrl;
  }
};

window.SearchWidget = SearchWidget;
