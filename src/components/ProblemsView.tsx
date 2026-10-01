// src/components/ProblemsView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Search,
  Filter,
  CheckSquare,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock,
  RotateCcw,
  Star,
  XCircle,
  HelpCircle,
} from 'lucide-react';

interface ProblemsViewProps {
  onSelectProblem: (id: number) => void;
}

export const ProblemsView: React.FC<ProblemsViewProps> = ({ onSelectProblem }) => {
  const { user, refreshUser } = useAuth();
  const [problems, setProblems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [stage, setStage] = useState('all');
  const [status, setStatus] = useState('all');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: '40',
      });
      if (search) params.append('search', search);
      if (platform !== 'all') params.append('platform', platform);
      if (stage !== 'all') params.append('stage', stage);
      if (status !== 'all') params.append('status', status);
      if (minRating) params.append('minRating', minRating);
      if (maxRating) params.append('maxRating', maxRating);

      const res = await apiFetch(`/api/problems?${params.toString()}`);
      setProblems(res.problems || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to load problems:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, [page, platform, stage, status]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProblems();
  };

  const handleUpdateStatus = async (problemId: number, newStatus: string) => {
    if (!user) return;
    try {
      await apiFetch(`/api/problems/${problemId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });
      // Update local state
      setProblems((prev) =>
        prev.map((p) =>
          p.id === problemId
            ? { ...p, userStatus: { ...p.userStatus, status: newStatus } }
            : p
        )
      );
      await refreshUser();
    } catch (err) {
      console.error('Failed to update problem status:', err);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CheckSquare className="w-6 h-6 text-emerald-400" />
            <span>Problem Database</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated verifiable competitive programming tasks ({total} total problems)
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search problem by name, Codeforces contest ID (e.g., 1700A), or topic..."
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Search
          </button>
        </form>

        {/* Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
          <div>
            <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
              Platform
            </label>
            <select
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none"
            >
              <option value="all">All Platforms</option>
              <option value="Codeforces">Codeforces</option>
              <option value="AtCoder">AtCoder</option>
              <option value="CSES">CSES</option>
              <option value="USACO">USACO</option>
              <option value="LeetCode">LeetCode</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
              Stage
            </label>
            <select
              value={stage}
              onChange={(e) => {
                setStage(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none"
            >
              <option value="all">All Stages</option>
              <option value="Newbie">Newbie (0–999)</option>
              <option value="Pupil">Pupil (1000–1199)</option>
              <option value="Specialist">Specialist (1200–1399)</option>
              <option value="Expert">Expert (1400–1599)</option>
              <option value="Candidate Master">Candidate Master (1600–1899)</option>
              <option value="Master">Master (1900–2099)</option>
              <option value="International Master">International Master (2100–2299)</option>
              <option value="Grandmaster">Grandmaster (2300+)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setPage(1);
              }}
              className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="solved">✓ Solved</option>
              <option value="mastered">★ Mastered</option>
              <option value="attempted">Attempted</option>
              <option value="failed">✗ Failed</option>
              <option value="revisit">↻ Revisit</option>
              <option value="unseen">○ Unseen</option>
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                Min Rating
              </label>
              <input
                type="number"
                value={minRating}
                placeholder="800"
                onChange={(e) => setMinRating(e.target.value)}
                onBlur={fetchProblems}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase font-mono text-zinc-500 block mb-1">
                Max Rating
              </label>
              <input
                type="number"
                value={maxRating}
                placeholder="2400"
                onChange={(e) => setMaxRating(e.target.value)}
                onBlur={fetchProblems}
                className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-300 text-xs focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Problems Table / List */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="text-xs text-zinc-500 font-mono">Loading problems...</div>
          </div>
        ) : problems.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/60 border-b border-zinc-800 text-zinc-400 uppercase font-mono text-[10px]">
                <tr>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Problem</th>
                  <th className="py-3 px-4">Platform</th>
                  <th className="py-3 px-4">Rating</th>
                  <th className="py-3 px-4">Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {problems.map((prob) => {
                  const pStatus = prob.userStatus?.status || 'unseen';
                  const isSolved = pStatus === 'solved' || pStatus === 'mastered';

                  return (
                    <tr
                      key={prob.id}
                      className={`hover:bg-zinc-900/40 transition-colors ${
                        isSolved ? 'bg-emerald-950/10' : ''
                      }`}
                    >
                      <td className="py-3 px-4 whitespace-nowrap">
                        <select
                          value={pStatus}
                          onChange={(e) => handleUpdateStatus(prob.id, e.target.value)}
                          className={`px-2 py-1 rounded text-[11px] font-medium border bg-zinc-900 focus:outline-none cursor-pointer ${
                            isSolved
                              ? 'text-emerald-400 border-emerald-800/60'
                              : pStatus === 'revisit'
                              ? 'text-amber-400 border-amber-800/60'
                              : pStatus === 'failed'
                              ? 'text-rose-400 border-rose-800/60'
                              : 'text-zinc-400 border-zinc-800'
                          }`}
                        >
                          <option value="unseen">○ Unseen</option>
                          <option value="attempted">◐ Attempted</option>
                          <option value="solved">✓ Solved</option>
                          <option value="failed">✗ Failed</option>
                          <option value="revisit">↻ Revisit</option>
                          <option value="mastered">★ Mastered</option>
                        </select>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span
                            onClick={() => onSelectProblem(prob.id)}
                            className="font-semibold text-zinc-100 hover:text-emerald-400 transition-colors cursor-pointer"
                          >
                            {prob.name}
                          </span>
                          <a
                            href={prob.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300"
                            title="Open original problem"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="text-[10px] text-zinc-500 mt-0.5">
                          ID: <span className="font-mono">{prob.problemId}</span> • ~{prob.estimatedTimeMinutes} min
                        </div>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-[10px] font-mono uppercase text-zinc-400 font-semibold">
                          {prob.platform}
                        </span>
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap">
                        {prob.rating ? (
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${getRatingBadgeColor(
                              prob.rating
                            )}`}
                          >
                            {prob.rating}
                          </span>
                        ) : (
                          <span className="text-zinc-500 text-[11px]">—</span>
                        )}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-zinc-400 text-[11px]">
                        {prob.curriculumStage}
                      </td>

                      <td className="py-3 px-4 whitespace-nowrap text-right">
                        <button
                          onClick={() => onSelectProblem(prob.id)}
                          className="px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-[11px] font-medium transition-colors"
                        >
                          Notes & Log
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-16 text-center text-xs text-zinc-500">
            No problems match the selected filters.
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-zinc-800/80 bg-zinc-900/30 flex items-center justify-between text-xs text-zinc-400">
            <div>
              Page <strong className="text-white">{page}</strong> of <strong className="text-white">{totalPages}</strong> ({total} total)
            </div>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-zinc-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 disabled:opacity-40 disabled:pointer-events-none text-zinc-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
