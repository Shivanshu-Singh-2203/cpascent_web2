// src/components/ResourcesView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  BookOpen,
  ExternalLink,
  Search,
  CheckCircle2,
  Bookmark,
  Video,
  FileText,
  Compass,
} from 'lucide-react';

export const ResourcesView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchResources = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (typeFilter !== 'all') params.append('type', typeFilter);

      const res = await apiFetch(`/api/resources?${params.toString()}`);
      setResources(res.resources || []);
    } catch (err) {
      console.error('Failed to load resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, [typeFilter]);

  const handleUpdateStatus = async (resourceId: number, newStatus: string) => {
    if (!user) return;
    try {
      await apiFetch(`/api/resources/${resourceId}/status`, {
        method: 'POST',
        body: JSON.stringify({ status: newStatus }),
      });
      setResources((prev) =>
        prev.map((r) =>
          r.id === resourceId
            ? { ...r, userStatus: { ...r.userStatus, status: newStatus } }
            : r
        )
      );
      await refreshUser();
    } catch (err) {
      console.error('Failed to update resource status:', err);
    }
  };

  const filtered = statusFilter === 'all'
    ? resources
    : resources.filter((r) => r.userStatus?.status === statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-emerald-400" />
            <span>Learning Resources & Library</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Curated articles, books, video lectures, USACO Guide, CP-Algorithms, and KACTL references
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchResources()}
            placeholder="Search resources, topics, or authors..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">All Types</option>
            <option value="Article">Articles</option>
            <option value="Book">Books</option>
            <option value="Video">Videos</option>
            <option value="Course">Courses</option>
            <option value="Reference">References</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="saved">Saved</option>
            <option value="learning">Currently Learning</option>
            <option value="completed">Completed</option>
            <option value="revisit">Revisit</option>
          </select>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((item) => {
          const status = item.userStatus?.status || 'unseen';

          return (
            <div
              key={item.id}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300">
                      {item.type}
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {item.recommendedStage}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-zinc-500">
                    {item.difficulty}
                  </span>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white hover:text-emerald-400 transition-colors flex items-center gap-2"
                >
                  <span>{item.title}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </a>

                <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                  {item.description}
                </p>

                <div className="text-[11px] text-zinc-500 mt-3">
                  Author: <strong className="text-zinc-300">{item.author}</strong>
                </div>
              </div>

              {/* Status Select */}
              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Personal Status:</span>
                <select
                  value={status}
                  onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                  className="px-2.5 py-1 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none cursor-pointer"
                >
                  <option value="unseen">○ Not Started</option>
                  <option value="saved">🔖 Saved</option>
                  <option value="learning">📖 Currently Learning</option>
                  <option value="completed">✓ Completed</option>
                  <option value="revisit">↻ Revisit</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
