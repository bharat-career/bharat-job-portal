import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { JobService } from '../services/jobService';
import { ExamEvent } from '../types';
import { Calendar, Clock, ExternalLink, ShieldCheck, Filter, ArrowRight, Download, CheckCircle2 } from 'lucide-react';

export const ExamCalendarPage: React.FC = () => {
  const [filterStage, setFilterStage] = useState('All');
  const events = JobService.getExamCalendar();

  const filteredEvents = events.filter((ev) => {
    if (filterStage !== 'All' && ev.stage !== filterStage) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#001f3e]">
            Official Examination & Admit Card Calendar
          </h1>
          <p className="text-xs text-[#43474e]">
            Chronological schedule of Computer Based Tests (CBT), Prelims, Mains, and Interview dates across India.
          </p>
        </div>

        {/* Stage Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={filterStage}
            onChange={(e) => setFilterStage(e.target.value)}
            className="px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-[#001f3e]"
          >
            <option value="All">All Stages</option>
            <option value="Prelims">Preliminary Examinations</option>
            <option value="CBT-1">Computer Based Tests (CBT)</option>
            <option value="Mains">Main Examinations</option>
            <option value="Interview">Interviews / Viva</option>
          </select>
        </div>
      </div>

      {/* Calendar Timeline List */}
      <div className="space-y-4">
        {filteredEvents.map((ev) => {
          const isAdmitCardLive = ev.status === 'Admit Card Live';
          return (
            <div
              key={ev.id}
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Date Block */}
                <div className="bg-[#eff4ff] border border-[#d3e4fe] p-3 rounded-xl text-center min-w-[85px] shrink-0">
                  <span className="block text-[10px] font-bold text-[#0051d5] uppercase font-mono">
                    {new Date(ev.examDate).toLocaleDateString('en-GB', { month: 'short' })}
                  </span>
                  <span className="block text-2xl font-black text-[#001f3e] leading-none my-1">
                    {new Date(ev.examDate).getDate()}
                  </span>
                  <span className="block text-[10px] font-mono text-slate-500">
                    {new Date(ev.examDate).getFullYear()}
                  </span>
                </div>

                {/* Event info */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {ev.organization}
                    </span>
                    <span className="text-[10px] font-bold bg-[#eff4ff] text-[#0051d5] px-2 py-0.5 rounded">
                      Stage: {ev.stage}
                    </span>
                    {isAdmitCardLive ? (
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded flex items-center gap-1 animate-pulse">
                        <CheckCircle2 className="w-3 h-3" /> Admit Card Released
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded">
                        Admit Card: {ev.admitCardDate ? new Date(ev.admitCardDate).toLocaleDateString('en-GB') : 'TBA'}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#001f3e]">
                    {ev.examTitle}
                  </h3>

                  <p className="text-xs text-slate-500">
                    Official Commission Target: <strong>{ev.organization}</strong> • Category: {ev.category}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                <Link
                  to={`/jobs/${ev.jobId}`}
                  className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-bold"
                >
                  View Scheme
                </Link>

                <a
                  href={ev.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors ${
                    isAdmitCardLive
                      ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                      : 'bg-[#001f3e] hover:bg-[#12345a] text-white'
                  }`}
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{isAdmitCardLive ? 'Download Admit Card' : 'Commission Portal'}</span>
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
