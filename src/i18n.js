export const i18n = {
  zh: {
    meta: {
      title: "吕炳荣 · Lyu Bingrong | 求职主页 · AI 系统与大模型评测",
      roleBadge: "求职中 · 开放实习与全职交流",
      edition: "2026 个人档案 · 求职主站",
      langSwitch: "EN"
    },
    nav: {
      about: "关于我",
      experience: "实习经历",
      projects: "代表作品",
      honors: "竞赛荣誉",
      stack: "技术栈",
      contact: "联系方式"
    },
    hero: {
      greeting: "你好，我是吕炳荣",
      roleLine: "软件工程本科生 / 大模型安全评测 / 开源系统工程",
      summary: "就读于中北大学软件工程专业。曾于北京智源人工智能研究院（BAAI）智能评测组从事大模型对抗攻击与竞技场标注质量研究；作为核心维护者主导 6k+ Star 开源桌面项目 Clawd on Desk 的设置架构与 20+ 款 AI Coding Agent 深度集成。我追求扎实可靠的工程交付，让 AI 系统经得起真实世界的对抗与度量。",
      target: "目标岗位：大模型评测与安全 · AI Agent 系统研发 · 跨平台桌面与算法工程",
      statusText: "随时可线上面试 / 支持到岗实习与校招入职",
      downloadCv: "获取联系 / 简历沟通",
      exploreBtn: "阅览经历档案 ↓"
    },
    stats: [
      { num: "6,000+", label: "GitHub Stars 维护项目" },
      { num: "66", label: "核心 PR 提交已合并" },
      { num: "20+", label: "AI Coding Agent 接入" },
      { num: "2×", label: "Kaggle 国际铜牌" },
      { num: "🥇 1st", label: "“挑战杯”国家级一等奖" }
    ],
    experience: {
      tag: "EXPERIENCE / 实习经历",
      title: "北京智源人工智能研究院 · 智能评测实习生",
      dept: "智能评测组 · Intelligent Evaluation Group",
      period: "2024.11 – 2025.03",
      items: [
        {
          title: "大模型安全评测与对抗攻击 (LLM Red Teaming)",
          desc: "系统开展大语言模型安全与鲁棒性评测，针对提示注入、越狱提示词与对抗扰动开展红队测试，探索模型安全边界，深度参与构建多维度安全评测基准。"
        },
        {
          title: "匿名竞技场标注质量建模 (Arena Quality Modeling)",
          desc: "参与设计匿名 LLM 竞技场（Arena）的用户标注置信度评估算法，运用统计与异常检测方法过滤噪声与恶意低质标注，切实保障人类偏好数据（RLHF/Preference Data）的信度与模型排名的公平性。"
        },
        {
          title: "主观基准评测规范与方法论研讨",
          desc: "参与大模型主观开放式任务的评测方案制定，参与设计细粒度多维度打分量表、测试集规范与自动化验证流程。"
        }
      ]
    },
    projects: {
      tag: "FEATURED WORK / 代表作品",
      title: "交付经受检验的真实软件",
      subtitle: "不只是 Demo。从底层 Hook 架构到全生命周期质量，让工具在开发者桌面上稳定长跑。",
      items: [
        {
          id: "clawd",
          title: "Clawd on Desk · 跨平台 AI 编程桌面伴侣",
          role: "核心维护者 (Maintainer) · 66 Merged PRs",
          badge: "6,000+ GitHub Stars",
          oneLiner: "一款能实时响应 Claude Code、Codex、Cursor、Gemini 等 20+ 款主流 AI 编程智能体状态的轻量桌面伴侣。",
          bullets: [
            "架构重构：独立设计并主导统一设置与交互系统，统一全局配置持久化与多模块状态同步。",
            "运行时 Hook：搭建多 Agent 异步 Hook 接入体系与后台会话生命周期调度，保障生态扩展性。",
            "原生质量：系统优化 Windows 平台托盘行为、崩溃恢复与多端（Win/Mac/Linux）原生体验。"
          ],
          tags: ["Electron", "JavaScript", "Agent Hooks", "Windows Platform", "Open-Source"],
          link: "https://github.com/rullerzhou-afk/clawd-on-desk",
          linkText: "GitHub 仓库 (6k+ Stars) →"
        },
        {
          id: "robotics",
          title: "全国“挑战杯” & RAICOM 国赛智能系统",
          role: "团队负责人 / 核心算法与系统工程",
          badge: "国一 🥇 & 国二 🥈",
          oneLiner: "将深度学习感知、空间位姿解算与机器人协同决策结合，在国家级高难度对抗场景中完成精准执行。",
          bullets: [
            "第十九届“挑战杯”全国大学生课外学术科技作品竞赛“人工智能+”专项赛 全国一等奖（2025）。",
            "2026 睿抗机器人开发者大赛（RAICOM）全国总决赛 全国二等奖（2026.08）。",
            "打通从图像目标检测、点云空间定位到底层电机动力响应的完整闭环。"
          ],
          tags: ["Computer Vision", "Robot Systems", "PyTorch", "C++", "Edge AI"],
          link: "https://github.com/YOIMIYA66",
          linkText: "查看荣誉与项目沉淀 →"
        },
        {
          id: "kaggle",
          title: "Kaggle 国际模型推理与低资源语言赛题",
          role: "竞赛选手 · 2× Bronze Medals",
          badge: "Kaggle 2× 铜牌 · TAAC Top 8.5%",
          oneLiner: "在有限算力与嘈杂低资源场景中，通过提示工程、链式推理微调与特征对齐取得前列排位。",
          bullets: [
            "NVIDIA Nemotron 模型推理挑战赛：探索复杂逻辑链推导与蒸馏对齐，斩获 Kaggle 铜牌。",
            "Deep Past 挑战赛：阿卡德古楔形文字与英语低资源翻译，攻克稀疏词表与古文语境对齐难题，摘得铜牌。",
            "TAAC × KDD Cup 2026 腾讯推荐挑战赛：排名前 8.5%（160 / 1873）。"
          ],
          tags: ["LLM Reasoning", "Low-Resource NLP", "PyTorch", "Hugging Face"],
          link: "https://www.kaggle.com/lvbingrong",
          linkText: "Kaggle 竞赛主页 →"
        }
      ]
    },
    honors: {
      tag: "HONORS / 竞赛与奖项",
      title: "主要荣誉",
      list: [
        { award: "国家级二等奖", name: "2026 睿抗机器人开发者大赛（RAICOM）全国总决赛", date: "2026.08", high: true },
        { award: "Kaggle 铜牌", name: "NVIDIA Nemotron 模型推理挑战赛", date: "2026.06", high: false },
        { award: "全球前 8.5% (160/1873)", name: "TAAC × KDD Cup 2026 腾讯 Uni-Rec 推荐挑战赛", date: "2026.05", high: false },
        { award: "Kaggle 铜牌", name: "Deep Past 挑战赛 · 阿卡德语英译", date: "2026.03", high: false },
        { award: "国家级一等奖", name: "第十九届“挑战杯”全国大学生课外科技作品竞赛“人工智能+”专项赛", date: "2025", high: true },
        { award: "国家级三等奖", name: "第十六届中国大学生服务外包创新创业大赛", date: "2025", high: false },
        { award: "国家级铜奖", name: "中国国际大学生创新大赛（高教主赛道）", date: "2024", high: false },
        { award: "全球总决赛季军", name: "第六届中关村人才创客大赛", date: "2024", high: false }
      ]
    },
    skills: {
      tag: "SKILLS / 技术栈",
      title: "技术储备与工具链",
      groups: [
        {
          name: "编程语言与基础",
          items: ["Python", "JavaScript / ES6+", "TypeScript", "C / C++", "Bash / Shell", "SQL", "Git"]
        },
        {
          name: "大模型与评测安全",
          items: ["LLM Red Teaming (对抗攻击与注入)", "安全评测基准构建", "Human Preference & Arena 质量建模", "Prompt Engineering", "OpenAI / Claude / Gemini API"]
        },
        {
          name: "机器学习与数据科学",
          items: ["PyTorch", "Hugging Face Transformers", "scikit-learn", "NumPy / Pandas", "OpenCV", "Jupyter Lab"]
        },
        {
          name: "桌面与应用工程",
          items: ["Electron", "Node.js", "Windows 原生系统适配", "CI/CD (GitHub Actions)", "Docker", "Vite / Modern Web"]
        }
      ]
    },
    philosophy: {
      tag: "PHILOSOPHY / 准则",
      quote: "知行合一",
      enQuote: "Knowledge and action are one.",
      desc: "“知是行之始，行是知之成。”只做经得起对抗检验、有度量根据的 AI 系统；写清晰自洽的文档，交付实打实能跑在用户桌面的软件。"
    },
    contact: {
      tag: "CONTACT / 联系我",
      title: "期待与您的团队交流",
      desc: "目前我正积极关注大模型评测、AI 智能体研发及系统工程方向的实习与校招机会。欢迎随时致信或添加社交网络交流。",
      email: "lyubingrong@foxmail.com",
      links: [
        { name: "电子邮箱", val: "lyubingrong@foxmail.com", href: "mailto:lyubingrong@foxmail.com" },
        { name: "GitHub", val: "YOIMIYA66", href: "https://github.com/YOIMIYA66" },
        { name: "LinkedIn 领英", val: "吕炳荣 (Lyu Bingrong)", href: "https://www.linkedin.com/in/%E7%82%B3%E8%8D%A3-%E5%90%95-3a13ab3a2/" },
        { name: "Kaggle", val: "lvbingrong (2× Bronze)", href: "https://www.kaggle.com/lvbingrong" },
        { name: "百度飞桨 AI Studio", val: "个人中心 4207625", href: "https://aistudio.baidu.com/personalcenter/thirdview/4207625" }
      ],
      footerNote: "© 2026 吕炳荣 (Lyu Bingrong) · 纸墨版式与轻3D视差呈现"
    }
  },
  en: {
    meta: {
      title: "Lyu Bingrong | Career Portal · AI Systems & LLM Evaluation",
      roleBadge: "Open to Roles · Intern & New Grad",
      edition: "2026 Profile · Career Portal",
      langSwitch: "中文"
    },
    nav: {
      about: "About",
      experience: "Experience",
      projects: "Projects",
      honors: "Honors",
      stack: "Tech Stack",
      contact: "Contact"
    },
    hero: {
      greeting: "Hello, I'm Lyu Bingrong",
      roleLine: "Software Engineering Undergrad / LLM Evaluation / Systems & Open-Source",
      summary: "Undergraduate in Software Engineering at North University of China. Formerly interned at the Beijing Academy of Artificial Intelligence (BAAI) on LLM red-teaming and arena preference modeling. Core maintainer of Clawd on Desk (6k+ GitHub stars) leading settings UX and 20+ agent integrations. I build measurable, reliable AI systems engineered for real-world resilience.",
      target: "Target Roles: LLM Safety & Evaluation · AI Agent Engineering · Systems & Desktop Engineering",
      statusText: "Ready for remote interviews / Open to on-site internship & 2026/2027 grad positions",
      downloadCv: "Get in Touch / Resume",
      exploreBtn: "Read Background ↓"
    },
    stats: [
      { num: "6,000+", label: "GitHub Stars on Maintained App" },
      { num: "66", label: "Core PRs Merged" },
      { num: "20+", label: "AI Coding Agents Integrated" },
      { num: "2×", label: "Kaggle Bronze Medals" },
      { num: "🥇 1st", label: "National 1st Prize Challenge Cup" }
    ],
    experience: {
      tag: "EXPERIENCE",
      title: "Beijing Academy of Artificial Intelligence (BAAI) · Intern",
      dept: "Intelligent Evaluation Group",
      period: "2024.11 – 2025.03",
      items: [
        {
          title: "LLM Safety & Red Teaming",
          desc: "Conducted systematic vulnerability assessments against frontier LLMs using prompt injection, jailbreaks, and adversarial probing; contributed to multidimensional safety benchmarks."
        },
        {
          title: "Arena Annotation Quality Modeling",
          desc: "Co-designed user rating credibility models for anonymous LLM arena competitions, eliminating noisy and adversarial labels to safeguard human preference rankings."
        },
        {
          title: "Subjective Benchmark Standards",
          desc: "Formulated evaluation protocols, multidimensional rubric design, and automated validation pipelines for subjective LLM tasks."
        }
      ]
    },
    projects: {
      tag: "FEATURED WORK",
      title: "Shipping battle-tested software",
      subtitle: "Beyond toy demos: from runtime hook layers to full desktop lifecycle reliability.",
      items: [
        {
          id: "clawd",
          title: "Clawd on Desk · Cross-Platform AI Coding Companion",
          role: "Core Maintainer · 66 Merged PRs",
          badge: "6,000+ GitHub Stars",
          oneLiner: "A pixel desktop companion reacting in real time to 20+ AI coding tools including Claude Code, Codex, Cursor, and Gemini.",
          bullets: [
            "Settings Architecture: Designed and overhauled the unified configuration and interaction workflows.",
            "Runtime Hooks: Engineered multi-agent hook triggers and background session lifecycle scheduling.",
            "Native Quality: Hardened Windows system tray, crash recovery, and seamless multi-platform consistency."
          ],
          tags: ["Electron", "JavaScript", "Agent Hooks", "Windows Platform", "Open-Source"],
          link: "https://github.com/rullerzhou-afk/clawd-on-desk",
          linkText: "GitHub Repository (6k+ Stars) →"
        },
        {
          id: "robotics",
          title: "National Challenge Cup & RAICOM Robotic AI Systems",
          role: "Team Lead & Core Algorithm Engineer",
          badge: "National 1st 🥇 & 2nd 🥈",
          oneLiner: "Combined deep learning perception, 3D pose estimation, and reactive robot coordination under high-stress arenas.",
          bullets: [
            "19th “Challenge Cup” AI Special Track — National 1st Prize (2025).",
            "2026 RAICOM Robotics Developer Competition Finals — National 2nd Prize (2026.08).",
            "Full loop from camera object detection to point cloud localization and motor torque control."
          ],
          tags: ["Computer Vision", "Robot Systems", "PyTorch", "C++", "Edge AI"],
          link: "https://github.com/YOIMIYA66",
          linkText: "View Honors & Details →"
        },
        {
          id: "kaggle",
          title: "Kaggle Model Reasoning & Low-Resource Translation",
          role: "Competitor · 2× Bronze Medals",
          badge: "Kaggle 2× Bronze · TAAC Top 8.5%",
          oneLiner: "Ranked among top global competitors using prompt reasoning chains, distillation, and representation alignment.",
          bullets: [
            "NVIDIA Nemotron Reasoning: Explored chain-of-thought verification and reasoning distillation (Bronze).",
            "Deep Past Akkadian Translation: Handled ancient cuneiform low-resource alignment to English (Bronze).",
            "TAAC × KDD Cup 2026 Tencent Uni-Rec: Top 8.5% (160 / 1,873)."
          ],
          tags: ["LLM Reasoning", "Low-Resource NLP", "PyTorch", "Hugging Face"],
          link: "https://www.kaggle.com/lvbingrong",
          linkText: "Kaggle Profile →"
        }
      ]
    },
    honors: {
      tag: "HONORS",
      title: "Selected Honors & Awards",
      list: [
        { award: "National 2nd Prize", name: "2026 RAICOM Robotics Developer Competition — National Finals", date: "2026.08", high: true },
        { award: "Kaggle Bronze", name: "NVIDIA Nemotron Model Reasoning Challenge", date: "2026.06", high: false },
        { award: "Top 8.5% (160/1873)", name: "TAAC × KDD Cup 2026 — Tencent Uni-Rec Challenge", date: "2026.05", high: false },
        { award: "Kaggle Bronze", name: "Deep Past Challenge — Translate Akkadian to English", date: "2026.03", high: false },
        { award: "National 1st Prize", name: "19th “Challenge Cup” — AI Special Track", date: "2025", high: true },
        { award: "National 3rd Prize", name: "16th Chinese College Students Service Outsourcing Innovation Competition", date: "2025", high: false },
        { award: "National Bronze", name: "China International College Students’ Innovation Competition", date: "2024", high: false },
        { award: "Global 2nd Runner-up", name: "6th Zhongguancun Talent Maker Competition", date: "2024", high: false }
      ]
    },
    skills: {
      tag: "SKILLS",
      title: "Technical Stack & Tools",
      groups: [
        {
          name: "Languages & Core",
          items: ["Python", "JavaScript / ES6+", "TypeScript", "C / C++", "Bash / Shell", "SQL", "Git"]
        },
        {
          name: "LLM Safety & Evaluation",
          items: ["LLM Red Teaming & Injection", "Safety Benchmark Design", "Human Preference & Arena Modeling", "Prompt Engineering", "OpenAI / Claude / Gemini API"]
        },
        {
          name: "Machine Learning & Data",
          items: ["PyTorch", "Hugging Face Transformers", "scikit-learn", "NumPy / Pandas", "OpenCV", "Jupyter Lab"]
        },
        {
          name: "Application & Desktop",
          items: ["Electron", "Node.js", "Windows Native Platform Quality", "GitHub Actions CI/CD", "Docker", "Vite / Modern Web"]
        }
      ]
    },
    philosophy: {
      tag: "PHILOSOPHY",
      quote: "知行合一",
      enQuote: "Knowledge and action are one.",
      desc: "“True knowledge begins with action; true action fulfills knowledge.” I build verifiable AI systems that survive adversarial stress, write clear documentation, and ship software that works on real user machines."
    },
    contact: {
      tag: "CONTACT",
      title: "Let's connect",
      desc: "I am actively seeking internship and new grad opportunities in LLM evaluation, AI agent engineering, and system software. Feel free to reach out via email or any network below.",
      email: "lyubingrong@foxmail.com",
      links: [
        { name: "Email", val: "lyubingrong@foxmail.com", href: "mailto:lyubingrong@foxmail.com" },
        { name: "GitHub", val: "YOIMIYA66", href: "https://github.com/YOIMIYA66" },
        { name: "LinkedIn", val: "Lyu Bingrong", href: "https://www.linkedin.com/in/%E7%82%B3%E8%8D%A3-%E5%90%95-3a13ab3a2/" },
        { name: "Kaggle", val: "lvbingrong (2× Bronze)", href: "https://www.kaggle.com/lvbingrong" },
        { name: "Baidu AI Studio", val: "Profile 4207625", href: "https://aistudio.baidu.com/personalcenter/thirdview/4207625" }
      ],
      footerNote: "© 2026 Lyu Bingrong · Magazine Layout & Light 3D Parallax"
    }
  }
};
