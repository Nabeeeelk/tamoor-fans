import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function generateSpecs() {
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, categories(name)');

  if (error) {
    console.error(error);
    return;
  }

  console.log(`Generating specs for ${products.length} products...`);
  
  let success = 0;

  for (const product of products) {
    const nameStr = product.name.toLowerCase();
    const slugStr = product.slug.toLowerCase();
    const catName = product.categories?.name?.toLowerCase() || '';
    
    let wattage = 70; // default for traditional
    let blade_size = '56"';
    let rpm = '330';
    let airflow = '230 CMM';
    let noise_level = 'Standard';
    let motor_type = 'Copper Winding';
    let warranty = 2;

    // Detect Motor & Wattage
    if (nameStr.includes('ac/dc') || nameStr.includes('inverter') || nameStr.includes('bldc') || nameStr.includes('eco smart')) {
      wattage = 30;
      motor_type = 'BLDC (Brushless DC)';
      noise_level = 'Whisper Quiet';
    }
    
    if (nameStr.includes('30 watt') || slugStr.includes('30-watt')) wattage = 30;
    if (nameStr.includes('40 watt') || slugStr.includes('40-watt')) wattage = 40;
    if (nameStr.includes('50 watt') || slugStr.includes('50-watt')) wattage = 50;
    if (nameStr.includes('heavy duty') || nameStr.includes('skimmer')) {
      wattage = 75;
      noise_level = 'Moderate';
    }

    // Detect Type for Blades & RPM
    if (catName.includes('pedestal') || nameStr.includes('pedestal')) {
      blade_size = '24"';
      rpm = '1400';
      airflow = 'High Velocity';
    } else if (catName.includes('skimmer') || nameStr.includes('exhaust')) {
      blade_size = '18"';
      rpm = '1600';
      airflow = 'Maximum Extraction';
    } else {
      // Standard Ceiling Fan
      blade_size = '56"';
      rpm = '320 - 350';
      airflow = '240 CMM';
    }

    // Circuits/Kits don't have blades
    if (catName.includes('circuit') || nameStr.includes('kit') || nameStr.includes('remote')) {
      blade_size = null;
      rpm = null;
      airflow = null;
      noise_level = null;
      wattage = null;
      warranty = 1; // 1 year for electronics
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        wattage,
        blade_size,
        rpm,
        airflow,
        noise_level,
        warranty_years: warranty
      })
      .eq('id', product.id);

    if (updateError) {
      console.error(updateError);
    } else {
      success++;
    }
  }

  console.log(`Successfully generated dynamic specs for ${success} products!`);
}

generateSpecs();
