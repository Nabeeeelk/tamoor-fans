import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncProducts() {
  const productsPath = path.join(__dirname, 'scraped_products.json');
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

  console.log(`Starting sync for ${productsData.length} products...`);
  
  let successCount = 0;
  let errorCount = 0;

  for (const product of productsData) {
    const { slug, name, price, originalImageUrl, localFilename } = product;

    // Use the Shopify CDN url or the local image url if downloaded.
    // The previous implementation used Shopify CDN mostly.
    const imageUrl = originalImageUrl; 

    // We only update matching slugs.
    const { data, error } = await supabase
      .from('products')
      .update({
        name: name,
        price: price,
        original_price: price > 0 ? Math.round(price * 1.15) : null,
        image_url: imageUrl,
        short_description: product.description,
        full_description: product.description
      })
      .eq('slug', slug);

    if (error) {
      console.error(`Error updating ${slug}:`, error.message);
      errorCount++;
    } else {
      successCount++;
    }
  }

  console.log(`Sync complete. Success: ${successCount}, Errors: ${errorCount}`);
}

syncProducts().catch(console.error);
