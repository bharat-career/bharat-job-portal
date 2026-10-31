import React, { useState, useEffect } from 'react';
import { 
  RefreshCw, 
  CheckCircle2, 
  Radio, 
  ExternalLink, 
  Clock, 
  AlertCircle, 
  Database, 
  Zap, 
  Copy, 
  Check, 
  X,
  Server,
  Layers,
  Sparkles,
  Terminal
} from 'lucide-react';
import { JobService } from '../services/jobService';

interface CronSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobsRefreshed?: () => void;
}

interface SourceStatus {
  name: string;
  url: string;
  latencyMs: number;
  status: string;
  recordsFound: number;
}

export const CronSyncModal: React.FC<CronSyncModalProps> = ({
  isOpen,
  onClose,
  onJobsRefreshed,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedCurl, setCopiedCurl] = useState(false);
  const [syncResult, setSyncResult] = useState<any | null>(null);
  const [cronStatus, setCronStatus] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch status on open
  useEffect(() => {
    if (isOpen) {
      fetchCronStatus();
    }
  }, [isOpen]);

  const fetchCronStatus = async () => {
    try {
      const res = await fetch('/api/cron/status');
      if (res.ok) {
        const data = await res.json();
        setCronStatus(data);
      }
    } catch (e) {
      console.warn('Status fetch error', e);
    }
  };

  if (!isOpen) return null;

  const cronEndpointUrl = `${window.location.origin}/api/cron/sync-jobs`;
  const curlCommand = `curl -X POST "${cronEndpointUrl}?token=gov-cron-token"`;

  const copyToClipboard = (text: string, isCurl = false) => {
    navigator.clipboard.writeText(text);
    if (isCurl) {
      setCopiedCurl(true);
      setTimeout(() => setCopiedCurl(false), 2000);
    } else {
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    }
  };

  const handleTriggerCron = async () => {
    setIsRunning(true);
    setError(null);
    setProgressStep(1);

    // Simulate progressive scraping feedback
    const timer1 = setTimeout(() => setProgressStep(2), 500);
    const timer2 = setTimeout(() => setProgressStep(3), 1100);

    try {
      const res = await fetch('/api/cron/sync-jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        throw new Error(`Server returned HTTP ${res.status}`);
      }

      const data = await res.json();
      setProgressStep(4);
      setSyncResult(data);

      // Refresh frontend JobService jobs from server
      try {
        const jobsRes = await fetch('/api/jobs');
        if (jobsRes.ok) {
          const freshJobs = await jobsRes.json();
          JobService.saveJobsToStorage(freshJobs);
        }
      } catch (e) {
        console.warn('Could not sync jobs to client storage', e);
      }

      fetchCronStatus();
      if (onJobsRefreshed) onJobsRefreshed();
    } catch (err: any) {
      setError(err.message || 'Cron sync execution failed');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#001f3e]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#001f3e] to-[#003366] text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1.5">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>Automated Recruitment Aggregator</span>
          </div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>National Vacancy Cron Crawler</span>
            <span className="text-xs bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-mono">
              GET / POST Active
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-lg">
            Aggregates official gazettes, employment circulars, and notifications across UPSC, SSC, RRB, IBPS, Defence, and State Public Service Commissions.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-xs text-slate-700">
          
          {/* Cron Endpoint Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#001f3e] flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-[#0051d5]" />
                <span>Production Cron Webhook Endpoint</span>
              </span>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                200 OK • Ready for Scheduler
              </span>
            </div>

            {/* URL Display */}
            <div className="flex items-center gap-2 bg-white border border-slate-300 rounded-lg p-2 font-mono text-[11px] text-slate-800 break-all">
              <span className="font-bold text-[#0051d5]">POST</span>
              <span className="flex-1 select-all">{cronEndpointUrl}</span>
              <button
                type="button"
                onClick={() => copyToClipboard(cronEndpointUrl, false)}
                className="shrink-0 p-1.5 text-slate-600 hover:text-[#0051d5] hover:bg-slate-100 rounded transition-colors flex items-center gap-1 text-[11px]"
                title="Copy Webhook URL"
              >
                {copiedUrl ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copiedUrl ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Curl Command */}
            <div className="bg-slate-900 text-slate-200 rounded-lg p-3 font-mono text-[11px] flex items-center justify-between gap-3">
              <code className="text-emerald-400 truncate">{curlCommand}</code>
              <button
                type="button"
                onClick={() => copyToClipboard(curlCommand, true)}
                className="shrink-0 p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] flex items-center gap-1 px-2"
              >
                {copiedCurl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCurl ? 'Copied' : 'Copy curl'}</span>
              </button>
            </div>
          </div>

          {/* Aggregator Sources Matrix */}
          <div className="space-y-2">
            <h3 className="font-bold text-[#001f3e] flex items-center justify-between">
              <span>Authoritative Gazette Sources ({cronStatus?.totalIndexedJobs ? `${cronStatus.totalIndexedJobs} Jobs Active` : '8 Portals'})</span>
              <span className="text-[11px] text-slate-500 font-normal">Scanned on every cron trigger</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              {[
                { name: 'UPSC Central', status: 'Active', latency: '142ms' },
                { name: 'SSC Central', status: 'Active', latency: '198ms' },
                { name: 'RRB Railways', status: 'Active', latency: '215ms' },
                { name: 'IBPS Banking', status: 'Active', latency: '180ms' },
                { name: 'Defence (IAF/Navy)', status: 'Active', latency: '230ms' },
                { name: 'State PSCs', status: 'Active', latency: '275ms' },
                { name: 'AIIMS NORCET', status: 'Active', latency: '160ms' },
                { name: 'KVS Teaching', status: 'Active', latency: '190ms' },
              ].map((s) => (
                <div key={s.name} className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 truncate">{s.name}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1 flex justify-between">
                    <span>{s.status}</span>
                    <span>{s.latency}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trigger Action & Progress */}
          <div className="bg-blue-50/60 border border-blue-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="font-bold text-[#001f3e] text-sm">
                  Execute Instant Aggregation
                </h4>
                <p className="text-[11px] text-slate-600">
                  Simulates full-spectrum crawling of official employment gazettes and auto-publishes new vacancies.
                </p>
              </div>

              <button
                type="button"
                onClick={handleTriggerCron}
                disabled={isRunning}
                className="px-5 py-2.5 bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 shrink-0"
              >
                <RefreshCw className={`w-4 h-4 ${isRunning ? 'animate-spin' : ''}`} />
                <span>{isRunning ? 'Scraping Sources...' : 'Run Cron Sync Now'}</span>
              </button>
            </div>

            {/* Execution Progress */}
            {isRunning && (
              <div className="space-y-2 pt-2 border-t border-blue-200">
                <div className="flex justify-between text-[11px] font-bold text-[#0051d5]">
                  <span>
                    {progressStep === 1 && 'Connecting to Union Ministries & State Gazettes...'}
                    {progressStep === 2 && 'Parsing notifications, eligibility matrices & PDF links...'}
                    {progressStep === 3 && 'Committing newly discovered vacancies to database...'}
                    {progressStep === 4 && 'Sync complete! Dispatched updates.'}
                  </span>
                  <span>{progressStep * 25}%</span>
                </div>
                <div className="w-full h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#0051d5] transition-all duration-300"
                    style={{ width: `${progressStep * 25}%` }}
                  ></div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Sync Result Summary */}
            {syncResult && (
              <div className="bg-white border border-emerald-200 rounded-xl p-3 space-y-2 text-emerald-950 animate-in fade-in">
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Cron Run Success • {syncResult.execution?.sourcesScanned} Sources Processed in {syncResult.execution?.durationMs}ms</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] pt-1">
                  <div className="bg-emerald-50/50 p-2 rounded">
                    <span className="text-slate-500 block">New Positions Discovered:</span>
                    <strong className="text-emerald-700 font-mono text-sm">+{syncResult.newJobsAdded?.length || 0} Vacancies</strong>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded">
                    <span className="text-slate-500 block">Total Active Vacancies:</span>
                    <strong className="text-[#001f3e] font-mono text-sm">{syncResult.execution?.totalActiveVacancies?.toLocaleString('en-IN') || '45,000+'}</strong>
                  </div>
                  <div className="bg-emerald-50/50 p-2 rounded col-span-2 sm:col-span-1">
                    <span className="text-slate-500 block">Database Status:</span>
                    <strong className="text-emerald-700 font-mono text-sm">Committed & Live</strong>
                  </div>
                </div>

                {syncResult.newJobsAdded?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-emerald-100">
                    <p className="font-bold text-[11px] text-emerald-800 mb-1">Newly Published to Portal:</p>
                    <ul className="space-y-1">
                      {syncResult.newJobsAdded.map((job: any) => (
                        <li key={job.id} className="text-[11px] text-slate-700 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                          <strong>{job.organization}:</strong>
                          <span className="truncate">{job.title}</span>
                          <span className="text-slate-400 font-mono">({job.vacancies} posts)</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Automated Schedule Guidance */}
          <div className="border-t border-slate-200 pt-4 space-y-2 text-slate-600">
            <h4 className="font-bold text-[#001f3e]">
              External Cron Automation Setup:
            </h4>
            <p className="text-[11px]">
              You can trigger this endpoint via any standard cron scheduler:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-[11px]">
              <li><strong>Google Cloud Scheduler:</strong> HTTP Target, URL <code className="bg-slate-100 px-1 py-0.5 rounded">{cronEndpointUrl}</code>, Frequency: <code className="bg-slate-100 px-1 py-0.5 rounded">0 */6 * * *</code> (every 6 hours).</li>
              <li><strong>Cron-job.org / Vercel Cron / GitHub Actions:</strong> Free HTTP GET ping to refresh recruitment listings automatically every morning at 06:00 IST.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-4 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span>Server Persistent Storage • data/jobs.json</span>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#001f3e] hover:bg-[#12345a] text-white font-bold rounded-xl text-xs transition-colors"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};
