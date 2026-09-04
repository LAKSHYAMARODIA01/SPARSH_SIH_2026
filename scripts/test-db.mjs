import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nticuxcwwualwqgvscfr.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_ejKL2T9G3RgggfZ5zV8YDg_rydHl_pP';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testDatabaseQueries() {
  console.log('--- Testing Supabase Schema Queries ---');
  
  const tables = [
    'departments',
    'profiles',
    'startups',
    'challenge_charters',
    'applications',
    'shortlist_results',
    'demo_evaluations',
    'pilots',
    'milestones',
    'escrow_ledger_entries',
    'validation_reports',
    'scale_decisions',
    'audit_logs'
  ];

  for (const table of tables) {
    try {
      const { data, error } = await supabase.from(table).select('*').limit(1);
      if (error) {
        console.error(`❌ Table '${table}' Error:`, error.message, error.code, error.details);
      } else {
        console.log(`✅ Table '${table}': Accessible (${data.length} rows returned)`);
      }
    } catch (err) {
      console.error(`💥 Table '${table}' Exception:`, err.message);
    }
  }
}

testDatabaseQueries();
