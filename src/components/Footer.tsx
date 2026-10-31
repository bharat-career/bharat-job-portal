import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ShieldAlert, Award, FileText, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#ffffff] border-t border-slate-200 mt-16 shadow-[0_-1px_8px_rgba(0,0,0,0.02)]">
      {/* Civic Authenticity Linear Accent (Tricolor) */}
      <div className="w-full h-1 bg-gradient-to-r from-[#f59e0b] via-white to-[#15803d]"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                alt="Bharat Career Hub Logo" 
                className="h-8 w-auto object-contain" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWIszKieVH5-VraysLm7DX5-2bG6aaITzvxXCfbYE_zB6jMN8nM1X9DeSbUKnBBy89m_rGOrjMg0LOFx7eUhFIU-q7M6QU_PzDQshlU5AVaAaVDn0gOJLO2payI-nFs4t2TkOWu8fS-2NhJGjl2G7yvFPXC2QL9WM1lupCjCI6MPZ9_yR9imkAC2uKygbHn8uMu8JR6zTN9VduqSJMSER7OdPBvxdQ-y8nl0xWzbuo9KAnANfQLww3A" 
              />
              <span className="font-bold text-xl text-[#001f3e]">
                Bharat Career Hub
              </span>
            </div>

            <p className="text-sm text-[#43474e] leading-relaxed max-w-sm">
              Unified public sector job recruitment tracking and career intelligence portal. Aggregating authorized notifications across Union Ministries, State Public Service Commissions, Railways, and Defence Boards.
            </p>

            <div className="flex items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#eff4ff] border border-[#d3e4fe] rounded-full text-[#0b1c30] text-xs font-semibold">
                <ShieldCheck className="w-4 h-4 text-[#0051d5]" />
                100% Verified Gazette Feeds
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-900 text-xs font-semibold">
                Demonstration MVP
              </span>
            </div>
          </div>

          {/* Column 2: Recruitment Boards */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#001f3e]">
              Recruitment Boards
            </h3>
            <ul className="space-y-2 text-sm text-[#43474e]">
              <li><Link to="/jobs?category=UPSC" className="hover:text-[#0051d5] transition-colors">UPSC Notifications</Link></li>
              <li><Link to="/jobs?category=SSC" className="hover:text-[#0051d5] transition-colors">SSC Examinations</Link></li>
              <li><Link to="/jobs?category=Banking%20and%20Financial%20Institutions" className="hover:text-[#0051d5] transition-colors">IBPS & Public Sector Banks</Link></li>
              <li><Link to="/jobs?category=Railways" className="hover:text-[#0051d5] transition-colors">Indian Railways (RRB / RRC)</Link></li>
              <li><Link to="/jobs?category=Army" className="hover:text-[#0051d5] transition-colors">Defence & Paramilitary Forces</Link></li>
              <li><Link to="/states" className="hover:text-[#0051d5] transition-colors">State PSC Portals</Link></li>
            </ul>
          </div>

          {/* Column 3: Candidate Services */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#001f3e]">
              Candidate Services
            </h3>
            <ul className="space-y-2 text-sm text-[#43474e]">
              <li><Link to="/learning-support" className="text-[#0051d5] font-bold hover:underline transition-colors flex items-center gap-1">★ Learning & Support Hub</Link></li>
              <li><Link to="/calendar" className="hover:text-[#0051d5] transition-colors">Examination Calendar</Link></li>
              <li><Link to="/departments" className="hover:text-[#0051d5] transition-colors">Department Directory</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#0051d5] transition-colors">Saved Job Tracker</Link></li>
              <li><Link to="/jobs?status=closing-soon" className="hover:text-[#0051d5] transition-colors">Closing in 48 Hours</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Eligibility Calculator Guide</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Reservation Matrix Guidelines</Link></li>
            </ul>
          </div>

          {/* Column 4: Disclaimers & Statutory */}
          <div className="space-y-3">
            <h3 className="font-bold text-sm uppercase tracking-wider text-[#001f3e]">
              Disclaimers & Help
            </h3>
            <ul className="space-y-2 text-sm text-[#43474e]">
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Gazette Citation Policy</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">RTI Statutory Notices</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Accessibility Statement</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Grievance Redressal Officer</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Terms & Privacy Policy</Link></li>
              <li><Link to="/about" className="hover:text-[#0051d5] transition-colors">Helpdesk & Contact</Link></li>
            </ul>
          </div>

        </div>

        {/* Statutory Civic Warning Banner */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs text-[#43474e]">
          <div className="flex items-start gap-2 max-w-3xl">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              <strong className="text-[#001f3e]">Statutory Anti-Fraud Notice:</strong> Bharat Career Hub is an informational civic public data platform. All notifications are mapped to gazetted circulars of official .gov.in and .nic.in portals. Bharat Career Hub does not collect candidate application fees. All application actions transfer strictly to authenticated official government servers.
            </p>
          </div>
          <div className="font-mono shrink-0 text-slate-500">
            © {new Date().getFullYear()} Bharat Career Hub
          </div>
        </div>
      </div>
    </footer>
  );
};
