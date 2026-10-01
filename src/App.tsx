/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { CurriculumView } from './components/CurriculumView.tsx';
import { ProblemsView } from './components/ProblemsView.tsx';
import { RevisionView } from './components/RevisionView.tsx';
import { MistakesView } from './components/MistakesView.tsx';
import { ResourcesView } from './components/ResourcesView.tsx';
import { ContestsView } from './components/ContestsView.tsx';
import { ActivityHeatmap } from './components/ActivityHeatmap.tsx';
import { AnalyticsView } from './components/AnalyticsView.tsx';
import { TopicModal } from './components/TopicModal.tsx';
import { ProblemDetailModal } from './components/ProblemDetailModal.tsx';
import { ProfileModal } from './components/ProfileModal.tsx';

function MainApp() {
  const { profile } = useAuth();
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [selectedTopicSlug, setSelectedTopicSlug] = useState<string | null>(null);
  const [selectedProblemId, setSelectedProblemId] = useState<number | null>(null);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'dashboard' && (
          <DashboardView
            onSelectTopic={(slug) => setSelectedTopicSlug(slug)}
            onNavigate={(tab) => setCurrentTab(tab)}
            onSelectProblem={(id) => setSelectedProblemId(id)}
          />
        )}

        {currentTab === 'journey' && (
          <CurriculumView
            onSelectTopic={(slug) => setSelectedTopicSlug(slug)}
            userLevel={profile?.currentLevel}
          />
        )}

        {currentTab === 'problems' && (
          <ProblemsView
            onSelectProblem={(id) => setSelectedProblemId(id)}
          />
        )}

        {currentTab === 'revision' && (
          <RevisionView
            onSelectProblem={(id) => setSelectedProblemId(id)}
          />
        )}

        {currentTab === 'mistakes' && (
          <MistakesView
            onSelectProblem={(id) => setSelectedProblemId(id)}
          />
        )}

        {currentTab === 'resources' && (
          <ResourcesView />
        )}

        {currentTab === 'contests' && (
          <ContestsView />
        )}

        {currentTab === 'activity' && (
          <ActivityHeatmap />
        )}

        {currentTab === 'analytics' && (
          <AnalyticsView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 text-center text-xs text-zinc-500 bg-zinc-950">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="font-mono">
            CP Journey • Structured Competitive Programming Roadmap (Newbie → Grandmaster)
          </div>
          <div>
            1050+ Curated Problems from Codeforces, CSES, and AtCoder
          </div>
        </div>
      </footer>

      {/* Modals */}
      {selectedTopicSlug && (
        <TopicModal
          slug={selectedTopicSlug}
          onClose={() => setSelectedTopicSlug(null)}
          onSelectProblem={(id) => setSelectedProblemId(id)}
        />
      )}

      {selectedProblemId !== null && (
        <ProblemDetailModal
          problemId={selectedProblemId}
          onClose={() => setSelectedProblemId(null)}
        />
      )}

      {profileModalOpen && (
        <ProfileModal
          onClose={() => setProfileModalOpen(false)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
