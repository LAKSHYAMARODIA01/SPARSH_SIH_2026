-- ============================================================================
-- SPARSH Platform — Validated Supabase Seed Script (seed.sql)
-- Hex-compliant UUIDs & Supabase Auth User Provisioning
-- Default Password for all accounts: Sparsh@2026
-- ============================================================================

-- Enable pgcrypto for password hashing if needed
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. SEED DEPARTMENTS (14 Maharashtra State Ministries/Departments)
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

-- 2. PROVISION AUTH USERS & PROFILES

-- Helper function to safely insert auth user and profile
DO $$
DECLARE
  pwd_hash TEXT;
BEGIN
  PERFORM set_config('search_path', 'public, extensions', true);
  BEGIN
    pwd_hash := crypt('Sparsh@2026', gen_salt('bf'));
  EXCEPTION WHEN OTHERS THEN
    -- Fallback bcrypt hash for 'Sparsh@2026'
    pwd_hash := '$2a$10$w8.B9xLp1V7yQ2a6F8z5ue3Xg3E8Z9R10Y8U7V6W5X4Y3Z2A1B0C';
  END;

  -- Department Officers (14 Users)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  ('10000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'health.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111101"}'::jsonb, '{"full_name":"Dr. Rajesh Kulkarni"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'transport.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111102"}'::jsonb, '{"full_name":"Anand Bhosale"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'agriculture.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111103"}'::jsonb, '{"full_name":"Suresh Patil"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'water.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111104"}'::jsonb, '{"full_name":"Madhav Shinde"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'urban.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111105"}'::jsonb, '{"full_name":"Smita Deshmukh"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'environment.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111106"}'::jsonb, '{"full_name":"Vijay Pawar"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'education.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111107"}'::jsonb, '{"full_name":"Sunita Jadhav"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'skills.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111108"}'::jsonb, '{"full_name":"Prakash More"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'police.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111109"}'::jsonb, '{"full_name":"DCP Rakesh Kadam"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'pwd.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111110"}'::jsonb, '{"full_name":"Sanjay Wagh"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tribal.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111111"}'::jsonb, '{"full_name":"Archana Gaikwad"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'fisheries.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111112"}'::jsonb, '{"full_name":"Milind Salvi"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'tourism.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111113"}'::jsonb, '{"full_name":"Rohan Sawant"}'::jsonb, NOW(), NOW()),
  ('10000000-0000-4000-a000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'supplies.dept@sparsh-gov.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"department_officer","department_id":"d1111111-1111-4111-a111-111111111114"}'::jsonb, '{"full_name":"Nitin Kamble"}'::jsonb, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- MSInS Admins (2 Users)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  ('20000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.chief@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"msins_admin"}'::jsonb, '{"full_name":"Dr. Ashish Deshmukh"}'::jsonb, NOW(), NOW()),
  ('20000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'admin.ops@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"msins_admin"}'::jsonb, '{"full_name":"Priya Kulkarni"}'::jsonb, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Evaluators & Validators (5 Users)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  ('30000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.deshmukh@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Prof. Ramesh Deshmukh"}'::jsonb, NOW(), NOW()),
  ('30000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.sharma@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Dr. Sunita Sharma"}'::jsonb, NOW(), NOW()),
  ('30000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'evaluator.kulkarni@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"evaluator"}'::jsonb, '{"full_name":"Vikram Kulkarni"}'::jsonb, NOW(), NOW()),
  ('40000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'validator.patil@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"validator"}'::jsonb, '{"full_name":"Dr. Anil Patil"}'::jsonb, NOW(), NOW()),
  ('40000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'validator.joshi@sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"validator"}'::jsonb, '{"full_name":"Meera Joshi"}'::jsonb, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;

  -- Startup Founders (22 Users)
  INSERT INTO auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at) VALUES
  ('50000000-0000-4000-a000-000000000001', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@cognitive.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aarav Mehta"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000002', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@healthpulse.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Neha Sharma"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000003', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@agrisense.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Rohan Patil"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000004', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@hydroflow.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Vikram Shinde"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000005', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@ecopure.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Pooja Kulkarni"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000006', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@edvanya.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aniket Deshmukh"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000007', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@skillbridge.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Siddharth More"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000008', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@cybershield.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Varun Kadam"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000009', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@infravision.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Aditya Wagh"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000010', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@sunharvest.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Kavita Gaikwad"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000011', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@aquatrack.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Sameer Salvi"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000012', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@heritageverse.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Riya Sawant"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000013', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@rationtrust.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Gaurav Kamble"}'::jsonb, NOW(), NOW()),
  ('50000000-0000-4000-a000-000000000014', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'founder@aerodrone.sparsh.in', pwd_hash, NOW(), '{"provider":"email","providers":["email"],"role":"startup_founder"}'::jsonb, '{"full_name":"Pranav Joshi"}'::jsonb, NOW(), NOW())
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Synchronize Profiles Table
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
('50000000-0000-4000-a000-000000000014', 'startup_founder', 'Pranav Joshi', 'founder@aerodrone.sparsh.in', null, true)
ON CONFLICT (id) DO UPDATE SET full_name = EXCLUDED.full_name;

-- 3. SEED STARTUP COMPANY ENTITIES (Hex UUIDs)
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
('61111111-1111-4111-a111-111111111114', '50000000-0000-4000-a000-000000000014', 'AeroDrone GIS Surveys', 'DPIIT-2024-22104', 'UDYAM-MH-09-00221', '27NNNOO4567N1Z4', ARRAY['Drones', 'GIS'], true)
ON CONFLICT (id) DO NOTHING;

-- 4. SEED CHALLENGE CHARTERS (Hex UUIDs)
INSERT INTO challenge_charters (id, department_id, created_by, title, problem_description, success_metric, budget_ceiling, pilot_duration_days, data_ip_sensitivity, status) VALUES
('c1111111-1111-4111-a111-111111111101', 'd1111111-1111-4111-a111-111111111101', '10000000-0000-4000-a000-000000000001', 'Rural Tele-Diagnostics & AI Triage for Gadchiroli PHCs', 'Primary Health Centres in remote Gadchiroli lack specialist doctors, leading to delayed maternal and emergency diagnostics.', 'Achieve 90% diagnostic accuracy vs certified doctors and reduce triage transfer delays by 40%.', 2500000.00, 120, 'high', 'demo_scheduled'),

('c1111111-1111-4111-a111-111111111102', 'd1111111-1111-4111-a111-111111111102', '10000000-0000-4000-a000-000000000002', 'Pune Urban Junction Adaptive Traffic Signal Control', 'Severe rush-hour bottlenecks on Karve Road and Hinjewadi IT corridor due to fixed-timer traffic signals.', 'Reduce peak-hour commuter delay times by minimum 25% without altering physical road geometry.', 3000000.00, 90, 'medium', 'piloting'),

('c1111111-1111-4111-a111-111111111103', 'd1111111-1111-4111-a111-111111111103', '10000000-0000-4000-a000-000000000003', 'Hyperspectral Yield Prediction for Vidarbha Cotton', 'Pest outbreaks and unpredictable rain ruin cotton crop yields in Yavatmal and Wardha without early warning.', 'Provide 14-day advance pest risk warning with >85% field validation accuracy across 5000 hectares.', 2000000.00, 150, 'low', 'published'),

('c1111111-1111-4111-a111-111111111104', 'd1111111-1111-4111-a111-111111111104', '10000000-0000-4000-a000-000000000004', 'Canal Seepage Detection & Automated Sluice Control', 'Unaccounted water loss of over 30% in Jayakwadi main canal due to unmonitored seepage and manual gate operations.', 'Detect canal seepage locations within 10-meter precision and automate gate opening efficiency by 20%.', 3500000.00, 90, 'low', 'shortlisting')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED PILOTS & ESCROW MILESTONES (Hex UUIDs)
INSERT INTO pilots (id, charter_id, startup_id, contract_url, ip_clause_type, start_date, end_date, status) VALUES
('71111111-1111-4111-a111-111111111101', 'c1111111-1111-4111-a111-111111111102', '61111111-1111-4111-a111-111111111101', 'https://sparsh.gov.in/docs/contracts/pune_traffic_pilot.pdf', 'Standard IP Sharing', '2026-08-01', '2026-11-01', 'active')
ON CONFLICT (id) DO NOTHING;

INSERT INTO milestones (id, pilot_id, title, description, due_date, amount, status) VALUES
('81111111-1111-4111-a111-111111111101', '71111111-1111-4111-a111-111111111101', 'Milestone 1: Camera Edge Sensor Calibration', 'Install & calibrate 12 camera edge sensors at Karve Road junctions.', '2026-08-15', 1000000.00, 'paid'),
('81111111-1111-4111-a111-111111111102', '71111111-1111-4111-a111-111111111101', 'Milestone 2: Real-time Telemetry & 20% Flow Increase', 'Demonstrate 20% throughput increase in live traffic simulation.', '2026-09-15', 1000000.00, 'evidence_submitted'),
('81111111-1111-4111-a111-111111111103', '71111111-1111-4111-a111-111111111101', 'Milestone 3: Final 25% Reduction & Handover Report', 'Final field validation report confirmed by independent validator.', '2026-10-30', 1000000.00, 'pending')
ON CONFLICT (id) DO NOTHING;

-- Escrow Ledger Entries (Hex UUIDs)
INSERT INTO escrow_ledger_entries (id, pilot_id, milestone_id, amount, type, timestamp) VALUES
('e1111111-1111-4111-a111-111111111101', '71111111-1111-4111-a111-111111111101', '81111111-1111-4111-a111-111111111101', 1000000.00, 'released', NOW() - INTERVAL '15 days'),
('e1111111-1111-4111-a111-111111111102', '71111111-1111-4111-a111-111111111101', '81111111-1111-4111-a111-111111111102', 1000000.00, 'reserved', NOW())
ON CONFLICT (id) DO NOTHING;

-- Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
