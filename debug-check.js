import { chromium } from 'playwright';

async function check() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err));

  await page.goto('https://yoimiya66.github.io/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  const bodyText = await page.evaluate(() => document.body.innerText);
  console.log('=== INNER TEXT LENGTH ===', bodyText.length);
  console.log('=== BODY TEXT ===\n', bodyText);

  const canvasHeight = await page.evaluate(() => {
    const c = document.getElementById('hero-3d-canvas-container');
    return c ? { w: c.clientWidth, h: c.clientHeight, children: c.children.length } : null;
  });
  console.log('=== 3D CANVAS ===', canvasHeight);

  await page.screenshot({ path: 'debug-live.png', fullPage: true });
  console.log('Saved debug-live.png');

  await browser.close();
}

check().catch(console.error);
