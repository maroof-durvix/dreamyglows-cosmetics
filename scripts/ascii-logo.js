const sharp = require('sharp');

async function asciiPreview() {
  const filePath = 'C:\\Users\\hc\\.gemini\\antigravity\\brain\\625c591a-7dd7-43ee-84e0-e3439ef37bdf\\.user_uploaded\\media_1788332412592.jpg';
  // resize to 80x25 to print in terminal
  const { data, info } = await sharp(filePath)
    .extract({ left: 35, top: 155, width: 380, height: 130 })
    .resize(100, 30, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let out = '';
  for (let y = 0; y < info.height; y++) {
    let row = '';
    for (let x = 0; x < info.width; x++) {
      const val = data[y * info.width + x];
      row += val > 60 ? '#' : ' ';
    }
    out += row + '\n';
  }
  console.log(out);
}

asciiPreview();
