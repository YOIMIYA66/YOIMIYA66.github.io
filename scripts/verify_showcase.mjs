import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';

const ARTIFACT_DIR = 'C:/Users/86198/.gemini/antigravity-cli/brain/647cd0d5-209f-4d73-b53c-7e350e24ec9a';

async function main() {
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], { shell: true, stdio: 'pipe' });
  await new Promise(r => setTimeout(r, 1500));

  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });

  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', err => errors.push(err.message));

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  // Desktop Screenshots
  const heroEl = await page.$('.cover');
  if (heroEl) await heroEl.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_hero.png') });

  const skillsEl = await page.$('.skills-block');
  if (skillsEl) await skillsEl.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_skills.png') });

  const work01El = await page.$('#clawd-on-desk');
  if (work01El) await work01El.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_work01.png') });

  const work02El = await page.$('#cv-projects');
  if (work02El) await work02El.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_work02.png') });

  const work03El = await page.$('#kaggle-project');
  if (work03El) await work03El.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_work03.png') });

  const expEl = await page.$('#experience');
  if (expEl) await expEl.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_experience.png') });

  const honorsEl = await page.$('#honors');
  if (honorsEl) await honorsEl.screenshot({ path: path.join(ARTIFACT_DIR, 'desktop_honors.png') });

  // Mobile Viewport Check
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(500);

  const overflow = await page.evaluate(() => {
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      bodyScrollWidth: document.body.scrollWidth
    };
  });

  const mobileWork01El = await page.$('#clawd-on-desk');
  if (mobileWork01El) await mobileWork01El.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_work01.png') });

  const mobileWork02El = await page.$('#cv-projects');
  if (mobileWork02El) await mobileWork02El.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_work02.png') });

  const mobileWork03El = await page.$('#kaggle-project');
  if (mobileWork03El) await mobileWork03El.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_work03.png') });

  const mobileExpEl = await page.$('#experience');
  if (mobileExpEl) await mobileExpEl.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_experience.png') });

  const mobileHonorsEl = await page.$('#honors');
  if (mobileHonorsEl) await mobileHonorsEl.screenshot({ path: path.join(ARTIFACT_DIR, 'mobile_honors.png') });

  console.log('Errors:', errors);
  console.log('Mobile overflow check:', overflow);

  await browser.close();
  preview.kill();
  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
