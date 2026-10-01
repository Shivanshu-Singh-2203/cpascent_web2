// src/db/users.ts
import { db } from './index.ts';
import { users, profiles, streaks, dailyGoals } from './schema.ts';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(uid: string, email: string, defaultUsername?: string) {
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid));
    let userRecord = existing[0];

    if (!userRecord) {
      const username = defaultUsername || email.split('@')[0] || 'CPian';
      const inserted = await db
        .insert(users)
        .values({
          uid,
          email,
          username,
          role: 'user',
        })
        .onConflictDoUpdate({
          target: users.uid,
          set: { email },
        })
        .returning();

      userRecord = inserted[0];

      // Create default profile
      await db
        .insert(profiles)
        .values({
          userId: userRecord.id,
          currentLevel: 'Newbie',
          targetLevel: 'Grandmaster',
          languages: 'C++,Python',
          dailyMinutes: 60,
          primaryGoal: 'Candidate Master (1900+)',
          preferredPlatforms: 'Codeforces,CSES,AtCoder',
        })
        .onConflictDoNothing();

      // Create default streak record
      await db
        .insert(streaks)
        .values({
          userId: userRecord.id,
          currentStreak: 0,
          longestStreak: 0,
        })
        .onConflictDoNothing();

      // Create default daily goal
      await db
        .insert(dailyGoals)
        .values({
          userId: userRecord.id,
          problemsPerDay: 2,
          studyMinutesPerDay: 60,
          revisionCountPerDay: 1,
        })
        .onConflictDoNothing();
    }

    return userRecord;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw new Error('Database operation failed for user synchronization.', { cause: error });
  }
}
