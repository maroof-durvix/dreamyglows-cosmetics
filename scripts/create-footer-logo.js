const sharp = require('sharp');
const path = require('path');

async function createFooterLogo() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.png');
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const buffer = Buffer.alloc(width * height * 4);

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i], g = data[i + 1], b = data[i + 2], a = data[i + 3];

    if (a < 10) {
      buffer[i] = 0;
      buffer[i + 1] = 0;
      buffer[i + 2] = 0;
      buffer[i + 3] = 0;
    } else {
      // Convert to clean ivory / gold / white for dark backgrounds
      buffer[i] = 255;
      buffer[i + 1] = 255;
      buffer[i + 2] = 255;
      buffer[i + 3] = a;
    }
  }

  const outputPath = path.join(process.cwd(), 'public', 'logo-white.png');
  await sharp(buffer, { raw: { width, height, channels: 4 } })
    .png({ quality: 100 })
    .toFile(outputPath);

  console.log('Saved logo-white.png for dark backgrounds');
}

createFooterLogo().catch(console.error);
