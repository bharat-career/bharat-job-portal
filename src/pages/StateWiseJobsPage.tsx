import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import { MapPin, Search, ArrowRight, ExternalLink, ShieldCheck, Users } from 'lucide-react';

export const StateWiseJobsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const allJobs = JobService.getJobs();

  const statesData = [
    { state: 'Uttar Pradesh', commission: 'UPPSC & UPSSSC', capital: 'Lucknow', pscUrl: 'https://uppsc.up.nic.in', activePosts: 420 },
    { state: 'Bihar', commission: 'BPSC & BSSC', capital: 'Patna', pscUrl: 'https://bpsc.bih.nic.in', activePosts: 1957 },
    { state: 'Maharashtra', commission: 'MPSC', capital: 'Mumbai', pscUrl: 'https://mpsc.gov.in', activePosts: 860 },
    { state: 'Delhi (NCT)', commission: 'DSSSB', capital: 'New Delhi', pscUrl: 'https://dsssb.delhi.gov.in', activePosts: 4187 },
    { state: 'Rajasthan', commission: 'RPSC & RSMSSB', capital: 'Jaipur', pscUrl: 'https://rpsc.rajasthan.gov.in', activePosts: 640 },
    { state: 'Madhya Pradesh', commission: 'MPPSC & MPESB', capital: 'Bhopal', pscUrl: 'https://mppsc.mp.gov.in', activePosts: 512 },
    { state: 'West Bengal', commission: 'WBPSC & WBPRB', capital: 'Kolkata', pscUrl: 'https://psc.wb.gov.in', activePosts: 730 },
    { state: 'Karnataka', commission: 'KPSC & KEA', capital: 'Bengaluru', pscUrl: 'https://kpsc.kar.nic.in', activePosts: 490 },
    { state: 'Tamil Nadu', commission: 'TNPSC & MRB', capital: 'Chennai', pscUrl: 'https://tnpsc.gov.in', activePosts: 810 },
    { state: 'Gujarat', commission: 'GPSC & GSSSB', capital: 'Gandhinagar', pscUrl: 'https://gpsc.gujarat.gov.in', activePosts: 380 },
    { state: 'Telangana', commission: 'TGPSC', capital: 'Hyderabad', pscUrl: 'https://tspsc.gov.in', activePosts: 650 },
    { state: 'Andhra Pradesh', commission: 'APPSC', capital: 'Amaravati', pscUrl: 'https://psc.ap.gov.in', activePosts: 430 },
    { state: 'Odisha', commission: 'OPSC & OSSSC', capital: 'Bhubaneswar', pscUrl: 'https://opsc.gov.in', activePosts: 540 },
    { state: 'Punjab', commission: 'PPSC & SSSB Punjab', capital: 'Chandigarh', pscUrl: 'https://ppsc.gov.in', activePosts: 320 },
    { state: 'Haryana', commission: 'HPSC & HSSC', capital: 'Chandigarh', pscUrl: 'https://hpsc.gov.in', activePosts: 610 },
    { state: 'Kerala', commission: 'Kerala PSC', capital: 'Thiruvananthapuram', pscUrl: 'https://keralapsc.gov.in', activePosts: 920 },
    { state: 'Assam', commission: 'APSC', capital: 'Dispur', pscUrl: 'https://apsc.nic.in', activePosts: 470 },
    { state: 'Jharkhand', commission: 'JPSC & JSSC', capital: 'Ranchi', pscUrl: 'https://jpsc.gov.in', activePosts: 390 },
    { state: 'Uttarakhand', commission: 'UKPSC & UKSSSC', capital: 'Dehradun', pscUrl: 'https://psc.uk.gov.in', activePosts: 280 },
    { state: 'Himachal Pradesh', commission: 'HPPSC', capital: 'Shimla', pscUrl: 'https://hppsc.hp.gov.in', activePosts: 210 },
  ];

  const filteredStates = statesData.filter(
    (s) =>
      s.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.commission.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.capital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001f3e]">
            State-Wise Public Service Commission Recruitments
          </h1>
          <p className="text-xs text-[#43474e]">
            Comprehensive index of State Civil Services, Subordinate Selection Boards, Police, and Judicial vacancies.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search state or PSC..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
          />
        </div>
      </div>

      {/* Grid of States */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStates.map((st) => (
          <div
            key={st.state}
            className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold bg-[#eff4ff] text-[#0051d5] px-2 py-0.5 rounded border border-[#d3e4fe]">
                  {st.commission}
                </span>
                <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {st.activePosts.toLocaleString()} Posts
                </span>
              </div>

              <h3 className="text-lg font-bold text-[#001f3e] group-hover:text-[#0051d5] transition-colors flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-slate-400" />
                {st.state}
              </h3>

              <p className="text-xs text-slate-500">
                Administrative HQ: <strong>{st.capital}</strong>
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <a
                href={st.pscUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-[#001f3e] flex items-center gap-1"
                title="Open State Commission Portal"
              >
                <span>Official PSC</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <Link
                to={`/jobs?location=${encodeURIComponent(st.state)}`}
                className="px-3 py-1.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-lg flex items-center gap-1 text-[11px] shadow-sm"
              >
                <span>View Jobs</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
