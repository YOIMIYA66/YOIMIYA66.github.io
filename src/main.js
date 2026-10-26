import { i18n } from './i18n.js';

class CareerPortalApp {
  constructor() {
    this.currentLang = this.detectLanguage();
    this.initLantern3D();
    this.initLampEffect();
    this.initCard3DTilt();
    this.bindEvents();
    
    // If language is English, trigger English render; otherwise the HTML already has complete Chinese pre-rendered!
    if (this.currentLang === 'en') {
      this.render();
    }
  }

  detectLanguage() {
    const saved = localStorage.getItem('cp_lang');
    if (saved === 'zh' || saved === 'en') return saved;
    const navLang = navigator.language || navigator.userLanguage || 'zh';
    return navLang.toLowerCase().startsWith('zh') ? 'zh' : 'en';
  }

  async initLantern3D() {
    const container = document.getElementById('hero-3d-canvas-container');
    if (!container) return;

    try {
      const { YoimiyaLanternScene } = await import('./yoimiya-lantern.js');
      this.lanternScene = new YoimiyaLanternScene(container);
      const fallback = document.getElementById('hero-3d-fallback');
      if (fallback) fallback.style.display = 'none';
    } catch (err) {
      console.warn('Yoimiya Lantern 3D initialization fallback:', err);
    }
  }

  initLampEffect() {
    window.addEventListener('mousemove', (e) => {
      document.documentElement.style.setProperty('--mx', `${e.clientX}px`);
      document.documentElement.style.setProperty('--my', `${e.clientY}px`);
    }, { passive: true });
  }

  initCard3DTilt() {
    const applyTilt = (card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -5;
        const rotateY = ((x - centerX) / centerX) * 5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
      });
    };

    document.querySelectorAll('.project-card-tilt, .exp-card').forEach(applyTilt);
  }

  render() {
    const data = i18n[this.currentLang];
    document.documentElement.lang = this.currentLang === 'zh' ? 'zh-CN' : 'en';
    document.title = data.meta.title;

    // Header & Meta
    const badgeText = document.getElementById('masthead-badge-text');
    if (badgeText) badgeText.textContent = data.meta.roleBadge;
    const edition = document.getElementById('masthead-edition');
    if (edition) edition.textContent = data.meta.edition;
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) langBtn.textContent = data.meta.langSwitch;

    // Nav
    document.getElementById('nav-exp').textContent = data.nav.experience;
    document.getElementById('nav-projects').textContent = data.nav.projects;
    document.getElementById('nav-honors').textContent = data.nav.honors;
    document.getElementById('nav-skills').textContent = data.nav.stack;
    document.getElementById('nav-contact').textContent = data.nav.contact;

    // Hero
    document.getElementById('hero-greeting').textContent = this.currentLang === 'zh' ? '宵宮の風 · 你好，我是吕炳荣' : "Yoimiya's Breeze · Hello, I'm Lyu Bingrong";
    document.getElementById('hero-head-1').textContent = this.currentLang === 'zh' ? '在确定性与边界之间，' : 'Between certainty and vulnerability,';
    document.getElementById('hero-head-2').textContent = this.currentLang === 'zh' ? '构建可度量、可落地的 AI 系统。' : 'Building measurable, reliable AI systems.';
    document.getElementById('hero-role-line').textContent = data.hero.roleLine;
    document.getElementById('hero-bio-para').textContent = data.hero.summary;
    document.getElementById('hero-target-box').innerHTML = `<strong>${this.currentLang === 'zh' ? '目标岗位：' : 'Target Roles: '}</strong>${data.hero.target.replace('目标岗位：', '').replace('Target Roles: ', '')}`;
    document.getElementById('btn-contact-text').textContent = data.hero.downloadCv;
    document.getElementById('btn-explore-text').textContent = data.hero.exploreBtn;

    const lanternTitle = document.getElementById('lantern-title-tag');
    if (lanternTitle) {
      lanternTitle.textContent = this.currentLang === 'zh' ? '和風水行燈 · 宵宮の夏夜' : 'Washi Lantern · Yoimiya Festival Night';
    }
    const lanternSub = document.getElementById('lantern-sub-tag');
    if (lanternSub) {
      lanternSub.textContent = this.currentLang === 'zh' ? '3D Washi Lantern · 点击唤起金色花火' : '3D Interactive Lantern · Click for Sparks';
    }

    // Stats
    const statsContainer = document.getElementById('stats-banner');
    if (statsContainer) {
      statsContainer.innerHTML = data.stats.map(s => `
        <div class="stat-item">
          <div class="stat-number">${s.num}</div>
          <div class="stat-label">${s.label}</div>
        </div>
      `).join('');
    }

    // Experience
    const expCard = document.getElementById('exp-card');
    if (expCard) {
      expCard.innerHTML = `
        <div class="exp-header">
          <div>
            <div class="exp-company">${data.experience.title}</div>
            <div class="exp-dept-role">${data.experience.dept}</div>
          </div>
          <div class="exp-period-pill">${data.experience.period}</div>
        </div>
        <div class="exp-duties-list">
          ${data.experience.items.map(item => `
            <div class="duty-block">
              <div class="duty-title">${item.title}</div>
              <div class="duty-desc">${item.desc}</div>
            </div>
          `).join('')}
        </div>
      `;
    }

    // Projects
    const projectsGrid = document.getElementById('projects-grid');
    if (projectsGrid) {
      projectsGrid.innerHTML = data.projects.items.map(p => `
        <div class="project-card-tilt" data-id="${p.id}">
          <div class="project-meta-bar">
            <span class="project-role-badge">${p.role}</span>
            <span class="project-star-badge">${p.badge}</span>
          </div>
          <h3 class="project-title">${p.title}</h3>
          <p class="project-oneliner">${p.oneLiner}</p>
          <ul class="project-bullets-list">
            ${p.bullets.map(b => `<li>${b}</li>`).join('')}
          </ul>
          <div class="project-bottom-row">
            <div class="project-tags-wrap">
              ${p.tags.map(t => `<span class="tag-badge">${t}</span>`).join('')}
            </div>
            <a href="${p.link}" target="_blank" rel="noopener noreferrer" class="project-link-cta">
              ${p.linkText}
            </a>
          </div>
        </div>
      `).join('');
    }

    // Honors
    const honorsTbody = document.getElementById('honors-tbody');
    if (honorsTbody) {
      honorsTbody.innerHTML = data.honors.list.map(h => `
        <tr>
          <td class="award-cell ${h.high ? 'high-rank' : ''}">${h.award}</td>
          <td class="event-cell">${h.name}</td>
          <td class="date-cell">${h.date}</td>
        </tr>
      `).join('');
    }

    // Skills
    const skillsGrid = document.getElementById('skills-grid');
    if (skillsGrid) {
      skillsGrid.innerHTML = data.skills.groups.map(g => `
        <div class="skill-card">
          <div class="skill-cat-title">${g.name}</div>
          <div class="skill-tags-flow">
            ${g.items.map(item => `<span class="skill-item-tag">${item}</span>`).join('')}
          </div>
        </div>
      `).join('');
    }

    // Philosophy
    document.getElementById('quote-title').textContent = data.philosophy.quote;
    document.getElementById('quote-en-sub').textContent = data.philosophy.enQuote;
    document.getElementById('quote-desc-text').textContent = data.philosophy.desc;

    // Contact
    document.getElementById('contact-desc-text').textContent = data.contact.desc;
    const contactLinksCol = document.getElementById('contact-links-col');
    if (contactLinksCol) {
      contactLinksCol.innerHTML = data.contact.links.map(l => `
        <a href="${l.href}" target="_blank" rel="noopener noreferrer" class="contact-link-row">
          <span class="contact-network-name">${l.name}</span>
          <span class="contact-network-val">${l.val} →</span>
        </a>
      `).join('');
    }

    // Footer
    document.getElementById('footer-note').textContent = this.currentLang === 'zh'
      ? '© 2026 吕炳荣 (YOIMIYA66) · 宵宮花火と和風3D水行燈'
      : '© 2026 Lyu Bingrong (YOIMIYA66) · Yoimiya Festival & Japanese 3D Floating Lantern';
    document.getElementById('btn-scroll-top').textContent = this.currentLang === 'zh' ? '返回顶部 ↑' : 'Back to top ↑';

    // Rebind 3D tilt after DOM injection
    this.initCard3DTilt();
  }

  bindEvents() {
    const langBtn = document.getElementById('btn-lang-toggle');
    if (langBtn) {
      langBtn.addEventListener('click', () => {
        this.currentLang = this.currentLang === 'zh' ? 'en' : 'zh';
        localStorage.setItem('cp_lang', this.currentLang);
        this.render();
      });
    }

    const btnScrollTop = document.getElementById('btn-scroll-top');
    if (btnScrollTop) {
      btnScrollTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.app = new CareerPortalApp();
});
