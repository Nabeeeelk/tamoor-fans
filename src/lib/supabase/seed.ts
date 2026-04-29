import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!; // Need service role for bypass RLS if any

const supabase = createClient(supabaseUrl, supabaseKey);

const categories = [
  { name: 'Ceiling Fans', slug: 'ceiling-fans', image_url: 'https://images.unsplash.com/photo-1591123120675-6f7f1aae0e5b?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pedestal Fans', slug: 'pedestal-fans', image_url: 'https://images.unsplash.com/photo-1618915461234-9783f9828555?auto=format&fit=crop&q=80&w=800' },
  { name: 'Exhaust Fans', slug: 'exhaust-fans', image_url: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?auto=format&fit=crop&q=80&w=800' },
  { name: 'Bracket Fans', slug: 'bracket-fans', image_url: 'https://images.unsplash.com/photo-1544256718-3bcf237f3974?auto=format&fit=crop&q=80&w=800' },
];

const products = [
  {
    name: 'Antique Model AC/DC Inverter Fan',
    slug: 'antique-model-ac-dc',
    price: 12500,
    compare_at_price: 15000,
    description: 'Classic antique design with modern energy-saving BLDC technology. Consumes only 30 Watts.',
    category_slug: 'ceiling-fans',
    image_url: 'https://tamoorfans.com/cdn/shop/products/AntiqueModel_600x.png?v=1651234567', // Placeholder-ish
    is_featured: true,
    is_new: true,
    wattage: 30
  },
  {
    name: 'Eco Smart Digital Remote Fan',
    slug: 'eco-smart-digital',
    price: 9800,
    compare_at_price: 11500,
    description: 'Digital remote control with sleep timer and speed control. High efficiency motor.',
    category_slug: 'ceiling-fans',
    image_url: 'https://tamoorfans.com/cdn/shop/products/EcoSmart_600x.png?v=1651234567',
    is_featured: true,
    is_bestseller: true,
    wattage: 30
  },
  {
    name: 'Galaxy Model AC/DC Ceiling Fan',
    slug: 'galaxy-model-ac-dc',
    price: 11200,
    compare_at_price: 13000,
    description: 'Modern galaxy design with 5-star energy rating. Silent operation.',
    category_slug: 'ceiling-fans',
    image_url: 'https://tamoorfans.com/cdn/shop/products/Galaxy_600x.png?v=1651234567',
    is_featured: true,
    wattage: 30
  },
  {
    name: 'Executive Fancy Pedestal Fan',
    slug: 'executive-pedestal',
    price: 14500,
    compare_at_price: 17000,
    description: 'Premium pedestal fan with adjustable height and wide oscillation.',
    category_slug: 'pedestal-fans',
    image_url: 'https://tamoorfans.com/cdn/shop/products/Pedestal_600x.png?v=1651234567',
    is_featured: true,
    wattage: 40
  }
];

async function seed() {
  console.log('Seeding categories...');
  const { data: catData, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'slug' })
    .select();

  if (catError) {
    console.error('Error seeding categories:', catError);
    return;
  }
  console.log('Categories seeded:', catData.length);

  const productsToInsert = products.map(p => {
    const category = catData.find(c => c.slug === p.category_slug);
    const { category_slug, ...rest } = p;
    return { ...rest, category_id: category?.id };
  });

  console.log('Seeding products...');
  const { data: prodData, error: prodError } = await supabase
    .from('products')
    .upsert(productsToInsert, { onConflict: 'slug' })
    .select();

  if (prodError) {
    console.error('Error seeding products:', prodError);
    return;
  }
  console.log('Products seeded:', prodData.length);
}

seed();
