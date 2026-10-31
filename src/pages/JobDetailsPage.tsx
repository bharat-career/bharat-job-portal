import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { JobService } from '../services/jobService';
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
  ArrowLeft,
  Share2,
  Users,
  Banknote,
  CheckCircle2,
  AlertTriangle,
  Award,
  BookOpen,
  Briefcase
} from 'lucide-react';

interface JobDetailsPageProps {
  onOpenPdfModal: (job: Job) => void;
  onOpenApplyModal: (job: Job) => void;
}

export const JobDetailsPage: React.FC<JobDetailsPageProps> = ({
  onOpenPdfModal,
  onOpenApplyModal,
}) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { savedJobIds, toggleSaveJob } = useAuth();
  const [copied, setCopied] = useState(false);

  const job = id ? JobService.getJobById(id) : undefined;

  if (!job) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-[#001f3e]">
          Government Recruitment Not Found
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          The requested recruitment notice may have been archived or re-indexed under a different circular reference.
        </p>
        <Link
          to="/jobs"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#001f3e] text-white text-xs font-bold rounded-lg"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Vacancy Directory
        </Link>
      </div>
    );
  }

  const isSaved = savedJobIds.includes(job.id);
  const isExpired = job.status === 'expired' || new Date(job.applicationEndDate).getTime() < Date.now();

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Related jobs
  const relatedJobs = JobService.getJobs()
    .filter((j) => j.id !== job.id && (j.category === job.category || j.organization === job.organization))
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between gap-4 text-xs">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-slate-600 hover:text-[#001f3e] font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Link Copied!' : 'Share Notice'}</span>
          </button>

          <button
            onClick={() => toggleSaveJob(job.id)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-amber-50 text-amber-800 border-amber-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved to Portal' : 'Save Notice'}</span>
          </button>
        </div>
      </div>

      {/* Main Recruitment Hero Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        {/* Status Line */}
        <div 
          className={`absolute left-0 top-0 bottom-0 w-2 ${
            isExpired ? 'bg-slate-400' : 'bg-[#0051d5]'
          }`} 
        />

        {/* Title, Badges, and Metadata */}
        <div className="space-y-3 pl-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#eff4ff] border border-[#d3e4fe] text-[#001f3e] px-2.5 py-0.5 rounded font-bold text-xs">
              {job.category}
            </span>

            {job.cadreGroup && (
              <span className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-medium text-xs">
                {job.cadreGroup}
              </span>
            )}

            <span className="font-mono text-xs text-slate-400">
              {job.advtNumber || `ID: ${job.id}`}
            </span>

            {job.verifiedAt && (
              <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-50 border border-emerald-200 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Gazette Verified
              </span>
            )}

            {isExpired ? (
              <span className="bg-red-100 text-red-800 px-2.5 py-0.5 rounded font-bold text-xs">
                Application Closed / Expired
              </span>
            ) : (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded font-bold text-xs flex items-center gap-1">
                <Clock className="w-3 h-3" /> Applications Open
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f3e] leading-snug">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#43474e] font-medium pt-1">
            <span className="flex items-center gap-1">
              <Building className="w-4 h-4 text-slate-400" />
              <strong>Department:</strong> {job.department}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4 text-slate-400" />
              <strong>Issuing Board:</strong> {job.organization}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-slate-400" />
              <strong>Location:</strong> {job.location}
            </span>
          </div>
        </div>

        {/* 4 Pillars Metric Matrix */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#f8f9ff] p-5 rounded-xl border border-[#e5eeff]">
          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Total Vacancies
            </span>
            <div className="text-xl sm:text-2xl font-black text-[#001f3e] flex items-center gap-2">
              <Users className="w-5 h-5 text-[#0051d5]" />
              {job.vacancies.toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-slate-500 block">Category quotas apply</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Pay Matrix (7th CPC)
            </span>
            <div className="text-base sm:text-lg font-bold text-[#001f3e] truncate" title={job.salary}>
              {job.salary}
            </div>
            <span className="text-[11px] text-slate-500 block">Plus central DA, HRA, TA</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Min Eligibility
            </span>
            <div className="text-sm font-bold text-[#001f3e] line-clamp-2" title={job.qualification}>
              {job.qualification}
            </div>
            <span className="text-[11px] text-slate-500 block">Any recognized board</span>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
              Age Limit
            </span>
            <div className="text-sm font-bold text-[#001f3e] line-clamp-2" title={job.ageLimit}>
              {job.ageLimit}
            </div>
            <span className="text-[11px] text-slate-500 block">Cut-off as per rules</span>
          </div>
        </div>

        {/* Action Handoff Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#0051d5]" />
              Application Window: {new Date(job.applicationStartDate).toLocaleDateString('en-GB')} — {new Date(job.applicationEndDate).toLocaleDateString('en-GB')}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Official Portal: <strong>{new URL(job.officialApplicationUrl).hostname}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenPdfModal(job)}
              className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#001f3e] text-xs font-bold flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-[#0051d5]" />
              <span>Gazette PDF Circular</span>
            </button>

            <button
              onClick={() => onOpenApplyModal(job)}
              disabled={isExpired}
              className={`px-6 py-2.5 rounded-xl text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all ${
                isExpired 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-[#001f3e] hover:bg-[#12345a]'
              }`}
            >
              <span>{isExpired ? 'Applications Closed' : 'Apply on Official Portal'}</span>
              <ExternalLink className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid: Left Breakdown + Right Key Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Details, Reservation, Syllabus */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Post Description */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-[#001f3e] flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#0051d5]" /> Overview of the Cadre
            </h3>
            <p className="text-xs text-[#43474e] leading-relaxed">
              {job.description || `The recruitment process is conducted under the aegis of the ${job.organization}, establishing central civil or technical appointments across all regions of India.`}
            </p>
          </div>

          {/* Category-wise Reservation Matrix */}
          {job.categoryBreakdown && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#001f3e] flex items-center gap-2">
                <Users className="w-5 h-5 text-[#0051d5]" /> Category-Wise Vacancy Breakdown
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-[#eff4ff] text-[#001f3e] font-bold">
                    <tr>
                      <th className="p-3">Reservation Category</th>
                      <th className="p-3 text-right">Sanctioned Posts</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {job.categoryBreakdown.map((row) => (
                      <tr key={row.category} className="hover:bg-slate-50">
                        <td className="p-3 font-medium text-slate-700">{row.category}</td>
                        <td className="p-3 text-right font-mono font-bold text-[#001f3e]">
                          {row.count.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50 font-bold">
                      <td className="p-3 text-[#001f3e]">Total Verified Posts</td>
                      <td className="p-3 text-right font-mono text-[#001f3e]">
                        {job.vacancies.toLocaleString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Selection Scheme & Syllabus */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#001f3e] flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#0051d5]" /> Scheme of Examination & Selection Stages
            </h3>
            
            <div className="p-4 bg-[#f8f9ff] border border-slate-200 rounded-xl text-xs space-y-2">
              <div className="font-bold text-[#001f3e]">Official Selection Stages:</div>
              <p className="text-slate-600 leading-relaxed">
                {job.selectionProcess || 'Computer Based Examination (Objective Test) followed by Skill Test / Descriptive Test, Document Verification, and Pre-appointment Medical Examination.'}
              </p>
            </div>

            {job.syllabusTopics && job.syllabusTopics.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Key Examination Modules
                </h4>
                <ul className="space-y-1.5 text-xs text-[#43474e]">
                  {job.syllabusTopics.map((topic, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Application Fee */}
          {job.applicationFee && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
              <h3 className="text-base font-bold text-[#001f3e] flex items-center gap-2">
                <Banknote className="w-5 h-5 text-[#0051d5]" /> Application Fee Structure
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
                  <span className="text-slate-500 block mb-0.5">General / OBC / EWS Male:</span>
                  <span className="text-base font-bold text-[#001f3e]">{job.applicationFee.generalOBC}</span>
                </div>
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-emerald-700 block mb-0.5">SC / ST / PwBD / All Women:</span>
                  <span className="text-base font-bold text-emerald-900">{job.applicationFee.scStPwbdWomen}</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Right Sidebar (1 Col): Key Dates & Related */}
        <div className="space-y-6">
          
          {/* Important Dates Timeline */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#0051d5]" /> Recruitment Schedule
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500">Notice Published</span>
                <span className="font-mono font-semibold text-slate-800">
                  {new Date(job.applicationStartDate).toLocaleDateString('en-GB')}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                <span className="text-slate-500 font-bold text-red-700">Closing Deadline</span>
                <span className="font-mono font-bold text-red-700">
                  {new Date(job.applicationEndDate).toLocaleDateString('en-GB')}
                </span>
              </div>

              {job.examinationDate && (
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="text-slate-500 font-bold text-[#0051d5]">Tentative Exam</span>
                  <span className="font-bold text-[#0051d5] text-right">
                    {job.examinationDate}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => onOpenApplyModal(job)}
                disabled={isExpired}
                className="w-full py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Direct Application Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Related Vacancies */}
          {relatedJobs.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-[#001f3e] uppercase tracking-wider">
                Similar Active Notices
              </h3>

              <div className="space-y-3">
                {relatedJobs.map((rj) => (
                  <Link
                    key={rj.id}
                    to={`/jobs/${rj.id}`}
                    className="block p-3 bg-[#f8f9ff] hover:bg-[#eff4ff] border border-slate-200 rounded-xl transition-all group"
                  >
                    <span className="text-[10px] font-bold text-[#0051d5] uppercase tracking-wider block mb-1">
                      {rj.organization}
                    </span>
                    <h4 className="text-xs font-bold text-[#001f3e] group-hover:text-[#0051d5] leading-snug">
                      {rj.title}
                    </h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
                      <span>{rj.vacancies.toLocaleString()} Posts</span>
                      <span>Closes {new Date(rj.applicationEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
