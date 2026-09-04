import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogins() {
  console.log('--- Testing Supabase Auth Logins ---');

  const testAccounts = [
    'health.dept@sparsh-gov.in',
    'admin.chief@sparsh.in',
    'founder@cognitive.sparsh.in',
    'evaluator.deshmukh@sparsh.in',
    'validator.patil@sparsh.in'
  ];

  for (const email of testAccounts) {
    console.log(`\nAttempting login for: ${email}`);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'Sparsh@2026'
    });

    if (error) {
      console.error(`❌ Login Error for ${email}:`, error.message, error.status, error.name);
      console.error('Details:', error);
    } else {
      console.log(`✅ Login SUCCESS for ${email}`);
      console.log(`   User ID: ${data.user?.id}`);
      console.log(`   Role in App Metadata: ${data.user?.app_metadata?.role}`);
      
      // Query profiles table
      const { data: profile, error: profileErr } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileErr) {
        console.error(`❌ Profile Query Error:`, profileErr.message, profileErr.code, profileErr.details);
      } else {
        console.log(`✅ Profile Fetched:`, profile.full_name, `[${profile.role}]`);
      }
    }
  }
}

testLogins();
