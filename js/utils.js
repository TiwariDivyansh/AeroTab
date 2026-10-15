/**
 * AeroTab Utilities
 * Shared helper functions across all modules
 */

const AeroUtils = {
  /**
   * Determine time of day bucket
   * @returns {'morning'|'afternoon'|'evening'|'night'}
   */
  getTimeOfDay: function(date = new Date()) {
    const hours = date.getHours();
    if (hours >= 5 && hours < 12) return 'morning';
    if (hours >= 12 && hours < 17) return 'afternoon';
    if (hours >= 17 && hours < 21) return 'evening';
    return 'night';
  },

  /**
   * Format time string
   * @param {Date} date
   * @param {boolean} use24Hour
   * @param {boolean} showSeconds
   * @returns {string}
   */
  formatTime: function(date = new Date(), use24Hour = false, showSeconds = false) {
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    if (use24Hour) {
      const hStr = String(hours).padStart(2, '0');
      return showSeconds ? `${hStr}:${minutes}:${seconds}` : `${hStr}:${minutes}`;
    }

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 hour is 12 AM
    const secStr = showSeconds ? `:${seconds}` : '';
    return `${hours}:${minutes}${secStr} ${ampm}`;
  },

  /**
   * Format friendly date string
   * @param {Date} date
   * @returns {string} e.g. "Monday, October 13"
   */
  formatDate: function(date = new Date()) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  },

  /**
   * Generate short unique identifier
   */
  generateId: function(prefix = 'aero') {
    return `${prefix}_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  },

  /**
   * Debounce function execution
   */
  debounce: function(fn, delay = 250) {
    let timer = null;
    return function(...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  },

  /**
   * Clamp a number between min and max
   */
  clamp: function(val, min, max) {
    return Math.max(min, Math.min(max, val));
  },

  /**
   * Linear interpolation between start and end
   */
  lerp: function(start, end, t) {
    return start + (end - start) * t;
  },

  /**
   * Map value from one range to another
   */
  mapRange: function(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  },

  /**
   * Parse hex color into RGB object
   */
  hexToRgb: function(hex) {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map(c => c + c).join('');
    }
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  },

  /**
   * Interpolate between two hex colors
   */
  lerpColor: function(hexA, hexB, t) {
    const rgbA = this.hexToRgb(hexA);
    const rgbB = this.hexToRgb(hexB);
    const r = Math.round(this.lerp(rgbA.r, rgbB.r, t));
    const g = Math.round(this.lerp(rgbA.g, rgbB.g, t));
    const b = Math.round(this.lerp(rgbA.b, rgbB.b, t));
    return `rgb(${r}, ${g}, ${b})`;
  }
};

// Global shorthand for convenience
window.AeroUtils = AeroUtils;
window.getTimeOfDay = AeroUtils.getTimeOfDay;
window.formatTime = AeroUtils.formatTime;
window.formatDate = AeroUtils.formatDate;
window.generateId = AeroUtils.generateId;
window.debounce = AeroUtils.debounce;
window.clamp = AeroUtils.clamp;
window.lerp = AeroUtils.lerp;
