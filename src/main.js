// Lyu Bingrong (YOIMIYA66) Career Portal Scripts
// Literary Paper Magazine Layout & Dynamic Desk-Lamp Shadow Interaction

(function () {
  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------- 1. 语言切换 ---------- */
  function markLang(l) {
    document.querySelectorAll('[data-set-lang]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.dataset.setLang === l));
    });
  }

  document.querySelectorAll('[data-set-lang]').forEach(b => {
    b.addEventListener('click', () => {
      const l = b.dataset.setLang;
      root.setAttribute('data-lang', l);
      root.lang = l === 'zh' ? 'zh-CN' : 'en';
      markLang(l);
      try { localStorage.setItem('rz-lang', l); } catch (e) {}
    });
  });

  // 读取已存语言
  const initialLang = root.getAttribute('data-lang') || 'zh';
  markLang(initialLang);

  /* ---------- 2. 复制文本 ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy;
      function done() {
        btn.classList.add('copied');
        const note = btn.querySelector('.note') || btn;
        const keep = note.innerHTML;
        note.innerHTML = '<span class="zh">已复制</span><span class="en">copied</span>';
        setTimeout(() => {
          btn.classList.remove('copied');
          note.innerHTML = keep;
        }, 1600);
      }
      function fallback() {
        const r = document.createRange();
        r.selectNodeContents(btn.querySelector('.addr') || btn);
        const s = getSelection();
        s.removeAllRanges();
        s.addRange(r);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done, fallback);
      } else {
        fallback();
      }
    });
  });

  /* ---------- 3. 台灯与动态阴影：鼠标处更亮，纸偶和卡纸的影子往远离鼠标的方向落 ---------- */
  const lamp = document.querySelector('.lamp');
  const lit = Array.prototype.slice.call(document.querySelectorAll('.lit, .term, .doll, .stage, .like-badge-btn'));
  let light = null;
  let lightQueued = false;

  function shade() {
    lightQueued = false;
    if (!light || !lamp) return;
    lamp.style.setProperty('--mx', light.x + 'px');
    lamp.style.setProperty('--my', light.y + 'px');
    const vh = window.innerHeight;
    lit.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      const dx = (r.left + r.width / 2) - light.x;
      const dy = (r.top + r.height * 0.45) - light.y;
      const len = Math.max(1, Math.hypot(dx, dy));
      const s = Math.min(22, 5 + len / 50);
      el.style.setProperty('--sx', (dx / len * s).toFixed(1) + 'px');
      el.style.setProperty('--sy', (dy / len * s).toFixed(1) + 'px');
    });
  }

  function aim(x, y) {
    if (reduce.matches) return;
    light = { x, y };
    if (!lightQueued) {
      lightQueued = true;
      requestAnimationFrame(shade);
    }
  }

  window.addEventListener('pointermove', e => aim(e.clientX, e.clientY), { passive: true });
  window.addEventListener('scroll', () => { if (light) aim(light.x, light.y); }, { passive: true });

  /* ---------- 4. 像素风桌宠伴侣 (致敬 Clawd on Desk 像素艺术) ---------- */
  const pixelCanvas = document.getElementById('pixel-canvas');
  if (pixelCanvas) {
    import('./pixel-companion.js').then(({ PixelCompanion }) => {
      window.pixelCompanion = new PixelCompanion(pixelCanvas);
    }).catch(err => {
      console.warn('Pixel companion load fallback:', err);
    });
  }

  /* ---------- 4b. 展台轻 3D 倾斜：跟随鼠标微微转动 ---------- */
  const stage = document.querySelector('.stage');
  if (stage && !reduce.matches) {
    let tiltQueued = false;
    let tp = null;
    function tilt() {
      tiltQueued = false;
      if (!tp) return;
      const r = stage.getBoundingClientRect();
      const nx = Math.max(-1, Math.min(1, (tp.x - (r.left + r.width / 2)) / (r.width * 1.2)));
      const ny = Math.max(-1, Math.min(1, (tp.y - (r.top + r.height / 2)) / (r.height * 1.2)));
      stage.style.setProperty('--ty', (nx * 7).toFixed(2) + 'deg');
      stage.style.setProperty('--tx', (-ny * 5).toFixed(2) + 'deg');
    }
    window.addEventListener('pointermove', e => {
      tp = { x: e.clientX, y: e.clientY };
      if (!tiltQueued) { tiltQueued = true; requestAnimationFrame(tilt); }
    }, { passive: true });
  }

  /* ---------- 5. 版权页彩蛋：16-Bit 像素点赞徽章 ---------- */
  const egg = document.getElementById('egg');
  const likeBtn = document.getElementById('like-badge');
  const likeCountEl = document.getElementById('like-count');
  const tooltipZh = document.getElementById('like-tooltip-zh');
  const tooltipEn = document.getElementById('like-tooltip-en');

  if (egg && likeBtn && likeCountEl) {
    let likes = parseInt(localStorage.getItem('yoimiya_likes') || '66', 10);
    likeCountEl.textContent = likes;

    // 趣味开发者感谢短语库（双语对应，纯粹赞赏与激励，不重复显示总数字）
    const THANK_MESSAGES = [
      { zh: '感谢你的认可与支持！♥', en: 'Thank you for your support! ♥' },
      { zh: '收到一份鼓励，更有动力了！✨', en: 'Energy recharged! Thanks for the boost! ✨' },
      { zh: '谢谢！祝你今天也是 Bug-free 的一天 ✦', en: 'Thanks! Wishing you a bug-free day ✦' },
      { zh: '收到点赞！系统状态全绿 🚀', en: 'Like received! All systems operational 🚀' },
      { zh: '小吕干劲满满，继续潜心 coding 啦！☕', en: 'Fuel acquired! Lyu is heading back to code ☕' }
    ];
    let msgIndex = 0;
    let tooltipTimer = null;

    function resetTooltip() {
      egg.classList.remove('show-tooltip');
    }

    function spawnFloatingSparkles() {
      // 1. 主跳字 +1 ♥
      const spark = document.createElement('span');
      spark.className = 'like-spark';
      spark.textContent = '+1 ♥';
      const offset = (Math.random() - 0.5) * 16;
      spark.style.setProperty('--dx', `${offset}px`);
      spark.style.right = '24px';
      spark.style.bottom = '18px';
      egg.appendChild(spark);
      setTimeout(() => spark.remove(), 900);

      // 2. 伴随爆发的 16-Bit 彩色微星/火花粒子 (✦, ★, ♥)
      const stars = [
        { char: '✦', color: '#EA580C' },
        { char: '★', color: '#F59E0B' },
        { char: '♥', color: '#DC2626' }
      ];
      stars.forEach((s, idx) => {
        const star = document.createElement('span');
        star.className = 'like-mini-star';
        star.textContent = s.char;
        star.style.color = s.color;
        const sx = (idx - 1) * 14 + (Math.random() - 0.5) * 8;
        const sy = -18 - Math.random() * 14;
        const rot = (Math.random() - 0.5) * 45;
        star.style.setProperty('--sx', `${sx}px`);
        star.style.setProperty('--sy', `${sy}px`);
        star.style.setProperty('--sr', `${rot}deg`);
        star.style.right = '32px';
        star.style.bottom = '18px';
        egg.appendChild(star);
        setTimeout(() => star.remove(), 800);
      });
    }

    likeBtn.addEventListener('click', () => {
      likes++;
      localStorage.setItem('yoimiya_likes', likes);
      likeCountEl.textContent = likes;

      // 1. 按钮弹性微跳动与心跳重触发
      likeBtn.classList.remove('popped');
      void likeBtn.offsetWidth; // trigger reflow
      likeBtn.classList.add('popped');
      setTimeout(() => {
        likeBtn.classList.remove('popped');
      }, 400);

      // 2. 街机像素飞字 + 彩色星芒粒子
      spawnFloatingSparkles();

      // 3. 弹出双语感谢气泡（保留多语言 DOM 节点，互不影响）
      const item = THANK_MESSAGES[msgIndex % THANK_MESSAGES.length];
      msgIndex++;
      if (tooltipZh) tooltipZh.textContent = item.zh;
      if (tooltipEn) tooltipEn.textContent = item.en;

      egg.classList.add('show-tooltip');
      clearTimeout(tooltipTimer);
      tooltipTimer = setTimeout(() => {
        resetTooltip();
      }, 2500);
    });
  }

  /* ---------- 6. 悬浮回到顶部按钮 ---------- */
  const backTop = document.getElementById('back-top');
  if (backTop) {
    let scrollQueued = false;
    function checkScroll() {
      scrollQueued = false;
      if (window.scrollY > 420) {
        backTop.classList.add('show');
      } else {
        backTop.classList.remove('show');
      }
    }
    window.addEventListener('scroll', () => {
      if (!scrollQueued) {
        scrollQueued = true;
        requestAnimationFrame(checkScroll);
      }
    }, { passive: true });
    backTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();
