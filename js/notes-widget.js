/**
 * AeroTab Skeuomorphic Glass Sticky Note Scratchpad
 * Authentic translucent post-it scratchpad for quick phone numbers,
 * links, thoughts, or drafts. Saves locally in real time.
 */

const NotesWidget = {
  textareaEl: null,
  colorBtns: null,
  clearBtn: null,
  charCountEl: null,
  currentNote: '',
  currentColor: 'amber',
  saveDebounce: null,

  colors: {
    amber: {
      bg: 'linear-gradient(135deg, rgba(254, 243, 199, 0.72) 0%, rgba(253, 230, 138, 0.55) 100%)',
      border: 'rgba(252, 211, 77, 0.85)',
      text: '#451a03',
      shadow: '0 8px 24px rgba(180, 83, 9, 0.25)'
    },
    aqua: {
      bg: 'linear-gradient(135deg, rgba(207, 250, 254, 0.72) 0%, rgba(165, 243, 252, 0.55) 100%)',
      border: 'rgba(103, 232, 249, 0.85)',
      text: '#083344',
      shadow: '0 8px 24px rgba(8, 145, 178, 0.25)'
    },
    mint: {
      bg: 'linear-gradient(135deg, rgba(220, 252, 231, 0.72) 0%, rgba(187, 247, 208, 0.55) 100%)',
      border: 'rgba(134, 239, 172, 0.85)',
      text: '#052e16',
      shadow: '0 8px 24px rgba(22, 163, 74, 0.25)'
    },
    rose: {
      bg: 'linear-gradient(135deg, rgba(255, 228, 230, 0.72) 0%, rgba(254, 205, 211, 0.55) 100%)',
      border: 'rgba(253, 164, 175, 0.85)',
      text: '#4c0519',
      shadow: '0 8px 24px rgba(225, 29, 72, 0.25)'
    }
  },

  init: async function() {
    this.textareaEl = document.getElementById('sticky-note-textarea');
    this.charCountEl = document.getElementById('sticky-note-char-count');
    this.clearBtn = document.getElementById('sticky-note-clear-btn');
    const container = document.getElementById('sticky-notes-gadget');

    if (!this.textareaEl) return;

    // Load saved content and color
    const settings = await AeroStorage.getAll();
    this.currentNote = settings.stickyNotesContent || '';
    this.currentColor = settings.stickyNotesColor || 'amber';

    this.textareaEl.value = this.currentNote;
    this.updateCharCount();
    this.applyColor(this.currentColor);

    // Auto-save on input
    this.textareaEl.addEventListener('input', () => {
      this.currentNote = this.textareaEl.value;
      this.updateCharCount();
      clearTimeout(this.saveDebounce);
      this.saveDebounce = setTimeout(() => {
        AeroStorage.set('stickyNotesContent', this.currentNote);
      }, 300);
    });

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', async () => {
        if (!this.currentNote) return;
        this.textareaEl.value = '';
        this.currentNote = '';
        this.updateCharCount();
        await AeroStorage.set('stickyNotesContent', '');
        if (window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
          SoundEngine.playGlassClick();
        }
      });
    }

    // Color buttons
    document.querySelectorAll('.sticky-color-pill').forEach(btn => {
      btn.addEventListener('click', async () => {
        const color = btn.getAttribute('data-note-color');
        if (color && this.colors[color]) {
          this.currentColor = color;
          this.applyColor(color);
          await AeroStorage.set('stickyNotesColor', color);
          if (window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
            SoundEngine.playGlassClick();
          }
        }
      });
    });
  },

  applyColor: function(colorKey) {
    const c = this.colors[colorKey] || this.colors.amber;
    const noteCard = document.getElementById('sticky-notes-gadget');
    if (!noteCard) return;

    noteCard.style.background = c.bg;
    noteCard.style.borderColor = c.border;
    noteCard.style.boxShadow = `${c.shadow}, inset 0 2px 2px #fff`;

    if (this.textareaEl) {
      this.textareaEl.style.color = c.text;
    }

    document.querySelectorAll('.sticky-color-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-note-color') === colorKey);
    });
  },

  updateCharCount: function() {
    if (this.charCountEl) {
      this.charCountEl.textContent = `${this.currentNote.length} chars`;
    }
  }
};

window.NotesWidget = NotesWidget;
