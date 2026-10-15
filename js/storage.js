/**
 * AeroTab Storage Adapter
 * Provides transparent sync between chrome.storage.sync and localStorage
 */

const AeroStorage = {
  defaults: {
    userName: '',
    theme: 'bliss',
    use24Hour: false,
    showSeconds: false,
    showWeather: true,
    weatherUnit: 'metric',
    weatherCity: '',
    weatherApiKey: '',
    showTasks: true,
    showBookmarks: true,
    showGreeting: true,
    showClock: true,
    showSoundMixer: false,
    soundVolume: 0.35,
    activeSounds: [],
    tasks: [
      { id: 't1', text: 'Welcome to AeroTab ✨', done: true, createdAt: Date.now() - 3600000 },
      { id: 't2', text: 'Click focus bar to set your daily goal', done: false, createdAt: Date.now() }
    ],
    bookmarks: [
      { id: 'b1', label: 'Google', url: 'https://google.com', icon: '🔍' },
      { id: 'b2', label: 'YouTube', url: 'https://youtube.com', icon: '📺' },
      { id: 'b3', label: 'GitHub', url: 'https://github.com', icon: '💻' },
      { id: 'b4', label: 'r/Aero', url: 'https://reddit.com/r/FrutigerAero', icon: '🌊' }
    ],
    focusText: '',
    lastFocusDate: '',
    fontTone: 'auto',
    highContrastBackplates: false,
    activeRightGadget: 'notes',
    stickyNotesContent: 'Welcome to AeroTab ✨\nUse this translucent glass note for quick scratchpad thoughts, links, and fleeting ideas.\nAuto-saved locally in real time.',
    diaryEntries: [],
    scenicMode: false
  },

  isChromeStorageAvailable: function() {
    return typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync;
  },

  getAll: function() {
    return new Promise((resolve) => {
      if (this.isChromeStorageAvailable()) {
        chrome.storage.sync.get(null, (items) => {
          if (chrome.runtime.lastError) {
            console.warn('Chrome storage read error, falling back to localStorage:', chrome.runtime.lastError);
            resolve(this._getFromLocal());
          } else {
            resolve({ ...this.defaults, ...items });
          }
        });
      } else {
        resolve(this._getFromLocal());
      }
    });
  },

  get: function(key) {
    return this.getAll().then(all => all[key] !== undefined ? all[key] : this.defaults[key]);
  },

  set: function(key, value) {
    return this.setMultiple({ [key]: value });
  },

  setMultiple: function(obj) {
    return new Promise((resolve) => {
      // Always sync to localStorage as well for instant cache
      try {
        const current = this._getFromLocal();
        const updated = { ...current, ...obj };
        localStorage.setItem('aerotab_settings', JSON.stringify(updated));
      } catch (e) {
        console.warn('localStorage write error:', e);
      }

      if (this.isChromeStorageAvailable()) {
        chrome.storage.sync.set(obj, () => {
          if (chrome.runtime.lastError) {
            console.warn('Chrome storage write error:', chrome.runtime.lastError);
          }
          resolve(obj);
        });
      } else {
        resolve(obj);
      }
    });
  },

  reset: function() {
    return new Promise((resolve) => {
      try {
        localStorage.removeItem('aerotab_settings');
      } catch (e) {}

      if (this.isChromeStorageAvailable()) {
        chrome.storage.sync.clear(() => {
          resolve(this.defaults);
        });
      } else {
        resolve(this.defaults);
      }
    });
  },

  _getFromLocal: function() {
    try {
      const data = localStorage.getItem('aerotab_settings');
      if (data) {
        return { ...this.defaults, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return { ...this.defaults };
  }
};

window.AeroStorage = AeroStorage;
