import React from 'react';
import { Link } from 'react-router-dom';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Building, 
  MapPin, 
  GraduationCap, 
  Calendar, 
  Clock, 
  Bookmark, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  CheckCircle,
  AlertTriangle,
  Banknote,
  Users
} from 'lucide-react';

interface JobCardProps {
  job: Job;
  onOpenPdfModal?: (job: Job) => void;
  onOpenApplyModal?: (job: Job) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ job, onOpenPdfModal, onOpenApplyModal }) => {
  const { savedJobIds, toggleSaveJob } = useAuth();
  const isSaved = savedJobIds.includes(job.id);

  // Calculate days remaining
  const calculateDaysLeft = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const now = new Date();
    const diffTime = end.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysLeft = calculateDaysLeft(job.applicationEndDate);
  const isExpired = job.status === 'expired' || daysLeft <= 0;

  // Determine badge styling
  const getStatusBadge = () => {
    if (isExpired) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold">
          <Clock className="w-3 h-3" /> Expired
        </span>
      );
    }
    if (daysLeft <= 2) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
          <Clock className="w-3 h-3" /> Closes in {daysLeft === 1 ? '1 Day' : '2 Days'}
        </span>
      );
    }
    if (daysLeft <= 7) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold">
          <Clock className="w-3 h-3" /> {daysLeft} Days Left
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eff4ff] text-[#0051d5] text-xs font-bold">
        <Clock className="w-3 h-3" /> {daysLeft} Days Left
      </span>
    );
  };

  // Get icon by category
  const getCategoryIcon = () => {
    switch (job.category) {
      case 'UPSC':
        return 'account_balance';
      case 'SSC':
        return 'domain';
      case 'Railways':
        return 'directions_railway';
      case 'Banking and Financial Institutions':
        return 'account_balance_wallet';
      case 'Army':
      case 'Defence organizations':
        return 'shield';
      case 'Navy':
        return 'directions_boat';
      case 'Healthcare':
        return 'local_hospital';
      case 'Teaching':
        return 'school';
      case 'Research organizations':
        return 'rocket_launch';
      case 'Judiciary':
        return 'gavel';
      default:
        return 'assured_workload';
    }
  };

  return (
    <article className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-slate-200 relative overflow-hidden group">
      {/* Left Accent indicator */}
      <div 
        className={`absolute left-0 top-0 bottom-0 w-1.5 ${
          isExpired 
            ? 'bg-slate-400' 
            : daysLeft <= 7 
              ? 'bg-[#ba1a1a]' 
              : 'bg-[#0051d5]'
        }`} 
      />

      <div className="space-y-4 pl-1">
        {/* Top Header: Authority, Verified Tag, Title */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-lg bg-[#eff4ff] text-[#001f3e] flex items-center justify-center shrink-0 border border-[#d3e4fe]">
              <span className="material-symbols-outlined text-2xl">
                {getCategoryIcon()}
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#43474e]">
                  {job.organization}
                </span>
                
                <span className="inline-flex items-center gap-1 text-[11px] bg-[#eff4ff] px-2 py-0.5 rounded text-[#0b1c30] font-semibold border border-[#d3e4fe]">
                  <ShieldCheck className="w-3 h-3 text-[#0051d5]" />
                  {job.category}
                </span>

                {job.location && (
                  <span className="inline-flex items-center gap-0.5 text-[11px] text-slate-500 font-medium">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    {job.location}
                  </span>
                )}

                {job.advtNumber && (
                  <span className="font-mono text-xs text-slate-400">
                    {job.advtNumber}
                  </span>
                )}
              </div>

              <Link to={`/jobs/${job.id}`}>
                <h2 className="text-lg font-bold text-[#001f3e] mt-1 group-hover:text-[#0051d5] transition-colors leading-snug">
                  {job.title}
                </h2>
              </Link>

              <p className="text-xs text-[#43474e] mt-0.5 line-clamp-2">
                {job.description || `Recruitment conducted by ${job.department} under ${job.organization}.`}
              </p>
            </div>
          </div>

          {/* Right Action: Status Tag & Bookmark */}
          <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0">
            {getStatusBadge()}

            <button
              onClick={() => toggleSaveJob(job.id)}
              type="button"
              className={`p-2 rounded-lg transition-colors border ${
                isSaved 
                  ? 'bg-amber-50 text-amber-600 border-amber-200' 
                  : 'text-slate-400 hover:text-[#001f3e] hover:bg-slate-100 border-transparent'
              }`}
              title={isSaved ? 'Remove from saved notices' : 'Save notification to candidate portal'}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Metadata Matrix Grid (Required fields: vacancies, salary, qualification, ageLimit) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f8f9ff] p-3.5 rounded-lg border border-[#e5eeff]">
          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Total Posts
            </span>
            <span className="text-base font-bold text-[#001f3e] flex items-center gap-1">
              <Users className="w-4 h-4 text-[#0051d5]" />
              {job.vacancies.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Pay Matrix
            </span>
            <span className="text-xs font-bold text-[#001f3e] truncate block" title={job.salary}>
              {job.salary}
            </span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Min Eligibility
            </span>
            <span className="text-xs font-bold text-[#001f3e] truncate block" title={job.qualification}>
              {job.qualification}
            </span>
          </div>

          <div>
            <span className="block text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Age Bracket
            </span>
            <span className="text-xs font-bold text-[#001f3e] truncate block" title={job.ageLimit}>
              {job.ageLimit}
            </span>
          </div>
        </div>

        {/* Footer Actions: Dates, Gazette PDF, Direct Apply */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-[#43474e] flex-wrap">
            {job.cadreGroup && (
              <span className="bg-[#eff4ff] text-[#001f3e] px-2.5 py-1 rounded font-semibold text-[11px]">
                {job.cadreGroup}
              </span>
            )}

            {job.examinationDate && (
              <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded font-medium text-[11px] flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-500" /> Exam: {job.examinationDate}
              </span>
            )}

            <span className={`text-[11px] font-semibold flex items-center gap-1 ${daysLeft <= 5 ? 'text-[#ba1a1a]' : 'text-slate-600'}`}>
              <Clock className="w-3 h-3" />
              Closes: {new Date(job.applicationEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* View Details Page */}
            <Link
              to={`/jobs/${job.id}`}
              className="px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-[#001f3e] text-xs font-bold flex items-center gap-1 transition-colors"
            >
              View Details
            </Link>

            {/* Official Gazette PDF Modal */}
            <button
              onClick={() => onOpenPdfModal && onOpenPdfModal(job)}
              type="button"
              className="px-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] text-[#001f3e] text-xs font-bold flex items-center gap-1 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-[#0051d5]" />
              Gazette PDF
            </button>

            {/* Apply on Official Portal */}
            <button
              onClick={() => onOpenApplyModal && onOpenApplyModal(job)}
              type="button"
              className="px-4 py-1.5 rounded-lg bg-[#001f3e] hover:bg-[#12345a] text-white text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Apply Online</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
