/**
 * AeroTab Clock Widget
 * Large central digital clock, authentic skeuomorphic analog clock gadget, and taskbar clock
 */

const ClockWidget = {
  digitalEl: null,
  dateEl: null,
  taskbarEl: null,
  analogCanvas: null,
  analogCtx: null,
  settings: null,
  intervalId: null,

  init: async function() {
    this.digitalEl = document.getElementById('digital-clock');
    this.dateEl = document.getElementById('date-display');
    this.taskbarEl = document.getElementById('taskbar-clock');
    this.analogCanvas = document.getElementById('analog-clock-canvas');

    if (this.analogCanvas) {
      this.analogCtx = this.analogCanvas.getContext('2d');
      // Set high DPR for analog clock
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      this.analogCanvas.width = 160 * dpr;
      this.analogCanvas.height = 160 * dpr;
      this.analogCanvas.style.width = '160px';
      this.analogCanvas.style.height = '160px';
      this.analogCtx.scale(dpr, dpr);
    }

    this.settings = await AeroStorage.getAll();
    this.tick();

    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.tick(), 1000);
  },

  updateSettings: function(newSettings) {
    this.settings = { ...this.settings, ...newSettings };
    this.tick();
  },

  tick: function() {
    const now = new Date();
    const use24 = this.settings ? this.settings.use24Hour : false;
    const showSec = this.settings ? this.settings.showSeconds : false;

    // 1. Digital Clock
    if (this.digitalEl) {
      this.digitalEl.textContent = AeroUtils.formatTime(now, use24, showSec);
    }

    // 2. Date
    if (this.dateEl) {
      this.dateEl.textContent = AeroUtils.formatDate(now);
    }

    // 3. Taskbar Clock
    if (this.taskbarEl) {
      this.taskbarEl.textContent = AeroUtils.formatTime(now, use24, false);
    }

    // 4. Analog Clock
    if (this.analogCanvas && this.analogCtx) {
      this.renderAnalog(now);
    }
  },

  renderAnalog: function(now) {
    const ctx = this.analogCtx;
    const cx = 80;
    const cy = 80;
    const r = 70;

    ctx.clearRect(0, 0, 160, 160);

    // Outer Glass Bezel Ring
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const bezelGrad = ctx.createLinearGradient(0, cy - r, 0, cy + r);
    bezelGrad.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
    bezelGrad.addColorStop(0.5, 'rgba(180, 225, 255, 0.3)');
    bezelGrad.addColorStop(1, 'rgba(0, 30, 60, 0.5)');
    ctx.strokeStyle = bezelGrad;
    ctx.lineWidth = 4;
    ctx.stroke();

    // Clock Face Dial
    const faceGrad = ctx.createRadialGradient(cx, cy - 20, 5, cx, cy, r);
    faceGrad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    faceGrad.addColorStop(0.7, 'rgba(15, 35, 75, 0.25)');
    faceGrad.addColorStop(1, 'rgba(5, 15, 35, 0.45)');
    ctx.fillStyle = faceGrad;
    ctx.fill();

    // 12 Hour Ticks
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const isMajor = i % 3 === 0;
      const tickR = isMajor ? r - 10 : r - 8;
      const x1 = cx + Math.cos(angle) * (r - 4);
      const y1 = cy + Math.sin(angle) * (r - 4);
      const x2 = cx + Math.cos(angle) * tickR;
      const y2 = cy + Math.sin(angle) * tickR;

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = isMajor ? 2.5 : 1.2;
      ctx.stroke();
    }

    // Top-Left Gloss Reflection (Signature Frutiger Aero Shine)
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, Math.PI * 0.9, Math.PI * 1.9);
    ctx.bezierCurveTo(cx - 20, cy - 10, cx + 20, cy - 10, cx + (r - 3), cy);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.fill();

    // Calculate Hand Angles
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    const hrAngle = (hr * Math.PI) / 6 - Math.PI / 2;
    const minAngle = (min * Math.PI) / 30 - Math.PI / 2;
    const secAngle = (sec * Math.PI) / 30 - Math.PI / 2;

    // Hour Hand
    this.drawHand(ctx, cx, cy, hrAngle, 38, 4, 'rgba(255, 255, 255, 0.95)');

    // Minute Hand
    this.drawHand(ctx, cx, cy, minAngle, 52, 2.5, 'rgba(255, 255, 255, 0.95)');

    // Second Hand (Electric Cyan)
    this.drawHand(ctx, cx, cy, secAngle, 58, 1.5, '#4DC9F6', 12);

    // Center Cap
    ctx.beginPath();
    ctx.arc(cx, cy, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.4)';
    ctx.shadowBlur = 4;
    ctx.fill();

    ctx.restore();
  },

  drawHand: function(ctx, cx, cy, angle, length, width, color, tailLength = 0) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.shadowColor = 'rgba(0, 15, 30, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    ctx.beginPath();
    ctx.moveTo(-tailLength, 0);
    ctx.lineTo(length, 0);
    ctx.stroke();

    ctx.restore();
  }
};

window.ClockWidget = ClockWidget;
