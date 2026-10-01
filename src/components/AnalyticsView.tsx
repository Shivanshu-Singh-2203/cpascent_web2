// src/components/AnalyticsView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  BarChart3,
  PieChart,
  CheckCircle2,
  Clock,
  TrendingUp,
  Award,
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { user } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await apiFetch('/api/analytics');
        setData(res);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchAnalytics();
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <BarChart3 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">Practice Analytics</h2>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Sign in to view your rating distribution, platform breakdowns, and performance analytics.
        </p>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const {
    totalSolved,
    totalAttempted,
    successRate,
    avgSolveTime,
    totalStudyMinutes,
    ratingDistribution = {},
    platformDistribution = {},
  } = data;

  const maxRatingCount = Math.max(...Object.values(ratingDistribution as Record<string, number>), 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span>Performance & Practice Analytics</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Detailed metrics across ratings, platforms, and problem solving efficiency
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">TOTAL SOLVED</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalSolved}</div>
          <div className="text-[11px] text-zinc-500 mt-1">{totalAttempted} attempted</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">SUCCESS RATE</div>
          <div className="text-2xl font-bold text-white font-mono">{successRate}%</div>
          <div className="text-[11px] text-zinc-500 mt-1">Solved / Tracked problems</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">AVG TIME PER PROBLEM</div>
          <div className="text-2xl font-bold text-white font-mono">{avgSolveTime} min</div>
          <div className="text-[11px] text-zinc-500 mt-1">Median implementation time</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">TOTAL STUDY TIME</div>
          <div className="text-2xl font-bold text-white font-mono">
            {Math.round(totalStudyMinutes / 60)} hrs
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">{totalStudyMinutes} minutes tracked</div>
        </div>
      </div>

      {/* Rating Distribution Bar Chart */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white">Problem Difficulty Distribution</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Breakdown of your solved problems by Codeforces-equivalent difficulty rating brackets
          </p>
        </div>

        <div className="space-y-3 pt-2">
          {Object.entries(ratingDistribution).map(([bracket, count]) => {
            const numCount = Number(count);
            const percentage = Math.round((numCount / maxRatingCount) * 100);

            return (
              <div key={bracket} className="flex items-center gap-4 text-xs">
                <div className="w-24 font-mono font-medium text-zinc-400 whitespace-nowrap">
                  {bracket}
                </div>
                <div className="flex-1 bg-zinc-950 h-5 rounded-md overflow-hidden p-0.5 border border-zinc-800/80">
                  <div
                    className="bg-emerald-500/80 h-full rounded transition-all duration-500"
                    style={{ width: `${Math.max(percentage, numCount > 0 ? 3 : 0)}%` }}
                  ></div>
                </div>
                <div className="w-10 font-mono text-right text-zinc-300 font-bold">
                  {numCount}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform Distribution */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white">Platform Statistics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Problems tracked and solved across competitive programming platforms
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {Object.entries(platformDistribution).map(([plat, count]) => (
            <div
              key={plat}
              className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-center"
            >
              <div className="text-xs font-mono font-semibold uppercase text-zinc-400 mb-1">
                {plat}
              </div>
              <div className="text-xl font-bold font-mono text-emerald-400">
                {Number(count)}
              </div>
              <div className="text-[10px] text-zinc-500 mt-1">Solved</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
