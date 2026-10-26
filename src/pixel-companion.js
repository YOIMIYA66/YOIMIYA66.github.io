// Lyu Bingrong (YOIMIYA66) Custom Pixel Art Avatar
// Designed to match actual ID photo: neat black hair, thick distinct eyebrows,
// silver rectangular wireframe glasses, tailored dark suit with crisp royal blue tie,
// holding a retro cyberdeck with real-time code scanning.

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
    this.isHovered = false;
    this.hopY = 0;
    this.hopVy = 0;

    this.breathTimer = 0;
    this.codeTimer = 0;
    this.particles = [];
    this.bubbleText = 'HELLO!';
    this.bubbleTimer = 0;

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

    this.canvas.addEventListener('mouseenter', () => {
      this.isHovered = true;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.isHovered = false;
    });

    const parentBtn = this.canvas.closest('#doll');
    if (parentBtn && parentBtn !== this.canvas) {
      parentBtn.addEventListener('click', () => {
        this.hop();
      });
      parentBtn.addEventListener('mouseenter', () => {
        this.isHovered = true;
      });
      parentBtn.addEventListener('mouseleave', () => {
        this.isHovered = false;
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
    this.hopVy = -4.5;
    this.isHappy = true;
    
    // Cycle celebratory developer quotes on click
    const quotes = ['6.5K★', 'SHIP!', 'PASS✓', 'READY!'];
    this.bubbleText = quotes[Math.floor(Math.random() * quotes.length)];
    this.bubbleTimer = 2.0;

    setTimeout(() => {
      this.isHappy = false;
    }, 1500);

    // Burst 16-bit glowing particle sparks (blue, gold, cyan, red)
    const colors = ['#2563EB', '#F59E0B', '#38BDF8', '#10B981', '#C76F50', '#FCD34D'];
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const speed = 1.3 + Math.random() * 2.0;
      this.particles.push({
        x: 32 + (Math.random() - 0.5) * 6,
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

    this.lookX = dx > 70 ? 1 : (dx < -70 ? -1 : 0);
    this.lookY = dy > 50 ? 1 : (dy < -50 ? -1 : 0);

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
    if (this.bubbleTimer > 0) {
      this.bubbleTimer -= dt;
    }

    // 4. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    // Idle breathing offset
    const breath = Math.sin(this.breathTimer) > 0.4 ? 1 : 0;
    const curHop = Math.round(this.hopY);

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
    const shadowW = Math.round(28 * shadowScale);
    rect(32 - shadowW / 2, 63, shadowW, 3, 'rgba(42, 48, 64, 0.22)');

    const baseY = curHop;

    // --- 2. Formal Dark Leather Shoes ---
    rect(23, 59 + baseY, 7, 4, '#10141D');
    rect(23, 59 + baseY, 6, 2, '#232938');
    rect(34, 59 + baseY, 7, 4, '#10141D');
    rect(34, 59 + baseY, 6, 2, '#232938');

    // --- 3. Suit Trousers (Dark Charcoal) ---
    rect(24, 50 + baseY, 5, 9, '#181C26');
    rect(35, 50 + baseY, 5, 9, '#181C26');
    rect(25, 51 + baseY, 3, 7, '#232938');
    rect(36, 51 + baseY, 3, 7, '#232938');

    // --- 4. Tailored Suit Jacket & Royal Blue Tie (Photo Likeness!) ---
    const bodyY = baseY - breath;

    // Dark Suit Jacket Base
    rect(20, 36 + bodyY, 24, 15, '#10141D');
    rect(21, 37 + bodyY, 22, 13, '#1C212D');
    // Suit Lapels
    rect(22, 38 + bodyY, 4, 10, '#242B3A');
    rect(38, 38 + bodyY, 4, 10, '#242B3A');

    // Crisp Light Blue / White Collared Shirt
    rect(29, 36 + bodyY, 6, 8, '#F0F4F8');
    rect(28, 36 + bodyY, 2, 3, '#FFFDF8');
    rect(34, 36 + bodyY, 2, 3, '#FFFDF8');

    // Royal Blue Silk Tie (Exact Match with ID Photo!)
    rect(31, 37 + bodyY, 2, 2, '#3B82F6'); // Tie knot
    rect(30, 39 + bodyY, 4, 6, '#2563EB'); // Tie body
    rect(31, 45 + bodyY, 2, 2, '#1D4ED8'); // Tie lower tip
    pixel(31, 38 + bodyY, '#60A5FA'); // Tie specular knot shine

    // Breast pocket terracotta badge (Chinese seal "荣")
    rect(23, 40 + bodyY, 4, 4, '#C76F50');
    pixel(24, 41 + bodyY, '#FFFDF8');
    pixel(25, 42 + bodyY, '#FFFDF8');

    // --- 5. Cyberdeck / Mini Developer Terminal in Hands ---
    // Outer casing (titanium slate)
    rect(24, 47 + bodyY, 16, 8, '#0F172A');
    rect(25, 48 + bodyY, 14, 6, '#334155');
    // Glowing Terminal Screen
    rect(26, 49 + bodyY, 12, 4, '#020617');

    // Animated scrolling code scanlines (cyan & green)
    const codeTick = Math.floor(this.codeTimer) % 4;
    rect(27, 50 + bodyY, 10, 1, '#38BDF8'); // Cyan data line
    if (codeTick % 2 === 0) {
      rect(27, 51 + bodyY, 7, 1, '#4ADE80'); // Green active line
    } else {
      rect(29, 51 + bodyY, 6, 1, '#F59E0B'); // Amber compilation line
    }
    pixel(27 + (codeTick % 6), 50 + bodyY, '#FDE047'); // Blinking caret

    // Hands resting on deck
    rect(22, 48 + bodyY, 3, 4, '#FCD5B5');
    rect(39, 48 + bodyY, 3, 4, '#FCD5B5');

    // --- 6. Head & Face (Photo Likeness!) ---
    const headY = bodyY;

    // Neck
    rect(29, 34 + headY, 6, 3, '#F5AF8B');

    // Symmetrical Face Shape
    rect(22, 20 + headY, 20, 15, '#151821'); // Contour outline
    rect(23, 21 + headY, 18, 13, '#FCD5B5');
    rect(24, 20 + headY, 16, 15, '#FCD5B5');
    // Chin & jaw definition
    rect(27, 33 + headY, 10, 1, '#F6B28B');

    // Subtle Natural Blush
    rect(23, 29 + headY, 3, 2, '#F4978E');
    rect(38, 29 + headY, 3, 2, '#F4978E');

    // Thick, Defined Dark Eyebrows (Prominent Feature in Photo!)
    rect(25, 23 + headY, 5, 2, '#151821');
    rect(34, 23 + headY, 5, 2, '#151821');

    // Eyes Behind Glasses
    if (this.isBlinking) {
      rect(26, 27 + headY, 4, 1, '#151821');
      rect(34, 27 + headY, 4, 1, '#151821');
    } else if (this.isHappy) {
      pixel(25, 27 + headY, '#151821');
      rect(26, 26 + headY, 2, 1, '#151821');
      pixel(28, 27 + headY, '#151821');

      pixel(35, 27 + headY, '#151821');
      rect(36, 26 + headY, 2, 1, '#151821');
      pixel(38, 27 + headY, '#151821');
    } else {
      rect(25, 26 + headY, 5, 3, '#FFFDF8');
      rect(34, 26 + headY, 5, 3, '#FFFDF8');

      // Pupils with mouse gaze offset (-1, 0, +1)
      const pxL = 26 + this.lookX;
      const py = 26 + headY + Math.max(0, this.lookY);
      const pxR = 35 + this.lookX;

      rect(pxL, py, 2, 3, '#151821');
      rect(pxR, py, 2, 3, '#151821');

      // White catchlight reflections
      pixel(pxL, py, '#FFFDF8');
      pixel(pxR, py, '#FFFDF8');
    }

    // Sleek Silver/Titanium Wireframe Glasses (Exact Shape from Photo!)
    rect(24, 25 + headY, 6, 5, '#94A3B8');
    rect(25, 26 + headY, 4, 3, 'rgba(186, 230, 253, 0.25)'); // Lens sheen
    rect(34, 25 + headY, 6, 5, '#94A3B8');
    rect(35, 26 + headY, 4, 3, 'rgba(186, 230, 253, 0.25)');
    rect(30, 27 + headY, 4, 1, '#CBD5E1'); // Silver nose bridge
    pixel(25, 25 + headY, '#FFFFFF'); // Specular corner highlight
    pixel(35, 25 + headY, '#FFFFFF');

    // Composed, Polite Mouth (Photo Expression)
    if (this.isHappy) {
      rect(29, 30 + headY, 6, 3, '#151821');
      rect(30, 31 + headY, 4, 2, '#EF4444');
      pixel(31, 31 + headY, '#FFFDF8');
    } else {
      rect(30, 31 + headY, 4, 1, '#B91C1C');
      pixel(33, 30 + headY, '#B91C1C');
    }

    // Clean, Neat Short Black Haircut with Forward Fringe (From Photo!)
    rect(21, 15 + headY, 22, 6, '#151821');
    rect(23, 13 + headY, 18, 4, '#151821');
    rect(26, 12 + headY, 12, 3, '#151821');
    // Neat short sides
    rect(21, 19 + headY, 2, 8, '#151821');
    rect(41, 19 + headY, 2, 8, '#151821');
    // Subtle crown highlight
    rect(27, 14 + headY, 8, 2, '#2D3748');
    // Short textured bangs across forehead (like in ID photo)
    rect(23, 20 + headY, 3, 2, '#151821');
    rect(28, 20 + headY, 4, 2, '#151821');
    rect(34, 20 + headY, 4, 2, '#151821');
    rect(39, 20 + headY, 2, 2, '#151821');

    // --- 7. Interactive Speech Bubble with 3x5 Pixel Font Engine ---
    const showBubble = (this.isHovered && !this.isHappy) || this.bubbleTimer > 0;
    const textToShow = this.bubbleTimer > 0 ? this.bubbleText : (this.isHovered ? 'HELLO!' : '');
    if (showBubble && textToShow) {
      const charWidth = 4;
      const totalTextW = textToShow.length * charWidth - 1;
      const bubbleW = Math.max(26, totalTextW + 8);
      const bubbleX = Math.round(32 - bubbleW / 2);

      // Bubble outline & card fill
      rect(bubbleX, 3, bubbleW, 10, '#151821');
      rect(bubbleX + 1, 4, bubbleW - 2, 8, '#FFFDF8');
      // Bubble tail
      rect(30, 13, 4, 1, '#151821');
      rect(31, 14, 2, 1, '#151821');

      // 3x5 Pixel Font Dictionary
      const GLYPHS = {
        'H': [0b101, 0b101, 0b111, 0b101, 0b101],
        'E': [0b111, 0b100, 0b110, 0b100, 0b111],
        'L': [0b100, 0b100, 0b100, 0b100, 0b111],
        'O': [0b111, 0b101, 0b101, 0b101, 0b111],
        '!': [0b010, 0b010, 0b010, 0b000, 0b010],
        '6': [0b111, 0b100, 0b111, 0b101, 0b111],
        '.': [0b000, 0b000, 0b000, 0b000, 0b010],
        '5': [0b111, 0b100, 0b111, 0b001, 0b111],
        'K': [0b101, 0b110, 0b100, 0b110, 0b101],
        '★': [0b010, 0b111, 0b010, 0b101, 0b000],
        'S': [0b111, 0b100, 0b111, 0b001, 0b111],
        'I': [0b111, 0b010, 0b010, 0b010, 0b111],
        'P': [0b111, 0b101, 0b111, 0b100, 0b100],
        'A': [0b111, 0b101, 0b111, 0b101, 0b101],
        'R': [0b110, 0b101, 0b110, 0b101, 0b101],
        'D': [0b110, 0b101, 0b101, 0b101, 0b110],
        'Y': [0b101, 0b101, 0b010, 0b010, 0b010],
        '✓': [0b000, 0b001, 0b001, 0b101, 0b010],
        '+': [0b000, 0b010, 0b111, 0b010, 0b000],
        ' ': [0b000, 0b000, 0b000, 0b000, 0b000]
      };

      const startX = bubbleX + Math.round((bubbleW - totalTextW) / 2);
      for (let i = 0; i < textToShow.length; i++) {
        const char = textToShow[i].toUpperCase();
        const rows = GLYPHS[char] || GLYPHS[' '];
        const cx = startX + i * charWidth;
        const color = (char === '★' || char === '✓') ? '#C76F50' : (char === '!' ? '#2563EB' : '#151821');
        for (let r = 0; r < 5; r++) {
          const rowVal = rows[r];
          if ((rowVal & 0b100) !== 0) pixel(cx, 5 + r, color);
          if ((rowVal & 0b010) !== 0) pixel(cx + 1, 5 + r, color);
          if ((rowVal & 0b001) !== 0) pixel(cx + 2, 5 + r, color);
        }
      }
    }

    // --- 8. Particle Sparks on Click ---
    for (const p of this.particles) {
      const alpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = alpha;
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
