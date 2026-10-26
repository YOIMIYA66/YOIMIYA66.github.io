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
  const lit = Array.prototype.slice.call(document.querySelectorAll('.lit, .term, .doll, .stage, .pinwheel'));
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

  /* ---------- 4. 纸偶伙伴互动：跟随鼠标倾斜转头、自然眨眼、点击欢呼起跳 ---------- */
  const doll = document.getElementById('doll');
  if (doll) {
    const eyeOpen = doll.querySelectorAll('.eye-open');
    const eyeClosed = doll.querySelectorAll('.eye-closed');
    const mouthRest = doll.querySelector('.mouth-rest');
    const mouthHappy = doll.querySelector('.mouth-happy');
    let curAngle = 0;
    let targetAngle = 0;
    let hopping = false;

    window.addEventListener('pointermove', e => {
      if (reduce.matches) return;
      const r = doll.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const u = Math.tanh((e.clientX - cx) / (r.width * 0.7));
      targetAngle = u * 10;
    }, { passive: true });

    function tickDoll() {
      if (!reduce.matches) {
        curAngle += (targetAngle - curAngle) * 0.08;
        doll.style.setProperty('--a-head', curAngle.toFixed(2) + 'deg');
        doll.style.setProperty('--a-pet', (-curAngle * 0.4).toFixed(2) + 'deg');
      }
      requestAnimationFrame(tickDoll);
    }
    requestAnimationFrame(tickDoll);

    // 随机眨眼
    function blink() {
      if (hopping) return scheduleBlink();
      eyeOpen.forEach(el => el.style.display = 'none');
      eyeClosed.forEach(el => el.style.display = 'block');
      setTimeout(() => {
        eyeOpen.forEach(el => el.style.display = 'block');
        eyeClosed.forEach(el => el.style.display = 'none');
        scheduleBlink();
      }, 140);
    }
    function scheduleBlink() {
      setTimeout(blink, 2400 + Math.random() * 3600);
    }
    scheduleBlink();

    // 点击起跳
    doll.addEventListener('click', () => {
      hopping = true;
      if (mouthRest) mouthRest.style.display = 'none';
      if (mouthHappy) mouthHappy.style.display = 'block';
      if (!reduce.matches) {
        doll.classList.remove('hop');
        void doll.offsetWidth;
        doll.classList.add('hop');
      }
      setTimeout(() => {
        hopping = false;
        if (mouthRest) mouthRest.style.display = 'block';
        if (mouthHappy) mouthHappy.style.display = 'none';
      }, 1200);
    });
  }

  /* ---------- 5. 版权页彩蛋：纸风车（吹气加速、角速度物理衰减） ---------- */
  const egg = document.getElementById('egg');
  const pinwheel = document.getElementById('pinwheel');
  if (egg && pinwheel) {
    const bladeGroup = pinwheel.querySelector('.pw-blade-group');
    const base = reduce.matches ? 0 : 38;
    let w = base;
    let a = 0;
    let on = false;
    let last = 0;
    let prev = null;
    let seen = false;

    function tickPw(t) {
      if (!on) return;
      const dt = last ? Math.min(0.05, (t - last) / 1000) : 0.016;
      last = t;
      w = base + (w - base) * Math.exp(-dt / 1.4);
      a = (a + w * dt) % 360;
      if (bladeGroup) bladeGroup.style.setProperty('--pw-a', a.toFixed(2) + 'deg');
      requestAnimationFrame(tickPw);
    }

    function run() {
      if (!on) {
        on = true;
        last = 0;
        requestAnimationFrame(tickPw);
      }
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => {
        if (es[0].isIntersecting) {
          if (!seen) {
            seen = true;
            egg.classList.add('up');
            if (!reduce.matches) w = 560;
          }
          run();
        } else {
          on = false;
        }
      }, { threshold: 0.3 }).observe(egg);
    } else {
      egg.classList.add('up');
      run();
    }

    window.addEventListener('pointermove', e => {
      const t = performance.now();
      if (on && prev && t - prev.t < 150) {
        const r = pinwheel.getBoundingClientRect();
        const R = r.width / 2;
        const rx = e.clientX - (r.left + R);
        const ry = e.clientY - (r.top + R);
        const d = Math.hypot(rx, ry);
        if (d < R * 6) {
          const dx = e.clientX - prev.x;
          const dy = e.clientY - prev.y;
          const dt = Math.max(8, t - prev.t) / 1000;
          const speed = Math.hypot(dx, dy) / dt;
          const fall = d < R ? 1 : Math.max(0.06, Math.exp(-(d - R) / (1.6 * R)));
          const turn = (rx * dy - ry * dx) / (d * d + R * R * 0.15);
          w += (turn * 57.3 * 4 * (1 + Math.min(speed, 3000) / 900) + (w >= 0 ? 1 : -1) * Math.min(speed, 3000) * 0.6 * dt) * fall;
          w = Math.max(-1800, Math.min(1800, w));
        }
      }
      prev = { x: e.clientX, y: e.clientY, t };
    }, { passive: true });

    pinwheel.addEventListener('click', () => {
      w = Math.max(-1800, Math.min(1800, w + (w >= 0 ? 1 : -1) * 780));
      run();
    });
  }
})();
