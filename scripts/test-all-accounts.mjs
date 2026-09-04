import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

const supabase = createClient(supabaseUrl, supabaseKey);

const accounts = [
  // 14 Dept Officers
  'health.dept@sparsh-gov.in',
  'transport.dept@sparsh-gov.in',
  'agriculture.dept@sparsh-gov.in',
  'water.dept@sparsh-gov.in',
  'urban.dept@sparsh-gov.in',
  'environment.dept@sparsh-gov.in',
  'education.dept@sparsh-gov.in',
  'skills.dept@sparsh-gov.in',
  'police.dept@sparsh-gov.in',
  'pwd.dept@sparsh-gov.in',
  'tribal.dept@sparsh-gov.in',
  'fisheries.dept@sparsh-gov.in',
  'tourism.dept@sparsh-gov.in',
  'supplies.dept@sparsh-gov.in',

  // 2 Admins
  'admin.chief@sparsh.in',
  'admin.ops@sparsh.in',

  // 3 Evaluators
  'evaluator.deshmukh@sparsh.in',
  'evaluator.sharma@sparsh.in',
  'evaluator.kulkarni@sparsh.in',

  // 2 Validators
  'validator.patil@sparsh.in',
  'validator.joshi@sparsh.in',

  // 22 Startups
  'founder@cognitive.sparsh.in',
  'founder@healthpulse.sparsh.in',
  'founder@agrisense.sparsh.in',
  'founder@hydroflow.sparsh.in',
  'founder@ecopure.sparsh.in',
  'founder@edvanya.sparsh.in',
  'founder@skillbridge.sparsh.in',
  'founder@cybershield.sparsh.in',
  'founder@infravision.sparsh.in',
  'founder@sunharvest.sparsh.in',
  'founder@aquatrack.sparsh.in',
  'founder@heritageverse.sparsh.in',
  'founder@rationtrust.sparsh.in',
  'founder@aerodrone.sparsh.in',
  'founder@medichain.sparsh.in',
  'founder@cleansurge.sparsh.in',
  'founder@biovolt.sparsh.in',
  'founder@vaniai.sparsh.in',
  'founder@georisk.sparsh.in',
  'founder@safegrid.sparsh.in',
  'founder@fireguard.sparsh.in',
  'founder@oceanbounty.sparsh.in'
];

async function runTest() {
  console.log(`--- Testing ${accounts.length} Accounts ---`);
  let successCount = 0;
  let failCount = 0;

  for (const email of accounts) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: 'Sparsh@2026'
    });

    if (error) {
      console.log(`❌ FAIL: ${email} -> ${error.message} (${error.status})`);
      failCount++;
    } else {
      console.log(`✅ SUCCESS: ${email} (User ID: ${data.user?.id})`);
      successCount++;
    }
  }

  console.log(`\nResults: ${successCount} PASSED, ${failCount} FAILED out of ${accounts.length}`);
}

runTest();
