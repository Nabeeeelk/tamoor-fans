# 📦 Data Migration from Original Website

## Step 1: Analyze the HTTrack copy

Look in `/original-website/` folder for:
- Product pages: Extract product names, descriptions, prices, images
- Category pages: Extract category structure
- About page: Extract company info, contact details
- Homepage: Extract key selling points, stats, banner text

## Step 2: Extract Products Data

### Manual extraction process:
1. Open each product HTML file from HTTrack copy
2. Extract these fields for each product:
   - Product name
   - Price
   - Description
   - Images (copy image files to /public/products/)
   - Specifications (wattage, blade size, etc.)
   - Category
3. Create a JSON file: `/scripts/seed-data.json`

### Seed Data JSON Structure:
```json
{
  "categories": [
    {
      "name": "Ceiling Fans",
      "slug": "ceiling-fans",
      "description": "Energy-efficient ceiling fans for every room"
    }
  ],
  "products": [
    {
      "name": "Taimoor 56\" Ceiling Fan - 30W",
      "slug": "taimoor-56-ceiling-fan-30w",
      "category_slug": "ceiling-fans",
      "price": 12500,
      "original_price": 15000,
      "short_description": "Premium 30W BLDC ceiling fan with high airflow",
      "wattage": 30,
      "blade_size": "56 inch",
      "rpm": "380",
      "warranty_years": 2,
      "is_featured": true,
      "images": ["product-1-main.jpg", "product-1-alt.jpg"],
      "specs": [
        {"key": "Motor Type", "value": "BLDC"},
        {"key": "Speed Settings", "value": "3 Speed"},
        {"key": "Sweep Size", "value": "56 inch"}
      ]
    }
  ]
}
```

## Step 3: Image Migration

### Process:
```bash
# Copy images from HTTrack copy to Next.js public folder
# Rename to clean names
# Convert to WebP for performance:
# Use sharp or squoosh.app

# Original images are likely in:
# /original-website/images/
# or /original-website/wp-content/uploads/

# Target structure:
# /public/products/[product-slug]/main.webp
# /public/products/[product-slug]/alt-1.webp
# /public/categories/ceiling-fans.webp
```

## Step 4: Create Seed Script

```typescript
// scripts/seed.ts
// Run with: npx ts-node scripts/seed.ts

import { createClient } from '@supabase/supabase-js';
import seedData from './seed-data.json';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function seed() {
  // 1. Insert categories
  for (const category of seedData.categories) {
    await supabase.from('categories').upsert(category);
  }
  
  // 2. Insert products
  for (const product of seedData.products) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', product.category_slug)
      .single();
    
    const { data: prod } = await supabase
      .from('products')
      .upsert({
        ...product,
        category_id: cat?.id,
      })
      .select()
      .single();
    
    // 3. Insert specs
    for (const spec of product.specs) {
      await supabase.from('product_specifications').insert({
        product_id: prod.id,
        ...spec,
      });
    }
    
    // 4. Upload images to Supabase Storage
    for (const image of product.images) {
      // Read from /public/products/
      // Upload to Supabase Storage
      // Insert into product_images table
    }
  }
  
  console.log('Seeding complete!');
}

seed();
```

## Step 5: Site Settings Migration

Extract from original website:
- Phone number -> site_settings table
- WhatsApp number -> site_settings table  
- Email -> site_settings table
- Address -> site_settings table
- Social media links -> site_settings table

## Step 6: Company Info for About Page

From HTTrack copy extract:
- Company history/story
- Years in business
- Certifications
- Team/factory images
- Any awards or recognitions
```
