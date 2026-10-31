import React, { useState, useEffect } from 'react';
import { JobService } from '../services/jobService';
import { Job } from '../types';
import { AdminEditJobModal } from '../components/AdminEditJobModal';
import { SupabaseConnectModal } from '../components/SupabaseConnectModal';
import { CronSyncModal } from '../components/CronSyncModal';
import { useAuth } from '../context/AuthContext';
import { 
  PlusCircle, 
  Edit3, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  RotateCcw, 
  Search, 
  Users, 
  FileText, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Database,
  Lock,
  KeyRound,
  Radio,
  Terminal,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin, isSupabase, toggleAdminRole } = useAuth();
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(() => JobService.getJobs());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isCronModalOpen, setIsCronModalOpen] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    // Listen for real-time changes
    const unsubscribe = JobService.subscribe((updatedJobs) => {
      setJobs(updatedJobs);
    });
    return unsubscribe;
  }, []);

  // Access Protection Guard
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-5 animate-in fade-in">
        <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto">
          <Lock className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] uppercase font-bold tracking-widest text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Restricted Officer Area
          </span>
          <h2 className="text-xl font-bold text-[#001f3e] pt-1">
            Commission Administrative Gateway
          </h2>
          <p className="text-xs text-slate-500">
            Recruitment management and database synchronization are restricted to authorized Commission Officers and Administrators.
          </p>
        </div>

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            if (pinInput === '1947' || pinInput === 'admin' || pinInput === 'nic2025') {
              toggleAdminRole();
            } else {
              setPinError(true);
            }
          }} 
          className="space-y-3 pt-2 text-left"
        >
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Commission Officer PIN</span>
              <span className="text-[11px] text-amber-700 font-mono font-normal">Authorized Demo PIN: 1947</span>
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinInput}
              onChange={(e) => {
                setPinInput(e.target.value);
                setPinError(false);
              }}
              placeholder="Enter PIN (1947)"
              className="w-full px-3 py-2.5 text-center text-sm font-mono tracking-widest border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            {pinError && (
              <p className="text-[11px] text-red-600 mt-1 font-semibold flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Invalid Officer PIN. Enter 1947 to proceed.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
          >
            <KeyRound className="w-4 h-4" />
            <span>Authenticate & Open Console</span>
          </button>
        </form>

        <div className="border-t border-slate-100 pt-3">
          <Link
            to="/jobs"
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold"
          >
            &larr; Return to Public Job Discovery
          </Link>
        </div>
      </div>
    );
  }

  const stats = JobService.getStats();

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  const handleOpenCreateModal = () => {
    setSelectedJobForEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (job: Job) => {
    setSelectedJobForEdit(job);
    setIsModalOpen(true);
  };

  const handleSaveJob = (jobData: any) => {
    if (selectedJobForEdit) {
      JobService.updateJob(selectedJobForEdit.id, jobData);
      showFeedback(`Successfully updated ${jobData.title}`);
    } else {
      JobService.createJob(jobData);
      showFeedback(`Successfully gazetted new recruitment: ${jobData.title}`);
    }
    setJobs(JobService.getJobs());
  };

  const handleDeleteJob = (id: string, title: string) => {
    if (window.confirm(`Are you sure you want to delete "${title}"?`)) {
      JobService.deleteJob(id);
      setJobs(JobService.getJobs());
      showFeedback(`Deleted recruitment record: ${title}`);
    }
  };

  const handleToggleExpire = (id: string) => {
    const job = JobService.getJobById(id);
    if (!job) return;
    const newStatus = job.status === 'expired' ? 'active' : 'expired';
    JobService.updateJob(id, { status: newStatus });
    setJobs(JobService.getJobs());
    showFeedback(`Status for "${job.title}" changed to ${newStatus}`);
  };

  const handleToggleVerification = (id: string) => {
    JobService.toggleVerification(id);
    setJobs(JobService.getJobs());
    showFeedback(`Gazette verification status toggled.`);
  };

  const handleResetSeeds = () => {
    if (window.confirm('Reset all recruitment listings back to official default seed dataset?')) {
      const reset = JobService.resetToDefaultData();
      setJobs(reset);
      showFeedback('Reset database to default seed state.');
    }
  };

  const filteredJobs = jobs.filter((j) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.organization.toLowerCase().includes(q) ||
      j.category.toLowerCase().includes(q) ||
      (j.advtNumber && j.advtNumber.toLowerCase().includes(q))
    );
  });

  return (
    <div className="space-y-6">
      {/* Notice Toast */}
      {actionNotice && (
        <div className="bg-emerald-600 text-white px-4 py-3 rounded-xl shadow-md flex items-center justify-between text-xs font-semibold animate-fadeIn">
          <span>{actionNotice}</span>
          <button onClick={() => setActionNotice(null)} className="font-bold underline text-[11px]">Dismiss</button>
        </div>
      )}

      {/* Admin Header */}
      <div className="bg-[#001f3e] text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-[#f59e0b] px-2.5 py-0.5 rounded font-mono text-[11px] font-bold">
              NIC Gazette Desk
            </span>
            <span className="text-xs text-slate-300">Central Management Suite</span>
          </div>
          <h1 className="text-2xl font-bold">
            Recruitment Administrative Console
          </h1>
          <p className="text-xs text-slate-300 max-w-xl">
            Create, verify, edit, and mark expiration on public sector job circulars across Central Ministries and State Commissions.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <button
            onClick={() => setIsSupabaseModalOpen(true)}
            className={`px-3.5 py-2.5 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border ${
              isSupabase 
                ? 'bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border-emerald-700' 
                : 'bg-amber-950/80 hover:bg-amber-900 text-amber-300 border-amber-700'
            }`}
            title="Configure or test Supabase connection"
          >
            <Database className="w-3.5 h-3.5" />
            <span>{isSupabase ? 'Supabase Connected' : 'Connect Supabase'}</span>
          </button>

          <button
            onClick={() => setIsCronModalOpen(true)}
            className="px-3.5 py-2.5 bg-emerald-900/80 hover:bg-emerald-800 text-emerald-300 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-700 shadow-2xs"
            title="Inspect or execute automated gazette crawler"
          >
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>National Cron Aggregator</span>
          </button>

          <button
            onClick={handleResetSeeds}
            className="px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Reset to factory seed data"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Seed Data</span>
          </button>

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold rounded-xl flex items-center gap-2 shadow-sm transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Gazette New Recruitment</span>
          </button>
        </div>
      </div>

      {/* Stats micro cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Total Notices</span>
          <div className="text-2xl font-bold text-[#001f3e] mt-1">{jobs.length}</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Active Windows</span>
          <div className="text-2xl font-bold text-emerald-700 mt-1">
            {jobs.filter((j) => j.status === 'active' || j.status === 'closing-soon').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Expired Archive</span>
          <div className="text-2xl font-bold text-slate-500 mt-1">
            {jobs.filter((j) => j.status === 'expired').length}
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-slate-500 text-[11px] uppercase font-bold tracking-wider">Aggregated Posts</span>
          <div className="text-2xl font-bold text-[#0051d5] mt-1">
            {stats.totalVacancies.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Recruitment Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-[#001f3e]">
              All Gazetted Recruitments in System ({filteredJobs.length})
            </h2>
            <p className="text-xs text-slate-500">
              Live updates directly sync to candidate discovery feeds.
            </p>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by title, commission, advt..."
              className="w-full pl-9 pr-3 py-1.5 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#eff4ff] text-[#001f3e] font-bold border-b border-[#d3e4fe]">
              <tr>
                <th className="p-3">Recruitment Post</th>
                <th className="p-3">Board & Category</th>
                <th className="p-3">Vacancies</th>
                <th className="p-3">Status</th>
                <th className="p-3">Verification</th>
                <th className="p-3">Application Window</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredJobs.map((job) => {
                const isExpired = job.status === 'expired';
                return (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 max-w-xs">
                      <Link to={`/jobs/${job.id}`} className="font-bold text-[#001f3e] hover:text-[#0051d5] block leading-snug">
                        {job.title}
                      </Link>
                      <span className="font-mono text-[10px] text-slate-400">
                        {job.advtNumber || job.id}
                      </span>
                    </td>

                    <td className="p-3">
                      <span className="font-semibold text-slate-700 block">{job.organization}</span>
                      <span className="text-[10px] text-[#0051d5] font-mono">{job.category}</span>
                    </td>

                    <td className="p-3 font-mono font-bold text-[#001f3e]">
                      {job.vacancies.toLocaleString()}
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleToggleExpire(job.id)}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isExpired 
                            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                            : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        }`}
                        title="Click to toggle Expired / Active status"
                      >
                        {job.status}
                      </button>
                    </td>

                    <td className="p-3">
                      <button
                        onClick={() => handleToggleVerification(job.id)}
                        className={`flex items-center gap-1 text-[11px] font-semibold ${
                          job.verifiedAt ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                        title="Click to toggle Gazette seal verification"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{job.verifiedAt ? 'Verified' : 'Unverified'}</span>
                      </button>
                    </td>

                    <td className="p-3 font-mono text-[11px] text-slate-600">
                      {new Date(job.applicationStartDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} — {new Date(job.applicationEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEditModal(job)}
                          className="p-1.5 text-slate-600 hover:text-[#0051d5] hover:bg-slate-100 rounded"
                          title="Edit posting"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete recruitment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Create Modal */}
      <AdminEditJobModal
        job={selectedJobForEdit}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveJob}
      />

      {/* Supabase Connection Modal */}
      <SupabaseConnectModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* National Cron Aggregator Modal */}
      <CronSyncModal
        isOpen={isCronModalOpen}
        onClose={() => setIsCronModalOpen(false)}
        onJobsRefreshed={() => setJobs(JobService.getJobs())}
      />
    </div>
  );
};
