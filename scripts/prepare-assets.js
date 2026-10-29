const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processAssets() {
  const brandDir = path.join(__dirname, '..', 'public', 'brand');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const logoPath = path.join(brandDir, 'logo-original.png');

  console.log('Generating favicon and app icons from logo...');
  if (fs.existsSync(logoPath)) {
    // Generate icons
    await sharp(logoPath).resize(16, 16).toFile(path.join(brandDir, 'favicon-16x16.png'));
    await sharp(logoPath).resize(32, 32).toFile(path.join(brandDir, 'favicon-32x32.png'));
    await sharp(logoPath).resize(48, 48).toFile(path.join(brandDir, 'favicon-48x48.png'));
    await sharp(logoPath).resize(180, 180).toFile(path.join(brandDir, 'apple-touch-icon.png'));
    await sharp(logoPath).resize(192, 192).toFile(path.join(brandDir, 'icon-192.png'));
    await sharp(logoPath).resize(512, 512).toFile(path.join(brandDir, 'icon-512.png'));
    
    // Copy 32x32 as public/favicon.ico
    await sharp(logoPath).resize(32, 32).toFile(path.join(__dirname, '..', 'public', 'favicon.ico'));
    await sharp(logoPath).resize(32, 32).toFile(path.join(__dirname, '..', 'app', 'favicon.ico'));
    await sharp(logoPath).resize(180, 180).toFile(path.join(__dirname, '..', 'public', 'apple-touch-icon.png'));
    await sharp(logoPath).resize(192, 192).toFile(path.join(__dirname, '..', 'public', 'icon-192.png'));
    await sharp(logoPath).resize(512, 512).toFile(path.join(__dirname, '..', 'public', 'icon-512.png'));
    console.log('Favicons and icons created successfully.');
  }

  console.log('Optimizing content images to WebP and AVIF at multiple widths...');
  const imageFiles = fs.readdirSync(imagesDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png'));
  
  for (const file of imageFiles) {
    const ext = path.extname(file);
    const base = path.basename(file, ext);
    const inputPath = path.join(imagesDir, file);

    const widths = [640, 960, 1280, 1600];
    
    // Generate main optimized webp and avif
    await sharp(inputPath).webp({ quality: 84 }).toFile(path.join(imagesDir, `${base}.webp`));
    await sharp(inputPath).avif({ quality: 78 }).toFile(path.join(imagesDir, `${base}.avif`));

    // Generate responsive widths in webp
    for (const w of widths) {
      await sharp(inputPath)
        .resize({ width: w, withoutEnlargement: true })
        .webp({ quality: 82 })
        .toFile(path.join(imagesDir, `${base}-${w}w.webp`));
    }
    console.log(`Optimized ${file} -> webp, avif, and widths [${widths.join(', ')}]`);
  }

  console.log('Asset optimization complete.');
}

processAssets().catch(err => {
  console.error('Error processing assets:', err);
  process.exit(1);
});
