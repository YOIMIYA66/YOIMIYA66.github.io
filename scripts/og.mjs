import { chromium } from 'playwright';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generateOG() {
  const browser = await chromium.launch({ channel: 'msedge' });
  const page = await browser.newPage({
    viewport: { width: 1200, height: 630 },
    deviceScaleFactor: 1
  });

  const html = `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    width: 1200px;
    height: 630px;
    background: #F0EEE6;
    color: #1F1E1D;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Noto Serif SC", serif;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 68px 80px;
    position: relative;
    border: 12px solid #1F1E1D;
  }
  .bg-grid {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(31,30,29,0.05) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(31,30,29,0.05) 1px, transparent 1px);
    background-size: 32px 32px;
    pointer-events: none;
  }
  .left {
    z-index: 1;
    max-width: 660px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .tag {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: monospace;
    font-size: 14px;
    font-weight: 600;
    color: #1F1E1D;
    background: #FAF9F5;
    padding: 6px 14px;
    border: 2px solid #1F1E1D;
    box-shadow: 3px 3px 0 #1F1E1D;
    width: fit-content;
  }
  .dot {
    width: 10px;
    height: 10px;
    background: #10B981;
    border-radius: 50%;
  }
  h1 {
    font-size: 58px;
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: #1F1E1D;
  }
  h1 span.en {
    font-size: 40px;
    font-weight: 500;
    color: #A8502F;
    margin-left: 14px;
  }
  .roles {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 21px;
    font-weight: 500;
    color: #6B655A;
    line-height: 1.45;
    border-left: 3px solid #D97757;
    padding-left: 16px;
  }
  .metrics {
    display: flex;
    gap: 24px;
    margin-top: 10px;
  }
  .metric-item {
    background: #FAF9F5;
    border: 2px solid #1F1E1D;
    box-shadow: 4px 4px 0 #1F1E1D;
    padding: 10px 18px;
    display: flex;
    flex-direction: column;
  }
  .metric-num {
    font-size: 28px;
    font-weight: 800;
    color: #A8502F;
    font-family: monospace;
  }
  .metric-lbl {
    font-size: 13px;
    color: #6B655A;
    font-family: monospace;
  }
  .right {
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .avatar-card {
    background: #1F1E1D;
    border: 3px solid #1F1E1D;
    box-shadow: 8px 8px 0 rgba(168,80,47,0.35);
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .avatar-img {
    width: 200px;
    height: 200px;
    image-rendering: pixelated;
  }
  .avatar-caption {
    margin-top: 14px;
    font-family: monospace;
    font-size: 13px;
    color: #10B981;
    letter-spacing: 0.05em;
  }
</style>
</head>
<body>
<div class="bg-grid"></div>
<div class="left">
  <div class="tag"><div class="dot"></div>STATUS: READY · 随时到岗</div>
  <h1>吕炳荣<span class="en">Lyu Bingrong</span></h1>
  <div class="roles">
    <div>✦ 大模型安全与评测 · 红队对抗</div>
    <div>✦ AI Agent 运行时工程 · Clawd on Desk 核心维护</div>
    <div>✦ 计算机视觉 · 挑战杯国赛一等奖</div>
  </div>
  <div class="metrics">
    <div class="metric-item">
      <span class="metric-num">6,500+</span>
      <span class="metric-lbl">Stars Maintained</span>
    </div>
    <div class="metric-item">
      <span class="metric-num">66</span>
      <span class="metric-lbl">Merged PRs</span>
    </div>
    <div class="metric-item">
      <span class="metric-num">🥇 1st</span>
      <span class="metric-lbl">Nat'l 1st Prize</span>
    </div>
  </div>
</div>
<div class="right">
  <div class="avatar-card">
    <svg class="avatar-img" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">
      <!-- Background / Dark Monitor -->
      <rect width="32" height="32" fill="#1F1E1D"/>
      <!-- Sony WH-1000XM Headphones Band -->
      <rect x="9" y="5" width="14" height="2" fill="#8DA2B6"/>
      <rect x="8" y="7" width="2" height="4" fill="#8DA2B6"/>
      <rect x="22" y="7" width="2" height="4" fill="#8DA2B6"/>
      <rect x="7" y="10" width="3" height="6" fill="#1F1E1D"/>
      <rect x="7" y="11" width="1" height="4" fill="#D97757"/>
      <rect x="22" y="10" width="3" height="6" fill="#1F1E1D"/>
      <rect x="24" y="11" width="1" height="4" fill="#D97757"/>
      <!-- Hair -->
      <rect x="11" y="6" width="10" height="4" fill="#1F1E1D"/>
      <rect x="10" y="8" width="12" height="3" fill="#1F1E1D"/>
      <!-- Face -->
      <rect x="10" y="10" width="12" height="8" fill="#FCD5B5"/>
      <rect x="11" y="18" width="10" height="2" fill="#F5AF8B"/>
      <!-- Glasses -->
      <rect x="11" y="11" width="4" height="3" stroke="#8DA2B6" stroke-width="1" fill="none"/>
      <rect x="17" y="11" width="4" height="3" stroke="#8DA2B6" stroke-width="1" fill="none"/>
      <rect x="15" y="12" width="2" height="1" fill="#8DA2B6"/>
      <!-- Eyes -->
      <rect x="12" y="12" width="2" height="2" fill="#1F1E1D"/>
      <rect x="18" y="12" width="2" height="2" fill="#1F1E1D"/>
      <!-- Smile -->
      <rect x="14" y="16" width="4" height="1" fill="#B5593B"/>
      <!-- Plaid Flannel Shirt (#D97757 & #B5593B) -->
      <rect x="6" y="20" width="20" height="12" fill="#D97757"/>
      <rect x="10" y="20" width="2" height="12" fill="#B5593B"/>
      <rect x="14" y="20" width="4" height="12" fill="#B5593B"/>
      <rect x="20" y="20" width="2" height="12" fill="#B5593B"/>
      <rect x="6" y="23" width="20" height="2" fill="#B5593B"/>
      <rect x="6" y="28" width="20" height="2" fill="#B5593B"/>
      <!-- Collar -->
      <polygon points="14,20 16,23 15,20" fill="#FAF9F5"/>
      <polygon points="18,20 16,23 17,20" fill="#FAF9F5"/>
    </svg>
    <span class="avatar-caption">YOIMIYA66 · BIO.SYS</span>
  </div>
</div>
</body>
</html>
  `;

  await page.setContent(html);
  await page.waitForTimeout(300);

  const outPath = path.resolve(__dirname, '../public/assets/og.png');
  await page.screenshot({ path: outPath });
  console.log('OG image successfully generated at:', outPath);

  await browser.close();
}

generateOG().catch(console.error);
