import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSignUp() {
  console.log('--- Testing Supabase Auth SignUp ---');

  const testEmail = `test.founder.${Date.now()}@sparsh.in`;
  console.log(`Attempting signup for: ${testEmail}`);

  const { data, error } = await supabase.auth.signUp({
    email: testEmail,
    password: 'Sparsh@2026',
    options: {
      data: {
        full_name: 'Test Founder',
        role: 'startup_founder'
      }
    }
  });

  if (error) {
    console.error(`❌ SignUp Error:`, error.message, error.status, error.name);
    console.error('Details:', error);
  } else {
    console.log(`✅ SignUp SUCCESS for ${testEmail}`);
    console.log(`   User ID: ${data.user?.id}`);

    // Now try logging in with this newly signed up user
    console.log('\nNow testing signInWithPassword with the newly created user...');
    const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: 'Sparsh@2026'
    });

    if (loginErr) {
      console.error(`❌ Login Error for new user:`, loginErr.message, loginErr.status);
    } else {
      console.log(`✅ Login SUCCESS for newly created user! User ID: ${loginData.user?.id}`);
    }
  }
}

testSignUp();
