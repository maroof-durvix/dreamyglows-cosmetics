const sharp = require('sharp');
const path = require('path');

async function analyzeLogo() {
  const inputPath = path.join(process.cwd(), 'public', 'logo.jpg');
  const image = sharp(inputPath);
  const { data, info } = await image.raw().toBuffer({ resolveWithObject: true });

  console.log(`Dimensions: ${info.width}x${info.height}, channels: ${info.channels}`);

  // Histogram of brightness
  let darkCount = 0;
  let brightCount = 0;
  let maxR = 0, maxG = 0, maxB = 0;

  for (let i = 0; i < data.length; i += info.channels) {
    const r = data[i], g = data[i+1], b = data[i+2];
    const bness = 0.299*r + 0.587*g + 0.114*b;
    if (bness < 30) darkCount++;
    if (bness > 100) brightCount++;
    if (r > maxR) maxR = r;
    if (g > maxG) maxG = g;
    if (b > maxB) maxB = b;
  }

  console.log('Total pixels:', info.width * info.height);
  console.log('Dark (<30) pixels:', darkCount, `(${(darkCount/(info.width*info.height)*100).toFixed(1)}%)`);
  console.log('Bright (>100) pixels:', brightCount, `(${(brightCount/(info.width*info.height)*100).toFixed(1)}%)`);
  console.log('Max RGB values in image:', maxR, maxG, maxB);
}

analyzeLogo();
