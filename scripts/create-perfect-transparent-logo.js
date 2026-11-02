const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function createPerfectLogo() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.jpg');
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const width = info.width;
  const height = info.height;

  console.log(`Analyzing logo pixels: ${width}x${height}`);

  // Find bounding box of emblem
  let minX = width, maxX = 0, minY = height, maxY = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const bness = 0.299 * r + 0.587 * g + 0.114 * b;
      if (bness > 35) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log(`Emblem Bounding Box: x:[${minX}..${maxX}], y:[${minY}..${maxY}], width:${maxX - minX + 1}, height:${maxY - minY + 1}`);

  // Create Version 1: Original Brand Green Emblem with Background Removed (Smooth alpha from black)
  // Since background is black (0,0,0), brightness represents transparency!
  const transparentBuffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const r = data[idx], g = data[idx + 1], b = data[idx + 2];
      const maxVal = Math.max(r, g, b);
      const bness = 0.299 * r + 0.587 * g + 0.114 * b;

      if (maxVal < 15) {
        // Pure black background -> 100% transparent
        transparentBuffer[idx] = 0;
        transparentBuffer[idx + 1] = 0;
        transparentBuffer[idx + 2] = 0;
        transparentBuffer[idx + 3] = 0;
      } else {
        // Calculate alpha based on luminance and color intensity
        const alpha = Math.min(255, Math.round((maxVal / 255) * 255 * 1.6));
        
        // Normalize colors so they don't look muddy when rendered against white
        const scale = 255 / Math.max(maxVal, 1);
        const normR = Math.min(255, Math.round(r * scale));
        const normG = Math.min(255, Math.round(g * scale));
        const normB = Math.min(255, Math.round(b * scale));

        transparentBuffer[idx] = normR;
        transparentBuffer[idx + 1] = normG;
        transparentBuffer[idx + 2] = normB;
        transparentBuffer[idx + 3] = alpha;
      }
    }
  }

  // Save Full Frame Transparent
  const fullTransparentPath = path.join(process.cwd(), 'public', 'logo-full-transparent.png');
  await sharp(transparentBuffer, {
    raw: { width, height, channels: 4 }
  })
    .png({ quality: 100 })
    .toFile(fullTransparentPath);

  // Crop tight with 12px clean padding
  const pad = 12;
  const cropLeft = Math.max(0, minX - pad);
  const cropTop = Math.max(0, minY - pad);
  const cropWidth = Math.min(width - cropLeft, (maxX - minX) + pad * 2);
  const cropHeight = Math.min(height - cropTop, (maxY - minY) + pad * 2);

  const croppedTransparentPath = path.join(process.cwd(), 'public', 'logo.png');
  
  await sharp(fullTransparentPath)
    .extract({ left: cropLeft, top: cropTop, width: cropWidth, height: cropHeight })
    .png({ quality: 100 })
    .toFile(croppedTransparentPath);

  console.log(`Saved transparent trimmed logo to: ${croppedTransparentPath}`);
}

createPerfectLogo().catch(console.error);
