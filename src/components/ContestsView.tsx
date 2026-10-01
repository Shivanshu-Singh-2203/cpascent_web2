// src/components/ContestsView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import {
  Trophy,
  Calendar,
  ExternalLink,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Clock,
} from 'lucide-react';

export const ContestsView: React.FC = () => {
  const [contests, setContests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Virtual contest timer state
  const [timerActive, setTimerActive] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(120 * 60);
  const [selectedContestName, setSelectedContestName] = useState('Codeforces Round (Virtual Practice)');
  const [attempted, setAttempted] = useState(0);
  const [solved, setSolved] = useState(0);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await apiFetch('/api/contests');
        setContests(res.contests || []);
      } catch (err) {
        console.error('Failed to load contests:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  useEffect(() => {
    let interval: any = null;
    if (timerActive && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((s) => s - 1);
      }, 1000);
    } else if (secondsRemaining === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, secondsRemaining]);

  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-zinc-800/80">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
          <Trophy className="w-6 h-6 text-amber-400" />
          <span>Contests & Virtual Practice</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Upcoming official contests and personal virtual contest timing simulator
        </p>
      </div>

      {/* Virtual Contest Simulator Card */}
      <div className="p-6 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
              <Clock className="w-4 h-4" />
              <span>Personal Virtual Contest Simulator</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              {selectedContestName}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-3xl sm:text-4xl font-mono font-bold text-white tracking-wider px-4 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800">
              {formatTime(secondsRemaining)}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className={`p-2.5 rounded-xl text-white font-bold transition-colors cursor-pointer ${
                  timerActive ? 'bg-amber-600 hover:bg-amber-500' : 'bg-emerald-600 hover:bg-emerald-500'
                }`}
                title={timerActive ? 'Pause' : 'Start'}
              >
                {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              </button>
              <button
                onClick={() => {
                  setTimerActive(false);
                  setSecondsRemaining(120 * 60);
                }}
                className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                title="Reset"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Counter tracking during virtual contest */}
        <div className="pt-2 border-t border-zinc-800/80 flex items-center gap-6 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Attempted:</span>
            <button
              onClick={() => setAttempted((a) => Math.max(0, a - 1))}
              className="w-6 h-6 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
            >
              -
            </button>
            <strong className="text-white font-mono text-sm">{attempted}</strong>
            <button
              onClick={() => setAttempted((a) => a + 1)}
              className="w-6 h-6 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
            >
              +
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span>Solved:</span>
            <button
              onClick={() => setSolved((s) => Math.max(0, s - 1))}
              className="w-6 h-6 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
            >
              -
            </button>
            <strong className="text-emerald-400 font-mono text-sm">{solved}</strong>
            <button
              onClick={() => setSolved((s) => s + 1)}
              className="w-6 h-6 rounded bg-zinc-950 border border-zinc-800 text-zinc-400"
            >
              +
            </button>
          </div>

          <span className="text-zinc-500 text-[11px] ml-auto hidden sm:inline">
            Virtual simulation tracks personal pace; does not modify official rating.
          </span>
        </div>
      </div>

      {/* Contests Schedule */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar className="w-4 h-4 text-zinc-400" />
          <span>Contest Calendar</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contests.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-xl bg-zinc-900/40 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-zinc-800 text-zinc-300">
                    {c.platform}
                  </span>
                  <span className="text-[11px] font-mono text-zinc-400">
                    {c.durationMinutes} min
                  </span>
                </div>

                <h3 className="text-sm font-bold text-white mb-1">{c.title}</h3>
                <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-2">
                  <Clock className="w-3.5 h-3.5 text-zinc-500" />
                  <span>Scheduled: {new Date(c.startTime).toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedContestName(c.title);
                    setSecondsRemaining(c.durationMinutes * 60);
                    setTimerActive(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-medium text-zinc-200"
                >
                  Load into Virtual Timer
                </button>
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 font-medium"
                >
                  <span>Official Page</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
