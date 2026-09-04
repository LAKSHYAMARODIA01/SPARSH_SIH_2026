-- ============================================================================
-- SPARSH Platform — Full Supabase PostgreSQL Migration (01_auth_profiles_and_rbac.sql)
-- ============================================================================

-- 1. Enable Required Extensions & Configure Search Path
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Configure search path for Supabase PostgREST API roles
ALTER ROLE authenticator RESET search_path;
ALTER ROLE postgres RESET search_path;
GRANT USAGE ON SCHEMA public, extensions, auth TO postgres, anon, authenticated, service_role;

-- 2. Create ENUM Types
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM (
      'department_officer', 
      'startup_founder', 
      'msins_admin', 
      'evaluator', 
      'validator'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE data_sensitivity_enum AS ENUM ('low', 'medium', 'high');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE charter_status_enum AS ENUM (
      'draft', 'published', 'shortlisting', 'demo_scheduled',
      'piloting', 'validating', 'scaled', 'closed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE milestone_status_enum AS ENUM (
      'pending', 'evidence_submitted', 'verified', 'paid', 'overdue'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE escrow_type_enum AS ENUM ('reserved', 'released', 'refunded');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE validation_outcome_enum AS ENUM ('pass', 'conditional', 'fail');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE scale_decision_enum AS ENUM ('scale_statewide', 'scale_department', 'reject');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ============================================================================
-- 3. Core Tables
-- ============================================================================

-- Departments Table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  contact_officer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Profiles Table (Linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role_enum NOT NULL DEFAULT 'startup_founder',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
  org_id UUID,
  verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Startups Profile
CREATE TABLE IF NOT EXISTS startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  dpiit_number TEXT UNIQUE,
  udyam_number TEXT UNIQUE,
  gstin TEXT UNIQUE,
  sector_tags TEXT[] DEFAULT '{}',
  capability_embedding vector(1536),
  verified_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Challenge Charters
CREATE TABLE IF NOT EXISTS challenge_charters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id UUID REFERENCES departments(id) ON DELETE CASCADE,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  problem_description TEXT NOT NULL,
  success_metric TEXT NOT NULL,
  budget_ceiling NUMERIC(12, 2) NOT NULL,
  pilot_duration_days INT NOT NULL,
  data_ip_sensitivity data_sensitivity_enum NOT NULL DEFAULT 'low',
  status charter_status_enum NOT NULL DEFAULT 'draft',
  charter_embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Applications
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charter_id UUID REFERENCES challenge_charters(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  pitch_deck_url TEXT,
  eligibility_snapshot JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'applied',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(charter_id, startup_id)
);

-- Shortlist Results
CREATE TABLE IF NOT EXISTS shortlist_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charter_id UUID REFERENCES challenge_charters(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  match_score FLOAT NOT NULL,
  ai_justification TEXT NOT NULL,
  rank INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Demo Evaluations
CREATE TABLE IF NOT EXISTS demo_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  score NUMERIC(5, 2) NOT NULL,
  notes TEXT,
  criteria_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pilots
CREATE TABLE IF NOT EXISTS pilots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charter_id UUID REFERENCES challenge_charters(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  contract_url TEXT,
  ip_clause_type TEXT,
  start_date DATE,
  end_date DATE,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestones
CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  amount NUMERIC(12, 2) NOT NULL,
  status milestone_status_enum NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Milestone Evidence
CREATE TABLE IF NOT EXISTS milestone_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  file_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- Escrow Ledger Entries
CREATE TABLE IF NOT EXISTS escrow_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type escrow_type_enum NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Validation Reports
CREATE TABLE IF NOT EXISTS validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  outcome validation_outcome_enum NOT NULL,
  report_url TEXT,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scale Decisions
CREATE TABLE IF NOT EXISTS scale_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  decision scale_decision_enum NOT NULL,
  rationale TEXT NOT NULL,
  gem_listing_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Audit Log
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_id UUID NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. Auth Hook & JWT Role Sync Trigger Functions
-- ============================================================================

-- Function to handle new user signup and create profile safely
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public, extensions, auth
AS $$
DECLARE
  default_role user_role_enum := 'startup_founder';
  dept_id_val UUID := NULL;
  raw_dept TEXT;
BEGIN
  -- Safe role parsing
  IF new.raw_user_meta_data->>'role' IS NOT NULL THEN
    BEGIN
      default_role := (new.raw_user_meta_data->>'role')::user_role_enum;
    EXCEPTION WHEN OTHERS THEN
      default_role := 'startup_founder'::user_role_enum;
    END;
  ELSIF new.raw_app_meta_data->>'role' IS NOT NULL THEN
    BEGIN
      default_role := (new.raw_app_meta_data->>'role')::user_role_enum;
    EXCEPTION WHEN OTHERS THEN
      default_role := 'startup_founder'::user_role_enum;
    END;
  END IF;

  -- Safe department_id parsing
  raw_dept := COALESCE(new.raw_user_meta_data->>'department_id', new.raw_app_meta_data->>'department_id');
  IF raw_dept IS NOT NULL AND raw_dept != '' AND raw_dept != 'null' THEN
    BEGIN
      dept_id_val := raw_dept::uuid;
    EXCEPTION WHEN OTHERS THEN
      dept_id_val := NULL;
    END;
  END IF;

  -- Insert profile safely into public.profiles
  INSERT INTO public.profiles (id, full_name, email, role, department_id, verified)
  VALUES (
    new.id,
    COALESCE(NULLIF(new.raw_user_meta_data->>'full_name', ''), new.email),
    new.email,
    default_role,
    dept_id_val,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department_id = EXCLUDED.department_id;

  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================================
-- 5. Row-Level Security (RLS) Policies
-- ============================================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_charters ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger_entries ENABLE ROW LEVEL SECURITY;

-- Profile RLS Policies
CREATE POLICY "Public profiles viewable by all"
  ON profiles FOR SELECT TO public USING (true);

CREATE POLICY "Users edit own profile"
  ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);

-- Challenge Charters RLS Policies (Allow public reading for open challenges)
CREATE POLICY "Charters viewable by public and authenticated users"
  ON challenge_charters FOR SELECT TO public USING (true);

CREATE POLICY "Department officers insert charters"
  ON challenge_charters FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') IN ('department_officer', 'msins_admin')
  );

CREATE POLICY "Department officers update own charters"
  ON challenge_charters FOR UPDATE TO authenticated
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'msins_admin'
    OR department_id = ((auth.jwt() -> 'app_metadata' ->> 'department_id')::uuid)
  );

-- Applications RLS Policies
CREATE POLICY "Applications readable by public and authenticated users"
  ON applications FOR SELECT TO public USING (true);

CREATE POLICY "Startups submit applications"
  ON applications FOR INSERT TO authenticated
  WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'startup_founder'
  );

-- ============================================================================
-- 6. Schema Grants & PostgREST Cache Refresh
-- ============================================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT USAGE ON SCHEMA extensions TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- Reload Supabase API PostgREST Schema Cache
NOTIFY pgrst, 'reload schema';
