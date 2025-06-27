import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getProgress = query({
  args: {
    userId: v.string(),
    lessonId: v.string(),
  },
  handler: async (ctx, { userId, lessonId }) => {
    console.log("getProgress() called with:", { userId, lessonId });

    const progress = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user_lesson", (q) =>
      q.eq("userId", userId).eq("lessonId", lessonId)
      )
      .unique();

    console.log("Queried progress result:", progress);

    return {
      bestScore: progress?.bestScore ?? 0,
      bestStars: progress?.bestStars ?? 0,
    };
  },
});


export const saveProgress = mutation({
  args: {
    userId: v.string(),
    lessonId: v.string(),
    score: v.number(),
    stars: v.number(),
  },
  handler: async (ctx, { userId, lessonId, score, stars }) => {
    const existing = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user_lesson", (q) =>
      q.eq("userId", userId).eq("lessonId", lessonId)
    )
  .unique();

    if (existing) {
      const newBestScore = Math.max(existing.bestScore, score);
      const newBestStars = Math.max(existing.bestStars, stars);
      
      await ctx.db.patch(existing._id, {
        bestScore: newBestScore,
        bestStars: newBestStars,
        completedAt: Date.now(),
        isCompleted: true,
      });
    } else {
      await ctx.db.insert("user_lesson_progress", {
        userId,
        lessonId,
        bestScore: score,
        bestStars: stars,
        firstAttemptAt: Date.now(),
        completedAt: Date.now(),
        isCompleted: true,
      });
    }
  },
});
