import React, { useState, useEffect } from 'react';
import { Job, JobCategory, JobStatus } from '../types';
import { X, Save, PlusCircle, CheckCircle, ShieldCheck } from 'lucide-react';

interface AdminEditJobModalProps {
  job: Job | null; // null if creating a new job
  isOpen: boolean;
  onClose: () => void;
  onSave: (jobData: any) => void;
}

const CATEGORIES: JobCategory[] = [
  'UPSC',
  'SSC',
  'Railways',
  'Banking and Financial Institutions',
  'Army',
  'Navy',
  'Air Force',
  'Defence organizations',
  'State Public Service Commissions',
  'State Government Departments',
  'PSUs',
  'Teaching',
  'Healthcare',
  'Police and Paramilitary',
  'Judiciary',
  'Engineering',
  'Research organizations',
  'Other',
];

export const AdminEditJobModal: React.FC<AdminEditJobModalProps> = ({
  job,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    department: '',
    organization: '',
    category: 'UPSC' as JobCategory,
    location: 'All India',
    qualification: '',
    vacancies: 100,
    salary: 'Level 10 (7th CPC) - ₹56,100 basic pay',
    ageLimit: '21 - 32 Years',
    applicationStartDate: new Date().toISOString().split('T')[0],
    applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    examinationDate: 'TBA 2025',
    officialNotificationUrl: 'https://upsc.gov.in/notifications',
    officialApplicationUrl: 'https://upsconline.nic.in',
    status: 'active' as JobStatus,
    advtNumber: 'Advt No. 01/2025',
    cadreGroup: 'Group A Gazetted',
    description: '',
  });

  useEffect(() => {
    if (job) {
      setFormData({
        title: job.title,
        department: job.department,
        organization: job.organization,
        category: job.category,
        location: job.location,
        qualification: job.qualification,
        vacancies: job.vacancies,
        salary: job.salary,
        ageLimit: job.ageLimit,
        applicationStartDate: job.applicationStartDate.split('T')[0],
        applicationEndDate: job.applicationEndDate.split('T')[0],
        examinationDate: job.examinationDate || '',
        officialNotificationUrl: job.officialNotificationUrl,
        officialApplicationUrl: job.officialApplicationUrl,
        status: job.status,
        advtNumber: job.advtNumber || '',
        cadreGroup: job.cadreGroup || 'Group A Gazetted',
        description: job.description || '',
      });
    } else {
      // Defaults for new job
      setFormData({
        title: '',
        department: '',
        organization: '',
        category: 'UPSC',
        location: 'All India',
        qualification: "Bachelor's Degree in any discipline",
        vacancies: 500,
        salary: 'Level 7 (7th CPC) - ₹44,900 to ₹1,42,400',
        ageLimit: '18 - 30 Years',
        applicationStartDate: new Date().toISOString().split('T')[0],
        applicationEndDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        examinationDate: 'July 2025',
        officialNotificationUrl: 'https://upsc.gov.in',
        officialApplicationUrl: 'https://upsconline.nic.in',
        status: 'active',
        advtNumber: 'ADVT/2025/NEW',
        cadreGroup: 'Group B Executive',
        description: '',
      });
    }
  }, [job, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      vacancies: Number(formData.vacancies),
      applicationStartDate: new Date(formData.applicationStartDate).toISOString(),
      applicationEndDate: new Date(formData.applicationEndDate).toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f3e] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              {job ? <Save className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base">
                {job ? 'Edit Government Recruitment Notice' : 'Gazette New Recruitment Post'}
              </h3>
              <p className="text-xs text-slate-300">
                {job ? `Record ID: ${job.id}` : 'Official Commission Entry Formulation'}
              </p>
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Recruitment Title *
            </label>
            <input 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Combined Graduate Level Examination (CGL) 2025"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-[#001f3e] focus:outline-none focus:ring-1 focus:ring-[#0051d5]"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Organization */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Issuing Board / Commission *
              </label>
              <input 
                type="text"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="e.g. Staff Selection Commission"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Department */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Ministry / Department *
              </label>
              <input 
                type="text"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g. Ministry of Personnel"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as JobCategory })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-medium"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {/* Location */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location / State *
              </label>
              <input 
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. All India or Uttar Pradesh"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Total Vacancies */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Vacancies Count *
              </label>
              <input 
                type="number"
                value={formData.vacancies}
                onChange={(e) => setFormData({ ...formData, vacancies: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold text-[#001f3e]"
                required
              />
            </div>

            {/* Salary */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Salary / Pay Matrix *
              </label>
              <input 
                type="text"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="Level 7 (₹44,900)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Status */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Recruitment Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as JobStatus })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg font-bold"
              >
                <option value="active">Active (Open)</option>
                <option value="closing-soon">Closing Soon</option>
                <option value="expired">Expired</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Qualification */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Min Qualification *
              </label>
              <input 
                type="text"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                placeholder="e.g. Graduation Degree in Any Discipline"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Age Limit */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Age Bracket *
              </label>
              <input 
                type="text"
                value={formData.ageLimit}
                onChange={(e) => setFormData({ ...formData, ageLimit: e.target.value })}
                placeholder="e.g. 21 - 32 Years"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Start Date */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application Start Date *
              </label>
              <input 
                type="date"
                value={formData.applicationStartDate}
                onChange={(e) => setFormData({ ...formData, applicationStartDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Application End Date *
              </label>
              <input 
                type="date"
                value={formData.applicationEndDate}
                onChange={(e) => setFormData({ ...formData, applicationEndDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Examination Date */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Exam Date
              </label>
              <input 
                type="text"
                value={formData.examinationDate}
                onChange={(e) => setFormData({ ...formData, examinationDate: e.target.value })}
                placeholder="e.g. 25 May 2025"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Official Notification PDF URL */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Gazette PDF URL (.gov.in) *
              </label>
              <input 
                type="url"
                value={formData.officialNotificationUrl}
                onChange={(e) => setFormData({ ...formData, officialNotificationUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>

            {/* Official Application Portal URL */}
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Official Application Portal URL (.gov.in / .nic.in) *
              </label>
              <input 
                type="url"
                value={formData.officialApplicationUrl}
                onChange={(e) => setFormData({ ...formData, officialApplicationUrl: e.target.value })}
                placeholder="https://..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Advt / Notice Number
              </label>
              <input 
                type="text"
                value={formData.advtNumber}
                onChange={(e) => setFormData({ ...formData, advtNumber: e.target.value })}
                placeholder="e.g. 04/2025-CSP"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                Cadre / Group
              </label>
              <input 
                type="text"
                value={formData.cadreGroup}
                onChange={(e) => setFormData({ ...formData, cadreGroup: e.target.value })}
                placeholder="e.g. Group A Gazetted"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
              Recruitment Overview / Scope
            </label>
            <textarea 
              rows={2}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Summary of positions, cadres, or premier postings..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Posting will be verified and instantly reflected in live search & filters across Bharat Career Hub.</span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#001f3e] hover:bg-[#12345a] text-white font-bold flex items-center gap-2 shadow-sm"
            >
              <Save className="w-4 h-4" />
              {job ? 'Save Modifications' : 'Publish Recruitment'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
