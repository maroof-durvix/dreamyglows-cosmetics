const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function processUserAssets() {
  const uploadDir = 'C:/Users/Dw/.gemini/antigravity-ide/brain/b80e2049-a205-4b55-b4ab-4925bcdcbcea/.user_uploaded';
  const publicDir = path.join(process.cwd(), 'public');
  const productsDir = path.join(publicDir, 'products');
  const bannersDir = path.join(publicDir, 'banners');

  if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });
  if (!fs.existsSync(bannersDir)) fs.mkdirSync(bannersDir, { recursive: true });

  const olivECPath = path.join(uploadDir, 'media_1788354648176.jpg');
  const makPath = path.join(uploadDir, 'media_1788354683062.jpg');
  const olivBannerPath = path.join(uploadDir, 'media_1788355200338.png');
  const eyeSPath = path.join(uploadDir, 'media_1788355212519.jpg');

  // 1. Copy & process Product 1: Dr. AR OLIV-E-C
  await sharp(olivECPath)
    .resize(800, 800, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'dr-ar-oliv-e-c.jpg'));
  
  // Full view
  await sharp(olivECPath)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-oliv-e-c-full.jpg'));
  console.log('Processed Dr. AR OLIV-E-C');

  // 2. Copy & process Product 2: Dr. AR Mak Mandelic Acid Serum
  await sharp(makPath)
    .resize(800, 800, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'dr-ar-mak.jpg'));

  await sharp(makPath)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-mak-full.jpg'));
  console.log('Processed Dr. AR Mak');

  // 3. Copy & process Product 3: Dr. AR EYE-S Eye Protect Shampoo
  await sharp(eyeSPath)
    .resize(800, 800, { fit: 'contain', background: '#f5f4ef' })
    .jpeg({ quality: 90 })
    .toFile(path.join(productsDir, 'dr-ar-eye-s.jpg'));

  await sharp(eyeSPath)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-eye-s-full.jpg'));
  console.log('Processed Dr. AR EYE-S');

  // 4. Banners:
  // Banner 1: Dr. AR OLIV-E-C (Direct from user)
  await sharp(olivBannerPath)
    .resize(1200, 450, { fit: 'cover' })
    .png({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-oliv-e-c.png'));

  // Banner 2: Dr. AR Mak Mandelic Acid banner matching the luxury marble style
  // Extract bottle and construct banner or resize Mak image into 1200x450
  await sharp(makPath)
    .resize(1200, 450, { fit: 'cover', position: 'center' })
    .jpeg({ quality: 90 })
    .toFile(path.join(bannersDir, 'banner-mak.jpg'));

  // Banner 3: Dr. AR EYE-S Shampoo Banner
  const eyeSResized = await sharp(eyeSPath)
    .resize(380, 420, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const eyeSBannerCanvas = sharp({
    create: {
      width: 1200,
      height: 450,
      channels: 4,
      background: { r: 13, g: 40, b: 26, alpha: 255 } // Deep pine green
    }
  });

  // Create clean SVG overlay for text
  const svgText = Buffer.from(`
    <svg width="1200" height="450" viewBox="0 0 1200 450" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0a2317" stop-opacity="0.95"/>
          <stop offset="60%" stop-color="#0d281a" stop-opacity="0.85"/>
          <stop offset="100%" stop-color="#143e2a" stop-opacity="0.95"/>
        </linearGradient>
      </defs>
      <rect width="1200" height="450" fill="url(#g1)"/>
      <circle cx="1000" cy="225" r="220" fill="#76a713" opacity="0.12" filter="blur(40px)"/>
      <text x="520" y="110" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#76a713" letter-spacing="4">GENTLE OCULAR CLEANSING</text>
      <text x="520" y="165" font-family="Arial, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="1">Dr.AR EYE-S</text>
      <text x="520" y="210" font-family="Georgia, serif" font-size="28" font-style="italic" fill="#a7f3d0">Eye Protect Shampoo (150ml)</text>
      <text x="520" y="260" font-family="Arial, sans-serif" font-size="16" fill="#e2f0e8">With Vitamin A, E &amp; C • Paraben &amp; Salt Free • Gentle To Eyes</text>
      <text x="520" y="295" font-family="Arial, sans-serif" font-size="14" fill="#a8d1ba">✓ Deep Eyelid Hygiene  ✓ Reduces Irritation  ✓ Non-Stinging Formula</text>
      <rect x="520" y="335" width="180" height="50" rx="12" fill="#76a713"/>
      <text x="610" y="366" font-family="Arial, sans-serif" font-size="15" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="2">SHOP NOW &#8594;</text>
    </svg>
  `);

  await eyeSBannerCanvas
    .composite([
      { input: svgText, left: 0, top: 0 },
      { input: eyeSResized, left: 90, top: 15 }
    ])
    .jpeg({ quality: 90 })
    .toFile(path.join(bannersDir, 'banner-eye-s.jpg'));

  console.log('Generated all banners successfully!');
}

processUserAssets().catch(console.error);
