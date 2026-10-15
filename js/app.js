/**
 * AeroTab — Main Orchestrator & Initialization
 */

(async function() {
  'use strict';

  try {
    // 1. Fetch user settings
    const settings = await AeroStorage.getAll();

    // 2. Start Living Canvas Background Engine
    BackgroundEngine.init();

    // Check for custom wallpaper
    try {
      const customWp = localStorage.getItem('aerotab_custom_wallpaper');
      if (customWp) {
        BackgroundEngine.setCustomWallpaper(customWp);
      }
    } catch (e) {}

    // 3. Apply theme palette & variables
    Themes.apply(settings.theme || 'bliss');

    // 4. Initialize Core Widgets
    Greeting.init();
    ClockWidget.init();

    // Widget visibility checks
    const weatherWidgetEl = document.getElementById('weather-widget');
    if (weatherWidgetEl) {
      weatherWidgetEl.style.display = settings.showWeather ? '' : 'none';
      if (settings.showWeather) {
        WeatherWidget.init();
      }
    }

    const clockWidgetEl = document.getElementById('analog-clock-widget');
    if (clockWidgetEl) {
      clockWidgetEl.style.display = settings.showClock ? '' : 'none';
    }

    const tasksWidgetEl = document.getElementById('tasks-widget');
    if (tasksWidgetEl) {
      tasksWidgetEl.style.display = settings.showTasks ? '' : 'none';
      if (settings.showTasks) {
        TasksWidget.init();
      }
    }

    const bookmarksWidgetEl = document.getElementById('bookmarks-widget');
    if (bookmarksWidgetEl) {
      bookmarksWidgetEl.style.display = settings.showBookmarks ? '' : 'none';
      if (settings.showBookmarks) {
        BookmarksWidget.init();
      }
    }

    const greetingSectionEl = document.getElementById('greeting-section');
    if (greetingSectionEl) {
      greetingSectionEl.style.display = settings.showGreeting ? '' : 'none';
    }

    // 5. Initialize Ambient Sound Engine (UI only, waiting for user activation)
    SoundEngine.init();

    // 6. Initialize Settings Panel
    Settings.init();

    // 7. Energy Saver: Pause canvas loops when tab is hidden/minimized
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        BackgroundEngine.pause();
      } else {
        BackgroundEngine.resume();
      }
    });

    console.log(
      '%c🌊 AeroTab v1.0.0 Initialized %c Authentic Frutiger Aero Experience',
      'background: #1aabf0; color: #fff; font-weight: bold; padding: 4px 8px; border-radius: 4px;',
      'color: #7fddff; font-weight: 500;'
    );
  } catch (err) {
    console.error('AeroTab initialization error:', err);
  }
})();
