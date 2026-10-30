const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(__dirname, '..', 'docs', 'design', 'story');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const widths = [360, 390, 768, 1024, 1280, 1440, 1920];
const targetUrl = 'http://localhost:3000/#story';

async function run() {
  console.log(`Starting responsive screenshot captures for widths: ${widths.join(', ')}`);

  for (const w of widths) {
    const outFile = path.join(outDir, `story-${w}.png`);
    // Choose proportional height
    const h = w < 768 ? 844 : 960;
    const cmd = `"${chromePath}" --headless=new --disable-gpu --hide-scrollbars --window-size=${w},${h} --virtual-time-budget=4000 --screenshot="${outFile}" "${targetUrl}"`;

    try {
      console.log(`Capturing ${w}px -> story-${w}.png...`);
      execSync(cmd, { stdio: 'inherit', timeout: 30000 });
      if (fs.existsSync(outFile)) {
        const stats = fs.statSync(outFile);
        console.log(`✓ Saved story-${w}.png (${Math.round(stats.size / 1024)} KB)`);
      }
    } catch (err) {
      console.error(`Error capturing ${w}px:`, err.message);
    }
  }

  console.log('Responsive screenshot captures complete!');
}

run().catch(console.error);
