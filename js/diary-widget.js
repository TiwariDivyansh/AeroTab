/**
 * AeroTab Personal Micro-Diary & Reflection Log
 * Private, local daily reflections with date stamps, weather mood, and JSON/Markdown export.
 */

const DiaryWidget = {
  containerEl: null,
  inputEl: null,
  listEl: null,
  entries: [],

  init: async function() {
    this.containerEl = document.getElementById('diary-widget');
    this.inputEl = document.getElementById('diary-entry-input');
    this.listEl = document.getElementById('diary-entries-list');
    const saveBtn = document.getElementById('diary-save-btn');
    const exportBtn = document.getElementById('diary-export-btn');

    if (!this.containerEl) return;

    const settings = await AeroStorage.getAll();
    this.entries = settings.diaryEntries || [];
    this.render();

    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveCurrentEntry());
    }

    if (this.inputEl) {
      this.inputEl.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          this.saveCurrentEntry();
        }
      });
    }

    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportEntries());
    }
  },

  saveCurrentEntry: async function() {
    if (!this.inputEl) return;
    const text = this.inputEl.value.trim();
    if (!text) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

    const newEntry = {
      id: AeroUtils.generateId('diary'),
      date: dateStr,
      time: timeStr,
      timestamp: Date.now(),
      text: text
    };

    this.entries.unshift(newEntry);
    this.inputEl.value = '';
    await AeroStorage.set('diaryEntries', this.entries);

    if (window.SoundEngine && typeof SoundEngine.playWaterDrop === 'function') {
      SoundEngine.playWaterDrop();
    }

    this.render();
  },

  deleteEntry: async function(id) {
    this.entries = this.entries.filter(e => e.id !== id);
    await AeroStorage.set('diaryEntries', this.entries);
    if (window.SoundEngine && typeof SoundEngine.playGlassClick === 'function') {
      SoundEngine.playGlassClick();
    }
    this.render();
  },

  exportEntries: function() {
    if (this.entries.length === 0) return;
    const mdLines = ['# AeroTab Personal Diary & Reflections\n'];
    this.entries.forEach(e => {
      mdLines.push(`### ${e.date} at ${e.time}\n${e.text}\n---`);
    });
    const blob = new Blob([mdLines.join('\n\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aerotab_diary_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  },

  render: function() {
    if (!this.listEl) return;
    this.listEl.innerHTML = '';

    if (this.entries.length === 0) {
      this.listEl.innerHTML = '<div class="diary-empty">No reflections yet. Write a thought above.</div>';
      return;
    }

    this.entries.slice(0, 8).forEach(entry => {
      const row = document.createElement('div');
      row.className = 'diary-entry-card';

      row.innerHTML = `
        <div class="diary-entry-header">
          <span class="diary-entry-date">${entry.date} · ${entry.time}</span>
          <button class="diary-entry-delete" data-id="${entry.id}" title="Delete entry">×</button>
        </div>
        <div class="diary-entry-text">${entry.text}</div>
      `;

      row.querySelector('.diary-entry-delete').addEventListener('click', () => {
        this.deleteEntry(entry.id);
      });

      this.listEl.appendChild(row);
    });
  }
};

window.DiaryWidget = DiaryWidget;
