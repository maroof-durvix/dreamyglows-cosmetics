const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const uploadDir = 'C:\\Users\\hc\\.gemini\\antigravity\\brain\\625c591a-7dd7-43ee-84e0-e3439ef37bdf\\.user_uploaded';

async function checkUploads() {
  if (fs.existsSync(uploadDir)) {
    const files = fs.readdirSync(uploadDir);
    for (const f of files) {
      const fullPath = path.join(uploadDir, f);
      const meta = await sharp(fullPath).metadata();
      console.log('UPLOADED FILE:', f, meta.width, 'x', meta.height, meta.format);
    }
  }
}

checkUploads();
