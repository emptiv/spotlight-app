import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

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
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("typing_challenges", args);
  },
});

export const getBestTypingPerformance = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    const challenges = await ctx.db
      .query("typing_challenges")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();

    if (challenges.length === 0) {
      return { bestScore: 0, bestStars: 0 };
    }

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