// src/components/RevisionView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  RotateCcw,
  CheckCircle2,
  Calendar,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface RevisionViewProps {
  onSelectProblem: (id: number) => void;
}

export const RevisionView: React.FC<RevisionViewProps> = ({ onSelectProblem }) => {
  const { user, refreshUser } = useAuth();
  const [dueToday, setDueToday] = useState<any[]>([]);
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [completed, setCompleted] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'due' | 'upcoming' | 'completed'>('due');

  const fetchRevisions = async () => {
    try {
      const res = await apiFetch('/api/revisions');
      setDueToday(res.dueToday || []);
      setUpcoming(res.upcoming || []);
      setCompleted(res.completed || []);
    } catch (err) {
      console.error('Failed to load revision queue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchRevisions();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleCompleteRevision = async (revId: number, nextDays?: number) => {
    try {
      await apiFetch(`/api/revisions/${revId}`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'completed',
          nextIntervalDays: nextDays,
        }),
      });
      await fetchRevisions();
      await refreshUser();
    } catch (err) {
      console.error('Failed to complete revision:', err);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <RotateCcw className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Spaced Repetition System</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto mb-6">
          Sign in to automatically schedule and track your problem revisions over 1, 3, 7, 14, 30, and 60 day intervals.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <RotateCcw className="w-6 h-6 text-indigo-400" />
            <span>Spaced Revision Queue</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Systematic pattern reinforcement: <strong className="text-white">{dueToday.length}</strong> problems due for review today
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-zinc-900 p-1 rounded-xl border border-zinc-800 text-xs">
          <button
            onClick={() => setActiveTab('due')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'due' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Due Today ({dueToday.length})
          </button>
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'upcoming' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Upcoming ({upcoming.length})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer ${
              activeTab === 'completed' ? 'bg-indigo-600 text-white font-semibold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Completed ({completed.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3">
        {activeTab === 'due' && (
          dueToday.length > 0 ? (
            dueToday.map((item) => (
              <div
                key={item.revision.id}
                className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300">
                      {item.problem.platform}
                    </span>
                    {item.problem.rating && (
                      <span className="text-[10px] font-mono font-bold text-zinc-400">
                        Rating: {item.problem.rating}
                      </span>
                    )}
                    <span className="text-zinc-600">•</span>
                    <span className="text-[10px] text-zinc-500">
                      Interval: {item.revision.intervalDays}d
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectProblem(item.problem.id)}
                    className="text-sm font-bold text-white hover:text-indigo-400 transition-colors cursor-pointer"
                  >
                    {item.problem.name}
                  </h3>
                  {item.revision.notes && (
                    <p className="text-xs text-zinc-400 mt-1 italic">
                      "{item.revision.notes}"
                    </p>
                  )}
                </div>

                {/* Revision actions */}
                <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                  <button
                    onClick={() => handleCompleteRevision(item.revision.id, 7)}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    ✓ Reviewed (+7d)
                  </button>
                  <button
                    onClick={() => handleCompleteRevision(item.revision.id, 14)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors cursor-pointer"
                  >
                    +14d
                  </button>
                  <button
                    onClick={() => handleCompleteRevision(item.revision.id)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center rounded-2xl border border-zinc-800 bg-zinc-950/50">
              <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <div className="text-sm font-bold text-white">All caught up!</div>
              <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
                No revisions due today. Solve new problems and add them to revision to build long-term retention.
              </p>
            </div>
          )
        )}

        {activeTab === 'upcoming' && (
          upcoming.length > 0 ? (
            upcoming.map((item) => (
              <div
                key={item.revision.id}
                className="p-4 rounded-xl bg-zinc-900/30 border border-zinc-800 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-zinc-500 mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Scheduled for: <strong className="text-zinc-300">{item.revision.scheduledDate}</strong></span>
                    <span>• {item.problem.platform}</span>
                  </div>
                  <h3
                    onClick={() => onSelectProblem(item.problem.id)}
                    className="text-sm font-medium text-zinc-200 hover:text-white cursor-pointer"
                  >
                    {item.problem.name}
                  </h3>
                </div>

                <button
                  onClick={() => onSelectProblem(item.problem.id)}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs"
                >
                  View Problem
                </button>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500">
              No upcoming revisions scheduled.
            </div>
          )
        )}

        {activeTab === 'completed' && (
          completed.length > 0 ? (
            completed.map((item) => (
              <div
                key={item.revision.id}
                className="p-4 rounded-xl bg-zinc-900/20 border border-zinc-800/60 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="text-xs text-zinc-500 mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Completed on {item.revision.completedDate || 'Recently'}</span>
                  </div>
                  <h3
                    onClick={() => onSelectProblem(item.problem.id)}
                    className="text-sm font-medium text-zinc-300 hover:text-white cursor-pointer"
                  >
                    {item.problem.name}
                  </h3>
                </div>

                <span className="text-xs font-mono text-zinc-500">
                  {item.problem.platform} • Rating {item.problem.rating || 'N/A'}
                </span>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-xs text-zinc-500">
              No completed revisions recorded yet.
            </div>
          )
        )}
      </div>
    </div>
  );
};
