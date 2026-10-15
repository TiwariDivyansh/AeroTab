/**
 * AeroTab Greeting & Focus Goal Widget
 */

const Greeting = {
  init: async function() {
    const settings = await AeroStorage.getAll();
    this.updateGreeting(settings.userName);
    this.initFocus(settings);
  },

  updateGreeting: function(userName) {
    const timeOfDay = AeroUtils.getTimeOfDay();
    const greetings = {
      morning: 'Good morning',
      afternoon: 'Good afternoon',
      evening: 'Good evening',
      night: 'Good night'
    };
    const greeting = greetings[timeOfDay] || 'Welcome back';
    const nameStr = userName && userName.trim() ? `, ${userName.trim()}` : '';
    const el = document.getElementById('greeting-text');
    if (el) {
      el.textContent = `${greeting}${nameStr}.`;
    }
  },

  initFocus: function(settings) {
    const input = document.getElementById('focus-input');
    const display = document.getElementById('focus-display');
    if (!input || !display) return;

    const today = new Date().toDateString();
    if (settings.focusText && settings.lastFocusDate === today) {
      display.textContent = `🎯 ${settings.focusText}`;
      display.style.display = 'inline-block';
      input.style.display = 'none';
    } else {
      input.value = '';
      input.style.display = 'block';
      display.style.display = 'none';
    }

    // Save focus on Enter
    input.addEventListener('keydown', async (e) => {
      if (e.key === 'Enter') {
        const val = input.value.trim();
        if (val) {
          await AeroStorage.setMultiple({
            focusText: val,
            lastFocusDate: new Date().toDateString()
          });
          display.textContent = `🎯 ${val}`;
          display.style.display = 'inline-block';
          input.style.display = 'none';
        }
      }
    });

    // Click display to edit
    display.addEventListener('click', () => {
      input.value = display.textContent.replace('🎯 ', '');
      input.style.display = 'block';
      display.style.display = 'none';
      input.focus();
      input.select();
    });

    // Escape or blur when editing
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && display.textContent) {
        input.style.display = 'none';
        display.style.display = 'inline-block';
      }
    });
  }
};

window.Greeting = Greeting;
