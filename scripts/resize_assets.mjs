import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function resizeAssets() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage();

  const iconPath = path.resolve(__dirname, '../public/assets/clawd-icon.png');
  const iconBase64 = fs.readFileSync(iconPath).toString('base64');

  await page.setContent('<canvas id="c" width="128" height="128"></canvas>');
  
  const pngDataUrl = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = 'data:image/png;base64,' + b64;
    await new Promise(r => img.onload = r);
    const canvas = document.getElementById('c');
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, 128, 128);
    return canvas.toDataURL('image/png');
  }, iconBase64);

  const pngBuf = Buffer.from(pngDataUrl.split(',')[1], 'base64');
  const outPng = path.resolve(__dirname, '../public/assets/clawd-icon-128.png');
  fs.writeFileSync(outPng, pngBuf);
  console.log('clawd-icon-128.png size:', pngBuf.length, 'bytes');

  // Also replace clawd-icon.png directly so all existing references get the 128px ~15KB version, while keeping backup
  fs.copyFileSync(iconPath, path.resolve(__dirname, '../public/assets/clawd-icon-original.png'));
  fs.writeFileSync(iconPath, pngBuf);
  console.log('Replaced public/assets/clawd-icon.png with optimized 128px version (original kept at clawd-icon-original.png)');

  await browser.close();
}

resizeAssets().catch(console.error);
