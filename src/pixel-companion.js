// Lyu Bingrong (YOIMIYA66) Custom Pixel Art Companion & Diorama
// 100% Authentic 16-bit Pixel Art: Developer in iconic Orange Plaid Flannel Shirt & Glasses,
// seated at a developer workstation desk, actively coding on a glowing monitor with animated typing!

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
    this.typeTimer = 0;
    this.steamTick = 0;
    this.particles = [];
    this.bubbleText = 'IN FLOW';
    this.bubbleTimer = 0;
    this.quoteIndex = 0;
    this.starTick = 0;

    // Meaningful engineering & career slogans
    this.quotes = [
      'NO TOYS',   // 不制造脆弱玩具，交付真实生产力（工作信条）
      'TRUTH✓',    // 实事求是，用严密指标度量模型边界
      '6.5K★',     // Clawd on Desk 核心维护项目 6,500+ stars
      'FACTS✓',    // 知行合一，实事求是
      'EVAL AI',   // 智源 BAAI 大模型安全评测与红队
      'READY!'     // 已毕业，随时支持线上面试与快速到岗
    ];

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
    // Slight chair bounce on sprint
    this.hopVy = -1.8;
    this.isHappy = true;
    
    // Cycle through meaningful developer slogans sequentially
    this.bubbleText = this.quotes[this.quoteIndex % this.quotes.length];
    this.quoteIndex++;
    this.bubbleTimer = 2.4;

    setTimeout(() => {
      this.isHappy = false;
    }, 1400);

    // Burst 16-bit glowing particle sparks from workstation (terracotta orange, cyan, gold, green)
    const colors = ['#EA580C', '#38BDF8', '#4ADE80', '#F59E0B', '#FDBA74', '#FDE047'];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const speed = 1.0 + Math.random() * 1.4;
      this.particles.push({
        x: 52 + (Math.random() - 0.5) * 6,
        y: 35,
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

    this.lookX = dx > 50 ? 1 : (dx < -50 ? -1 : 0);
    this.lookY = dy > 35 ? 1 : (dy < -35 ? -1 : 0);

    // 2. Chair cushion bounce physics
    if (this.hopY < 0 || this.hopVy !== 0) {
      this.hopY += this.hopVy;
      this.hopVy += 0.28; // gravity
      if (this.hopY < -3.5) {
        this.hopY = -3.5;
        this.hopVy = 0;
      }
      if (this.hopY >= 0) {
        this.hopY = 0;
        this.hopVy = 0;
      }
    }

    // 3. Timers
    this.breathTimer += dt * 2.8;
    this.codeTimer += dt * 7.0;
    this.typeTimer += dt * (this.isHappy ? 22.0 : 9.5);
    this.steamTick += dt * 3.2;
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
        // Retro sky: warm oatmeal tone
        rect(leftX, y, width, 1, '#E9E2D4');
      } else if (y === groundY) {
        // Horizon line: warm dark ink
        rect(leftX, y, width, 1, '#1F1E1D');
      } else {
        // Ground floor: soft textured card tone
        rect(leftX, y, width, 1, '#DCCFB9');
      }

      // Stepped 1-pixel dark rim outline on the perimeter
      pixel(leftX, y, '#1F1E1D');
      pixel(rightX, y, '#1F1E1D');
    }

    // Top & bottom cap pixels for the circle
    pixel(cx, 4, '#1F1E1D');
    pixel(cx - 1, 4, '#1F1E1D');
    pixel(cx + 1, 4, '#1F1E1D');
    pixel(cx, 76, '#1F1E1D');
    pixel(cx - 1, 76, '#1F1E1D');
    pixel(cx + 1, 76, '#1F1E1D');

    // Subtle twinkling 16-bit sky stars inside aperture
    const starBlink = Math.sin(this.starTick) > 0;
    if (starBlink) {
      pixel(20, 16, '#FFFDF8');
      pixel(21, 16, '#E2E8F0');
      pixel(58, 18, '#FFFDF8');
      pixel(57, 18, '#E2E8F0');
    } else {
      pixel(20, 16, '#94A3B8');
      pixel(58, 18, '#94A3B8');
    }

    // Idle breathing & slight bounce offsets
    const breath = Math.sin(this.breathTimer) > 0.45 ? 1 : 0;
    const curHop = Math.round(this.hopY);
    const baseY = curHop;
    const bodyY = baseY - breath;

    // --- 2. Ground Hatch Shadows ---
    // Chair shadow
    rect(22, 63, 14, 2, 'rgba(31, 30, 29, 0.22)');
    // Developer shoes shadow
    rect(36, 63, 9, 2, 'rgba(31, 30, 29, 0.22)');
    // Desk feet shadow
    rect(52, 63, 6, 2, 'rgba(31, 30, 29, 0.22)');
    rect(64, 63, 6, 2, 'rgba(31, 30, 29, 0.22)');

    // --- 3. Ergonomic Office Chair (Behind Seated Developer) ---
    // Headrest
    rect(21, 28 + bodyY, 5, 4, '#151922');
    rect(22, 29 + bodyY, 3, 2, '#2D3748');
    // Backrest spine
    rect(23, 32 + bodyY, 2, 17, '#0F172A');
    // Ergonomic curved mesh backrest
    rect(20, 34 + bodyY, 5, 14, '#1E2430');
    rect(21, 35 + bodyY, 3, 12, '#2D3748');
    pixel(22, 37 + bodyY, '#475569'); // Backrest mesh specular
    pixel(22, 42 + bodyY, '#475569');
    // Chair seat cushion
    rect(22, 49 + bodyY, 15, 3, '#1E2430');
    rect(23, 50 + bodyY, 13, 1, '#2D3748');
    // Chair gas-lift central stem
    rect(28, 52, 3, 9, '#334155');
    pixel(29, 54, '#64748B');
    // Chair 5-star wheeled base on floor
    rect(23, 60, 13, 2, '#1E293B');
    rect(22, 61, 3, 2, '#0F172A'); // Left caster
    rect(34, 61, 3, 2, '#0F172A'); // Right caster

    // --- 4. Seated Developer: Lower Body & Jeans ---
    // Comfortable dark indigo denim jeans (programmer casual style)
    rect(25, 47 + bodyY, 13, 5, '#1E293B');
    rect(27, 48 + bodyY, 9, 2, '#334155'); // Denim wash highlight
    pixel(31, 49 + bodyY, '#475569');
    // Vertical lower legs extending down to floor
    rect(35, 52 + bodyY, 6, 9, '#1E293B');
    rect(36, 53 + bodyY, 4, 7, '#334155');
    // Retro Programmer Sneakers (White base with orange accent stripe)
    rect(36, 60, 8, 3, '#F8FAFC'); // Clean white leather
    rect(36, 62, 8, 1, '#94A3B8'); // Sneaker rubber sole
    rect(38, 60, 4, 1, '#EA580C'); // Terracotta orange retro side stripe
    pixel(43, 61, '#CBD5E1');

    // --- 5. Developer Workstation Desk (Surface & Legs) ---
    // Desk Top (Warm Walnut Surface with Light Bevel)
    rect(42, 49, 27, 3, '#4A3425');
    rect(42, 49, 27, 1, '#8D6E63'); // Warm top highlight
    rect(42, 51, 27, 1, '#2E1F16'); // Dark lower edge
    // Left desk support post with foot pad
    rect(54, 52, 2, 11, '#2D3748');
    rect(53, 62, 4, 1, '#10141D');
    // Right desk leg with foot pad
    rect(65, 52, 3, 11, '#2D3748');
    rect(64, 62, 5, 1, '#10141D'); // Foot pad

    // --- 6. Developer Torso: Iconic Orange Plaid Flannel Shirt (橘色格子衫) ---
    // Base Shirt Body
    rect(26, 35 + bodyY, 13, 13, '#10141D'); // Outer outline
    rect(27, 36 + bodyY, 11, 11, '#EA580C'); // Primary warm pumpkin orange

    // Dark Russet / Charcoal Plaid Grid Checks (深色格子交错线)
    // Vertical check stripes
    rect(29, 36 + bodyY, 1, 11, '#7C2D12');
    rect(34, 36 + bodyY, 1, 11, '#431407'); // Central button placket
    // Horizontal check stripes
    rect(27, 38 + bodyY, 11, 1, '#7C2D12');
    rect(27, 42 + bodyY, 11, 1, '#7C2D12');
    rect(27, 45 + bodyY, 11, 1, '#7C2D12');

    // Warm Cream Yellow Accent Checks (浅米暖黄细格线，形成丰富层次)
    rect(31, 36 + bodyY, 1, 11, '#FED7AA');
    rect(36, 36 + bodyY, 1, 11, '#FED7AA');
    rect(27, 40 + bodyY, 11, 1, '#FDBA74');
    rect(27, 44 + bodyY, 11, 1, '#FDBA74');

    // Plaid Intersections (网格交差点呈现浓郁红棕)
    pixel(29, 38 + bodyY, '#431407');
    pixel(29, 42 + bodyY, '#431407');
    pixel(29, 45 + bodyY, '#431407');
    pixel(34, 38 + bodyY, '#1F1E1D');
    pixel(34, 42 + bodyY, '#1F1E1D');
    pixel(34, 45 + bodyY, '#1F1E1D');

    // Comfortable Inner Dark Tee Collar showing at neckline
    rect(32, 35 + bodyY, 4, 2, '#1E293B');
    pixel(33, 36 + bodyY, '#334155');

    // Shirt Placket Buttons (白米色微纽扣)
    pixel(34, 39 + bodyY, '#FFFDF8');
    pixel(34, 43 + bodyY, '#FFFDF8');

    // Plaid Chest Pocket (左胸贴袋)
    rect(27, 40 + bodyY, 3, 3, '#C2410C');
    pixel(28, 40 + bodyY, '#FDBA74');

    // --- 7. Head, Face, Hair & Glasses (ID Photo Likeness) ---
    const headY = bodyY;
    // Neck
    rect(32, 33 + headY, 5, 3, '#F5AF8B');

    // Face Shape & Contour
    rect(28, 19 + headY, 16, 15, '#151821'); // Contour outline
    rect(29, 20 + headY, 14, 13, '#FCD5B5');
    rect(30, 19 + headY, 12, 15, '#FCD5B5');
    rect(32, 32 + headY, 8, 1, '#F6B28B'); // Chin definition

    // Subtle Natural Blush
    rect(29, 28 + headY, 2, 2, '#F4978E');
    rect(41, 28 + headY, 2, 2, '#F4978E');

    // Thick Defined Dark Eyebrows
    rect(31, 22 + headY, 4, 2, '#151821');
    rect(37, 22 + headY, 4, 2, '#151821');

    // Eyes Behind Glasses
    if (this.isBlinking) {
      rect(32, 26 + headY, 3, 1, '#151821');
      rect(38, 26 + headY, 3, 1, '#151821');
    } else if (this.isHappy) {
      // Cheerful squinting eyes
      pixel(31, 26 + headY, '#151821');
      rect(32, 25 + headY, 2, 1, '#151821');
      pixel(34, 26 + headY, '#151821');

      pixel(37, 26 + headY, '#151821');
      rect(38, 25 + headY, 2, 1, '#151821');
      pixel(40, 26 + headY, '#151821');
    } else {
      rect(31, 25 + headY, 4, 3, '#FFFDF8');
      rect(37, 25 + headY, 4, 3, '#FFFDF8');

      // Pupils: gaze naturally focused on the screen, tracking mouse
      const pxOffset = this.lookX < 0 ? 0 : 1;
      const pxL = 32 + pxOffset;
      const py = 25 + headY + (this.lookY > 0 ? 1 : 0);
      const pxR = 38 + pxOffset;

      rect(pxL, py, 2, 3, '#151821');
      rect(pxR, py, 2, 3, '#151821');
      pixel(pxL, py, '#FFFDF8'); // Specular catchlight
      pixel(pxR, py, '#FFFDF8');
    }

    // Sleek Silver Wireframe Glasses
    rect(30, 24 + headY, 5, 5, '#94A3B8');
    rect(31, 25 + headY, 3, 3, 'rgba(186, 230, 253, 0.4)');
    rect(37, 24 + headY, 5, 5, '#94A3B8');
    rect(38, 25 + headY, 3, 3, 'rgba(186, 230, 253, 0.4)');
    rect(35, 26 + headY, 2, 1, '#CBD5E1'); // Silver bridge
    pixel(31, 24 + headY, '#FFFFFF'); // Corner shine
    pixel(38, 24 + headY, '#FFFFFF');

    // Focused Smile
    if (this.isHappy) {
      rect(33, 29 + headY, 5, 3, '#151821');
      rect(34, 30 + headY, 3, 2, '#EF4444');
      pixel(35, 30 + headY, '#FFFDF8');
    } else {
      rect(34, 30 + headY, 3, 1, '#B91C1C');
      pixel(36, 29 + headY, '#B91C1C');
    }

    // Neat Short Haircut with Forward Fringe
    rect(27, 15 + headY, 18, 5, '#151821');
    rect(29, 13 + headY, 14, 3, '#151821');
    rect(32, 12 + headY, 8, 2, '#151821');
    rect(27, 19 + headY, 2, 6, '#151821'); // Left sideburn
    rect(43, 19 + headY, 2, 6, '#151821'); // Right sideburn
    rect(32, 14 + headY, 7, 2, '#2D3748'); // Crown highlight
    // Fringe bangs
    rect(29, 19 + headY, 3, 2, '#151821');
    rect(34, 19 + headY, 3, 2, '#151821');
    rect(39, 19 + headY, 3, 2, '#151821');

    // --- 8. Arms & Keyboard Typing (Matching Orange Plaid Sleeves) ---
    // Upper arm in orange plaid flannel
    rect(34, 41 + bodyY, 7, 4, '#10141D');
    rect(35, 41 + bodyY, 6, 4, '#EA580C');
    pixel(37, 41 + bodyY, '#7C2D12'); // Plaid line
    pixel(39, 42 + bodyY, '#FDBA74');
    pixel(36, 43 + bodyY, '#7C2D12');

    // Rolled-up sleeve cuff
    rect(40, 44 + bodyY, 3, 3, '#C2410C');
    pixel(41, 44 + bodyY, '#FED7AA');

    // Keyboard on desk
    rect(44, 48, 9, 2, '#1E293B');
    // Keyboard keycap pattern
    pixel(45, 48, '#64748B');
    pixel(47, 48, '#64748B');
    pixel(49, 48, '#64748B');
    pixel(51, 48, '#64748B');

    // Animated hands actively tapping keys
    const typeTick = Math.floor(this.typeTimer) % 2;
    const leftHandY = 46 + bodyY + (typeTick === 0 ? 0 : 1);
    const rightHandY = 46 + bodyY + (typeTick === 1 ? 0 : 1);
    rect(43, leftHandY, 3, 2, '#FCD5B5');
    rect(47, rightHandY, 3, 2, '#FCD5B5');
    pixel(44, leftHandY, '#F6B28B'); // Knuckle shadow
    pixel(48, rightHandY, '#F6B28B');

    // --- 9. Workstation Coding Monitor with Live Terminal ---
    // Monitor Stand
    rect(56, 47, 6, 2, '#334155');
    rect(58, 41, 2, 6, '#475569');

    // Monitor Outer Bezel (Sleek dark finish)
    rect(52, 24, 18, 17, '#0F172A');
    rect(53, 25, 16, 15, '#1E293B'); // Bezel rim
    // Monitor Active Screen (Deep terminal background)
    rect(54, 26, 14, 13, '#020617');

    // Streaming Terminal Code Lines
    const codeTick = Math.floor(this.codeTimer) % 4;
    // Line 1: Cyan terminal prompt "❯ agent"
    pixel(55, 27, '#38BDF8');
    rect(57, 27, 7, 1, '#38BDF8');
    // Line 2: Emerald green active logic / tests
    rect(55, 29, 11, 1, '#4ADE80');
    // Line 3: Function / syntax highlighting
    rect(56, 31, 8, 1, '#818CF8');
    // Line 4: Code block / evaluation
    if (codeTick % 2 === 0) {
      rect(55, 33, 9, 1, '#F59E0B');
    } else {
      rect(55, 33, 10, 1, '#38BDF8');
    }
    // Line 5: Passing status
    rect(56, 35, 6, 1, '#34D399');

    // Flashing Caret Cursor
    const cursorBlink = Math.floor(this.codeTimer * 2) % 2 === 0;
    if (cursorBlink) {
      pixel(55 + (codeTick % 5) * 2, 37, '#FDE047');
    }

    // Monitor Power LED
    pixel(68, 40, '#10B981');

    // Soft Ambient Light Glow on Desk
    rect(52, 49, 14, 1, 'rgba(56, 189, 248, 0.28)');

    // --- 10. Warm Steaming Coffee Mug (Essential Dev Detail) ---
    // Terracotta ceramic mug
    rect(65, 45, 3, 4, '#D97757');
    rect(65, 45, 3, 1, '#FAF9F5'); // Ceramic rim
    pixel(64, 46, '#B5593B'); // Handle
    pixel(64, 47, '#B5593B');

    // Animated rising steam
    const steamWave = Math.sin(this.steamTick);
    const steamX = 66 + (steamWave > 0 ? 1 : 0);
    pixel(steamX, 43, 'rgba(250, 249, 245, 0.7)');
    pixel(66 + (steamWave < -0.2 ? -1 : 0), 41, 'rgba(250, 249, 245, 0.45)');
    pixel(steamX, 39, 'rgba(250, 249, 245, 0.25)');

    // --- 11. Interactive Speech Bubble (Fitted comfortably inside upper circle arc) ---
    const showBubble = (this.isHovered && !this.isHappy) || this.bubbleTimer > 0;
    const textToShow = this.bubbleTimer > 0 ? this.bubbleText : (this.isHovered ? 'IN FLOW' : '');
    if (showBubble && textToShow) {
      const charWidth = 4;
      const totalTextW = textToShow.length * charWidth - 1;
      const bubbleW = Math.max(24, totalTextW + 6);
      const bubbleX = Math.round(cx - bubbleW / 2);
      const bubbleY = 11; // Comfortable vertical fit inside upper circle

      // Bubble outline & fill
      rect(bubbleX, bubbleY, bubbleW, 9, '#151821');
      rect(bubbleX + 1, bubbleY + 1, bubbleW - 2, 7, '#FFFDF8');
      // Bubble tail pointing down to head
      rect(39, bubbleY + 9, 3, 1, '#151821');
      rect(40, bubbleY + 10, 2, 1, '#151821');

      // Full 3x5 Pixel Font Dictionary (Comprehensive A-Z, 0-9 & Symbols)
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
        '.': [0b000, 0b000, 0b000, 0b000, 0b010],
        '-': [0b000, 0b000, 0b111, 0b000, 0b000],
        '+': [0b000, 0b010, 0b111, 0b010, 0b000],
        '★': [0b010, 0b111, 0b010, 0b101, 0b000],
        '✓': [0b000, 0b001, 0b001, 0b101, 0b010],
        '&': [0b010, 0b101, 0b010, 0b101, 0b011],
        ' ': [0b000, 0b000, 0b000, 0b000, 0b000]
      };

      const startX = bubbleX + Math.round((bubbleW - totalTextW) / 2);
      for (let i = 0; i < textToShow.length; i++) {
        const char = textToShow[i].toUpperCase();
        const rows = GLYPHS[char] || GLYPHS[' '];
        const scx = startX + i * charWidth;
        const color = (char === '★' || char === '✓') ? '#EA580C' : (char === '!' ? '#2563EB' : '#151821');
        for (let r = 0; r < 5; r++) {
          const rowVal = rows[r];
          if ((rowVal & 0b100) !== 0) pixel(scx, bubbleY + 2 + r, color);
          if ((rowVal & 0b010) !== 0) pixel(scx + 1, bubbleY + 2 + r, color);
          if ((rowVal & 0b001) !== 0) pixel(scx + 2, bubbleY + 2 + r, color);
        }
      }
    }

    // --- 12. Particle Sparks on Click (Contained in Circle) ---
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
