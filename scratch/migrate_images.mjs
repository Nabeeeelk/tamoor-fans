import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function migrateImages() {
  console.log('Fetching products...');
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, image_url');

  if (error) {
    console.error('Failed to fetch products:', error);
    return;
  }

  console.log(`Found ${products.length} products to process.`);
  let success = 0;
  let skipped = 0;

  for (const product of products) {
    if (!product.image_url) {
      skipped++;
      continue;
    }

    // Skip if already a supabase storage url
    if (product.image_url.includes('supabase.co/storage')) {
      console.log(`Skipping ${product.slug}: already in Supabase storage.`);
      skipped++;
      continue;
    }

    console.log(`Processing ${product.slug}...`);

    try {
      // 1. Download image
      const response = await fetch(product.image_url);
      if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // 2. Process with sharp (convert to webp, resize, optimize)
      const optimizedBuffer = await sharp(buffer)
        .resize({ width: 800, height: 800, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toBuffer();

      // 3. Upload to Supabase
      const fileName = `${product.slug}-${Date.now()}.webp`;
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('product-images')
        .upload(fileName, optimizedBuffer, {
          contentType: 'image/webp',
          upsert: true
        });

      if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

      // 4. Get public URL
      const { data: publicUrlData } = supabase
        .storage
        .from('product-images')
        .getPublicUrl(fileName);

      const newImageUrl = publicUrlData.publicUrl;

      // 5. Update database
      const { error: updateError } = await supabase
        .from('products')
        .update({ image_url: newImageUrl })
        .eq('id', product.id);

      if (updateError) throw new Error(`DB Update failed: ${updateError.message}`);

      console.log(`✅ Success: ${product.slug}`);
      success++;
    } catch (err) {
      console.error(`❌ Failed to process ${product.slug}:`, err.message);
    }
  }

  console.log(`\nMigration complete. Migrated: ${success}, Skipped: ${skipped}, Failed: ${products.length - success - skipped}`);
}

migrateImages();
