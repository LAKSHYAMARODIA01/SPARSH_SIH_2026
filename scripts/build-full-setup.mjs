import fs from 'fs';
import path from 'path';

const sqlPath = path.join(process.cwd(), 'supabase', 'full_setup.sql');

const sqlContent = `-- ============================================================================
-- SPARSH Platform — Complete Unified Database Setup & Seed Script (full_setup.sql)
-- Copy and paste this ENTIRE script into the Supabase SQL Editor and click RUN.
-- Universal Password for all demo accounts: Sparsh@2026
-- ============================================================================

-- 1. RESTORE SUPABASE DEFAULT ROLE SEARCH PATHS
ALTER ROLE postgres RESET search_path;
ALTER ROLE authenticator RESET search_path;

-- 2. DROP CUSTOM TRIGGERS ON auth.users (TO AVOID CONFLICTS DURING SEEDING)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- 3. CLEAN UP PUBLIC TABLES & ENUMS
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS scale_decisions CASCADE;
DROP TABLE IF EXISTS validation_reports CASCADE;
DROP TABLE IF EXISTS escrow_ledger_entries CASCADE;
DROP TABLE IF EXISTS milestone_evidence CASCADE;
DROP TABLE IF EXISTS milestones CASCADE;
DROP TABLE IF EXISTS pilots CASCADE;
DROP TABLE IF EXISTS demo_evaluations CASCADE;
DROP TABLE IF EXISTS shortlist_results CASCADE;
DROP TABLE IF EXISTS applications CASCADE;
DROP TABLE IF EXISTS challenge_charters CASCADE;
DROP TABLE IF EXISTS startups CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS departments CASCADE;

DROP TYPE IF EXISTS scale_decision_enum CASCADE;
DROP TYPE IF EXISTS validation_outcome_enum CASCADE;
DROP TYPE IF EXISTS escrow_type_enum CASCADE;
DROP TYPE IF EXISTS milestone_status_enum CASCADE;
DROP TYPE IF EXISTS charter_status_enum CASCADE;
DROP TYPE IF EXISTS data_sensitivity_enum CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- 4. ENABLE REQUIRED EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 5. CREATE ENUM TYPES
CREATE TYPE user_role_enum AS ENUM (
  'department_officer', 
  'startup_founder', 
  'msins_admin', 
  'evaluator', 
  'validator'
);

CREATE TYPE data_sensitivity_enum AS ENUM ('low', 'medium', 'high');

CREATE TYPE charter_status_enum AS ENUM (
  'draft', 'published', 'shortlisting', 'demo_scheduled',
  'piloting', 'validating', 'scaled', 'closed'
);

CREATE TYPE milestone_status_enum AS ENUM (
  'pending', 'evidence_submitted', 'verified', 'paid', 'overdue'
);

CREATE TYPE escrow_type_enum AS ENUM ('reserved', 'released', 'refunded');

CREATE TYPE validation_outcome_enum AS ENUM ('pass', 'conditional', 'fail');

CREATE TYPE scale_decision_enum AS ENUM ('scale_statewide', 'scale_department', 'reject');

-- 6. CREATE CORE TABLES
CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  contact_officer_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE profiles (
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

CREATE TABLE startups (
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

CREATE TABLE challenge_charters (
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

CREATE TABLE applications (
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

CREATE TABLE shortlist_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  charter_id UUID REFERENCES challenge_charters(id) ON DELETE CASCADE,
  startup_id UUID REFERENCES startups(id) ON DELETE CASCADE,
  match_score FLOAT NOT NULL,
  ai_justification TEXT NOT NULL,
  rank INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE demo_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  score NUMERIC(5, 2) NOT NULL,
  notes TEXT,
  criteria_breakdown JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE pilots (
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

CREATE TABLE milestones (
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

CREATE TABLE milestone_evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  milestone_id UUID REFERENCES milestones(id) ON DELETE CASCADE,
  submitted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  file_urls TEXT[] DEFAULT '{}',
  notes TEXT,
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE escrow_ledger_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  milestone_id UUID REFERENCES milestones(id) ON DELETE SET NULL,
  amount NUMERIC(12, 2) NOT NULL,
  type escrow_type_enum NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE validation_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  validator_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  outcome validation_outcome_enum NOT NULL,
  report_url TEXT,
  metrics JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE scale_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pilot_id UUID REFERENCES pilots(id) ON DELETE CASCADE,
  decision scale_decision_enum NOT NULL,
  rationale TEXT NOT NULL,
  gem_listing_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_name TEXT NOT NULL,
  entity_id UUID NOT NULL,
  payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. RLS POLICIES & PERMISSIONS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_charters ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE pilots ENABLE ROW LEVEL SECURITY;
ALTER TABLE escrow_ledger_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles viewable by all" ON profiles FOR SELECT TO public USING (true);
CREATE POLICY "Users edit own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Charters viewable by public and authenticated users" ON challenge_charters FOR SELECT TO public USING (true);
CREATE POLICY "Department officers insert charters" ON challenge_charters FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') IN ('department_officer', 'msins_admin'));
CREATE POLICY "Department officers update own charters" ON challenge_charters FOR UPDATE TO authenticated USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'msins_admin' OR department_id = ((auth.jwt() -> 'app_metadata' ->> 'department_id')::uuid));
CREATE POLICY "Applications readable by public and authenticated users" ON applications FOR SELECT TO public USING (true);
CREATE POLICY "Startups submit applications" ON applications FOR INSERT TO authenticated WITH CHECK ((auth.jwt() -> 'app_metadata' ->> 'role') = 'startup_founder');

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL FUNCTIONS IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

-- 8. AUTOMATIC PROFILE TRIGGER FOR NEW SIGNUPS
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role public.user_role_enum;
BEGIN
  assigned_role := COALESCE(
    (NEW.raw_app_meta_data->>'role')::public.user_role_enum,
    (NEW.raw_user_meta_data->>'role')::public.user_role_enum,
    'startup_founder'::public.user_role_enum
  );

  INSERT INTO public.profiles (id, full_name, email, role, department_id, verified)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    assigned_role,
    CASE 
      WHEN (NEW.raw_app_meta_data->>'department_id') IS NOT NULL THEN (NEW.raw_app_meta_data->>'department_id')::uuid
      WHEN (NEW.raw_user_meta_data->>'department_id') IS NOT NULL THEN (NEW.raw_user_meta_data->>'department_id')::uuid
      ELSE NULL
    END,
    true
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role,
    department_id = EXCLUDED.department_id;

  IF assigned_role = 'startup_founder' THEN
    IF NOT EXISTS (SELECT 1 FROM public.startups WHERE user_id = NEW.id) THEN
      INSERT INTO public.startups (id, user_id, name, dpiit_number, verified_status)
      VALUES (
        gen_random_uuid(),
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'startup_name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        'DPIIT-2026-' || FLOOR(10000 + RANDOM() * 89999)::text,
        true
      );
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 9. SEED DEPARTMENTS (14 DEPARTMENTS)
INSERT INTO departments (id, name, ministry, created_at) VALUES
('d1111111-1111-4111-a111-111111111101', 'Department of Public Health & Family Welfare', 'Ministry of Public Health', NOW()),
('d1111111-1111-4111-a111-111111111102', 'Department of Transport & Road Safety', 'Ministry of Transport', NOW()),
('d1111111-1111-4111-a111-111111111103', 'Department of Agriculture & Farmer Welfare', 'Ministry of Agriculture', NOW()),
('d1111111-1111-4111-a111-111111111104', 'Water Resources & Irrigation Department', 'Ministry of Water Resources', NOW()),
('d1111111-1111-4111-a111-111111111105', 'Urban Development Department (UDD)', 'Ministry of Urban Development', NOW()),
('d1111111-1111-4111-a111-111111111106', 'Environment & Climate Change Department', 'Ministry of Environment', NOW()),
('d1111111-1111-4111-a111-111111111107', 'School Education & Literacy Department', 'Ministry of School Education', NOW()),
('d1111111-1111-4111-a111-111111111108', 'Department of Skill Development & Entrepreneurship', 'Ministry of Skill Development', NOW()),
('d1111111-1111-4111-a111-111111111109', 'Home Department (Maharashtra Police Cyber)', 'Ministry of Home Affairs', NOW()),
('d1111111-1111-4111-a111-111111111110', 'Public Works Department (PWD)', 'Ministry of Public Works', NOW()),
('d1111111-1111-4111-a111-111111111111', 'Tribal Development Department', 'Ministry of Tribal Affairs', NOW()),
('d1111111-1111-4111-a111-111111111112', 'Department of Fisheries & Animal Husbandry', 'Ministry of Fisheries', NOW()),
('d1111111-1111-4111-a111-111111111113', 'Department of Tourism & Cultural Affairs', 'Ministry of Tourism', NOW()),
('d1111111-1111-4111-a111-111111111114', 'Food & Civil Supplies Department', 'Ministry of Civil Supplies', NOW())
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- 10. SEED AUTH.USERS AND AUTH.IDENTITIES WITH ROBUST BCRYPT HASH FOR Sparsh@2026
DO $$
DECLARE
  -- Pre-computed verified bcrypt hash for 'Sparsh@2026'
  pwd_hash TEXT := '$2a$12$zttg31qHR8wHaLz0qzXvBO9AEw9w4cg53PlbXVdDRxSHnda4wZVnS';
BEGIN
  -- Attempt to compute via pgcrypto if gen_salt is present and accessible
  BEGIN
    SET LOCAL search_path = public, extensions, auth;
    pwd_hash := crypt('Sparsh@2026', gen_salt('bf'::text, 10));
  EXCEPTION WHEN OTHERS THEN
    -- Fallback to precomputed $2a$ bcrypt hash
    pwd_hash := '$2a$12$zttg31qHR8wHaLz0qzXvBO9AEw9w4cg53PlbXVdDRxSHnda4wZVnS';
  END;

  -- Clean up existing demo accounts from auth.identities and auth.users
  DELETE FROM auth.identities WHERE user_id IN (
    SELECT id FROM auth.users WHERE email LIKE '%sparsh%'
  );
  DELETE FROM auth.users WHERE email LIKE '%sparsh%';

  -- Insert all 43 demo accounts into auth.users
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password, 
    email_confirmed_at, invited_at, confirmation_token, confirmation_sent_at, 
    recovery_token, recovery_sent_at, email_change_token_new, email_change, 
    email_change_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, 
    is_super_admin, created_at, updated_at, phone, phone_confirmed_at, 
    phone_change, phone_change_token, phone_change_sent_at, email_change_token_current, 
    email_change_confirm_status, banned_until, reauthentication_token, reauthentication_sent_at, 
    is_sso_user, deleted_at, is_anonymous
  ) VALUES
  -- 14 Department Officers
  ('10000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'health.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111101"}'::jsonb, '{"full_name":"Dr. Rajesh Kulkarni","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111101"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'transport.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111102"}'::jsonb, '{"full_name":"Anand Bhosale","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111102"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agriculture.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111103"}'::jsonb, '{"full_name":"Suresh Patil","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111103"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'water.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111104"}'::jsonb, '{"full_name":"Madhav Shinde","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111104"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'urban.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111105"}'::jsonb, '{"full_name":"Smita Deshmukh","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111105"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'environment.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111106"}'::jsonb, '{"full_name":"Vijay Pawar","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111106"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'education.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111107"}'::jsonb, '{"full_name":"Sunita Jadhav","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111107"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'skills.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111108"}'::jsonb, '{"full_name":"Prakash More","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111108"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'police.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111109"}'::jsonb, '{"full_name":"DCP Rakesh Kadam","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111109"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pwd.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111110"}'::jsonb, '{"full_name":"Sanjay Wagh","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111110"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tribal.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111111"}'::jsonb, '{"full_name":"Archana Gaikwad","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111111"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fisheries.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111112"}'::jsonb, '{"full_name":"Milind Salvi","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111112"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tourism.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111113"}'::jsonb, '{"full_name":"Rohan Sawant","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111113"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('10000000-0000-4000-a000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supplies.dept@sparsh-gov.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111114"}'::jsonb, '{"full_name":"Nitin Kamble","role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111114"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),

  -- 2 MSInS Admins
  ('20000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.chief@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"msins_admin"}'::jsonb, '{"full_name":"Dr. Ashish Deshmukh","role":"msins_admin"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('20000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.ops@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"msins_admin"}'::jsonb, '{"full_name":"Priya Kulkarni","role":"msins_admin"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),

  -- 3 Jury Evaluators
  ('30000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.deshmukh@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Prof. Ramesh Deshmukh","role":"evaluator"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('30000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.sharma@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Dr. Sunita Sharma","role":"evaluator"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('30000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.kulkarni@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Vikram Kulkarni","role":"evaluator"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),

  -- 2 Independent Validators
  ('40000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'validator.patil@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"validator"}'::jsonb, '{"full_name":"Dr. Anil Patil","role":"validator"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('40000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'validator.joshi@sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"validator"}'::jsonb, '{"full_name":"Meera Joshi","role":"validator"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),

  -- 22 Startup Founders
  ('50000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@cognitive.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aarav Mehta","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@healthpulse.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Neha Sharma","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000003', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@agrisense.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Rohan Patil","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@hydroflow.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Vikram Shinde","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@ecopure.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Pooja Kulkarni","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@edvanya.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aniket Deshmukh","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@skillbridge.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Siddharth More","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@cybershield.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Varun Kadam","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000009', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@infravision.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aditya Wagh","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@sunharvest.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Kavita Gaikwad","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@aquatrack.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Sameer Salvi","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@heritageverse.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Riya Sawant","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@rationtrust.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Gaurav Kamble","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@aerodrone.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Pranav Joshi","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000015', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@medichain.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Devendra Shah","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000016', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@cleansurge.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Manish Shinde","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000017', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@biovolt.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Sachin Kulkarni","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000018', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@vaniai.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Tanvi Joshi","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000019', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@georisk.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Alok Deshpande","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000020', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@safegrid.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Nikhil Thorat","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000021', '00000000-0000-4000-a000-000000000000', 'authenticated', 'authenticated', 'founder@fireguard.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Swati Mahajan","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE),
  ('50000000-0000-4000-a000-000000000022', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@oceanbounty.sparsh.in', pwd_hash, NOW(), NULL, '', NULL, '', NULL, '', '', NULL, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Rahul Bhosale","role":"startup_founder"}'::jsonb, FALSE, NOW(), NOW(), NULL, NULL, '', '', NULL, '', 0, NULL, '', NULL, FALSE, NULL, FALSE)
  ON CONFLICT (id) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    raw_app_meta_data = EXCLUDED.raw_app_meta_data,
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- Populate auth.identities for GoTrue login lookup
  INSERT INTO auth.identities (
    id, user_id, identity_data, provider, last_sign_in_at, created_at, updated_at, provider_id
  )
  SELECT 
    id, 
    id, 
    jsonb_build_object('sub', id::text, 'email', email, 'email_verified', true), 
    'email', 
    NOW(), 
    NOW(), 
    NOW(), 
    id::text
  FROM auth.users
  WHERE email LIKE '%sparsh%'
  ON CONFLICT DO NOTHING;
END $$;

-- 11. SEED PROFILES FOR ALL DEMO USERS
INSERT INTO public.profiles (id, role, full_name, email, department_id, verified) VALUES
('10000000-0000-4000-a000-000000000001', 'department_officer', 'Dr. Rajesh Kulkarni', 'health.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111101', true),
('10000000-0000-4000-a000-000000000002', 'department_officer', 'Anand Bhosale', 'transport.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111102', true),
('10000000-0000-4000-a000-000000000003', 'department_officer', 'Suresh Patil', 'agriculture.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111103', true),
('10000000-0000-4000-a000-000000000004', 'department_officer', 'Madhav Shinde', 'water.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111104', true),
('10000000-0000-4000-a000-000000000005', 'department_officer', 'Smita Deshmukh', 'urban.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111105', true),
('10000000-0000-4000-a000-000000000006', 'department_officer', 'Vijay Pawar', 'environment.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111106', true),
('10000000-0000-4000-a000-000000000007', 'department_officer', 'Sunita Jadhav', 'education.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111107', true),
('10000000-0000-4000-a000-000000000008', 'department_officer', 'Prakash More', 'skills.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111108', true),
('10000000-0000-4000-a000-000000000009', 'department_officer', 'DCP Rakesh Kadam', 'police.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111109', true),
('10000000-0000-4000-a000-000000000010', 'department_officer', 'Sanjay Wagh', 'pwd.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111110', true),
('10000000-0000-4000-a000-000000000011', 'department_officer', 'Archana Gaikwad', 'tribal.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111111', true),
('10000000-0000-4000-a000-000000000012', 'department_officer', 'Milind Salvi', 'fisheries.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111112', true),
('10000000-0000-4000-a000-000000000013', 'department_officer', 'Rohan Sawant', 'tourism.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111113', true),
('10000000-0000-4000-a000-000000000014', 'department_officer', 'Nitin Kamble', 'supplies.dept@sparsh-gov.in', 'd1111111-1111-4111-a111-111111111114', true),
('20000000-0000-4000-a000-000000000001', 'msins_admin', 'Dr. Ashish Deshmukh', 'admin.chief@sparsh.in', null, true),
('20000000-0000-4000-a000-000000000002', 'msins_admin', 'Priya Kulkarni', 'admin.ops@sparsh.in', null, true),
('30000000-0000-4000-a000-000000000001', 'evaluator', 'Prof. Ramesh Deshmukh', 'evaluator.deshmukh@sparsh.in', null, true),
('30000000-0000-4000-a000-000000000002', 'evaluator', 'Dr. Sunita Sharma', 'evaluator.sharma@sparsh.in', null, true),
('30000000-0000-4000-a000-000000000003', 'evaluator', 'Vikram Kulkarni', 'evaluator.kulkarni@sparsh.in', null, true),
('40000000-0000-4000-a000-000000000001', 'validator', 'Dr. Anil Patil', 'validator.patil@sparsh.in', null, true),
('40000000-0000-4000-a000-000000000002', 'validator', 'Meera Joshi', 'validator.joshi@sparsh.in', null, true),
('50000000-0000-4000-a000-000000000001', 'startup_founder', 'Aarav Mehta', 'founder@cognitive.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000002', 'startup_founder', 'Neha Sharma', 'founder@healthpulse.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000003', 'startup_founder', 'Rohan Patil', 'founder@agrisense.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000004', 'startup_founder', 'Vikram Shinde', 'founder@hydroflow.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000005', 'startup_founder', 'Pooja Kulkarni', 'founder@ecopure.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000006', 'startup_founder', 'Aniket Deshmukh', 'founder@edvanya.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000007', 'startup_founder', 'Siddharth More', 'founder@skillbridge.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000008', 'startup_founder', 'Varun Kadam', 'founder@cybershield.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000009', 'startup_founder', 'Aditya Wagh', 'founder@infravision.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000010', 'startup_founder', 'Kavita Gaikwad', 'founder@sunharvest.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000011', 'startup_founder', 'Sameer Salvi', 'founder@aquatrack.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000012', 'startup_founder', 'Riya Sawant', 'founder@heritageverse.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000013', 'startup_founder', 'Gaurav Kamble', 'founder@rationtrust.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000014', 'startup_founder', 'Pranav Joshi', 'founder@aerodrone.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000015', 'startup_founder', 'Devendra Shah', 'founder@medichain.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000016', 'startup_founder', 'Manish Shinde', 'founder@cleansurge.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000017', 'startup_founder', 'Sachin Kulkarni', 'founder@biovolt.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000018', 'startup_founder', 'Tanvi Joshi', 'founder@vaniai.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000019', 'startup_founder', 'Alok Deshpande', 'founder@georisk.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000020', 'startup_founder', 'Nikhil Thorat', 'founder@safegrid.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000021', 'startup_founder', 'Swati Mahajan', 'founder@fireguard.sparsh.in', null, true),
('50000000-0000-4000-a000-000000000022', 'startup_founder', 'Rahul Bhosale', 'founder@oceanbounty.sparsh.in', null, true)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role, department_id = EXCLUDED.department_id;

-- 12. SEED STARTUPS (22 STARTUPS)
INSERT INTO startups (id, user_id, name, dpiit_number, udyam_number, gstin, sector_tags, verified_status) VALUES
('61111111-1111-4111-a111-111111111101', '50000000-0000-4000-a000-000000000001', 'Cognitive Signals India Pvt Ltd', 'DPIIT-2024-10492', 'UDYAM-MH-12-00912', '27AAACC1234A1Z1', ARRAY['Traffic AI', 'Computer Vision'], true),
('61111111-1111-4111-a111-111111111102', '50000000-0000-4000-a000-000000000002', 'HealthPulse Technologies', 'DPIIT-2024-88391', 'UDYAM-MH-01-00832', '27BBBCC2345B1Z2', ARRAY['HealthTech', 'Telemedicine'], true),
('61111111-1111-4111-a111-111111111103', '50000000-0000-4000-a000-000000000003', 'AgriSense Remote Sensing Labs', 'DPIIT-2023-44120', 'UDYAM-MH-20-00341', '27CCCCD3456C1Z3', ARRAY['AgriTech', 'Satellite GIS'], true),
('61111111-1111-4111-a111-111111111104', '50000000-0000-4000-a000-000000000004', 'HydroFlow IoT Solutions', 'DPIIT-2024-66291', 'UDYAM-MH-15-00412', '27DDDEE4567D1Z4', ARRAY['Water Systems', 'IoT'], true),
('61111111-1111-4111-a111-111111111105', '50000000-0000-4000-a000-000000000005', 'EcoPure Environmental Systems', 'DPIIT-2023-11928', 'UDYAM-MH-04-00192', '27EEEFF5678E1Z5', ARRAY['CleanTech', 'Sensors'], true),
('61111111-1111-4111-a111-111111111106', '50000000-0000-4000-a000-000000000006', 'EdVanya Vernacular Learning', 'DPIIT-2024-99201', 'UDYAM-MH-18-00910', '27FFFGG6789F1Z6', ARRAY['EdTech', 'Vernacular Voice'], true),
('61111111-1111-4111-a111-111111111107', '50000000-0000-4000-a000-000000000007', 'SkillBridge AI Corp', 'DPIIT-2023-55102', 'UDYAM-MH-12-00551', '27GGGHH7890G1Z7', ARRAY['HRTech', 'Skills AI'], true),
('61111111-1111-4111-a111-111111111108', '50000000-0000-4000-a000-000000000008', 'CyberShield Media Forensics', 'DPIIT-2024-33104', 'UDYAM-MH-01-00331', '27HHHII8901H1Z8', ARRAY['CyberSecurity', 'Deepfake AI'], true),
('61111111-1111-4111-a111-111111111109', '50000000-0000-4000-a000-000000000009', 'InfraVision Automated Systems', 'DPIIT-2023-77189', 'UDYAM-MH-14-00771', '27IIIJJ9012I1Z9', ARRAY['Infrastructure', 'Computer Vision'], true),
('61111111-1111-4111-a111-111111111110', '50000000-0000-4000-a000-000000000010', 'SunHarvest IoT Logistics', 'DPIIT-2024-12904', 'UDYAM-MH-25-00129', '27JJJKK0123J1Z0', ARRAY['Cold Chain', 'IoT'], true),
('61111111-1111-4111-a111-111111111111', '50000000-0000-4000-a000-000000000011', 'AquaTrack Konkan Marine', 'DPIIT-2024-44910', 'UDYAM-MH-30-00449', '27KKKLL1234K1Z1', ARRAY['Marine Tech', 'Safety'], true),
('61111111-1111-4111-a111-111111111112', '50000000-0000-4000-a000-000000000012', 'HeritageVerse Interactive AR', 'DPIIT-2023-88192', 'UDYAM-MH-02-00881', '27LLLMM2345L1Z2', ARRAY['Tourism', 'AR/VR'], true),
('61111111-1111-4111-a111-111111111113', '50000000-0000-4000-a000-000000000013', 'RationTrust BioAudit', 'DPIIT-2024-66102', 'UDYAM-MH-10-00661', '27MMMNN3456M1Z3', ARRAY['GovTech', 'Biometrics'], true),
('61111111-1111-4111-a111-111111111114', '50000000-0000-4000-a000-000000000014', 'AeroDrone GIS Surveys', 'DPIIT-2024-22104', 'UDYAM-MH-09-00221', '27NNNOO4567N1Z4', ARRAY['Drones', 'GIS'], true),
('61111111-1111-4111-a111-111111111115', '50000000-0000-4000-a000-000000000015', 'MediChain Temperature Logix', 'DPIIT-2023-99301', 'UDYAM-MH-03-00993', '27OOOPP5678O1Z5', ARRAY['Pharma Supply', 'Logistics'], true),
('61111111-1111-4111-a111-111111111116', '50000000-0000-4000-a000-000000000016', 'CleanSurge Waste AI', 'DPIIT-2024-77402', 'UDYAM-MH-05-00774', '27PPPQQ6789P1Z6', ARRAY['Waste Mgmt', 'AI'], true),
('61111111-1111-4111-a111-111111111117', '50000000-0000-4000-a000-000000000017', 'BioVolt Green Biomass', 'DPIIT-2023-33410', 'UDYAM-MH-08-00334', '27QQQRR7890Q1Z7', ARRAY['Renewable Energy', 'Biomass'], true),
('61111111-1111-4111-a111-111111111118', '50000000-0000-4000-a000-000000000018', 'VaniAI Multi-Dialect Voice', 'DPIIT-2024-88203', 'UDYAM-MH-11-00882', '27RRRSS8901R1Z8', ARRAY['Voice AI', 'NLP'], true),
('61111111-1111-4111-a111-111111111119', '50000000-0000-4000-a000-000000000019', 'GeoRisk Flood Prediction', 'DPIIT-2023-11204', 'UDYAM-MH-16-00112', '27SSSTT9012S1Z9', ARRAY['Disaster Tech', 'GIS'], true),
('61111111-1111-4111-a111-111111111120', '50000000-0000-4000-a000-000000000020', 'SafeGrid Power Analytics', 'DPIIT-2024-55912', 'UDYAM-MH-21-00559', '27TTTUU0123T1Z0', ARRAY['Energy Grid', 'Smart Sensors'], true),
('61111111-1111-4111-a111-111111111121', '50000000-0000-4000-a000-000000000021', 'FireGuard Thermal AI', 'DPIIT-2024-44201', 'UDYAM-MH-27-00442', '27UUUVV1234U1Z1', ARRAY['Forestry AI', 'Thermal Vision'], true),
('61111111-1111-4111-a111-111111111122', '50000000-0000-4000-a000-000000000022', 'OceanBounty Fishery Analytics', 'DPIIT-2023-99105', 'UDYAM-MH-31-00991', '27VVVWW2345V1Z2', ARRAY['Aquaculture', 'Analytics'], true)
ON CONFLICT (id) DO NOTHING;

-- 13. SEED CHALLENGE CHARTERS, PILOTS, MILESTONES, ESCROW
INSERT INTO challenge_charters (id, department_id, created_by, title, problem_description, success_metric, budget_ceiling, pilot_duration_days, data_ip_sensitivity, status) VALUES
('c1111111-1111-4111-a111-111111111101', 'd1111111-1111-4111-a111-111111111101', '10000000-0000-4000-a000-000000000001', 'Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs', 'Primary Health Centres in remote Gadchiroli lack specialist doctors, leading to delayed maternal and emergency diagnostics.', 'Achieve 90% diagnostic accuracy vs certified doctors and reduce triage transfer delays by 40%.', 2500000.00, 120, 'high', 'demo_scheduled'),
('c1111111-1111-4111-a111-111111111102', 'd1111111-1111-4111-a111-111111111102', '10000000-0000-4000-a000-000000000002', 'Pune Urban Junction Adaptive Traffic Signal Control', 'Severe rush-hour bottlenecks on Karve Road and Hinjewadi IT corridor due to fixed-timer traffic signals.', 'Reduce peak-hour commuter delay times by minimum 25% without altering physical road geometry.', 3000000.00, 90, 'medium', 'piloting'),
('c1111111-1111-4111-a111-111111111103', 'd1111111-1111-4111-a111-111111111103', '10000000-0000-4000-a000-000000000003', 'Hyperspectral Yield Prediction for Vidarbha Cotton', 'Pest outbreaks and unpredictable rain ruin cotton crop yields in Yavatmal and Wardha without early warning.', 'Provide 14-day advance pest risk warning with >85% field validation accuracy across 5000 hectares.', 2000000.00, 150, 'low', 'published'),
('c1111111-1111-4111-a111-111111111104', 'd1111111-1111-4111-a111-111111111104', '10000000-0000-4000-a000-000000000004', 'Canal Seepage Detection & Automated Sluice Control', 'Unaccounted water loss of over 30% in Jayakwadi main canal due to unmonitored seepage and manual gate operations.', 'Detect canal seepage locations within 10-meter precision and automate gate opening efficiency by 20%.', 3500000.00, 90, 'low', 'shortlisting')
ON CONFLICT (id) DO NOTHING;

INSERT INTO pilots (id, charter_id, startup_id, contract_url, ip_clause_type, start_date, end_date, status) VALUES
('71111111-1111-4111-a111-111111111101', 'c1111111-1111-4111-a111-111111111102', '61111111-1111-4111-a111-111111111101', 'https://sparsh.gov.in/docs/contracts/pune_traffic_pilot.pdf', 'Standard IP Sharing', '2026-08-01', '2026-11-01', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO milestones (id, pilot_id, title, description, due_date, amount, status) VALUES
('81111111-1111-4111-a111-111111111101', '71111111-1111-4111-a111-111111111101', 'Milestone 1: Camera Edge Sensor Calibration', 'Install & calibrate 12 camera edge sensors at Karve Road junctions.', '2026-08-15', 1000000.00, 'paid'),
('81111111-1111-4111-a111-111111111102', '71111111-1111-4111-a111-111111111101', 'Milestone 2: Real-time Telemetry & 20% Flow Increase', 'Demonstrate 20% throughput increase in live traffic simulation.', '2026-09-15', 1000000.00, 'evidence_submitted'),
('81111111-1111-4111-a111-111111111103', '71111111-1111-4111-a111-111111111101', 'Milestone 3: Final 25% Reduction & Handover Report', 'Final field validation report confirmed by independent validator.', '2026-10-30', 1000000.00, 'pending')
ON CONFLICT (id) DO NOTHING;

INSERT INTO escrow_ledger_entries (id, pilot_id, milestone_id, amount, type, timestamp) VALUES
('e1111111-1111-4111-a111-111111111101', '71111111-1111-4111-a111-111111111101', '81111111-1111-4111-a111-111111111101', 1000000.00, 'released', NOW() - INTERVAL '15 days'),
('e1111111-1111-4111-a111-111111111102', '71111111-1111-4111-a111-111111111101', '81111111-1111-4111-a111-111111111102', 1000000.00, 'reserved', NOW())
ON CONFLICT (id) DO NOTHING;

-- 14. RELOAD SCHEMA POSTGREST CACHE
NOTIFY pgrst, 'reload schema';
`;

fs.writeFileSync(sqlPath, sqlContent, 'utf8');
console.log('Successfully generated updated full_setup.sql with exception fallback for pgcrypto!');
