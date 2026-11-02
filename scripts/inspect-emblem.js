const sharp = require('sharp');
const path = require('path');

async function inspectEmblemPixels() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.jpg');
  const { data, info } = await sharp(inputPath).raw().toBuffer({ resolveWithObject: true });

  const nonBlackPixels = [];

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const bness = 0.299*r + 0.587*g + 0.114*b;
      if (bness > 60) {
        nonBlackPixels.push({ x, y, r, g, b, bness });
      }
    }
  }

  console.log('Total non-black pixels (>60):', nonBlackPixels.length);
  // Print average color of the emblem
  let sumR = 0, sumG = 0, sumB = 0;
  for (const p of nonBlackPixels) {
    sumR += p.r;
    sumG += p.g;
    sumB += p.b;
  }
  const avgR = Math.round(sumR / nonBlackPixels.length);
  const avgG = Math.round(sumG / nonBlackPixels.length);
  const avgB = Math.round(sumB / nonBlackPixels.length);
  console.log('Average emblem color [R, G, B]:', [avgR, avgG, avgB]);

  // Sample 10 emblem pixels
  console.log('Sample 10 emblem pixels:', nonBlackPixels.slice(100, 110));
}

inspectEmblemPixels();
