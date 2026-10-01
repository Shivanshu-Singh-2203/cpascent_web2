// src/components/Navbar.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  Flame,
  User as UserIcon,
  LogOut,
  LogIn,
  Compass,
  CheckSquare,
  BookOpen,
  RotateCcw,
  AlertTriangle,
  BarChart3,
  Trophy,
  Calendar,
  Menu,
  X,
  Code2,
  Settings,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenProfile }) => {
  const { user, profile, streak, signIn, logOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Compass },
    { id: 'journey', label: 'Journey', icon: Code2 },
    { id: 'problems', label: 'Problems', icon: CheckSquare },
    { id: 'revision', label: 'Revision', icon: RotateCcw },
    { id: 'mistakes', label: 'Mistakes', icon: AlertTriangle },
    { id: 'resources', label: 'Resources', icon: BookOpen },
    { id: 'contests', label: 'Contests', icon: Trophy },
    { id: 'activity', label: 'Activity', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const getStageColor = (stage?: string) => {
    switch (stage) {
      case 'Pupil': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'Specialist': return 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30';
      case 'Expert': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'Candidate Master': return 'text-purple-400 bg-purple-500/10 border-purple-500/30';
      case 'Master': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'International Master': return 'text-amber-500 bg-amber-500/10 border-amber-500/30';
      case 'Grandmaster': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-zinc-400 bg-zinc-800/60 border-zinc-700/60';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Stage Badge */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2 group text-left"
            >
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400 font-mono font-bold text-base shadow-sm group-hover:border-emerald-500/50 transition-colors">
                &gt;_
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  CP Journey
                </span>
              </div>
            </button>

            {profile && (
              <span
                className={`hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${getStageColor(
                  profile.currentLevel
                )}`}
              >
                {profile.currentLevel}
              </span>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'text-white bg-zinc-800/90 shadow-sm border border-zinc-700/80'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions: Streak & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Streak Badge */}
            <div
              onClick={() => setCurrentTab('activity')}
              title="Daily Activity Streak"
              className="cursor-pointer flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 hover:bg-amber-500/20 transition-all text-xs font-semibold"
            >
              <Flame className="w-4 h-4 fill-amber-500 text-amber-500 animate-pulse" />
              <span>{streak.currentStreak}d</span>
            </div>

            {user ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenProfile}
                  className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 text-xs font-medium transition-colors"
                  title="Profile & Settings"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  <span className="hidden sm:inline max-w-[100px] truncate">
                    {user.displayName || user.email?.split('@')[0] || 'User'}
                  </span>
                  <Settings className="w-3 h-3 text-zinc-500 hidden sm:inline" />
                </button>
                <button
                  onClick={logOut}
                  title="Sign Out"
                  className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-red-400 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={signIn}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all cursor-pointer"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-900"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-zinc-800 bg-zinc-950 px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-white bg-zinc-800'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
