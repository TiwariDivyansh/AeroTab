/**
 * AeroTab Extension Toolbar Popup Script
 */

document.addEventListener('DOMContentLoaded', () => {
  const openDashboardBtn = document.getElementById('btn-open-dashboard');
  const openTabBtn = document.getElementById('popup-open-tab-btn');
  const themeChips = document.querySelectorAll('.popup-theme-chip');

  const openNewTab = () => {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
      chrome.tabs.create({ url: 'newtab.html' });
    } else {
      window.open('newtab.html', '_blank');
    }
    window.close();
  };

  if (openDashboardBtn) {
    openDashboardBtn.addEventListener('click', openNewTab);
  }
  if (openTabBtn) {
    openTabBtn.addEventListener('click', openNewTab);
  }

  // Theme chips click handler
  themeChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const themeId = chip.getAttribute('data-theme');
      if (!themeId) return;

      if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
        chrome.storage.sync.set({ theme: themeId }, () => {
          openNewTab();
        });
      } else {
        try {
          const current = JSON.parse(localStorage.getItem('aerotab_settings') || '{}');
          current.theme = themeId;
          localStorage.setItem('aerotab_settings', JSON.stringify(current));
        } catch (e) {}
        openNewTab();
      }
    });
  });
});
