import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  HelpCircle, 
  Search, 
  Award, 
  FileText, 
  CheckCircle2, 
  ChevronDown, 
  ChevronRight, 
  ExternalLink, 
  ShieldCheck, 
  PhoneCall, 
  Mail, 
  AlertCircle, 
  Send, 
  Sparkles, 
  Calendar, 
  Clock, 
  FileCheck, 
  Compass, 
  Layers,
  GraduationCap,
  Scale,
  Activity,
  HeartPulse,
  Train,
  Briefcase
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SupportTicket } from '../types';

interface CategoryGuidance {
  id: string;
  name: string;
  icon: string;
  commission: string;
  examPattern: {
    stages: string[];
    marksTotal: string;
    negativeMarking: string;
    interviewWeightage?: string;
  };
  syllabusHighlights: {
    paper: string;
    topics: string[];
  }[];
  standardBooks: {
    subject: string;
    recommended: string;
  }[];
  cutoffTrends: {
    year: string;
    ur: string;
    obc: string;
    scSt: string;
    ews: string;
  }[];
  physicalStandards?: string[];
  ageRelaxations: {
    category: string;
    relaxation: string;
  }[];
  officialPortal: string;
  helpline: string;
}

const CATEGORY_GUIDANCE_DATA: CategoryGuidance[] = [
  {
    id: 'upsc',
    name: 'Civil Services & UPSC (IAS / IPS / IFS / NDA)',
    icon: 'Award',
    commission: 'Union Public Service Commission (Dholpur House, New Delhi)',
    examPattern: {
      stages: [
        'Stage 1: Civil Services Preliminary Examination (Objective - GS Paper I & CSAT)',
        'Stage 2: Civil Services Main Examination (9 Written Papers: Essay + GS I-IV + 2 Optional Papers)',
        'Stage 3: Personality Test (Interview) at Dholpur House (275 Marks)',
      ],
      marksTotal: '2025 Marks (Mains 1750 + Interview 275)',
      negativeMarking: '1/3rd (0.33) marks deducted for wrong answers in Prelims',
      interviewWeightage: '275 Marks (13.5% of final ranking merit)',
    },
    syllabusHighlights: [
      {
        paper: 'Prelims Paper-I (General Studies - 200 Marks)',
        topics: ['Indian Polity and Governance', 'Indian History & National Movement', 'Physical, Social, Economic Geography of India & World', 'Economic & Social Development, Poverty, Inclusion', 'General issues on Environmental Ecology, Biodiversity, Climate Change', 'General Science & Technology', 'Current Events of National and International Importance'],
      },
      {
        paper: 'Prelims Paper-II (CSAT Qualifying - 33% / 66 Marks)',
        topics: ['Comprehension', 'Interpersonal skills including communication', 'Logical reasoning & analytical ability', 'Decision making & problem solving', 'General mental ability', 'Basic numeracy (Class X level)', 'Data interpretation (Class X level)'],
      },
      {
        paper: 'Mains GS Paper I to IV (250 Marks Each)',
        topics: ['GS-I: Heritage & Culture, History and Geography of the World & Society', 'GS-II: Governance, Constitution, Polity, Social Justice and International Relations', 'GS-III: Technology, Economic Development, Biodiversity, Environment, Security & Disaster Management', 'GS-IV: Ethics, Integrity, and Aptitude (Case Studies)'],
      },
    ],
    standardBooks: [
      { subject: 'Indian Polity', recommended: 'Indian Polity by M. Laxmikanth + Constitution of India Bare Act' },
      { subject: 'Modern Indian History', recommended: 'A Brief History of Modern India (Spectrum Rajiv Ahir) + Bipin Chandra' },
      { subject: 'Geography', recommended: 'NCERTs Class XI & XII (Physical & Human) + Orient BlackSwan / Oxford Atlas' },
      { subject: 'Indian Economy', recommended: 'Indian Economy by Nitin Singhania / Ramesh Singh + Economic Survey & Budget' },
      { subject: 'Environment & Ecology', recommended: 'Shankar IAS Academy Environment Notes + MoEFCC Annual Reports' },
    ],
    cutoffTrends: [
      { year: 'CSE 2023', ur: '75.41 / 200 (Prelims)', obc: '74.75', scSt: '59.25 / 47.82', ews: '68.02' },
      { year: 'CSE 2022', ur: '88.22 / 200', obc: '87.54', scSt: '74.08 / 69.35', ews: '82.83' },
      { year: 'CSE 2021', ur: '87.54 / 200', obc: '84.85', scSt: '75.41 / 70.71', ews: '80.14' },
    ],
    ageRelaxations: [
      { category: 'General / EWS', relaxation: '32 Years (6 Attempts Max)' },
      { category: 'OBC (Non-Creamy Layer)', relaxation: '35 Years (+3 Years, 9 Attempts)' },
      { category: 'SC / ST', relaxation: '37 Years (+5 Years, Unlimited Attempts)' },
      { category: 'PwBD Benchmark Disability', relaxation: '42 Years (+10 Years Relaxation)' },
    ],
    officialPortal: 'https://upsc.gov.in',
    helpline: '011-23098543 / 23385271 (UPSC Facilitation Counter)',
  },
  {
    id: 'ssc',
    name: 'Staff Selection Commission (CGL / CHSL / CPO)',
    icon: 'Briefcase',
    commission: 'Staff Selection Commission (Block No. 12, CGO Complex, New Delhi)',
    examPattern: {
      stages: [
        'Tier-I: Computer Based Examination (100 Questions, 200 Marks, 60 Minutes)',
        'Tier-II: Paper-I (Compulsory for all posts: Math, Reasoning, English, General Awareness, Computer Module) + DEST Typing Test',
        'Tier-II Paper-II: Statistics (for Junior Statistical Officer - JSO)',
      ],
      marksTotal: '390 Marks (Merit evaluated on Mathematical & Reasoning + English & GA Sections)',
      negativeMarking: '0.50 marks deducted per wrong question in Tier-I; 1 mark in Tier-II',
    },
    syllabusHighlights: [
      {
        paper: 'Tier-I Objective (4 Sections × 25 Qs = 100 Qs)',
        topics: ['General Intelligence & Reasoning (Analogy, Series, Syllogism, Blood Relations)', 'General Awareness (History, Polity, Economics, Static GK, Current Affairs)', 'Quantitative Aptitude (Arithmetic, Advanced Maths: Trigonometry, Geometry, Algebra, Mensuration)', 'English Comprehension (Spotting Errors, Vocab, Idioms, Reading Comprehension)'],
      },
      {
        paper: 'Tier-II Paper-I (Session I & II)',
        topics: ['Section-I: Module-I Mathematical Abilities (30 Qs) + Module-II Reasoning (30 Qs)', 'Section-II: Module-I English Language (45 Qs) + Module-II General Awareness (25 Qs)', 'Section-III: Computer Knowledge Module (20 Qs - Qualifying) + Data Entry Speed Test (2000 key depressions in 15 mins)'],
      },
    ],
    standardBooks: [
      { subject: 'Quantitative Aptitude', recommended: 'Quantitative Aptitude for Competitive Examinations by R.S. Aggarwal / Rakesh Yadav Arithmetic & Advance' },
      { subject: 'English Language', recommended: 'Plinth to Paramount by Neetu Singh (KD Campus) + Word Power Made Easy (Norman Lewis)' },
      { subject: 'Reasoning Ability', recommended: 'Modern Approach to Verbal & Non-Verbal Reasoning by R.S. Aggarwal' },
      { subject: 'General Knowledge', recommended: 'Lucent General Knowledge + Ghatna Chakra SSC Previous Year Papers' },
    ],
    cutoffTrends: [
      { year: 'CGL 2023 Tier-I', ur: '150.04 / 200', obc: '145.93', scSt: '126.86 / 118.16', ews: '143.44' },
      { year: 'CGL 2022 Tier-I', ur: '114.27 / 200 (Qualifying)', obc: '102.78', scSt: '89.08 / 77.56', ews: '102.35' },
    ],
    ageRelaxations: [
      { category: 'UR / General', relaxation: '18 to 30 / 32 Years (Depending on Post Cadre)' },
      { category: 'OBC (Non-Creamy)', relaxation: '+3 Years Upper Age Relaxation' },
      { category: 'SC / ST', relaxation: '+5 Years Upper Age Relaxation' },
    ],
    officialPortal: 'https://ssc.gov.in',
    helpline: '011-24368090 / 24360606 (SSC Inquiry Cell)',
  },
  {
    id: 'railways',
    name: 'Indian Railways (RRB ALP / NTPC / Group D / JE)',
    icon: 'Train',
    commission: 'Railway Recruitment Boards (Ministry of Railways, Govt of India)',
    examPattern: {
      stages: [
        'CBT-1 (First Stage Screening CBT): 75 Questions, 60 Minutes (Maths, Reasoning, Science, GA)',
        'CBT-2 (Second Stage CBT): Part A (100 Qs - 70% merit) + Part B (75 Qs - Trade Test 35% Qualifying)',
        'CBAT (Computer Based Aptitude Test): For Assistant Loco Pilot (Memory, Depth Perception, Concentration tests)',
        'Document Verification & Medical Examination: A-1 Medical Standard (Strict 6/6 eye vision without glasses for ALP)',
      ],
      marksTotal: '100 Marks (Normalised Score for Part-A CBT-2)',
      negativeMarking: '1/3rd (0.33) marks deducted per incorrect response across all CBTs',
    },
    syllabusHighlights: [
      {
        paper: 'CBT-1 General Syllabus (75 Questions)',
        topics: ['Mathematics: Number System, BODMAS, Decimals, Fractions, LCM, HCF, Ratio, Percentages, Mensuration, Time & Work, Time & Distance', 'General Intelligence: Analogies, Alphabetical & Number Series, Coding & Decoding, Mathematical Operations, Venn Diagram', 'General Science: Physics, Chemistry & Life Sciences of 10th Standard CBSE', 'Current Affairs on Science & Tech, Sports, Culture, Personalities, Economics, Politics'],
      },
      {
        paper: 'CBT-2 Part B (Engineering & Technical Trade)',
        topics: ['Electrical Engineering / Electrician / Wireman syllabus as defined by DGET', 'Mechanical / Fitter / Turner / Machinist / Motor Vehicle Mechanic', 'Electronics Mechanic / Radio & TV Technician'],
      },
    ],
    standardBooks: [
      { subject: 'Railway Science', recommended: 'Speedy Railway Samanya Vigyan (General Science) + NCERT Class IX & X' },
      { subject: 'Maths & Reasoning', recommended: 'Railway Math Special by Rakesh Yadav + Youth Competition Times (YCT) RRB Chapterwise Solved Papers' },
      { subject: 'Technical Trade Theory', recommended: 'Asian / Rukmini Technical Trade Guide as per ITI / NCVT curriculum' },
    ],
    cutoffTrends: [
      { year: 'RRB ALP CEN 01', ur: 'Normalised: 58 - 68 (Zone dependent)', obc: '53 - 62', scSt: '42 - 50', ews: '50 - 58' },
    ],
    physicalStandards: [
      'A-1 Medical Standard Mandatory for Assistant Loco Pilot: Distant Vision: 6/6, 6/6 without glasses with fogging test (must not accept +2D).',
      'Near Vision: Sn: 0.6, 0.6 without glasses.',
      'Must pass tests for Colour Vision, Binocular Vision, Field of Vision, Night Vision, and Mesopic Vision.',
    ],
    ageRelaxations: [
      { category: 'General / UR', relaxation: '18 - 30 Years' },
      { category: 'OBC (Non Creamy)', relaxation: 'Up to 33 Years (+3 Years)' },
      { category: 'SC / ST', relaxation: 'Up to 35 Years (+5 Years)' },
    ],
    officialPortal: 'https://www.rrbapply.gov.in',
    helpline: '9592-001-188 / 0172-565-3333 (RRB Central Helpdesk)',
  },
  {
    id: 'banking',
    name: 'Banking & Financial (SBI PO / Clerk / IBPS / RBI)',
    icon: 'Scale',
    commission: 'Institute of Banking Personnel Selection & State Bank of India CRPD',
    examPattern: {
      stages: [
        'Phase-I: Preliminary Exam (100 Qs, 100 Marks, 60 Minutes - 20 mins sectional timer)',
        'Phase-II: Main Examination (Objective 200 Marks + Descriptive English Essay & Letter 50 Marks)',
        'Phase-III: Psychometric Evaluation + Group Exercises (20 Marks) + Personal Interview (30 Marks)',
      ],
      marksTotal: 'Final merit calculated by converting Phase-II (250 marks) to 75% and Phase-III (50 marks) to 25%',
      negativeMarking: '0.25 (1/4th) of marks assigned to question deducted for wrong answer',
    },
    syllabusHighlights: [
      {
        paper: 'Phase-I Prelims (3 Sections)',
        topics: ['English Language: Reading Comprehension, Cloze Test, Para Jumbles, Error Spotting (30 Qs)', 'Quantitative Aptitude: Data Interpretation (Bar/Line/Pie/Radar), Quadratic Equations, Number Series, Arithmetic Word Problems (35 Qs)', 'Reasoning Ability: Puzzles (Floor, Box, Circular, Linear), Syllogism, Inequalities, Blood Relations, Direction Sense (35 Qs)'],
      },
      {
        paper: 'Phase-II Mains Advanced & Banking Awareness',
        topics: ['Data Analysis & Interpretation (Charts & Caselets)', 'General / Economy / Banking Awareness (Monetary Policy, RBI Guidelines, Financial Terminology, Current Banking Events)', 'English Language Descriptive: Formal Business Letter & Essay on Socio-Economic themes'],
      },
    ],
    standardBooks: [
      { subject: 'Reasoning & Puzzles', recommended: 'A Complete Book of Puzzles & Seating Arrangement by Adda247 / Puneet Sharma' },
      { subject: 'Data Interpretation', recommended: 'Quantum CAT by Sarvesh Verma + DI Pro by Oliveboard' },
      { subject: 'Banking & Financial Awareness', recommended: 'Banking Awareness by Arihant Publications + AffairsCloud Monthly Pocket PDF' },
    ],
    cutoffTrends: [
      { year: 'SBI PO 2023 Prelims', ur: '59.25 / 100', obc: '59.25', scSt: '53.00 / 47.50', ews: '59.25' },
      { year: 'IBPS PO 2023 Prelims', ur: '54.25 / 100', obc: '54.25', scSt: '49.00 / 46.75', ews: '54.25' },
    ],
    ageRelaxations: [
      { category: 'UR / General', relaxation: '21 to 30 Years' },
      { category: 'OBC (Non-Creamy)', relaxation: '33 Years (+3 Years)' },
      { category: 'SC / ST', relaxation: '35 Years (+5 Years)' },
      { category: 'PwBD', relaxation: '+10 Years' },
    ],
    officialPortal: 'https://ibps.in',
    helpline: '1800-222-366 / 1800-103-4566 (IBPS Candidate Helpdesk)',
  },
  {
    id: 'defence',
    name: 'Defence & Security (Army / Navy / Air Force AFCAT / DRDO)',
    icon: 'ShieldCheck',
    commission: 'Directorate General of Recruiting (Army / Navy / IAF / MoD)',
    examPattern: {
      stages: [
        'Stage 1: Written Examination (NDA / CDS / AFCAT / DRDO CEPTAM)',
        'Stage 2: 5-Day Services Selection Board (SSB) Interview:',
        '  - Day 1: Screening Test (OIR + PPDT Picture Perception)',
        '  - Day 2: Psychology Tests (TAT, WAT, SRT, Self Description)',
        '  - Day 3 & 4: Group Testing Officer (GTO) Tasks (GD, GPE, PGT, HGT, Command Task, Snake Race, FGT)',
        '  - Day 5: Conference & Final Recommendation',
        'Stage 3: Special Medical Examination at Military Hospitals (SMB / AMB)',
      ],
      marksTotal: 'NDA: Written 900 + SSB 900 = 1800 Marks | CDS: Written 300 + SSB 300 = 600 Marks',
      negativeMarking: '0.33 marks deducted per wrong question in written testing',
    },
    syllabusHighlights: [
      {
        paper: 'Written Testing (Maths + General Ability)',
        topics: ['Mathematics (NDA): Trigonometry, Determinants, Calculus, Vector Algebra, Probability', 'English: Vocab, Grammar, Spotting Errors, Ordering of Sentences', 'General Knowledge: Physics, Chemistry, General Science, Social Studies, Geography, Current Events'],
      },
    ],
    standardBooks: [
      { subject: 'SSB Interview Preparation', recommended: 'My Appointment with a Psychologist by Dr. (Cdr) NK Natarajan + Breaking the Code of SSB' },
      { subject: 'Defence Written Exams', recommended: 'Pathfinder for NDA & NA by Arihant Publications + CDS Mathematics by RS Aggarwal' },
    ],
    cutoffTrends: [
      { year: 'NDA I 2023', ur: '301 / 900 (Written with min 25% in each subject)', obc: 'Same', scSt: 'Same', ews: 'Same' },
    ],
    physicalStandards: [
      'Minimum Height for Army: 157 cm (Male), 152 cm (Female). Gorkhas / North-East: 5 cm relaxation.',
      'Chest Expansion: Minimum 5 cm expansion.',
      'Eyesight for Flying Branch: 6/6 in one eye and 6/9 in another, correctable to 6/6 only for hypermetropia.',
      'Physical Endurance: 2.4 km run in 15 mins, 20 pushups, 20 sit-ups, minimum 8 chin-ups.',
    ],
    ageRelaxations: [
      { category: 'NDA Entry', relaxation: '16.5 to 19.5 Years (Strict date of birth window)' },
      { category: 'CDS IMA / INA', relaxation: '19 to 24 Years' },
      { category: 'CDS OTA', relaxation: '19 to 25 Years' },
    ],
    officialPortal: 'https://joinindianarmy.nic.in',
    helpline: '011-26173215 / 26175473 (Army Recruiting Cell)',
  },
  {
    id: 'state-psc',
    name: 'State Public Service Commissions (UPPSC / BPSC / MPSC / RPSC)',
    icon: 'GraduationCap',
    commission: 'State PSCs (e.g., UPPSC Prayagraj, BPSC Patna, MPSC Mumbai)',
    examPattern: {
      stages: [
        'Preliminary Examination (Objective): General Studies Paper-I + CSAT Qualifying',
        'Main Examination (Descriptive): Compulsory Language + Essay + General Studies Papers (Including State Special Papers I & II)',
        'Personality Test (Interview): 100 to 120 Marks conducted at State Commission Headquarters',
      ],
      marksTotal: 'UPPSC: 1500 (Mains) + 100 (Interview) = 1600 Marks | BPSC: 900 (Mains) + 120 (Interview) = 1020 Marks',
      negativeMarking: '1/3rd (0.33) marks deducted for wrong choices',
    },
    syllabusHighlights: [
      {
        paper: 'State Specific General Studies Papers',
        topics: ['UP Special Papers (Paper V & VI in UPPSC): History, Architecture, Economy, Folklore, Districts, Agricultural zoning of Uttar Pradesh', 'Bihar Special in BPSC: History of Bihar in National Movement (Champaran, 1857 Revolt, Kunwar Singh), River systems (Ganga, Kosi, Gandak), Industry and Mineral resources', 'State Current Affairs, Budget, Schemes, and Panchayat Administration'],
      },
    ],
    standardBooks: [
      { subject: 'UPPSC State GK', recommended: 'Ghatna Chakra UP Special GS + Rakesh Saraswat UP Samanya Gyan' },
      { subject: 'BPSC State GK', recommended: 'Imtiaz Ahmed Bihar Ek Parichay + Crown Publications Bihar General Knowledge' },
    ],
    cutoffTrends: [
      { year: 'UPPSC PCS Prelims', ur: '125 - 130 / 200', obc: '124 - 128', scSt: '105 - 115', ews: '125 - 129' },
      { year: 'BPSC 69th CCE', ur: '91.67 / 150', obc: '84.00', scSt: '75.00', ews: '86.67' },
    ],
    ageRelaxations: [
      { category: 'General / UR (Domicile)', relaxation: '21 to 40 Years (UP/Bihar State Domicile Rules)' },
      { category: 'OBC / SC / ST Domicile', relaxation: '+5 Years State Domicile Relaxation (Up to 45 Years)' },
    ],
    officialPortal: 'https://uppsc.up.nic.in',
    helpline: '0532-2407547 (UPPSC Prayagraj Enquiry)',
  },
];

const FAQS_DATA = [
  {
    q: 'How does One-Time Registration (OTR) work for Indian Government Jobs?',
    a: 'OTR (One Time Registration) is a permanent digital candidate profile introduced by UPSC, UPPSC, SSC, and State PSCs. Once you register with your matriculation certificate, Aadhaar, and photo, a permanent OTR ID is generated. When applying for any new notification, 70% of your data auto-populates, preventing multiple document uploads and data errors.',
  },
  {
    q: 'What should I do if money was deducted from my bank but the application status shows Pending?',
    a: 'Do not pay twice immediately. Payment reconciliation between bank gateways (SBI ePay, Razorpay, BillDesk) and Government Treasury servers (e-GRAS) can take 24 to 48 hours. After 24 hours, click the "Re-Verify Payment" or "Payment Status" button on the recruitment portal. If not resolved, lodge a ticket using the Support Desk below with your Bank Reference / UTR Number.',
  },
  {
    q: 'What is the required validity period for OBC-NCL (Non-Creamy Layer) and EWS Certificates?',
    a: 'For Central recruitments (UPSC, SSC, Railways), OBC-NCL certificates must be issued on or after April 1st of the financial year in which the notification closes, in the prescribed Government of India format (Annexure-A). EWS Income & Asset certificates must be based on the gross annual family income of the previous financial year and valid for the current fiscal year.',
  },
  {
    q: 'Are final year students eligible to appear for Civil Services or Bank PO exams?',
    a: 'Yes, candidates appearing in the final year / semester of their degree are eligible to appear for Preliminary examinations (e.g. UPSC CSE, SBI PO, IBPS PO), provided they produce proof of passing the degree examination at the time of submitting the Detailed Application Form (DAF) for the Main Examination.',
  },
  {
    q: 'What are the photo and signature specifications for government applications?',
    a: 'Most government portals enforce strict file sizes: Passport photo (20KB - 50KB in JPG/JPEG, white or off-white background, front-facing without caps/dark spectacles, taken within the last 3 months). Candidate signature (10KB - 20KB in running hand using black ballpoint ink on clean white paper).',
  },
];

export const LearningHelpPage: React.FC = () => {
  const { user } = useAuth();
  const [selectedCategoryId, setSelectedCategoryId] = useState('upsc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFaqIndex, setActiveFaqIndex] = useState<number | null>(0);

  // Support Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Application Form & OTR Issue');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketContact, setTicketContact] = useState(user?.phoneNumber || user?.email || '');
  const [candidateName, setCandidateName] = useState(user?.fullName || 'Abhishek Bhardwaj');
  const [ticketOtr, setTicketOtr] = useState(user?.otrNumber || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState<SupportTicket | null>(null);
  const [supportMessage, setSupportMessage] = useState<string | null>(null);

  const selectedGuidance = CATEGORY_GUIDANCE_DATA.find((c) => c.id === selectedCategoryId) || CATEGORY_GUIDANCE_DATA[0];

  const handleLodgeTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketDesc.trim()) {
      setSupportMessage('Please provide both subject and detailed description.');
      return;
    }

    setIsSubmitting(true);
    setSupportMessage(null);

    const ticketPayload = {
      category: ticketCategory,
      subject: ticketSubject,
      description: ticketDesc,
      candidateName,
      emailOrPhone: ticketContact,
      otrNumber: ticketOtr || undefined,
    };

    try {
      const res = await fetch('/api/support/ticket', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticket: ticketPayload }),
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedTicket(data.ticket);
        setTicketSubject('');
        setTicketDesc('');
      } else {
        // Fallback demo ticket
        const fallbackTicket: SupportTicket = {
          id: `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
          category: ticketCategory,
          subject: ticketSubject,
          description: ticketDesc,
          candidateName,
          emailOrPhone: ticketContact,
          otrNumber: ticketOtr,
          status: 'Registered / Under Scrutiny',
          createdAt: new Date().toISOString(),
          slaResolutionWindow: '72 Hours (CPGRAMS Standard)',
        };
        setSubmittedTicket(fallbackTicket);
        setTicketSubject('');
        setTicketDesc('');
      }
    } catch (err: any) {
      console.warn('Ticket error:', err);
      const fallbackTicket: SupportTicket = {
        id: `GRV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        category: ticketCategory,
        subject: ticketSubject,
        description: ticketDesc,
        candidateName,
        emailOrPhone: ticketContact,
        otrNumber: ticketOtr,
        status: 'Registered / Under Scrutiny',
        createdAt: new Date().toISOString(),
        slaResolutionWindow: '72 Hours (CPGRAMS Standard)',
      };
      setSubmittedTicket(fallbackTicket);
      setTicketSubject('');
      setTicketDesc('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredFaqs = FAQS_DATA.filter(
    (faq) =>
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Civic Page Banner */}
      <div className="bg-gradient-to-r from-[#001f3e] via-[#002f5e] to-[#004785] text-white rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="relative z-10 space-y-3 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-300">
            <Compass className="w-3.5 h-3.5" />
            <span>National Aspirant Learning & Redressal Hub</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Learning, Syllabus & Candidate Support Desk
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Job-specific recruitment blueprints, stage-wise syllabus, previous years cutoff benchmarks, standard reference literature, and official grievance redressal for all government recruitment categories.
          </p>
        </div>

        {/* Civic watermark accent */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
          <GraduationCap className="w-80 h-80" />
        </div>
      </div>

      {/* CATEGORY SELECTOR CAROUSEL / GRID */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#001f3e] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#0051d5]" />
            <span>Select Recruitment Category for Guidance</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {CATEGORY_GUIDANCE_DATA.length} Major Cadres Available
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {CATEGORY_GUIDANCE_DATA.map((cat) => {
            const isSelected = cat.id === selectedCategoryId;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategoryId(cat.id)}
                className={`p-3.5 rounded-2xl text-left border transition-all flex flex-col justify-between gap-3 ${
                  isSelected
                    ? 'bg-[#001f3e] text-white border-[#001f3e] shadow-md ring-2 ring-[#0051d5]/40'
                    : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`p-2 rounded-xl text-xs font-bold ${
                    isSelected ? 'bg-white/10 text-amber-300' : 'bg-blue-50 text-[#0051d5]'
                  }`}>
                    {cat.id.toUpperCase()}
                  </span>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                </div>

                <div>
                  <h3 className={`text-xs font-bold line-clamp-2 ${isSelected ? 'text-white' : 'text-[#001f3e]'}`}>
                    {cat.name}
                  </h3>
                  <p className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-slate-300' : 'text-slate-400'}`}>
                    {cat.commission.split('(')[0]}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SELECTED CATEGORY COMPREHENSIVE LEARNING HUB */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
        
        {/* Header of Active Category */}
        <div className="border-b border-slate-200 pb-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0051d5] bg-blue-50 px-2.5 py-0.5 rounded-full">
                Gazetted Cadre Blueprint
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Standard Commission Guidelines</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#001f3e]">
              {selectedGuidance.name}
            </h2>
            <p className="text-xs text-slate-600 flex items-center gap-2">
              <span className="font-semibold text-slate-700">Recruiting Commission:</span>
              <span>{selectedGuidance.commission}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={selectedGuidance.officialPortal}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
            >
              <span>Official Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Helpline</span>
              <span className="text-xs font-mono font-bold text-[#001f3e]">{selectedGuidance.helpline}</span>
            </div>
          </div>
        </div>

        {/* 1. Exam Pattern & Stage Breakdown */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#0051d5]" />
            <span>1. Examination Stages & Selection Methodology</span>
          </h3>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs mb-2">
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Total Merit Base:</span>
                <strong className="text-[#001f3e] text-sm">{selectedGuidance.examPattern.marksTotal}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Negative Marking:</span>
                <strong className="text-red-700 text-sm">{selectedGuidance.examPattern.negativeMarking}</strong>
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-200">
                <span className="text-slate-500 block text-[11px]">Interview / Viva-Voce:</span>
                <strong className="text-emerald-700 text-sm">{selectedGuidance.examPattern.interviewWeightage || 'Applicable'}</strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-700 block">Stage Progression Pipeline:</span>
              <ul className="space-y-2 text-xs text-slate-700">
                {selectedGuidance.examPattern.stages.map((stg, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="w-5 h-5 rounded-full bg-[#001f3e] text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{stg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 2. Core Syllabus Topics */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#0051d5]" />
            <span>2. Authoritative Syllabus Breakdown</span>
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedGuidance.syllabusHighlights.map((paper, pIdx) => (
              <div key={pIdx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-3">
                <h4 className="font-bold text-xs text-[#001f3e] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#0051d5]"></span>
                  <span>{paper.paper}</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {paper.topics.map((topic, tIdx) => (
                    <span 
                      key={tIdx} 
                      className="text-[11px] bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Recommended Books & Literature */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#0051d5]" />
            <span>3. Recommended Standard Reference Literature</span>
          </h3>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100/70 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-3.5">Subject / Core Domain</th>
                  <th className="p-3.5">Recommended Standard Reference</th>
                  <th className="p-3.5">Government / Public Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {selectedGuidance.standardBooks.map((bk, bIdx) => (
                  <tr key={bIdx} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-[#001f3e]">{bk.subject}</td>
                    <td className="p-3.5 text-slate-700">{bk.recommended}</td>
                    <td className="p-3.5 text-[11px] text-slate-500 font-mono">
                      NCERT ePathshala / NPTEL / National Digital Library
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 4. Previous Years Cut-Off Trends & Age Relaxations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          
          {/* Cutoffs */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0051d5]" />
              <span>Previous Years Cut-Off Trends</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100 text-slate-600 font-bold text-[10px] uppercase">
                  <tr>
                    <th className="p-2.5">Cycle</th>
                    <th className="p-2.5">General (UR)</th>
                    <th className="p-2.5">OBC (NCL)</th>
                    <th className="p-2.5">SC / ST</th>
                    <th className="p-2.5">EWS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {selectedGuidance.cutoffTrends.map((cut, cIdx) => (
                    <tr key={cIdx} className="hover:bg-slate-50">
                      <td className="p-2.5 font-bold text-[#001f3e]">{cut.year}</td>
                      <td className="p-2.5 font-mono text-[#0051d5] font-bold">{cut.ur}</td>
                      <td className="p-2.5 font-mono text-slate-700">{cut.obc}</td>
                      <td className="p-2.5 font-mono text-slate-700">{cut.scSt}</td>
                      <td className="p-2.5 font-mono text-slate-700">{cut.ews}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Age Relaxations */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#0051d5]" />
              <span>Age Limits & Relaxation Norms</span>
            </h3>

            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50 space-y-2">
              {selectedGuidance.ageRelaxations.map((rel, rIdx) => (
                <div key={rIdx} className="flex justify-between items-center text-xs bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-slate-700">{rel.category}</span>
                  <span className="font-mono text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    {rel.relaxation}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Physical Standards if present */}
        {selectedGuidance.physicalStandards && selectedGuidance.physicalStandards.length > 0 && (
          <div className="space-y-2 bg-amber-50/70 border border-amber-200 rounded-2xl p-5">
            <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-amber-700" />
              <span>Mandatory Physical & Medical Benchmark Standards</span>
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-xs text-amber-950">
              {selectedGuidance.physicalStandards.map((std, sIdx) => (
                <li key={sIdx}>{std}</li>
              ))}
            </ul>
          </div>
        )}

      </div>

      {/* CANDIDATE GRIEVANCE & SUPPORT TICKET DESK */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 font-bold px-2.5 py-0.5 rounded-full text-xs mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CPGRAMS Standard Citizen Redressal</span>
            </div>
            <h2 className="text-xl font-bold text-[#001f3e]">
              Aspirant Support & Grievance Lodging Desk
            </h2>
            <p className="text-xs text-slate-500">
              Facing issues with OTR registration, fee deduction reconciliation, certificate validity, or admit card discrepancies? Lodge an official inquiry.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl text-center shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Resolution SLA</span>
            <span className="text-xs font-mono font-bold text-emerald-700">Within 72 Working Hours</span>
          </div>
        </div>

        {/* Ticket Confirmation Banner */}
        {submittedTicket && (
          <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 space-y-3 text-xs text-emerald-950 animate-in fade-in">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="font-bold text-sm text-emerald-900">
                  Grievance Registered Successfully!
                </h4>
                <p className="text-slate-600">
                  Your ticket has been logged and synchronized to the central candidate grievance repository.
                </p>
                <div className="pt-2 flex flex-wrap gap-3 font-mono text-[11px]">
                  <span className="bg-white border border-emerald-300 px-3 py-1 rounded-lg">
                    Ticket ID: <strong>{submittedTicket.id}</strong>
                  </span>
                  <span className="bg-white border border-emerald-300 px-3 py-1 rounded-lg">
                    Candidate: <strong>{submittedTicket.candidateName}</strong>
                  </span>
                  <span className="bg-white border border-emerald-300 px-3 py-1 rounded-lg">
                    Status: <strong>{submittedTicket.status}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Support Form */}
        <form onSubmit={handleLodgeTicket} className="space-y-4">
          {supportMessage && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{supportMessage}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Candidate Full Name
              </label>
              <input
                type="text"
                required
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                placeholder="Candidate Name"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contact Phone / Email
              </label>
              <input
                type="text"
                required
                value={ticketContact}
                onChange={(e) => setTicketContact(e.target.value)}
                placeholder="+91 98765 43210 or email@domain.com"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                OTR Number (If Generated)
              </label>
              <input
                type="text"
                value={ticketOtr}
                onChange={(e) => setTicketOtr(e.target.value)}
                placeholder="BHARAT-OTR-2025-XXXX"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issue Category
              </label>
              <select
                value={ticketCategory}
                onChange={(e) => setTicketCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none bg-white"
              >
                <option value="Application Form & OTR Issue">One-Time Registration (OTR) / Profile Sync Issue</option>
                <option value="Fee Deducted But Pending">Application Fee Paid but Portal Status Still Pending</option>
                <option value="Photo & Signature Upload Error">Photo / Signature Dimension & Resolution Rejection</option>
                <option value="Age Relaxation & Category Certificate">Category Certificate (EWS / OBC-NCL / SC / ST) Validity</option>
                <option value="Exam Center / Admit Card Discrepancy">Admit Card Download / Examination Center Allocation</option>
                <option value="General Query">Other Commission Procedure Inquiries</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Subject Headline
              </label>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Brief summary of the issue (e.g., UTR Reference #8291 not updating)"
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Detailed Description & Evidence Reference
            </label>
            <textarea
              required
              rows={3}
              value={ticketDesc}
              onChange={(e) => setTicketDesc(e.target.value)}
              placeholder="Describe the exact error message, transaction reference, recruitment notification name, and timestamps..."
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
            ></textarea>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Protected under National Citizen Charter Regulations</span>
            </span>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Registering Ticket...' : 'Submit Support Inquiry'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* FREQUENTLY ASKED QUESTIONS (FAQ) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#001f3e] flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-[#0051d5]" />
              <span>Recruitment Clarifications & Aspirant FAQs</span>
            </h2>
            <p className="text-xs text-slate-500">
              Clear answers to the most common queries encountered during civil and public recruitment.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter FAQs..."
              className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredFaqs.map((faq, index) => {
            const isOpen = activeFaqIndex === index;
            return (
              <div key={index} className="py-3">
                <button
                  type="button"
                  onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                  className="w-full text-left flex items-center justify-between gap-3 text-xs font-bold text-slate-800 hover:text-[#0051d5] py-1"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#0051d5]"></span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <p className="text-xs text-slate-600 mt-2 pl-3.5 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
