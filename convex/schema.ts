import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({

  users: defineTable({
    email: v.string(),
    clerkId: v.string(),
    name: v.optional(v.string()),
    totalXP: v.optional(v.number()),
    lastActive: v.optional(v.number()), // ISO string
  })
    .index("by_email", ["email"])
    .index("by_clerkId", ["clerkId"]),

  lessons: defineTable({
    title: v.string(),
    description: v.string(),
    chapter: v.number(),
    order: v.number(),
  }),
  quiz_answers: defineTable({
    userId: v.id("users"),
    lessonId: v.string(),
    symbol: v.string(),
    label: v.string(),
    type: v.union(v.literal("mcq"), v.literal("writing"), v.literal("drag")),
    expected: v.string(),
    result: v.union(v.literal("correct"), v.literal("wrong")),
    pointsEarned: v.number(),
    createdAt: v.number(),
  }).index("by_user", ["userId"]),
  user_quiz_attempts: defineTable({
    userId: v.string(),
    lessonId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    earnedStars: v.number(),
    answers: v.array(
      v.object({
        symbol: v.string(),
        label: v.string(),
        expected: v.string(),
        type: v.union(v.literal("mcq"), v.literal("writing"), v.literal("drag")),
        result: v.union(v.literal("correct"), v.literal("wrong")),
        pointsEarned: v.number(),
      })
    ),
    createdAt: v.number(),
    timeSpent: v.number(),
    isRetake: v.boolean(),
    attemptNumber: v.number(),
  }).index("by_user_lesson", ["userId", "lessonId"]),

  user_difficulties: defineTable({
    userId: v.string(),
    symbol: v.string(),
    label: v.string(),
    expected: v.string(),
    type: v.union(v.literal("mcq"), v.literal("writing"), v.literal("drag")),
    attempts: v.number(),
    totalPoints: v.number(),
    wasDifficult: v.boolean(),
    lastAttempt: v.number(),
  }).index("by_user", ["userId"]),

  user_lesson_progress: defineTable({
    userId: v.string(),
    lessonId: v.string(),
    isCompleted: v.boolean(),
    bestScore: v.number(),
    bestStars: v.number(),
    firstAttemptAt: v.number(),
    completedAt: v.optional(v.number()),
  }).index("by_user_lesson", ["userId", "lessonId"])
  .index("by_user", ["userId"]),

  vocabulary: defineTable({
    latin: v.string(),     
    baybayin: v.string(),  
    difficulty: v.union(
      v.literal("easy"),
      v.literal("medium"),
      v.literal("hard")
    ),
    type: v.union(
      v.literal("word"),
      v.literal("phrase"),
      v.literal("expression")
    ),
  })
  .index("by_difficulty", ["difficulty"])
  .index("by_type", ["type"]),
});