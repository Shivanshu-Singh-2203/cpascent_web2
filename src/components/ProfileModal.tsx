// src/components/ProfileModal.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiFetch } from '../lib/api.ts';
import {
  X,
  User,
  Settings,
  RefreshCw,
  Download,
  Save,
  CheckCircle2,
  ExternalLink,
  Target,
} from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, profile, dbUser, updateProfile, refreshUser } = useAuth();

  const [username, setUsername] = useState(dbUser?.username || user?.displayName || 'CPian');
  const [currentLevel, setCurrentLevel] = useState(profile?.currentLevel || 'Newbie');
  const [targetLevel, setTargetLevel] = useState(profile?.targetLevel || 'Grandmaster');
  const [cfHandle, setCfHandle] = useState(profile?.cfHandle || '');
  const [cfRating, setCfRating] = useState(profile?.cfRating ? String(profile.cfRating) : '');
  const [highestRatingSolved, setHighestRatingSolved] = useState(
    profile?.highestRatingSolved ? String(profile.highestRatingSolved) : ''
  );
  const [languages, setLanguages] = useState(profile?.languages || 'C++,Python');
  const [dailyMinutes, setDailyMinutes] = useState(profile?.dailyMinutes || 60);
  const [primaryGoal, setPrimaryGoal] = useState(profile?.primaryGoal || 'Candidate Master (1900+)');
  const [preferredPlatforms, setPreferredPlatforms] = useState(
    profile?.preferredPlatforms || 'Codeforces,CSES,AtCoder'
  );

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // CF Sync state
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    try {
      await updateProfile({
        username,
        currentLevel,
        targetLevel,
        cfHandle,
        cfRating: cfRating ? Number(cfRating) : null,
        highestRatingSolved: highestRatingSolved ? Number(highestRatingSolved) : null,
        languages,
        dailyMinutes: Number(dailyMinutes),
        primaryGoal,
        preferredPlatforms,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleSyncCodeforces = async () => {
    if (!cfHandle) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await apiFetch('/api/codeforces/sync', {
        method: 'POST',
        body: JSON.stringify({ handle: cfHandle }),
      });
      setSyncResult(res.message);
      await refreshUser();
    } catch (err: any) {
      setSyncResult(`Sync failed: ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleExportData = async () => {
    try {
      const data = await apiFetch('/api/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cp-journey-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export data:', err);
    }
  };

  const levels = [
    'Newbie',
    'Pupil',
    'Specialist',
    'Expert',
    'Candidate Master',
    'Master',
    'International Master',
    'Grandmaster',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <User className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">Profile & Preferences</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Display Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Daily Available Study Time (Minutes)
                </label>
                <input
                  type="number"
                  value={dailyMinutes}
                  onChange={(e) => setDailyMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Current CP Journey Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => setCurrentLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Target CP Goal Level
                </label>
                <select
                  value={targetLevel}
                  onChange={(e) => setTargetLevel(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  {levels.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Primary Goal
                </label>
                <input
                  type="text"
                  value={primaryGoal}
                  onChange={(e) => setPrimaryGoal(e.target.value)}
                  placeholder="e.g. Candidate Master (1900+) or ICPC World Finals"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Programming Languages
                </label>
                <input
                  type="text"
                  value={languages}
                  onChange={(e) => setLanguages(e.target.value)}
                  placeholder="C++, Python, Java"
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                Preferred Practice Platforms
              </label>
              <input
                type="text"
                value={preferredPlatforms}
                onChange={(e) => setPreferredPlatforms(e.target.value)}
                placeholder="Codeforces, CSES, AtCoder, USACO"
                className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 focus:outline-none"
              />
            </div>

            {/* Codeforces Sync Section */}
            <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3 mt-4">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <span>Codeforces Integration (Optional)</span>
              </h3>
              <p className="text-zinc-400 text-xs">
                Connect your Codeforces handle to synchronize your officially solved problems into CP Journey with one click.
              </p>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={cfHandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  placeholder="Codeforces Handle (e.g. tourist)"
                  className="flex-1 px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleSyncCodeforces}
                  disabled={syncing || !cfHandle}
                  className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 disabled:opacity-50 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
                  <span>{syncing ? 'Syncing...' : 'Sync Solved'}</span>
                </button>
              </div>

              {syncResult && (
                <div className="text-emerald-400 text-xs font-medium">
                  {syncResult}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
              <span className="text-emerald-400">
                {saveSuccess && '✓ Settings saved!'}
              </span>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>

          {/* Export / Backup Section */}
          <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
            <div>
              <div className="font-semibold text-white">Export Journey Data</div>
              <div className="text-zinc-500 text-[11px]">
                Download a complete JSON export of your progress, notes, and activity.
              </div>
            </div>
            <button
              onClick={handleExportData}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-medium flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export JSON</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
