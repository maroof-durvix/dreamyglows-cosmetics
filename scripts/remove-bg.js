const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function processLogo() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.png');
  const outputPath = path.join(process.cwd(), 'public', 'logo-transparent.png');

  // Load raw RGBA
  const image = sharp(inputPath);
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;
  const channels = info.channels; // 4 (RGBA)

  console.log(`Processing logo: ${width}x${height}, channels: ${channels}`);

  // Inspect corner background color
  const getPixel = (x, y) => {
    const idx = (y * width + x) * channels;
    return {
      r: data[idx],
      g: data[idx + 1],
      b: data[idx + 2],
      a: data[idx + 3]
    };
  };

  const corners = [
    getPixel(0, 0),
    getPixel(width - 1, 0),
    getPixel(0, height - 1),
    getPixel(width - 1, height - 1),
    getPixel(10, 10),
    getPixel(width - 11, 10)
  ];

  console.log('Corner sample pixels:', corners);

  // Background is near-white or light off-white (e.g., r > 230, g > 230, b > 230)
  // Let's create an alpha mask with soft edge anti-aliasing!
  const outputBuffer = Buffer.alloc(width * height * 4);

  // Find min/max bounds of actual logo content for auto-trimming
  let minX = width, maxX = 0, minY = height, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Calculate brightness / lightness
      // If the pixel is dark or colored (the logo monogram & text are dark gold/black/green)
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      // Color distance from pure white (255, 255, 255)
      const distFromWhite = Math.sqrt(
        Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
      );

      let alpha = 255;

      // Smooth alpha transition:
      // If it's very close to white (brightness > 248 or distFromWhite < 18), make it 100% transparent
      // If it's between 225 and 248, calculate smooth antialiased alpha
      if (brightness >= 245 || distFromWhite <= 20) {
        alpha = 0;
      } else if (brightness >= 210) {
        // Linear interpolation for soft anti-aliased edges
        const t = (brightness - 210) / (245 - 210);
        alpha = Math.round(255 * (1 - t));
      } else {
        alpha = 255;
      }

      // Check content bounding box for solid pixels
      if (alpha > 30) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      outputBuffer[idx] = r;
      outputBuffer[idx + 1] = g;
      outputBuffer[idx + 2] = b;
      outputBuffer[idx + 3] = alpha;
    }
  }

  console.log(`Content bounding box: x:[${minX}..${maxX}], y:[${minY}..${maxY}]`);

  // Save the transparent PNG
  await sharp(outputBuffer, {
    raw: { width, height, channels: 4 }
  })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);

  // Also save a trimmed version with a clean 16px padding
  const pad = 12;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(height - cropTop, (maxY - minY) + pad * 2);

  const trimmedPath = path.join(process.cwd(), 'public', 'logo-transparent-trimmed.png');

  await sharp(outputPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(trimmedPath);

  // Overwrite public/logo.png with the transparent trimmed high-res logo!
  fs.copyFileSync(trimmedPath, path.join(process.cwd(), 'public', 'logo.png'));

  console.log('Transparent logo created successfully at public/logo.png and public/logo-transparent.png');
}

processLogo().catch(console.error);
