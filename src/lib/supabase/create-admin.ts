import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin(email: string, pass: string) {
  console.log(`Creating admin user: ${email}...`);
  
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: pass,
    email_confirm: true,
    app_metadata: { role: 'admin' }
  });

  if (error) {
    console.error('Error creating admin:', error.message);
    return;
  }

  console.log('Admin user created successfully!');
  console.log('User ID:', data.user.id);
  console.log('Role:', data.user.app_metadata.role);
}

// Get arguments from command line
const email = process.argv[2];
const password = process.argv[3];

if (!email || !password) {
  console.log('Usage: npx tsx src/lib/supabase/create-admin.ts <email> <password>');
  process.exit(1);
}

createAdmin(email, password);
