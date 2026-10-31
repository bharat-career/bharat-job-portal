import React, { useState } from 'react';
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
  FolderOpen,
  Database,
  Edit3,
  CheckCircle2,
  X,
  BookOpen,
  HelpCircle,
  Sparkles
} from 'lucide-react';
import { Job, UserProfile } from '../types';

interface UserDashboardPageProps {
  onOpenPdfModal: (job: Job) => void;
  onOpenApplyModal: (job: Job) => void;
}

export const UserDashboardPage: React.FC<UserDashboardPageProps> = ({
  onOpenPdfModal,
  onOpenApplyModal,
}) => {
  const { user, dbSyncStatus, savedJobIds, updateUserProfile, logout } = useAuth();
  const allJobs = JobService.getJobs();

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editFullName, setEditFullName] = useState(user?.fullName || 'Abhishek Bhardwaj');
  const [editPhone, setEditPhone] = useState(user?.phoneNumber || '+91 98765 43210');
  const [editCategory, setEditCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>(user?.category || 'General');
  const [editDomicile, setEditDomicile] = useState(user?.domicileState || 'Uttar Pradesh');
  const [editQualification, setEditQualification] = useState(user?.highestQualification || "Bachelor's Degree (Engg)");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
            Sign in with your mobile number or Google account to view saved recruitment notices, OTR synchronization, and personalized exam alerts.
          </p>
        </div>
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to="/auth"
            className="w-full py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold rounded-xl shadow-sm transition-colors flex items-center justify-center gap-2"
          >
            <span>Sign In with Mobile OTP / Google</span>
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

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateUserProfile({
      fullName: editFullName,
      phoneNumber: editPhone,
      category: editCategory,
      domicileState: editDomicile,
      highestQualification: editQualification,
    });
    setIsSaving(false);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsEditing(false);
    }, 1200);
  };

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
              <span className="inline-flex items-center gap-1 text-[11px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2.5 py-0.5 rounded-full font-bold">
                <Database className="w-3 h-3 text-indigo-600" /> Database Synced
              </span>
            </div>

            <p className="text-xs text-slate-600 font-mono flex items-center gap-2 flex-wrap">
              {user.phoneNumber && (
                <span className="font-bold text-[#001f3e]">{user.phoneNumber}</span>
              )}
              {user.email && (
                <span className="text-slate-500 font-sans">({user.email})</span>
              )}
              {user.otrNumber && (
                <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                  OTR: {user.otrNumber}
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span>Domicile: {user.domicileState || 'Uttar Pradesh'}</span>
            </p>

            <div className="flex items-center gap-3 text-xs text-slate-600 pt-1 flex-wrap">
              <span>Category: <strong>{user.category || 'General'}</strong></span>
              <span>•</span>
              <span>Qualification: <strong>{user.highestQualification || "Bachelor's Degree (Engg)"}</strong></span>
              {dbSyncStatus && (
                <>
                  <span>•</span>
                  <span className="text-emerald-700 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Saved to DB at {new Date(dbSyncStatus).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 shrink-0 flex-wrap">
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-50 text-[#0051d5] hover:bg-blue-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" /> Edit OTR Profile
          </button>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>
      </div>

      {/* Learning & Support Hub Feature Banner */}
      <div className="bg-gradient-to-r from-[#001f3e] to-[#003870] text-white rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <BookOpen className="w-4 h-4" />
            <span>Preparation Guidance & Support Available</span>
          </div>
          <h3 className="text-base font-bold">
            Need syllabus blueprints, cut-off marks, or help with application forms?
          </h3>
          <p className="text-xs text-slate-200">
            Access job-specific syllabus guides for UPSC, SSC, Railways, Banking, Defence, and State PSCs or lodge support queries.
          </p>
        </div>
        <Link
          to="/learning-support"
          className="px-5 py-2.5 bg-white text-[#001f3e] hover:bg-slate-100 text-xs font-bold rounded-xl shadow-xs transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Explore Learning & Support</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
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
              Database Persistence
            </span>
            <div className="text-2xl font-bold text-emerald-700 mt-1 flex items-center gap-1.5">
              <span>Synchronized</span>
            </div>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl">
            <Database className="w-6 h-6" />
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
              Bookmarked notifications saved in database & synced across your sessions.
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

      {/* EDIT OTR PROFILE MODAL */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-[#001f3e]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden my-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-[#001f3e] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-400" />
                <h3 className="font-bold text-sm">Update Candidate Profile & Persist</h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-4 text-xs">
              {saveSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl flex items-center gap-2 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Profile successfully persisted to database!</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name (as per Matriculation Certificate)
                </label>
                <input
                  type="text"
                  required
                  value={editFullName}
                  onChange={(e) => setEditFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mobile Number
                </label>
                <input
                  type="text"
                  required
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Recruitment Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none bg-white"
                  >
                    <option value="General">General / UR</option>
                    <option value="OBC">OBC (Non Creamy)</option>
                    <option value="EWS">EWS</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    State of Domicile
                  </label>
                  <input
                    type="text"
                    value={editDomicile}
                    onChange={(e) => setEditDomicile(e.target.value)}
                    placeholder="e.g. Uttar Pradesh, Delhi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highest Qualification
                </label>
                <input
                  type="text"
                  value={editQualification}
                  onChange={(e) => setEditQualification(e.target.value)}
                  placeholder="e.g. Bachelor's Degree (Engg), B.Sc, B.Com, Post Graduate"
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Writes to server database & Supabase</span>
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-5 py-2 bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    {isSaving ? 'Persisting...' : 'Save & Persist to Database'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
