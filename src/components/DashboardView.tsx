// src/components/DashboardView.tsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { apiFetch } from '../lib/api.ts';
import {
  Flame,
  CheckCircle2,
  Clock,
  RotateCcw,
  ArrowRight,
  ExternalLink,
  Target,
  Sparkles,
  BookOpen,
  Calendar,
  Award,
  ChevronRight,
} from 'lucide-react';

interface DashboardProps {
  onSelectTopic: (slug: string) => void;
  onNavigate: (tab: string) => void;
  onSelectProblem: (problemId: number) => void;
}

export const DashboardView: React.FC<DashboardProps> = ({
  onSelectTopic,
  onNavigate,
  onSelectProblem,
}) => {
  const { user, profile, streak, dailyGoal, signIn } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      const res = await apiFetch('/api/dashboard');
      setData(res);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboard();
    } else {
      setLoading(false);
    }
  }, [user]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getRatingBadgeColor = (rating?: number) => {
    if (!rating) return 'bg-zinc-800 text-zinc-300 border-zinc-700';
    if (rating < 1200) return 'bg-zinc-800/80 text-zinc-300 border-zinc-700';
    if (rating < 1400) return 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50';
    if (rating < 1600) return 'bg-cyan-950/60 text-cyan-400 border-cyan-800/50';
    if (rating < 1900) return 'bg-blue-950/60 text-blue-400 border-blue-800/50';
    if (rating < 2100) return 'bg-purple-950/60 text-purple-400 border-purple-800/50';
    if (rating < 2300) return 'bg-amber-950/60 text-amber-400 border-amber-800/50';
    return 'bg-red-950/60 text-red-400 border-red-800/50';
  };

  if (!user) {
    return (
      <div className="py-12 px-4 max-w-4xl mx-auto text-center">
        <div className="inline-flex p-3 rounded-2xl bg-zinc-900 border border-zinc-800 mb-6">
          <Award className="w-10 h-10 text-emerald-400" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-4">
          WELCOME TO CP JOURNEY
        </h1>
        <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8">
          The structured roadmap, curated 1000+ problem database, and revision tracker designed to take you systematically from <span className="text-zinc-200 font-semibold">Newbie</span> to <span className="text-red-400 font-semibold">Grandmaster</span>.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto mb-10 text-left">
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-emerald-400 font-mono text-sm font-semibold mb-1">01. Curriculum</div>
            <div className="text-zinc-200 text-sm font-medium">8 Codeforces Ranks</div>
            <p className="text-xs text-zinc-500 mt-1">From Basic Syntax to Centroid Trees and FFT.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-cyan-400 font-mono text-sm font-semibold mb-1">02. Practice</div>
            <div className="text-zinc-200 text-sm font-medium">1000+ Curated Tasks</div>
            <p className="text-xs text-zinc-500 mt-1">Real verifiable problems from CF, CSES, and AtCoder.</p>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800">
            <div className="text-purple-400 font-mono text-sm font-semibold mb-1">03. Consistency</div>
            <div className="text-zinc-200 text-sm font-medium">Spaced Revision</div>
            <p className="text-xs text-zinc-500 mt-1">Daily streaks, mistake logs, and revision queue.</p>
          </div>
        </div>

        <button
          onClick={signIn}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 transition-all cursor-pointer"
        >
          <span>Get Started with Google</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-500 font-mono">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  const {
    todayActivity,
    dueRevisionsCount,
    journeyPercentage,
    focusTopic,
    recommendedProblems,
    recentActivity,
  } = data;

  const currentLevel = profile?.currentLevel || 'Newbie';
  const targetLevel = profile?.targetLevel || 'Grandmaster';
  const username = profile?.cfHandle || user?.displayName || user?.email?.split('@')[0] || 'CPian';

  const goalProblems = dailyGoal?.problemsPerDay || 2;
  const goalMinutes = dailyGoal?.studyMinutesPerDay || 60;
  const problemsDone = todayActivity?.problemsSolved || 0;
  const minutesDone = todayActivity?.studyMinutes || 0;

  const goalCompleted =
    (problemsDone >= goalProblems ? 1 : 0) +
    (minutesDone >= goalMinutes ? 1 : 0) +
    (dueRevisionsCount === 0 || (todayActivity?.revisionsCompleted || 0) > 0 ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner: Greeting & Current Stage */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-800/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, <span className="text-emerald-400">{username}</span>
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            Focus: <span className="text-zinc-200 font-semibold">{currentLevel}</span> training path → Target: <span className="text-red-400 font-semibold">{targetLevel}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('journey')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 text-xs font-semibold transition-all"
          >
            <span>View Full Journey</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Grid: Main Stats & Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stage & Journey Progress */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span>CURRENT STAGE</span>
              <span className="font-mono text-emerald-400 font-semibold">{journeyPercentage}%</span>
            </div>
            <div className="text-xl font-bold text-white uppercase tracking-wider">
              {currentLevel}
            </div>
            <div className="text-xs text-zinc-500 mt-0.5">
              CP Journey Progress Level
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, journeyPercentage)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span>TODAY'S GOAL</span>
              <span className="font-mono text-zinc-300 font-semibold">{goalCompleted} / 3</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <span>{problemsDone} / {goalProblems} Problems</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-zinc-500" />
              <span>{minutesDone} / {goalMinutes} min studied</span>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
            <div className="flex-1 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-cyan-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.round((problemsDone / goalProblems) * 100))}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Current Streak */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span>STREAK</span>
              <span className="text-xs text-zinc-500">Max: {streak.longestStreak}d</span>
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span>{streak.currentStreak} Days</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Active daily study or practice
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
            >
              <span>View Activity Calendar</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Revision Queue */}
        <div className="p-5 rounded-xl bg-zinc-900/70 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-2 font-medium">
              <span>SPACED REVISION</span>
              {dueRevisionsCount > 0 ? (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  DUE
                </span>
              ) : (
                <span className="text-emerald-400 text-xs">Clear</span>
              )}
            </div>
            <div className="text-xl font-bold text-white flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-indigo-400" />
              <span>{dueRevisionsCount} Problems</span>
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              Scheduled for review today
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => onNavigate('revision')}
              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
            >
              <span>Open Revision Queue</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Focus: Continue Learning & Recommended Problems */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue Learning Banner */}
        <div className="lg:col-span-1 p-6 rounded-2xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-2">
              <Target className="w-4 h-4" />
              <span>Current Curriculum Focus</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">
              {focusTopic?.title || 'Programming Fundamentals'}
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3 mb-4">
              {focusTopic?.summary || 'Master core data structures and progressive problem patterns.'}
            </p>

            <div className="space-y-2 py-3 border-t border-zinc-800/80 text-xs text-zinc-400">
              <div className="flex items-center justify-between">
                <span>Stage:</span>
                <span className="text-zinc-200 font-semibold">{focusTopic?.stage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Estimated Time:</span>
                <span className="text-zinc-200 font-semibold">{focusTopic?.estimatedHours} hours</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Category:</span>
                <span className="text-zinc-200 font-semibold">{focusTopic?.category}</span>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button
              onClick={() => focusTopic && onSelectTopic(focusTopic.slug)}
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              <span>Continue Learning Topic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Recommended Next Problems (Rule-Based Engine) */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Recommended Next Problems</span>
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Targeted problems based on your stage, prerequisites, and unfinished topics
                </p>
              </div>
              <button
                onClick={() => onNavigate('problems')}
                className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
              >
                <span>Browse All</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {recommendedProblems && recommendedProblems.length > 0 ? (
                recommendedProblems.map((prob: any, idx: number) => (
                  <div
                    key={prob.id}
                    className="p-3.5 rounded-xl bg-zinc-950/80 border border-zinc-800 hover:border-zinc-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono font-bold text-zinc-500 w-5">
                        #{idx + 1}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-white hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => onSelectProblem(prob.id)}>
                            {prob.name}
                          </span>
                          <a
                            href={prob.officialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-zinc-300"
                            title="Open problem in new tab"
                          >
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] uppercase font-semibold text-zinc-500">
                            {prob.platform}
                          </span>
                          <span className="text-zinc-600">•</span>
                          <span className="text-[10px] text-zinc-400">
                            ~{prob.estimatedTimeMinutes} min
                          </span>
                        </div>
                      </div>
                    </div>

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
                      <button
                        onClick={() => onSelectProblem(prob.id)}
                        className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                      >
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500 text-xs">
                  No recommended problems in this topic. Great job! Check other topics in the roadmap.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center justify-between text-xs text-zinc-400">
            <span>Solved in database: <strong className="text-white">{data.totalSolved}</strong> / 1050</span>
            <button
              onClick={() => onNavigate('journey')}
              className="text-emerald-400 hover:underline font-medium"
            >
              Explore Skill Tree →
            </button>
          </div>
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-zinc-400" />
          <span>Recent Activity</span>
        </h2>

        {recentActivity && recentActivity.length > 0 ? (
          <div className="divide-y divide-zinc-800/80">
            {recentActivity.map((item: any) => (
              <div key={item.record.id} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-medium text-zinc-200">
                      {item.record.status === 'solved' ? 'Solved' : item.record.status === 'mastered' ? 'Mastered' : 'Attempted'} {item.problem.name}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {item.problem.platform} • Rating {item.problem.rating || 'N/A'} • {item.record.timeSpentMinutes}m spent
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] font-mono text-zinc-500">
                    {new Date(item.record.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-xs text-zinc-500">
            No recent activity recorded yet. Pick a problem from the roadmap to begin your journey!
          </div>
        )}
      </div>
    </div>
  );
};
