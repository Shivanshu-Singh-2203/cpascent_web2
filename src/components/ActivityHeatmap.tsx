// src/components/ActivityHeatmap.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Flame,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  Plus,
} from 'lucide-react';

export const ActivityHeatmap: React.FC = () => {
  const { user, streak, refreshUser } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [activeThisMonth, setActiveThisMonth] = useState(0);
  const [problemsThisMonth, setProblemsThisMonth] = useState(0);
  const [loading, setLoading] = useState(true);
  const [studyMinutesInput, setStudyMinutesInput] = useState(30);
  const [loggingStudy, setLoggingStudy] = useState(false);
  const [logSuccess, setLogSuccess] = useState(false);

  const fetchActivity = async () => {
    try {
      const res = await apiFetch('/api/activity');
      setActivities(res.activities || []);
      setActiveThisMonth(res.activeThisMonth || 0);
      setProblemsThisMonth(res.problemsThisMonth || 0);
    } catch (err) {
      console.error('Failed to load activity heatmap:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchActivity();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleLogStudyTime = async (minutes: number) => {
    setLoggingStudy(true);
    try {
      await apiFetch('/api/activity/log', {
        method: 'POST',
        body: JSON.stringify({ minutes }),
      });
      setLogSuccess(true);
      await fetchActivity();
      await refreshUser();
      setTimeout(() => setLogSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to log study time:', err);
    } finally {
      setLoggingStudy(false);
    }
  };

  // Build 52 weeks (364 days) of grid cells
  const activityMap = new Map<string, any>();
  for (const a of activities) {
    activityMap.set(a.activityDate, a);
  }

  const days: { dateStr: string; dayOfWeek: number; count: number; data: any }[] = [];
  const today = new Date();

  // 52 weeks = 364 days
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const item = activityMap.get(dateStr);
    const count = item ? (item.problemsSolved || 0) + (item.resourcesCompleted || 0) + (item.studyMinutes > 0 ? 1 : 0) : 0;
    days.push({
      dateStr,
      dayOfWeek: d.getDay(), // 0 = Sun, 1 = Mon ...
      count,
      data: item,
    });
  }

  // Group by weeks
  const weeks: typeof days[] = [];
  let currentWeek: typeof days = [];

  for (const d of days) {
    currentWeek.push(d);
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) {
    weeks.push(currentWeek);
  }

  const getCellColor = (count: number) => {
    if (count === 0) return 'bg-zinc-900 border-zinc-800';
    if (count === 1) return 'bg-emerald-950 border-emerald-800/60 text-emerald-400';
    if (count <= 3) return 'bg-emerald-800 border-emerald-700/80 text-emerald-300';
    if (count <= 5) return 'bg-emerald-600 border-emerald-500 text-white';
    return 'bg-emerald-400 border-emerald-300 text-zinc-950';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-emerald-400" />
            <span>Consistency & Streak Tracker</span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
          </p>
        </div>

        {/* Quick Log Study Time */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleLogStudyTime(30)}
            disabled={loggingStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-medium cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+30m Study</span>
          </button>
          <button
            onClick={() => handleLogStudyTime(60)}
            disabled={loggingStudy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+60m Study</span>
          </button>
        </div>
      </div>

      {/* Streak Details Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">CURRENT STREAK</div>
          <div className="text-2xl font-bold text-white flex items-center gap-2">
            <Flame className="w-6 h-6 text-amber-500 fill-amber-500" />
            <span>{streak.currentStreak} Days</span>
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Consequent active days</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">LONGEST STREAK</div>
          <div className="text-2xl font-bold text-white">
            {streak.longestStreak} Days
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Personal all-time record</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">ACTIVE THIS MONTH</div>
          <div className="text-2xl font-bold text-white">
            {activeThisMonth} / 30 Days
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Meaningful study or practice</div>
        </div>

        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800">
          <div className="text-xs text-zinc-400 mb-1 font-medium">PROBLEMS THIS MONTH</div>
          <div className="text-2xl font-bold text-emerald-400 font-mono">
            {problemsThisMonth}
          </div>
          <div className="text-[11px] text-zinc-500 mt-1">Total solved problems</div>
        </div>
      </div>

      {/* GitHub-style Heatmap */}
      <div className="p-6 rounded-2xl bg-zinc-900/40 border border-zinc-800 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm font-bold text-white">365-Day Practice Activity</div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <span>Less</span>
            <div className="flex gap-1">
              <span className="w-3 h-3 rounded-sm bg-zinc-900 border border-zinc-800"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-950 border border-emerald-800/60"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-800 border border-emerald-700/80"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-600 border border-emerald-500"></span>
              <span className="w-3 h-3 rounded-sm bg-emerald-400 border border-emerald-300"></span>
            </div>
            <span>More</span>
          </div>
        </div>

        {/* Heatmap Grid Container */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-1 min-w-[750px]">
            {weeks.map((week, wIdx) => (
              <div key={wIdx} className="flex flex-col gap-1">
                {week.map((day) => {
                  const cellColor = getCellColor(day.count);
                  const tip = `${day.dateStr}: ${
                    day.data
                      ? `${day.data.problemsSolved || 0} solved, ${day.data.studyMinutes || 0}m study`
                      : 'No activity'
                  }`;

                  return (
                    <div
                      key={day.dateStr}
                      title={tip}
                      className={`w-3.5 h-3.5 rounded-sm border transition-all cursor-pointer hover:scale-125 ${cellColor}`}
                    ></div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="text-xs text-zinc-500 pt-1">
          Each day counts when you solve a problem, study an article or video, complete a scheduled revision, or log a study session.
        </div>
      </div>
    </div>
  );
};
