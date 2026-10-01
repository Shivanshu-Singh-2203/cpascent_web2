// src/server/routes.ts
import { Router, Response } from 'express';
import { requireAuth, optionalAuth, AuthRequest } from '../middleware/auth.ts';
import { db } from '../db/index.ts';
import {
  users,
  profiles,
  topics,
  subtopics,
  prerequisites,
  problems,
  resources,
  userProblems,
  userResources,
  revisions,
  mistakes,
  dailyActivity,
  streaks,
  dailyGoals,
  contests,
  userContests,
} from '../db/schema.ts';
import { eq, and, sql, desc, inArray, gte, lte } from 'drizzle-orm';

export const apiRouter = Router();

// Helper to get formatted date YYYY-MM-DD
function getTodayString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper to record activity and calculate streaks
async function recordUserActivity(
  userId: number,
  delta: {
    problemsSolved?: number;
    resourcesCompleted?: number;
    revisionsCompleted?: number;
    studyMinutes?: number;
  }
) {
  const today = getTodayString();

  // 1. Upsert today's daily activity
  const existingActivity = await db
    .select()
    .from(dailyActivity)
    .where(and(eq(dailyActivity.userId, userId), eq(dailyActivity.activityDate, today)));

  if (!existingActivity.length) {
    await db.insert(dailyActivity).values({
      userId,
      activityDate: today,
      problemsSolved: delta.problemsSolved || 0,
      resourcesCompleted: delta.resourcesCompleted || 0,
      revisionsCompleted: delta.revisionsCompleted || 0,
      studyMinutes: delta.studyMinutes || 0,
    });
  } else {
    await db
      .update(dailyActivity)
      .set({
        problemsSolved: sql`${dailyActivity.problemsSolved} + ${delta.problemsSolved || 0}`,
        resourcesCompleted: sql`${dailyActivity.resourcesCompleted} + ${delta.resourcesCompleted || 0}`,
        revisionsCompleted: sql`${dailyActivity.revisionsCompleted} + ${delta.revisionsCompleted || 0}`,
        studyMinutes: sql`${dailyActivity.studyMinutes} + ${delta.studyMinutes || 0}`,
        updatedAt: new Date(),
      })
      .where(eq(dailyActivity.id, existingActivity[0].id));
  }

  // 2. Check and update streak
  const userStreak = await db.select().from(streaks).where(eq(streaks.userId, userId));
  if (userStreak.length) {
    const current = userStreak[0];
    const lastActive = current.lastActiveDate;

    if (lastActive !== today) {
      let newStreak = 1;
      if (lastActive) {
        const lastDate = new Date(lastActive);
        const currDate = new Date(today);
        const diffDays = Math.round((currDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays === 1) {
          newStreak = current.currentStreak + 1;
        } else if (diffDays === 0) {
          newStreak = current.currentStreak;
        } else {
          newStreak = 1;
        }
      }

      const longest = Math.max(current.longestStreak, newStreak);
      await db
        .update(streaks)
        .set({
          currentStreak: newStreak,
          longestStreak: longest,
          lastActiveDate: today,
          updatedAt: new Date(),
        })
        .where(eq(streaks.id, current.id));
    }
  }
}

// -------------------------------------------------------------
// 1. AUTH & PROFILE
// -------------------------------------------------------------

apiRouter.get('/auth/me', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const profile = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    const streak = await db.select().from(streaks).where(eq(streaks.userId, user.id));
    const goal = await db.select().from(dailyGoals).where(eq(dailyGoals.userId, user.id));

    res.json({
      user,
      profile: profile[0] || null,
      streak: streak[0] || { currentStreak: 0, longestStreak: 0 },
      dailyGoal: goal[0] || { problemsPerDay: 2, studyMinutesPerDay: 60, revisionCountPerDay: 1 },
    });
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
});

apiRouter.post('/profile', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const {
      username,
      currentLevel,
      targetLevel,
      cfRating,
      cfHandle,
      highestRatingSolved,
      languages,
      dailyMinutes,
      primaryGoal,
      preferredPlatforms,
    } = req.body;

    if (username && username !== user.username) {
      await db.update(users).set({ username }).where(eq(users.id, user.id));
    }

    const updated = await db
      .update(profiles)
      .set({
        currentLevel: currentLevel || 'Newbie',
        targetLevel: targetLevel || 'Grandmaster',
        cfRating: cfRating ? Number(cfRating) : null,
        cfHandle: cfHandle || null,
        highestRatingSolved: highestRatingSolved ? Number(highestRatingSolved) : null,
        languages: languages || 'C++,Python',
        dailyMinutes: dailyMinutes ? Number(dailyMinutes) : 60,
        primaryGoal: primaryGoal || 'Candidate Master (1900+)',
        preferredPlatforms: preferredPlatforms || 'Codeforces,CSES,AtCoder',
        updatedAt: new Date(),
      })
      .where(eq(profiles.userId, user.id))
      .returning();

    res.json({ profile: updated[0] });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

apiRouter.post('/daily-goals', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const { problemsPerDay, studyMinutesPerDay, revisionCountPerDay } = req.body;

    const updated = await db
      .update(dailyGoals)
      .set({
        problemsPerDay: Number(problemsPerDay) || 2,
        studyMinutesPerDay: Number(studyMinutesPerDay) || 60,
        revisionCountPerDay: Number(revisionCountPerDay) || 1,
        updatedAt: new Date(),
      })
      .where(eq(dailyGoals.userId, user.id))
      .returning();

    res.json({ goal: updated[0] });
  } catch (error) {
    console.error('Error updating daily goals:', error);
    res.status(500).json({ error: 'Failed to update daily goals' });
  }
});

// -------------------------------------------------------------
// 2. CURRICULUM & TOPICS
// -------------------------------------------------------------

apiRouter.get('/curriculum', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const allTopics = await db.select().from(topics).orderBy(topics.orderIndex);
    const allSubtopics = await db.select().from(subtopics).orderBy(subtopics.orderIndex);
    const allPrereqs = await db.select().from(prerequisites);

    // If authenticated, get user problem stats by topic
    let userSolvedProblemIds = new Set<number>();
    if (req.dbUser) {
      const up = await db
        .select({ problemId: userProblems.problemId })
        .from(userProblems)
        .where(
          and(
            eq(userProblems.userId, req.dbUser.id),
            orStatusMasteredOrSolved()
          )
        );
      userSolvedProblemIds = new Set(up.map((x) => x.problemId));
    }

    // Problem counts per topic
    const topicProblems = await db
      .select({
        topicSlug: problems.primaryTopicSlug,
        count: sql<number>`count(*)`,
      })
      .from(problems)
      .groupBy(problems.primaryTopicSlug);

    const problemCountMap = new Map(topicProblems.map((t) => [t.topicSlug, Number(t.count)]));

    // Calculate user solved count per topic
    const solvedCountsByTopic = new Map<string, number>();
    if (req.dbUser && userSolvedProblemIds.size > 0) {
      const solvedProblems = await db
        .select({
          topicSlug: problems.primaryTopicSlug,
        })
        .from(problems)
        .where(inArray(problems.id, Array.from(userSolvedProblemIds)));

      for (const sp of solvedProblems) {
        solvedCountsByTopic.set(sp.topicSlug, (solvedCountsByTopic.get(sp.topicSlug) || 0) + 1);
      }
    }

    // Stages grouping
    const stages = [
      'Newbie',
      'Pupil',
      'Specialist',
      'Expert',
      'Candidate Master',
      'Master',
      'International Master',
      'Grandmaster',
    ];

    const curriculum = stages.map((stage) => {
      const stageTopics = allTopics
        .filter((t) => t.stage.toLowerCase() === stage.toLowerCase())
        .map((t) => {
          const tSubtopics = allSubtopics.filter((st) => st.topicId === t.id);
          const tPrereqs = allPrereqs
            .filter((p) => p.topicId === t.id)
            .map((p) => p.prerequisiteTopicId);

          const totalProblems = problemCountMap.get(t.slug) || 0;
          const solvedProblems = solvedCountsByTopic.get(t.slug) || 0;
          const masteryPercent = totalProblems > 0 ? Math.round((solvedProblems / totalProblems) * 100) : 0;

          return {
            ...t,
            subtopics: tSubtopics,
            prerequisites: tPrereqs,
            totalProblems,
            solvedProblems,
            masteryPercent,
          };
        });

      return {
        stage,
        topics: stageTopics,
        totalTopics: stageTopics.length,
      };
    });

    res.json({ curriculum });
  } catch (error) {
    console.error('Error fetching curriculum:', error);
    res.status(500).json({ error: 'Failed to fetch curriculum' });
  }
});

function orStatusMasteredOrSolved() {
  return sql`${userProblems.status} IN ('solved', 'mastered')`;
}

apiRouter.get('/topics/:slug', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { slug } = req.params;
    const topicList = await db.select().from(topics).where(eq(topics.slug, slug));
    if (!topicList.length) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    const topic = topicList[0];
    const subtopicList = await db
      .select()
      .from(subtopics)
      .where(eq(subtopics.topicId, topic.id))
      .orderBy(subtopics.orderIndex);

    const resourceList = await db
      .select()
      .from(resources)
      .where(eq(resources.topicSlug, topic.slug));

    const problemList = await db
      .select()
      .from(problems)
      .where(eq(problems.primaryTopicSlug, topic.slug))
      .orderBy(problems.rating, problems.recommendedOrder);

    // If authenticated, get user status on problems and resources
    let problemStatuses: Record<number, any> = {};
    let resourceStatuses: Record<number, any> = {};

    if (req.dbUser) {
      const up = await db
        .select()
        .from(userProblems)
        .where(eq(userProblems.userId, req.dbUser.id));

      for (const item of up) {
        problemStatuses[item.problemId] = item;
      }

      const ur = await db
        .select()
        .from(userResources)
        .where(eq(userResources.userId, req.dbUser.id));

      for (const item of ur) {
        resourceStatuses[item.resourceId] = item;
      }
    }

    const enhancedProblems = problemList.map((p) => ({
      ...p,
      userStatus: problemStatuses[p.id] || { status: 'unseen' },
    }));

    const enhancedResources = resourceList.map((r) => ({
      ...r,
      userStatus: resourceStatuses[r.id] || { status: 'unseen' },
    }));

    // Calculate topic mastery breakdown
    const totalP = problemList.length;
    const solvedP = enhancedProblems.filter(
      (p) => p.userStatus.status === 'solved' || p.userStatus.status === 'mastered'
    ).length;
    const masteryPercent = totalP > 0 ? Math.round((solvedP / totalP) * 100) : 0;

    res.json({
      topic,
      subtopics: subtopicList,
      resources: enhancedResources,
      problems: enhancedProblems,
      stats: {
        totalProblems: totalP,
        solvedProblems: solvedP,
        masteryPercent,
      },
    });
  } catch (error) {
    console.error('Error fetching topic details:', error);
    res.status(500).json({ error: 'Failed to fetch topic details' });
  }
});

// -------------------------------------------------------------
// 3. PROBLEMS & TRACKING
// -------------------------------------------------------------

apiRouter.get('/problems', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      search,
      platform,
      difficulty,
      minRating,
      maxRating,
      stage,
      topic,
      status,
      page = '1',
      limit = '50',
    } = req.query as Record<string, string>;

    const offset = (Math.max(1, Number(page)) - 1) * Number(limit);

    let query = db.select().from(problems);
    const conditions: any[] = [];

    if (search) {
      conditions.push(
        sql`(${problems.name} ILIKE ${'%' + search + '%'} OR ${problems.problemId} ILIKE ${'%' + search + '%'})`
      );
    }
    if (platform && platform !== 'all') {
      conditions.push(eq(problems.platform, platform));
    }
    if (difficulty && difficulty !== 'all') {
      conditions.push(eq(problems.difficulty, difficulty));
    }
    if (stage && stage !== 'all') {
      conditions.push(eq(problems.curriculumStage, stage));
    }
    if (topic && topic !== 'all') {
      conditions.push(eq(problems.primaryTopicSlug, topic));
    }
    if (minRating) {
      conditions.push(gte(problems.rating, Number(minRating)));
    }
    if (maxRating) {
      conditions.push(lte(problems.rating, Number(maxRating)));
    }

    let problemResults = await db
      .select()
      .from(problems)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(problems.rating, problems.recommendedOrder)
      .limit(Number(limit))
      .offset(offset);

    // Total count for pagination
    const totalCountQuery = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems)
      .where(conditions.length ? and(...conditions) : undefined);
    const total = Number(totalCountQuery[0]?.count || 0);

    // Attach user status
    let userProblemMap = new Map<number, any>();
    if (req.dbUser) {
      const up = await db
        .select()
        .from(userProblems)
        .where(eq(userProblems.userId, req.dbUser.id));
      for (const item of up) {
        userProblemMap.set(item.problemId, item);
      }
    }

    let mappedProblems = problemResults.map((p) => ({
      ...p,
      userStatus: userProblemMap.get(p.id) || { status: 'unseen' },
    }));

    if (status && status !== 'all') {
      mappedProblems = mappedProblems.filter((p) => p.userStatus.status === status);
    }

    res.json({
      problems: mappedProblems,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    console.error('Error fetching problems:', error);
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
});

apiRouter.post('/problems/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const problemId = Number(req.params.id);
    const {
      status, // unseen, attempted, solved, failed, revisit, mastered
      solvedIndependently = true,
      timeSpentMinutes = 0,
      personalDifficulty,
      notes,
    } = req.body;

    const existing = await db
      .select()
      .from(userProblems)
      .where(and(eq(userProblems.userId, user.id), eq(userProblems.problemId, problemId)));

    const now = new Date();
    const isNowSolved = status === 'solved' || status === 'mastered';
    const wasAlreadySolved =
      existing.length > 0 &&
      (existing[0].status === 'solved' || existing[0].status === 'mastered');

    let savedRecord;

    if (!existing.length) {
      const inserted = await db
        .insert(userProblems)
        .values({
          userId: user.id,
          problemId,
          status,
          solvedIndependently: Boolean(solvedIndependently),
          attempts: 1,
          timeSpentMinutes: Number(timeSpentMinutes) || 0,
          personalDifficulty,
          firstAttemptDate: now,
          solvedDate: isNowSolved ? now : null,
          notes,
          updatedAt: now,
        })
        .returning();
      savedRecord = inserted[0];
    } else {
      const updated = await db
        .update(userProblems)
        .set({
          status,
          solvedIndependently: Boolean(solvedIndependently),
          attempts: sql`${userProblems.attempts} + 1`,
          timeSpentMinutes: sql`${userProblems.timeSpentMinutes} + ${Number(timeSpentMinutes) || 0}`,
          personalDifficulty: personalDifficulty || existing[0].personalDifficulty,
          solvedDate: isNowSolved && !existing[0].solvedDate ? now : existing[0].solvedDate,
          notes: notes !== undefined ? notes : existing[0].notes,
          updatedAt: now,
        })
        .where(eq(userProblems.id, existing[0].id))
        .returning();
      savedRecord = updated[0];
    }

    // Increment global problem solved count if newly solved
    if (isNowSolved && !wasAlreadySolved) {
      await db
        .update(problems)
        .set({
          solvedCount: sql`${problems.solvedCount} + 1`,
        })
        .where(eq(problems.id, problemId));
    }

    // Record activity and update streak
    await recordUserActivity(user.id, {
      problemsSolved: isNowSolved && !wasAlreadySolved ? 1 : 0,
      studyMinutes: Number(timeSpentMinutes) || (isNowSolved ? 30 : 15),
    });

    res.json({ record: savedRecord });
  } catch (error) {
    console.error('Error updating problem status:', error);
    res.status(500).json({ error: 'Failed to update problem status' });
  }
});

// -------------------------------------------------------------
// 4. RESOURCES & SAVED LIBRARY
// -------------------------------------------------------------

apiRouter.get('/resources', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { topic, type, search } = req.query as Record<string, string>;

    let conditions: any[] = [];
    if (topic && topic !== 'all') {
      conditions.push(eq(resources.topicSlug, topic));
    }
    if (type && type !== 'all') {
      conditions.push(eq(resources.type, type));
    }
    if (search) {
      conditions.push(
        sql`(${resources.title} ILIKE ${'%' + search + '%'} OR ${resources.author} ILIKE ${'%' + search + '%'})`
      );
    }

    const items = await db
      .select()
      .from(resources)
      .where(conditions.length ? and(...conditions) : undefined);

    let userResourceMap = new Map<number, any>();
    if (req.dbUser) {
      const ur = await db
        .select()
        .from(userResources)
        .where(eq(userResources.userId, req.dbUser.id));
      for (const item of ur) {
        userResourceMap.set(item.resourceId, item);
      }
    }

    const mapped = items.map((r) => ({
      ...r,
      userStatus: userResourceMap.get(r.id) || { status: 'unseen' },
    }));

    res.json({ resources: mapped });
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ error: 'Failed to fetch resources' });
  }
});

apiRouter.post('/resources/:id/status', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const resourceId = Number(req.params.id);
    const { status, notes } = req.body; // saved, learning, completed, revisit

    const existing = await db
      .select()
      .from(userResources)
      .where(and(eq(userResources.userId, user.id), eq(userResources.resourceId, resourceId)));

    let savedRecord;
    const wasCompleted = existing[0]?.status === 'completed';
    const isNowCompleted = status === 'completed';

    if (!existing.length) {
      const inserted = await db
        .insert(userResources)
        .values({
          userId: user.id,
          resourceId,
          status,
          notes,
        })
        .returning();
      savedRecord = inserted[0];
    } else {
      const updated = await db
        .update(userResources)
        .set({
          status,
          notes: notes !== undefined ? notes : existing[0].notes,
          updatedAt: new Date(),
        })
        .where(eq(userResources.id, existing[0].id))
        .returning();
      savedRecord = updated[0];
    }

    if (isNowCompleted && !wasCompleted) {
      await recordUserActivity(user.id, {
        resourcesCompleted: 1,
        studyMinutes: 30,
      });
    }

    res.json({ record: savedRecord });
  } catch (error) {
    console.error('Error updating resource status:', error);
    res.status(500).json({ error: 'Failed to update resource status' });
  }
});

// -------------------------------------------------------------
// 5. REVISION QUEUE
// -------------------------------------------------------------

apiRouter.get('/revisions', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const today = getTodayString();

    const userRevs = await db
      .select({
        revision: revisions,
        problem: problems,
      })
      .from(revisions)
      .innerJoin(problems, eq(revisions.problemId, problems.id))
      .where(eq(revisions.userId, user.id))
      .orderBy(revisions.scheduledDate);

    const dueToday = userRevs.filter(
      (r) => r.revision.scheduledDate <= today && r.revision.status === 'due'
    );
    const upcoming = userRevs.filter(
      (r) => r.revision.scheduledDate > today && r.revision.status === 'due'
    );
    const completed = userRevs.filter((r) => r.revision.status === 'completed');

    res.json({
      dueToday,
      upcoming,
      completed,
      dueCount: dueToday.length,
    });
  } catch (error) {
    console.error('Error fetching revisions:', error);
    res.status(500).json({ error: 'Failed to fetch revision queue' });
  }
});

apiRouter.post('/revisions', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const { problemId, intervalDays = 3, notes } = req.body;

    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + Number(intervalDays));
    const scheduledDate = targetDate.toISOString().split('T')[0];

    const inserted = await db
      .insert(revisions)
      .values({
        userId: user.id,
        problemId: Number(problemId),
        intervalDays: Number(intervalDays),
        scheduledDate,
        status: 'due',
        notes,
      })
      .returning();

    res.json({ revision: inserted[0] });
  } catch (error) {
    console.error('Error adding revision:', error);
    res.status(500).json({ error: 'Failed to schedule revision' });
  }
});

apiRouter.patch('/revisions/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const revId = Number(req.params.id);
    const { status, nextIntervalDays, notes } = req.body; // completed, skipped, or reschedule

    const today = getTodayString();

    if (status === 'completed' && nextIntervalDays) {
      // Mark current as completed
      await db
        .update(revisions)
        .set({
          status: 'completed',
          completedDate: today,
          notes,
        })
        .where(and(eq(revisions.id, revId), eq(revisions.userId, user.id)));

      // Schedule next revision
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + Number(nextIntervalDays));
      const scheduledDate = targetDate.toISOString().split('T')[0];

      const currentRev = await db.select().from(revisions).where(eq(revisions.id, revId));
      if (currentRev.length) {
        await db.insert(revisions).values({
          userId: user.id,
          problemId: currentRev[0].problemId,
          intervalDays: Number(nextIntervalDays),
          scheduledDate,
          status: 'due',
          notes: `Spaced revision (+${nextIntervalDays}d)`,
        });
      }

      await recordUserActivity(user.id, {
        revisionsCompleted: 1,
        studyMinutes: 15,
      });

      return res.json({ success: true, message: 'Revision completed and rescheduled' });
    }

    const updated = await db
      .update(revisions)
      .set({
        status: status || 'completed',
        completedDate: status === 'completed' ? today : undefined,
        notes: notes !== undefined ? notes : undefined,
      })
      .where(and(eq(revisions.id, revId), eq(revisions.userId, user.id)))
      .returning();

    if (status === 'completed') {
      await recordUserActivity(user.id, {
        revisionsCompleted: 1,
        studyMinutes: 15,
      });
    }

    res.json({ revision: updated[0] });
  } catch (error) {
    console.error('Error updating revision:', error);
    res.status(500).json({ error: 'Failed to update revision' });
  }
});

// -------------------------------------------------------------
// 6. MISTAKE JOURNAL
// -------------------------------------------------------------

apiRouter.get('/mistakes', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const userMistakes = await db
      .select({
        mistake: mistakes,
        problem: problems,
      })
      .from(mistakes)
      .innerJoin(problems, eq(mistakes.problemId, problems.id))
      .where(eq(mistakes.userId, user.id))
      .orderBy(desc(mistakes.createdAt));

    res.json({ mistakes: userMistakes });
  } catch (error) {
    console.error('Error fetching mistakes:', error);
    res.status(500).json({ error: 'Failed to fetch mistakes' });
  }
});

apiRouter.post('/mistakes', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const { problemId, category, mistakeNote, lessonNote } = req.body;

    const inserted = await db
      .insert(mistakes)
      .values({
        userId: user.id,
        problemId: Number(problemId),
        category: category || 'Implementation',
        mistakeNote: mistakeNote || '',
        lessonNote: lessonNote || '',
      })
      .returning();

    res.json({ mistake: inserted[0] });
  } catch (error) {
    console.error('Error logging mistake:', error);
    res.status(500).json({ error: 'Failed to log mistake' });
  }
});

apiRouter.delete('/mistakes/:id', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const mistakeId = Number(req.params.id);

    await db
      .delete(mistakes)
      .where(and(eq(mistakes.id, mistakeId), eq(mistakes.userId, user.id)));

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting mistake:', error);
    res.status(500).json({ error: 'Failed to delete mistake' });
  }
});

// -------------------------------------------------------------
// 7. HEATMAP & ACTIVITY
// -------------------------------------------------------------

apiRouter.get('/activity', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;

    // 1-year activity
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const startDate = oneYearAgo.toISOString().split('T')[0];

    const activities = await db
      .select()
      .from(dailyActivity)
      .where(
        and(eq(dailyActivity.userId, user.id), gte(dailyActivity.activityDate, startDate))
      )
      .orderBy(dailyActivity.activityDate);

    const userStreak = await db.select().from(streaks).where(eq(streaks.userId, user.id));

    // Stats for active this month
    const thisMonthPrefix = getTodayString().slice(0, 7);
    const thisMonthActivities = activities.filter((a) =>
      a.activityDate.startsWith(thisMonthPrefix)
    );
    const activeThisMonth = thisMonthActivities.length;
    const problemsThisMonth = thisMonthActivities.reduce(
      (sum, a) => sum + (a.problemsSolved || 0),
      0
    );

    res.json({
      activities,
      streak: userStreak[0] || { currentStreak: 0, longestStreak: 0 },
      activeThisMonth,
      problemsThisMonth,
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Failed to fetch activity heatmap' });
  }
});

apiRouter.post('/activity/log', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const { minutes = 30 } = req.body;

    await recordUserActivity(user.id, {
      studyMinutes: Number(minutes),
    });

    res.json({ success: true, message: `Logged ${minutes} minutes of study time` });
  } catch (error) {
    console.error('Error logging study time:', error);
    res.status(500).json({ error: 'Failed to log study time' });
  }
});

// -------------------------------------------------------------
// 8. DASHBOARD & RECOMMENDATIONS (Deterministic rule-based)
// -------------------------------------------------------------

apiRouter.get('/dashboard', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const today = getTodayString();

    const profileList = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    const userProfile = profileList[0] || {
      currentLevel: 'Newbie',
      targetLevel: 'Grandmaster',
      dailyMinutes: 60,
    };

    const userStreak = await db.select().from(streaks).where(eq(streaks.userId, user.id));
    const goalList = await db.select().from(dailyGoals).where(eq(dailyGoals.userId, user.id));
    const goal = goalList[0] || { problemsPerDay: 2, studyMinutesPerDay: 60, revisionCountPerDay: 1 };

    // Today's activity
    const todayAct = await db
      .select()
      .from(dailyActivity)
      .where(and(eq(dailyActivity.userId, user.id), eq(dailyActivity.activityDate, today)));
    const currentActivity = todayAct[0] || {
      problemsSolved: 0,
      studyMinutes: 0,
      revisionsCompleted: 0,
      resourcesCompleted: 0,
    };

    // Revisions due
    const dueRevs = await db
      .select()
      .from(revisions)
      .where(
        and(
          eq(revisions.userId, user.id),
          lte(revisions.scheduledDate, today),
          eq(revisions.status, 'due')
        )
      );

    // Solved problems
    const solvedList = await db
      .select({ problemId: userProblems.problemId })
      .from(userProblems)
      .where(
        and(eq(userProblems.userId, user.id), orStatusMasteredOrSolved())
      );
    const solvedIds = new Set(solvedList.map((x) => x.problemId));

    // Curriculum overall progress
    const totalProblemsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(problems);
    const totalP = Number(totalProblemsCount[0]?.count || 1050);
    const journeyPercentage = Math.round((solvedIds.size / totalP) * 100);

    // Continue Learning Topic selection
    // Find first topic in user's current stage with < 80% solved
    const stageTopics = await db
      .select()
      .from(topics)
      .where(eq(topics.stage, userProfile.currentLevel))
      .orderBy(topics.orderIndex);

    let focusTopic = stageTopics[0] || (await db.select().from(topics).limit(1))[0];

    // Rule-based problem recommendation engine (Spec #51)
    // Select problems from current curriculum position, not yet solved, difficulty tuned to user stage
    const candidateProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.primaryTopicSlug, focusTopic.slug))
      .orderBy(problems.rating, problems.recommendedOrder)
      .limit(10);

    const recommended = candidateProblems
      .filter((p) => !solvedIds.has(p.id))
      .slice(0, 3);

    // Recent user problems
    const recentActivity = await db
      .select({
        record: userProblems,
        problem: problems,
      })
      .from(userProblems)
      .innerJoin(problems, eq(userProblems.problemId, problems.id))
      .where(eq(userProblems.userId, user.id))
      .orderBy(desc(userProblems.updatedAt))
      .limit(5);

    res.json({
      user,
      profile: userProfile,
      streak: userStreak[0] || { currentStreak: 0, longestStreak: 0 },
      dailyGoal: goal,
      todayActivity: currentActivity,
      dueRevisionsCount: dueRevs.length,
      journeyPercentage,
      totalSolved: solvedIds.size,
      focusTopic,
      recommendedProblems: recommended,
      recentActivity,
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// -------------------------------------------------------------
// 9. ANALYTICS & DISTRIBUTION
// -------------------------------------------------------------

apiRouter.get('/analytics', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;

    const userProbs = await db
      .select({
        record: userProblems,
        problem: problems,
      })
      .from(userProblems)
      .innerJoin(problems, eq(userProblems.problemId, problems.id))
      .where(eq(userProblems.userId, user.id));

    const totalTracked = userProbs.length;
    const solved = userProbs.filter(
      (p) => p.record.status === 'solved' || p.record.status === 'mastered'
    );
    const attempted = userProbs.filter((p) => p.record.status === 'attempted');
    const failed = userProbs.filter((p) => p.record.status === 'failed');

    // Difficulty Buckets
    const ratingBuckets: Record<string, number> = {
      '800–999': 0,
      '1000–1199': 0,
      '1200–1399': 0,
      '1400–1599': 0,
      '1600–1799': 0,
      '1800–1999': 0,
      '2000+': 0,
    };

    // Platform distribution
    const platformStats: Record<string, number> = {
      Codeforces: 0,
      AtCoder: 0,
      CSES: 0,
      USACO: 0,
      LeetCode: 0,
    };

    let totalStudyMinutes = 0;

    for (const item of solved) {
      const r = item.problem.rating || 800;
      if (r < 1000) ratingBuckets['800–999']++;
      else if (r < 1200) ratingBuckets['1000–1199']++;
      else if (r < 1400) ratingBuckets['1200–1399']++;
      else if (r < 1600) ratingBuckets['1400–1599']++;
      else if (r < 1800) ratingBuckets['1600–1799']++;
      else if (r < 2000) ratingBuckets['1800–1999']++;
      else ratingBuckets['2000+']++;

      const plat = item.problem.platform;
      if (platformStats[plat] !== undefined) {
        platformStats[plat]++;
      } else {
        platformStats[plat] = 1;
      }

      totalStudyMinutes += item.record.timeSpentMinutes || 0;
    }

    // Success rate
    const successRate = totalTracked > 0 ? Math.round((solved.length / totalTracked) * 100) : 0;
    const avgSolveTime = solved.length > 0 ? Math.round(totalStudyMinutes / solved.length) : 30;

    res.json({
      totalSolved: solved.length,
      totalAttempted: attempted.length,
      totalFailed: failed.length,
      successRate,
      avgSolveTime,
      totalStudyMinutes,
      ratingDistribution: ratingBuckets,
      platformDistribution: platformStats,
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// -------------------------------------------------------------
// 10. CONTESTS
// -------------------------------------------------------------

apiRouter.get('/contests', async (_req, res: Response) => {
  try {
    const allContests = await db.select().from(contests).orderBy(contests.startTime);
    res.json({ contests: allContests });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ error: 'Failed to fetch contests' });
  }
});

// -------------------------------------------------------------
// 11. EXPORT / IMPORT
// -------------------------------------------------------------

apiRouter.get('/export', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;

    const profile = await db.select().from(profiles).where(eq(profiles.userId, user.id));
    const userProbs = await db.select().from(userProblems).where(eq(userProblems.userId, user.id));
    const userRes = await db.select().from(userResources).where(eq(userResources.userId, user.id));
    const userMists = await db.select().from(mistakes).where(eq(mistakes.userId, user.id));
    const userRevs = await db.select().from(revisions).where(eq(revisions.userId, user.id));
    const acts = await db.select().from(dailyActivity).where(eq(dailyActivity.userId, user.id));
    const streak = await db.select().from(streaks).where(eq(streaks.userId, user.id));

    res.json({
      exportDate: new Date().toISOString(),
      user: {
        username: user.username,
        email: user.email,
      },
      profile: profile[0] || null,
      streak: streak[0] || null,
      problems: userProbs,
      resources: userRes,
      mistakes: userMists,
      revisions: userRevs,
      activities: acts,
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).json({ error: 'Failed to export user data' });
  }
});

// -------------------------------------------------------------
// 12. CODEFORCES SYNC ADAPTER
// -------------------------------------------------------------

apiRouter.post('/codeforces/sync', requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.dbUser!;
    const { handle } = req.body;

    if (!handle) {
      return res.status(400).json({ error: 'Codeforces handle is required' });
    }

    // Call Codeforces Public API: user.status
    const cfUrl = `https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}&from=1&count=500`;
    const cfRes = await fetch(cfUrl);

    if (!cfRes.ok) {
      return res.status(400).json({ error: 'Could not fetch data from Codeforces API. Please check your handle.' });
    }

    const cfData: any = await cfRes.json();
    if (cfData.status !== 'OK') {
      return res.status(400).json({ error: cfData.comment || 'Codeforces API error' });
    }

    const submissions = cfData.result || [];
    const solvedProblemIds = new Set<string>();

    for (const sub of submissions) {
      if (sub.verdict === 'OK' && sub.problem && sub.problem.contestId && sub.problem.index) {
        solvedProblemIds.add(`${sub.problem.contestId}${sub.problem.index}`);
      }
    }

    // Find matching problems in our database
    const matchingProblems = await db
      .select()
      .from(problems)
      .where(eq(problems.platform, 'Codeforces'));

    let syncedCount = 0;
    const now = new Date();

    for (const prob of matchingProblems) {
      if (solvedProblemIds.has(prob.problemId)) {
        const existing = await db
          .select()
          .from(userProblems)
          .where(and(eq(userProblems.userId, user.id), eq(userProblems.problemId, prob.id)));

        if (!existing.length) {
          await db.insert(userProblems).values({
            userId: user.id,
            problemId: prob.id,
            status: 'solved',
            solvedIndependently: true,
            attempts: 1,
            solvedDate: now,
            notes: `Synchronized from Codeforces handle: ${handle}`,
          });
          syncedCount++;
        } else if (existing[0].status !== 'solved' && existing[0].status !== 'mastered') {
          await db
            .update(userProblems)
            .set({
              status: 'solved',
              solvedDate: now,
              notes: `Synchronized from Codeforces handle: ${handle}`,
            })
            .where(eq(userProblems.id, existing[0].id));
          syncedCount++;
        }
      }
    }

    // Update CF handle in profile
    await db
      .update(profiles)
      .set({
        cfHandle: handle,
        updatedAt: now,
      })
      .where(eq(profiles.userId, user.id));

    res.json({
      success: true,
      syncedCount,
      totalCfSolved: solvedProblemIds.size,
      message: `Successfully synchronized ${syncedCount} matching problems from Codeforces account @${handle}!`,
    });
  } catch (error) {
    console.error('Error syncing Codeforces:', error);
    res.status(500).json({ error: 'Failed to synchronize Codeforces data' });
  }
});
