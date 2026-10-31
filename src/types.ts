/**
 * Bharat Career Hub - Core TypeScript Interfaces
 */

export type JobCategory =
  | 'UPSC'
  | 'SSC'
  | 'Railways'
  | 'Banking and Financial Institutions'
  | 'Army'
  | 'Navy'
  | 'Air Force'
  | 'Defence organizations'
  | 'State Public Service Commissions'
  | 'State Government Departments'
  | 'PSUs'
  | 'Teaching'
  | 'Healthcare'
  | 'Police and Paramilitary'
  | 'Judiciary'
  | 'Engineering'
  | 'Research organizations'
  | 'Other';

export type JobStatus = 'active' | 'closing-soon' | 'expired' | 'draft';

export interface Job {
  id: string;
  title: string;
  department: string;
  organization: string;
  category: JobCategory;
  location: string;
  qualification: string;
  vacancies: number;
  salary: string;
  ageLimit: string;
  applicationStartDate: string;
  applicationEndDate: string;
  examinationDate?: string;
  officialNotificationUrl: string;
  officialApplicationUrl: string;
  status: JobStatus;
  verifiedAt?: string;

  // Additional rich civic recruitment fields
  advtNumber?: string;
  cadreGroup?: string;
  gazetteRef?: string;
  selectionProcess?: string;
  description?: string;
  applicationFee?: {
    generalOBC: string;
    scStPwbdWomen: string;
  };
  syllabusTopics?: string[];
  importantDates?: {
    label: string;
    date: string;
  }[];
  categoryBreakdown?: {
    category: string;
    count: number;
  }[];
}

export interface JobFilters {
  searchQuery: string;
  category: string;
  department: string;
  location: string;
  qualification: string;
  payLevel: string;
  status: string;
  specialProvision: string[];
  sortBy: 'closing-earliest' | 'latest-posted' | 'vacancies-high' | 'salary-high';
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  otrNumber?: string;
  avatarUrl?: string;
  aadhaarVerified: boolean;
  digiLockerLinked: boolean;
  isAdmin: boolean;
  domicileState?: string;
  highestQualification?: string;
  category?: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS';
  savedJobIds: string[];
}

export interface JobAlertSubscription {
  id: string;
  contact: string;
  channel: 'whatsapp' | 'email' | 'sms';
  category?: string;
  state?: string;
  qualification?: string;
  createdAt: string;
}

export interface ExamEvent {
  id: string;
  jobId: string;
  examTitle: string;
  organization: string;
  category: JobCategory;
  examDate: string;
  stage: 'Prelims' | 'Mains' | 'Interview' | 'CBT-1' | 'CBT-2' | 'Physical Test' | 'Skill Test';
  admitCardDate?: string;
  status: 'Upcoming' | 'Admit Card Live' | 'Completed';
  portalUrl: string;
}
