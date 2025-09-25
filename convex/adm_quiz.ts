import { query } from "./_generated/server";

// --- Recent Quiz Attempts ---
export const recentQuizAttempts = query({
  handler: async (ctx) => {
    const attempts = await ctx.db.query("user_quiz_attempts").collect();
    const lessons = await ctx.db.query("lessons").collect();
    const users = await ctx.db.query("users").collect();

    return attempts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20)
      .map((a) => {
        const user = users.find((u) => u._id.toString() === a.userId);
        const lesson = lessons.find((l) => l._id.toString() === a.lessonId);
        return {
          attemptId: a._id.toString(),
          userId: a.userId,
          userName: user?.name || user?.email || "Unknown",
          lessonId: a.lessonId,
          lessonTitle: lesson?.title || "Unknown",
          score: a.score,
          totalQuestions: a.totalQuestions,
          correctAnswers: a.correctAnswers,
          earnedStars: a.earnedStars,
          createdAt: a.createdAt,
        };
      });
  },
});

// --- Typing Challenge Summary ---
export const typingChallengeStats = query({
  handler: async (ctx) => {
    const challenges = await ctx.db.query("typing_challenges").collect();
    if (!challenges.length) return { avgAccuracy: 0, totalMistakes: 0 };

    let totalCorrect = 0;
    let totalQuestions = 0;
    let totalMistakes = 0;

    for (const c of challenges) {
      for (const ans of c.answers) {
        totalCorrect += ans.result === "correct" ? 1 : 0;
        totalQuestions += 1;
        if (ans.result === "wrong") totalMistakes++;
      }
    }

    const avgAccuracy = (totalCorrect / totalQuestions) * 100;
    return { avgAccuracy, totalMistakes };
  },
});

// --- Most Common Mistakes (MCQ / Writing / Drag) ---
export const mostCommonMistakes = query({
  handler: async (ctx) => {
    const answers = await ctx.db.query("quiz_answers").collect();
    const mistakeCounts: Record<string, number> = {};

    for (const a of answers) {
      if (a.result === "wrong") {
        const key = a.symbol || "[blank]";
        mistakeCounts[key] = (mistakeCounts[key] || 0) + 1;
      }
    }

    return Object.entries(mistakeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([symbol, count]) => ({ symbol, count }));
  },
});

// --- Hardest Symbols by Attempt Type (MCQ / Writing / Drag) ---
export const hardestSymbolsByType = query({
  handler: async (ctx) => {
    const answers = await ctx.db.query("quiz_answers").collect();
    const stats: Record<"mcq" | "writing" | "drag", Record<string, number>> = {
      mcq: {},
      writing: {},
      drag: {},
    };

    for (const a of answers) {
      if (["mcq", "writing", "drag"].includes(a.type)) {
        const type = a.type as "mcq" | "writing" | "drag";
        const symbol = a.symbol || "[blank]";
        stats[type][symbol] = (stats[type][symbol] || 0) + (a.result === "wrong" ? 1 : 0);
      }
    }

    const hardest: Record<"mcq" | "writing" | "drag", string> = {
      mcq: "-",
      writing: "-",
      drag: "-",
    };

    for (const type of ["mcq", "writing", "drag"] as const) {
      let maxMistakes = 0;
      for (const sym in stats[type]) {
        if (stats[type][sym] > maxMistakes) {
          maxMistakes = stats[type][sym];
          hardest[type] = sym;
        }
      }
    }

    return hardest;
  },
});
