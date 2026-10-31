import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { JobService } from '../services/jobService';
import { Job, JobCategory } from '../types';
import { JobCard } from '../components/JobCard';
import { 
  Search, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Calendar, 
  Building, 
  MapPin, 
  Flame, 
  Clock, 
  AlertCircle,
  FileText,
  TrendingUp,
  BellRing
} from 'lucide-react';

interface HomePageProps {
  onOpenPdfModal: (job: Job) => void;
  onOpenApplyModal: (job: Job) => void;
  onOpenCalculator: () => void;
  onOpenAlerts: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onOpenPdfModal,
  onOpenApplyModal,
  onOpenCalculator,
  onOpenAlerts,
}) => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [allJobs, setAllJobs] = useState<Job[]>(() => JobService.getJobs());

  useEffect(() => {
    const unsubscribe = JobService.subscribe((updated) => {
      setAllJobs(updated);
    });
    return unsubscribe;
  }, []);

  const stats = JobService.getStats();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchInput.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  // Top featured recruitments (exclude draft)
  const spotlightJobs = allJobs.slice(0, 6);

  // Closing soon
  const urgentJobs = allJobs.filter((j) => j.status === 'closing-soon').slice(0, 3);

  // States
  const popularStates = [
    { name: 'Uttar Pradesh', code: 'UP', count: 420 },
    { name: 'Bihar', code: 'BR', count: 1957 },
    { name: 'Maharashtra', code: 'MH', count: 860 },
    { name: 'Rajasthan', code: 'RJ', count: 640 },
    { name: 'Madhya Pradesh', code: 'MP', count: 512 },
    { name: 'Delhi (NCT)', code: 'DL', count: 4187 },
  ];

  return (
    <div className="space-y-10">
      {/* Top Breadcrumb & Live Gazette Verification Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm text-[#43474e]">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-base">home</span>
          <span>Home</span>
          <span className="text-slate-300">/</span>
          <span className="text-[#001f3e] font-bold">All Government Recruitments</span>
        </div>

        <div className="flex items-center gap-2.5 bg-[#eff4ff] border border-[#d3e4fe] px-3.5 py-1.5 rounded-full w-fit">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0051d5] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0051d5]"></span>
          </span>
          <span className="font-mono text-[#0b1c30] text-xs font-semibold">
            Gazette Data Synced: Today, 08:30 AM IST
          </span>
          <span className="text-[#c3c6cf]">|</span>
          <span className="flex items-center gap-1 text-[#0b1c30] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0051d5]" /> NIC Central Exchange
          </span>
        </div>
      </div>

      {/* Hero Container with Header, Metrics & Search */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#001f3e] tracking-tight">
                All Government Jobs & Official Notifications
              </h1>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#eff4ff] text-[#001f3e] font-mono font-bold text-xs border border-[#d3e4fe]">
                {stats.activeJobsCount} Active Notices
              </span>
            </div>
            <p className="text-sm text-[#43474e] max-w-3xl leading-relaxed">
              Authoritative, zero-latency repository indexing gazetted vacancies across Union Ministries, State Public Service Commissions, Railway Boards, Defence, and Banking establishments.
            </p>
          </div>

          {/* Metric Micro-Cards */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-[#f8f9ff] border border-[#e5eeff] px-4 py-3 rounded-xl text-center min-w-[105px]">
              <span className="block text-xl font-bold text-[#001f3e]">
                {(stats.totalVacancies / 1000).toFixed(1)}k
              </span>
              <span className="text-[10px] text-[#43474e] uppercase font-bold tracking-wider">
                Total Vacancies
              </span>
            </div>

            <div className="bg-[#f8f9ff] border border-red-100 px-4 py-3 rounded-xl text-center min-w-[105px]">
              <span className="block text-xl font-bold text-[#ba1a1a]">
                {stats.closingSoonCount}
              </span>
              <span className="text-[10px] text-[#ba1a1a] uppercase font-bold tracking-wider">
                Closing &lt;48h
              </span>
            </div>

            <div className="bg-[#f8f9ff] border border-blue-100 px-4 py-3 rounded-xl text-center min-w-[105px]">
              <span className="block text-xl font-bold text-[#0051d5]">
                {stats.newThisWeekCount}
              </span>
              <span className="text-[10px] text-[#0051d5] uppercase font-bold tracking-wider">
                New This Week
              </span>
            </div>
          </div>
        </div>

        {/* Big Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input 
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by recruitment title, commission (UPSC, SSC, RRB), advertisement number (e.g. 04/2025-CSP), or post..."
            className="w-full pl-12 pr-32 py-3.5 bg-[#f8f9ff] border border-slate-200 rounded-xl text-sm text-[#001f3e] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#0051d5] transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <span className="hidden sm:inline font-mono text-slate-400 bg-slate-100 px-2 py-1 rounded text-xs">
              Press ⌘ + F
            </span>
            <button
              type="submit"
              className="bg-[#001f3e] hover:bg-[#12345a] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Fast Track Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-nowrap">
          <span className="text-[11px] uppercase tracking-wider text-[#43474e] font-bold shrink-0 mr-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#f59e0b]" /> Fast Track:
          </span>

          <Link
            to="/jobs"
            className="px-3.5 py-1.5 rounded-full bg-[#001f3e] text-white text-xs font-bold transition-colors hover:bg-[#12345a]"
          >
            All Active ({stats.activeJobsCount})
          </Link>

          <Link
            to="/jobs?qualification=Graduate"
            className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#001f3e] text-xs font-semibold transition-colors"
          >
            Graduate (Any Stream)
          </Link>

          <Link
            to="/jobs?qualification=10th"
            className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#001f3e] text-xs font-semibold transition-colors"
          >
            10th / 12th Pass
          </Link>

          <Link
            to="/jobs?category=Engineering"
            className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#001f3e] text-xs font-semibold transition-colors"
          >
            Engineering & Technical
          </Link>

          <Link
            to="/jobs?category=Army"
            className="px-3.5 py-1.5 rounded-full bg-[#eff4ff] hover:bg-[#dce9ff] text-[#001f3e] text-xs font-semibold transition-colors"
          >
            Defence & Police
          </Link>

          <Link
            to="/jobs?status=closing-soon"
            className="px-3.5 py-1.5 rounded-full bg-red-100 hover:bg-red-200 text-[#ba1a1a] text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Clock className="w-3.5 h-3.5" /> Closing This Week ({stats.closingSoonCount})
          </Link>

          <button
            onClick={onOpenCalculator}
            className="px-3.5 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Eligibility Calculator
          </button>
        </div>
      </div>

      {/* Official Gazette Verification Guarantee Banner */}
      <div className="bg-[#dce9ff] border border-[#b4c5ff] rounded-2xl p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start sm:items-center gap-3">
          <div className="p-2.5 bg-[#0051d5] text-white rounded-xl shrink-0 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#001f3e]">
              Official Gazette Verification Guarantee
            </h3>
            <p className="text-xs text-[#43474e] mt-0.5 max-w-2xl">
              Every listing on Bharat Career Hub maps to an authentic Gazette of India Extraordinary circular or issuing commission portal (.gov.in / .nic.in). Direct application handoffs bypass middleman aggregators.
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-block font-mono text-xs bg-white text-[#001f3e] px-3 py-1.5 rounded-lg font-bold shrink-0 border border-slate-200 shadow-xs">
          100% Gov Feeds
        </span>
      </div>

      {/* Featured Recruitments Feed */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#001f3e]">
              Spotlight Gazetted Recruitments
            </h2>
            <p className="text-xs text-[#43474e] mt-0.5">
              Highest vacancy and premier national cadre notifications currently accepting applications.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-bold text-[#0051d5] hover:text-[#001f3e] flex items-center gap-1"
          >
            <span>View All {allJobs.length} Postings</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {spotlightJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenPdfModal={onOpenPdfModal}
              onOpenApplyModal={onOpenApplyModal}
            />
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#001f3e] hover:bg-[#12345a] text-white rounded-xl text-sm font-bold shadow-sm transition-colors"
          >
            <span>Explore All 1,482 Active Recruitments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* State-Wise Quick Access Grid */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-[#001f3e]">
              State-Wise Public Service Commissions
            </h3>
            <p className="text-xs text-[#43474e]">
              Explore state civil services, police, teaching, and health departments across 28 States and 8 UTs.
            </p>
          </div>
          <Link
            to="/states"
            className="text-xs font-bold text-[#0051d5] hover:underline flex items-center gap-1"
          >
            <span>All States Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {popularStates.map((st) => (
            <Link
              key={st.code}
              to={`/jobs?location=${encodeURIComponent(st.name)}`}
              className="p-3.5 bg-[#f8f9ff] hover:bg-[#eff4ff] border border-slate-200 rounded-xl transition-all group text-left"
            >
              <span className="font-mono text-xs font-bold text-[#0051d5] bg-blue-100 px-1.5 py-0.5 rounded">
                {st.code}
              </span>
              <h4 className="text-sm font-bold text-[#001f3e] mt-2 group-hover:text-[#0051d5]">
                {st.name}
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {st.count} Vacancies
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Tailored Daily Dispatch Opt-in Banner */}
      <div className="bg-[#eff4ff] border border-[#d3e4fe] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="space-y-1.5 max-w-xl">
          <div className="flex items-center gap-2 text-[#d98b00] text-xs font-bold uppercase tracking-wider">
            <BellRing className="w-4 h-4" /> Tailored Daily Dispatch
          </div>
          <h3 className="text-xl font-bold text-[#001f3e]">
            Can't find your specific branch or educational eligibility?
          </h3>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Set automated, zero-spam Gazette alerts delivered directly via WhatsApp, SMS, or Email as soon as your state commission or educational qualification publishes new posts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={onOpenAlerts}
            className="w-full sm:w-auto px-6 py-3 bg-[#0051d5] text-white text-xs font-bold rounded-xl shadow-sm hover:bg-[#316bf3] transition-colors text-nowrap flex items-center justify-center gap-2"
          >
            <BellRing className="w-4 h-4" />
            <span>Activate Free Job Alerts</span>
          </button>
        </div>
      </div>

    </div>
  );
};
