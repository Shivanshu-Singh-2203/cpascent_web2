// src/components/ProblemDetailModal.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  X,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCcw,
  AlertTriangle,
  FileText,
  Star,
  Check,
  Save,
} from 'lucide-react';

interface ProblemDetailModalProps {
  problemId: number;
  onClose: () => void;
  onStatusUpdated?: () => void;
}

export const ProblemDetailModal: React.FC<ProblemDetailModalProps> = ({
  problemId,
  onClose,
  onStatusUpdated,
}) => {
  const { user, refreshUser } = useAuth();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Tracking form state
  const [status, setStatus] = useState('unseen');
  const [solvedIndependently, setSolvedIndependently] = useState(true);
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(30);
  const [personalDifficulty, setPersonalDifficulty] = useState('Medium');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Revision state
  const [revisionDays, setRevisionDays] = useState(3);
  const [revisionScheduled, setRevisionScheduled] = useState(false);

  // Mistake logger state
  const [showMistakeForm, setShowMistakeForm] = useState(false);
  const [mistakeCategory, setMistakeCategory] = useState('Implementation');
  const [mistakeNote, setMistakeNote] = useState('');
  const [lessonNote, setLessonNote] = useState('');
  const [mistakeSaved, setMistakeSaved] = useState(false);

  const fetchProblemDetails = async () => {
    try {
      const res = await apiFetch(`/api/problems?search=${problemId}&limit=1`);
      // Find exact problem
      const p = res.problems?.find((item: any) => item.id === problemId);
      if (p) {
        setProblem(p);
        const us = p.userStatus;
        if (us) {
          setStatus(us.status || 'unseen');
          setSolvedIndependently(us.solvedIndependently ?? true);
          setTimeSpentMinutes(us.timeSpentMinutes || 30);
          setPersonalDifficulty(us.personalDifficulty || 'Medium');
          setNotes(us.notes || '');
        }
      }
    } catch (err) {
      console.error('Failed to load problem details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblemDetails();
  }, [problemId]);

  const handleSaveTracking = async () => {
    if (!user) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      await apiFetch(`/api/problems/${problemId}/status`, {
        method: 'POST',
        body: JSON.stringify({
          status,
          solvedIndependently,
          timeSpentMinutes: Number(timeSpentMinutes),
          personalDifficulty,
          notes,
        }),
      });
      setSaveSuccess(true);
      await refreshUser();
      if (onStatusUpdated) onStatusUpdated();
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to save problem tracking:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleScheduleRevision = async () => {
    if (!user) return;
    try {
      await apiFetch('/api/revisions', {
        method: 'POST',
        body: JSON.stringify({
          problemId,
          intervalDays: Number(revisionDays),
          notes: `Scheduled review in ${revisionDays} days`,
        }),
      });
      setRevisionScheduled(true);
      setTimeout(() => setRevisionScheduled(false), 3000);
    } catch (err) {
      console.error('Failed to schedule revision:', err);
    }
  };

  const handleLogMistake = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !mistakeNote) return;
    try {
      await apiFetch('/api/mistakes', {
        method: 'POST',
        body: JSON.stringify({
          problemId,
          category: mistakeCategory,
          mistakeNote,
          lessonNote,
        }),
      });
      setMistakeSaved(true);
      setMistakeNote('');
      setLessonNote('');
      setTimeout(() => setMistakeSaved(false), 3000);
    } catch (err) {
      console.error('Failed to log mistake:', err);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-2xl flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-400 font-mono">Loading problem details...</div>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/40 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-zinc-800 text-zinc-300">
                {problem.platform}
              </span>
              {problem.rating && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                  Rating: {problem.rating}
                </span>
              )}
              <span className="text-[10px] text-zinc-500">{problem.curriculumStage}</span>
            </div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span>{problem.name}</span>
              <a
                href={problem.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-500 hover:text-emerald-400 transition-colors"
                title="Open problem in new tab"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </h2>
            <div className="text-xs text-zinc-400 mt-1">
              Estimated: ~{problem.estimatedTimeMinutes} min • Problem ID: <span className="font-mono text-zinc-300">{problem.problemId}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Status & Tracking Section */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-4">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Personal Tracking & Progress</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                >
                  <option value="unseen">○ Unseen</option>
                  <option value="attempted">◐ Attempted</option>
                  <option value="solved">✓ Solved</option>
                  <option value="failed">✗ Failed</option>
                  <option value="revisit">↻ Revisit</option>
                  <option value="mastered">★ Mastered</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Time Spent (Minutes)
                </label>
                <input
                  type="number"
                  value={timeSpentMinutes}
                  onChange={(e) => setTimeSpentMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                  Perceived Difficulty
                </label>
                <select
                  value={personalDifficulty}
                  onChange={(e) => setPersonalDifficulty(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
                >
                  <option value="Very Easy">Very Easy</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                  <option value="Extremely Hard">Extremely Hard</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="independent"
                checked={solvedIndependently}
                onChange={(e) => setSolvedIndependently(e.target.checked)}
                className="w-4 h-4 rounded bg-zinc-950 border-zinc-700 text-emerald-600 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="independent" className="text-zinc-300 cursor-pointer">
                Solved independently without hints / editorial
              </label>
            </div>

            <div>
              <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                Personal Notes & Implementation Observations
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key observations, recurrence relations, corner cases handled, complexity bounds..."
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-emerald-400">
                {saveSuccess && '✓ Tracking updated successfully!'}
              </span>
              <button
                onClick={handleSaveTracking}
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Saving...' : 'Save Progress'}</span>
              </button>
            </div>
          </div>

          {/* Spaced Revision Scheduler */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <h3 className="font-bold text-sm text-white flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-indigo-400" />
              <span>Schedule Spaced Revision</span>
            </h3>
            <p className="text-zinc-400 leading-relaxed text-xs">
              Add this problem to your revision queue to reinforce the pattern through spaced repetition.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              {[1, 3, 7, 14, 30, 60].map((days) => (
                <button
                  key={days}
                  onClick={() => setRevisionDays(days)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                    revisionDays === days
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
                  }`}
                >
                  +{days} Days
                </button>
              ))}

              <button
                onClick={handleScheduleRevision}
                className="ml-auto px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition-colors cursor-pointer"
              >
                Schedule
              </button>
            </div>

            {revisionScheduled && (
              <div className="text-indigo-400 text-xs font-medium pt-1">
                ✓ Problem added to revision queue!
              </div>
            )}
          </div>

          {/* Mistake Journal Logger */}
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Mistake Journal</span>
              </h3>
              <button
                onClick={() => setShowMistakeForm(!showMistakeForm)}
                className="text-amber-400 hover:underline text-xs"
              >
                {showMistakeForm ? 'Hide Form' : '+ Log Mistake'}
              </button>
            </div>

            {showMistakeForm && (
              <form onSubmit={handleLogMistake} className="space-y-3 pt-2">
                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                    Mistake Category
                  </label>
                  <select
                    value={mistakeCategory}
                    onChange={(e) => setMistakeCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 focus:outline-none"
                  >
                    <option value="Implementation">Implementation</option>
                    <option value="Logic">Logic</option>
                    <option value="Complexity">Complexity / TLE</option>
                    <option value="Edge Case">Edge Case</option>
                    <option value="Math">Math</option>
                    <option value="Wrong Observation">Wrong Observation</option>
                    <option value="Wrong Algorithm">Wrong Algorithm</option>
                    <option value="Syntax">Syntax</option>
                    <option value="Overflow">Integer Overflow</option>
                    <option value="Misread Problem">Misread Problem Statement</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                    What mistake was made?
                  </label>
                  <textarea
                    value={mistakeNote}
                    onChange={(e) => setMistakeNote(e.target.value)}
                    placeholder="e.g. I used O(N^2) instead of recognizing prefix sums / did not use long long for 10^18 products..."
                    rows={2}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-mono text-zinc-400 block mb-1">
                    Lesson learned / Rule to remember
                  </label>
                  <textarea
                    value={lessonNote}
                    onChange={(e) => setLessonNote(e.target.value)}
                    placeholder="e.g. Always check if constraints allow 64-bit int; verify monotonicity before binary search..."
                    rows={2}
                    className="w-full px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-200 placeholder-zinc-600 focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-amber-400 text-xs">
                    {mistakeSaved && '✓ Mistake logged to your journal!'}
                  </span>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors cursor-pointer"
                  >
                    Save Mistake
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
