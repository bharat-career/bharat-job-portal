import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import { Building2, Search, ArrowRight, ShieldCheck, Users, Briefcase, ExternalLink } from 'lucide-react';

export const DepartmentDirectoryPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const allJobs = JobService.getJobs();

  const directories = [
    {
      category: 'Constitutional & Central Commissions',
      items: [
        { name: 'Union Public Service Commission (UPSC)', desc: 'Premier selection body for Central Civil Services, IAS, IPS, IFS, NDA & Combined Defence Services.', category: 'UPSC', portalUrl: 'https://upsc.gov.in' },
        { name: 'Staff Selection Commission (SSC)', desc: 'Conducts examinations for Group B and C non-technical posts across all Union Ministries.', category: 'SSC', portalUrl: 'https://ssc.gov.in' },
      ],
    },
    {
      category: 'Defence, Police & National Security',
      items: [
        { name: 'Indian Army & National Defence Academy', desc: 'Direct commission entries, Technical Graduate Courses, and CDS entries.', category: 'Army', portalUrl: 'https://joinindianarmy.nic.in' },
        { name: 'Indian Navy Personnel Directorate', desc: 'Short Service Commission (SSC) and Permanent Commission Officer recruitments.', category: 'Navy', portalUrl: 'https://joinindiannavy.gov.in' },
        { name: 'Defence Research and Development Organisation (DRDO)', desc: 'CEPTAM scientific research engineers and technical cadre appointments.', category: 'Defence organizations', portalUrl: 'https://drdo.gov.in' },
        { name: 'Central Armed Police Forces (BSF, CISF, CRPF, ITBP)', desc: 'Sub-Inspector and Assistant Commandant recruitments under MHA.', category: 'Police and Paramilitary', portalUrl: 'https://ssc.gov.in' },
      ],
    },
    {
      category: 'Railways & Public Sector Undertakings',
      items: [
        { name: 'Railway Recruitment Boards (RRB)', desc: '21 Zonal boards conducting CEN for Assistant Loco Pilots, Technicians, NTPC, and JE.', category: 'Railways', portalUrl: 'https://rrbapply.gov.in' },
        { name: 'Oil and Natural Gas Corporation (ONGC)', desc: 'Maharatna PSU engineering and geosciences executive recruitments.', category: 'PSUs', portalUrl: 'https://ongcindia.com' },
      ],
    },
    {
      category: 'Banking & Financial Institutions',
      items: [
        { name: 'State Bank of India (SBI)', desc: 'Countrywide recruitment for Probationary Officers (PO), Clerks, and Specialist Cadre Officers.', category: 'Banking and Financial Institutions', portalUrl: 'https://sbi.co.in' },
        { name: 'Institute of Banking Personnel Selection (IBPS)', desc: 'Common recruitment processes for 11 participating Public Sector Banks.', category: 'Banking and Financial Institutions', portalUrl: 'https://ibps.in' },
      ],
    },
    {
      category: 'Science, Healthcare & Academia',
      items: [
        { name: 'Indian Space Research Organisation (ISRO)', desc: 'Scientist/Engineer SC recruitments across VSSC, URSC, SAC, and IPRC space centres.', category: 'Research organizations', portalUrl: 'https://isro.gov.in' },
        { name: 'All India Institute of Medical Sciences (AIIMS)', desc: 'Centralized NORCET nursing, medical faculty, and paramedical officer selections.', category: 'Healthcare', portalUrl: 'https://aiimsexams.ac.in' },
        { name: 'Kendriya Vidyalaya Sangathan (KVS)', desc: 'Direct selection of Post Graduate Teachers (PGT), TGT, and Primary Teachers nationwide.', category: 'Teaching', portalUrl: 'https://kvsangathan.nic.in' },
      ],
    },
    {
      category: 'Judicial & Law Administration',
      items: [
        { name: 'Delhi Judicial Service & District Courts', desc: 'Civil Judge Junior Division and Metropolitan Magistrate competitive examinations.', category: 'Judiciary', portalUrl: 'https://delhihighcourt.nic.in' },
      ],
    },
  ];

  // Calculate vacancies dynamically per category
  const getVacanciesForCategory = (cat: string) => {
    return allJobs
      .filter((j) => j.category === cat || j.organization.toLowerCase().includes(cat.toLowerCase()))
      .reduce((sum, j) => sum + j.vacancies, 0);
  };

  return (
    <div className="space-y-6">
      {/* Title & Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001f3e]">
            Government Departments & Recruitment Commissions Directory
          </h1>
          <p className="text-xs text-[#43474e]">
            Authoritative directory of issuing boards, ministries, and central commissions across India.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ministry or commission..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
          />
        </div>
      </div>

      {/* Directory Sections */}
      <div className="space-y-8">
        {directories.map((group) => {
          const filteredItems = group.items.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.desc.toLowerCase().includes(search.toLowerCase())
          );

          if (filteredItems.length === 0) return null;

          return (
            <div key={group.category} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-[#001f3e] flex items-center gap-2 border-b border-slate-200 pb-2">
                <Building2 className="w-4 h-4 text-[#0051d5]" />
                {group.category}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredItems.map((item) => {
                  const vacCount = getVacanciesForCategory(item.category);
                  return (
                    <div
                      key={item.name}
                      className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-mono font-bold bg-[#eff4ff] text-[#0051d5] px-2 py-0.5 rounded border border-[#d3e4fe]">
                            {item.category}
                          </span>
                          <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {vacCount > 0 ? `${vacCount.toLocaleString()} Active Vacancies` : 'Ongoing Gazette Window'}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-[#001f3e]">
                          {item.name}
                        </h3>

                        <p className="text-xs text-[#43474e] leading-relaxed">
                          {item.desc}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                        <a
                          href={item.portalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-500 hover:text-[#001f3e] font-semibold flex items-center gap-1"
                        >
                          <span>Official Portal</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <Link
                          to={`/jobs?category=${encodeURIComponent(item.category)}`}
                          className="px-3.5 py-1.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-lg flex items-center gap-1.5 shadow-sm"
                        >
                          <span>Browse Vacancies</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
