-- ============================================================================
-- SPARSH Platform — Clean Database Reset Script (reset.sql)
-- Drops all public tables, triggers, and ENUM types for a fresh re-run.
-- ============================================================================

-- 1. Drop Auth Triggers and Functions
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;

-- 2. Drop Core Tables in Reverse Dependency Order
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

-- 3. Drop Custom ENUM Types
DROP TYPE IF EXISTS scale_decision_enum CASCADE;
DROP TYPE IF EXISTS validation_outcome_enum CASCADE;
DROP TYPE IF EXISTS escrow_type_enum CASCADE;
DROP TYPE IF EXISTS milestone_status_enum CASCADE;
DROP TYPE IF EXISTS charter_status_enum CASCADE;
DROP TYPE IF EXISTS data_sensitivity_enum CASCADE;
DROP TYPE IF EXISTS user_role_enum CASCADE;

-- 4. Clean up SPARSH Test Users from auth.users
DELETE FROM auth.users WHERE email LIKE '%@sparsh-gov.in' OR email LIKE '%@sparsh.in';

-- 5. Force PostgREST schema cache reload
NOTIFY pgrst, 'reload schema';
