-- ==============================================================================
-- BHARAT CAREER HUB: SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- ==============================================================================
-- Authoritative, zero-latency repository indexing gazetted vacancies across
-- Union Ministries, State Public Service Commissions, Railways, Defence & Banks.
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE job_status AS ENUM ('active', 'closing-soon', 'expired', 'draft');
CREATE TYPE job_category AS ENUM (
  'UPSC',
  'SSC',
  'Railways',
  'Banking and Financial Institutions',
  'Army',
  'Navy',
  'Air Force',
  'Defence organizations',
  'State Public Service Commissions',
  'State Government Departments',
  'PSUs',
  'Teaching',
  'Healthcare',
  'Police and Paramilitary',
  'Judiciary',
  'Engineering',
  'Research organizations',
  'Other'
);

-- 3. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  organization TEXT NOT NULL,
  category job_category NOT NULL,
  location TEXT NOT NULL, -- e.g., 'All India', 'Uttar Pradesh', 'New Delhi'
  qualification TEXT NOT NULL, -- e.g., "Bachelor's Degree", "10th / Matric", "B.E. / B.Tech"
  vacancies INTEGER NOT NULL DEFAULT 1 CHECK (vacancies >= 0),
  salary TEXT NOT NULL, -- e.g., 'Level 10 (7th CPC) - ₹56,100 to ₹1,77,500'
  age_limit TEXT NOT NULL, -- e.g., '21 - 32 Years (Relaxation as per norms)'
  application_start_date TIMESTAMPTZ NOT NULL,
  application_end_date TIMESTAMPTZ NOT NULL,
  examination_date TEXT, -- e.g., '25 May 2025' or 'June - July 2025'
  official_notification_url TEXT NOT NULL,
  official_application_url TEXT NOT NULL,
  status job_status NOT NULL DEFAULT 'active',
  verified_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Additional Rich Metadata
  advt_number TEXT,
  cadre_group TEXT DEFAULT 'Group A & B',
  gazette_ref TEXT,
  selection_process TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. SAVED JOBS (USER BOOKMARKS)
CREATE TABLE IF NOT EXISTS public.saved_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  UNIQUE(user_id, job_id)
);

-- 5. JOB ALERTS SUBSCRIPTIONS
CREATE TABLE IF NOT EXISTS public.job_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  phone TEXT,
  channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email', 'sms', 'whatsapp')),
  category_filter TEXT,
  state_filter TEXT,
  qualification_filter TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- 6. USER PROFILES & OTR (One-Time Registration)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  aadhaar_verified BOOLEAN DEFAULT FALSE,
  digilocker_linked BOOLEAN DEFAULT FALSE,
  highest_qualification TEXT,
  category TEXT DEFAULT 'General', -- General, OBC, SC, ST, EWS
  dob DATE,
  state_of_domicile TEXT,
  is_admin BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs(category);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs(location);
CREATE INDEX IF NOT EXISTS idx_jobs_deadline ON public.jobs(application_end_date);
CREATE INDEX IF NOT EXISTS idx_jobs_title_trgm ON public.jobs USING gin (to_tsvector('english', title || ' ' || department || ' ' || organization));
CREATE INDEX IF NOT EXISTS idx_saved_jobs_user ON public.saved_jobs(user_id);

-- 8. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- JOBS POLICIES:
-- Anyone (authenticated or anonymous) can view active and non-draft jobs
CREATE POLICY "Public can view active jobs" ON public.jobs
  FOR SELECT USING (status != 'draft');

-- Only authenticated admins can insert/update/delete jobs
CREATE POLICY "Admins can manage jobs" ON public.jobs
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.user_profiles WHERE user_profiles.id = auth.uid() AND user_profiles.is_admin = TRUE));

-- SAVED JOBS POLICIES:
-- Users can only view and manage their own bookmarks
CREATE POLICY "Users can manage their own saved jobs" ON public.saved_jobs
  FOR ALL TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- USER PROFILES POLICIES:
CREATE POLICY "Users can view and edit own profile" ON public.user_profiles
  FOR ALL TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- 9. SEED DATA (SAMPLE REALISTIC CIVIC NOTIFICATIONS)
INSERT INTO public.jobs (
  title, department, organization, category, location, qualification, vacancies, salary, age_limit,
  application_start_date, application_end_date, examination_date, official_notification_url,
  official_application_url, status, verified_at, advt_number, cadre_group, gazette_ref,
  selection_process, description
) VALUES
(
  'Civil Services Examination (CSE) & Indian Forest Service (Prelims) 2025',
  'Department of Personnel & Training (DoPT)',
  'Union Public Service Commission (UPSC)',
  'UPSC',
  'All India',
  'Graduation Degree (Any UGC Discipline)',
  1056,
  'Level 10 (7th CPC) - ₹56,100 basic + DA/HRA',
  '21 - 32 Years (Relaxation: OBC 3 yrs, SC/ST 5 yrs)',
  '2025-01-22 10:00:00+00',
  '2025-03-05 18:00:00+00',
  '25 May 2025 (CS(P))',
  'https://upsc.gov.in/sites/default/files/Notice-CSP-2025-engl.pdf',
  'https://upsconline.nic.in',
  'closing-soon',
  NOW(),
  'Advt No: 04/2025-CSP',
  'Group A Gazetted',
  'Gazette Extraordinary Pt II Sec 3(i)',
  'Preliminary Exam (Objective) + Main Exam (Written) + Personality Test / Interview',
  'Recruitment for Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), Indian Revenue Service (IRS), and 24 other premier Central Services.'
),
(
  'Combined Graduate Level Examination (CGL) 2025',
  'Department of Personnel and Training',
  'Staff Selection Commission (SSC)',
  'SSC',
  'All India',
  'Bachelor''s Degree from Recognised University',
  14582,
  'Levels 4 to 8 (7th CPC) - ₹25,500 to ₹47,600 basic',
  '18 - 32 Years (Varies by specific post cadre)',
  '2025-01-15 10:00:00+00',
  '2025-03-22 23:00:00+00',
  'Tier-I CBT June 2025',
  'https://ssc.gov.in/api/assets/uploads/cgl_notice_2025.pdf',
  'https://ssc.gov.in',
  'active',
  NOW(),
  'F.No. 3/1/2025-P&P-I',
  'Group B & C Posts',
  'Govt Notice SSC-CGL/2025',
  'Computer Based Exam (Tier-I) + Tier-II Computer Based Exam + DEST / Data Entry Skill Test',
  'Recruitment of Assistant Section Officer (ASO in CSS/MEA), Inspector of Income Tax, Central Excise Inspector, Sub-Inspector (CBI), and Divisional Accountant.'
),
(
  'Assistant Loco Pilot (ALP) & Technicians Recruitment 2025',
  'Ministry of Railways',
  'Railway Recruitment Boards (RRB)',
  'Railways',
  'All India (21 Zonal RRBs)',
  'Matriculation + ITI / Diploma in Mech/Elec/Auto Engineering',
  18799,
  'Level 2 (7th CPC) - ₹19,900 + Running Allowance',
  '18 - 30 Years (As on 01.07.2025)',
  '2025-01-20 00:00:00+00',
  '2025-03-30 23:59:00+00',
  'CBT-1 July - August 2025',
  'https://www.rrbchennai.gov.in/cen-01-2025.pdf',
  'https://www.rrbapply.gov.in',
  'active',
  NOW(),
  'CEN 01/2025',
  'Group C Technical',
  'Railway Board Employment Gazette CEN-01/2025',
  'CBT-1 + CBT-2 (Part A & B) + Computer Based Aptitude Test (CBAT) + Document Verification & Medical (A-1)',
  'Centralized Employment Notice for ALP across 21 Railway Recruitment Boards Pan-India serving Indian Railways.'
),
(
  'Recruitment of Probationary Officers (PO) 2025',
  'State Bank of India',
  'SBI Central Recruitment & Promotion Department',
  'Banking and Financial Institutions',
  'All India',
  'Graduation (Any Stream) from recognized University',
  2000,
  'Starting Emoluments ₹65,780/mo (Basic ₹41,960 + 4 increments)',
  '21 - 30 Years (As on 01.04.2025)',
  '2025-02-01 00:00:00+00',
  '2025-03-10 23:59:00+00',
  'Prelims March 2025, Mains April 2025',
  'https://sbi.co.in/documents/crpd-po-2024-25.pdf',
  'https://sbi.co.in/careers',
  'closing-soon',
  NOW(),
  'CRPD/PO/2024-25/18',
  'JMGS-I Officer Scale',
  'SBI Board Resolution #2025/18',
  'Phase-I Preliminary Exam (Online) + Phase-II Main Exam (Objective + Descriptive) + Phase-III GE & Interview',
  'Recruitment of Probationary Officers (Junior Management Grade Scale I) across countrywide banking operations.'
),
(
  'Scientist / Engineer ''SC'' (Civil, Electrical, Mechanical & Electronics)',
  'Department of Space',
  'Indian Space Research Organisation (ISRO)',
  'Research organizations',
  'All India (Bengaluru, Thiruvananthapuram, Sriharikota)',
  'B.E. / B.Tech or equivalent in first class with minimum aggregate 65%',
  315,
  'Level 10 (7th CPC) - ₹56,100 basic + DA/HRA',
  '18 - 28 Years (Relaxable for SC/ST/OBC/PwBD)',
  '2025-01-28 10:00:00+00',
  '2025-02-28 17:00:00+00',
  'Written Test 04 May 2025',
  'https://www.isro.gov.in/icrb_recruitment_sc_2025.pdf',
  'https://www.isro.gov.in/careers',
  'expired',
  NOW(),
  'ISRO:ICRB:02(EM):2025',
  'Group A Gazetted Scientific',
  'ISRO Gazette Circular 2025/02',
  'Screening Written Examination + Comprehensive Technical Interview',
  'Research and development scientific cadre across VSSC, URSC, LPSC, and SAC Centers.'
),
(
  'National Defence Academy & Naval Academy Examination (I) 2025',
  'Ministry of Defence',
  'Union Public Service Commission (UPSC)',
  'Army',
  'Pune (NDA Khadakwasla) & Ezhimala (INAC)',
  '12th Pass (Physics, Chemistry & Mathematics)',
  400,
  'Lieutenant (Level 10) post-commissioning stipend ₹56,100/mo',
  '16.5 - 19.5 Years (Unmarried Male & Female candidates)',
  '2025-01-10 10:00:00+00',
  '2025-03-02 18:00:00+00',
  '13 April 2025',
  'https://upsc.gov.in/sites/default/files/Notice-NDA-I-2025.pdf',
  'https://upsconline.nic.in',
  'closing-soon',
  NOW(),
  'Notice No. 03/2025-NDA-I',
  'Defence Commission',
  'Gazette of India Defence Notification 2025',
  'Written Examination (Maths 300 marks + GAT 600 marks) + 5-day SSB Interview & Medical Fitness',
  'Admission to Army, Navy, and Air Force wings of NDA for 155th Course and 117th Indian Naval Academy Course.'
),
(
  'Combined State / Upper Subordinate Services (PCS) Examination 2025',
  'Department of Appointment & Personnel, UP',
  'Uttar Pradesh Public Service Commission (UPPSC)',
  'State Public Service Commissions',
  'Uttar Pradesh',
  'Bachelor''s Degree in any discipline with OTR Registration',
  420,
  'Grade Pay ₹4,600 - ₹5,400 (Level 8 to 10 equivalent)',
  '21 - 40 Years (UP domicile age relaxation applicable)',
  '2025-01-01 10:00:00+00',
  '2025-04-14 23:59:00+00',
  'Prelims 18 June 2025',
  'https://uppsc.up.nic.in/StaticPages/Advt_PCS_2025.pdf',
  'https://uppsc.up.nic.in',
  'active',
  NOW(),
  'Advt A-1/E-1/2025',
  'Group A & B Executive',
  'UP State Gazette Extraordinary No. 12/2025',
  'Preliminary Examination + Main Examination (Conventional) + Viva-Voce / Interview',
  'Recruitment for Sub-Divisional Magistrate (SDM), Deputy Superintendent of Police (DSP), and Block Development Officer (BDO).'
),
(
  'Nursing Officer Recruitment Common Eligibility Test (NORCET-07)',
  'Ministry of Health & Family Welfare',
  'All India Institute of Medical Sciences (AIIMS New Delhi)',
  'Healthcare',
  'All India (Pan-AIIMS Hospitals)',
  'B.Sc Nursing / Post Basic B.Sc Nursing or GNM with 2 yrs experience',
  3450,
  'Level 7 (7th CPC) - ₹44,900 to ₹1,42,400',
  '18 - 30 Years',
  '2025-02-15 00:00:00+00',
  '2025-04-08 17:00:00+00',
  'Stage I Preliminary: 15 May 2025',
  'https://aiimsexams.ac.in/norcet-07-notice.pdf',
  'https://aiimsexams.ac.in',
  'active',
  NOW(),
  'Notice 28/2025',
  'Group B Non-Gazetted',
  'AIIMS Academic & Recruitment Circular 28/2025',
  'NORCET Stage I (Prelims) + Stage II (Mains) + Document Verification & Hospital Allocation',
  'Centralized nursing officer recruitment for AIIMS New Delhi and all 18 new AIIMS hospitals across India.'
);

-- ==============================================================================
-- SETUP INSTRUCTIONS TO CONNECT SUPABASE:
-- 1. Create a free project at https://supabase.com
-- 2. Open SQL Editor in your Supabase dashboard and run this entire file.
-- 3. In your environment file (.env.local), supply:
--    VITE_SUPABASE_URL=https://your-project.supabase.co
--    VITE_SUPABASE_ANON_KEY=your-anon-public-key
-- 4. Enable Google Provider under Authentication > Providers in Supabase.
-- 5. Bharat Career Hub will instantly switch from LocalStorage to live Supabase!
-- ==============================================================================
