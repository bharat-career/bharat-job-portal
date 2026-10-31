import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JobService } from '../services/jobService';
import { JobCard } from '../components/JobCard';
import { 
  User, 
  ShieldCheck, 
  Bookmark, 
  Calendar, 
  FileCheck2, 
  ExternalLink, 
  Clock, 
  ArrowRight,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { Job } from '../types';

interface UserDashboardPageProps {
  onOpenPdfModal: (job: Job) => void;
  onOpenApplyModal: (job: Job) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onOpenPdfModal,
  onOpenApplyModal,
}) => {
  const { user, savedJobIds, logout } = useAuth();
  const allJobs = JobService.getJobs();

  // If user is not authenticated
  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-5 animate-in fade-in">
        <div className="w-16 h-16 bg-blue-50 text-[#0051d5] rounded-2xl flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-[#001f3e]">
            Candidate Portal Access
          </h2>
          <p className="text-xs text-slate-500">
            Sign in with your mobile number to view saved recruitment notices, OTR synchronization, and personalized exam alerts.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/auth"
            className="w-full py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In with Mobile OTP / OTR</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/jobs"
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            Browse Public Job Notifications
          </Link>
        </div>
      </div>
    );
  }

  // Saved jobs list
  const savedJobs = allJobs.filter((j) => savedJobIds.includes(j.id));

  return (
    <div className="space-y-6">
      {/* Candidate Profile Summary Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <img
            alt="Candidate Avatar"
            src={user.avatarUrl || '/assets/aistudio/abhi_pic-new_b1af521f.png'}
            className="w-16 h-16 rounded-full object-cover border-2 border-[#0051d5] shadow-xs"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-bold text-[#001f3e]">
                {user.fullName}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold">
                <ShieldCheck className="w-3.5 h-3.5" /> Aadhaar Verified
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full font-bold">
                <FileCheck2 className="w-3.5 h-3.5" /> DigiLocker Linked
              </span>
            </div>

            <p className="text-xs text-slate-600 font-mono flex items-center gap-2 flex-wrap">
              {user.phoneNumber && (
                <span className="font-bold text-[#001f3e]">{user.phoneNumber}</span>
              )}
              {user.otrNumber && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                  OTR: {user.otrNumber}
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span>Domicile: {user.domicileState || 'Delhi / Pan-India'}</span>
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-600 pt-1">
              <span>Category: <strong>{user.category || 'General / UR'}</strong></span>
              <span>•</span>
              <span>Qualification: <strong>{user.highestQualification || "Bachelor's Degree"}</strong></span>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Saved Notifications
            </span>
            <div className="text-2xl font-bold text-[#001f3e] mt-1">
              {savedJobs.length}
            </div>
          </div>
          <div className="p-3 bg-blue-50 text-[#0051d5] rounded-xl">
            <Bookmark className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Active Deadlines
            </span>
            <div className="text-2xl font-bold text-[#ba1a1a] mt-1">
              {savedJobs.filter((j) => j.status === 'closing-soon').length}
            </div>
          </div>
          <div className="p-3 bg-red-50 text-[#ba1a1a] rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              OTR Profiles Synced
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1">
              4 Commissions
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Saved Notifications Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#001f3e]">
              Saved Recruitment Circulars ({savedJobs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Bookmarked notifications saved in your browser & synced to your account.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-[#0051d5] hover:underline flex items-center gap-1"
          >
            <span>Browse More Vacancies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {savedJobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <FolderOpen className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-[#001f3e]">
              No saved recruitment notifications yet
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the bookmark icon on any job card to track deadlines, download gazetted PDFs, and prepare applications.
            </p>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#001f3e] text-white text-xs font-bold rounded-lg"
            >
              Explore Active Jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onOpenPdfModal={onOpenPdfModal}
                onOpenApplyModal={onOpenApplyModal}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
