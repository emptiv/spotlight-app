import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const TOTAL_LESSONS = 7;
const SUPERNOVA_BADGE_NAME = "Su-su-supernova"; // Badge title
const SUPERNOVA_DESCRIPTION = "Finish all the lessons";

export const getProgress = query({
  args: {
    userId: v.string(),
    lessonId: v.string(),
  },
  handler: async (ctx, { userId, lessonId }) => {
    const progress = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user_lesson", (q) =>
        q.eq("userId", userId).eq("lessonId", lessonId)
      )
      .unique();

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

    const PASSING_STARS = 2;
    const now = Date.now();

    if (existing) {
      const newBestScore = Math.max(existing.bestScore, score);
      const newBestStars = Math.max(existing.bestStars, stars);

      await ctx.db.patch(existing._id, {
        bestScore: newBestScore,
        bestStars: newBestStars,
        isCompleted: newBestStars >= PASSING_STARS ? true : existing.isCompleted,
        completedAt:
          newBestStars >= PASSING_STARS
            ? now
            : existing.completedAt,
      });
    } else {
      await ctx.db.insert("user_lesson_progress", {
        userId,
        lessonId,
        bestScore: score,
        bestStars: stars,
        firstAttemptAt: now,
        completedAt: stars >= PASSING_STARS ? now : undefined,
        isCompleted: stars >= PASSING_STARS,
      });
    }

    // ✅ Only count lessons with enough stars as completed
    const allLessons = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completedCount = allLessons.filter(
      (l) => l.isCompleted && l.bestStars >= PASSING_STARS
    ).length;

    if (completedCount >= TOTAL_LESSONS) {
      // Check if the user already has this achievement
      const existingAchievement = await ctx.db
        .query("user_achievements")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .collect();

      const hasBadge = existingAchievement.some(
        (a) => a.badge === SUPERNOVA_BADGE_NAME
      );

      if (!hasBadge) {
        await ctx.db.insert("user_achievements", {
          userId,
          badge: SUPERNOVA_BADGE_NAME,
          description: SUPERNOVA_DESCRIPTION,
          earnedAt: Date.now(),
        });
      }
    }
  }
});

export const getCompletedLessons = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const all = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    return all
      .filter((entry) => entry.isCompleted)
      .map((entry) => entry.lessonId);
  },
});

export const checkSupernovaAchievement = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const all = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    const completedCount = all.filter((l) => l.isCompleted).length;

    const hasSupernova = completedCount >= TOTAL_LESSONS;

    return {
      achieved: hasSupernova,
      completedCount,
      totalLessons: TOTAL_LESSONS,
    };
  },
});
