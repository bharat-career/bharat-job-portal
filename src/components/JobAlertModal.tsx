import React, { useState } from 'react';
import { JobService } from '../services/jobService';
import { BellRing, X, CheckCircle, Mail, MessageSquare, Send } from 'lucide-react';

interface JobAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JobAlertModal: React.FC<JobAlertModalProps> = ({ isOpen, onClose }) => {
  const [contact, setContact] = useState('');
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'sms'>('whatsapp');
  const [category, setCategory] = useState('All Categories');
  const [state, setState] = useState('All India');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim()) return;

    JobService.subscribeAlert({
      contact: contact.trim(),
      channel,
      category: category === 'All Categories' ? undefined : category,
      state: state === 'All India' ? undefined : state,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 text-[#f59e0b] flex items-center justify-center">
              <BellRing className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">Civic Gazette Alert Dispatch</h3>
              <p className="text-xs text-slate-300">Instant SMS, WhatsApp & Email Notifications</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-[#001f3e]">
                Alert Subscription Activated!
              </h4>
              <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                You will receive zero-spam, gazette-verified notifications for <strong>{category}</strong> as soon as official circulars publish.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-2 bg-[#001f3e] text-white text-xs font-bold rounded-lg hover:bg-[#12345a]"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct official updates bypassing middleman agencies. Zero fee, zero commercial spam.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Notification Channel
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setChannel('whatsapp')}
                    className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'whatsapp' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-emerald-600" /> WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('email')}
                    className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'email' 
                        ? 'bg-blue-50 border-blue-500 text-blue-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Mail className="w-4 h-4 text-blue-600" /> Email
                  </button>

                  <button
                    type="button"
                    onClick={() => setChannel('sms')}
                    className={`py-2 px-3 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      channel === 'sms' 
                        ? 'bg-amber-50 border-amber-500 text-amber-800' 
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <Send className="w-4 h-4 text-amber-600" /> SMS
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {channel === 'email' ? 'Email Address' : 'Mobile Number (+91)'}
                </label>
                <input
                  type={channel === 'email' ? 'email' : 'tel'}
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder={channel === 'email' ? 'candidate@example.com' : '9876543210'}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-1 focus:ring-[#0051d5] focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Target Sector
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="All Categories">All Categories</option>
                    <option value="UPSC">UPSC Civil Services</option>
                    <option value="SSC">Staff Selection (SSC)</option>
                    <option value="Railways">Railways (RRB)</option>
                    <option value="Banking and Financial Institutions">Banking & IBPS</option>
                    <option value="Defence organizations">Defence & Paramilitary</option>
                    <option value="Teaching">Teaching & Schools</option>
                    <option value="Healthcare">Healthcare & AIIMS</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Jurisdiction / State
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="All India">All India (Central)</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                    <option value="Bihar">Bihar</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Delhi">Delhi NCT</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold rounded-lg shadow-sm transition-colors mt-2"
              >
                Activate Automated Dispatch
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
