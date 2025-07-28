import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const recordSingleAnswer = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.string(),
    symbol: v.string(),
    label: v.string(),
    type: v.union(v.literal("mcq"), v.literal("writing"), v.literal("drag")), 
    expected: v.string(),
    result: v.union(v.literal("correct"), v.literal("wrong")),
    pointsEarned: v.number(),
    createdAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("quiz_answers", args);
  },
});

export const recordQuizAttempt = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.string(),
    score: v.number(),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    earnedStars: v.number(),
    answers: v.array(
      v.object({
        symbol: v.string(),
        label: v.string(),
        type: v.union(v.literal("mcq"), v.literal("writing"), v.literal("drag")), 
        expected: v.string(),
        result: v.union(v.literal("correct"), v.literal("wrong")),
        pointsEarned: v.number(),
      })
    ),
    createdAt: v.number(),
    timeSpent: v.number(),
    isRetake: v.boolean(),
    attemptNumber: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("user_quiz_attempts", args);
  },
});

export const getAttemptsForLesson = query({
  args: { userId: v.id("users"), lessonId: v.string() },
  handler: async (ctx, { userId, lessonId }) => {
    return await ctx.db
      .query("user_quiz_attempts")
      .withIndex("by_user_lesson", (q) => q.eq("userId", userId).eq("lessonId", lessonId))
      .collect();
  },
});