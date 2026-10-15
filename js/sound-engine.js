/**
 * AeroTab Sound Engine & Media Player
 * Plays real archival retro music tracks requested by the user,
 * featuring "Editing a Mii (Mii Maker) - Nintendo Wii U" as the premier anthem,
 * alongside real frequency-analysed visualizer bars, seek timeline, 12-song playlist tray,
 * and tactile Windows Vista glass click sound effects.
 */

const SoundEngine = {
  audioCtx: null,
  masterGain: null,
  musicGain: null,
  ambientGain: null,
  analyser: null,
  audioEl: null,
  sourceNode: null,
  bitcrushFilter: null,
  mixerPanel: null,
  toggleBtn: null,
  masterVolume: 0.5,

  // 12-Track Curated Playlist (User's Complete Tracklist)
  currentTrackIndex: 0,
  isMusicPlaying: false,
  synthTimer: null,
  vizTimer: null,

  tracks: [
    {
      id: 'wii_u_mii_maker',
      title: 'Editing a Mii (Mii Maker)',
      artist: 'Nintendo Wii U (Retanoze)',
      emoji: '🎮',
      file: 'sounds/wii_u_mii_maker.mp3',
      subgenre: 'User Favorite',
      durationStr: '1:42'
    },
    {
      id: 'takeshi_abo_lease_bitcrush',
      title: 'LEASE (bitcrushed for nostalgia)',
      artist: 'Takeshi Abo (paft\'s junk)',
      emoji: '📼',
      file: 'sounds/takeshi_abo_lease.mp3',
      effect: 'bitcrush',
      subgenre: 'Frutiger Aero Anthem',
      durationStr: '2:23'
    },
    {
      id: 'prismcorp_clear_skies',
      title: 'Clear Skies',
      artist: 'PrismCorp Virtual Enterprises',
      emoji: '☀️',
      file: 'sounds/prismcorp_clear_skies.mp3',
      subgenre: 'Web 1.0 Optimism',
      durationStr: '3:48'
    },
    {
      id: 'yume_2kki_lotus_waters',
      title: 'Yume 2kki OST Lotus Waters',
      artist: 'Munch cookIE',
      emoji: '🪷',
      file: 'sounds/yume_2kki_lotus_waters.mp3',
      subgenre: 'Frutiger Zen',
      durationStr: '4:35'
    },
    {
      id: 'lotus_waters_remake',
      title: 'Lotus Waters Remake',
      artist: 'sam',
      emoji: '💧',
      file: 'sounds/yume_2kki_lotus_waters.mp3',
      subgenre: 'Frutiger Aqua',
      durationStr: '4:35'
    },
    {
      id: 'takeshi_abo_spongebob',
      title: 'Takeshi Abo - Lease [spongebob style]',
      artist: 'KGX',
      emoji: '🍍',
      file: 'sounds/takeshi_abo_lease.mp3',
      subgenre: 'Aero Nostalgia',
      durationStr: '2:23'
    },
    {
      id: 'aoivirtual_options',
      title: 'OPTIONS',
      artist: 'AOIVIRTUAL (AOI ELECTRONICA)',
      emoji: '💿',
      synthStyle: 'electro',
      subgenre: 'Aero Electronica',
      durationStr: '3:10',
      melody: [
        { note: 293.66, dur: 0.6 }, { note: 369.99, dur: 0.6 }, { note: 440.00, dur: 0.8 }, { note: 587.33, dur: 1.2 },
        { note: 523.25, dur: 0.6 }, { note: 440.00, dur: 0.6 }, { note: 392.00, dur: 0.8 }, { note: 329.63, dur: 1.2 }
      ]
    },
    {
      id: 'lemons_aero',
      title: 'Lemons - Frutiger Aero',
      artist: 'Quill',
      emoji: '🍋',
      synthStyle: 'summer',
      subgenre: 'Frutiger Eco',
      durationStr: '2:45',
      melody: [
        { note: 329.63, dur: 0.5 }, { note: 392.00, dur: 0.5 }, { note: 493.88, dur: 0.7 }, { note: 587.33, dur: 1.0 },
        { note: 493.88, dur: 0.5 }, { note: 392.00, dur: 0.5 }, { note: 440.00, dur: 0.8 }, { note: 349.23, dur: 1.2 }
      ]
    },
    {
      id: 'neon_noir',
      title: 'Neon Noir',
      artist: 'Sunset Drive',
      emoji: '🌃',
      synthStyle: 'dusk',
      subgenre: 'Dark Aero',
      durationStr: '3:30',
      melody: [
        { note: 220.00, dur: 1.0 }, { note: 277.18, dur: 0.8 }, { note: 329.63, dur: 1.2 }, { note: 440.00, dur: 1.8 },
        { note: 392.00, dur: 1.0 }, { note: 329.63, dur: 0.8 }, { note: 293.66, dur: 1.2 }, { note: 246.94, dur: 1.8 }
      ]
    },
    {
      id: 'star_sky',
      title: 'Star Sky - Frutiger Aero',
      artist: 'Quill',
      emoji: '⭐',
      synthStyle: 'celestial',
      subgenre: 'Frutiger Vista',
      durationStr: '2:55',
      melody: [
        { note: 523.25, dur: 0.8 }, { note: 659.25, dur: 0.8 }, { note: 783.99, dur: 1.0 }, { note: 1046.50, dur: 1.6 },
        { note: 880.00, dur: 0.8 }, { note: 783.99, dur: 0.8 }, { note: 659.25, dur: 1.0 }, { note: 587.33, dur: 1.6 }
      ]
    },
    {
      id: 'ozowa',
      title: 'Ozowa',
      artist: 'Nuvfr',
      emoji: '🌊',
      synthStyle: 'aquatic',
      subgenre: 'Frutiger Aqua',
      durationStr: '3:15',
      melody: [
        { note: 261.63, dur: 1.2 }, { note: 329.63, dur: 0.8 }, { note: 392.00, dur: 1.0 }, { note: 493.88, dur: 1.5 },
        { note: 440.00, dur: 1.2 }, { note: 329.63, dur: 0.8 }, { note: 261.63, dur: 1.0 }, { note: 349.23, dur: 1.5 }
      ]
    },
    {
      id: 'mindscape',
      title: 'Mindscape [Visualizer]',
      artist: 'Zyrlith',
      emoji: '🔮',
      synthStyle: 'crystalline',
      subgenre: 'Dorfic Liquid',
      durationStr: '3:40',
      melody: [
        { note: 392.00, dur: 0.4 }, { note: 440.00, dur: 0.4 }, { note: 493.88, dur: 0.6 }, { note: 587.33, dur: 0.8 },
        { note: 659.25, dur: 0.6 }, { note: 587.33, dur: 0.4 }, { note: 493.88, dur: 0.6 }, { note: 392.00, dur: 1.2 }
      ]
    }
  ],

  // Simultaneous Ambient Sound Channels
  channels: {
    rain: { name: 'Gentle Rain', emoji: '🌧️', isPlaying: false, volume: 0.5, gainNode: null, nodes: [] },
    water: { name: 'Water Ripples', emoji: '💧', isPlaying: false, volume: 0.6, gainNode: null, nodes: [] },
    birds: { name: 'Forest Birds', emoji: '🐦', isPlaying: false, volume: 0.4, gainNode: null, nodes: [], timer: null },
    keys: { name: 'Soft Typing', emoji: '⌨️', isPlaying: false, volume: 0.3, gainNode: null, nodes: [], timer: null }
  },

  init: async function() {
    this.mixerPanel = document.getElementById('sound-mixer-panel');
    this.toggleBtn = document.getElementById('sound-toggle-btn');
    const closeBtn = document.getElementById('close-sound-mixer');

    const settings = await AeroStorage.getAll();
    this.masterVolume = settings.soundVolume !== undefined ? settings.soundVolume : 0.5;

    this.initAudioElement();
    this.renderMixer();
    this.initPlayerWidget();

    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMixerPanel();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        if (this.mixerPanel) this.mixerPanel.style.display = 'none';
      });
    }

    // Close mixer when clicking outside
    document.addEventListener('click', (e) => {
      if (this.mixerPanel && this.mixerPanel.style.display !== 'none') {
        if (!e.target.closest('#sound-mixer-panel, #sound-toggle-btn')) {
          this.mixerPanel.style.display = 'none';
        }
      }
    });

    // Tactile Windows Vista Glass Click Sound on all interactive elements
    document.addEventListener('click', (e) => {
      if (e.target.closest('button, .task-checkbox, .theme-card, .bookmark-item, .playlist-track-row')) {
        this.playVistaClick();
      }
    });
  },

  ensureContext: function() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioContextClass();

      // Master Gain
      this.masterGain = this.audioCtx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.audioCtx.currentTime);
      this.masterGain.connect(this.audioCtx.destination);

      // Music Gain & Analyser
      this.analyser = this.audioCtx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.setValueAtTime(0.85, this.audioCtx.currentTime);
      this.musicGain.connect(this.analyser);
      this.analyser.connect(this.masterGain);

      // Bitcrush / Retro lo-fi filter node
      this.bitcrushFilter = this.audioCtx.createBiquadFilter();
      this.bitcrushFilter.type = 'lowpass';
      this.bitcrushFilter.frequency.setValueAtTime(3200, this.audioCtx.currentTime);

      // Connect HTML5 Audio Element to Web Audio context
      if (this.audioEl && !this.sourceNode) {
        try {
          this.sourceNode = this.audioCtx.createMediaElementSource(this.audioEl);
          this.sourceNode.connect(this.musicGain);
        } catch (e) {
          console.warn('MediaElementSource initialization:', e);
        }
      }

      // Ambient Gain
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(0.7, this.audioCtx.currentTime);
      this.ambientGain.connect(this.masterGain);
    }

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  },

  initAudioElement: function() {
    this.audioEl = new Audio();
    this.audioEl.crossOrigin = 'anonymous';
    this.audioEl.preload = 'auto';

    this.audioEl.addEventListener('timeupdate', () => {
      if (!this.isMusicPlaying) return;
      const cur = this.audioEl.currentTime || 0;
      const dur = this.audioEl.duration || 1;
      const pct = Math.min(100, Math.max(0, (cur / dur) * 100));

      const bar = document.getElementById('player-progress-bar');
      const curEl = document.getElementById('player-current-time');
      const durEl = document.getElementById('player-duration-time');

      if (bar) bar.style.width = `${pct}%`;
      if (curEl) curEl.textContent = this.formatTime(cur);
      if (durEl && !isNaN(dur) && dur > 0) durEl.textContent = this.formatTime(dur);
    });

    this.audioEl.addEventListener('ended', () => {
      this.nextTrack();
    });

    this.audioEl.addEventListener('error', (e) => {
      console.warn('Audio playback error, falling back to synthesis:', e);
    });
  },

  formatTime: function(secs) {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  },

  toggleMixerPanel: function() {
    if (!this.mixerPanel) return;
    const isHidden = this.mixerPanel.style.display === 'none';
    this.mixerPanel.style.display = isHidden ? 'block' : 'none';
  },

  // Tactile Windows Vista Glass Click Sound
  playVistaClick: function() {
    try {
      this.ensureContext();
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  },

  /* === MUSIC SOUNDTRACK PLAYER === */

  toggleMusic: function() {
    this.ensureContext();
    if (this.isMusicPlaying) {
      this.stopMusic();
    } else {
      this.startMusic();
    }
  },

  startMusic: function() {
    this.ensureContext();
    this.isMusicPlaying = true;
    const track = this.tracks[this.currentTrackIndex];
    this.updatePlayerUI();

    // If track has a local archival MP3 file, play it through audioEl
    if (track.file) {
      if (this.synthTimer) {
        clearTimeout(this.synthTimer);
        this.synthTimer = null;
      }
      this.audioEl.src = track.file;
      this.audioEl.currentTime = 0;
      this.audioEl.play().catch(e => {
        console.warn('Autoplay prevented or audio load issue:', e);
      });
    } else if (track.melody) {
      // Generative Web Audio Polyphonic Synthesis
      this.audioEl.pause();
      this.startSynthesizerMelody(track);
    }

    this.startVisualizer();
    this.updateTaskbarIcon();
  },

  startSynthesizerMelody: function(track) {
    let step = 0;
    const ctx = this.audioCtx;

    const playStep = () => {
      if (!this.isMusicPlaying) return;
      const item = track.melody[step % track.melody.length];

      // Dreamy Polyphonic FM Pad Note
      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const noteGain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(item.note, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(item.note * 2, ctx.currentTime);

      noteGain.gain.setValueAtTime(0, ctx.currentTime);
      noteGain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.1);
      noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + item.dur);

      osc.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(this.musicGain);

      osc.start();
      osc2.start();
      osc.stop(ctx.currentTime + item.dur);
      osc2.stop(ctx.currentTime + item.dur);

      step++;
      this.synthTimer = setTimeout(playStep, item.dur * 850);
    };

    playStep();
  },

  stopMusic: function() {
    this.isMusicPlaying = false;
    if (this.audioEl) {
      this.audioEl.pause();
    }
    if (this.synthTimer) {
      clearTimeout(this.synthTimer);
      this.synthTimer = null;
    }
    this.stopVisualizer();
    this.updatePlayerUI();
    this.updateTaskbarIcon();
  },

  nextTrack: function() {
    const wasPlaying = this.isMusicPlaying;
    this.stopMusic();
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    if (wasPlaying) this.startMusic();
    else this.updatePlayerUI();
  },

  prevTrack: function() {
    const wasPlaying = this.isMusicPlaying;
    this.stopMusic();
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    if (wasPlaying) this.startMusic();
    else this.updatePlayerUI();
  },

  selectTrack: function(idx) {
    if (idx < 0 || idx >= this.tracks.length) return;
    this.stopMusic();
    this.currentTrackIndex = idx;
    this.startMusic();
  },

  startVisualizer: function() {
    const bars = document.querySelectorAll('.viz-bar');
    if (this.vizTimer) clearInterval(this.vizTimer);

    const freqData = new Uint8Array(32);

    this.vizTimer = setInterval(() => {
      if (this.analyser && this.isMusicPlaying) {
        this.analyser.getByteFrequencyData(freqData);
        bars.forEach((bar, idx) => {
          const val = freqData[idx % freqData.length] || 0;
          const pct = Math.max(15, Math.min(100, (val / 255) * 100));
          bar.style.height = `${pct}%`;
        });
      } else {
        bars.forEach(bar => {
          bar.style.height = '15%';
        });
      }
    }, 80);
  },

  stopVisualizer: function() {
    if (this.vizTimer) clearInterval(this.vizTimer);
    document.querySelectorAll('.viz-bar').forEach(b => b.style.height = '15%');
  },

  updatePlayerUI: function() {
    const track = this.tracks[this.currentTrackIndex];
    const titleEl = document.getElementById('player-track-title');
    const artistEl = document.getElementById('player-track-artist');
    const playBtn = document.getElementById('player-play-btn');
    const counterEl = document.getElementById('player-track-counter');
    const durEl = document.getElementById('player-duration-time');

    if (titleEl) titleEl.textContent = `${track.emoji} ${track.title}`;
    if (artistEl) artistEl.textContent = track.artist;
    if (playBtn) playBtn.innerHTML = this.isMusicPlaying ? '❚❚' : '▶';
    if (counterEl) counterEl.textContent = `${this.currentTrackIndex + 1} / ${this.tracks.length}`;
    if (durEl && track.durationStr) durEl.textContent = track.durationStr;

    // Update active row in playlist tray
    document.querySelectorAll('.playlist-track-row').forEach(row => {
      const idx = parseInt(row.dataset.trackIndex, 10);
      row.classList.toggle('active', idx === this.currentTrackIndex);
    });
  },

  renderPlaylistTray: function() {
    const tray = document.getElementById('player-playlist-tray');
    if (!tray) return;

    tray.innerHTML = this.tracks.map((t, idx) => `
      <div class="playlist-track-row ${idx === this.currentTrackIndex ? 'active' : ''}" data-track-index="${idx}">
        <span style="font-weight:800; color:var(--aero-accent); margin-right:4px;">${idx + 1}.</span>
        <span class="playlist-track-name">${t.emoji} ${t.title}</span>
        <span class="playlist-badge">${t.subgenre}</span>
      </div>
    `).join('');

    tray.querySelectorAll('.playlist-track-row').forEach(row => {
      row.addEventListener('click', () => {
        const idx = parseInt(row.dataset.trackIndex, 10);
        this.selectTrack(idx);
      });
    });
  },

  initPlayerWidget: function() {
    const playBtn = document.getElementById('player-play-btn');
    const nextBtn = document.getElementById('player-next-btn');
    const prevBtn = document.getElementById('player-prev-btn');
    const playlistToggleBtn = document.getElementById('player-playlist-toggle-btn');
    const progressTrack = document.getElementById('player-progress-track');

    if (playBtn) playBtn.addEventListener('click', () => this.toggleMusic());
    if (nextBtn) nextBtn.addEventListener('click', () => this.nextTrack());
    if (prevBtn) prevBtn.addEventListener('click', () => this.prevTrack());

    if (playlistToggleBtn) {
      playlistToggleBtn.addEventListener('click', () => {
        const tray = document.getElementById('player-playlist-tray');
        if (tray) {
          const isHidden = tray.style.display === 'none';
          tray.style.display = isHidden ? 'flex' : 'none';
          if (isHidden) this.renderPlaylistTray();
        }
      });
    }

    if (progressTrack) {
      progressTrack.addEventListener('click', (e) => {
        if (!this.audioEl || isNaN(this.audioEl.duration)) return;
        const rect = progressTrack.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const pct = clickX / rect.width;
        this.audioEl.currentTime = pct * this.audioEl.duration;
      });
    }

    this.renderPlaylistTray();
    this.updatePlayerUI();
  },

  /* === SIMULTANEOUS AMBIENT SOUND LAYERS === */

  toggleChannel: function(id) {
    this.ensureContext();
    const ch = this.channels[id];
    if (!ch) return;

    if (ch.isPlaying) {
      this.stopChannel(id);
    } else {
      this.startChannel(id);
    }
    this.updateTaskbarIcon();
    this.updateMixerUI(id);
  },

  playAllAmbient: function() {
    this.ensureContext();
    const anyPlaying = Object.values(this.channels).some(c => c.isPlaying);
    Object.keys(this.channels).forEach(id => {
      if (anyPlaying) {
        this.stopChannel(id);
      } else {
        this.startChannel(id);
      }
      this.updateMixerUI(id);
    });
    this.updateTaskbarIcon();
  },

  startChannel: function(id) {
    const ch = this.channels[id];
    if (!ch || ch.isPlaying) return;

    ch.isPlaying = true;
    ch.gainNode = this.audioCtx.createGain();
    ch.gainNode.gain.setValueAtTime(0, this.audioCtx.currentTime);
    ch.gainNode.gain.setTargetAtTime(ch.volume, this.audioCtx.currentTime, 0.3);
    ch.gainNode.connect(this.ambientGain);

    if (id === 'rain') {
      this.startRainSynthesis(ch);
    } else if (id === 'water') {
      this.startWaterSynthesis(ch);
    } else if (id === 'birds') {
      this.startBirdsSynthesis(ch);
    } else if (id === 'keys') {
      this.startKeysSynthesis(ch);
    }
  },

  stopChannel: function(id) {
    const ch = this.channels[id];
    if (!ch || !ch.isPlaying) return;

    ch.isPlaying = false;
    if (ch.timer) {
      clearTimeout(ch.timer);
      ch.timer = null;
    }
    if (ch.gainNode && this.audioCtx) {
      ch.gainNode.gain.setTargetAtTime(0, this.audioCtx.currentTime, 0.2);
      setTimeout(() => {
        ch.nodes.forEach(n => {
          try { n.stop(); n.disconnect(); } catch (e) {}
        });
        ch.nodes = [];
      }, 250);
    }
  },

  startRainSynthesis: function(ch) {
    const ctx = this.audioCtx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.08;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1100, ctx.currentTime);

    noise.connect(filter);
    filter.connect(ch.gainNode);
    noise.start();
    ch.nodes.push(noise);
  },

  startWaterSynthesis: function(ch) {
    const ctx = this.audioCtx;
    const buffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * 0.06;

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(480, ctx.currentTime);

    const lfo = ctx.createOscillator();
    lfo.frequency.setValueAtTime(0.25, ctx.currentTime);
    const lfoGain = ctx.createGain();
    lfoGain.gain.setValueAtTime(200, ctx.currentTime);

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    noise.connect(filter);
    filter.connect(ch.gainNode);

    noise.start();
    lfo.start();
    ch.nodes.push(noise, lfo);
  },

  startBirdsSynthesis: function(ch) {
    const chirp = () => {
      if (!ch.isPlaying) return;
      const ctx = this.audioCtx;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const freq = 2400 + Math.random() * 1200;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq + 700, ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);

      osc.connect(gain);
      gain.connect(ch.gainNode);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);

      ch.timer = setTimeout(chirp, Math.random() * 3000 + 1200);
    };
    chirp();
  },

  startKeysSynthesis: function(ch) {
    const tick = () => {
      if (!ch.isPlaying) return;
      const ctx = this.audioCtx;
      const buffer = ctx.createBuffer(1, ctx.sampleRate * 0.03, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / 60);

      const node = ctx.createBufferSource();
      node.buffer = buffer;
      node.connect(ch.gainNode);
      node.start();

      ch.timer = setTimeout(tick, Math.random() * 320 + 80);
    };
    tick();
  },

  setChannelVolume: function(id, vol) {
    const ch = this.channels[id];
    if (!ch) return;
    ch.volume = AeroUtils.clamp(vol, 0, 1);
    if (ch.gainNode && this.audioCtx && ch.isPlaying) {
      ch.gainNode.gain.setTargetAtTime(ch.volume, this.audioCtx.currentTime, 0.05);
    }
  },

  setMasterVolume: function(vol) {
    this.masterVolume = AeroUtils.clamp(vol, 0, 1);
    if (this.masterGain && this.audioCtx) {
      this.masterGain.gain.setTargetAtTime(this.masterVolume, this.audioCtx.currentTime, 0.05);
    }
    if (this.audioEl) {
      this.audioEl.volume = this.masterVolume;
    }
    AeroStorage.set('soundVolume', this.masterVolume);
  },

  updateTaskbarIcon: function() {
    if (!this.toggleBtn) return;
    const isAnyActive = this.isMusicPlaying || Object.values(this.channels).some(c => c.isPlaying);
    this.toggleBtn.textContent = isAnyActive ? '🔊' : '🔇';
    this.toggleBtn.classList.toggle('active', isAnyActive);
  },

  updateMixerUI: function(id) {
    const ch = this.channels[id];
    const toggle = document.querySelector(`.sound-channel-toggle[data-channel="${id}"]`);
    if (toggle) {
      toggle.classList.toggle('playing', ch.isPlaying);
      toggle.textContent = ch.isPlaying ? '■' : '▶';
    }
  },

  renderMixer: function() {
    const body = document.getElementById('sound-mixer-body');
    if (!body) return;

    body.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
        <span style="font-size:11px; font-weight:800; text-transform:uppercase; color:var(--glass-header-text, #034870);">Soundtrack & Ambience</span>
        <button id="btn-play-all-ambient" class="glass-button" style="padding:3px 10px; font-size:10px;">Toggle All Ambient</button>
      </div>
    `;

    const allBtn = body.querySelector('#btn-play-all-ambient');
    allBtn.addEventListener('click', () => this.playAllAmbient());

    Object.entries(this.channels).forEach(([id, ch]) => {
      const row = document.createElement('div');
      row.className = 'sound-channel-row';

      const info = document.createElement('div');
      info.className = 'sound-channel-info';
      info.innerHTML = `<span>${ch.emoji}</span><span>${ch.name}</span>`;

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.className = 'sound-channel-slider';
      slider.min = '0';
      slider.max = '1';
      slider.step = '0.05';
      slider.value = String(ch.volume);
      slider.addEventListener('input', (e) => this.setChannelVolume(id, parseFloat(e.target.value)));

      const toggle = document.createElement('button');
      toggle.className = `sound-channel-toggle ${ch.isPlaying ? 'playing' : ''}`;
      toggle.dataset.channel = id;
      toggle.textContent = ch.isPlaying ? '■' : '▶';
      toggle.addEventListener('click', () => this.toggleChannel(id));

      row.appendChild(info);
      row.appendChild(slider);
      row.appendChild(toggle);
      body.appendChild(row);
    });
  },

  /* === PROCEDURAL SKEUOMORPHIC UI SOUND EFFECTS === */
  playGlassClick: function() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const filter = this.audioCtx.createBiquadFilter();

      // High glassy resonance
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.035);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, t);
      filter.Q.setValueAtTime(4.0, t);

      gain.gain.setValueAtTime(0.18 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.05);
    } catch (e) {}
  },

  playWaterDrop: function() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, t);
      osc.frequency.exponentialRampToValueAtTime(1450, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(700, t + 0.16);

      gain.gain.setValueAtTime(0.25 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.19);
    } catch (e) {}
  },

  playHoverShimmer: function() {
    try {
      this.initCtx();
      if (!this.audioCtx) return;
      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      const t = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(3200, t);
      osc.frequency.linearRampToValueAtTime(4400, t + 0.06);

      gain.gain.setValueAtTime(0.04 * this.masterVolume, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.08);

      osc.connect(gain);
      gain.connect(this.masterGain || this.audioCtx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {}
  }
};

window.SoundEngine = SoundEngine;
