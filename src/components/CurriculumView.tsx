// src/components/CurriculumView.tsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../lib/api.ts';
import {
  Code2,
  CheckCircle2,
  Lock,
  ArrowRight,
  BookOpen,
  Clock,
  Layers,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface CurriculumViewProps {
  onSelectTopic: (slug: string) => void;
  userLevel?: string;
}

export const CurriculumView: React.FC<CurriculumViewProps> = ({ onSelectTopic, userLevel = 'Newbie' }) => {
  const [stages, setStages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStage, setSelectedStage] = useState<string>('All');
  const [expandedStage, setExpandedStage] = useState<string>(userLevel);

  useEffect(() => {
    const fetchCurriculum = async () => {
      try {
        const res = await apiFetch('/api/curriculum');
        setStages(res.curriculum || []);
      } catch (err) {
        console.error('Failed to load curriculum:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCurriculum();
  }, []);

  const stageOrder = [
    'Newbie',
    'Pupil',
    'Specialist',
    'Expert',
    'Candidate Master',
    'Master',
    'International Master',
    'Grandmaster',
  ];

  const stageRatings: Record<string, string> = {
    'Newbie': '0–999',
    'Pupil': '1000–1199',
    'Specialist': '1200–1399',
    'Expert': '1400–1599',
    'Candidate Master': '1600–1899',
    'Master': '1900–2099',
    'International Master': '2100–2299',
    'Grandmaster': '2300+',
  };

  const stageColors: Record<string, { border: string; badge: string; text: string }> = {
    'Newbie': { border: 'border-zinc-700', badge: 'bg-zinc-800 text-zinc-300', text: 'text-zinc-400' },
    'Pupil': { border: 'border-emerald-800/60', badge: 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50', text: 'text-emerald-400' },
    'Specialist': { border: 'border-cyan-800/60', badge: 'bg-cyan-950/70 text-cyan-400 border-cyan-800/50', text: 'text-cyan-400' },
    'Expert': { border: 'border-blue-800/60', badge: 'bg-blue-950/70 text-blue-400 border-blue-800/50', text: 'text-blue-400' },
    'Candidate Master': { border: 'border-purple-800/60', badge: 'bg-purple-950/70 text-purple-400 border-purple-800/50', text: 'text-purple-400' },
    'Master': { border: 'border-yellow-800/60', badge: 'bg-yellow-950/70 text-yellow-400 border-yellow-800/50', text: 'text-yellow-400' },
    'International Master': { border: 'border-amber-800/60', badge: 'bg-amber-950/70 text-amber-500 border-amber-800/50', text: 'text-amber-500' },
    'Grandmaster': { border: 'border-red-800/60', badge: 'bg-red-950/70 text-red-400 border-red-800/50', text: 'text-red-400' },
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <div className="text-xs text-zinc-500 font-mono">Loading curriculum roadmap...</div>
        </div>
      </div>
    );
  }

  const filteredStages = selectedStage === 'All'
    ? stages
    : stages.filter((s) => s.stage.toLowerCase() === selectedStage.toLowerCase());

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <Code2 className="w-7 h-7 text-emerald-400" />
              <span>Competitive Programming Roadmap</span>
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Structured progressive curriculum from absolute basics to Grandmaster algorithmic synthesis
            </p>
          </div>

          {/* Stage filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedStage('All')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStage === 'All'
                  ? 'bg-zinc-100 text-zinc-900'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              All Stages
            </button>
            {stageOrder.map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStage(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedStage === st
                    ? 'bg-zinc-100 text-zinc-900'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Stages */}
      <div className="space-y-6">
        {filteredStages.map((stageData, stageIndex) => {
          const stName = stageData.stage;
          const colors = stageColors[stName] || stageColors['Newbie'];
          const ratingRange = stageRatings[stName] || '0+';
          const isExpanded = expandedStage === stName || selectedStage !== 'All';

          // Calculate stage mastery
          const totalProbs = stageData.topics.reduce((acc: number, t: any) => acc + (t.totalProblems || 0), 0);
          const solvedProbs = stageData.topics.reduce((acc: number, t: any) => acc + (t.solvedProblems || 0), 0);
          const stageMastery = totalProbs > 0 ? Math.round((solvedProbs / totalProbs) * 100) : 0;

          return (
            <div
              key={stName}
              className={`rounded-2xl bg-zinc-900/40 border transition-all ${colors.border}`}
            >
              {/* Stage Header Accordion Toggle */}
              <div
                onClick={() => setExpandedStage(isExpanded ? '' : stName)}
                className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-pointer hover:bg-zinc-900/60 transition-colors rounded-t-2xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 text-zinc-300 font-mono text-xs font-bold border border-zinc-700">
                    0{stageIndex + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                        {stName}
                      </h2>
                      <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold border ${colors.badge}`}>
                        {ratingRange}
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">
                      {stageData.topics.length} Major Topics • {totalProbs} Curated Problems
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  {/* Mastery mini progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-zinc-200">
                        {solvedProbs} / {totalProbs}
                      </div>
                      <div className="text-[10px] text-zinc-500">{stageMastery}% Mastered</div>
                    </div>
                    <div className="w-20 bg-zinc-800 h-1.5 rounded-full overflow-hidden hidden sm:block">
                      <div
                        className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${stageMastery}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-zinc-500">
                    {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Topics Grid */}
              {isExpanded && (
                <div className="p-5 sm:p-6 pt-0 border-t border-zinc-800/60 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                  {stageData.topics.map((topic: any) => {
                    const isFullyMastered = topic.masteryPercent >= 80;

                    return (
                      <div
                        key={topic.id}
                        onClick={() => onSelectTopic(topic.slug)}
                        className="group p-4 rounded-xl bg-zinc-950/70 border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/50 transition-all cursor-pointer flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1.5 font-medium">
                            <span className="uppercase text-[10px] tracking-wider text-emerald-400/90 font-mono">
                              {topic.category}
                            </span>
                            <span className="font-mono text-zinc-400">{topic.estimatedHours}h</span>
                          </div>

                          <h3 className="text-sm font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors line-clamp-1">
                            {topic.title}
                          </h3>

                          <p className="text-xs text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                            {topic.summary}
                          </p>

                          {/* Subtopics preview */}
                          {topic.subtopics && topic.subtopics.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {topic.subtopics.slice(0, 3).map((st: any) => (
                                <span
                                  key={st.id}
                                  className="px-1.5 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-400 border border-zinc-800"
                                >
                                  {st.title}
                                </span>
                              ))}
                              {topic.subtopics.length > 3 && (
                                <span className="text-[10px] text-zinc-500 self-center">
                                  +{topic.subtopics.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Progress and Click */}
                        <div className="mt-4 pt-3 border-t border-zinc-800/60">
                          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5">
                            <span className="text-[11px] font-mono">
                              {topic.solvedProblems} / {topic.totalProblems} solved
                            </span>
                            <span className="font-mono text-[11px] font-bold text-zinc-300">
                              {topic.masteryPercent}%
                            </span>
                          </div>
                          <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isFullyMastered ? 'bg-emerald-400' : 'bg-zinc-500'
                              }`}
                              style={{ width: `${topic.masteryPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
