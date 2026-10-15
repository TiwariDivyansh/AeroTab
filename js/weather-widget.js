/**
 * AeroTab Weather Widget
 * Intelligent weather engine supporting Open-Meteo (Zero API key needed!)
 * with optional OpenWeatherMap API key override and 30-minute caching.
 */

const WeatherWidget = {
  container: null,
  cacheKey: 'aerotab_weather_cache',

  init: async function() {
    this.container = document.getElementById('weather-content');
    const refreshBtn = document.getElementById('refresh-weather-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => this.fetchWeather(true));
    }
    await this.fetchWeather(false);
  },

  fetchWeather: async function(forceRefresh = false) {
    if (!this.container) return;

    const settings = await AeroStorage.getAll();
    if (!settings.showWeather) return;

    // Check 30-min cache unless forceRefresh
    if (!forceRefresh) {
      const cached = this.getCache();
      if (cached) {
        this.render(cached);
        return;
      }
    }

    // Render instant optimistic baseline while fetching in background
    this.render({
      city: settings.weatherCity || 'Local Atmosphere',
      temp: settings.weatherUnit === 'imperial' ? 72 : 22,
      emoji: '☀️',
      description: 'Pleasant & clear',
      unit: settings.weatherUnit === 'imperial' ? '°F' : '°C'
    });

    try {
      if (settings.weatherApiKey) {
        // OpenWeatherMap mode
        await this.fetchFromOpenWeather(settings);
      } else {
        // Open-Meteo zero-key fallback mode
        await this.fetchFromOpenMeteo(settings);
      }
    } catch (err) {
      console.warn('Weather fetch notice:', err);
      // Fallback graceful display if offline or blocked
      const fallbackData = {
        city: settings.weatherCity || 'San Francisco',
        temp: settings.weatherUnit === 'imperial' ? 68 : 20,
        emoji: '☀️',
        description: 'Pleasant & clear'
      };
      this.render(fallbackData);
    }
  },

  fetchFromOpenMeteo: async function(settings) {
    let lat = 37.7749;
    let lon = -122.4194;
    let cityName = settings.weatherCity ? settings.weatherCity : 'Local';

    if (settings.weatherCity) {
      // Geocode city name via Open-Meteo Geocoding
      try {
        const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(settings.weatherCity)}&count=1`);
        const geoData = await geoRes.json();
        if (geoData.results && geoData.results.length > 0) {
          lat = geoData.results[0].latitude;
          lon = geoData.results[0].longitude;
          cityName = geoData.results[0].name;
        }
      } catch (e) {}
    } else if (navigator.geolocation) {
      // Try browser geolocation with 4s timeout
      try {
        const pos = await new Promise((res, rej) => {
          navigator.geolocation.getCurrentPosition(res, rej, { timeout: 4000 });
        });
        lat = pos.coords.latitude;
        lon = pos.coords.longitude;
        cityName = 'Current Location';
      } catch (e) {
        // Fall back to default
      }
    }

    const tempUnit = settings.weatherUnit === 'imperial' ? 'fahrenheit' : 'celsius';
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=${tempUnit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Weather error: ${res.status}`);
    const data = await res.json();

    const code = data.current.weather_code;
    const temp = Math.round(data.current.temperature_2m);
    const info = this.interpretWmoCode(code);

    const weatherData = {
      city: cityName,
      temp: temp,
      emoji: info.emoji,
      description: info.desc,
      unit: settings.weatherUnit === 'imperial' ? '°F' : '°C'
    };

    this.setCache(weatherData);
    this.render(weatherData);
  },

  fetchFromOpenWeather: async function(settings) {
    const unit = settings.weatherUnit === 'imperial' ? 'imperial' : 'metric';
    const city = settings.weatherCity || 'London';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${settings.weatherApiKey}&units=${unit}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`OpenWeather error: ${res.status}`);
    const data = await res.json();

    const weatherData = {
      city: data.name,
      temp: Math.round(data.main.temp),
      emoji: this.getOpenWeatherEmoji(data.weather[0].id),
      description: data.weather[0].description,
      unit: settings.weatherUnit === 'imperial' ? '°F' : '°C'
    };

    this.setCache(weatherData);
    this.render(weatherData);
  },

  interpretWmoCode: function(code) {
    if (code === 0) return { emoji: '☀️', desc: 'Clear sky' };
    if (code === 1 || code === 2) return { emoji: '🌤️', desc: 'Mainly clear' };
    if (code === 3) return { emoji: '☁️', desc: 'Overcast' };
    if (code === 45 || code === 48) return { emoji: '🌫️', desc: 'Foggy' };
    if (code >= 51 && code <= 57) return { emoji: '🌦️', desc: 'Light drizzle' };
    if (code >= 61 && code <= 67) return { emoji: '🌧️', desc: 'Rain' };
    if (code >= 71 && code <= 77) return { emoji: '❄️', desc: 'Snowfall' };
    if (code >= 80 && code <= 82) return { emoji: '🌧️', desc: 'Showers' };
    if (code >= 95) return { emoji: '⛈️', desc: 'Thunderstorm' };
    return { emoji: '⛅', desc: 'Partly cloudy' };
  },

  getOpenWeatherEmoji: function(id) {
    if (id >= 200 && id < 300) return '⛈️';
    if (id >= 300 && id < 600) return '🌧️';
    if (id >= 600 && id < 700) return '❄️';
    if (id >= 700 && id < 800) return '🌫️';
    if (id === 800) return '☀️';
    return '⛅';
  },

  render: function(data) {
    if (!this.container) return;
    this.container.innerHTML = `
      <div class="weather-hero">
        <div class="weather-badge-orb">
          <span class="weather-emoji">${data.emoji}</span>
        </div>
        <div class="weather-temp-group">
          <span class="weather-temp">${data.temp}°</span>
          <span class="weather-unit">${data.unit || ''}</span>
        </div>
      </div>
      <div class="weather-condition-pill">${data.description}</div>
      <div class="weather-location-pill">📍 ${data.city}</div>
    `;
  },

  getCache: function() {
    try {
      const raw = localStorage.getItem(this.cacheKey);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (Date.now() - parsed.timestamp < 30 * 60 * 1000) {
        return parsed.data;
      }
    } catch (e) {}
    return null;
  },

  setCache: function(data) {
    try {
      localStorage.setItem(this.cacheKey, JSON.stringify({
        timestamp: Date.now(),
        data: data
      }));
    } catch (e) {}
  }
};

window.WeatherWidget = WeatherWidget;
