import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ------------------ USERS ------------------
  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    totalXP: v.optional(v.number()),
    lastActive: v.optional(v.string()), // ISO string
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  // ------------------ LESSONS ------------------
  lessons: defineTable({
    title: v.string(),
    description: v.string(),
    chapter: v.number(),
    order: v.number(),
  }),

  // ------------------ QUESTIONS ------------------
  questions: defineTable({
    lessonId: v.id("lessons"),
    questionText: v.string(),
    options: v.array(v.string()),
    correctAnswerIndex: v.number(),
    type: v.optional(v.union(v.literal("mcq"), v.literal("writing"))),
    character: v.optional(v.string()),
  }).index("by_lessonId", ["lessonId"]),

  // ------------------ MCQ/WRITING ANSWERS ------------------
  answers: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    answer: v.string(),
    isCorrect: v.boolean(),
    type: v.union(v.literal("mcq"), v.literal("writing")),
    timestamp: v.number(), // ms
  }).index("by_userId", ["userId"]),

  // ------------------ USER STATS ------------------
  userStats: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    lastAttempt: v.string(),
    score: v.optional(v.number()),
  }).index("by_user_lesson", ["userId", "lessonId"]),

  // ------------------ USER QUIZ ATTEMPTS ------------------
  userQuizAttempts: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    answers: v.record(v.string(), v.any()), // questionId -> selectedIndex or string
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    score: v.number(),
    createdAt: v.string(), // ISO string
    timeSpent: v.optional(v.number()), // ms
    questionType: v.optional(v.union(v.literal("mcq"), v.literal("writing"), v.literal("mixed"))),
    writingCorrect: v.optional(v.number()),
    firstAttemptAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    earnedStars: v.optional(v.number()),
    wrongQuestionIds: v.optional(v.array(v.string())),
    wrongCharacterIds: v.optional(v.array(v.string())),
    attemptNumber: v.optional(v.number()),
    isRetake: v.optional(v.boolean()),
    scoreBreakdown: v.optional(
      v.object({
        mcq: v.number(),
        writing: v.number(),
      })
    ),
  }).index("by_user_lesson", ["userId", "lessonId"]),

  // ------------------ WRITING QUIZ ATTEMPTS ------------------
  userWritingQuizAttempts: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    quizAttemptId: v.id("userQuizAttempts"),
    character: v.string(),
    isCorrect: v.boolean(),
    attemptNumber: v.number(),
    timeTaken: v.number(), // ms
    createdAt: v.string(),
    score: v.number(),
    wasRetry: v.boolean(),
  }).index("by_quizAttemptId", ["quizAttemptId"]),

  // ------------------ LESSON PROGRESS ------------------
  userLessonProgress: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    isCompleted: v.boolean(),
    firstAttemptAt: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    bestScore: v.optional(v.number()),
    bestStars: v.optional(v.number()),
  }).index("by_user_lesson", ["userId", "lessonId"]),
});
