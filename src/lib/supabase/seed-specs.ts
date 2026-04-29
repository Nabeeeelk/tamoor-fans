import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedSpecs() {
  const { data: products } = await supabase.from('products').select('id, name');
  
  if (!products) return;

  const specs = [];

  for (const product of products) {
    const name = product.name.toLowerCase();
    
    // Default specs based on name
    if (name.includes('ceiling') || name.includes('model') || name.includes('smart') || name.includes('classic') || name.includes('antique')) {
      specs.push(
        { product_id: product.id, spec_key: 'Blade Size', spec_value: '56 Inch', display_order: 1 },
        { product_id: product.id, spec_key: 'Wattage', spec_value: '30W - 35W', display_order: 2 },
        { product_id: product.id, spec_key: 'RPM', spec_value: '330 RPM', display_order: 3 },
        { product_id: product.id, spec_key: 'Airflow', spec_value: '12000 CFM', display_order: 4 },
        { product_id: product.id, spec_key: 'Motor Type', spec_value: 'BLDC (DC)', display_order: 5 }
      );
    } else if (name.includes('bracket')) {
      specs.push(
        { product_id: product.id, spec_key: 'Blade Size', spec_value: '20 Inch', display_order: 1 },
        { product_id: product.id, spec_key: 'Wattage', spec_value: '50W - 60W', display_order: 2 },
        { product_id: product.id, spec_key: 'RPM', spec_value: '1350 RPM', display_order: 3 },
        { product_id: product.id, spec_key: 'Airflow', spec_value: '4500 CFM', display_order: 4 }
      );
    } else if (name.includes('pedestal')) {
      specs.push(
        { product_id: product.id, spec_key: 'Blade Size', spec_value: '24 Inch', display_order: 1 },
        { product_id: product.id, spec_key: 'Wattage', spec_value: '70W - 80W', display_order: 2 },
        { product_id: product.id, spec_key: 'RPM', spec_value: '1400 RPM', display_order: 3 },
        { product_id: product.id, spec_key: 'Airflow', spec_value: '6000 CFM', display_order: 4 }
      );
    } else if (name.includes('washing')) {
      specs.push(
        { product_id: product.id, spec_key: 'Capacity', spec_value: '10 KG', display_order: 1 },
        { product_id: product.id, spec_key: 'Type', spec_value: 'Top Loading', display_order: 2 },
        { product_id: product.id, spec_key: 'Warranty', spec_value: '10 Years Motor', display_order: 3 }
      );
    } else if (name.includes('purifier')) {
      specs.push(
        { product_id: product.id, spec_key: 'CADR', spec_value: '260 m³/h', display_order: 1 },
        { product_id: product.id, spec_key: 'Filter Type', spec_value: 'HEPA H13', display_order: 2 },
        { product_id: product.id, spec_key: 'Area Coverage', spec_value: '300 sq. ft.', display_order: 3 }
      );
    }
  }

  console.log(`Inserting ${specs.length} specifications...`);
  
  // Chunk inserts to avoid limits
  const chunkSize = 100;
  for (let i = 0; i < specs.length; i += chunkSize) {
    const chunk = specs.slice(i, i + chunkSize);
    const { error } = await supabase.from('product_specifications').insert(chunk);
    if (error) console.error('Error inserting chunk:', error);
  }

  console.log('Done!');
}

seedSpecs();
