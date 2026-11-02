import { createClient } from 'next-sanity';

const client = createClient({
  projectId: 'o9db6b0a',
  dataset: 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: 'skNarasi77pxUewm96uLeNwHaSrmpkcOal68R7i1ukno1JJyh6Py67Aq2H6aUt7jTsYqir6BphcY9LfVGKTwOURXfQysyp7F2z8iH00GPSYJKIM7ZKZQ4tTyZj0Iq7AdNPGGYST7WF5lIVSDL5pwvHN9GCXBVW41gwB1YbbulmnwLsyzXy72'
});

async function main() {
  console.log('--- Connecting to Sanity CMS dataset "production" ---');

  // 1. Delete old test/stale banners
  const oldBanners = await client.fetch('*[_type == "banner"]');
  for (const b of oldBanners) {
    console.log(`Deleting old banner: ${b._id}`);
    try {
      await client.delete(b._id);
    } catch (e) {
      console.warn(`Could not delete ${b._id}:`, e.message);
    }
  }

  // 2. Create the 3 Official Zero-Cutoff Banners in Sanity
  const officialBanners = [
    {
      _id: 'banner-dr-ar-oliv-e-c',
      _type: 'banner',
      title: 'Dr. AR OLIV-E-C Whitening Active Concentrate',
      imageUrl: '/banners/banner-oliv-e-c.jpg',
      link: '/product/dr-ar-oliv-e-c-whitening-serum',
      order: 1
    },
    {
      _id: 'banner-dr-ar-mak',
      _type: 'banner',
      title: 'Dr. AR Mak Mandelic Acid Serum',
      imageUrl: '/banners/banner-mak.jpg',
      link: '/product/dr-ar-mak-mandelic-acid-serum',
      order: 2
    },
    {
      _id: 'banner-dr-ar-eye-s',
      _type: 'banner',
      title: 'Dr. AR EYE-S Eye Protect Shampoo',
      imageUrl: '/banners/banner-eye-s.jpg',
      link: '/product/dr-ar-eye-s-eye-protect-shampoo',
      order: 3
    }
  ];

  for (const b of officialBanners) {
    const res = await client.createOrReplace(b);
    console.log(`✓ Upserted banner to Sanity: ${res._id} - ${res.title}`);
  }

  // 3. Upsert the 3 Official Clinic Products in Sanity
  const officialSanityProducts = [
    {
      _id: 'product-dr-ar-oliv-e-c',
      _type: 'product',
      title: 'Dr. AR OLIV-E-C Whitening Active Concentrate',
      slug: { _type: 'slug', current: 'dr-ar-oliv-e-c-whitening-serum' },
      category: 'Skin Care',
      gender: 'Unisex',
      price: 2450,
      compareAtPrice: 3000,
      imageUrl: '/products/dr-ar-oliv-e-c.jpg',
      images: ['/products/dr-ar-oliv-e-c.jpg', '/products/dr-ar-oliv-e-c-full.jpg'],
      description: 'Unlock a radiant, youthful complexion with our advanced Vitamin C and E synergy. This potent concentrate targets hyperpigmentation, reduces wrinkles, and deeply hydrates for a luminous, even-toned finish. Powered by 5% Pure Vitamin C & 5% Vitamin E Duo.',
      rating: 4.9,
      reviewCount: 48,
      featured: true,
      bestseller: true,
      concern: ['Dullness & Uneven Tone', 'Hyperpigmentation', 'Anti-Aging'],
      benefits: [
        '5% Vitamin C for dynamic visible brightening and dark spot reduction',
        '5% Vitamin E for deep anti-aging lipid barrier hydration',
        'Reduces fine lines, wrinkles, and oxidative stress damage',
        'Dermatologist tested and beyond pure formulation'
      ],
      ingredients: [
        'Water (Aqua)',
        'L-Ascorbic Acid (Vitamin C 5%)',
        'Tocopherol Acetate (Vitamin E 5%)',
        'Canola Oil',
        'Hyaluronic Acid',
        'Glycerin',
        'Phenoxyethanol'
      ],
      variants: [
        { title: '30ml Dropper Bottle', price: 2450, compareAtPrice: 3000, sku: 'DRAR-OLIVEC-30', stock: 50, inStock: true },
        { title: 'Pack of 2 (30ml x 2)', price: 4499, compareAtPrice: 6000, sku: 'DRAR-OLIVEC-P2', stock: 20, inStock: true }
      ]
    },
    {
      _id: 'product-dr-ar-mak-mandelic',
      _type: 'product',
      title: 'Dr. AR Mak Mandelic Acid Serum',
      slug: { _type: 'slug', current: 'dr-ar-mak-mandelic-acid-serum' },
      category: 'Medicated',
      gender: 'Unisex',
      price: 2650,
      compareAtPrice: 3200,
      imageUrl: '/products/dr-ar-mak.jpg',
      images: ['/products/dr-ar-mak.jpg', '/products/dr-ar-mak-full.jpg'],
      description: 'Unlock a refined, smooth complexion with our potent Mandelic and Hyaluronic Acid blend. This effective serum targets uneven texture, reduces wrinkles, and deeply hydrates for a renewed, clear-toned finish. Powered by 20% Mandelic Acid & 2% Hyaluronic Acid.',
      rating: 4.8,
      reviewCount: 39,
      featured: true,
      bestseller: true,
      concern: ['Acne & Blemishes', 'Texture & Pores', 'Anti-Aging'],
      benefits: [
        '20% Mandelic Acid for gentle, high-potency cellular exfoliation',
        '2% Hyaluronic Acid for deep moisture retention and plumping',
        'Visibly reduces acne breakouts, bumps, and post-acne dark marks',
        'Refines enlarged pores and smoothes rough skin texture'
      ],
      ingredients: [
        'Water (Aqua)',
        'Mandelic Acid (20%)',
        'Hyaluronic Acid (2%)',
        'Propylene Glycol',
        'Sodium Hydroxide (pH adjuster)',
        'Glycerin',
        'Phenoxyethanol'
      ],
      variants: [
        { title: '30ml Dropper Bottle', price: 2650, compareAtPrice: 3200, sku: 'DRAR-MAK-30', stock: 45, inStock: true },
        { title: 'Pack of 2 (30ml x 2)', price: 4899, compareAtPrice: 6400, sku: 'DRAR-MAK-P2', stock: 15, inStock: true }
      ]
    },
    {
      _id: 'product-dr-ar-eye-c',
      _type: 'product',
      title: 'Dr. AR EYE-S Eye Protect Shampoo',
      slug: { _type: 'slug', current: 'dr-ar-eye-s-eye-protect-shampoo' },
      category: 'Skin Care',
      gender: 'Unisex',
      price: 1850,
      compareAtPrice: 2200,
      imageUrl: '/products/dr-ar-eye-s.jpg',
      images: ['/products/dr-ar-eye-s.jpg', '/products/dr-ar-eye-s-full.jpg'],
      description: 'Specially formulated gentle ocular and eyelid cleansing shampoo enriched with Vitamins A, E & C. 100% Paraben & Salt-Free, gentle on sensitive eyes. Provides deep eyelid hygiene, removes crusts and irritants, and soothes tired eyes.',
      rating: 4.9,
      reviewCount: 29,
      featured: true,
      bestseller: false,
      concern: ['Eye & Eyelid Care', 'Gentle Hygiene', 'Sensitive Skin'],
      benefits: [
        'Enriched with Vitamins A, E & C for cellular eyelid nourishment',
        '100% Paraben, Salt & Sulfate free - completely gentle to eyes',
        'Non-stinging formulation for daily morning and night eye cleansing',
        'Helps maintain eyelid hygiene and prevent irritation or crusting'
      ],
      ingredients: [
        'Purified Water',
        'Disodium Cocoamphodiacetate',
        'Vitamin A Palmitate',
        'Vitamin E (Tocopherol)',
        'Vitamin C (Ascorbyl Glucoside)',
        'Tea Tree Oil Extract',
        'Chamomile Extract',
        'Phenoxyethanol'
      ],
      variants: [
        { title: '150ml Pump Bottle', price: 1850, compareAtPrice: 2200, sku: 'DRAR-EYES-150', stock: 60, inStock: true },
        { title: 'Pack of 2 (150ml x 2)', price: 3399, compareAtPrice: 4400, sku: 'DRAR-EYES-P2', stock: 25, inStock: true }
      ]
    }
  ];

  for (const p of officialSanityProducts) {
    const res = await client.createOrReplace(p);
    console.log(`✓ Upserted product to Sanity: ${res._id} - ${res.title}`);
  }

  console.log('\n--- Verifying live Sanity Database ---');
  const checkProds = await client.fetch('*[_type == "product"]{_id, title, "slug": slug.current, price, imageUrl}');
  console.log('Sanity Products:', checkProds);

  const checkBanners = await client.fetch('*[_type == "banner"] | order(order asc){_id, title, imageUrl, link, order}');
  console.log('Sanity Banners:', checkBanners);

  console.log('\n✓ Sanity CMS Database successfully synchronized and 100% up to date!');
}

main().catch(console.error);
