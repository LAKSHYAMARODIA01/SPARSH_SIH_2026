const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

async function testEmailVariants() {
  const emails = [
    'health.dept@sparsh-gov.in',
    'founder@cognitive.sparsh.in',
    'testfounder@gmail.com',
    'testfounder@sparsh.org',
    'testfounder@maharashtra.gov.in'
  ];

  for (const email of emails) {
    console.log(`\nTesting signup for: ${email}`);
    const res = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        email,
        password: 'Sparsh@2026',
        data: {
          full_name: 'Test Account',
          role: 'startup_founder'
        }
      })
    });

    console.log(`Status: ${res.status} ${res.statusText}`);
    console.log('Response:', await res.text());
  }
}

testEmailVariants();
