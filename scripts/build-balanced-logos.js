const sharp = require('sharp');
const path = require('path');

async function buildBalancedLogos() {
  const filePath = 'C:\\Users\\hc\\.gemini\\antigravity\\brain\\625c591a-7dd7-43ee-84e0-e3439ef37bdf\\.user_uploaded\\media_1788332412592.jpg';
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });

  // 1. Monogram bounding box: x:[37..164], y:[157..282]
  // 2. Wordmark bounding box: x:[181..414], y:[218..255]
  
  // Extract Monogram with smooth alpha
  const monoWidth = 164 - 37 + 1; // 128
  const monoHeight = 282 - 157 + 1; // 126
  const monoBuf = Buffer.alloc(monoWidth * monoHeight * 4);

  for (let y = 0; y < monoHeight; y++) {
    for (let x = 0; x < monoWidth; x++) {
      const srcIdx = ((157 + y) * info.width + (37 + x)) * info.channels;
      const destIdx = (y * monoWidth + x) * 4;
      const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
      const maxVal = Math.max(r, g, b);
      if (maxVal < 15) {
        monoBuf[destIdx] = 0;
        monoBuf[destIdx+1] = 0;
        monoBuf[destIdx+2] = 0;
        monoBuf[destIdx+3] = 0;
      } else {
        const alpha = Math.min(255, Math.round((maxVal / 255) * 255 * 1.5));
        monoBuf[destIdx] = 255;
        monoBuf[destIdx+1] = 247;
        monoBuf[destIdx+2] = 248; // #FFF7F8 ivory white
        monoBuf[destIdx+3] = alpha;
      }
    }
  }

  // Extract Wordmark with smooth alpha
  const wordWidth = 414 - 181 + 1; // 234
  const wordHeight = 255 - 218 + 1; // 38
  const wordBuf = Buffer.alloc(wordWidth * wordHeight * 4);

  for (let y = 0; y < wordHeight; y++) {
    for (let x = 0; x < wordWidth; x++) {
      const srcIdx = ((218 + y) * info.width + (181 + x)) * info.channels;
      const destIdx = (y * wordWidth + x) * 4;
      const r = data[srcIdx], g = data[srcIdx+1], b = data[srcIdx+2];
      const maxVal = Math.max(r, g, b);
      if (maxVal < 15) {
        wordBuf[destIdx] = 0;
        wordBuf[destIdx+1] = 0;
        wordBuf[destIdx+2] = 0;
        wordBuf[destIdx+3] = 0;
      } else {
        const alpha = Math.min(255, Math.round((maxVal / 255) * 255 * 1.6));
        wordBuf[destIdx] = 255;
        wordBuf[destIdx+1] = 247;
        wordBuf[destIdx+2] = 248; // #FFF7F8 ivory white
        wordBuf[destIdx+3] = alpha;
      }
    }
  }

  // Resize Monogram to target height 80px
  const targetEmblemHeight = 80;
  const targetEmblemWidth = Math.round(monoWidth * (targetEmblemHeight / monoHeight));
  const emblemResized = await sharp(monoBuf, { raw: { width: monoWidth, height: monoHeight, channels: 4 } })
    .resize(targetEmblemWidth, targetEmblemHeight, { fit: 'contain' })
    .png()
    .toBuffer();

  // Resize Wordmark to target height 42px (crystal clear and perfectly legible!)
  const targetWordHeight = 42;
  const targetWordWidth = Math.round(wordWidth * (targetWordHeight / wordHeight));
  const wordResized = await sharp(wordBuf, { raw: { width: wordWidth, height: wordHeight, channels: 4 } })
    .resize(targetWordWidth, targetWordHeight, { fit: 'contain' })
    .png()
    .toBuffer();

  // Composite them side by side on a transparent canvas
  const gap = 18;
  const totalWidth = targetEmblemWidth + gap + targetWordWidth + 24; // with padding
  const totalHeight = targetEmblemHeight + 16;

  const canvas = sharp({
    create: {
      width: totalWidth,
      height: totalHeight,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  const emblemTop = Math.round((totalHeight - targetEmblemHeight) / 2);
  const wordTop = Math.round((totalHeight - targetWordHeight) / 2);

  const finalLogo = await canvas.composite([
    { input: emblemResized, left: 12, top: emblemTop },
    { input: wordResized, left: 12 + targetEmblemWidth + gap, top: wordTop }
  ]).png().toBuffer();

  // Save to public/logo-navbar-plum.png (Ivory #FFF7F8 for Dark Plum Navbar)
  const navLogoPath = path.join(process.cwd(), 'public', 'logo-navbar-plum.png');
  await sharp(finalLogo).toFile(navLogoPath);
  console.log('Saved logo-navbar-plum.png, dimensions:', totalWidth, 'x', totalHeight);

  // Also create brand-emerald version for light mode
  const { data: finalData, info: finalInfo } = await sharp(finalLogo).raw().toBuffer({ resolveWithObject: true });
  const emeraldBuf = Buffer.alloc(finalData.length);
  for (let i = 0; i < finalData.length; i += 4) {
    const a = finalData[i + 3];
    if (a < 10) {
      emeraldBuf[i] = 0; emeraldBuf[i+1] = 0; emeraldBuf[i+2] = 0; emeraldBuf[i+3] = 0;
    } else {
      // Emerald brand #1b4d3e (27, 77, 62)
      emeraldBuf[i] = 27;
      emeraldBuf[i+1] = 77;
      emeraldBuf[i+2] = 62;
      emeraldBuf[i+3] = a;
    }
  }
  await sharp(emeraldBuf, { raw: { width: finalInfo.width, height: finalInfo.height, channels: 4 } })
    .png()
    .toFile(path.join(process.cwd(), 'public', 'logo.png'));
  console.log('Saved updated public/logo.png with balanced full brand name');

  // Also update logo-white.png
  await sharp(finalLogo).toFile(path.join(process.cwd(), 'public', 'logo-white.png'));
  console.log('Saved updated public/logo-white.png');
}

buildBalancedLogos().catch(console.error);
