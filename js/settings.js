/**
 * AeroTab Settings Panel & Customization Controller
 * Manages themes, custom wallpaper uploads, widget toggles, and data backup.
 */

const Settings = {
  panelEl: null,
  overlayEl: null,
  gearBtn: null,
  themeBtn: null,
  activeSubgenre: 'all',
  currentSettings: {},

  init: async function() {
    this.panelEl = document.getElementById('settings-panel');
    this.overlayEl = document.getElementById('settings-overlay');
    this.gearBtn = document.getElementById('settings-btn');
    this.themeBtn = document.getElementById('theme-btn');
    const startBtn = document.getElementById('start-btn');

    this.currentSettings = await AeroStorage.getAll();
    this.render();

    if (this.gearBtn) {
      this.gearBtn.addEventListener('click', () => this.open());
    }

    if (this.themeBtn) {
      this.themeBtn.addEventListener('click', () => {
        this.open();
        const themeSection = document.getElementById('settings-themes-section');
        if (themeSection) themeSection.scrollIntoView({ behavior: 'smooth' });
      });
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => this.open());
    }

    if (this.overlayEl) {
      this.overlayEl.addEventListener('click', () => this.close());
    }

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.panelEl && this.panelEl.classList.contains('active')) {
        this.close();
      }
    });
  },

  open: function() {
    if (!this.panelEl || !this.overlayEl) return;
    this.render();
    this.overlayEl.style.display = 'block';
    this.panelEl.style.display = 'flex';
    this.panelEl.classList.remove('closing');
    this.panelEl.classList.add('active');
  },

  close: function() {
    if (!this.panelEl || !this.overlayEl) return;
    this.panelEl.classList.remove('active');
    this.panelEl.classList.add('closing');
    setTimeout(() => {
      this.panelEl.style.display = 'none';
      this.overlayEl.style.display = 'none';
      this.panelEl.classList.remove('closing');
    }, 240);
  },

  render: async function() {
    if (!this.panelEl) return;
    const s = await AeroStorage.getAll();
    this.currentSettings = s;

    this.panelEl.innerHTML = `
      <div class="settings-header">
        <h2 class="settings-title">⚙️ AeroTab Control Panel</h2>
        <button id="settings-close-x" class="settings-close-btn" title="Close">✕</button>
      </div>

      <!-- User Profile -->
      <section class="settings-section">
        <h3 class="settings-section-title">User Profile</h3>
        <div class="settings-row">
          <label class="settings-label" for="setting-username">Your Name</label>
          <input type="text" id="setting-username" class="glass-input" value="${s.userName || ''}" placeholder="Aero Wanderer" style="width: 160px; text-align: right;">
        </div>
      </section>

      <!-- Living Theme Presets -->
      <section id="settings-themes-section" class="settings-section">
        <h3 class="settings-section-title">Authentic Subgenres & Archival Worlds</h3>
        <div class="subgenre-tabs">
          ${(Themes.subgenres || []).map(sg => `
            <button class="subgenre-tab-btn ${this.activeSubgenre === sg.id ? 'active' : ''}" data-subgenre="${sg.id}">
              ${sg.name}
            </button>
          `).join('')}
        </div>
        <div class="theme-picker-grid">
          ${Object.values(Themes.definitions)
            .filter(th => this.activeSubgenre === 'all' || th.subgenre === this.activeSubgenre)
            .map(th => `
            <div class="theme-card ${s.theme === th.id ? 'active' : ''}" data-theme-id="${th.id}">
              <div class="theme-card-header">
                <span class="theme-subgenre-badge">${th.subgenreName || 'Aero'}</span>
              </div>
              <div class="theme-preview-swatch" style="background: ${th.swatchGradient};"></div>
              <div class="theme-name">${th.name}</div>
              <div class="theme-desc">${th.description}</div>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Custom Wallpaper Uploader & Open-Source Art -->
      <section class="settings-section">
        <h3 class="settings-section-title">Custom / Open-Source Wallpaper</h3>
        <div style="font-size:12px; color:rgba(255,255,255,0.85); line-height:1.4;">
          Use any open-source image or personal Frutiger Aero wallpaper from your computer.
        </div>
        <div style="display:flex; gap:8px; margin-top:6px;">
          <label class="glass-button" style="flex:1; text-align:center; cursor:pointer; font-size:12px;">
            📁 Upload Image
            <input type="file" id="input-custom-wallpaper" accept="image/*" style="display:none;">
          </label>
          <button id="btn-reset-wallpaper" class="glass-button" style="font-size:12px;">Reset</button>
        </div>
      </section>

      <!-- Clock & Date -->
      <section class="settings-section">
        <h3 class="settings-section-title">Clock & Time Format</h3>
        <div class="settings-row">
          <span class="settings-label">24-Hour Format</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-24hour" ${s.use24Hour ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Show Seconds</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-seconds" ${s.showSeconds ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- Weather Gadget -->
      <section class="settings-section">
        <h3 class="settings-section-title">Atmosphere & Weather</h3>
        <div class="settings-row">
          <span class="settings-label">Enable Weather Gadget</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-weather" ${s.showWeather ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <label class="settings-label" for="setting-weather-city">Target City</label>
          <input type="text" id="setting-weather-city" class="glass-input" value="${s.weatherCity || ''}" placeholder="Leave blank for GPS" style="width: 160px;">
        </div>
        <div class="settings-row">
          <label class="settings-label" for="setting-weather-unit">Temperature Unit</label>
          <select id="setting-weather-unit" class="glass-input" style="width: 100px;">
            <option value="metric" ${s.weatherUnit === 'metric' ? 'selected' : ''}>Celsius (°C)</option>
            <option value="imperial" ${s.weatherUnit === 'imperial' ? 'selected' : ''}>Fahrenheit (°F)</option>
          </select>
        </div>
      </section>

      <!-- Gadget Arrangement -->
      <section class="settings-section">
        <h3 class="settings-section-title">Gadget Arrangement</h3>
        <div class="settings-row">
          <span class="settings-label">Greeting & Focus Bar</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-greeting" ${s.showGreeting ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Aero Analog Clock</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-clock" ${s.showClock ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Aero Sound Player</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-player" checked>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Focus Tasks Gadget</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-tasks" ${s.showTasks ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-row">
          <span class="settings-label">Quick Launch Bookmarks</span>
          <label class="toggle-switch">
            <input type="checkbox" id="setting-show-bookmarks" ${s.showBookmarks ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
      </section>

      <!-- Ambient Audio Master -->
      <section class="settings-section">
        <h3 class="settings-section-title">Master Audio Level</h3>
        <div class="settings-row">
          <span class="settings-label">Volume</span>
          <input type="range" id="setting-master-volume" class="sound-channel-slider" min="0" max="1" step="0.05" value="${s.soundVolume !== undefined ? s.soundVolume : 0.45}" style="width: 140px;">
        </div>
      </section>

      <!-- Backup & Restore -->
      <section class="settings-section">
        <h3 class="settings-section-title">Data Backup</h3>
        <div class="settings-btn-group">
          <button id="btn-export-settings" class="glass-button">Export JSON</button>
          <label class="glass-button" style="text-align:center; cursor:pointer;">
            Import JSON
            <input type="file" id="input-import-settings" accept=".json" style="display:none;">
          </label>
        </div>
        <button id="btn-reset-settings" class="glass-button" style="color:#ef4444; border-color:rgba(239,68,68,0.4); margin-top:4px;">
          Restore Factory Defaults
        </button>
      </section>

      <!-- About -->
      <div class="settings-about">
        <div><strong>AeroTab</strong> — True Frutiger Aero Revival</div>
        <div>100% Client-Side · Zero Telemetry · Open Source</div>
      </div>
    `;

    this.bindEvents();
  },

  bindEvents: function() {
    const closeBtn = document.getElementById('settings-close-x');
    if (closeBtn) closeBtn.addEventListener('click', () => this.close());

    // User Name
    const usernameInput = document.getElementById('setting-username');
    if (usernameInput) {
      usernameInput.addEventListener('change', async (e) => {
        const val = e.target.value.trim();
        await AeroStorage.set('userName', val);
        if (window.Greeting) window.Greeting.updateGreeting(val);
      });
    }

    // Subgenre Filter Tabs
    document.querySelectorAll('.subgenre-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.activeSubgenre = btn.dataset.subgenre;
        this.render();
      });
    });

    // Themes
    document.querySelectorAll('.theme-card').forEach(card => {
      card.addEventListener('click', async () => {
        const themeId = card.dataset.themeId;
        await AeroStorage.set('theme', themeId);
        Themes.apply(themeId, true);
        document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
      });
    });

    // Custom Wallpaper Upload
    const wpUploadInput = document.getElementById('input-custom-wallpaper');
    if (wpUploadInput) {
      wpUploadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (evt) => {
          const dataUrl = evt.target.result;
          if (window.BackgroundEngine) {
            window.BackgroundEngine.setCustomWallpaper(dataUrl);
          }
          try {
            localStorage.setItem('aerotab_custom_wallpaper', dataUrl);
          } catch (err) {}
        };
        reader.readAsDataURL(file);
      });
    }

    const resetWpBtn = document.getElementById('btn-reset-wallpaper');
    if (resetWpBtn) {
      resetWpBtn.addEventListener('click', () => {
        try {
          localStorage.removeItem('aerotab_custom_wallpaper');
        } catch (e) {}
        if (window.BackgroundEngine) {
          window.BackgroundEngine.customWallpaperUrl = null;
          if (window.Themes && window.Themes.definitions[window.Themes.currentTheme]) {
            window.BackgroundEngine.setTheme(window.Themes.definitions[window.Themes.currentTheme]);
          }
        }
      });
    }

    // 24 Hour
    const h24Input = document.getElementById('setting-24hour');
    if (h24Input) {
      h24Input.addEventListener('change', async (e) => {
        await AeroStorage.set('use24Hour', e.target.checked);
        if (window.ClockWidget) window.ClockWidget.updateSettings({ use24Hour: e.target.checked });
      });
    }

    // Seconds
    const secInput = document.getElementById('setting-seconds');
    if (secInput) {
      secInput.addEventListener('change', async (e) => {
        await AeroStorage.set('showSeconds', e.target.checked);
        if (window.ClockWidget) window.ClockWidget.updateSettings({ showSeconds: e.target.checked });
      });
    }

    // Weather toggle
    const weatherToggle = document.getElementById('setting-show-weather');
    if (weatherToggle) {
      weatherToggle.addEventListener('change', async (e) => {
        await AeroStorage.set('showWeather', e.target.checked);
        const wEl = document.getElementById('weather-widget');
        if (wEl) wEl.style.display = e.target.checked ? '' : 'none';
        if (e.target.checked && window.WeatherWidget) window.WeatherWidget.fetchWeather(true);
      });
    }

    // Weather city
    const cityInput = document.getElementById('setting-weather-city');
    if (cityInput) {
      cityInput.addEventListener('change', async (e) => {
        await AeroStorage.set('weatherCity', e.target.value.trim());
        if (window.WeatherWidget) window.WeatherWidget.fetchWeather(true);
      });
    }

    // Weather unit
    const unitSelect = document.getElementById('setting-weather-unit');
    if (unitSelect) {
      unitSelect.addEventListener('change', async (e) => {
        await AeroStorage.set('weatherUnit', e.target.value);
        if (window.WeatherWidget) window.WeatherWidget.fetchWeather(true);
      });
    }

    // Media Player toggle
    const playerToggle = document.getElementById('setting-show-player');
    if (playerToggle) {
      playerToggle.addEventListener('change', (e) => {
        const pEl = document.getElementById('media-player-widget');
        if (pEl) pEl.style.display = e.target.checked ? '' : 'none';
      });
    }

    // Greeting toggle
    const greetingToggle = document.getElementById('setting-show-greeting');
    if (greetingToggle) {
      greetingToggle.addEventListener('change', async (e) => {
        await AeroStorage.set('showGreeting', e.target.checked);
        const el = document.getElementById('greeting-section');
        if (el) el.style.display = e.target.checked ? '' : 'none';
      });
    }

    // Analog clock toggle
    const clockToggle = document.getElementById('setting-show-clock');
    if (clockToggle) {
      clockToggle.addEventListener('change', async (e) => {
        await AeroStorage.set('showClock', e.target.checked);
        const el = document.getElementById('analog-clock-widget');
        if (el) el.style.display = e.target.checked ? '' : 'none';
      });
    }

    // Tasks toggle
    const tasksToggle = document.getElementById('setting-show-tasks');
    if (tasksToggle) {
      tasksToggle.addEventListener('change', async (e) => {
        await AeroStorage.set('showTasks', e.target.checked);
        const el = document.getElementById('tasks-widget');
        if (el) el.style.display = e.target.checked ? '' : 'none';
      });
    }

    // Bookmarks toggle
    const bmToggle = document.getElementById('setting-show-bookmarks');
    if (bmToggle) {
      bmToggle.addEventListener('change', async (e) => {
        await AeroStorage.set('showBookmarks', e.target.checked);
        const el = document.getElementById('bookmarks-widget');
        if (el) el.style.display = e.target.checked ? '' : 'none';
      });
    }

    // Master Volume
    const volInput = document.getElementById('setting-master-volume');
    if (volInput) {
      volInput.addEventListener('input', (e) => {
        if (window.SoundEngine) window.SoundEngine.setMasterVolume(parseFloat(e.target.value));
      });
    }

    // Export
    const exportBtn = document.getElementById('btn-export-settings');
    if (exportBtn) {
      exportBtn.addEventListener('click', async () => {
        const data = await AeroStorage.getAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `aerotab-backup-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // Import
    const importInput = document.getElementById('input-import-settings');
    if (importInput) {
      importInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const parsed = JSON.parse(event.target.result);
            await AeroStorage.setMultiple(parsed);
            window.location.reload();
          } catch (err) {
            alert('Invalid backup JSON file.');
          }
        };
        reader.readAsText(file);
      });
    }

    // Reset
    const resetBtn = document.getElementById('btn-reset-settings');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm('Are you sure you want to restore factory default settings?')) {
          await AeroStorage.reset();
          try { localStorage.removeItem('aerotab_custom_wallpaper'); } catch (e) {}
          window.location.reload();
        }
      });
    }
  }
};

window.Settings = Settings;
