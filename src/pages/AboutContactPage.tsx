import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Mail, Phone, MapPin, Send, CheckCircle2, FileText, HelpCircle } from 'lucide-react';

export const AboutContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Grievance / Correction',
    message: '',
  });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-[#0051d5] bg-[#eff4ff] px-3 py-1 rounded-full border border-[#d3e4fe]">
          Civic Transparency Charter
        </span>
        <h1 className="text-3xl font-extrabold text-[#001f3e]">
          About Bharat Career Hub & Public Services Helpdesk
        </h1>
        <p className="text-sm text-[#43474e] max-w-2xl mx-auto">
          An authoritative, zero-latency public repository aggregating gazetted vacancies across the Union Government and all 28 States & 8 Union Territories.
        </p>
      </div>

      {/* 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#0051d5] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#001f3e]">
            100% Verified Gazette Feeds
          </h3>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Every listing directly references an extraordinary Gazette of India notification or the issuing Public Service Commission. Direct application links strictly route to .gov.in and .nic.in hosts.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#001f3e]">
            Anti-Fraud & Zero Middlemen
          </h3>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Bharat Career Hub never collects candidate registration fees, debit card numbers, or banking credentials. We protect citizens from fraudulent job recruitment syndicates.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-[#001f3e]">
            Universal Accessibility (OTR)
          </h3>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Supporting multilingual navigation, text resizing (A-, A, A+), screen reader standards, and seamless integration with candidate DigiLocker credentials.
          </p>
        </div>
      </div>

      {/* Statutory Guidance & FAQs */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-[#001f3e] flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-[#0051d5]" />
          Frequently Asked Questions & Candidate Guidelines
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-[#43474e] leading-relaxed">
          <div className="space-y-1.5 p-4 bg-[#f8f9ff] rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#001f3e]">
              How does Bharat Career Hub obtain recruitment circulars?
            </h4>
            <p>
              Notifications are indexed from the Department of Personnel and Training (DoPT), Employment News, Union Ministries, and State Gazettes as soon as official circulars publish.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-[#f8f9ff] rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#001f3e]">
              Where do I pay my examination fee?
            </h4>
            <p>
              Candidates pay examination fees strictly on the official website of the conducting commission (e.g. upsc.gov.in, ssc.gov.in) via SBI e-Pay or Bharatkosh. Never pay on 3rd party portals.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-[#f8f9ff] rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#001f3e]">
              What is One-Time Registration (OTR)?
            </h4>
            <p>
              OTR enables candidates to fill their educational, demographic, and reservation details once across commissions like UPSC and State PSCs, simplifying multiple applications.
            </p>
          </div>

          <div className="space-y-1.5 p-4 bg-[#f8f9ff] rounded-xl border border-slate-100">
            <h4 className="font-bold text-[#001f3e]">
              How do reservation age relaxations apply?
            </h4>
            <p>
              Under Central service rules: OBC candidates receive 3 years, SC/ST candidates receive 5 years, and PwBD candidates receive 10 years relaxation beyond the upper age limit.
            </p>
          </div>
        </div>
      </div>

      {/* Grievance & Helpdesk Contact Form */}
      <div className="bg-[#eff4ff] border border-[#d3e4fe] rounded-2xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact info */}
        <div className="space-y-4">
          <span className="text-[11px] font-bold text-[#0051d5] uppercase tracking-wider font-mono">
            Candidate Assistance Desk
          </span>
          <h3 className="text-xl font-bold text-[#001f3e]">
            Have a question or identified a circular discrepancy?
          </h3>
          <p className="text-xs text-[#43474e] leading-relaxed">
            Our civic data team verifies recruitment amendments, errata circulars, and timeline extensions daily. Submit your query or feedback below.
          </p>

          <div className="space-y-3 text-xs text-[#001f3e] pt-2 font-medium">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#0051d5]" />
              <span>helpdesk@bharatcareer.gov.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#0051d5]" />
              <span>1800-11-2025 (Toll-Free All-India Mon - Sat, 09:00 - 18:00 IST)</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#0051d5]" />
              <span>National Informatics Center, CGO Complex, Lodhi Road, New Delhi</span>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          {sent ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-[#001f3e]">
                Inquiry Logged Successfully
              </h4>
              <p className="text-xs text-slate-500">
                Ticket #BCH-{Math.floor(100000 + Math.random() * 900000)} generated. Our verification desk will respond within 24 working hours.
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-xs font-bold text-[#0051d5] underline pt-2"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Candidate / Citizen Name"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="candidate@example.com"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Subject / Category
                </label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
                >
                  <option value="Grievance / Correction">Gazette Circular Data Correction</option>
                  <option value="Eligibility Query">Eligibility & Age Calculation Query</option>
                  <option value="Technical Help">Portal Technical Support</option>
                  <option value="Fraud Report">Report Fraudulent Recruitment Notice</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Message / Details *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please specify recruitment notice, commission, or error details..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-lg flex items-center justify-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Submit Grievance or Inquiry</span>
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
