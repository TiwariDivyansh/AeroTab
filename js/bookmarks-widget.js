/**
 * AeroTab Quick Launch Bookmarks Widget
 */

const BookmarksWidget = {
  bookmarks: [],
  gridEl: null,
  addBtn: null,
  formEl: null,
  labelInput: null,
  urlInput: null,
  saveBtn: null,
  cancelBtn: null,

  init: async function() {
    this.gridEl = document.getElementById('bookmarks-grid');
    this.addBtn = document.getElementById('add-bookmark-btn');
    this.formEl = document.getElementById('add-bookmark-form');
    this.labelInput = document.getElementById('new-bookmark-label');
    this.urlInput = document.getElementById('new-bookmark-url');
    this.saveBtn = document.getElementById('save-bookmark-btn');
    this.cancelBtn = document.getElementById('cancel-bookmark-btn');

    if (!this.gridEl) return;

    this.bookmarks = await AeroStorage.get('bookmarks') || [];
    this.render();

    if (this.addBtn) {
      this.addBtn.addEventListener('click', () => {
        const isHidden = this.formEl.style.display === 'none';
        this.formEl.style.display = isHidden ? 'block' : 'none';
        if (isHidden) this.labelInput.focus();
      });
    }

    if (this.cancelBtn) {
      this.cancelBtn.addEventListener('click', () => {
        this.formEl.style.display = 'none';
      });
    }

    if (this.saveBtn) {
      this.saveBtn.addEventListener('click', () => this.addBookmark());
    }
  },

  addBookmark: async function() {
    const label = this.labelInput.value.trim();
    let url = this.urlInput.value.trim();

    if (!label || !url) {
      alert('Please enter both a title and URL.');
      return;
    }

    if (!/^https?:\/\//i.test(url)) {
      url = 'https://' + url;
    }

    if (this.bookmarks.length >= 12) {
      alert('Maximum 12 quick launch shortcuts allowed.');
      return;
    }

    const newBookmark = {
      id: AeroUtils.generateId('bm'),
      label: label,
      url: url,
      icon: ''
    };

    this.bookmarks.push(newBookmark);
    this.labelInput.value = '';
    this.urlInput.value = '';
    this.formEl.style.display = 'none';

    await AeroStorage.set('bookmarks', this.bookmarks);
    this.render();
  },

  deleteBookmark: async function(id) {
    this.bookmarks = this.bookmarks.filter(b => b.id !== id);
    await AeroStorage.set('bookmarks', this.bookmarks);
    this.render();
  },

  getDomain: function(url) {
    try {
      return new URL(url).hostname;
    } catch (e) {
      return url;
    }
  },

  render: function() {
    if (!this.gridEl) return;
    this.gridEl.innerHTML = '';

    this.bookmarks.forEach(bm => {
      const item = document.createElement('a');
      item.className = 'bookmark-item';
      item.href = bm.url;
      item.target = '_self'; // In new tab extension, open in same tab
      item.title = `${bm.label} (${bm.url})`;

      const iconWrap = document.createElement('div');
      iconWrap.className = 'bookmark-icon';

      const domain = this.getDomain(bm.url);
      const img = document.createElement('img');
      img.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=64`;
      img.alt = bm.label;
      img.onerror = () => {
        img.style.display = 'none';
        iconWrap.textContent = bm.icon || '🔗';
      };
      iconWrap.appendChild(img);

      const label = document.createElement('span');
      label.className = 'bookmark-label';
      label.textContent = bm.label;

      const del = document.createElement('span');
      del.className = 'bookmark-delete-badge';
      del.innerHTML = '×';
      del.title = 'Remove';
      del.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        this.deleteBookmark(bm.id);
      });

      item.appendChild(iconWrap);
      item.appendChild(label);
      item.appendChild(del);
      this.gridEl.appendChild(item);
    });
  }
};

window.BookmarksWidget = BookmarksWidget;
