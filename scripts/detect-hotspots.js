const sharp = require('sharp');
const path = require('path');

async function detect() {
  const emblemPath = path.join(__dirname, '..', 'public', 'brand', 'emblem.png');
  const { data, info } = await sharp(emblemPath).raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  let minX = width, maxX = 0, minY = height, maxY = 0;
  let count = 0;
  let sumX = 0, sumY = 0;

  for (let y = Math.round(height * 0.18); y < Math.round(height * 0.44); y++) {
    for (let x = Math.round(width * 0.32); x < Math.round(width * 0.68); x++) {
      const idx = (y * width + x) * channels;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Red/saffron color of Om: r > 160, g < 110, b < 90
      if (a > 180 && r > 160 && g < 110 && b < 90) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        sumX += x;
        sumY += y;
        count++;
      }
    }
  }

  console.log('Pixels matched:', count);
  if (count > 0) {
    const avgX = sumX / count;
    const avgY = sumY / count;
    console.log(`Om X range: ${minX} to ${maxX} (${(minX / width * 100).toFixed(1)}% to ${(maxX / width * 100).toFixed(1)}%)`);
    console.log(`Om Y range: ${minY} to ${maxY} (${(minY / height * 100).toFixed(1)}% to ${(maxY / height * 100).toFixed(1)}%)`);
    console.log(`Om Center: X = ${(avgX / width * 100).toFixed(1)}%, Y = ${(avgY / height * 100).toFixed(1)}%`);
    const radius = Math.max((maxX - minX) / width, (maxY - minY) / height) * 50 * 1.25;
    console.log(`Suggested Ring Radius: ${radius.toFixed(1)}%`);
  }
}

detect().catch(console.error);
