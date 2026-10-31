import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ExternalLink, 
  Key, 
  Globe, 
  RefreshCw, 
  Trash2, 
  X,
  UploadCloud,
  ShieldCheck
} from 'lucide-react';
import { 
  getSupabaseConfig, 
  setSupabaseConfig, 
  isSupabaseConfigured,
  createClientInstance
} from '../lib/supabase';
import { JobService, INITIAL_JOBS_SEED } from '../services/jobService';

interface SupabaseConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnected?: () => void;
}

export const SupabaseConnectModal: React.FC<SupabaseConnectModalProps> = ({
  isOpen,
  onClose,
  onConnected,
}) => {
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
    jobCount?: number;
  } | null>(null);
  const [isSyncingSeed, setIsSyncingSeed] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const config = getSupabaseConfig();
      setUrl(config.url || '');
      setKey(config.key || '');
      setTestResult(null);
      setSyncMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleTestAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanUrl = url.trim();
    const cleanKey = key.trim();

    if (!cleanUrl.startsWith('https://') || !cleanUrl.includes('supabase.co')) {
      setTestResult({
        success: false,
        message: 'Project URL must start with https:// and end with .supabase.co',
      });
      return;
    }

    if (!cleanKey || cleanKey.length < 20) {
      setTestResult({
        success: false,
        message: 'Invalid anon public key format.',
      });
      return;
    }

    setIsTesting(true);
    setTestResult(null);

    try {
      const testClient = createClientInstance(cleanUrl, cleanKey);
      if (!testClient) {
        throw new Error('Failed to create Supabase client instance');
      }

      // Test querying the jobs table
      const { data, error, count } = await testClient
        .from('jobs')
        .select('*', { count: 'exact' })
        .limit(5);

      if (error) {
        throw error;
      }

      // Save to localStorage
      setSupabaseConfig(cleanUrl, cleanKey);

      setTestResult({
        success: true,
        message: `Successfully connected to Supabase! Found ${count ?? data?.length ?? 0} jobs in public.jobs table.`,
        jobCount: count ?? data?.length ?? 0,
      });

      if (onConnected) {
        onConnected();
      }

      // Trigger a page reload after a short delay so all singletons update cleanly
      setTimeout(() => {
        window.location.reload();
      }, 1200);

    } catch (err: any) {
      console.error('Supabase connection test failed:', err);
      setTestResult({
        success: false,
        message: err.message || 'Connection failed. Please verify that supabase/schema.sql has been executed in your SQL Editor.',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleDisconnect = () => {
    setSupabaseConfig('', '');
    setUrl('');
    setKey('');
    setTestResult({
      success: true,
      message: 'Disconnected from Supabase. Switched back to LocalStorage Demo Mode.',
    });
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleSeedSupabase = async () => {
    const config = getSupabaseConfig();
    if (!config.isConfigured) return;

    setIsSyncingSeed(true);
    setSyncMessage(null);

    try {
      const client = createClientInstance(config.url, config.key);
      if (!client) throw new Error('Supabase client unavailable');

      // Map seed items to rows
      const rows = INITIAL_JOBS_SEED.map((job) => ({
        title: job.title,
        department: job.department,
        organization: job.organization,
        category: job.category,
        location: job.location,
        qualification: job.qualification,
        vacancies: job.vacancies,
        salary: job.salary,
        age_limit: job.ageLimit,
        application_start_date: job.applicationStartDate,
        application_end_date: job.applicationEndDate,
        examination_date: job.examinationDate || null,
        official_notification_url: job.officialNotificationUrl,
        official_application_url: job.officialApplicationUrl,
        status: job.status,
        verified_at: job.verifiedAt || new Date().toISOString(),
        advt_number: job.advtNumber || null,
        cadre_group: job.cadreGroup || 'Group A & B',
        gazette_ref: job.gazetteRef || null,
        selection_process: job.selectionProcess || null,
        description: job.description || null,
      }));

      const { error } = await client.from('jobs').upsert(rows, { onConflict: 'title' });
      if (error) throw error;

      setSyncMessage(`Successfully seeded ${rows.length} recruitment notices into Supabase!`);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err: any) {
      console.error('Seed upload error:', err);
      setSyncMessage(`Seeding error: ${err.message || 'Failed to insert records'}`);
    } finally {
      setIsSyncingSeed(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#001f3e] text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg leading-tight flex items-center gap-2">
                Supabase Connection Manager
                {isSupabaseConfigured ? (
                  <span className="text-[11px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full border border-emerald-500/40">
                    Connected
                  </span>
                ) : (
                  <span className="text-[11px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/40">
                    Demo LocalDB
                  </span>
                )}
              </h3>
              <p className="text-xs text-slate-300">
                Connect your PostgreSQL database to sync real recruitment gazettes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status banner */}
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            isSupabaseConfigured 
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900' 
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}>
            <ShieldCheck className={`w-5 h-5 shrink-0 mt-0.5 ${isSupabaseConfigured ? 'text-emerald-600' : 'text-blue-600'}`} />
            <div className="text-xs space-y-1">
              <p className="font-bold">
                {isSupabaseConfigured ? 'Live PostgreSQL Backend Active' : 'Running in LocalStorage Demo Mode'}
              </p>
              <p className="text-slate-600 leading-relaxed">
                {isSupabaseConfigured 
                  ? 'All job creations, edits, and candidate bookmarking sync to your Supabase tables.'
                  : 'The portal is currently using realistic in-memory seed data with local browser persistence. Paste your Supabase credentials below to connect your database.'}
              </p>
            </div>
          </div>

          <form onSubmit={handleTestAndSave} className="space-y-4">
            {/* Supabase URL */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  Supabase Project URL
                </span>
                <span className="text-[11px] font-normal text-slate-400">Settings &gt; API &gt; Project URL</span>
              </label>
              <input
                type="url"
                required
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://xyzabcdefghijklm.supabase.co"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0051d5] text-xs font-mono"
              />
            </div>

            {/* Supabase Anon Key */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-slate-400" />
                  Anon / Public API Key
                </span>
                <span className="text-[11px] font-normal text-slate-400">Settings &gt; API &gt; anon public</span>
              </label>
              <textarea
                required
                rows={2}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0051d5] text-xs font-mono resize-none"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Use your public <strong>anon key</strong>. Never enter your secret service_role key.
              </p>
            </div>

            {/* Result alert */}
            {testResult && (
              <div className={`p-3.5 rounded-lg border text-xs flex items-start gap-2.5 ${
                testResult.success 
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}>
                {testResult.success ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{testResult.message}</p>
                  {testResult.success && (
                    <p className="text-[11px] text-emerald-700 mt-0.5">
                      Refreshing application state...
                    </p>
                  )}
                </div>
              </div>
            )}

            {syncMessage && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
                {syncMessage}
              </div>
            )}

            {/* Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              {isSupabaseConfigured ? (
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="px-3.5 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Disconnect Database
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTesting}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-[#0051d5] hover:bg-[#316bf3] rounded-lg shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Test & Connect
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Quick Seed Action if connected */}
          {isSupabaseConfigured && (
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">Seed Demo Data into Supabase</p>
                <p className="text-[11px] text-slate-500">
                  Populate your Supabase <code className="bg-slate-100 px-1 py-0.5 rounded">public.jobs</code> table with the 12 pan-India gazette notices.
                </p>
              </div>
              <button
                type="button"
                onClick={handleSeedSupabase}
                disabled={isSyncingSeed}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg border border-slate-300 flex items-center gap-1.5 shrink-0 transition-colors"
              >
                <UploadCloud className="w-3.5 h-3.5 text-slate-600" />
                {isSyncingSeed ? 'Syncing...' : 'Seed Now'}
              </button>
            </div>
          )}

          {/* Helper Tips */}
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-700">Where to find these in Supabase Dashboard:</p>
            <ol className="list-decimal pl-4 space-y-0.5 text-slate-500">
              <li>Log in to <a href="https://supabase.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-[#0051d5] underline inline-flex items-center gap-0.5">supabase.com/dashboard <ExternalLink className="w-2.5 h-2.5" /></a></li>
              <li>Go to <strong>Project Settings</strong> (gear icon in sidebar) &gt; <strong>API</strong></li>
              <li>Copy <strong>Project URL</strong> and <strong>anon public</strong> key</li>
              <li>Make sure you ran the SQL in <strong>SQL Editor</strong> from <code className="bg-white px-1 border rounded">supabase/schema.sql</code></li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
