import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const PERFECTIONIST_BADGE = "Perfectionist";
const PERFECTIONIST_DESCRIPTION =
  "Answered all questions correctly without using any hearts";

export const recordSingleAnswer = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.string(),
    sessionId: v.optional(v.string()),
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
    heartsUsed: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("user_quiz_attempts", args);

    const newlyAwarded: { badge: string; description: string }[] = [];

    // === Challenger Badge ===
    const existingBadges = await ctx.db
      .query("user_achievements")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    if (!existingBadges.some((a) => a.badge === "Challenger")) {
      const firstLessonId = "kd78w1b0ydkpt1wcppqwabwxc17qcm1d";
      if (args.lessonId === firstLessonId) {
        await ctx.db.insert("user_achievements", {
          userId: args.userId,
          badge: "Challenger",
          description: "Completed the first quiz",
          earnedAt: Date.now(),
          lessonId: args.lessonId,
        });
        newlyAwarded.push({
          badge: "Challenger",
          description: "Completed the first quiz",
        });
      }
    }

    // === Perfectionist Badge (repeatable) ===
    if (args.heartsUsed === 0) {
      await ctx.db.insert("user_achievements", {
        userId: args.userId,
        badge: PERFECTIONIST_BADGE,
        description: PERFECTIONIST_DESCRIPTION,
        earnedAt: Date.now(),
        lessonId: args.lessonId,
      });
      newlyAwarded.push({
        badge: PERFECTIONIST_BADGE,
        description: PERFECTIONIST_DESCRIPTION,
      });
    }

    // Return newly awarded badges so frontend can display them
    return { newlyAwarded };
  },
});

export const getAttemptsForLesson = query({
  args: { userId: v.id("users"), lessonId: v.string() },
  handler: async (ctx, { userId, lessonId }) => {
    return await ctx.db
      .query("user_quiz_attempts")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId)
      )
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

export const deleteUnfinishedAnswers = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.string(),
    sessionId: v.string(),
  },
  handler: async (ctx, { userId, lessonId, sessionId }) => {
    const answers = await ctx.db
      .query("quiz_answers")
      .withIndex("by_user_lesson_session", q =>
        q.eq("userId", userId)
         .eq("lessonId", lessonId)
         .eq("sessionId", sessionId) // ✅ only delete current session
      )
      .collect();

    for (const answer of answers) {
      await ctx.db.delete(answer._id);
    }
  },
});
