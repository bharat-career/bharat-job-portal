import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import { Job, JobCategory } from '../types';
import { JobCard } from '../components/JobCard';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RotateCcw, 
  LayoutGrid, 
  List, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Clock,
  ExternalLink,
  FileText,
  Bookmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AllJobsPageProps {
  onOpenPdfModal: (job: Job) => void;
  onOpenApplyModal: (job: Job) => void;
}

export const AllJobsPage: React.FC<AllJobsPageProps> = ({ onOpenPdfModal, onOpenApplyModal }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { savedJobIds, toggleSaveJob } = useAuth();

  // Filters state from URL or defaults
  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || '';
  const locationParam = searchParams.get('location') || '';
  const qualificationParam = searchParams.get('qualification') || '';
  const statusParam = searchParams.get('status') || '';
  const sortParam = searchParams.get('sort') || 'closing-earliest';

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [selectedLocation, setSelectedLocation] = useState(locationParam);
  const [selectedQualification, setSelectedQualification] = useState(qualificationParam);
  const [selectedStatus, setSelectedStatus] = useState(statusParam);
  const [selectedPayScale, setSelectedPayScale] = useState('');
  const [zeroFeeOnly, setZeroFeeOnly] = useState(false);
  const [pwbdOnly, setPwbdOnly] = useState(false);
  const [sortBy, setSortBy] = useState(sortParam);
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [allJobs, setAllJobs] = useState<Job[]>(() => JobService.getJobs());

  React.useEffect(() => {
    const unsubscribe = JobService.subscribe((updated) => {
      setAllJobs(updated);
    });
    return unsubscribe;
  }, []);

  // Filter and sort jobs
  const filteredJobs = useMemo(() => {
    return allJobs
      .filter((job) => {
        // Text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = job.title.toLowerCase().includes(q);
          const matchOrg = job.organization.toLowerCase().includes(q);
          const matchDept = job.department.toLowerCase().includes(q);
          const matchQual = job.qualification.toLowerCase().includes(q);
          const matchAdvt = job.advtNumber?.toLowerCase().includes(q);
          if (!matchTitle && !matchOrg && !matchDept && !matchQual && !matchAdvt) {
            return false;
          }
        }

        // Category filter
        if (selectedCategory && job.category !== selectedCategory) {
          return false;
        }

        // Location / State filter
        if (selectedLocation) {
          if (selectedLocation === 'Central Govt' || selectedLocation === 'All India') {
            if (!job.location.includes('All India')) return false;
          } else if (!job.location.toLowerCase().includes(selectedLocation.toLowerCase())) {
            return false;
          }
        }

        // Qualification filter
        if (selectedQualification) {
          if (!job.qualification.toLowerCase().includes(selectedQualification.toLowerCase())) {
            return false;
          }
        }

        // Status filter
        if (selectedStatus) {
          if (selectedStatus === 'closing-soon' && job.status !== 'closing-soon') return false;
          if (selectedStatus === 'active' && (job.status === 'expired' || job.status === 'draft')) return false;
          if (selectedStatus === 'expired' && job.status !== 'expired') return false;
        }

        // Pay matrix filter
        if (selectedPayScale) {
          if (selectedPayScale === 'Level 10+' && !job.salary.includes('Level 10')) return false;
          if (selectedPayScale === 'Level 7-9' && !job.salary.includes('Level 7') && !job.salary.includes('Level 8') && !job.salary.includes('Level 9')) return false;
          if (selectedPayScale === 'Level 4-6' && !job.salary.includes('Level 4') && !job.salary.includes('Level 5') && !job.salary.includes('Level 6')) return false;
          if (selectedPayScale === 'Level 1-3' && !job.salary.includes('Level 2') && !job.salary.includes('Level 1') && !job.salary.includes('Level 3')) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'closing-earliest') {
          return new Date(a.applicationEndDate).getTime() - new Date(b.applicationEndDate).getTime();
        }
        if (sortBy === 'latest-posted') {
          return new Date(b.applicationStartDate).getTime() - new Date(a.applicationStartDate).getTime();
        }
        if (sortBy === 'vacancies-high') {
          return b.vacancies - a.vacancies;
        }
        return 0;
      });
  }, [
    allJobs,
    searchQuery,
    selectedCategory,
    selectedLocation,
    selectedQualification,
    selectedStatus,
    selectedPayScale,
    sortBy,
  ]);

  // Paginated list
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage) || 1;
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedLocation('');
    setSelectedQualification('');
    setSelectedStatus('');
    setSelectedPayScale('');
    setZeroFeeOnly(false);
    setPwbdOnly(false);
    setSearchParams({});
    setCurrentPage(1);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
    selectedCategory ||
    selectedLocation ||
    selectedQualification ||
    selectedStatus ||
    selectedPayScale
  );

  return (
    <div className="space-y-6">
      {/* Page Title & Breadcrumb */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-[#43474e]">
          <Link to="/" className="hover:text-[#0051d5]">Home</Link>
          <span>/</span>
          <span className="text-[#001f3e] font-bold">Government Job Openings</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-[#001f3e]">
              Search Official Government Recruitments
            </h1>
            <p className="text-xs text-[#43474e]">
              Showing {filteredJobs.length} verified gazetted vacancies across India.
            </p>
          </div>

          {/* Search bar in toolbar */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search title, commission, post..."
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
            />
          </div>
        </div>
      </div>

      {/* Applied Criteria Chips & View Switcher */}
      <div className="bg-[#eff4ff] border border-[#d3e4fe] p-3.5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#43474e] uppercase text-[11px]">Applied Criteria:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              Query: "{searchQuery}"
              <button onClick={() => setSearchQuery('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedCategory && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              Board: {selectedCategory}
              <button onClick={() => setSelectedCategory('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedQualification && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              Degree: {selectedQualification}
              <button onClick={() => setSelectedQualification('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedLocation && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              State: {selectedLocation}
              <button onClick={() => setSelectedLocation('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedStatus && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              Status: {selectedStatus}
              <button onClick={() => setSelectedStatus('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {selectedPayScale && (
            <span className="inline-flex items-center gap-1 bg-white border border-slate-200 text-[#001f3e] px-2.5 py-1 rounded-md shadow-xs font-semibold">
              Scale: {selectedPayScale}
              <button onClick={() => setSelectedPayScale('')} className="hover:text-red-600"><X className="w-3 h-3" /></button>
            </span>
          )}

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-[#0051d5] hover:underline font-bold text-xs ml-1 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Clear All Filters
            </button>
          )}

          {!hasActiveFilters && (
            <span className="text-slate-500 italic">Showing all active government notices pan-India</span>
          )}
        </div>

        {/* View Switcher & Sorting */}
        <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-semibold text-slate-600">Sort By:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-200 text-[#001f3e] text-xs font-semibold py-1.5 px-3 rounded-lg shadow-xs focus:outline-none"
            >
              <option value="closing-earliest">Closing Date (Earliest First)</option>
              <option value="latest-posted">Newest Notification</option>
              <option value="vacancies-high">Total Vacancies (High to Low)</option>
            </select>
          </div>

          <div className="flex items-center bg-white border border-slate-200 p-0.5 rounded-lg shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded ${viewMode === 'cards' ? 'bg-[#001f3e] text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="Detailed Cards"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-[#001f3e] text-white' : 'text-slate-500 hover:text-slate-900'}`}
              title="Compact Table"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar Filters + Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT SIDEBAR: Faceted Filters */}
        <aside className="lg:col-span-4 xl:col-span-3 space-y-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 space-y-5 sticky top-32">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#001f3e]" />
                <h3 className="font-bold text-sm text-[#001f3e]">Refine Vacancies</h3>
              </div>
              <button
                onClick={clearAllFilters}
                className="text-xs text-slate-500 hover:text-red-600 underline"
              >
                Reset
              </button>
            </div>

            {/* Filter: Recruitment Authority */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Recruitment Board
              </span>
              <div className="space-y-1.5">
                {[
                  { label: 'UPSC (Civil/Def)', val: 'UPSC', count: 2 },
                  { label: 'Staff Selection (SSC)', val: 'SSC', count: 2 },
                  { label: 'Railways (RRB / RRC)', val: 'Railways', count: 1 },
                  { label: 'Banking & IBPS', val: 'Banking and Financial Institutions', count: 1 },
                  { label: 'Defence organizations', val: 'Defence organizations', count: 2 },
                  { label: 'State PSCs', val: 'State Public Service Commissions', count: 2 },
                  { label: 'Healthcare & AIIMS', val: 'Healthcare', count: 1 },
                  { label: 'Teaching & Schools', val: 'Teaching', count: 1 },
                  { label: 'PSUs & Maharatna', val: 'PSUs', count: 1 },
                ].map((b) => (
                  <label
                    key={b.val}
                    className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-slate-700">
                      <input
                        type="radio"
                        name="board"
                        checked={selectedCategory === b.val}
                        onChange={() => {
                          setSelectedCategory(selectedCategory === b.val ? '' : b.val);
                          setCurrentPage(1);
                        }}
                        className="text-[#0051d5]"
                      />
                      <span>{b.label}</span>
                    </span>
                    <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-semibold">
                      {b.count}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Filter: Min Qualification */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Min Qualification
              </span>
              <div className="space-y-1.5">
                {[
                  { label: "Bachelor's (Any Stream)", val: 'Bachelor' },
                  { label: 'B.E. / B.Tech (Engg)', val: 'B.Tech' },
                  { label: '10th / Matriculation', val: '10th' },
                  { label: '12th / Intermediate', val: '12th' },
                  { label: 'Diploma / ITI Cert', val: 'Diploma' },
                  { label: 'Post Graduate / Masters', val: 'Post Graduate' },
                  { label: 'MBBS / Nursing', val: 'Nursing' },
                ].map((q) => (
                  <label
                    key={q.val}
                    className="flex items-center justify-between p-1.5 hover:bg-slate-50 rounded cursor-pointer"
                  >
                    <span className="flex items-center gap-2 text-slate-700">
                      <input
                        type="radio"
                        name="qual"
                        checked={selectedQualification === q.val}
                        onChange={() => {
                          setSelectedQualification(selectedQualification === q.val ? '' : q.val);
                          setCurrentPage(1);
                        }}
                        className="text-[#0051d5]"
                      />
                      <span>{q.label}</span>
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Filter: 7th CPC Pay Matrix */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Pay Matrix (7th CPC)
              </span>
              <div className="space-y-1.5">
                {['Level 10+', 'Level 7-9', 'Level 4-6', 'Level 1-3'].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-700">
                    <input
                      type="radio"
                      name="payscale"
                      checked={selectedPayScale === lvl}
                      onChange={() => {
                        setSelectedPayScale(selectedPayScale === lvl ? '' : lvl);
                        setCurrentPage(1);
                      }}
                      className="text-[#0051d5]"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100"></div>

            {/* Filter: Closing Timeline / Urgency */}
            <div className="space-y-2 text-xs">
              <span className="font-bold uppercase tracking-wider text-slate-500 block">
                Application Status
              </span>
              <div className="space-y-1.5">
                <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-700">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === ''}
                    onChange={() => setSelectedStatus('')}
                    className="text-[#0051d5]"
                  />
                  <span>All Postings</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-red-600 font-semibold">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === 'closing-soon'}
                    onChange={() => setSelectedStatus('closing-soon')}
                    className="text-[#0051d5]"
                  />
                  <span>Closing Soon (&lt;7 Days)</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-emerald-700 font-medium">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === 'active'}
                    onChange={() => setSelectedStatus('active')}
                    className="text-[#0051d5]"
                  />
                  <span>Open & Active</span>
                </label>
                <label className="flex items-center gap-2 p-1.5 hover:bg-slate-50 rounded cursor-pointer text-slate-500">
                  <input
                    type="radio"
                    name="status"
                    checked={selectedStatus === 'expired'}
                    onChange={() => setSelectedStatus('expired')}
                    className="text-[#0051d5]"
                  />
                  <span>Expired Archive</span>
                </label>
              </div>
            </div>

            {/* Anti-fraud advisory */}
            <div className="p-3 bg-[#f8f9ff] border border-slate-200 rounded-lg text-xs space-y-1">
              <span className="font-bold text-[#0051d5] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Anti-Fraud Protection
              </span>
              <p className="text-[11px] text-slate-500 leading-tight">
                Bharat Career Hub does not collect candidate application fees. Application actions transfer strictly to authenticated official government servers.
              </p>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: Results */}
        <section className="lg:col-span-8 xl:col-span-9 space-y-4">
          
          {filteredJobs.length === 0 ? (
            <div className="bg-white rounded-xl p-12 text-center border border-slate-200 space-y-3">
              <Clock className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-[#001f3e]">
                No recruitments match your current filters
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your board, qualification, or deadline constraints to view more notifications.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-4 py-2 bg-[#001f3e] text-white text-xs font-bold rounded-lg hover:bg-[#12345a]"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'cards' ? (
            /* Detailed Cards View */
            <div className="space-y-4">
              {paginatedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenPdfModal={onOpenPdfModal}
                  onOpenApplyModal={onOpenApplyModal}
                />
              ))}
            </div>
          ) : (
            /* Compact Table View */
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#eff4ff] text-[#001f3e] font-bold border-b border-[#d3e4fe]">
                  <tr>
                    <th className="p-3.5">Recruitment Notice</th>
                    <th className="p-3.5">Board / Org</th>
                    <th className="p-3.5">Vacancies</th>
                    <th className="p-3.5">Min Qualification</th>
                    <th className="p-3.5">Pay Scale</th>
                    <th className="p-3.5">Deadline</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {paginatedJobs.map((job) => {
                    const isSaved = savedJobIds.includes(job.id);
                    return (
                      <tr key={job.id} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 max-w-xs">
                          <Link to={`/jobs/${job.id}`} className="font-bold text-[#001f3e] hover:text-[#0051d5] block leading-snug">
                            {job.title}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400">
                            {job.advtNumber || job.id}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 font-medium">
                          {job.organization}
                        </td>
                        <td className="p-3.5 font-bold text-[#001f3e] font-mono">
                          {job.vacancies.toLocaleString()}
                        </td>
                        <td className="p-3.5 text-slate-600 max-w-[150px] truncate" title={job.qualification}>
                          {job.qualification}
                        </td>
                        <td className="p-3.5 text-slate-600 truncate max-w-[120px]">
                          {job.salary}
                        </td>
                        <td className="p-3.5 text-slate-600 font-mono text-[11px]">
                          {new Date(job.applicationEndDate).toLocaleDateString('en-GB')}
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => toggleSaveJob(job.id)}
                              className={`p-1.5 rounded hover:bg-slate-100 ${isSaved ? 'text-amber-600' : 'text-slate-400'}`}
                              title={isSaved ? 'Saved' : 'Save'}
                            >
                              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                            </button>
                            <button
                              onClick={() => onOpenApplyModal(job)}
                              className="px-2.5 py-1 bg-[#001f3e] text-white rounded font-bold hover:bg-[#12345a] flex items-center gap-1"
                            >
                              <span>Apply</span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredJobs.length > itemsPerPage && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <span className="text-slate-500 font-mono">
                Showing <strong>{(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredJobs.length)}</strong> of <strong>{filteredJobs.length}</strong> recruitments
              </span>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  <ChevronLeft className="w-4 h-4" /> Prev
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    onClick={() => setCurrentPage(pg)}
                    className={`w-8 h-8 rounded-lg font-bold ${
                      currentPage === pg 
                        ? 'bg-[#001f3e] text-white' 
                        : 'border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pg}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

        </section>

      </div>
    </div>
  );
};
