const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function buildBanners() {
  const bannersDir = path.join(process.cwd(), 'public', 'banners');
  if (!fs.existsSync(bannersDir)) fs.mkdirSync(bannersDir, { recursive: true });

  const BANNER_WIDTH = 1600;
  const BANNER_HEIGHT = 600;

  // -------------------------------------------------------------
  // 1. BANNER 1: Dr. AR OLIV-E-C Whitening Active Concentrate
  // Uses the user's authentic wide banner 1788334525442.png (1792 x 592)
  // We fit it inside 1600x600 with matching dark green marble ambient borders
  // -------------------------------------------------------------
  const olivBannerSource = path.join(process.cwd(), 'public', 'Pictures', '1788334525442.png');
  
  // Resize to 1540x508 so there is 30px safe padding on all sides
  const olivPadded = await sharp(olivBannerSource)
    .resize(1540, 516, { fit: 'contain', background: { r: 8, g: 26, b: 18, alpha: 255 } })
    .toBuffer();

  await sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 8, g: 26, b: 18, alpha: 255 }
    }
  })
    .composite([
      { input: olivPadded, left: 30, top: 42 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-oliv-e-c.jpg'));

  console.log('✓ Created banner-oliv-e-c.jpg with 100% safe borders');

  // -------------------------------------------------------------
  // 2. BANNER 2: Dr. AR Mak Mandelic Acid Serum
  // Uses the gold bottle & box photo IMG-20260901-WA0076.jpg
  // -------------------------------------------------------------
  const makSource = path.join(process.cwd(), 'public', 'Pictures', 'IMG-20260901-WA0076.jpg');
  const makBottle = await sharp(makSource)
    .resize(440, 520, { fit: 'cover' })
    .toBuffer();

  const makSvg = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="makGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#082115"/>
          <stop offset="35%" stop-color="#0b2c1d"/>
          <stop offset="100%" stop-color="#14432c"/>
        </linearGradient>
        <radialGradient id="goldGlow" cx="20%" cy="50%" r="40%">
          <stop offset="0%" stop-color="#d4af37" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="#082115" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#makGrad)"/>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#goldGlow)"/>

      <!-- Tagline -->
      <text x="560" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#e5c058" letter-spacing="4">RENEW • SMOOTH • REVEAL</text>
      
      <!-- Main Title -->
      <text x="560" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="1">Dr.AR MAK MANDELIC ACID</text>
      
      <!-- Subtitle -->
      <text x="560" y="260" font-family="Georgia, serif" font-size="27" font-style="italic" fill="#a7f3d0">20% Mandelic Acid &amp; 2% Hyaluronic Acid Duo (30ml)</text>
      
      <!-- Clinical Bullets -->
      <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" fill="#d2e8db" font-weight="600">
        <text x="560" y="325">&#10003; High-Potency Gentle Cellular Exfoliation</text>
        <text x="560" y="365">&#10003; Fades Post-Acne Scars, Dark Spots &amp; Blemishes</text>
        <text x="560" y="405">&#10003; Deep Hyaluronic Hydration • Dermatologist Verified</text>
      </g>

      <!-- Shop Now Button -->
      <g transform="translate(560, 445)">
        <rect width="210" height="54" rx="14" fill="#76a713"/>
        <text x="105" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">SHOP NOW &#8594;</text>
      </g>
    </svg>
  `);

  await sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 8, g: 33, b: 21, alpha: 255 }
    }
  })
    .composite([
      { input: makSvg, left: 0, top: 0 },
      { input: makBottle, left: 60, top: 40 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-mak.jpg'));

  console.log('✓ Created banner-mak.jpg with 100% safe borders');

  // -------------------------------------------------------------
  // 3. BANNER 3: Dr. AR EYE-S Eye Protect Shampoo
  // Uses the 150ml pump bottle photo IMG-20260901-WA0074.jpg
  // -------------------------------------------------------------
  const eyeSSource = path.join(process.cwd(), 'public', 'Pictures', 'IMG-20260901-WA0074.jpg');
  const eyeSBottle = await sharp(eyeSSource)
    .resize(400, 520, { fit: 'cover' })
    .toBuffer();

  const eyeSSvg = Buffer.from(`
    <svg width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" viewBox="0 0 ${BANNER_WIDTH} ${BANNER_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="eyeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#082115"/>
          <stop offset="35%" stop-color="#0c2e1f"/>
          <stop offset="100%" stop-color="#14432c"/>
        </linearGradient>
        <radialGradient id="greenGlow" cx="20%" cy="50%" r="40%">
          <stop offset="0%" stop-color="#76a713" stop-opacity="0.30"/>
          <stop offset="100%" stop-color="#082115" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#eyeGrad)"/>
      <rect width="${BANNER_WIDTH}" height="${BANNER_HEIGHT}" fill="url(#greenGlow)"/>

      <!-- Tagline -->
      <text x="540" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#76a713" letter-spacing="4">GENTLE OCULAR HYGIENE</text>
      
      <!-- Main Title -->
      <text x="540" y="210" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#ffffff" letter-spacing="1">Dr.AR EYE-S EYE SHAMPOO</text>
      
      <!-- Subtitle -->
      <text x="540" y="260" font-family="Georgia, serif" font-size="27" font-style="italic" fill="#a7f3d0">With Vitamin A, E &amp; C • 150ml Foam Dispenser</text>
      
      <!-- Clinical Bullets -->
      <g font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="17" fill="#d2e8db" font-weight="600">
        <text x="540" y="325">&#10003; 100% Paraben, Salt &amp; Sulfate Free</text>
        <text x="540" y="365">&#10003; Non-Stinging Daily Eyelid &amp; Lash Foam Cleanser</text>
        <text x="540" y="405">&#10003; Ophthalmologist Tested &amp; Physiological pH Balanced</text>
      </g>

      <!-- Shop Now Button -->
      <g transform="translate(540, 445)">
        <rect width="210" height="54" rx="14" fill="#76a713"/>
        <text x="105" y="34" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#ffffff" text-anchor="middle" letter-spacing="2">SHOP NOW &#8594;</text>
      </g>
    </svg>
  `);

  await sharp({
    create: {
      width: BANNER_WIDTH,
      height: BANNER_HEIGHT,
      channels: 4,
      background: { r: 8, g: 33, b: 21, alpha: 255 }
    }
  })
    .composite([
      { input: eyeSSvg, left: 0, top: 0 },
      { input: eyeSBottle, left: 70, top: 40 }
    ])
    .jpeg({ quality: 95 })
    .toFile(path.join(bannersDir, 'banner-eye-s.jpg'));

  console.log('✓ Created banner-eye-s.jpg with 100% safe borders');
}

buildBanners().catch(console.error);
