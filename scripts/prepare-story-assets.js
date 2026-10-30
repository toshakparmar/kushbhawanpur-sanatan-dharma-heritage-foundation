const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function prepareStoryAssets() {
  const brandDir = path.join(__dirname, '..', 'public', 'brand');
  const imagesDir = path.join(__dirname, '..', 'public', 'images');
  const storyDir = path.join(imagesDir, 'story');

  if (!fs.existsSync(storyDir)) {
    fs.mkdirSync(storyDir, { recursive: true });
  }

  // 1. Create public/brand/emblem.webp and ensure emblem.png exists
  const emblemSource = path.join(brandDir, 'logo-emblem.png');
  const emblemPng = path.join(brandDir, 'emblem.png');
  const emblemWebp = path.join(brandDir, 'emblem.webp');

  console.log('Generating public/brand/emblem.webp & png...');
  await sharp(emblemSource).png().toFile(emblemPng);
  await sharp(emblemSource).webp({ quality: 90 }).toFile(emblemWebp);

  const emblemMeta = await sharp(emblemSource).metadata();
  const W = emblemMeta.width;
  const H = emblemMeta.height;
  console.log(`Emblem dimensions: ${W}x${H}`);

  // 2. Generate 5 zoomed detail crops for mobile (aspect ratio 4:5 or 16:10, lets do 4:5 400x500 or 500x400)
  // Coordinates in %:
  // Om: (50%, 17%)
  // Book: (50%, 82%)
  // Cow: (75%, 66%)
  // Tree: (22%, 48%)
  // Temple: (50%, 55%)

  const crops = [
    { name: 'story-om.webp', cx: 0.50, cy: 0.34, zoom: 2.2 },
    { name: 'story-book.webp', cx: 0.50, cy: 0.82, zoom: 1.9 },
    { name: 'story-gau.webp', cx: 0.75, cy: 0.66, zoom: 2.2 },
    { name: 'story-parijat.webp', cx: 0.22, cy: 0.48, zoom: 1.8 },
    { name: 'story-dhopap.webp', cx: 0.50, cy: 0.55, zoom: 1.7 },
  ];

  for (const c of crops) {
    const cropW = Math.round(W / c.zoom);
    const cropH = Math.round(H / c.zoom);
    let left = Math.round(W * c.cx - cropW / 2);
    let top = Math.round(H * c.cy - cropH / 2);

    // Clamp
    left = Math.max(0, Math.min(W - cropW, left));
    top = Math.max(0, Math.min(H - cropH, top));

    const outPath = path.join(storyDir, c.name);
    await sharp(emblemSource)
      .extract({ left, top, width: cropW, height: cropH })
      .resize(480, 480, { fit: 'contain', background: { r: 255, g: 253, b: 248, alpha: 0 } })
      .webp({ quality: 88 })
      .toFile(outPath);
    console.log(`Generated detail crop: ${c.name}`);
  }

  // 3. Generate the 5 chapter photos in public/images/story/
  // We match each chapter with our high quality curated library in public/images:
  // Om: gallery-aarti (diya / light / divine glow)
  // Book: work-scriptures / work-archives (manuscript)
  // Gau: work-gau-seva (cow in golden hour)
  // Parijat: work-environment (sacred tree & green sanctuary)
  // Dhopap: gallery-ghat (Gomti ghat & temple at sunrise)

  const chapterPhotos = [
    { src: 'gallery-aarti.jpg', dest: 'om-chapter.webp' },
    { src: 'work-scriptures.jpg', dest: 'manuscript-chapter.webp' },
    { src: 'work-gau-seva.jpg', dest: 'gau-chapter.webp' },
    { src: 'work-environment.jpg', dest: 'parijat-chapter.webp' },
    { src: 'gallery-ghat.jpg', dest: 'dhopap-chapter.webp' },
  ];

  for (const p of chapterPhotos) {
    const input = path.join(imagesDir, p.src);
    const output = path.join(storyDir, p.dest);
    if (fs.existsSync(input)) {
      await sharp(input)
        .resize({ width: 960, height: 720, fit: 'cover' })
        .webp({ quality: 85 })
        .toFile(output);
      console.log(`Generated chapter photo: ${p.dest} from ${p.src}`);
    }
  }

  console.log('Story assets generation complete!');
}

prepareStoryAssets().catch(console.error);
