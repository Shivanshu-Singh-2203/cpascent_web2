// src/components/TopicModal.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  BookOpen,
  CheckCircle2,
  ExternalLink,
  Bookmark,
  Clock,
  Sparkles,
  Layers,
  ArrowRight,
  Flame,
  Check,
  RotateCcw,
  Star,
  AlertCircle,
} from 'lucide-react';

interface TopicModalProps {
  slug: string;
  onClose: () => void;
  onSelectProblem: (id: number) => void;
}

export const TopicModal: React.FC<TopicModalProps> = ({ slug, onClose, onSelectProblem }) => {
  const { user, refreshUser } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'problems' | 'resources'>('problems');
  const [updatingProblemId, setUpdatingProblemId] = useState<number | null>(null);

  const fetchTopic = async () => {
    try {
      const res = await apiFetch(`/api/topics/${slug}`);
      setData(res);
    } catch (err) {
      console.error('Failed to load topic details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopic();
  }, [slug]);

  const handleUpdateStatus = async (problemId: number, status: string) => {
    if (!user) return;
    setUpdatingProblemId(problemId);
    try {
      await apiFetch(`/api/problems/${problemId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status }),
      });
      await fetchTopic();
      await refreshUser();
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingProblemId(null);
    }
  };

  const handleToggleResource = async (resourceId: number, currentStatus: string) => {
    if (!user) return;
    const nextStatus = currentStatus === 'completed' ? 'saved' : 'completed';
    try {
      await apiFetch(`/api/resources/${resourceId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: nextStatus }),
      });
      await fetchTopic();
      await refreshUser();
    } catch (err) {
      console.error('Failed to update resource status:', err);
    }
  };

  const getRatingBadgeColor = (rating?: number) => {
    if (!rating) return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (rating < 1200) return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (rating < 1400) return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
    if (rating < 1600) return 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50';
    if (rating < 1900) return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
    if (rating < 2100) return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
    if (rating < 2300) return 'bg-amber-950/60 text-amber-400 border-amber-800/50';
    return 'bg-red-950/60 text-red-400 border-red-800/50';
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-400 font-mono">Loading topic details...</div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const { topic, subtopics, resources, problems, stats } = data;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800/80 bg-zinc-900/50 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {topic.stage}
              </span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">{topic.category}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs text-zinc-400">~{topic.estimatedHours} Hours</span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">{topic.title}</h2>
            <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">{topic.description}</p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Subtopics */}
        <div className="px-6 py-4 bg-zinc-900/30 border-b border-zinc-800/60 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="text-xs font-medium text-zinc-300">
              Mastery: <span className="font-mono font-bold text-emerald-400">{stats.masteryPercent}%</span> ({stats.solvedProblems}/{stats.totalProblems} solved)
            </div>
            <div className="w-32 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${stats.masteryPercent}%` }}
              ></div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {subtopics.map((st: any) => (
              <span
                key={st.id}
                className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 whitespace-nowrap"
              >
                {st.title}
              </span>
            ))}
          </div>
        </div>

        {/* Tabs: Problems vs Resources */}
        <div className="px-6 pt-3 border-b border-zinc-800 flex gap-4">
          <button
            onClick={() => setActiveTab('problems')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'problems'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <span>Problems ({problems.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('resources')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 transition-colors border-b-2 cursor-pointer ${
              activeTab === 'resources'
                ? 'border-emerald-500 text-white'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Theory & Resources ({resources.length})</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {activeTab === 'problems' ? (
            problems.length > 0 ? (
              problems.map((prob: any, idx: number) => {
                const status = prob.userStatus?.status || 'unseen';
                const isSolved = status === 'solved' || status === 'mastered';

                return (
                  <div
                    key={prob.id}
                    className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 ${
                      isSolved
                        ? 'bg-emerald-950/10 border-emerald-900/30'
                        : 'bg-zinc-900/40 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono font-bold text-zinc-600 mt-0.5">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => onSelectProblem(prob.id)}
                            className="text-xs font-bold text-zinc-100 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            {prob.name}
                          </span>
                          <a
                            href={prob.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300"
                            title="Open official problem"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-zinc-400 uppercase font-semibold">
                            {prob.platform}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-[10px] text-zinc-500">
                            {prob.difficulty} • ~{prob.estimatedTimeMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions and Status */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {prob.rating && (
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${getRatingBadgeColor(
                            prob.rating
                          )}`}
                        >
                          {prob.rating}
                        </span>
                      )}

                      {/* Status Badges & Quick Toggles */}
                      <div className="flex items-center gap-1 bg-zinc-900 p-0.5 rounded-lg border border-zinc-800">
                        <button
                          onClick={() => handleUpdateStatus(prob.id, isSolved ? 'unseen' : 'solved')}
                          disabled={updatingProblemId === prob.id}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                            isSolved
                              ? 'bg-emerald-600 text-white font-semibold'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          {isSolved ? '✓ Solved' : '○ Mark Solved'}
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(prob.id, status === 'revisit' ? 'unseen' : 'revisit')}
                          className={`px-1.5 py-1 rounded text-[11px] transition-colors cursor-pointer ${
                            status === 'revisit'
                              ? 'bg-amber-600 text-white'
                              : 'text-zinc-400 hover:text-zinc-200'
                          }`}
                          title="Mark for revisit"
                        >
                          ↻
                        </button>
                        <button
                          onClick={() => onSelectProblem(prob.id)}
                          className="px-2 py-1 rounded text-[11px] text-zinc-400 hover:text-white"
                          title="Open notes, timer & mistake logger"
                        >
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-xs text-zinc-500">
                No problems listed for this topic yet.
              </div>
            )
          ) : (
            resources.length > 0 ? (
              resources.map((res: any) => {
                const isCompleted = res.userStatus?.status === 'completed';

                return (
                  <div
                    key={res.id}
                    className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                          {res.type}
                        </span>
                        <a
                          href={res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-1.5"
                        >
                          <span>{res.title}</span>
                          <ExternalLink className="w-3 h-3 text-zinc-500" />
                        </a>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">{res.description}</p>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        Author: <strong className="text-zinc-400">{res.author}</strong> • Stage: {res.recommendedStage}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={() => handleToggleResource(res.id, res.userStatus?.status || 'saved')}
                        className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                        }`}
                      >
                        {isCompleted ? '✓ Completed' : 'Mark Completed'}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-10 text-xs text-zinc-500">
                No resources listed for this topic yet.
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
