const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function createPerfectBanners() {
  const uploadDir = 'C:/Users/Dw/.gemini/antigravity-ide/brain/b80e2049-a205-4b55-b4ab-4925bcdcbcea/.user_uploaded';
  const bannersDir = path.join(process.cwd(), 'public', 'banners');
  const productsDir = path.join(process.cwd(), 'public', 'products');

  if (!fs.existsSync(bannersDir)) fs.mkdirSync(bannersDir, { recursive: true });
  if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

  const olivECRaw = path.join(uploadDir, 'media_1788354648176.jpg');
  const makRaw = path.join(uploadDir, 'media_1788354683062.jpg');
  const olivBannerRaw = path.join(uploadDir, 'media_1788355200338.png'); // 1024 x 338
  const eyeSRaw = path.join(uploadDir, 'media_1788355212519.jpg'); // 768 x 1024

  const BANNER_WIDTH = 1600;
  const BANNER_HEIGHT = 600;

  // =========================================================================
  // 1. BANNER 1: Dr. AR OLIV-E-C (Fit complete graphic banner with zero cut)
  // =========================================================================
  // Resize the 1024x338 graphic to fit comfortably inside 1600x600 with safe padding
  const olivBannerPadded = await sharp(olivBannerRaw)
    .resize(1500, 520, { fit: 'contain', background: { r: 10, g: 30, b: 20, alpha: 255 } })
    .toBuffer();

  const olivCanvas = sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 10, g: 30, b: 20, alpha: 255 } // matching dark green marble base
    }
  });

  await olivCanvas
    .composite([
      { input: olivBannerPadded, left: 50, top: 40 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-oliv-e-c.jpg'));
  console.log('✓ Created perfect banner-oliv-e-c.jpg with zero cutoffs');

  // =========================================================================
  // 2. BANNER 2: Dr. AR Mak Mandelic Acid (Matching Golden Luxury Banner)
  // =========================================================================
  const makBottleResized = await sharp(makRaw)
    .resize(540, 540, { fit: 'contain', background: { r: 10, g: 30, b: 20, alpha: 0 } })
    .png()
    .toBuffer();

  const makSvg = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="makBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0a2317"/>
          <stop offset="45%" stop-color="#0e3020"/>
          <stop offset="100%" stop-color="#143e2a"/>
        </linearGradient>
        <radialGradient id="makGoldGlow" cx="25%" cy="50%" r="40%">
          <stop offset="0%" stop-color="#d4af37" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#makBg)"/>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#makGoldGlow)"/>

      <!-- Top Tagline -->
      <text x="680" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#d4af37" letter-spacing="5">RENEW. SMOOTH. REVEAL.</text>
      
      <!-- Main Title -->
      <text x="680" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="1">Dr.AR MAK MANDELIC</text>
      
      <!-- Subtitle -->
      <text x="680" y="260" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#e6ca65">20% Mandelic Acid &amp; 2% Hyaluronic Acid (30ml)</text>
      
      <!-- Key Bullet Points -->
      <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" fill="#d2e8db" font-weight="600">
        <text x="680" y="325">&#10003; High-Potency Gentle Cellular Exfoliation</text>
        <text x="680" y="365">&#10003; Clears Acne, Texture &amp; Minimizes Pores</text>
        <text x="680" y="405">&#10003; Deep Moisture Plumping Without Irritation</text>
      </g>

      <!-- CTA Button -->
      <g transform="translate(680, 445)">
        <rect width="210" height="56" rx="14" fill="#76a713"/>
        <text x="105" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">SHOP NOW &#8594;</text>
      </g>
    </svg>
  `);

  const makCanvas = sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 10, g: 30, b: 20, alpha: 255 }
    }
  });

  await makCanvas
    .composite([
      { input: makSvg, left: 0, top: 0 },
      { input: makBottleResized, left: 80, top: 30 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-mak.jpg'));
  console.log('✓ Created perfect banner-mak.jpg with zero cutoffs');

  // =========================================================================
  // 3. BANNER 3: Dr. AR EYE-S Shampoo (Fresh Botanical & Clear Ocular Hygiene)
  // =========================================================================
  const eyeSBottleResized = await sharp(eyeSRaw)
    .resize(460, 540, { fit: 'contain', background: { r: 10, g: 30, b: 20, alpha: 0 } })
    .png()
    .toBuffer();

  const eyeSSvg = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eyeBg" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#0a2317"/>
          <stop offset="40%" stop-color="#0d281a"/>
          <stop offset="100%" stop-color="#143e2a"/>
        </linearGradient>
        <radialGradient id="eyeGreenGlow" cx="25%" cy="50%" r="40%">
          <stop offset="0%" stop-color="#76a713" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#eyeBg)"/>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#eyeGreenGlow)"/>

      <!-- Top Tagline -->
      <text x="680" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#76a713" letter-spacing="5">GENTLE OCULAR HYGIENE</text>
      
      <!-- Main Title -->
      <text x="680" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="1">Dr.AR EYE-S SHAMPOO</text>
      
      <!-- Subtitle -->
      <text x="680" y="260" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#a7f3d0">With Vitamin A, E &amp; C • 150ml Foam Dispenser</text>
      
      <!-- Key Bullet Points -->
      <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="18" fill="#d2e8db" font-weight="600">
        <text x="680" y="325">&#10003; 100% Paraben, Salt &amp; Sulfate Free</text>
        <text x="680" y="365">&#10003; Gentle Daily Eyelid &amp; Lash Cleansing</text>
        <text x="680" y="405">&#10003; Non-Stinging, Soothing &amp; Ophthalmologist Tested</text>
      </g>

      <!-- CTA Button -->
      <g transform="translate(680, 445)">
        <rect width="210" height="56" rx="14" fill="#76a713"/>
        <text x="105" y="35" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="3">SHOP NOW &#8594;</text>
      </g>
    </svg>
  `);

  const eyeSCanvas = sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 10, g: 30, b: 20, alpha: 255 }
    }
  });

  await eyeSCanvas
    .composite([
      { input: eyeSSvg, left: 0, top: 0 },
      { input: eyeSBottleResized, left: 100, top: 30 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-eye-s.jpg'));
  console.log('✓ Created perfect banner-eye-s.jpg with zero cutoffs');

  // =========================================================================
  // 4. PRODUCT CARDS: Clean, Centered, Proportional Square Formats (800x800)
  // =========================================================================
  // OLIV-E-C Card
  await sharp(olivECRaw)
    .resize(800, 800, { fit: 'contain', background: '#0a2317' })
    .jpeg({ quality: 92 })
    .toFile(path.join(productsDir, 'dr-ar-oliv-e-c.jpg'));

  // Mak Card
  await sharp(makRaw)
    .resize(800, 800, { fit: 'contain', background: '#0a2317' })
    .jpeg({ quality: 92 })
    .toFile(path.join(productsDir, 'dr-ar-mak.jpg'));

  // EYE-S Card
  await sharp(eyeSRaw)
    .resize(800, 800, { fit: 'contain', background: '#ffffff' })
    .jpeg({ quality: 92 })
    .toFile(path.join(productsDir, 'dr-ar-eye-s.jpg'));

  console.log('✓ All product card assets generated with perfect proportions.');
}

createPerfectBanners().catch(console.error);
