// Lyu Bingrong (YOIMIYA66) Custom Pixel Art Companion & Diorama
// 100% Authentic 16-bit Pixel Art: Stepped circular aperture, developer in formal dark suit
// with royal blue silk tie, silver rectangular wireframe glasses, and cyberdeck terminal.

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
    this.starTick = 0;

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
    // Nimble, strictly-bounded 4-pixel hop so companion NEVER escapes the circular frame
    this.hopVy = -2.2;
    this.isHappy = true;
    
    // Cycle celebratory developer quotes on click
    const quotes = ['6.5K★', 'SHIP!', 'PASS✓', 'READY!'];
    this.bubbleText = quotes[Math.floor(Math.random() * quotes.length)];
    this.bubbleTimer = 2.0;

    setTimeout(() => {
      this.isHappy = false;
    }, 1400);

    // Burst 16-bit glowing particle sparks (blue, gold, cyan, green)
    const colors = ['#2563EB', '#F59E0B', '#38BDF8', '#10B981', '#C76F50', '#FCD34D'];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.0 + Math.random() * 1.5;
      this.particles.push({
        x: 40 + (Math.random() - 0.5) * 4,
        y: 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 0.8,
        color: colors[i % colors.length],
        life: 1.0,
        decay: 0.035 + Math.random() * 0.02
      });
    }
  }

  update(dt) {
    // 1. Calculate gaze offset (-1, 0, or 1 pixel)
    const rect = this.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height * 0.45;
    const dx = this.mouseX - centerX;
    const dy = this.mouseY - centerY;

    this.lookX = dx > 60 ? 1 : (dx < -60 ? -1 : 0);
    this.lookY = dy > 40 ? 1 : (dy < -40 ? -1 : 0);

    // 2. Hop physics with strict ceiling clamp (max -4.5 pixels)
    if (this.hopY < 0 || this.hopVy !== 0) {
      this.hopY += this.hopVy;
      this.hopVy += 0.32; // gravity
      if (this.hopY < -4.5) {
        this.hopY = -4.5;
        this.hopVy = 0;
      }
      if (this.hopY >= 0) {
        this.hopY = 0;
        this.hopVy = 0;
      }
    }

    // 3. Timers
    this.breathTimer += dt * 3.0;
    this.codeTimer += dt * 8.0;
    this.starTick += dt * 2.0;
    if (this.bubbleTimer > 0) {
      this.bubbleTimer -= dt;
    }

    // 4. Particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.life -= p.decay;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const rect = (x, y, w, h, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), Math.floor(h));
    };
    const pixel = (x, y, col) => {
      ctx.fillStyle = col;
      ctx.fillRect(Math.floor(x), Math.floor(y), 1, 1);
    };

    // Center coordinates
    const cx = 40;
    const cy = 40;
    const R = 36;
    const R2 = R * R;
    const groundY = 63;

    // --- 1. Authentic 16-bit Stepped Pixel Circle Background ---
    for (let y = 4; y <= 76; y++) {
      const dy = y - cy;
      const maxHalfW = Math.floor(Math.sqrt(Math.max(0, R2 - dy * dy)));
      if (maxHalfW <= 0) continue;

      const leftX = cx - maxHalfW;
      const rightX = cx + maxHalfW;
      const width = rightX - leftX + 1;

      // Interior fill
      if (y < groundY) {
        // Retro sky: mist blue
        rect(leftX, y, width, 1, '#CBD7E1');
      } else if (y === groundY) {
        // Horizon line: dark ink
        rect(leftX, y, width, 1, '#2A3040');
      } else {
        // Ground floor: soft textured card tone
        rect(leftX, y, width, 1, '#DFE7ED');
      }

      // Stepped 1-pixel dark rim outline on the perimeter
      pixel(leftX, y, '#2A3040');
      pixel(rightX, y, '#2A3040');
    }

    // Top & bottom cap pixels for the circle
    pixel(cx, 4, '#2A3040');
    pixel(cx - 1, 4, '#2A3040');
    pixel(cx + 1, 4, '#2A3040');
    pixel(cx, 76, '#2A3040');
    pixel(cx - 1, 76, '#2A3040');
    pixel(cx + 1, 76, '#2A3040');

    // Subtle twinkling 16-bit sky stars inside aperture
    const starBlink = Math.sin(this.starTick) > 0;
    if (starBlink) {
      pixel(22, 18, '#FFFDF8');
      pixel(23, 18, '#E2E8F0');
      pixel(60, 22, '#FFFDF8');
      pixel(59, 22, '#E2E8F0');
    } else {
      pixel(22, 18, '#94A3B8');
      pixel(60, 22, '#94A3B8');
    }

    // Idle breathing & hop offsets
    const breath = Math.sin(this.breathTimer) > 0.4 ? 1 : 0;
    const curHop = Math.round(this.hopY);
    const baseY = curHop;

    // --- 2. Ground Hatch Shadow ---
    const shadowScale = Math.max(0.55, 1 - Math.abs(curHop) / 10);
    const shadowW = Math.round(26 * shadowScale);
    rect(cx - shadowW / 2, 64, shadowW, 2, 'rgba(42, 48, 64, 0.25)');

    // --- 3. Formal Dark Leather Shoes ---
    rect(31, 60 + baseY, 7, 3, '#10141D');
    rect(31, 60 + baseY, 6, 1, '#232938');
    rect(42, 60 + baseY, 7, 3, '#10141D');
    rect(42, 60 + baseY, 6, 1, '#232938');

    // --- 4. Suit Trousers (Dark Charcoal) ---
    rect(32, 51 + baseY, 5, 9, '#181C26');
    rect(43, 51 + baseY, 5, 9, '#181C26');
    rect(33, 52 + baseY, 3, 7, '#232938');
    rect(44, 52 + baseY, 3, 7, '#232938');

    // --- 5. Tailored Dark Suit Jacket & Royal Blue Silk Tie ---
    const bodyY = baseY - breath;

    // Suit Jacket Base
    rect(28, 37 + bodyY, 24, 15, '#10141D');
    rect(29, 38 + bodyY, 22, 13, '#1C212D');
    // Suit Lapels
    rect(30, 39 + bodyY, 4, 10, '#242B3A');
    rect(46, 39 + bodyY, 4, 10, '#242B3A');

    // Crisp Light Blue / White Collared Shirt
    rect(37, 37 + bodyY, 6, 8, '#F0F4F8');
    rect(36, 37 + bodyY, 2, 3, '#FFFDF8');
    rect(42, 37 + bodyY, 2, 3, '#FFFDF8');

    // Royal Blue Silk Tie (Exact Match with ID Photo!)
    rect(39, 38 + bodyY, 2, 2, '#3B82F6'); // Tie knot
    rect(38, 40 + bodyY, 4, 6, '#2563EB'); // Tie body
    rect(39, 46 + bodyY, 2, 2, '#1D4ED8'); // Tie lower tip
    pixel(39, 39 + bodyY, '#60A5FA'); // Tie specular knot shine

    // Breast pocket terracotta badge (Chinese seal "荣")
    rect(31, 41 + bodyY, 4, 4, '#C76F50');
    pixel(32, 42 + bodyY, '#FFFDF8');
    pixel(33, 43 + bodyY, '#FFFDF8');

    // --- 6. Cyberdeck Terminal in Hands ---
    rect(32, 48 + bodyY, 16, 8, '#0F172A');
    rect(33, 49 + bodyY, 14, 6, '#334155');
    // Screen
    rect(34, 50 + bodyY, 12, 4, '#020617');

    // Animated scrolling code scanlines (cyan, green, amber)
    const codeTick = Math.floor(this.codeTimer) % 4;
    rect(35, 51 + bodyY, 10, 1, '#38BDF8'); // Cyan data line
    if (codeTick % 2 === 0) {
      rect(35, 52 + bodyY, 7, 1, '#4ADE80'); // Green active line
    } else {
      rect(37, 52 + bodyY, 6, 1, '#F59E0B'); // Amber compilation line
    }
    pixel(35 + (codeTick % 6), 51 + bodyY, '#FDE047'); // Caret

    // Hands resting on cyberdeck
    rect(30, 49 + bodyY, 3, 4, '#FCD5B5');
    rect(47, 49 + bodyY, 3, 4, '#FCD5B5');

    // --- 7. Head, Face & Hair (ID Photo Likeness) ---
    const headY = bodyY;

    // Neck
    rect(37, 35 + headY, 6, 3, '#F5AF8B');

    // Face Shape & Contour
    rect(30, 21 + headY, 20, 15, '#151821'); // Outline
    rect(31, 22 + headY, 18, 13, '#FCD5B5');
    rect(32, 21 + headY, 16, 15, '#FCD5B5');
    // Chin & jaw definition
    rect(35, 34 + headY, 10, 1, '#F6B28B');

    // Subtle Natural Blush
    rect(31, 30 + headY, 3, 2, '#F4978E');
    rect(46, 30 + headY, 3, 2, '#F4978E');

    // Thick, Defined Dark Eyebrows (Prominent ID Feature)
    rect(33, 24 + headY, 5, 2, '#151821');
    rect(42, 24 + headY, 5, 2, '#151821');

    // Eyes Behind Glasses
    if (this.isBlinking) {
      rect(34, 28 + headY, 4, 1, '#151821');
      rect(42, 28 + headY, 4, 1, '#151821');
    } else if (this.isHappy) {
      pixel(33, 28 + headY, '#151821');
      rect(34, 27 + headY, 2, 1, '#151821');
      pixel(36, 28 + headY, '#151821');

      pixel(43, 28 + headY, '#151821');
      rect(44, 27 + headY, 2, 1, '#151821');
      pixel(46, 28 + headY, '#151821');
    } else {
      rect(33, 27 + headY, 5, 3, '#FFFDF8');
      rect(42, 27 + headY, 5, 3, '#FFFDF8');

      // Pupils with mouse gaze tracking
      const pxL = 34 + this.lookX;
      const py = 27 + headY + Math.max(0, this.lookY);
      const pxR = 43 + this.lookX;

      rect(pxL, py, 2, 3, '#151821');
      rect(pxR, py, 2, 3, '#151821');

      // Catchlight highlights
      pixel(pxL, py, '#FFFDF8');
      pixel(pxR, py, '#FFFDF8');
    }

    // Sleek Silver Wireframe Glasses (Exact Shape from Photo)
    rect(32, 26 + headY, 6, 5, '#94A3B8');
    rect(33, 27 + headY, 4, 3, 'rgba(186, 230, 253, 0.35)'); // Lens sheen
    rect(42, 26 + headY, 6, 5, '#94A3B8');
    rect(43, 27 + headY, 4, 3, 'rgba(186, 230, 253, 0.35)');
    rect(38, 28 + headY, 4, 1, '#CBD5E1'); // Silver bridge
    pixel(33, 26 + headY, '#FFFFFF'); // Specular corner
    pixel(43, 26 + headY, '#FFFFFF');

    // Composed Polite Smile
    if (this.isHappy) {
      rect(37, 31 + headY, 6, 3, '#151821');
      rect(38, 32 + headY, 4, 2, '#EF4444');
      pixel(39, 32 + headY, '#FFFDF8');
    } else {
      rect(38, 32 + headY, 4, 1, '#B91C1C');
      pixel(41, 31 + headY, '#B91C1C');
    }

    // Clean, Neat Short Black Haircut with Forward Fringe
    rect(29, 16 + headY, 22, 6, '#151821');
    rect(31, 14 + headY, 18, 4, '#151821');
    rect(34, 13 + headY, 12, 3, '#151821');
    // Sides
    rect(29, 20 + headY, 2, 8, '#151821');
    rect(49, 20 + headY, 2, 8, '#151821');
    // Crown highlight
    rect(35, 15 + headY, 8, 2, '#2D3748');
    // Textured bangs across forehead
    rect(31, 21 + headY, 3, 2, '#151821');
    rect(36, 21 + headY, 4, 2, '#151821');
    rect(42, 21 + headY, 4, 2, '#151821');
    rect(47, 21 + headY, 2, 2, '#151821');

    // --- 8. Interactive Speech Bubble (Fitted inside the upper circle arc!) ---
    const showBubble = (this.isHovered && !this.isHappy) || this.bubbleTimer > 0;
    const textToShow = this.bubbleTimer > 0 ? this.bubbleText : (this.isHovered ? 'HELLO!' : '');
    if (showBubble && textToShow) {
      const charWidth = 4;
      const totalTextW = textToShow.length * charWidth - 1;
      const bubbleW = Math.max(26, totalTextW + 8);
      const bubbleX = Math.round(cx - bubbleW / 2);
      const bubbleY = 7; // Fixed comfortably inside the upper arc (circle top is y = 4)

      // Bubble outline & fill
      rect(bubbleX, bubbleY, bubbleW, 9, '#151821');
      rect(bubbleX + 1, bubbleY + 1, bubbleW - 2, 7, '#FFFDF8');
      // Bubble tail pointing down to head
      rect(39, bubbleY + 9, 3, 1, '#151821');
      rect(40, bubbleY + 10, 2, 1, '#151821');

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
        const scx = startX + i * charWidth;
        const color = (char === '★' || char === '✓') ? '#C76F50' : (char === '!' ? '#2563EB' : '#151821');
        for (let r = 0; r < 5; r++) {
          const rowVal = rows[r];
          if ((rowVal & 0b100) !== 0) pixel(scx, bubbleY + 2 + r, color);
          if ((rowVal & 0b010) !== 0) pixel(scx + 1, bubbleY + 2 + r, color);
          if ((rowVal & 0b001) !== 0) pixel(scx + 2, bubbleY + 2 + r, color);
        }
      }
    }

    // --- 9. Particle Sparks on Click (Contained in Circle) ---
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