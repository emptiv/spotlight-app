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
    heartsUsed: v.optional(v.number()), // <-- add this if you track hearts
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("user_quiz_attempts", args);

    // === Challenger Badge ===
    const existingBadge = await ctx.db
      .query("user_achievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (!existingBadge.some((a) => a.badge === "Challenger")) {
      const firstLessonId = "jx72aewjef2n2jzw5ajht6b32s7jb6bm";
      if (args.lessonId === firstLessonId) {
        await ctx.db.insert("user_achievements", {
          userId: args.userId,
          badge: "Challenger",
          description: "Completed the first quiz",
          earnedAt: Date.now(),
          lessonId: args.lessonId,
        });
      }
    }

    // === Perfectionist Badge (repeatable) ===
    if (args.heartsUsed === 0) {
      await ctx.db.insert("user_achievements", {
        userId: args.userId,
        badge: "Perfectionist",
        description: `Finished lesson ${args.lessonId} without exhausting a heart`,
        earnedAt: Date.now(),
        lessonId: args.lessonId, // optional, to know which lesson/attempt
      });
    }
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

export const getUserAchievements = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("user_achievements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
  },
});