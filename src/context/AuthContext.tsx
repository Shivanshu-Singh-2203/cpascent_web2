// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  auth,
  googleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from '../lib/firebase.ts';
import { apiFetch } from '../lib/api.ts';

export interface UserProfile {
  id: number;
  userId: number;
  currentLevel: string;
  targetLevel: string;
  cfRating: number | null;
  cfHandle: string | null;
  highestRatingSolved: number | null;
  languages: string;
  dailyMinutes: number;
  primaryGoal: string;
  preferredPlatforms: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate?: string;
}

export interface DailyGoal {
  problemsPerDay: number;
  studyMinutesPerDay: number;
  revisionCountPerDay: number;
}

interface AuthContextType {
  user: User | null;
  dbUser: any | null;
  profile: UserProfile | null;
  streak: UserStreak;
  dailyGoal: DailyGoal;
  loading: boolean;
  signIn: () => Promise<void>;
  logOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile> & { username?: string }) => Promise<void>;
  updateGoals: (data: Partial<DailyGoal>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [dbUser, setDbUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [streak, setStreak] = useState<UserStreak>({ currentStreak: 0, longestStreak: 0 });
  const [dailyGoal, setDailyGoal] = useState<DailyGoal>({
    problemsPerDay: 2,
    studyMinutesPerDay: 60,
    revisionCountPerDay: 1,
  });
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const data = await apiFetch('/api/auth/me');
      setDbUser(data.user);
      setProfile(data.profile);
      if (data.streak) setStreak(data.streak);
      if (data.dailyGoal) setDailyGoal(data.dailyGoal);
    } catch (err) {
      console.error('Failed to sync user data with server:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        await fetchUserData();
      } else {
        setDbUser(null);
        setProfile(null);
        setStreak({ currentStreak: 0, longestStreak: 0 });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
      await fetchUserData();
    } catch (err) {
      console.error('Sign-in failed:', err);
      throw err;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setDbUser(null);
      setProfile(null);
    } catch (err) {
      console.error('Sign-out failed:', err);
    }
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUserData();
    }
  };

  const updateProfile = async (data: Partial<UserProfile> & { username?: string }) => {
    const res = await apiFetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.profile) {
      setProfile(res.profile);
    }
    await refreshUser();
  };

  const updateGoals = async (data: Partial<DailyGoal>) => {
    const res = await apiFetch('/api/daily-goals', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (res.goal) {
      setDailyGoal(res.goal);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        dbUser,
        profile,
        streak,
        dailyGoal,
        loading,
        signIn,
        logOut,
        refreshUser,
        updateProfile,
        updateGoals,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
