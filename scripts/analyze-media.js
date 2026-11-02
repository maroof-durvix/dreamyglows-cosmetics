const sharp = require('sharp');

async function analyzeMedia() {
  const filePath = 'C:\\Users\\hc\\.gemini\\antigravity\\brain\\625c591a-7dd7-43ee-84e0-e3439ef37bdf\\.user_uploaded\\media_1788332412592.jpg';
  const { data, info } = await sharp(filePath).raw().toBuffer({ resolveWithObject: true });

  console.log(`Dimensions: ${info.width}x${info.height}`);

  // Find all non-black pixels and their distribution
  const rowCounts = new Array(info.height).fill(0);
  const colCounts = new Array(info.width).fill(0);

  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const maxVal = Math.max(r, g, b);
      if (maxVal > 20) {
        rowCounts[y]++;
        colCounts[x]++;
      }
    }
  }

  // Print row activity ranges
  let activeRanges = [];
  let currentStart = null;
  for (let y = 0; y < info.height; y++) {
    if (rowCounts[y] > 5) {
      if (currentStart === null) currentStart = y;
    } else {
      if (currentStart !== null) {
        activeRanges.push({ start: currentStart, end: y - 1, totalRows: y - currentStart });
        currentStart = null;
      }
    }
  }
  if (currentStart !== null) activeRanges.push({ start: currentStart, end: info.height - 1, totalRows: info.height - currentStart });

  console.log('Active Y ranges with pixels:', activeRanges);

  // Let's check max width and height of all non-black pixels
  let minX = info.width, maxX = 0, minY = info.height, maxY = 0;
  for (let y = 0; y < info.height; y++) {
    for (let x = 0; x < info.width; x++) {
      const idx = (y * info.width + x) * info.channels;
      const r = data[idx], g = data[idx+1], b = data[idx+2];
      const maxVal = Math.max(r, g, b);
      if (maxVal > 15) {
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }

  console.log('Total content bounding box:', { minX, maxX, minY, maxY, width: maxX - minX + 1, height: maxY - minY + 1 });
}

analyzeMedia();
