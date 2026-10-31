import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Search, 
  Bell, 
  Bookmark, 
  ShieldAlert, 
  User, 
  ChevronDown, 
  LogOut, 
  Sliders, 
  Sparkles,
  Menu,
  X,
  Smartphone
} from 'lucide-react';

interface NavbarProps {
  onOpenAlerts?: () => void;
  onOpenCalculator?: () => void;
  onOpenCron?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  onOpenAlerts, 
  onOpenCalculator,
  onOpenCron,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    user, 
    isAdmin, 
    dbSyncStatus,
    savedJobIds, 
    textScale, 
    setTextScale, 
    language, 
    setLanguage, 
    logout 
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/jobs?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/jobs');
    }
  };

  const navLinks = [
    { label: 'All Jobs', path: '/jobs' },
    { label: 'Departments & Ministries', path: '/departments' },
    { label: 'State Jobs', path: '/states' },
    { label: 'Exam Calendar', path: '/calendar' },
    { label: 'Learning & Support', path: '/learning-support' },
    { label: 'About & Contact', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 shadow-[0_1px_8px_rgba(0,0,0,0.06)] bg-white">
      {/* Top Civic Verification Bar */}
      <div className="bg-[#eff4ff] border-b border-[#d3e4fe]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-9 flex items-center justify-between text-xs font-semibold text-[#43474e]">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0051d5] animate-pulse"></span>
              <span className="text-[#0b1c30] uppercase tracking-wider font-bold text-[11px]">Official Aggregator</span>
            </div>
            <span className="text-[#c3c6cf]">|</span>
            <span className="hidden sm:inline text-[#43474e]">Govt of India Jobs Aggregator & Notification Portal</span>
            <span className="hidden lg:inline text-[#c3c6cf]">|</span>
            <span className="hidden lg:flex items-center gap-1 text-[#d98b00] font-mono text-[11px]">
              <span className="material-symbols-outlined text-xs">verified</span> Last Verified: Today, 08:30 AM IST
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* National Civic Helpline */}
            <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Toll-Free: 1800-11-2025
            </span>

            {/* National Cron Aggregator Button */}
            {onOpenCron && (
              <button
                type="button"
                onClick={onOpenCron}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#0051d5] hover:text-[#001f3e] bg-white px-2.5 py-0.5 rounded-full border border-blue-200 transition-colors shadow-2xs cursor-pointer"
                title="Automated National Job Crawler & Cron Engine"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Cron Aggregator</span>
              </button>
            )}

            {/* Subtle Admin Mode Indicator only when user is logged in as Admin */}
            {isAdmin && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                Admin Mode Active
              </span>
            )}

            <span className="text-[#c3c6cf]">|</span>

            {/* Accessibility text resize */}
            <div className="flex items-center gap-1 text-[#43474e]">
              <span className="text-[11px] font-semibold mr-0.5 hidden xs:inline">Text:</span>
              <button 
                onClick={() => setTextScale('sm')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'sm' ? 'bg-[#001f3e] text-white' : 'hover:bg-slate-200'}`}
                title="Decrease font size"
              >
                A-
              </button>
              <button 
                onClick={() => setTextScale('md')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'md' ? 'bg-[#001f3e] text-white' : 'hover:bg-slate-200'}`}
                title="Normal font size"
              >
                A
              </button>
              <button 
                onClick={() => setTextScale('lg')} 
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold ${textScale === 'lg' ? 'bg-[#001f3e] text-white' : 'hover:bg-slate-200'}`}
                title="Increase font size"
              >
                A+
              </button>
            </div>

            <span className="text-[#c3c6cf]">|</span>

            {/* Language Selector */}
            <div className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">language</span>
              <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value)} 
                className="bg-transparent text-[#0b1c30] text-[11px] font-semibold py-0.5 pr-1 rounded focus:outline-none cursor-pointer"
                aria-label="Portal Language"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
          
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img 
              alt="Bharat Career Hub Logo" 
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWIszKieVH5-VraysLm7DX5-2bG6aaITzvxXCfbYE_zB6jMN8nM1X9DeSbUKnBBy89m_rGOrjMg0LOFx7eUhFIU-q7M6QU_PzDQshlU5AVaAaVDn0gOJLO2payI-nFs4t2TkOWu8fS-2NhJGjl2G7yvFPXC2QL9WM1lupCjCI6MPZ9_yR9imkAC2uKygbHn8uMu8JR6zTN9VduqSJMSER7OdPBvxdQ-y8nl0xWzbuo9KAnANfQLww3A" 
            />
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight text-[#001f3e] leading-none">
                Bharat Career Hub
              </span>
              <span className="text-[11px] font-bold text-[#43474e] tracking-wider uppercase mt-1">
                Gateway to Public Careers
              </span>
            </div>
          </Link>

          {/* Search Box with Shortcut */}
          <form onSubmit={handleSearchSubmit} className="hidden xl:flex items-center max-w-xs w-full">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job, ministry, or post..." 
                type="text" 
                className="w-full pl-9 pr-14 py-2 bg-[#eff4ff] rounded-lg text-sm text-[#0b1c30] placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#0051d5] border border-transparent focus:border-[#0051d5] transition-all"
              />
              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 font-mono text-slate-400 bg-white/80 px-1.5 py-0.5 rounded text-[10px] border border-slate-200">
                ⌘K
              </span>
            </div>
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors ${
                    isActive 
                      ? 'bg-[#001f3e] text-white' 
                      : 'text-[#43474e] hover:bg-[#eff4ff] hover:text-[#001f3e]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            {/* Admin Dashboard link if user is Admin */}
            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3 py-2 text-sm font-bold rounded-lg transition-colors flex items-center gap-1 ${
                  location.pathname === '/admin'
                    ? 'bg-amber-600 text-white'
                    : 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Admin Suite
              </Link>
            )}
          </nav>

          {/* Actions & Candidate Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Alerts button */}
            <button 
              onClick={onOpenAlerts}
              type="button" 
              title="Job Alerts & Dispatch" 
              className="relative p-2 rounded-lg text-[#43474e] hover:bg-[#eff4ff] hover:text-[#001f3e] transition-colors"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a] ring-2 ring-white"></span>
            </button>

            {/* Saved Jobs Link */}
            <Link 
              to="/dashboard"
              title="Saved Recruitments" 
              className="relative p-2 rounded-lg text-[#43474e] hover:bg-[#eff4ff] hover:text-[#001f3e] transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              {savedJobIds.length > 0 && (
                <span className="absolute -top-1 -right-1 font-mono text-[10px] bg-[#0051d5] text-white font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {savedJobIds.length}
                </span>
              )}
            </Link>

            {/* Candidate Portal / User Account Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  type="button"
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg bg-[#eff4ff] hover:bg-[#dce9ff] transition-colors cursor-pointer text-left border border-[#d3e4fe]"
                >
                  <img 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover border border-[#0051d5]" 
                    src={user.avatarUrl} 
                  />
                  <div className="hidden md:flex flex-col">
                    <span className="text-xs font-bold text-[#0b1c30] leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold leading-none flex items-center gap-0.5">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Aadhaar Verified
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-sm font-bold text-[#001f3e]">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <div className="mt-1 flex gap-1">
                        {user.isAdmin && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            Portal Administrator
                          </span>
                        )}
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                          OTR Synced
                        </span>
                      </div>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowUserMenu(false)}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Candidate Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-2 text-left text-sm hover:bg-amber-50 flex items-center gap-2 text-amber-900 font-semibold"
                      >
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        Admin Dashboard
                      </Link>
                    )}

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setShowUserMenu(false);
                        }}
                        type="button"
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link 
                to="/auth"
                className="inline-flex items-center justify-center px-4 py-2 bg-[#0051d5] text-white text-sm font-bold rounded-lg shadow-sm hover:bg-[#316bf3] transition-colors"
              >
                Sign In / Register
              </Link>
            )}

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search job or ministry..." 
              type="text" 
              className="w-full pl-9 pr-4 py-2 bg-[#eff4ff] rounded-lg text-sm"
            />
          </form>

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                  location.pathname === link.path ? 'bg-[#001f3e] text-white' : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-bold text-amber-700 bg-amber-50"
              >
                Admin Suite
              </Link>
            )}
            
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Candidate Dashboard ({savedJobIds.length} Saved)
            </Link>

            {!user ? (
              <div className="pt-3 border-t border-slate-100">
                <Link
                  to="/auth"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full py-2.5 bg-[#0051d5] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-xs"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Sign In with Mobile OTP</span>
                </Link>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-2">
                  <img src={user.avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover border border-slate-200" />
                  <div className="flex flex-col">
                    <span className="font-bold text-[#001f3e] truncate max-w-[150px]">{user.fullName}</span>
                    <span className="text-[10px] text-slate-500">{user.phoneNumber || user.email}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="text-red-600 font-bold hover:underline py-1 px-2 text-xs"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
