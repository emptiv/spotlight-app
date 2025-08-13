import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

const PERFECTIONIST_BADGE = "Perfectionist";
const PERFECTIONIST_DESCRIPTION =
  "Answered all questions correctly without using any hearts";

export const insertTypingChallenge = mutation({
  args: {
    userId: v.string(),
    score: v.number(),
    stars: v.number(),
    answers: v.array(
      v.object({
        symbol: v.string(),
        label: v.string(),
        expected: v.string(),
        result: v.union(v.literal("correct"), v.literal("wrong")),
        pointsEarned: v.number(),
        timeTaken: v.number(),
      })
    ),
    createdAt: v.number(),
    timeSpent: v.number(),
    numberOfQuestions: v.number(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    heartsUsed: v.optional(v.number()), // optional
  },
  handler: async (ctx, args) => {
    // Insert the challenge record
    await ctx.db.insert("typing_challenges", args);

    const awardedBadges: string[] = [];

    // Check for Perfectionist achievement
    const allCorrect = args.answers.every((a) => a.result === "correct");
    const noHeartsUsed = !args.heartsUsed || args.heartsUsed === 0;

    if (allCorrect && noHeartsUsed) {
      // Directly insert every time — no "already has" check
      await ctx.db.insert("user_achievements", {
        userId: args.userId,
        badge: PERFECTIONIST_BADGE,
        description: PERFECTIONIST_DESCRIPTION,
        earnedAt: Date.now(),
        lessonId:"typing", // optional
      });

      awardedBadges.push(PERFECTIONIST_BADGE);
    }
    return { newlyAwarded: awardedBadges };
  },
});

// Existing queries remain unchanged
export const getBestTypingPerformance = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const challenges = await ctx.db
      .query("typing_challenges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (challenges.length === 0) return { bestScore: 0, bestStars: 0 };

    const best = challenges.reduce(
      (acc, curr) => ({
        bestScore: Math.max(acc.bestScore, curr.score),
        bestStars: Math.max(acc.bestStars, curr.stars),
      }),
      { bestScore: 0, bestStars: 0 }
    );

    return best;
  },
});

export const getBestPerformancesByType = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const challenges = await ctx.db
      .query("typing_challenges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (challenges.length === 0) return {};

    const grouped = challenges.reduce((acc, challenge) => {
      const key = `${challenge.numberOfQuestions}_${challenge.difficulty}`;
      if (!acc[key]) {
        acc[key] = { bestScore: challenge.score, bestStars: challenge.stars };
      } else {
        acc[key].bestScore = Math.max(acc[key].bestScore, challenge.score);
        acc[key].bestStars = Math.max(acc[key].bestStars, challenge.stars);
      }
      return acc;
    }, {} as Record<string, { bestScore: number; bestStars: number }>);

    return grouped;
  },
});
