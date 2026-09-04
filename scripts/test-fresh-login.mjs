import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFreshUser() {
  console.log('--- Testing Fresh User Signup & Login ---');

  const email = `officer.${Date.now()}@sparsh-gov.in`;
  console.log(`Creating fresh user: ${email}`);

  const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
    email,
    password: 'Sparsh@2026',
    options: {
      data: {
        full_name: 'Fresh Officer',
        role: 'department_officer'
      }
    }
  });

  if (signUpErr) {
    console.error('❌ SignUp Error:', signUpErr.message, signUpErr.status);
    return;
  }

  console.log('✅ SignUp SUCCESS! User ID:', signUpData.user?.id);

  console.log('Attempting Login with freshly created user...');
  const { data: loginData, error: loginErr } = await supabase.auth.signInWithPassword({
    email,
    password: 'Sparsh@2026'
  });

  if (loginErr) {
    console.error('❌ Login Error:', loginErr.message, loginErr.status);
  } else {
    console.log('🎉 LOGIN SUCCESSFUL! User ID:', loginData.user?.id);
    console.log('Role in App Metadata:', loginData.user?.app_metadata?.role);
    console.log('Role in User Metadata:', loginData.user?.user_metadata?.role);
  }
}

testFreshUser();
