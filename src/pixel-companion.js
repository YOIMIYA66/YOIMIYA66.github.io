// Pixel Art Developer Companion (No cats, authentic Clawd on Desk pixel aesthetic)
// Interactive 64x72 retro pixel art with pupil tracking, idle breathing, and click particles

export class PixelCompanion {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.width = canvas.width;
    this.height = canvas.height;

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;

    this.lookX = 0;
    this.lookY = 0;

    this.isBlinking = false;
    this.isHappy = false;
    this.hopY = 0;
    this.hopVy = 0;

    this.breathTimer = 0;
    this.codeTimer = 0;
    this.particles = [];

    this.bindEvents();
    this.scheduleBlink();

    this.lastTime = performance.now();
    this.animate = this.animate.bind(this);
    this.rafId = requestAnimationFrame(this.animate);
  }

  bindEvents() {
    window.addEventListener('pointermove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    }, { passive: true });

    this.canvas.addEventListener('click', () => {
      this.hop();
    });

    // Also allow parent button click to trigger
    const parentBtn = this.canvas.closest('#doll');
    if (parentBtn && parentBtn !== this.canvas) {
      parentBtn.addEventListener('click', () => {
        this.hop();
      });
    }
  }

  scheduleBlink() {
    setTimeout(() => {
      if (!this.isHappy) {
        this.isBlinking = true;
        setTimeout(() => {
          this.isBlinking = false;
          this.scheduleBlink();
        }, 130);
      } else {
        this.scheduleBlink();
      }
    }, 2200 + Math.random() * 3200);
  }

  hop() {
    this.hopVy = -4.2;
    this.isHappy = true;
    setTimeout(() => {
      this.isHappy = false;
    }, 1200);

    // Burst 6-8 pixel stars
    const colors = ['#F59E0B', '#EF4444', '#38BDF8', '#10B981', '#FCD34D'];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 1.2 + Math.random() * 1.8;
      this.particles.push({
        x: 32 + (Math.random() - 0.5) * 8,
        y: 28,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.2,
        color: colors[i % colors.length],
        life: 1.0,
        decay: 0.025 + Math.random() * 0.02
      });
    }
  }

  update(dt) {
    // 1. Calculate gaze offset (-1, 0, or 1 pixel)
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.4;
    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;

    this.lookX = dx > 80 ? 1 : (dx < -80 ? -1 : 0);
    this.lookY = dy > 60 ? 1 : (dy < -60 ? -1 : 0);

    // 2. Hop physics
    if (this.hopY < 0 || this.hopVy !== 0) {
      this.hopY += this.hopVy;
      this.hopVy += 0.28; // gravity
      if (this.hopY >= 0) {
        this.hopY = 0;
        this.hopVy = 0;
      }
    }

    // 3. Timers
    this.breathTimer += dt * 3.0;
    this.codeTimer += dt * 8.0;

    // 4. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // slight gravity
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Idle breathing offset (0 or 1 pixel vertical shift)
    const breath = Math.sin(this.breathTimer) > 0.4 ? 1 : 0;
    const curHop = Math.round(this.hopY);

    // Draw helper
    const rect = (x, y, w, h, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    };
    const pixel = (x, y, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    };

    // --- 1. Soft Floor Shadow ---
    const shadowScale = Math.max(0.6, 1 - Math.abs(curHop) / 16);
    const shadowW = Math.round(26 * shadowScale);
    rect(32 - shadowW / 2, 63, shadowW, 3, 'rgba(42, 48, 64, 0.2)');

    const baseY = curHop;

    // --- 2. Shoes (Sneakers) ---
    // Left shoe
    rect(23, 59 + baseY, 7, 4, '#1A202C');
    rect(23, 59 + baseY, 6, 3, '#FFFDF8');
    pixel(24, 60 + baseY, '#E2E8F0');
    // Right shoe
    rect(34, 59 + baseY, 7, 4, '#1A202C');
    rect(34, 59 + baseY, 6, 3, '#FFFDF8');
    pixel(35, 60 + baseY, '#E2E8F0');

    // --- 3. Legs (Dark Denim / Slacks) ---
    rect(24, 51 + baseY, 5, 8, '#242C3A');
    rect(35, 51 + baseY, 5, 8, '#242C3A');
    rect(25, 52 + baseY, 3, 6, '#2D3748');
    rect(36, 52 + baseY, 3, 6, '#2D3748');

    // --- 4. Torso & Jacket (with breathing offset) ---
    const bodyY = baseY - breath;

    // Outer Jacket (Deep Slate / Navy)
    rect(20, 36 + bodyY, 24, 16, '#1A202C');
    rect(21, 37 + bodyY, 22, 14, '#2B3545');
    rect(22, 38 + bodyY, 20, 12, '#333F52');

    // White Shirt Inner Collar
    rect(30, 36 + bodyY, 4, 3, '#FFFDF8');
    pixel(31, 38 + bodyY, '#E2E8F0');

    // Zipper line
    rect(31, 39 + bodyY, 2, 12, '#1A202C');

    // Pocket Terracotta Red Seal Badge (荣)
    rect(23, 40 + bodyY, 4, 4, '#C76F50');
    pixel(24, 41 + bodyY, '#FFFDF8');
    pixel(25, 42 + bodyY, '#FFFDF8');

    // --- 5. Retro Cyberdeck / Laptop in Hands ---
    // Outer casing (matte titanium)
    rect(25, 46 + bodyY, 14, 9, '#1E293B');
    rect(26, 47 + bodyY, 12, 7, '#475569');
    // Glowing Screen (Deep Navy/Black Terminal)
    rect(27, 48 + bodyY, 10, 5, '#090D16');

    // Blinking animated code lines
    const codeTick = Math.floor(this.codeTimer) % 4;
    rect(28, 49 + bodyY, 8, 1, '#38BDF8'); // cyan line
    if (codeTick % 2 === 0) {
      rect(28, 51 + bodyY, 5, 1, '#4ADE80'); // green line
    } else {
      rect(30, 51 + bodyY, 6, 1, '#F59E0B'); // amber line
    }
    pixel(28 + (codeTick % 4), 50 + bodyY, '#FCD34D'); // blinking cursor

    // Hands holding the laptop
    rect(23, 47 + bodyY, 3, 4, '#1A202C');
    rect(23, 47 + bodyY, 2, 3, '#FCD5B5');
    rect(38, 47 + bodyY, 3, 4, '#1A202C');
    rect(39, 47 + bodyY, 2, 3, '#FCD5B5');

    // --- 6. Head & Face (with breathing offset) ---
    const headY = bodyY;

    // Neck
    rect(29, 34 + headY, 6, 4, '#E89D7D');

    // Face Canvas
    rect(21, 20 + headY, 22, 15, '#1A202C'); // head outline
    rect(22, 21 + headY, 20, 13, '#FCD5B5');
    rect(23, 20 + headY, 18, 15, '#FCD5B5');
    // Chin shadow
    rect(26, 33 + headY, 12, 1, '#F6B28B');

    // Natural Blush
    rect(23, 29 + headY, 3, 2, '#F4978E');
    rect(38, 29 + headY, 3, 2, '#F4978E');

    // --- 7. Eyes & Eyebrows (Dynamic Gaze & Blinking) ---
    // Eyebrows
    rect(25, 23 + headY, 5, 1, '#1A202C');
    rect(34, 23 + headY, 5, 1, '#1A202C');

    if (this.isBlinking) {
      // Blink lines
      rect(26, 27 + headY, 4, 1, '#1A202C');
      rect(34, 27 + headY, 4, 1, '#1A202C');
    } else if (this.isHappy) {
      // Cheerful happy squint curves (^^)
      pixel(25, 27 + headY, '#1A202C');
      rect(26, 26 + headY, 2, 1, '#1A202C');
      pixel(28, 27 + headY, '#1A202C');

      pixel(35, 27 + headY, '#1A202C');
      rect(36, 26 + headY, 2, 1, '#1A202C');
      pixel(38, 27 + headY, '#1A202C');
    } else {
      // Sclera (White base)
      rect(25, 25 + headY, 5, 3, '#FFFDF8');
      rect(34, 25 + headY, 5, 3, '#FFFDF8');

      // Pupils with mouse gaze offset (-1, 0, +1)
      const pxL = 26 + this.lookX;
      const py = 25 + headY + Math.max(0, this.lookY);
      const pxR = 35 + this.lookX;

      rect(pxL, py, 2, 3, '#1A202C');
      rect(pxR, py, 2, 3, '#1A202C');

      // Specular catchlight pixel
      pixel(pxL, py, '#FFFDF8');
      pixel(pxR, py, '#FFFDF8');
    }

    // --- 8. Glasses Frame (Terracotta & Gold Bridge) ---
    rect(24, 24 + headY, 6, 5, '#1A202C'); // Left frame outline
    rect(34, 24 + headY, 6, 5, '#1A202C'); // Right frame outline
    rect(25, 25 + headY, 4, 3, 'rgba(255, 255, 255, 0.12)'); // Left lens sheen
    rect(35, 25 + headY, 4, 3, 'rgba(255, 255, 255, 0.12)'); // Right lens sheen
    rect(30, 26 + headY, 4, 1, '#C76F50'); // Terracotta bridge

    // --- 9. Mouth ---
    if (this.isHappy) {
      // Cheerful open smile with pink interior
      rect(29, 30 + headY, 6, 3, '#1A202C');
      rect(30, 31 + headY, 4, 2, '#EF4444');
      pixel(31, 31 + headY, '#FFFDF8'); // tooth shine
    } else {
      // Confident smirk
      rect(30, 31 + headY, 4, 1, '#B91C1C');
      pixel(33, 30 + headY, '#B91C1C');
    }

    // --- 10. Layered Hair & Bangs (Cool Dark Charcoal) ---
    // Main hair volume
    rect(20, 15 + headY, 24, 7, '#1E2430');
    rect(22, 13 + headY, 20, 5, '#1E2430');
    rect(25, 11 + headY, 14, 4, '#1E2430');

    // Sideburns
    rect(19, 19 + headY, 3, 11, '#1E2430');
    rect(42, 19 + headY, 3, 11, '#1E2430');

    // Highlights
    rect(26, 14 + headY, 9, 2, '#475569');
    rect(28, 12 + headY, 6, 2, '#64748B');

    // Spiky Bangs over forehead
    rect(23, 20 + headY, 3, 4, '#1E2430');
    rect(29, 20 + headY, 4, 3, '#1E2430');
    rect(36, 20 + headY, 4, 4, '#1E2430');
    pixel(25, 24 + headY, '#1E2430');
    pixel(32, 23 + headY, '#1E2430');
    pixel(38, 24 + headY, '#1E2430');

    // Spiky Ahoge / Stray Hair Strand
    rect(33, 8 + headY, 2, 4, '#1E2430');
    rect(34, 7 + headY, 3, 2, '#1E2430');

    // --- 11. Sparks / Star Particles on Click ---
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
      // Cross star shape (3x3)
      pixel(p.x, p.y, p.color);
      pixel(p.x - 1, p.y, p.color);
      pixel(p.x + 1, p.y, p.color);
      pixel(p.x, p.y - 1, p.color);
      pixel(p.x, p.y + 1, p.color);
    }
    ctx.globalAlpha = 1.0;
  }

  animate(currentTime) {
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    this.rafId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
  }
}
