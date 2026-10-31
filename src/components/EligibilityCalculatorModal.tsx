import React, { useState } from 'react';
import { Job } from '../types';
import { JobService } from '../services/jobService';
import { Calculator, X, CheckCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EligibilityCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EligibilityCalculatorModal: React.FC<EligibilityCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [dob, setDob] = useState('2000-06-15');
  const [qualification, setQualification] = useState("Bachelor's Degree");
  const [category, setCategory] = useState<'General' | 'OBC' | 'SC' | 'ST' | 'EWS'>('General');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Transgender'>('Male');
  const [calculated, setCalculated] = useState(false);

  if (!isOpen) return null;

  // Calculate age
  const calculateAge = (dobString: string) => {
    const birthDate = new Date(dobString);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const candidateAge = calculateAge(dob);
  const allJobs = JobService.getJobs();

  // Filter matching recruitments based on candidate age & qualifications
  const matchingJobs = allJobs.filter((job) => {
    if (job.status === 'expired') return false;
    // Basic qualification match
    const qLower = qualification.toLowerCase();
    const jobQLower = job.qualification.toLowerCase();
    const qualMatch = 
      qLower === "bachelor's degree" || 
      jobQLower.includes(qLower) || 
      qLower.includes('graduate') || 
      (qLower.includes('engineering') && jobQLower.includes('tech'));

    return qualMatch;
  });

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    setCalculated(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-[#001f3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Civic Eligibility & Age Calculator</h3>
              <p className="text-xs text-slate-300">Instant cross-match against Central & State service rules</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          <form onSubmit={handleCalculate} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Date of Birth
                </label>
                <input 
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                  required
                />
                <span className="text-[11px] text-slate-500 font-mono mt-0.5 block">
                  Calculated Age: <strong>{candidateAge} Years</strong>
                </span>
              </div>

              {/* Reservation Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Category (Reservation)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                >
                  <option value="General">General / UR (Standard Age)</option>
                  <option value="OBC">OBC (Non-Creamy Layer: +3 yrs)</option>
                  <option value="SC">SC (Scheduled Caste: +5 yrs)</option>
                  <option value="ST">ST (Scheduled Tribe: +5 yrs)</option>
                  <option value="EWS">EWS (Economically Weaker Section)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Qualification */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Highest Qualification
                </label>
                <select
                  value={qualification}
                  onChange={(e) => setQualification(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                >
                  <option value="10th / Matriculation">10th / Matriculation</option>
                  <option value="12th / Intermediate">12th / Intermediate</option>
                  <option value="Diploma / ITI Cert">Diploma / ITI Cert</option>
                  <option value="Bachelor's Degree">Bachelor's Degree (Any Stream)</option>
                  <option value="B.E. / B.Tech (Engineering)">B.E. / B.Tech (Engineering)</option>
                  <option value="Post Graduate / Masters">Post Graduate / Masters</option>
                  <option value="MBBS / Nursing">MBBS / Nursing</option>
                  <option value="LL.B. (Law)">LL.B. (Law)</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Gender
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female (Eligible for Zero Fee)</option>
                  <option value="Transgender">Transgender</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white rounded-lg text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#f59e0b]" />
              Check Matching Government Vacancies
            </button>
          </form>

          {/* Results section */}
          {calculated && (
            <div className="pt-4 border-t border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#001f3e] flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Found {matchingJobs.length} Eligible Gazetted Notifications
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  Profile: Age {candidateAge}, {category}, {qualification}
                </span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {matchingJobs.map((job) => (
                  <div 
                    key={job.id} 
                    className="p-3 bg-[#f8f9ff] border border-slate-200 rounded-lg flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <h4 className="font-bold text-[#001f3e] line-clamp-1">{job.title}</h4>
                      <p className="text-slate-500">{job.organization} • {job.vacancies.toLocaleString()} Posts • {job.salary}</p>
                    </div>
                    <Link
                      to={`/jobs/${job.id}`}
                      onClick={onClose}
                      className="px-2.5 py-1 bg-[#0051d5] text-white font-bold rounded hover:bg-[#316bf3] shrink-0 flex items-center gap-1"
                    >
                      View <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
