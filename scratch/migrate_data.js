const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const productsJsonPath = 'f:\\taimoor fans\\scratch\\scraped_products.json';
const cdnDir = 'f:\\taimoor fans\\original-website\\taimoor fans original\\cdn.shopify.com\\s\\files\\1\\0856\\7767\\0720\\files';

async function migrate() {
  const products = JSON.parse(fs.readFileSync(productsJsonPath, 'utf-8'));
  console.log(`Loaded ${products.length} products for migration.`);

  // 1. Get or create categories
  const categoryMap = new Map();
  const uniqueCategories = [...new Set(products.map(p => p.category).filter(Boolean))];
  
  for (const catName of uniqueCategories) {
    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const { data, error } = await supabase
      .from('categories')
      .upsert({ name: catName, slug: slug }, { onConflict: 'slug' })
      .select('id')
      .single();
    
    if (error) {
      console.error(`Error upserting category ${catName}:`, error.message);
      // Try to just get it if upsert failed due to conflict
      const { data: existing } = await supabase.from('categories').select('id').eq('name', catName).single();
      if (existing) categoryMap.set(catName, existing.id);
    } else {
      categoryMap.set(catName, data.id);
    }
  }

  // 2. Migrate products
  for (const product of products) {
    console.log(`Migrating: ${product.name}`);

    const categoryId = categoryMap.get(product.category) || null;

    // Upload image if found
    let imageUrl = null;
    if (product.imageFound && product.localFilename) {
      const localPath = path.join(cdnDir, product.localFilename);
      if (fs.existsSync(localPath)) {
        const fileBuffer = fs.readFileSync(localPath);
        const ext = path.extname(product.localFilename).toLowerCase().replace('.', '');
        const contentType = ext === 'png' ? 'image/png' : (ext === 'webp' ? 'image/webp' : 'image/jpeg');
        
        const storagePath = `products/${product.localFilename}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(storagePath, fileBuffer, {
            contentType: contentType,
            upsert: true
          });

        if (uploadError) {
          console.error(`  Image upload failed for ${product.name}:`, uploadError.message);
        } else {
          const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(storagePath);
          imageUrl = publicUrl;
          console.log(`  Uploaded image: ${imageUrl}`);
        }
      }
    }

    // Insert product
    const { data: productData, error: productError } = await supabase
      .from('products')
      .upsert({
        name: product.name,
        slug: product.slug,
        short_description: product.description.substring(0, 200),
        full_description: product.description,
        price: product.price,
        category_id: categoryId,
        is_active: true
      }, { onConflict: 'slug' })
      .select('id')
      .single();

    if (productError) {
      console.error(`  Product insert failed for ${product.name}:`, productError.message);
      continue;
    }

    // Insert image reference
    if (imageUrl) {
      // Check if already exists
      const { data: existingImage } = await supabase
        .from('product_images')
        .select('id')
        .eq('product_id', productData.id)
        .eq('image_url', imageUrl)
        .maybeSingle();

      if (!existingImage) {
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: productData.id,
            image_url: imageUrl,
            alt_text: product.name,
            display_order: 0,
            is_primary: true
          });

        if (imageError) {
          console.error(`  Image reference insert failed for ${product.name}:`, imageError.message);
        }
      }
    }
  }

  console.log('Migration completed!');
}

migrate();
