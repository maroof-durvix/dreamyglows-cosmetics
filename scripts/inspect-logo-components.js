const sharp = require('sharp');
const path = require('path');

async function inspectLogoComponents() {
  const filePath = 'C:\\Users\\hc\\.gemini\\antigravity\\brain\\625c591a-7dd7-43ee-84e0-e3439ef37bdf\\.user_uploaded\\media_1788332412592.jpg';
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });

  // Monogram is on the left, Wordmark is on the right
  // Let's find column boundaries
  const colActivity = new Array(info.width).fill(0);
  for (let x = 0; x < info.width; x++) {
    for (let y = 0; y < info.height; y++) {
      const idx = (y * info.width + x) * info.channels;
      if (Math.max(data[idx], data[idx+1], data[idx+2]) > 25) {
        colActivity[x]++;
      }
    }
  }

  // Find gap between monogram and text
  console.log('Column activity around x=150 to 220:');
  for (let x = 150; x <= 220; x++) {
    console.log(`x=${x}: count=${colActivity[x]}`);
  }
}

inspectLogoComponents();
