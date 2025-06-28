import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserDashboardData = query({
  args: {
    userId: v.string(), // Clerk ID from Clerk useAuth().userId
  },
  handler: async (ctx, { userId }) => {
    // Step 1: Look up the Convex user document by Clerk ID
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", userId))
      .unique();

    if (!user) return null;

    // Step 2: Fetch all lesson progress (Convex user._id is used)
    const lessonProgress = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Step 3: Fetch all quiz attempts (Clerk ID string is used)
    const quizAttempts = await ctx.db
      .query("user_quiz_attempts")
      .withIndex("by_user_lesson", (q) => q.eq("userId", userId))
      .collect();

    // Step 4: Fetch all quiz answers (Convex user ID is used)
    const quizAnswers = await ctx.db
      .query("quiz_answers")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Step 5: Build characterStats
    const labelMap = new Map<string, { correct: number; total: number }>();

    for (const answer of quizAnswers) {
      const { label, result } = answer;
      if (!label) continue;

      if (!labelMap.has(label)) {
        labelMap.set(label, { correct: 0, total: 0 });
      }
      const entry = labelMap.get(label)!;
      entry.total += 1;
      if (result === "correct") {
        entry.correct += 1;
      }
    }

    const characterStats = Array.from(labelMap.entries()).map(
      ([label, { correct, total }]) => ({
        label,
        correct,
        total,
        accuracy: correct / total,
      })
    );

    // Step 6: Build typeStats
    const typeStats = {
      mcq: { correct: 0, total: 0 },
      writing: { correct: 0, total: 0 },
    };

    for (const answer of quizAnswers) {
      const { type, result } = answer;
      if (type === "mcq" || type === "writing") {
        typeStats[type].total += 1;
        if (result === "correct") {
          typeStats[type].correct += 1;
        }
      }
    }

    return {
      user,
      lessonProgress,
      quizAttempts,
      characterStats,
      typeStats,
    };
  },
});