/**
 * A.R.I.A / LYU-AGENT Modern Interactive Avatar Component
 * 
 * Features:
 * - Real-time horizontal mouse-scrubbed gaze tracking (prevX / delta / duration seek)
 * - Custom typewriter engine with blinking cursor and bilingual dialogues
 * - Interactive action pills (pitch idea, 66 PRs, copy email)
 * - Full-screen immersive agency hero modal
 * - Mobile touch-scrubbing & gentle idle breathing oscillation
 * - Respects prefers-reduced-motion
 */

export class AvatarCompanion {
  constructor() {
    this.stage = document.getElementById('avatar-stage');
    this.video = document.getElementById('avatar-video');
    this.screenWrapper = document.getElementById('avatar-screen-wrapper');
    this.typewriterText = document.getElementById('avatar-typewriter-text');
    this.cursor = document.getElementById('avatar-cursor');
    
    // Modal elements
    this.modal = document.getElementById('avatar-modal');
    this.modalVideo = document.getElementById('avatar-modal-video');
    this.modalTypewriter = document.getElementById('avatar-modal-typewriter');
    this.fullscreenBtn = document.getElementById('avatar-fullscreen-btn');
    this.modalClose = document.getElementById('avatar-modal-close');

    if (!this.video) return;

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.duration = 4.04;
    this.targetTime = 1.5;
    this.isSeeking = false;
    this.prevX = null;
    this.sensitivity = 0.8;
    this.lastUserInteraction = Date.now();
    this.isModalOpen = false;

    // Typewriter state
    this.phrases = {
      zh: [
        "Glad you stopped in. 很高兴你停下脚步。在确定性与边界之间，构建可度量、可检验的 AI 系统。",
        "开源项目 Clawd on Desk (6,500+ Stars) 核心维护者，累计合并 66 个核心 PR。",
        "曾于北京智源人工智能研究院（BAAI）实习，从事大模型安全对抗评测与质量建模。",
        "双眼眼底医学影像系统斩获第十九届“挑战杯”国赛一等奖，综合多病种 AUC 达 98.4%。",
        "求职中 · 随时到岗：大模型安全与评测 · AI Agent 系统研发 · 计算机视觉。"
      ],
      en: [
        "Glad you stopped in. Good taste tends to find us. Building verifiable, battle-tested AI systems.",
        "Core maintainer of Clawd on Desk (6,500+ Stars) with 66 merged core PRs.",
        "Former BAAI intern on frontier LLM adversarial red-teaming and quality benchmarks.",
        "National 1st Prize in 19th Challenge Cup AI Track (98.4% Retinal AI AUC).",
        "Actively seeking full-time roles: LLM Safety · AI Agent Runtime · Computer Vision."
      ]
    };
    this.currentPhraseIndex = 0;
    this.typewriterTimer = null;
    this.cycleTimer = null;

    this.initVideo();
    this.initScrubbing();
    this.initTypewriter();
    this.initPills();
    this.initModal();
    this.startIdleOscillation();
  }

  getLang() {
    return document.documentElement.getAttribute('data-lang') === 'en' ? 'en' : 'zh';
  }

  initVideo() {
    const v = this.video;
    v.muted = true;
    v.playsInline = true;

    v.addEventListener('loadedmetadata', () => {
      if (v.duration && !isNaN(v.duration)) {
        this.duration = v.duration;
      }
      v.currentTime = 1.5;
    });

    v.addEventListener('seeked', () => {
      if (Math.abs(v.currentTime - this.targetTime) > 0.04) {
        v.currentTime = this.targetTime;
      } else {
        this.isSeeking = false;
      }
    });

    if (this.modalVideo) {
      this.modalVideo.muted = true;
      this.modalVideo.playsInline = true;
      this.modalVideo.addEventListener('seeked', () => {
        if (Math.abs(this.modalVideo.currentTime - this.targetTime) > 0.04) {
          this.modalVideo.currentTime = this.targetTime;
        }
      });
    }

    // Initial seek
    v.currentTime = 1.5;
  }

  requestSeek(time) {
    this.targetTime = Math.max(0.01, Math.min(this.duration - 0.05, time));
    const activeVideo = this.isModalOpen && this.modalVideo ? this.modalVideo : this.video;
    if (!activeVideo || !this.duration) return;

    if (!this.isSeeking) {
      this.isSeeking = true;
      activeVideo.currentTime = this.targetTime;
    }

    // Sync other video in background
    if (this.isModalOpen && this.video) {
      this.video.currentTime = this.targetTime;
    }
  }

  initScrubbing() {
    if (this.reduceMotion) return;

    // Window mousemove delta scrub
    window.addEventListener('mousemove', (e) => {
      this.lastUserInteraction = Date.now();
      if (this.prevX === null) {
        this.prevX = e.clientX;
        return;
      }
      const delta = e.clientX - this.prevX;
      this.prevX = e.clientX;

      if (!this.duration) return;
      const timeOffset = (delta / window.innerWidth) * this.sensitivity * this.duration;
      this.requestSeek(this.targetTime + timeOffset);
    }, { passive: true });

    // Direct hover on stage gives instant relative gaze follow
    if (this.stage) {
      this.stage.addEventListener('mousemove', (e) => {
        this.lastUserInteraction = Date.now();
        const rect = this.stage.getBoundingClientRect();
        if (rect.width > 0) {
          const normX = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
          this.requestSeek(normX * this.duration);
        }
      }, { passive: true });
    }

    // Mobile touch drag
    let touchStartX = null;
    const targetEl = this.stage || window;
    targetEl.addEventListener('touchstart', (e) => {
      this.lastUserInteraction = Date.now();
      if (e.touches.length > 0) touchStartX = e.touches[0].clientX;
    }, { passive: true });

    targetEl.addEventListener('touchmove', (e) => {
      this.lastUserInteraction = Date.now();
      if (touchStartX === null || !e.touches.length) return;
      const currentX = e.touches[0].clientX;
      const delta = currentX - touchStartX;
      touchStartX = currentX;

      const timeOffset = (delta / window.innerWidth) * 1.5 * this.duration;
      this.requestSeek(this.targetTime + timeOffset);
    }, { passive: true });

    targetEl.addEventListener('touchend', () => {
      touchStartX = null;
    }, { passive: true });

    // Click stage to cycle typewriter dialogue with reactive nod
    if (this.screenWrapper) {
      this.screenWrapper.addEventListener('click', () => {
        this.lastUserInteraction = Date.now();
        this.currentPhraseIndex++;
        this.typePhrase();
        this.triggerNodReaction();
      });
    }
  }

  triggerNodReaction() {
    if (this.reduceMotion) return;
    const start = this.targetTime;
    const peak = Math.min(this.duration - 0.1, start + 0.6);
    this.requestSeek(peak);
    setTimeout(() => this.requestSeek(start), 220);
  }

  startIdleOscillation() {
    if (this.reduceMotion) return;
    let t = 0;
    const loop = () => {
      const now = Date.now();
      // If no mouse interaction for 3.5 seconds, gently oscillate around center
      if (now - this.lastUserInteraction > 3500 && !document.hidden) {
        t += 0.02;
        const center = 1.5;
        const amplitude = 0.5;
        const breathTime = center + Math.sin(t) * amplitude;
        this.requestSeek(breathTime);
      }
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }

  /* Typewriter Engine */
  initTypewriter() {
    this.typePhrase();

    // Listen to lang changes
    const observer = new MutationObserver(() => {
      this.typePhrase();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-lang'] });
  }

  typePhrase() {
    if (this.typewriterTimer) clearTimeout(this.typewriterTimer);
    if (this.cycleTimer) clearTimeout(this.cycleTimer);

    const lang = this.getLang();
    const list = this.phrases[lang] || this.phrases.zh;
    const text = list[this.currentPhraseIndex % list.length];

    let charIdx = 0;
    if (this.typewriterText) this.typewriterText.textContent = '';
    if (this.modalTypewriter) this.modalTypewriter.textContent = '';
    if (this.cursor) this.cursor.classList.remove('done');

    const typeNext = () => {
      if (charIdx <= text.length) {
        const displayed = text.slice(0, charIdx);
        if (this.typewriterText) this.typewriterText.textContent = displayed;
        if (this.modalTypewriter) this.modalTypewriter.textContent = displayed;
        charIdx++;
        this.typewriterTimer = setTimeout(typeNext, 32);
      } else {
        if (this.cursor) this.cursor.classList.add('done');
        // Auto cycle after 7 seconds
        this.cycleTimer = setTimeout(() => {
          this.currentPhraseIndex++;
          this.typePhrase();
        }, 7000);
      }
    };

    // Initial 400ms delay
    setTimeout(typeNext, 400);
  }

  initPills() {
    // Copy email pills
    const copyPills = document.querySelectorAll('.copy-email-pill');
    copyPills.forEach(pill => {
      pill.addEventListener('click', async (e) => {
        e.stopPropagation();
        const email = pill.getAttribute('data-copy') || 'lyubingrong@foxmail.com';
        try {
          await navigator.clipboard.writeText(email);
          const originalHTML = pill.innerHTML;
          pill.innerHTML = `<span style="color:#10B981;font-weight:600;">✓ Copied</span>`;
          setTimeout(() => {
            pill.innerHTML = originalHTML;
          }, 2000);
        } catch {
          // fallback
          alert('lyubingrong@foxmail.com');
        }
      });
    });
  }

  /* Fullscreen Modal */
  initModal() {
    if (!this.fullscreenBtn || !this.modal) return;

    this.fullscreenBtn.addEventListener('click', () => {
      this.openModal();
    });

    if (this.modalClose) {
      this.modalClose.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen) {
        this.closeModal();
      }
    });

    // Close modal on link click and jump
    const closeLinks = this.modal.querySelectorAll('#modal-close-contact, #modal-close-work');
    closeLinks.forEach(link => {
      link.addEventListener('click', () => {
        this.closeModal();
      });
    });
  }

  openModal() {
    this.isModalOpen = true;
    this.modal.classList.add('active');
    this.modal.setAttribute('aria-hidden', 'false');
    if (this.modalVideo) {
      this.modalVideo.currentTime = this.targetTime;
    }
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.isModalOpen = false;
    this.modal.classList.remove('active');
    this.modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
}
