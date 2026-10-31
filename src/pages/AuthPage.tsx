import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Smartphone, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw,
  Sparkles,
  AlertCircle,
  Building2,
  FileCheck2
} from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { loginWithGoogle, loginWithMobile, loginWithDemo, user } = useAuth();

  // Tab State: 'mobile' | 'email' | 'admin'
  const [activeTab, setActiveTab] = useState<'mobile' | 'email' | 'admin'>('mobile');

  // Mobile Auth State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [candidateName, setCandidateName] = useState('');
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Email / OTR State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Admin Officer State
  const [adminPin, setAdminPin] = useState('');
  const [adminId, setAdminId] = useState('');

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpStep && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpStep, countdown]);

  // If already logged in, show status & redirect button
  if (user) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4 my-8">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-xl font-bold text-[#001f3e]">
          You are Signed In
        </h2>
        <p className="text-xs text-slate-600">
          Logged in as <strong>{user.fullName}</strong> {user.phoneNumber ? `(${user.phoneNumber})` : `(${user.email})`}.
        </p>
        {user.otrNumber && (
          <p className="text-xs font-mono bg-slate-100 text-slate-700 py-1 px-3 rounded-lg inline-block">
            OTR: {user.otrNumber}
          </p>
        )}
        <div className="flex gap-2 justify-center pt-2">
          <Link
            to="/dashboard"
            className="px-5 py-2.5 bg-[#001f3e] text-white text-xs font-bold rounded-lg hover:bg-[#12345a]"
          >
            Go to Candidate Dashboard
          </Link>
          {user.isAdmin && (
            <Link
              to="/admin"
              className="px-5 py-2.5 bg-amber-600 text-white text-xs font-bold rounded-lg hover:bg-amber-700"
            >
              Admin Dashboard
            </Link>
          )}
        </div>
      </div>
    );
  }

  // Handle Mobile OTP Request
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    const cleanNumber = phoneNumber.replace(/\D/g, '');

    if (cleanNumber.length !== 10) {
      setAuthError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpStep(true);
      setCountdown(30);
      setOtpValue('123456'); // Pre-fill / suggest standard test OTP for friction-free verification
    }, 600);
  };

  // Handle Mobile OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (otpValue.trim().length !== 6) {
      setAuthError('Please enter the 6-digit OTP code.');
      return;
    }

    setIsVerifying(true);
    try {
      await loginWithMobile(phoneNumber, candidateName || undefined, category);
      navigate('/dashboard');
    } catch (err: any) {
      setAuthError(err.message || 'Verification failed. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle Email / OTR submission
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter your email or OTR ID.');
      return;
    }
    loginWithDemo(false);
    navigate('/dashboard');
  };

  // Handle Admin PIN submission
  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '1947' || adminPin === 'admin' || adminPin === 'nic2025') {
      loginWithDemo(true);
      navigate('/admin');
    } else {
      setAuthError('Invalid Admin Access PIN. (Demo authorized PIN: 1947)');
    }
  };

  return (
    <div className="max-w-lg mx-auto my-6 space-y-6">
      {/* Civic Emblem & Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <img 
            alt="Bharat Career Hub Logo" 
            className="h-10 w-auto object-contain" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWIszKieVH5-VraysLm7DX5-2bG6aaITzvxXCfbYE_zB6jMN8nM1X9DeSbUKnBBy89m_rGOrjMg0LOFx7eUhFIU-q7M6QU_PzDQshlU5AVaAaVDn0gOJLO2payI-nFs4t2TkOWu8fS-2NhJGjl2G7yvFPXC2QL9WM1lupCjCI6MPZ9_yR9imkAC2uKygbHn8uMu8JR6zTN9VduqSJMSER7OdPBvxdQ-y8nl0xWzbuo9KAnANfQLww3A" 
          />
        </div>
        <h1 className="text-2xl font-bold text-[#001f3e]">
          Candidate Single Sign-On (SSO)
        </h1>
        <p className="text-xs text-[#43474e]">
          National Public Service Commission & Federal Recruitment Portal
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        
        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 text-xs font-bold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('mobile');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'mobile'
                ? 'border-[#0051d5] text-[#0051d5] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile OTP (Instant)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setAuthError(null);
            }}
            className={`flex-1 py-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'email'
                ? 'border-[#0051d5] text-[#0051d5] bg-blue-50/50'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>OTR / Email</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setAuthError(null);
            }}
            className={`py-3 px-3 text-center border-b-2 flex items-center justify-center gap-1.5 transition-colors ${
              activeTab === 'admin'
                ? 'border-amber-600 text-amber-700 bg-amber-50/50'
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
            title="Authorized Commission Officers & Portal Administrators"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Official Desk</span>
          </button>
        </div>

        {/* Error Alert */}
        {authError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{authError}</span>
          </div>
        )}

        {/* TAB 1: MOBILE OTP AUTHENTICATION */}
        {activeTab === 'mobile' && (
          <div className="space-y-4">
            {!otpStep ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Mobile Number
                  </label>
                  <div className="flex rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-[#0051d5] focus-within:border-transparent">
                    <span className="bg-slate-100 px-3 py-2.5 text-xs font-bold text-slate-700 flex items-center gap-1 border-r border-slate-300">
                      🇮🇳 +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                      placeholder="98765 43210"
                      className="w-full px-3 py-2 text-sm font-mono tracking-wider focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    We will send a 6-digit One Time Password (OTP) via SMS for verification.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Full Name (Optional for New OTR)
                  </label>
                  <input
                    type="text"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    placeholder="Candidate Name as per Matriculation Certificate"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Recruitment Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-[#0051d5] focus:outline-none bg-white"
                  >
                    <option value="General">General / Unreserved (UR)</option>
                    <option value="OBC">Other Backward Classes (OBC - Non Creamy)</option>
                    <option value="EWS">Economically Weaker Section (EWS)</option>
                    <option value="SC">Scheduled Caste (SC)</option>
                    <option value="ST">Scheduled Tribe (ST)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSendingOtp ? (
                    'Dispatching SMS OTP...'
                  ) : (
                    <>
                      <span>Get OTP via SMS</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">OTP Dispatched Successfully</p>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Sent to <strong>+91 {phoneNumber}</strong>.
                      <span className="text-emerald-700 font-mono font-bold block mt-0.5">
                        Test Demo OTP: 123456
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                    <span>Enter 6-Digit OTP</span>
                    <button
                      type="button"
                      onClick={() => setOtpStep(false)}
                      className="text-[11px] text-[#0051d5] font-normal hover:underline"
                    >
                      Change Number
                    </button>
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full px-3 py-2 text-center text-xl font-mono tracking-widest border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#0051d5] focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500">
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : 'Did not receive code?'}
                  </span>
                  <button
                    type="button"
                    disabled={countdown > 0}
                    onClick={() => {
                      setCountdown(30);
                      setOtpValue('123456');
                    }}
                    className="text-[#0051d5] font-bold disabled:text-slate-300 hover:underline"
                  >
                    Resend OTP
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isVerifying}
                  className="w-full py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? (
                    'Verifying Credentials...'
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify OTP & Sign In</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* Quick One-Click Candidate Sign In */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Instant Preview Testing:</span>
              <button
                type="button"
                onClick={() => {
                  loginWithDemo(false);
                  navigate('/dashboard');
                }}
                className="text-xs font-bold text-[#0051d5] hover:underline flex items-center gap-1"
              >
                <span>Instant Demo Candidate</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: EMAIL / OTR LOGIN */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Official Email / OTR Number
                </label>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. BHARAT-OTR-2025-9821 or candidate@email.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-xl text-xs shadow-sm transition-colors"
              >
                Sign In with Credentials
              </button>
            </form>

            <div className="flex items-center gap-3 text-slate-300 text-xs py-1">
              <div className="flex-1 h-px bg-slate-200"></div>
              <span className="text-slate-400 font-medium">or Google SSO</span>
              <div className="flex-1 h-px bg-slate-200"></div>
            </div>

            {/* Google Single Sign-On */}
            <button
              onClick={async () => {
                await loginWithGoogle();
                navigate('/dashboard');
              }}
              type="button"
              className="w-full py-2 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2.5 text-xs font-bold text-slate-700 shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Continue with Google Account</span>
            </button>
          </div>
        )}

        {/* TAB 3: OFFICIAL RECRUITMENT DESK / ADMIN */}
        {activeTab === 'admin' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Restricted Commission Officer Access</p>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Authorized officers with Department of Personnel (DoPT) or Commission NIC credentials only.
                </p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Commission Officer ID
                </label>
                <input
                  type="text"
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="e.g. NIC-GAZETTE-DESK-04"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                  <span>Administrative Security PIN</span>
                  <span className="text-[11px] text-amber-700 font-mono font-normal">Authorized PIN: 1947</span>
                </label>
                <input
                  type="password"
                  required
                  maxLength={6}
                  value={adminPin}
                  onChange={(e) => setAdminPin(e.target.value)}
                  placeholder="Enter 4-digit PIN"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-amber-500 focus:outline-none font-mono text-center tracking-widest"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Verify Officer PIN & Open Console</span>
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Statutory Security Seal */}
      <div className="text-center text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        <span>256-Bit SSL Encrypted • Government of India e-Governance Standards</span>
      </div>
    </div>
  );
};
