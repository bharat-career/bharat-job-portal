/**
 * Bharat Career Hub - Job Data Service & LocalStorage Fallback Store
 * All notifications are realistic demonstration data indexed from official Indian Gazettes and Commissions.
 */

import { Job, JobFilters, ExamEvent, JobAlertSubscription } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const STORAGE_KEY_JOBS = 'bharat_career_hub_jobs_v2';
const STORAGE_KEY_SAVED = 'bharat_career_hub_saved_ids';
const STORAGE_KEY_ALERTS = 'bharat_career_hub_alerts';

export function mapSupabaseRowToJob(row: any): Job {
  return {
    id: row.id,
    title: row.title,
    department: row.department,
    organization: row.organization,
    category: row.category,
    location: row.location,
    qualification: row.qualification,
    vacancies: Number(row.vacancies) || 1,
    salary: row.salary,
    ageLimit: row.age_limit || '',
    applicationStartDate: row.application_start_date,
    applicationEndDate: row.application_end_date,
    examinationDate: row.examination_date || undefined,
    officialNotificationUrl: row.official_notification_url,
    officialApplicationUrl: row.official_application_url,
    status: row.status,
    verifiedAt: row.verified_at || undefined,
    advtNumber: row.advt_number || undefined,
    cadreGroup: row.cadre_group || undefined,
    gazetteRef: row.gazette_ref || undefined,
    selectionProcess: row.selection_process || undefined,
    description: row.description || undefined,
  };
}

export const INITIAL_JOBS_SEED: Job[] = [
  {
    id: 'upsc-cse-2025',
    title: 'Civil Services Examination (CSE) & Indian Forest Service (Prelims) 2025',
    department: 'Department of Personnel & Training (DoPT)',
    organization: 'Union Public Service Commission (UPSC)',
    category: 'UPSC',
    location: 'All India',
    qualification: 'Graduation Degree (Any UGC Discipline)',
    vacancies: 1056,
    salary: 'Level 10 (7th CPC) - ₹56,100 basic + DA/HRA',
    ageLimit: '21 - 32 Years (Relaxation: OBC 3 yrs, SC/ST 5 yrs)',
    applicationStartDate: '2025-01-22T10:00:00Z',
    applicationEndDate: '2025-03-05T18:00:00Z',
    examinationDate: '25 May 2025 (CS(P))',
    officialNotificationUrl: 'https://upsc.gov.in/sites/default/files/Notice-CSP-2025-engl.pdf',
    officialApplicationUrl: 'https://upsconline.nic.in',
    status: 'closing-soon',
    verifiedAt: '2025-02-20T08:30:00Z',
    advtNumber: 'Advt No: 04/2025-CSP',
    cadreGroup: 'Group A Gazetted',
    gazetteRef: 'Gazette of India Extraordinary Part II Section 3(i)',
    selectionProcess: 'Preliminary Examination (Objective) + Main Examination (Conventional Essay & Papers) + Personality Test / Viva-Voce',
    description: 'Premier recruitment for the Indian Administrative Service (IAS), Indian Police Service (IPS), Indian Foreign Service (IFS), Indian Revenue Service (IRS), and 24 other premier Group A & B Civil Services.',
    applicationFee: {
      generalOBC: '₹100',
      scStPwbdWomen: 'Exempted (Zero Fee)',
    },
    categoryBreakdown: [
      { category: 'UR (General)', count: 432 },
      { category: 'EWS', count: 105 },
      { category: 'OBC', count: 285 },
      { category: 'SC', count: 158 },
      { category: 'ST', count: 76 },
    ],
    importantDates: [
      { label: 'Notification Released', date: '22 Jan 2025' },
      { label: 'Last Date to Apply', date: '05 Mar 2025 (06:00 PM)' },
      { label: 'Application Correction Window', date: '06 - 12 Mar 2025' },
      { label: 'CS Prelims Exam Date', date: '25 May 2025' },
    ],
    syllabusTopics: [
      'General Studies Paper-I (History, Geography, Polity, Economy, Environment, Science)',
      'General Studies Paper-II (CSAT Qualifying 33%)',
      'Mains 9 Papers: Essay, GS I-IV, 2 Optional Papers, 2 Language Qualifying',
    ],
  },
  {
    id: 'ssc-cgl-2025',
    title: 'Combined Graduate Level Examination (CGL) 2025',
    department: 'Department of Personnel & Training',
    organization: 'Staff Selection Commission (SSC)',
    category: 'SSC',
    location: 'All India',
    qualification: "Bachelor's Degree from a recognised University",
    vacancies: 14582,
    salary: 'Levels 4 to 8 (7th CPC) - ₹25,500 to ₹47,600 basic',
    ageLimit: '18 - 32 Years (Varies by post cadre)',
    applicationStartDate: '2025-01-15T10:00:00Z',
    applicationEndDate: '2025-03-22T23:00:00Z',
    examinationDate: 'Tier-I CBT June 2025',
    officialNotificationUrl: 'https://ssc.gov.in/api/assets/uploads/cgl_notice_2025.pdf',
    officialApplicationUrl: 'https://ssc.gov.in',
    status: 'active',
    verifiedAt: '2025-02-18T10:15:00Z',
    advtNumber: 'F.No. 3/1/2025-P&P-I',
    cadreGroup: 'Group B & C Posts',
    gazetteRef: 'Official SSC Portal Notice / SSC-CGL/2025',
    selectionProcess: 'Tier-I Computer Based Examination + Tier-II Computer Based Examination + Data Entry Speed Test (DEST)',
    description: 'Centralized recruitment for Assistant Section Officer (ASO in CSS, MEA, IB, Rail), Inspector of Income Tax, Central Excise Inspector, Sub-Inspector (CBI), and Auditor.',
    applicationFee: {
      generalOBC: '₹100',
      scStPwbdWomen: 'Exempted (Zero Fee)',
    },
    categoryBreakdown: [
      { category: 'UR', count: 6150 },
      { category: 'EWS', count: 1458 },
      { category: 'OBC', count: 3937 },
      { category: 'SC', count: 2187 },
      { category: 'ST', count: 850 },
    ],
    importantDates: [
      { label: 'Application Start', date: '15 Jan 2025' },
      { label: 'Closing Date', date: '22 Mar 2025 (23:00)' },
      { label: 'Tier-I CBT Tentative', date: '24 June - 06 July 2025' },
    ],
    syllabusTopics: [
      'Reasoning & General Intelligence (50 marks)',
      'General Awareness (50 marks)',
      'Quantitative Aptitude (50 marks)',
      'English Comprehension (50 marks)',
    ],
  },
  {
    id: 'rrb-alp-2025',
    title: 'Assistant Loco Pilot (ALP) & Technicians Recruitment 2025',
    department: 'Ministry of Railways',
    organization: 'Railway Recruitment Boards (RRB)',
    category: 'Railways',
    location: 'All India (21 Zonal RRBs)',
    qualification: 'Matriculation + ITI / Diploma in Mechanical / Electrical / Auto Engineering',
    vacancies: 18799,
    salary: 'Level 2 (7th CPC) - ₹19,900 + Running Allowances',
    ageLimit: '18 - 30 Years (As of 01.07.2025)',
    applicationStartDate: '2025-01-20T00:00:00Z',
    applicationEndDate: '2025-03-30T23:59:00Z',
    examinationDate: 'CBT-1 July - August 2025',
    officialNotificationUrl: 'https://www.rrbchennai.gov.in/cen-01-2025.pdf',
    officialApplicationUrl: 'https://www.rrbapply.gov.in',
    status: 'active',
    verifiedAt: '2025-02-19T14:20:00Z',
    advtNumber: 'CEN 01/2025',
    cadreGroup: 'Group C Technical',
    gazetteRef: 'Railway Board Notification CEN-01/2025',
    selectionProcess: 'CBT-1 (Screening) + CBT-2 (Part A & B) + Computer Based Aptitude Test (CBAT) + Document Verification & Medical (A-1 Standard)',
    description: 'Direct recruitment for Assistant Loco Pilots across 21 Railway Recruitment Boards Pan-India serving the nationwide passenger and freight network of Indian Railways.',
    applicationFee: {
      generalOBC: '₹500 (₹400 refundable after appearing in CBT-1)',
      scStPwbdWomen: '₹250 (Full ₹250 refundable after CBT-1)',
    },
    categoryBreakdown: [
      { category: 'UR', count: 7799 },
      { category: 'EWS', count: 1880 },
      { category: 'OBC', count: 5075 },
      { category: 'SC', count: 2820 },
      { category: 'ST', count: 1225 },
    ],
    importantDates: [
      { label: 'Online Application Opened', date: '20 Jan 2025' },
      { label: 'Application Deadline', date: '30 Mar 2025' },
      { label: 'CBT 1 Exam Window', date: 'July - August 2025' },
    ],
    syllabusTopics: [
      'Mathematics, General Intelligence & Reasoning',
      'General Science (Physics, Chemistry, Life Sciences 10th level)',
      'Basic Science and Engineering Drawing',
    ],
  },
  {
    id: 'sbi-po-2025',
    title: 'Recruitment of Probationary Officers (PO) 2025',
    department: 'State Bank of India',
    organization: 'SBI Central Recruitment & Promotion Department',
    category: 'Banking and Financial Institutions',
    location: 'All India',
    qualification: 'Graduate (Any Stream) from recognized University',
    vacancies: 2000,
    salary: 'Starting Emolument ₹65,780 / mo (Basic ₹41,960 + 4 increments)',
    ageLimit: '21 - 30 Years (As on 01.04.2025)',
    applicationStartDate: '2025-02-01T00:00:00Z',
    applicationEndDate: '2025-03-10T23:59:00Z',
    examinationDate: 'Prelims March 2025, Mains April 2025',
    officialNotificationUrl: 'https://sbi.co.in/documents/crpd-po-2024-25.pdf',
    officialApplicationUrl: 'https://sbi.co.in/careers',
    status: 'closing-soon',
    verifiedAt: '2025-02-21T11:45:00Z',
    advtNumber: 'CRPD/PO/2024-25/18',
    cadreGroup: 'JMGS-I Officer Scale',
    gazetteRef: 'SBI Board Gazette Resolution #2025/18',
    selectionProcess: 'Phase-I Preliminary Exam (Online) + Phase-II Main Exam (Objective + Descriptive) + Phase-III Psychometric & Interview',
    description: 'Premier banking recruitment for Probationary Officers (Scale-I) leading to leadership and managerial tracks across State Bank of India pan-India branch operations.',
    applicationFee: {
      generalOBC: '₹750',
      scStPwbdWomen: 'Nil',
    },
    categoryBreakdown: [
      { category: 'General', count: 810 },
      { category: 'EWS', count: 200 },
      { category: 'OBC', count: 540 },
      { category: 'SC', count: 300 },
      { category: 'ST', count: 150 },
    ],
    importantDates: [
      { label: 'Registration Window', date: '01 Feb - 10 Mar 2025' },
      { label: 'Preliminary Exam', date: '28 - 30 Mar 2025' },
      { label: 'Main Examination', date: 'April / May 2025' },
    ],
    syllabusTopics: [
      'English Language, Quantitative Aptitude, Reasoning Ability',
      'Data Analysis & Interpretation, General/Economy/Banking Awareness',
    ],
  },
  {
    id: 'isro-scientist-sc-2025',
    title: "Scientist / Engineer 'SC' (Civil, Electrical, Mechanical & Electronics)",
    department: 'Department of Space',
    organization: 'Indian Space Research Organisation (ISRO)',
    category: 'Research organizations',
    location: 'All India (ISRO Centres)',
    qualification: 'B.E. / B.Tech or equivalent in first class with minimum aggregate 65%',
    vacancies: 315,
    salary: 'Level 10 (7th CPC) - ₹56,100 basic pay',
    ageLimit: '18 - 28 Years (Relaxable for SC/ST/OBC/PwBD)',
    applicationStartDate: '2025-01-28T10:00:00Z',
    applicationEndDate: '2025-02-28T17:00:00Z',
    examinationDate: 'Written Test 04 May 2025',
    officialNotificationUrl: 'https://www.isro.gov.in/icrb_recruitment_sc_2025.pdf',
    officialApplicationUrl: 'https://www.isro.gov.in/careers',
    status: 'expired',
    verifiedAt: '2025-02-15T09:00:00Z',
    advtNumber: 'ISRO:ICRB:02(EM):2025',
    cadreGroup: "Group 'A' Gazetted Scientific",
    gazetteRef: 'ISRO ICRB Circular 2025/02',
    selectionProcess: 'Screening Written Test (80 marks Core Engineering + 20 marks Aptitude) + Comprehensive Technical Interview',
    description: 'Research and development engineering recruitment across VSSC Thiruvananthapuram, URSC Bengaluru, LPSC Valiamala, and SAC Ahmedabad.',
    applicationFee: {
      generalOBC: '₹250',
      scStPwbdWomen: 'Exempted',
    },
    importantDates: [
      { label: 'Advt Published', date: '28 Jan 2025' },
      { label: 'Application Closed', date: '28 Feb 2025' },
      { label: 'Written Examination', date: '04 May 2025' },
    ],
  },
  {
    id: 'upsc-nda-1-2025',
    title: 'National Defence Academy & Naval Academy Examination (I) 2025',
    department: 'Ministry of Defence',
    organization: 'Union Public Service Commission (UPSC)',
    category: 'Army',
    location: 'Pune (NDA Khadakwasla) & Ezhimala (INAC)',
    qualification: '12th Pass (Physics, Chemistry & Mathematics for Air Force / Navy; Any Stream for Army)',
    vacancies: 400,
    salary: 'Lieutenant (Level 10) post-commissioning stipend ₹56,100/mo',
    ageLimit: '16.5 - 19.5 Years (Unmarried Male & Female)',
    applicationStartDate: '2025-01-10T10:00:00Z',
    applicationEndDate: '2025-03-02T18:00:00Z',
    examinationDate: '13 April 2025',
    officialNotificationUrl: 'https://upsc.gov.in/sites/default/files/Notice-NDA-I-2025.pdf',
    officialApplicationUrl: 'https://upsconline.nic.in',
    status: 'closing-soon',
    verifiedAt: '2025-02-17T12:00:00Z',
    advtNumber: 'Notice No. 03/2025-NDA-I',
    cadreGroup: 'Commissioned Officer',
    gazetteRef: 'Gazette of India Defence Notification 2025',
    selectionProcess: 'Written Examination (Maths 300 marks + General Ability Test 600 marks) + 5-day SSB Interview & Medical Fitness',
    description: 'Direct entry for admission to Army, Navy, and Air Force wings of the National Defence Academy for the 155th Course and 117th Indian Naval Academy Course (INAC).',
    applicationFee: {
      generalOBC: '₹100',
      scStPwbdWomen: 'Nil',
    },
  },
  {
    id: 'uppsc-pcs-2025',
    title: 'Combined State / Upper Subordinate Services (PCS) Examination 2025',
    department: 'Department of Appointment & Personnel, UP',
    organization: 'Uttar Pradesh Public Service Commission (UPPSC)',
    category: 'State Public Service Commissions',
    location: 'Uttar Pradesh',
    qualification: "Bachelor's Degree in any discipline with OTR Registration",
    vacancies: 420,
    salary: 'Grade Pay ₹4,600 - ₹5,400 (Level 8 to 10 equivalent)',
    ageLimit: '21 - 40 Years (UP Domicile relaxations up to 5 yrs)',
    applicationStartDate: '2025-01-01T10:00:00Z',
    applicationEndDate: '2025-04-14T23:59:00Z',
    examinationDate: 'Prelims 18 June 2025',
    officialNotificationUrl: 'https://uppsc.up.nic.in/StaticPages/Advt_PCS_2025.pdf',
    officialApplicationUrl: 'https://uppsc.up.nic.in',
    status: 'active',
    verifiedAt: '2025-02-14T15:30:00Z',
    advtNumber: 'Advt A-1/E-1/2025',
    cadreGroup: "Group 'A' & 'B' Executive",
    gazetteRef: 'Uttar Pradesh Gazette Extraordinary #12/2025',
    selectionProcess: 'Preliminary Exam (GS-I & CSAT) + Mains Written (8 Papers including UP Special Papers) + Personality Test',
    description: 'Premier state civil service recruitment for Sub-Divisional Magistrate (SDM), Deputy Superintendent of Police (DSP), Block Development Officer (BDO), and Accounts Officer.',
  },
  {
    id: 'aiims-norcet-07-2025',
    title: 'Nursing Officer Recruitment Common Eligibility Test (NORCET-07)',
    department: 'Ministry of Health & Family Welfare',
    organization: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
    category: 'Healthcare',
    location: 'All India (Pan-AIIMS Hospitals)',
    qualification: 'B.Sc Nursing / Post Basic B.Sc Nursing or GNM with 2 yrs experience',
    vacancies: 3450,
    salary: 'Level 7 (7th CPC) - ₹44,900 to ₹1,42,400',
    ageLimit: '18 - 30 Years (Category relaxation applicable)',
    applicationStartDate: '2025-02-15T00:00:00Z',
    applicationEndDate: '2025-04-08T17:00:00Z',
    examinationDate: 'Stage I Preliminary: 15 May 2025',
    officialNotificationUrl: 'https://aiimsexams.ac.in/norcet-07-notice.pdf',
    officialApplicationUrl: 'https://aiimsexams.ac.in',
    status: 'active',
    verifiedAt: '2025-02-22T08:15:00Z',
    advtNumber: 'Notice 28/2025',
    cadreGroup: "Group 'B' Non-Gazetted",
    gazetteRef: 'AIIMS Academic & Recruitment Circular 28/2025',
    selectionProcess: 'NORCET Stage-I (Preliminary Screening) + Stage-II (Mains Clinical Scenario Test) + Hospital Allocation',
    description: 'Centralized nursing officer recruitment for AIIMS New Delhi and 18 newly established AIIMS hospitals across India.',
  },
  {
    id: 'drdo-ceptam-11-2025',
    title: 'DRDO CEPTAM-11 Senior Technical Assistant (STA-B) & Technician-A',
    department: 'Department of Defence R&D',
    organization: 'Defence Research and Development Organisation (DRDO)',
    category: 'Defence organizations',
    location: 'All India (DRDO Laboratories)',
    qualification: 'B.Sc in Science / 3-Year Diploma in Engineering or 10th + ITI',
    vacancies: 1920,
    salary: 'Level 6 (₹35,400 - ₹1,12,400) & Level 2',
    ageLimit: '18 - 28 Years',
    applicationStartDate: '2025-02-10T10:00:00Z',
    applicationEndDate: '2025-03-25T17:00:00Z',
    examinationDate: 'Tier-I CBT July 2025',
    officialNotificationUrl: 'https://www.drdo.gov.in/ceptam-11-advt.pdf',
    officialApplicationUrl: 'https://drdo.gov.in/careers',
    status: 'active',
    verifiedAt: '2025-02-12T16:00:00Z',
    advtNumber: 'CEPTAM-11/DRTC/2025',
    cadreGroup: 'Technical Cadre Group B & C',
    gazetteRef: 'DRDO Defence Gazette Advt 11/2025',
    selectionProcess: 'Tier-I Screening CBT + Tier-II Discipline Specific CBT + Trade / Skill Test',
    description: 'Recruitment of Senior Technical Assistants and Technicians across DRDO laboratories in avionics, naval systems, armaments, and cyber systems.',
  },
  {
    id: 'indian-navy-ssc-officer-2025',
    title: 'Short Service Commission (SSC) Officers for Executive, Tech & Education',
    department: 'Ministry of Defence',
    organization: 'Indian Navy',
    category: 'Navy',
    location: 'All India & Naval Stations',
    qualification: 'B.E. / B.Tech in any stream with minimum 60% marks',
    vacancies: 275,
    salary: 'Sub Lieutenant (Level 10) - ₹56,100 + MSP ₹15,500/mo',
    ageLimit: 'Born between 02 Jan 2000 and 01 Jul 2005 (19.5 - 25 Yrs)',
    applicationStartDate: '2025-02-05T00:00:00Z',
    applicationEndDate: '2025-03-12T23:59:00Z',
    examinationDate: 'SSB Interviews starting May 2025',
    officialNotificationUrl: 'https://www.joinindiannavy.gov.in/files/ssc_officer_entry_2025.pdf',
    officialApplicationUrl: 'https://www.joinindiannavy.gov.in',
    status: 'closing-soon',
    verifiedAt: '2025-02-11T13:40:00Z',
    advtNumber: 'DAVP 10701/11/0034/2425',
    cadreGroup: 'Commissioned Naval Officer',
    gazetteRef: 'Gazette of India Defence Notification Navy/2025',
    selectionProcess: 'Shortlisting based on Normalized B.Tech marks + 5-day SSB Interview at Bhopal/Bangalore/Visakhapatnam/Kolkata + Medical Fitness',
    description: 'Join the Indian Navy as a Short Service Commissioned Officer in General Service, Naval Air Operations, Pilot, Logistics, and Naval Architecture cadres.',
  },
  {
    id: 'ongc-graduate-trainee-2025',
    title: 'Recruitment of Graduate Trainees (Engineering & Geo-Sciences) via GATE 2025',
    department: 'Ministry of Petroleum & Natural Gas',
    organization: 'Oil and Natural Gas Corporation (ONGC)',
    category: 'PSUs',
    location: 'Pan-India (Offshore & Onshore Assets)',
    qualification: 'Graduate Degree in Engineering / Post Graduate in Geo-Sciences with GATE score',
    vacancies: 840,
    salary: 'E-1 Grade (₹60,000 - ₹1,80,000) CTC ~₹24 Lakhs p.a.',
    ageLimit: '30 Years for Gen/EWS (33 for OBC, 35 for SC/ST)',
    applicationStartDate: '2025-02-18T10:00:00Z',
    applicationEndDate: '2025-04-05T18:00:00Z',
    examinationDate: 'Based on GATE 2025 + Personal Interview',
    officialNotificationUrl: 'https://ongcindia.com/recruitment/gate-2025-advt.pdf',
    officialApplicationUrl: 'https://ongcindia.com',
    status: 'active',
    verifiedAt: '2025-02-23T09:15:00Z',
    advtNumber: 'Advt No. 2/2025 (R&P)',
    cadreGroup: 'Maharatna PSU Executive',
    gazetteRef: 'ONGC Corporate Employment Notice 2025/02',
    selectionProcess: 'GATE 2025 Score (60% weightage) + Qualification (25% weightage) + Interview (15% weightage)',
    description: 'Maharatna PSU recruitment of executive engineers in Drilling, Production, Mechanical, Electrical, Instrumentation, Geophysics, and Reservoir cadres.',
  },
  {
    id: 'kvs-pgt-tgt-prt-2025',
    title: 'Direct Recruitment of Post Graduate Teachers (PGT), TGT & Primary Teachers',
    department: 'Department of School Education & Literacy, MoE',
    organization: 'Kendriya Vidyalaya Sangathan (KVS)',
    category: 'Teaching',
    location: 'All India (KVS Schools)',
    qualification: 'Post Graduate / Graduate with B.Ed + CTET Paper II / Paper I Qualified',
    vacancies: 7850,
    salary: 'Level 8 (PGT) / Level 7 (TGT) / Level 6 (PRT)',
    ageLimit: '40 Yrs (PGT), 35 Yrs (TGT), 30 Yrs (PRT) - Women relaxation 10 yrs',
    applicationStartDate: '2025-01-25T00:00:00Z',
    applicationEndDate: '2025-03-20T23:59:00Z',
    examinationDate: 'Computer Based Test June 2025',
    officialNotificationUrl: 'https://kvsangathan.nic.in/announcements/direct-recruitment-2025.pdf',
    officialApplicationUrl: 'https://kvsangathan.nic.in',
    status: 'active',
    verifiedAt: '2025-02-16T11:20:00Z',
    advtNumber: 'Advt No. 17/2025',
    cadreGroup: 'Autonomous Teaching Cadre',
    gazetteRef: 'KVS Board Circular No. 17/2025',
    selectionProcess: 'Computer Based Test (180 Marks) + Professional Competency Test (Class Demo & Interview)',
    description: 'National recruitment of school educators across Kendriya Vidyalayas in subjects including Mathematics, Physics, Chemistry, English, Hindi, and Computer Science.',
  },
  {
    id: 'delhi-police-si-2025',
    title: 'Sub-Inspector in Delhi Police and Central Armed Police Forces (CAPFs) 2025',
    department: 'Ministry of Home Affairs',
    organization: 'Staff Selection Commission (SSC)',
    category: 'Police and Paramilitary',
    location: 'Delhi & Pan-India (BSF, CISF, CRPF, ITBP, SSB)',
    qualification: "Bachelor's Degree from a recognised university + Valid Driving License for LMV (Delhi Police)",
    vacancies: 4187,
    salary: 'Level 6 (7th CPC) - ₹35,400 to ₹1,12,400',
    ageLimit: '20 - 25 Years (As on 01.08.2025)',
    applicationStartDate: '2025-02-04T10:00:00Z',
    applicationEndDate: '2025-03-28T23:00:00Z',
    examinationDate: 'Paper-I CBT: 09 - 13 May 2025',
    officialNotificationUrl: 'https://ssc.gov.in/api/assets/uploads/notice_si_capf_2025.pdf',
    officialApplicationUrl: 'https://ssc.gov.in',
    status: 'active',
    verifiedAt: '2025-02-18T16:45:00Z',
    advtNumber: 'F.No. 3/2/2025-P&P-II',
    cadreGroup: 'Group B (Non-Gazetted) Police Cadre',
    gazetteRef: 'MHA Gazette Notification CAPFs/2025',
    selectionProcess: 'Paper-I CBT + Physical Standard Test (PST) & Physical Endurance Test (PET) + Paper-II CBT (English) + Detailed Medical Examination (DME)',
    description: 'Unified recruitment of Executive Sub-Inspectors for Delhi Police and Central Armed Police Forces (BSF, CISF, CRPF, ITBP, and SSB).',
  },
  {
    id: 'delhi-judicial-service-2025',
    title: 'Delhi Judicial Service Examination (DJSE) 2025',
    department: 'High Court of Delhi',
    organization: 'High Court of Delhi Judicial Administration',
    category: 'Judiciary',
    location: 'New Delhi',
    qualification: 'Law Graduate (LL.B.) and an Advocate practicing in India under Advocates Act, 1961',
    vacancies: 53,
    salary: 'Junior Division Civil Judge - ₹77,840 to ₹1,36,520 (Revised Judicial Pay)',
    ageLimit: 'Not more than 32 Years as on 01.01.2025',
    applicationStartDate: '2025-01-20T10:00:00Z',
    applicationEndDate: '2025-03-15T17:30:00Z',
    examinationDate: 'Preliminary Examination 18 May 2025',
    officialNotificationUrl: 'https://delhihighcourt.nic.in/djs_exam_2025.pdf',
    officialApplicationUrl: 'https://delhihighcourt.nic.in',
    status: 'active',
    verifiedAt: '2025-02-14T09:30:00Z',
    advtNumber: 'DHC/GAZ/DJSE/2025/01',
    cadreGroup: 'Judicial Service Officer',
    gazetteRef: 'Delhi Gazette Extraordinary Pt IV Notification 2025',
    selectionProcess: 'Preliminary Examination (Objective) + Mains Examination (Written Law Papers I-IV) + Viva-Voce',
    description: 'Prestige judicial recruitment for Junior Civil Judges and Metropolitan Magistrates in Delhi Judicial Services presiding over district courtrooms.',
  },
  {
    id: 'bpsc-70th-cce-2025',
    title: '70th Combined (Preliminary) Competitive Examination (CCE) 2025',
    department: 'General Administration Department, Bihar',
    organization: 'Bihar Public Service Commission (BPSC)',
    category: 'State Public Service Commissions',
    location: 'Bihar',
    qualification: "Bachelor's Degree or equivalent qualification from a recognized university",
    vacancies: 1957,
    salary: 'Levels 7 & 9 (Grade Pay ₹4,600 to ₹5,400)',
    ageLimit: '20, 21 or 22 to 37 Years (Male) / 40 Years (Female)',
    applicationStartDate: '2025-01-05T00:00:00Z',
    applicationEndDate: '2025-04-20T23:59:00Z',
    examinationDate: 'Integrated Prelims 13 July 2025',
    officialNotificationUrl: 'https://www.bpsc.bih.nic.in/Advt/NB-2025-01-70th-CCE.pdf',
    officialApplicationUrl: 'https://onlinebpsc.bihar.gov.in',
    status: 'active',
    verifiedAt: '2025-02-19T10:00:00Z',
    advtNumber: 'Advt No. 70/2025',
    cadreGroup: 'State Administrative & Police Service',
    gazetteRef: 'Bihar Gazette Notification 70/CCE/2025',
    selectionProcess: 'Integrated Preliminary Exam (150 Marks Negative 1/3rd) + Main Written Exam + Personality Interview (120 Marks)',
    description: 'State civil services recruitment for Bihar Administrative Service (Sub-Divisional Officer), Bihar Police Service (DSP), State Tax Assistant Commissioner, and Revenue Officers.',
  },
  {
    id: 'mha-ib-acio-2025',
    title: 'Assistant Central Intelligence Officer (ACIO Grade-II / Executive)',
    department: 'Intelligence Bureau',
    organization: 'Ministry of Home Affairs (MHA)',
    category: 'Other',
    location: 'All India',
    qualification: 'Graduation or equivalent from a recognized university + Computer knowledge',
    vacancies: 995,
    salary: 'Level 7 (₹44,900 - ₹1,42,400) + 20% Special Security Allowance',
    ageLimit: '18 - 27 Years',
    applicationStartDate: '2025-01-18T00:00:00Z',
    applicationEndDate: '2025-03-08T23:59:00Z',
    examinationDate: 'Tier-I CBT April 2025',
    officialNotificationUrl: 'https://www.mha.gov.in/sites/default/files/IB_ACIO_2025.pdf',
    officialApplicationUrl: 'https://www.mha.gov.in',
    status: 'closing-soon',
    verifiedAt: '2025-02-15T12:00:00Z',
    advtNumber: 'IB/ACIO-II/EXE/2025',
    cadreGroup: 'General Central Service, Group C Non-Gazetted',
    gazetteRef: 'Employment News Gazette IB/2025',
    selectionProcess: 'Tier-I CBT (100 Qs) + Tier-II Descriptive (50 Marks Essay/Précis) + Tier-III Interview & Psychometric Evaluation',
    description: 'Intelligence Bureau executive career for counter-intelligence, national security operations, tactical analysis, and field gathering pan-India.',
  },
];

export const EXAM_CALENDAR_SEED: ExamEvent[] = [
  {
    id: 'ev-1',
    jobId: 'upsc-cse-2025',
    examTitle: 'Civil Services (Preliminary) Examination 2025',
    organization: 'UPSC',
    category: 'UPSC',
    examDate: '2025-05-25',
    stage: 'Prelims',
    admitCardDate: '2025-05-10',
    status: 'Upcoming',
    portalUrl: 'https://upsconline.nic.in',
  },
  {
    id: 'ev-2',
    jobId: 'upsc-nda-1-2025',
    examTitle: 'National Defence Academy (I) Exam 2025',
    organization: 'UPSC',
    category: 'Army',
    examDate: '2025-04-13',
    stage: 'Prelims',
    admitCardDate: '2025-03-28',
    status: 'Upcoming',
    portalUrl: 'https://upsconline.nic.in',
  },
  {
    id: 'ev-3',
    jobId: 'ssc-cgl-2025',
    examTitle: 'SSC CGL Tier-I Computer Based Test',
    organization: 'SSC',
    category: 'SSC',
    examDate: '2025-06-24',
    stage: 'CBT-1',
    admitCardDate: '2025-06-15',
    status: 'Upcoming',
    portalUrl: 'https://ssc.gov.in',
  },
  {
    id: 'ev-4',
    jobId: 'sbi-po-2025',
    examTitle: 'SBI PO Preliminary Examination',
    organization: 'State Bank of India',
    category: 'Banking and Financial Institutions',
    examDate: '2025-03-28',
    stage: 'Prelims',
    admitCardDate: '2025-03-18',
    status: 'Admit Card Live',
    portalUrl: 'https://sbi.co.in/careers',
  },
  {
    id: 'ev-5',
    jobId: 'delhi-police-si-2025',
    examTitle: 'SSC Sub-Inspector in Delhi Police & CAPFs Paper-I',
    organization: 'SSC',
    category: 'Police and Paramilitary',
    examDate: '2025-05-09',
    stage: 'CBT-1',
    admitCardDate: '2025-04-30',
    status: 'Upcoming',
    portalUrl: 'https://ssc.gov.in',
  },
  {
    id: 'ev-6',
    jobId: 'aiims-norcet-07-2025',
    examTitle: 'AIIMS NORCET-07 Stage I Preliminary CBT',
    organization: 'AIIMS New Delhi',
    category: 'Healthcare',
    examDate: '2025-05-15',
    stage: 'Prelims',
    admitCardDate: '2025-05-05',
    status: 'Upcoming',
    portalUrl: 'https://aiimsexams.ac.in',
  },
  {
    id: 'ev-7',
    jobId: 'uppsc-pcs-2025',
    examTitle: 'UPPSC Combined State / Upper Subordinate Prelims',
    organization: 'UPPSC',
    category: 'State Public Service Commissions',
    examDate: '2025-06-18',
    stage: 'Prelims',
    admitCardDate: '2025-06-05',
    status: 'Upcoming',
    portalUrl: 'https://uppsc.up.nic.in',
  },
  {
    id: 'ev-8',
    jobId: 'rrb-alp-2025',
    examTitle: 'RRB Assistant Loco Pilot CBT-1 Examination',
    organization: 'RRB',
    category: 'Railways',
    examDate: '2025-07-20',
    stage: 'CBT-1',
    admitCardDate: '2025-07-10',
    status: 'Upcoming',
    portalUrl: 'https://www.rrbapply.gov.in',
  },
];

// Change listeners for real-time reactivity
type JobChangeListener = (jobs: Job[]) => void;
const jobChangeListeners: Set<JobChangeListener> = new Set();

export const JobService = {
  subscribe(listener: JobChangeListener) {
    jobChangeListeners.add(listener);
    return () => {
      jobChangeListeners.delete(listener);
    };
  },

  notifyListeners(jobs: Job[]) {
    jobChangeListeners.forEach((listener) => {
      try {
        listener(jobs);
      } catch (e) {
        console.error('Job listener error', e);
      }
    });
  },

  // Asynchronous background sync with Supabase
  async syncFromSupabase(): Promise<Job[] | null> {
    if (!isSupabaseConfigured || !supabase) {
      return null;
    }
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch notice:', error.message);
        return null;
      }

      if (data && data.length > 0) {
        const liveJobs = data.map(mapSupabaseRowToJob);
        this.saveJobsToStorage(liveJobs);
        this.notifyListeners(liveJobs);
        return liveJobs;
      }
    } catch (e) {
      console.error('Failed syncing from Supabase:', e);
    }
    return null;
  },

  // Read all jobs from LocalStorage or Seed
  getJobs(): Job[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_JOBS);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed reading jobs from localStorage', e);
    }
    // Initialize seed
    this.saveJobsToStorage(INITIAL_JOBS_SEED);
    return INITIAL_JOBS_SEED;
  },

  saveJobsToStorage(jobs: Job[]) {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
      this.notifyListeners(jobs);
    } catch (e) {
      console.error('Failed writing jobs to localStorage', e);
    }
  },

  getJobById(id: string): Job | undefined {
    const jobs = this.getJobs();
    return jobs.find((j) => j.id === id);
  },

  createJob(jobData: Omit<Job, 'id' | 'verifiedAt'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `custom-job-${Date.now()}`,
      verifiedAt: new Date().toISOString(),
    };
    const updated = [newJob, ...jobs];
    this.saveJobsToStorage(updated);

    // If Supabase is connected, persist asynchronously
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('jobs')
        .insert([{
          title: newJob.title,
          department: newJob.department,
          organization: newJob.organization,
          category: newJob.category,
          location: newJob.location,
          qualification: newJob.qualification,
          vacancies: newJob.vacancies,
          salary: newJob.salary,
          age_limit: newJob.ageLimit,
          application_start_date: newJob.applicationStartDate,
          application_end_date: newJob.applicationEndDate,
          examination_date: newJob.examinationDate || null,
          official_notification_url: newJob.officialNotificationUrl,
          official_application_url: newJob.officialApplicationUrl,
          status: newJob.status,
          verified_at: newJob.verifiedAt,
          advt_number: newJob.advtNumber || null,
          cadre_group: newJob.cadreGroup || 'Group A & B',
          gazette_ref: newJob.gazetteRef || null,
          selection_process: newJob.selectionProcess || null,
          description: newJob.description || null,
        }])
        .then(({ error }) => {
          if (error) console.error('Supabase job insert error:', error);
        });
    }

    return newJob;
  },

  updateJob(id: string, updates: Partial<Job>): Job | null {
    const jobs = this.getJobs();
    const index = jobs.findIndex((j) => j.id === id);
    if (index === -1) return null;
    const updatedJob = { ...jobs[index], ...updates };
    jobs[index] = updatedJob;
    this.saveJobsToStorage(jobs);

    // If Supabase is connected, update database
    if (isSupabaseConfigured && supabase) {
      const dbUpdates: any = {};
      if (updates.title !== undefined) dbUpdates.title = updates.title;
      if (updates.status !== undefined) dbUpdates.status = updates.status;
      if (updates.verifiedAt !== undefined) dbUpdates.verified_at = updates.verifiedAt;
      if (updates.vacancies !== undefined) dbUpdates.vacancies = updates.vacancies;
      if (updates.salary !== undefined) dbUpdates.salary = updates.salary;

      if (Object.keys(dbUpdates).length > 0) {
        supabase
          .from('jobs')
          .update(dbUpdates)
          .eq('title', updatedJob.title)
          .then(({ error }) => {
            if (error) console.error('Supabase job update error:', error);
          });
      }
    }

    return updatedJob;
  },

  deleteJob(id: string): boolean {
    const jobs = this.getJobs();
    const toDelete = jobs.find((j) => j.id === id);
    const filtered = jobs.filter((j) => j.id !== id);
    if (filtered.length === jobs.length) return false;
    this.saveJobsToStorage(filtered);

    // If Supabase is connected, delete from database
    if (isSupabaseConfigured && supabase && toDelete) {
      supabase
        .from('jobs')
        .delete()
        .eq('title', toDelete.title)
        .then(({ error }) => {
          if (error) console.error('Supabase job delete error:', error);
        });
    }

    return true;
  },

  markAsExpired(id: string): Job | null {
    return this.updateJob(id, { status: 'expired' });
  },

  toggleVerification(id: string): Job | null {
    const job = this.getJobById(id);
    if (!job) return null;
    return this.updateJob(id, {
      verifiedAt: job.verifiedAt ? undefined : new Date().toISOString(),
    });
  },

  resetToDefaultData(): Job[] {
    this.saveJobsToStorage(INITIAL_JOBS_SEED);
    return INITIAL_JOBS_SEED;
  },

  // Saved Jobs Bookmarking
  getSavedJobIds(): string[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_SAVED);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('Failed getting saved jobs', e);
    }
    // Default initial bookmarked items matching screenshot (3 items)
    const defaults = ['upsc-cse-2025', 'ssc-cgl-2025', 'rrb-alp-2025'];
    localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(defaults));
    return defaults;
  },

  toggleSaveJob(jobId: string): string[] {
    const current = this.getSavedJobIds();
    let updated: string[];
    if (current.includes(jobId)) {
      updated = current.filter((id) => id !== jobId);
    } else {
      updated = [...current, jobId];
    }
    try {
      localStorage.setItem(STORAGE_KEY_SAVED, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed updating saved jobs', e);
    }
    return updated;
  },

  isJobSaved(jobId: string): boolean {
    return this.getSavedJobIds().includes(jobId);
  },

  // Exam Calendar
  getExamCalendar(): ExamEvent[] {
    return EXAM_CALENDAR_SEED;
  },

  // Alerts
  subscribeAlert(subscription: Omit<JobAlertSubscription, 'id' | 'createdAt'>): JobAlertSubscription {
    const alert: JobAlertSubscription = {
      ...subscription,
      id: `alert-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    try {
      const stored = localStorage.getItem(STORAGE_KEY_ALERTS);
      const alerts = stored ? JSON.parse(stored) : [];
      alerts.push(alert);
      localStorage.setItem(STORAGE_KEY_ALERTS, JSON.stringify(alerts));
    } catch (e) {
      console.error('Failed saving alert', e);
    }
    return alert;
  },

  // Aggregated Portal Statistics
  getStats() {
    const jobs = this.getJobs();
    const totalVacancies = jobs.reduce((sum, j) => sum + (j.vacancies || 0), 0);
    const activeJobs = jobs.filter((j) => j.status === 'active' || j.status === 'closing-soon');
    const closingSoonCount = jobs.filter((j) => j.status === 'closing-soon').length;
    const expiredCount = jobs.filter((j) => j.status === 'expired').length;

    return {
      totalJobs: jobs.length,
      activeJobsCount: activeJobs.length,
      totalVacancies,
      closingSoonCount,
      expiredCount,
      newThisWeekCount: 92,
    };
  },
};
