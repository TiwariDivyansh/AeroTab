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
    ctx.save();

    // 1. Outer Chrome Bezel Ring (Brushed Anisotropic Metal Finish)
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    const chromeGrad = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    chromeGrad.addColorStop(0, '#ffffff');
    chromeGrad.addColorStop(0.2, '#d4e8f7');
    chromeGrad.addColorStop(0.45, '#7fa6c8');
    chromeGrad.addColorStop(0.55, '#f0f8ff');
    chromeGrad.addColorStop(0.8, '#5982a6');
    chromeGrad.addColorStop(1, '#2c4a68');
    ctx.strokeStyle = chromeGrad;
    ctx.lineWidth = 5;
    ctx.shadowColor = 'rgba(0, 20, 50, 0.45)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetY = 4;
    ctx.stroke();
    ctx.shadowColor = 'transparent';

    // 2. Inner Crystal Bevel Trench
    ctx.beginPath();
    ctx.arc(cx, cy, r - 3, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // 3. Dial Face (Deep Aquamarine Glass Depth)
    const dialGrad = ctx.createRadialGradient(cx, cy - 25, 6, cx, cy, r);
    dialGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    dialGrad.addColorStop(0.5, 'rgba(12, 40, 75, 0.38)');
    dialGrad.addColorStop(0.85, 'rgba(4, 18, 40, 0.65)');
    dialGrad.addColorStop(1, 'rgba(2, 10, 25, 0.85)');
    ctx.fillStyle = dialGrad;
    ctx.fill();

    // 4. Dial Sub-Ring & Compass Crosshairs
    ctx.beginPath();
    ctx.arc(cx, cy, r - 16, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 5. 12 Beveled Hour Ticks & 60 Minute Dots
    for (let i = 0; i < 60; i++) {
      const angle = (i * Math.PI) / 30;
      const isHour = i % 5 === 0;
      const isCardinal = i % 15 === 0;

      if (isHour) {
        const tickLen = isCardinal ? 11 : 8;
        const x1 = cx + Math.cos(angle) * (r - 6);
        const y1 = cy + Math.sin(angle) * (r - 6);
        const x2 = cx + Math.cos(angle) * (r - 6 - tickLen);
        const y2 = cy + Math.sin(angle) * (r - 6 - tickLen);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = isCardinal ? '#ffffff' : 'rgba(220, 245, 255, 0.9)';
        ctx.lineWidth = isCardinal ? 3 : 2;
        ctx.lineCap = 'round';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;
        ctx.stroke();
        ctx.shadowColor = 'transparent';
      } else {
        const dotR = r - 10;
        const dx = cx + Math.cos(angle) * dotR;
        const dy = cy + Math.sin(angle) * dotR;
        ctx.beginPath();
        ctx.arc(dx, dy, 0.9, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.fill();
      }
    }

    // 6. Signature Vista Top-Half Curved Glass Specular Highlight
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r - 4, Math.PI * 0.95, Math.PI * 2.05);
    ctx.bezierCurveTo(cx + 30, cy - 8, cx - 30, cy - 8, cx - (r - 4), cy);
    const glassGlare = ctx.createLinearGradient(cx, cy - r, cx, cy);
    glassGlare.addColorStop(0, 'rgba(255, 255, 255, 0.55)');
    glassGlare.addColorStop(0.4, 'rgba(255, 255, 255, 0.22)');
    glassGlare.addColorStop(0.9, 'rgba(255, 255, 255, 0.03)');
    glassGlare.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = glassGlare;
    ctx.fill();
    ctx.restore();

    // 7. Calculate Hand Angles
    const sec = now.getSeconds() + now.getMilliseconds() / 1000;
    const min = now.getMinutes() + sec / 60;
    const hr = (now.getHours() % 12) + min / 60;

    const hrAngle = (hr * Math.PI) / 6 - Math.PI / 2;
    const minAngle = (min * Math.PI) / 30 - Math.PI / 2;
    const secAngle = (sec * Math.PI) / 30 - Math.PI / 2;

    // 8. Sculpted Sword Hour Hand with Center Spine
    this.drawSculptedHand(ctx, cx, cy, hrAngle, 36, 5, '#ffffff', 'rgba(180, 220, 245, 0.85)');

    // 9. Sculpted Sword Minute Hand
    this.drawSculptedHand(ctx, cx, cy, minAngle, 52, 3.8, '#ffffff', 'rgba(180, 220, 245, 0.85)');

    // 10. Vista Electric Cyan Second Hand with Ring Counterweight
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(secAngle);

    ctx.shadowColor = 'rgba(0, 20, 45, 0.7)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetY = 2;

    // Tail & Ring
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-14, 0);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(-14, 0, 3.5, 0, Math.PI * 2);
    ctx.stroke();

    // Main needle
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(58, 0);
    ctx.stroke();

    ctx.restore();

    // 11. Central Chrome Jewel Pearl
    ctx.beginPath();
    ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
    const pearlGrad = ctx.createRadialGradient(cx - 1.5, cy - 1.5, 1, cx, cy, 5.5);
    pearlGrad.addColorStop(0, '#ffffff');
    pearlGrad.addColorStop(0.5, '#7fddff');
    pearlGrad.addColorStop(0.85, '#0284c7');
    pearlGrad.addColorStop(1, '#002244');
    ctx.fillStyle = pearlGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.fill();
    ctx.shadowColor = 'transparent';

    ctx.restore();
  },

  drawSculptedHand: function(ctx, cx, cy, angle, length, baseWidth, lightColor, shadowColor) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    ctx.shadowColor = 'rgba(0, 15, 35, 0.6)';
    ctx.shadowBlur = 5;
    ctx.shadowOffsetY = 2;

    // Top Light Half
    ctx.beginPath();
    ctx.moveTo(0, -baseWidth / 2);
    ctx.lineTo(length, 0);
    ctx.lineTo(0, 0);
    ctx.closePath();
    ctx.fillStyle = lightColor;
    ctx.fill();

    // Bottom Shadow Half
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length, 0);
    ctx.lineTo(0, baseWidth / 2);
    ctx.closePath();
    ctx.fillStyle = shadowColor;
    ctx.fill();

    ctx.restore();
  }
};

window.ClockWidget = ClockWidget;
