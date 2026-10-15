/**
 * AeroTab Background Engine
 * Renders rich, high-resolution Frutiger Aero photographic wallpapers
 * combined with living interactive Canvas elements: 3D floating glass bubbles,
 * liquid water ripples, and sunlight glints.
 */

const BackgroundEngine = {
  canvas: null,
  ctx: null,
  animationId: null,
  isPaused: false,
  width: 0,
  height: 0,
  dpr: 1,
  time: 0,
  currentTheme: null,
  wallpaperImg: null,
  wallpaperLoaded: false,
  customWallpaperUrl: null,
  particles: [],
  ripples: [],
  lastFrameTime: 0,

  init: function() {
    this.canvas = document.getElementById('bg-canvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d');
    this.resize();
    window.addEventListener('resize', AeroUtils.debounce(() => this.resize(), 150));

    // Interactive water ripples on click
    window.addEventListener('pointerdown', (e) => {
      if (e.target.closest('.widget, .taskbar, .settings-panel, .sound-mixer-panel, .media-player-widget')) return;
      this.addRipple(e.clientX, e.clientY);
    });

    this.initParticles();
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  },

  resize: function() {
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * this.dpr;
    this.canvas.height = this.height * this.dpr;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.ctx.scale(this.dpr, this.dpr);

    if (this.particles.length === 0) {
      this.initParticles();
    }
  },

  setTheme: function(themeObj, isPreset = false) {
    this.currentTheme = themeObj;
    this.wallpaperLoaded = false;

    if (isPreset) {
      this.customWallpaperUrl = null;
      try { localStorage.removeItem('aerotab_custom_wallpaper'); } catch (e) {}
    }

    const wpSrc = this.customWallpaperUrl || themeObj.wallpaper;

    if (wpSrc) {
      this.wallpaperImg = new Image();
      this.wallpaperImg.onload = () => {
        this.wallpaperLoaded = true;
      };
      this.wallpaperImg.src = wpSrc;
    } else {
      this.wallpaperImg = null;
    }

    this.initParticles();
  },

  setCustomWallpaper: function(dataUrl) {
    this.customWallpaperUrl = dataUrl;
    if (this.currentTheme) {
      this.setTheme(this.currentTheme);
    }
  },

  pause: function() {
    this.isPaused = true;
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  },

  resume: function() {
    if (!this.isPaused) return;
    this.isPaused = false;
    this.lastFrameTime = performance.now();
    this.loop(this.lastFrameTime);
  },

  addRipple: function(x, y) {
    if (this.ripples.length > 6) this.ripples.shift();
    this.ripples.push({
      x,
      y,
      radius: 8,
      maxRadius: Math.min(this.width, this.height) * 0.45,
      opacity: 0.65,
      speed: 240
    });
  },

  initParticles: function() {
    this.particles = [];
    const count = 30; // 30 rich 3D bubbles
    for (let i = 0; i < count; i++) {
      this.particles.push(this.createBubble(true));
    }
  },

  createBubble: function(randomY = false) {
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + Math.random() * 50 + 20,
      radius: Math.random() * 22 + 8, // 8px to 30px realistic bubbles
      speedY: -(Math.random() * 30 + 15),
      driftSpeed: Math.random() * 0.002 + 0.001,
      driftPhase: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 3 + 2,
      wobbleAmount: Math.random() * 0.15 + 0.05,
      opacity: Math.random() * 0.4 + 0.35
    };
  },

  update: function(dt) {
    this.time += dt;

    // Update floating bubbles
    for (let i = 0; i < this.particles.length; i++) {
      const b = this.particles[i];
      b.y += b.speedY * dt;
      b.x += Math.sin(this.time * b.driftSpeed * 1000 + b.driftPhase) * 20 * dt;

      if (b.y < -b.radius * 2) {
        this.particles[i] = this.createBubble(false);
      }
    }

    // Update ripples
    for (let i = this.ripples.length - 1; i >= 0; i--) {
      const r = this.ripples[i];
      r.radius += r.speed * dt;
      r.opacity = Math.max(0, 0.65 * (1 - r.radius / r.maxRadius));
      if (r.radius >= r.maxRadius || r.opacity <= 0) {
        this.ripples.splice(i, 1);
      }
    }
  },

  render: function() {
    const ctx = this.ctx;
    const w = this.width;
    const h = this.height;

    ctx.clearRect(0, 0, w, h);

    // 1. Draw High-Res Frutiger Aero Wallpaper (or fallback gradient)
    if (this.wallpaperLoaded && this.wallpaperImg) {
      this.drawCoverImage(ctx, this.wallpaperImg, w, h);
    } else {
      this.renderFallbackGradient(ctx, w, h);
    }

    // 2. Dynamic sunlight lens flare sweep
    this.renderSunlightGlint(ctx, w, h);

    // 3. Floating 3D Iridescent Bubbles
    this.render3DBubbles(ctx);

    // 4. Interactive Water Shockwave Ripples
    this.renderRipples(ctx);
  },

  drawCoverImage: function(ctx, img, w, h) {
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = w / h;
    let sw, sh, sx, sy;

    if (canvasRatio > imgRatio) {
      sw = img.naturalWidth;
      sh = img.naturalWidth / canvasRatio;
      sx = 0;
      sy = (img.naturalHeight - sh) / 2;
    } else {
      sh = img.naturalHeight;
      sw = img.naturalHeight * canvasRatio;
      sx = (img.naturalWidth - sw) / 2;
      sy = 0;
    }

    ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);

    // Subtle gloss overlay vignette to make text & gadgets hyper-legible
    const vignette = ctx.createLinearGradient(0, 0, 0, h);
    vignette.addColorStop(0, 'rgba(0, 15, 30, 0.15)');
    vignette.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    vignette.addColorStop(1, 'rgba(0, 20, 45, 0.25)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, w, h);
  },

  renderFallbackGradient: function(ctx, w, h) {
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, '#102a43');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#38bdf8');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  },

  renderSunlightGlint: function(ctx, w, h) {
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    const sunX = w * 0.75;
    const sunY = h * 0.18;
    const pulse = Math.sin(this.time * 1.2) * 15;

    const sunGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, w * 0.5 + pulse);
    sunGrad.addColorStop(0, 'rgba(255, 255, 255, 0.35)');
    sunGrad.addColorStop(0.2, 'rgba(180, 240, 255, 0.15)');
    sunGrad.addColorStop(0.5, 'rgba(77, 201, 246, 0.05)');
    sunGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.fillStyle = sunGrad;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  },

  render3DBubbles: function(ctx) {
    ctx.save();
    for (let i = 0; i < this.particles.length; i++) {
      const b = this.particles[i];
      const wobble = Math.sin(this.time * b.wobbleSpeed + b.driftPhase) * b.wobbleAmount;
      const rx = b.radius * (1 + wobble);
      const ry = b.radius * (1 - wobble);

      ctx.save();
      ctx.translate(b.x, b.y);

      // Bubble Outer Glow / Refraction Ring
      ctx.beginPath();
      ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${b.opacity * 0.9})`;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Translucent Liquid Fill with iridescent cyan/magenta tint
      const fillGrad = ctx.createRadialGradient(-rx * 0.2, -ry * 0.2, rx * 0.1, 0, 0, rx);
      fillGrad.addColorStop(0, `rgba(255, 255, 255, ${b.opacity * 0.35})`);
      fillGrad.addColorStop(0.6, `rgba(160, 230, 255, ${b.opacity * 0.2})`);
      fillGrad.addColorStop(0.9, `rgba(255, 180, 240, ${b.opacity * 0.18})`);
      fillGrad.addColorStop(1, `rgba(120, 210, 255, ${b.opacity * 0.35})`);
      ctx.fillStyle = fillGrad;
      ctx.fill();

      // Top-Left Primary Specular Glint (Crescent Shine)
      ctx.beginPath();
      ctx.ellipse(-rx * 0.35, -ry * 0.35, rx * 0.3, ry * 0.18, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 1.1})`;
      ctx.fill();

      // Bottom-Right Secondary Caustic Reflection
      ctx.beginPath();
      ctx.ellipse(rx * 0.35, ry * 0.35, rx * 0.2, ry * 0.1, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${b.opacity * 0.6})`;
      ctx.fill();

      ctx.restore();
    }
    ctx.restore();
  },

  renderRipples: function(ctx) {
    ctx.save();
    for (let i = 0; i < this.ripples.length; i++) {
      const r = this.ripples[i];

      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${r.opacity})`;
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Rainbow Caustic Ring
      if (r.radius > 25) {
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius * 0.75, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120, 225, 255, ${r.opacity * 0.6})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    }
    ctx.restore();
  },

  loop: function(timestamp) {
    if (this.isPaused) return;

    const dt = Math.min((timestamp - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = timestamp;

    this.update(dt);
    this.render();

    this.animationId = requestAnimationFrame((t) => this.loop(t));
  }
};

window.BackgroundEngine = BackgroundEngine;
