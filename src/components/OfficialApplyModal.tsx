import React from 'react';
import { Job } from '../types';
import { ShieldCheck, ShieldAlert, ExternalLink, X, CheckCircle, ArrowRight } from 'lucide-react';

interface OfficialApplyModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const OfficialApplyModal: React.FC<OfficialApplyModalProps> = ({ job, isOpen, onClose }) => {
  if (!isOpen || !job) return null;

  const urlObj = new URL(job.officialApplicationUrl);
  const hostname = urlObj.hostname;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Official Gateway Transfer</h3>
              <p className="text-xs text-slate-300">Verified Direct Commission Routing</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div>
            <span className="text-[11px] uppercase font-bold text-slate-400 tracking-wider">
              Target Government Authority
            </span>
            <h4 className="text-base font-bold text-[#001f3e] mt-0.5">
              {job.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium">
              Issuing Board: {job.organization} ({job.department})
            </p>
          </div>

          {/* Verification Badge Box */}
          <div className="bg-[#eff4ff] border border-[#d3e4fe] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#001f3e] flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Authenticated Domain
              </span>
              <span className="font-mono text-xs bg-white px-2 py-0.5 rounded text-[#0051d5] font-bold border border-slate-200">
                {hostname}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              You are being securely directed to the official server of the Government of India / State Commission. All candidate registration, OTR verification, and fee submissions occur directly on this authorized host.
            </p>
          </div>

          {/* Anti-Fraud Guidelines */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-950">
              <ShieldAlert className="w-4 h-4 text-amber-600" /> Anti-Fraud Candidate Warning
            </div>
            <ul className="list-disc pl-4 space-y-1 text-slate-700">
              <li>Bharat Career Hub never asks for debit/credit card numbers or OTPs.</li>
              <li>Only pay application fees on the designated government payment gateway (e.g. SBI e-Pay, Bharatkosh).</li>
              <li>Ensure your One Time Registration (OTR) profile matches your Matriculation certificate.</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={onClose}
              type="button"
              className="px-4 py-2.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <a
              href={job.officialApplicationUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#001f3e] hover:bg-[#12345a] text-white text-xs font-bold flex items-center gap-2 shadow-md transition-all hover:gap-3"
            >
              <span>Proceed to {hostname}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
