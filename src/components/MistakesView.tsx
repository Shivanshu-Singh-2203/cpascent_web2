// src/components/MistakesView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  AlertTriangle,
  Trash2,
  ExternalLink,
  BookOpen,
  Filter,
  Lightbulb,
} from 'lucide-react';

interface MistakesViewProps {
  onSelectProblem: (id: number) => void;
}

export const MistakesView: React.FC<MistakesViewProps> = ({ onSelectProblem }) => {
  const { user } = useAuth();
  const [mistakes, setMistakes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<string>('All');

  const fetchMistakes = async () => {
    try {
      const res = await apiFetch('/api/mistakes');
      setMistakes(res.mistakes || []);
    } catch (err) {
      console.error('Failed to load mistakes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMistakes();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleDelete = async (id: number) => {
    try {
      await apiFetch(`/api/mistakes/${id}`, { method: 'DELETE' });
      setMistakes((prev) => prev.filter((m) => m.mistake.id !== id));
    } catch (err) {
      console.error('Failed to delete mistake:', err);
    }
  };

  const categories = [
    'All',
    'Implementation',
    'Logic',
    'Complexity',
    'Edge Case',
    'Math',
    'Wrong Observation',
    'Wrong Algorithm',
    'Syntax',
    'Overflow',
    'Misread Problem',
  ];

  const filtered = filterCategory === 'All'
    ? mistakes
    : mistakes.filter((m) => m.mistake.category === filterCategory);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Mistake Journal</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Sign in to attach reflections, categorization, and lessons learned to your failed or tricky problem attempts.
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
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <span>Mistake Journal</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            "Those who cannot remember the past are condemned to repeat it." Track failure patterns and core takeaways.
          </p>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-zinc-500" />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mistakes list */}
      <div className="space-y-4">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.mistake.id}
              className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.mistake.category}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <span className="text-xs font-mono text-zinc-500">
                      {item.problem.platform} • Rating {item.problem.rating || 'N/A'}
                    </span>
                  </div>
                  <h3
                    onClick={() => onSelectProblem(item.problem.id)}
                    className="text-sm font-bold text-white hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    Problem: {item.problem.name}
                  </h3>
                </div>

                <button
                  onClick={() => handleDelete(item.mistake.id)}
                  className="p-1.5 rounded-lg bg-zinc-950 text-zinc-500 hover:text-red-400 transition-colors"
                  title="Delete mistake"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {/* Mistake Note */}
              <div className="p-3 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-xs text-zinc-300">
                <span className="text-[10px] uppercase font-mono text-rose-400 font-semibold block mb-1">
                  Mistake:
                </span>
                <p className="leading-relaxed">{item.mistake.mistakeNote}</p>
              </div>

              {/* Lesson Learned */}
              {item.mistake.lessonNote && (
                <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-900/30 text-xs text-emerald-300">
                  <span className="text-[10px] uppercase font-mono text-emerald-400 font-semibold block mb-1 flex items-center gap-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>Lesson Learned:</span>
                  </span>
                  <p className="leading-relaxed">{item.mistake.lessonNote}</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="py-16 text-center rounded-2xl border border-zinc-800 bg-zinc-950/40 text-xs text-zinc-500">
            No mistakes recorded under this category yet. When you hit a WA or TLE, click "Details" on any problem to log it!
          </div>
        )}
      </div>
    </div>
  );
};
