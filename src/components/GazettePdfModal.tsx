import React, { useState } from 'react';
import { Job } from '../types';
import { X, Download, ZoomIn, ZoomOut, ShieldCheck, Printer, FileText, CheckCircle2 } from 'lucide-react';

interface GazettePdfModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GazettePdfModal: React.FC<GazettePdfModalProps> = ({ job, isOpen, onClose }) => {
  const [zoom, setZoom] = useState(100);

  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1e293b] text-white rounded-2xl max-w-4xl w-full h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-slate-700">
        
        {/* PDF Reader Toolbar */}
        <div className="bg-[#0f172a] px-4 py-3 border-b border-slate-700 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="p-1.5 bg-red-500/20 text-red-400 rounded">
              <FileText className="w-5 h-5" />
            </div>
            <div className="truncate">
              <h3 className="text-sm font-bold truncate text-slate-100">
                {job.advtNumber || 'Official Gazette Circular'} — {job.title}
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {job.organization} • Ref: {job.gazetteRef || 'Govt Gazette Pt II Sec 3'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Zoom Controls */}
            <div className="hidden sm:flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700 text-xs">
              <button 
                onClick={() => setZoom(Math.max(70, zoom - 15))}
                className="p-1.5 hover:text-white text-slate-400"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="px-2 font-mono">{zoom}%</span>
              <button 
                onClick={() => setZoom(Math.min(150, zoom + 15))}
                className="p-1.5 hover:text-white text-slate-400"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
            </div>

            {/* Download Button */}
            <a
              href={job.officialNotificationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold flex items-center gap-1 transition-colors"
              title="Download Gazette Notification PDF"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PDF Reader Canvas Simulator */}
        <div className="flex-1 overflow-auto bg-[#334155] p-4 sm:p-8 flex justify-center items-start">
          <div 
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
            className="bg-white text-black w-full max-w-2xl min-h-[900px] p-8 sm:p-12 shadow-2xl rounded-sm transition-transform duration-150 relative font-serif"
          >
            {/* National Emblem & Gazette Heading */}
            <div className="text-center border-b-2 border-black pb-6 space-y-2">
              <div className="flex justify-center">
                <img 
                  alt="State Emblem of India" 
                  className="h-16 w-auto object-contain" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCeWIszKieVH5-VraysLm7DX5-2bG6aaITzvxXCfbYE_zB6jMN8nM1X9DeSbUKnBBy89m_rGOrjMg0LOFx7eUhFIU-q7M6QU_PzDQshlU5AVaAaVDn0gOJLO2payI-nFs4t2TkOWu8fS-2NhJGjl2G7yvFPXC2QL9WM1lupCjCI6MPZ9_yR9imkAC2uKygbHn8uMu8JR6zTN9VduqSJMSER7OdPBvxdQ-y8nl0xWzbuo9KAnANfQLww3A" 
                />
              </div>
              <h2 className="text-lg font-bold tracking-widest uppercase">
                The Gazette of India : Extraordinary
              </h2>
              <p className="text-xs uppercase tracking-wider font-sans text-slate-600">
                Published by Authority • New Delhi
              </p>
              <p className="text-xs font-mono font-semibold text-slate-800">
                {job.gazetteRef || 'Part II — Section 3 — Sub-section (i)'}
              </p>
            </div>

            {/* Document Header Metadata */}
            <div className="my-6 space-y-3 font-sans text-xs">
              <div className="flex justify-between items-center bg-slate-100 p-2.5 rounded font-mono">
                <span>NOTIF ID: {job.advtNumber || job.id}</span>
                <span>DATE: {new Date(job.applicationStartDate).toLocaleDateString('en-GB')}</span>
              </div>

              <div className="text-center pt-2">
                <h3 className="text-sm font-bold uppercase tracking-tight text-slate-900">
                  {job.department}
                </h3>
                <h4 className="text-xs font-semibold text-slate-700">
                  {job.organization}
                </h4>
              </div>
            </div>

            {/* Simulated Notification Body */}
            <div className="font-serif text-sm leading-relaxed space-y-4 text-justify text-slate-900">
              <p className="font-bold underline text-center">
                NOTIFICATION: {job.title.toUpperCase()}
              </p>

              <p>
                <strong>1. CANDIDATES TO ENSURE THEIR ELIGIBILITY FOR THE EXAMINATION:</strong> All candidates (male/female/transgender) are requested to carefully read the rules of recruitment published herein. Admission at all the stages of the examination will be purely provisional subject to satisfying the prescribed eligibility conditions.
              </p>

              <p>
                <strong>2. TOTAL VACANCIES & RESERVATION:</strong> The total number of vacancies to be filled on the result of the examination is approximately <strong>{job.vacancies.toLocaleString('en-IN')}</strong>. Reservation will be made for candidates belonging to Scheduled Castes, Scheduled Tribes, Other Backward Classes, Economically Weaker Sections, and Persons with Benchmark Disabilities.
              </p>

              <div className="border border-black my-4 text-xs font-sans">
                <div className="bg-slate-100 p-2 border-b border-black font-bold flex justify-between">
                  <span>Cadre / Classification: {job.cadreGroup || 'Group A / B'}</span>
                  <span>Scale: {job.salary}</span>
                </div>
                <div className="p-3 space-y-1">
                  <div><strong>Educational Qualification:</strong> {job.qualification}</div>
                  <div><strong>Age Bracket:</strong> {job.ageLimit}</div>
                  <div><strong>Selection Scheme:</strong> {job.selectionProcess || 'Computer Based Test / Written Exam + Interview'}</div>
                </div>
              </div>

              <p>
                <strong>3. HOW TO APPLY:</strong> Candidates are required to apply Online by using the official commission website (<strong>{job.officialApplicationUrl}</strong>). Detailed instructions for filling up online applications are available on the above mentioned website.
              </p>

              <p>
                <strong>4. LAST DATE FOR SUBMISSION OF APPLICATIONS:</strong> The Online Applications can be filled up to <strong>{new Date(job.applicationEndDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</strong> till 18:00 Hours.
              </p>
            </div>

            {/* Official Digital Seal */}
            <div className="mt-12 pt-6 border-t border-slate-300 flex justify-between items-end font-sans">
              <div className="border-2 border-emerald-700 p-2.5 rounded-lg text-emerald-800 text-[11px] max-w-xs space-y-1 bg-emerald-50/50">
                <div className="flex items-center gap-1 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" /> Digitally Certified Document
                </div>
                <p className="text-[10px]">Controller of Publications, Civil Lines, Delhi-110054</p>
                <p className="font-mono text-[9px] text-slate-500">SHA256: 9e32a4...fc812</p>
              </div>

              <div className="text-right text-xs">
                <p className="font-bold">Under Secretary to the Govt of India</p>
                <p className="text-slate-600">Authenticated via Central Gazette Archive</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
