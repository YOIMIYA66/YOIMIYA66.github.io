// Lyu Bingrong (YOIMIYA66) Refactored 16-bit Pixel Art Avatar
// Strictly constrained to 14 theme colors. Enlarged upper body & state machine.

const PALETTE = {
  INK: '#1F1E1D',
  PAPER: '#F0EEE6',
  CARD: '#FAF9F5',
  TERRACOTTA: '#D97757',
  TERRACOTTA_DEEP: '#B5593B',
  SLATE: '#8DA2B6',
  GREEN: '#5E8C4A',
  MIST_LIGHT: '#E9E2D4',
  MIST_DARK: '#DCCFB9',
  SKIN: '#FCD5B5',
  SKIN_SHADOW: '#F5AF8B',
  DARK_BLUE: '#2D3748',
  PEACH: '#FED7AA',
  YELLOW: '#FDE047'
};

const GLYPHS = {
  'A': [0b111, 0b101, 0b111, 0b101, 0b101],
  'B': [0b110, 0b101, 0b110, 0b101, 0b110],
  'C': [0b111, 0b100, 0b100, 0b100, 0b111],
  'D': [0b110, 0b101, 0b101, 0b101, 0b110],
  'E': [0b111, 0b100, 0b110, 0b100, 0b111],
  'F': [0b111, 0b100, 0b110, 0b100, 0b100],
  'G': [0b111, 0b100, 0b101, 0b101, 0b111],
  'H': [0b101, 0b101, 0b111, 0b101, 0b101],
  'I': [0b111, 0b010, 0b010, 0b010, 0b111],
  'J': [0b001, 0b001, 0b001, 0b101, 0b111],
  'K': [0b101, 0b110, 0b100, 0b110, 0b101],
  'L': [0b100, 0b100, 0b100, 0b100, 0b111],
  'M': [0b101, 0b111, 0b101, 0b101, 0b101],
  'N': [0b101, 0b111, 0b111, 0b101, 0b101],
  'O': [0b111, 0b101, 0b101, 0b101, 0b111],
  'P': [0b111, 0b101, 0b111, 0b100, 0b100],
  'Q': [0b111, 0b101, 0b101, 0b111, 0b001],
  'R': [0b110, 0b101, 0b110, 0b101, 0b101],
  'S': [0b111, 0b100, 0b111, 0b001, 0b111],
  'T': [0b111, 0b010, 0b010, 0b010, 0b010],
  'U': [0b101, 0b101, 0b101, 0b101, 0b111],
  'V': [0b101, 0b101, 0b101, 0b101, 0b010],
  'W': [0b101, 0b101, 0b101, 0b111, 0b101],
  'X': [0b101, 0b101, 0b010, 0b101, 0b101],
  'Y': [0b101, 0b101, 0b010, 0b010, 0b010],
  'Z': [0b111, 0b001, 0b010, 0b100, 0b111],
  '0': [0b111, 0b101, 0b101, 0b101, 0b111],
  '1': [0b010, 0b110, 0b010, 0b010, 0b111],
  '2': [0b111, 0b001, 0b111, 0b100, 0b111],
  '3': [0b111, 0b001, 0b111, 0b001, 0b111],
  '4': [0b101, 0b101, 0b111, 0b001, 0b001],
  '5': [0b111, 0b100, 0b111, 0b001, 0b111],
  '6': [0b111, 0b100, 0b111, 0b101, 0b111],
  '7': [0b111, 0b001, 0b010, 0b010, 0b010],
  '8': [0b111, 0b101, 0b111, 0b101, 0b111],
  '9': [0b111, 0b101, 0b111, 0b001, 0b111],
  '!': [0b010, 0b010, 0b010, 0b000, 0b010],
  '+': [0b000, 0b010, 0b111, 0b010, 0b000],
  '-': [0b000, 0b000, 0b111, 0b000, 0b000],
  ' ': [0b000, 0b000, 0b000, 0b000, 0b000]
};

export class PixelCompanion {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    this.width = 80;
    this.height = 80;
    this.canvas.width = 80;
    this.canvas.height = 80;

    this.reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // State machine: 'idle' | 'sleep' | 'happy' | 'wave' | 'typing-fast'
    this.state = 'idle';
    this.previousState = 'idle';

    this.mouseX = window.innerWidth / 2;
    this.mouseY = window.innerHeight / 2;
    this.lookX = 0;
    this.lookY = 0;

    this.isBlinking = false;
    this.hopY = 0;
    this.hopVy = 0;

    this.typeTimer = 0;
    this.steamTimer = 0;
    this.sleepTimer = 0; // Inactivity timer (seconds)
    this.sleepZZ = []; // Floating 'zZ' particles

    // Quotes as requested
    this.quotes = [
      'OPEN TO WORK',
      '66 PRS MERGED',
      '26 AGENTS',
      'RED TEAM + EVAL',
      'READY!'
    ];
    this.quoteIndex = 0;
    this.bubbleText = '';
    this.bubbleTimer = 0;

    this.isVisible = true;
    this.rafId = null;
    this.lastTime = performance.now();

    this.boundPointerMove = this.onPointerMove.bind(this);
    this.boundResize = this.updateCanvasSize.bind(this);
    this.boundClick = this.onClick.bind(this);

    this.initScaling();
    this.bindEvents();
    this.setupObservers();
    this.scheduleBlink();

    if (!this.reduceMotion) {
      this.animate = this.animate.bind(this);
      this.rafId = requestAnimationFrame(this.animate);
    } else {
      this.draw();
    }
  }

  initScaling() {
    this.updateCanvasSize();
    window.addEventListener('resize', this.boundResize);
  }

  updateCanvasSize() {
    const parent = this.canvas.parentElement;
    const pw = parent ? parent.clientWidth : 320;
    // Nearest integer multiple of 80 (minimum 240)
    const mult = Math.max(3, Math.min(5, Math.floor(pw / 80)));
    const size = mult * 80;
    this.canvas.style.width = size + 'px';
    this.canvas.style.height = size + 'px';
  }

  bindEvents() {
    window.addEventListener('pointermove', this.boundPointerMove, { passive: true });

    // Single click binding: ONLY on parent #doll button, NO duplicate click on canvas
    const parentBtn = this.canvas.closest('#doll') || this.canvas;
    parentBtn.addEventListener('click', this.boundClick);
  }

  setupObservers() {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    // Visibility observer for viewport rendering
    this.visObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const wasVisible = this.isVisible;
        this.isVisible = entry.isIntersecting;
        if (this.isVisible && !wasVisible && !this.rafId && !this.reduceMotion) {
          this.lastTime = performance.now();
          this.rafId = requestAnimationFrame(this.animate);
        }
      });
    }, { threshold: 0.05 });
    this.visObserver.observe(this.canvas);

    // Section observers for state machine
    const workSec = document.getElementById('work');
    const contactSec = document.getElementById('contact');

    this.secObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.id === 'work' && this.state !== 'happy') {
            this.setState('typing-fast');
          } else if (entry.target.id === 'contact' && this.state !== 'happy') {
            this.setState('wave');
          }
        } else {
          if ((entry.target.id === 'work' && this.state === 'typing-fast') ||
              (entry.target.id === 'contact' && this.state === 'wave')) {
            if (this.state !== 'happy') this.setState('idle');
          }
        }
      });
    }, { rootMargin: '-20% 0px -40% 0px' });

    if (workSec) this.secObserver.observe(workSec);
    if (contactSec) this.secObserver.observe(contactSec);
  }

  setState(newState) {
    if (this.state === newState) return;
    this.previousState = this.state;
    this.state = newState;
    if (newState !== 'sleep') {
      this.sleepTimer = 0;
      this.sleepZZ = [];
    }
  }

  onPointerMove(e) {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
    // Wake up immediately upon mouse movement
    if (this.state === 'sleep') {
      this.setState(this.previousState !== 'sleep' ? this.previousState : 'idle');
    }
    this.sleepTimer = 0;
  }

  onClick() {
    this.sleepTimer = 0;
    // Advance quote sequentially
    this.bubbleText = this.quotes[this.quoteIndex % this.quotes.length];
    this.quoteIndex++;
    this.bubbleTimer = 2.4;

    if (this.reduceMotion) {
      this.state = 'happy';
      this.draw();
      setTimeout(() => {
        this.state = 'idle';
        this.draw();
      }, 1500);
      return;
    }

    this.setState('happy');
    this.hopY = -4;
    this.hopVy = -1.2;

    clearTimeout(this.happyTimeout);
    this.happyTimeout = setTimeout(() => {
      if (this.state === 'happy') {
        this.setState(this.previousState !== 'happy' ? this.previousState : 'idle');
      }
    }, 1500);
  }

  scheduleBlink() {
    const delay = 2000 + Math.random() * 3000;
    this.blinkTimeout = setTimeout(() => {
      if (this.state !== 'sleep') {
        this.isBlinking = true;
        setTimeout(() => {
          this.isBlinking = false;
          this.scheduleBlink();
        }, 140);
      } else {
        this.scheduleBlink();
      }
    }, delay);
  }

  update(dt) {
    // 1. Inactivity tracking -> enter sleep after 30s
    this.sleepTimer += dt;
    if (this.sleepTimer >= 30 && this.state !== 'sleep') {
      this.setState('sleep');
    }

    // 2. Head look direction tracking
    const r = this.canvas.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height * 0.45;
    const dx = this.mouseX - cx;
    const dy = this.mouseY - cy;
    this.lookX = Math.max(-2, Math.min(2, Math.round(dx / 120)));
    this.lookY = Math.max(-1, Math.min(1, Math.round(dy / 140)));

    // 3. Typing hand movement
    const typeSpeed = this.state === 'typing-fast' ? 14 : (this.state === 'idle' ? 7 : 0);
    this.typeTimer += dt * typeSpeed;

    // 4. Steam timer
    this.steamTimer += dt * 3;

    // 5. Hop physics for 'happy' state
    if (this.hopY < 0 || this.hopVy !== 0) {
      this.hopY += this.hopVy;
      this.hopVy += 0.25;
      if (this.hopY >= 0) {
        this.hopY = 0;
        this.hopVy = 0;
      }
    }

    // 6. Speech bubble countdown
    if (this.bubbleTimer > 0) {
      this.bubbleTimer -= dt;
    }

    // 7. Sleeping zZ particles
    if (this.state === 'sleep') {
      if (Math.random() < 0.04 && this.sleepZZ.length < 3) {
        this.sleepZZ.push({ x: 44, y: 18, life: 1.0, scale: 0.8 + Math.random() * 0.4 });
      }
      for (let i = this.sleepZZ.length - 1; i >= 0; i--) {
        const p = this.sleepZZ[i];
        p.x += 0.2;
        p.y -= 0.35;
        p.life -= dt * 0.5;
        if (p.life <= 0) this.sleepZZ.splice(i, 1);
      }
    }
  }

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, 80, 80);

    const rect = (x, y, w, h, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
    };

    const pixel = (x, y, color) => {
      ctx.fillStyle = color;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
    };

    // Background circular vignette
    ctx.beginPath();
    ctx.arc(40, 40, 38, 0, Math.PI * 2);
    ctx.fillStyle = PALETTE.CARD;
    ctx.fill();
    ctx.lineWidth = 1;
    ctx.strokeStyle = PALETTE.MIST_DARK;
    ctx.stroke();

    const hy = Math.round(this.hopY);

    // --- 1. Monitor (Left side of desk) ---
    // Monitor screen frame
    rect(8, 28, 22, 28, PALETTE.INK);
    // Screen display (dims in sleep mode)
    const scrColor = this.state === 'sleep' ? PALETTE.INK : PALETTE.DARK_BLUE;
    rect(10, 30, 18, 22, scrColor);
    // Monitor stand
    rect(18, 56, 2, 8, PALETTE.SLATE);
    rect(14, 64, 10, 2, PALETTE.SLATE);

    // Code lines on monitor
    if (this.state !== 'sleep') {
      const shift = Math.floor(this.typeTimer) % 3;
      rect(12, 33, 10, 2, PALETTE.GREEN);
      rect(12, 37, 14, 2, PALETTE.YELLOW);
      rect(14, 41, 8, 2, shift === 0 ? PALETTE.PEACH : PALETTE.GREEN);
      rect(12, 45, 12, 2, PALETTE.MIST_LIGHT);
      rect(12, 49, 6, 2, PALETTE.TERRACOTTA);
    }

    // --- 2. Walnut Wooden Desk ---
    rect(4, 62, 72, 4, PALETTE.MIST_DARK);
    rect(4, 66, 72, 12, PALETTE.INK);
    rect(4, 62, 72, 1, PALETTE.PAPER);

    // --- 3. Coffee Mug (Right side of desk) ---
    rect(62, 53, 7, 9, PALETTE.TERRACOTTA);
    rect(63, 52, 5, 1, PALETTE.TERRACOTTA_DEEP);
    rect(69, 55, 2, 5, PALETTE.TERRACOTTA_DEEP); // Handle
    rect(63, 54, 5, 2, PALETTE.INK); // Dark coffee surface

    // Rising steam
    if (this.state !== 'sleep') {
      const s1 = Math.sin(this.steamTimer) * 1.5;
      const s2 = Math.cos(this.steamTimer * 0.9) * 1.5;
      pixel(64 + s1, 50, PALETTE.MIST_LIGHT);
      pixel(65 + s2, 47, PALETTE.MIST_LIGHT);
      pixel(66 + s1, 44, PALETTE.MIST_LIGHT);
    }

    // --- 4. Developer Upper Body (Enlarged, Plaid Shirt) ---
    const bodyY = 46 + hy;
    // Plaid flannel shirt (#D97757 base with #B5593B grid checks)
    rect(28, bodyY, 24, 17, PALETTE.TERRACOTTA);
    // Vertical checks
    rect(33, bodyY, 2, 17, PALETTE.TERRACOTTA_DEEP);
    rect(39, bodyY, 2, 17, PALETTE.TERRACOTTA_DEEP);
    rect(45, bodyY, 2, 17, PALETTE.TERRACOTTA_DEEP);
    // Horizontal checks
    rect(28, bodyY + 4, 24, 2, PALETTE.TERRACOTTA_DEEP);
    rect(28, bodyY + 10, 24, 2, PALETTE.TERRACOTTA_DEEP);
    // Collar
    pixel(38, bodyY, PALETTE.CARD);
    pixel(39, bodyY + 1, PALETTE.CARD);
    pixel(40, bodyY + 1, PALETTE.CARD);
    pixel(41, bodyY, PALETTE.CARD);

    // --- 5. Enlarged Head & Face (Face width >= 18px) ---
    const headY = 24 + hy + (this.state === 'sleep' ? 2 : 0);
    const headX = 30; // Face spans x: 30 to 49 (20px width!)

    // Neck
    rect(37, headY + 18, 6, 4, PALETTE.SKIN_SHADOW);

    // Hair base & volume
    rect(28, headY, 24, 10, PALETTE.INK);
    rect(29, headY - 3, 22, 5, PALETTE.INK);
    rect(32, headY - 5, 16, 3, PALETTE.INK);

    // Face skin (19px width, 14px height)
    rect( headX, headY + 5, 20, 13, PALETTE.SKIN);
    // Cheek blush / shadow
    pixel(headX + 2, headY + 13, PALETTE.SKIN_SHADOW);
    pixel(headX + 3, headY + 13, PALETTE.SKIN_SHADOW);
    pixel(headX + 16, headY + 13, PALETTE.SKIN_SHADOW);
    pixel(headX + 17, headY + 13, PALETTE.SKIN_SHADOW);

    // --- 6. Sony WH-1000XM Over-Ear Headphones ---
    // Metal headband arch
    rect(27, headY - 4, 26, 3, PALETTE.SLATE);
    rect(26, headY - 1, 3, 5, PALETTE.SLATE);
    rect(51, headY - 1, 3, 5, PALETTE.SLATE);
    // Left earcup with gold ring
    rect(25, headY + 4, 5, 10, PALETTE.INK);
    rect(26, headY + 6, 1, 6, PALETTE.TERRACOTTA);
    // Right earcup with gold ring
    rect(50, headY + 4, 5, 10, PALETTE.INK);
    rect(53, headY + 6, 1, 6, PALETTE.TERRACOTTA);

    // --- 7. Glasses, Eyes & Expression ---
    const eyeOffsetX = (this.state === 'sleep') ? 0 : this.lookX;
    const eyeOffsetY = (this.state === 'sleep') ? 0 : this.lookY;

    if (this.state === 'sleep') {
      // Sleeping eyes (- -)
      rect(34, headY + 10, 4, 1, PALETTE.INK);
      rect(42, headY + 10, 4, 1, PALETTE.INK);
      // Small restful mouth
      pixel(39, headY + 15, PALETTE.TERRACOTTA_DEEP);
      pixel(40, headY + 15, PALETTE.TERRACOTTA_DEEP);
    } else if (this.state === 'happy') {
      // Happy eyes (^ ^)
      pixel(34, headY + 10, PALETTE.INK);
      pixel(35, headY + 9, PALETTE.INK);
      pixel(36, headY + 10, PALETTE.INK);
      pixel(43, headY + 10, PALETTE.INK);
      pixel(44, headY + 9, PALETTE.INK);
      pixel(45, headY + 10, PALETTE.INK);
      // Happy smile
      rect(38, headY + 14, 4, 2, PALETTE.TERRACOTTA_DEEP);
      rect(39, headY + 15, 2, 1, PALETTE.PEACH);
    } else {
      // Normal / Fast Typing / Waving eyes with wireframe glasses
      // Glasses frames (#8DA2B6)
      rect(33, headY + 8, 6, 5, PALETTE.SLATE);
      rect(34, headY + 9, 4, 3, PALETTE.SKIN);
      rect(41, headY + 8, 6, 5, PALETTE.SLATE);
      rect(42, headY + 9, 4, 3, PALETTE.SKIN);
      rect(39, headY + 9, 2, 1, PALETTE.SLATE); // Bridge

      // Eyes (blinking support)
      if (this.isBlinking) {
        rect(34 + eyeOffsetX, headY + 10, 4, 1, PALETTE.INK);
        rect(42 + eyeOffsetX, headY + 10, 4, 1, PALETTE.INK);
      } else {
        rect(35 + eyeOffsetX, headY + 10 + eyeOffsetY, 2, 2, PALETTE.INK);
        rect(43 + eyeOffsetX, headY + 10 + eyeOffsetY, 2, 2, PALETTE.INK);
        // Catchlight
        pixel(35 + eyeOffsetX, headY + 10 + eyeOffsetY, PALETTE.CARD);
        pixel(43 + eyeOffsetX, headY + 10 + eyeOffsetY, PALETTE.CARD);
      }
      // Smile
      rect(38, headY + 15, 4, 1, PALETTE.TERRACOTTA_DEEP);
    }

    // --- 8. Keyboard & Hands ---
    // Keyboard
    rect(32, 59, 16, 4, PALETTE.DARK_BLUE);
    rect(33, 60, 14, 1, PALETTE.MIST_LIGHT);

    // Hands depending on state
    if (this.state === 'wave') {
      // Left hand on desk
      rect(32, 58, 4, 3, PALETTE.SKIN);
      // Right hand waving high!
      const waveOffset = Math.sin(this.steamTimer * 2) * 2;
      rect(52, 38 + waveOffset, 4, 6, PALETTE.TERRACOTTA);
      rect(52, 34 + waveOffset, 4, 4, PALETTE.SKIN);
      pixel(54, 32 + waveOffset, PALETTE.SKIN); // Thumbs up
    } else if (this.state === 'sleep') {
      // Hands resting on desk
      rect(33, 58, 5, 3, PALETTE.SKIN);
      rect(42, 58, 5, 3, PALETTE.SKIN);
    } else {
      // Typing hands (active alternation)
      const alt = Math.floor(this.typeTimer) % 2;
      rect(33, 57 + alt, 4, 3, PALETTE.SKIN);
      rect(43, 58 - alt, 4, 3, PALETTE.SKIN);
    }

    // --- 9. Floating 'zZ' when in sleep mode ---
    if (this.state === 'sleep') {
      for (const p of this.sleepZZ) {
        ctx.fillStyle = PALETTE.SLATE;
        ctx.font = '700 9px monospace';
        ctx.fillText('z', Math.round(p.x), Math.round(p.y));
      }
    }

    // --- 10. Speech Bubble (Quotes & Slogans) ---
    if (this.bubbleTimer > 0 && this.bubbleText) {
      const text = this.bubbleText;
      const charW = 4;
      const totalW = text.length * charW - 1;
      const bw = Math.max(26, totalW + 8);
      const bx = Math.round(40 - bw / 2);
      const by = 4;

      // Bubble background & frame
      rect(bx, by, bw, 10, PALETTE.INK);
      rect(bx + 1, by + 1, bw - 2, 8, PALETTE.CARD);
      // Pointer tail
      pixel(39, by + 10, PALETTE.INK);
      pixel(40, by + 10, PALETTE.INK);
      pixel(40, by + 11, PALETTE.INK);

      // Render 3x5 font text
      const startX = bx + Math.round((bw - totalW) / 2);
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const rows = GLYPHS[char] || GLYPHS[' '];
        const cx = startX + i * charW;
        for (let r = 0; r < 5; r++) {
          const rowVal = rows[r];
          if ((rowVal & 0b100) !== 0) pixel(cx, by + 2 + r, PALETTE.TERRACOTTA_DEEP);
          if ((rowVal & 0b010) !== 0) pixel(cx + 1, by + 2 + r, PALETTE.TERRACOTTA_DEEP);
          if ((rowVal & 0b001) !== 0) pixel(cx + 2, by + 2 + r, PALETTE.TERRACOTTA_DEEP);
        }
      }
    }
  }

  animate(currentTime) {
    if (!this.isVisible) {
      this.rafId = null;
      return;
    }
    const dt = Math.min(0.1, (currentTime - this.lastTime) / 1000);
    this.lastTime = currentTime;

    this.update(dt);
    this.draw();

    this.rafId = requestAnimationFrame(this.animate);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    clearTimeout(this.blinkTimeout);
    clearTimeout(this.happyTimeout);

    window.removeEventListener('pointermove', this.boundPointerMove);
    window.removeEventListener('resize', this.boundResize);

    const parentBtn = this.canvas.closest('#doll') || this.canvas;
    parentBtn.removeEventListener('click', this.boundClick);

    if (this.visObserver) this.visObserver.disconnect();
    if (this.secObserver) this.secObserver.disconnect();
  }
}
