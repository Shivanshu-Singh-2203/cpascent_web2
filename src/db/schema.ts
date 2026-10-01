// src/db/schema.ts
import { relations } from 'drizzle-orm';
import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

// Users table (maps Firebase Auth UID to relational record)
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  username: text('username').notNull().default('CPian'),
  role: text('role').notNull().default('user'), // 'user' | 'admin'
  createdAt: timestamp('created_at').defaultNow(),
});

// Profiles table
export const profiles = pgTable('profiles', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  currentLevel: text('current_level').notNull().default('Newbie'),
  targetLevel: text('target_level').notNull().default('Grandmaster'),
  cfRating: integer('cf_rating'),
  cfHandle: text('cf_handle'),
  highestRatingSolved: integer('highest_rating_solved'),
  languages: text('languages').notNull().default('C++,Python'),
  dailyMinutes: integer('daily_minutes').notNull().default(60),
  primaryGoal: text('primary_goal').notNull().default('Candidate Master (1900+)'),
  preferredPlatforms: text('preferred_platforms').notNull().default('Codeforces,CSES,AtCoder'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Topics table
export const topics = pgTable('topics', {
  id: serial('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  stage: text('stage').notNull(), // Newbie, Pupil, Specialist, Expert, Candidate Master, Master, International Master, Grandmaster
  category: text('category').notNull(),
  summary: text('summary').notNull(),
  description: text('description').notNull(),
  estimatedHours: integer('estimated_hours').notNull().default(10),
  orderIndex: integer('order_index').notNull().default(0),
});

// Subtopics table
export const subtopics = pgTable('subtopics', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .references(() => topics.id, { onDelete: 'cascade' })
    .notNull(),
  slug: text('slug').notNull(),
  title: text('title').notNull(),
  orderIndex: integer('order_index').notNull().default(0),
  description: text('description'),
});

// Prerequisites table
export const prerequisites = pgTable('prerequisites', {
  id: serial('id').primaryKey(),
  topicId: integer('topic_id')
    .references(() => topics.id, { onDelete: 'cascade' })
    .notNull(),
  prerequisiteTopicId: integer('prerequisite_topic_id')
    .references(() => topics.id, { onDelete: 'cascade' })
    .notNull(),
});

// Problems table
export const problems = pgTable('problems', {
  id: serial('id').primaryKey(),
  platform: text('platform').notNull(), // Codeforces, AtCoder, CSES, USACO, LeetCode, CodeChef, Kattis, ICPC
  problemId: text('problem_id').notNull(),
  name: text('name').notNull(),
  officialUrl: text('official_url').notNull(),
  difficulty: text('difficulty').notNull(),
  rating: integer('rating'),
  curriculumStage: text('curriculum_stage').notNull(),
  primaryTopicSlug: text('primary_topic_slug').notNull(),
  estimatedTimeMinutes: integer('estimated_time_minutes').notNull().default(30),
  recommendedOrder: integer('recommended_order').notNull().default(1),
  solvedCount: integer('solved_count').notNull().default(0),
});

// Resources table
export const resources = pgTable('resources', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  type: text('type').notNull(), // Article, Book, Video, Reference, Course
  author: text('author').notNull(),
  url: text('url').notNull(),
  topicSlug: text('topic_slug').notNull(),
  difficulty: text('difficulty').notNull(),
  description: text('description').notNull(),
  recommendedStage: text('recommended_stage').notNull(),
  verificationStatus: text('verification_status').notNull().default('Verified'), // Verified, Unverified, Broken
});

// User Problems Tracking table
export const userProblems = pgTable(
  'user_problems',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    problemId: integer('problem_id')
      .references(() => problems.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').notNull().default('unseen'), // unseen, attempted, solved, failed, revisit, mastered
    solvedIndependently: boolean('solved_independently').default(true),
    attempts: integer('attempts').notNull().default(1),
    timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
    personalDifficulty: text('personal_difficulty'),
    firstAttemptDate: timestamp('first_attempt_date'),
    solvedDate: timestamp('solved_date'),
    lastRevisionDate: timestamp('last_revision_date'),
    notes: text('notes'),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('user_problem_idx').on(table.userId, table.problemId),
  ]
);

// User Resources Tracking table
export const userResources = pgTable(
  'user_resources',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    resourceId: integer('resource_id')
      .references(() => resources.id, { onDelete: 'cascade' })
      .notNull(),
    status: text('status').notNull().default('saved'), // saved, learning, completed, revisit
    notes: text('notes'),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('user_resource_idx').on(table.userId, table.resourceId),
  ]
);

// Revisions table
export const revisions = pgTable('revisions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  problemId: integer('problem_id')
    .references(() => problems.id, { onDelete: 'cascade' })
    .notNull(),
  intervalDays: integer('interval_days').notNull().default(3),
  scheduledDate: text('scheduled_date').notNull(), // YYYY-MM-DD
  completedDate: text('completed_date'), // YYYY-MM-DD
  status: text('status').notNull().default('due'), // due, completed, skipped
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Mistakes Journal table
export const mistakes = pgTable('mistakes', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  problemId: integer('problem_id')
    .references(() => problems.id, { onDelete: 'cascade' })
    .notNull(),
  category: text('category').notNull(), // Implementation, Logic, Complexity, Edge Case, Math, Wrong Observation, Wrong Algorithm, Syntax, Overflow, Misread Problem
  mistakeNote: text('mistake_note').notNull(),
  lessonNote: text('lesson_note').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Daily Activity table for Streak & Heatmap
export const dailyActivity = pgTable(
  'daily_activity',
  {
    id: serial('id').primaryKey(),
    userId: integer('user_id')
      .references(() => users.id, { onDelete: 'cascade' })
      .notNull(),
    activityDate: text('activity_date').notNull(), // YYYY-MM-DD
    problemsSolved: integer('problems_solved').notNull().default(0),
    resourcesCompleted: integer('resources_completed').notNull().default(0),
    revisionsCompleted: integer('revisions_completed').notNull().default(0),
    studyMinutes: integer('study_minutes').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => [
    uniqueIndex('user_activity_date_idx').on(table.userId, table.activityDate),
  ]
);

// Streaks table
export const streaks = pgTable('streaks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  currentStreak: integer('current_streak').notNull().default(0),
  longestStreak: integer('longest_streak').notNull().default(0),
  lastActiveDate: text('last_active_date'), // YYYY-MM-DD
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Daily Goals table
export const dailyGoals = pgTable('daily_goals', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull()
    .unique(),
  problemsPerDay: integer('problems_per_day').notNull().default(2),
  studyMinutesPerDay: integer('study_minutes_per_day').notNull().default(60),
  revisionCountPerDay: integer('revision_count_per_day').notNull().default(1),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Contests table
export const contests = pgTable('contests', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  platform: text('platform').notNull(),
  contestId: text('contest_id').notNull(),
  url: text('url').notNull(),
  startTime: timestamp('start_time').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(120),
  type: text('type').notNull().default('Div. 2'),
  division: text('division').default('Div. 2'),
});

// User Contests table
export const userContests = pgTable('user_contests', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id, { onDelete: 'cascade' })
    .notNull(),
  contestId: integer('contest_id')
    .references(() => contests.id, { onDelete: 'cascade' })
    .notNull(),
  startedAt: timestamp('started_at').defaultNow(),
  endedAt: timestamp('ended_at'),
  problemsAttempted: integer('problems_attempted').notNull().default(0),
  problemsSolved: integer('problems_solved').notNull().default(0),
  timeSpentMinutes: integer('time_spent_minutes').notNull().default(0),
  notes: text('notes'),
});

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId],
  }),
  streak: one(streaks, {
    fields: [users.id],
    references: [streaks.userId],
  }),
  dailyGoal: one(dailyGoals, {
    fields: [users.id],
    references: [dailyGoals.userId],
  }),
  userProblems: many(userProblems),
  userResources: many(userResources),
  revisions: many(revisions),
  mistakes: many(mistakes),
  dailyActivities: many(dailyActivity),
  userContests: many(userContests),
}));

export const problemsRelations = relations(problems, ({ many }) => ({
  userProblems: many(userProblems),
  revisions: many(revisions),
  mistakes: many(mistakes),
}));

export const userProblemsRelations = relations(userProblems, ({ one }) => ({
  user: one(users, {
    fields: [userProblems.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [userProblems.problemId],
    references: [problems.id],
  }),
}));

export const resourcesRelations = relations(resources, ({ many }) => ({
  userResources: many(userResources),
}));

export const userResourcesRelations = relations(userResources, ({ one }) => ({
  user: one(users, {
    fields: [userResources.userId],
    references: [users.id],
  }),
  resource: one(resources, {
    fields: [userResources.resourceId],
    references: [resources.id],
  }),
}));

export const revisionsRelations = relations(revisions, ({ one }) => ({
  user: one(users, {
    fields: [revisions.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [revisions.problemId],
    references: [problems.id],
  }),
}));

export const mistakesRelations = relations(mistakes, ({ one }) => ({
  user: one(users, {
    fields: [mistakes.userId],
    references: [users.id],
  }),
  problem: one(problems, {
    fields: [mistakes.problemId],
    references: [problems.id],
  }),
}));
