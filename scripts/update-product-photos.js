const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function updateProductPhotos() {
  const uploadDir = 'C:/Users/Dw/.gemini/antigravity-ide/brain/b80e2049-a205-4b55-b4ab-4925bcdcbcea/.user_uploaded';
  const productsDir = path.join(process.cwd(), 'public', 'products');

  if (!fs.existsSync(productsDir)) fs.mkdirSync(productsDir, { recursive: true });

  const eyeSNew = path.join(uploadDir, 'media_1788356797144.jpg');
  const makNew = path.join(uploadDir, 'media_1788356819340.jpg');
  const olivECNew = path.join(uploadDir, 'media_1788356833243.jpg');

  // 1. Dr. AR OLIV-E-C Whitening Active Concentrate (Image 3: Silver Cap Bottle + Box on marble vanity)
  await sharp(olivECNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-oliv-e-c.jpg'));
  
  await sharp(olivECNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-oliv-e-c-full.jpg'));
  console.log('✓ Updated Dr. AR OLIV-E-C photo');

  // 2. Dr. AR Mak Mandelic Acid Serum (Image 2: Gold Cap Bottle + Box on marble vanity)
  await sharp(makNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-mak.jpg'));

  await sharp(makNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-mak-full.jpg'));
  console.log('✓ Updated Dr. AR Mak Mandelic Acid photo');

  // 3. Dr. AR EYE-S Eye Protect Shampoo (Image 1: 150ml pump bottle on bathroom vanity with flowers)
  await sharp(eyeSNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-eye-s.jpg'));

  await sharp(eyeSNew)
    .jpeg({ quality: 95 })
    .toFile(path.join(productsDir, 'dr-ar-eye-s-full.jpg'));
  console.log('✓ Updated Dr. AR EYE-S Shampoo photo');
}

updateProductPhotos().catch(console.error);
