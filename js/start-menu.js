/**
 * AeroTab Vista Start Menu Controller
 * Recreates the iconic Windows Vista Aero Glass Start Menu experience.
 */

const StartMenu = {
  panelEl: null,
  startBtn: null,
  searchInput: null,
  isOpen: false,

  init: function() {
    this.panelEl = document.getElementById('start-menu-panel');
    this.startBtn = document.getElementById('start-btn');
    this.searchInput = document.getElementById('start-menu-search-input');

    if (!this.panelEl || !this.startBtn) return;

    // Toggle Start Menu on Start Orb click
    this.startBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (this.isOpen && !e.target.closest('#start-menu-panel') && !e.target.closest('#start-btn')) {
        this.close();
      }
    });

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });

    // Prevent clicks inside menu from closing it
    this.panelEl.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Start Menu Search input
    if (this.searchInput) {
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = this.searchInput.value.trim();
          if (q) {
            window.location.href = `https://www.google.com/search?q=${encodeURIComponent(q)}`;
          }
        }
      });
    }

    // System action buttons inside Start Menu
    const themesBtn = document.getElementById('start-open-themes-btn');
    if (themesBtn) {
      themesBtn.addEventListener('click', () => {
        this.close();
        if (window.Settings) {
          Settings.open();
          const themeSection = document.getElementById('settings-themes-section');
          if (themeSection) themeSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }

    const musicBtn = document.getElementById('start-open-music-btn');
    if (musicBtn) {
      musicBtn.addEventListener('click', () => {
        this.close();
        const playlistTray = document.getElementById('player-playlist-tray');
        if (playlistTray) {
          playlistTray.style.display = playlistTray.style.display === 'none' ? 'flex' : 'none';
        }
        if (window.SoundEngine && typeof SoundEngine.playTrack === 'function') {
          if (!SoundEngine.isMusicPlaying) {
            SoundEngine.playTrack(SoundEngine.currentTrackIndex);
          }
        }
      });
    }

    const ambientBtn = document.getElementById('start-open-ambient-btn');
    if (ambientBtn) {
      ambientBtn.addEventListener('click', () => {
        this.close();
        if (window.SoundEngine && typeof SoundEngine.toggleMixerPanel === 'function') {
          SoundEngine.toggleMixerPanel();
        }
      });
    }

    const settingsBtn = document.getElementById('start-open-settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.close();
        if (window.Settings) Settings.open();
      });
    }

    const powerBtn = document.getElementById('start-power-btn');
    if (powerBtn) {
      powerBtn.addEventListener('click', () => {
        if (window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
          SoundEngine.playGlassClick();
        }
        window.location.reload();
      });
    }
  },

  toggle: function() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  },

  open: function() {
    if (!this.panelEl) return;
    this.panelEl.style.display = 'flex';
    this.panelEl.classList.add('active');
    this.isOpen = true;
    if (this.startBtn) this.startBtn.classList.add('active');

    if (window.SoundEngine && typeof SoundEngine.playHoverShimmer === 'function') {
      SoundEngine.playHoverShimmer();
    }

    if (this.searchInput) {
      setTimeout(() => this.searchInput.focus(), 100);
    }
  },

  close: function() {
    if (!this.panelEl) return;
    this.panelEl.style.display = 'none';
    this.panelEl.classList.remove('active');
    this.isOpen = false;
    if (this.startBtn) this.startBtn.classList.remove('active');
  }
};

window.StartMenu = StartMenu;
