import { query } from "./_generated/server";

// --- Most Completed Lessons ---
export const lessonsCompleted = query({
  handler: async (ctx) => {
    const progress = await ctx.db.query("user_lesson_progress").collect();
    const lessonMap: Record<string, number> = {};
    for (const p of progress) {
      if (p.isCompleted) lessonMap[p.lessonId] = (lessonMap[p.lessonId] || 0) + 1;
    }

    // Get lesson titles
    const lessons = await ctx.db.query("lessons").collect();
    return Object.entries(lessonMap).map(([lessonId, count]) => {
      const lesson = lessons.find((l) => l._id.toString() === lessonId);
      return { lessonId, title: lesson?.title ?? "Unknown", count };
    });
  },
});

// --- Average Quiz Scores by difficulty ---
export const averageQuizScores = query({
  handler: async (ctx) => {
    const answers = await ctx.db.query("quiz_answers").collect();
    const difficultyMap: Record<string, { total: number; count: number }> = {
      easy: { total: 0, count: 0 },
      medium: { total: 0, count: 0 },
      hard: { total: 0, count: 0 },
    };

    // Map lessonId → difficulty
    const lessons = await ctx.db.query("lessons").collect();
    const lessonDifficulty: Record<string, "easy" | "medium" | "hard"> = {};
    for (const l of lessons) {
      lessonDifficulty[l._id.toString()] = "medium"; // default
    }

    for (const ans of answers) {
      const diff = lessonDifficulty[ans.lessonId] || "medium";
      difficultyMap[diff].total += ans.result === "correct" ? 100 : 0;
      difficultyMap[diff].count += 1;
    }

    const avgScores: Record<string, number> = {};
    for (const [diff, { total, count }] of Object.entries(difficultyMap)) {
      avgScores[diff] = count ? Math.round(total / count) : 0;
    }

    return avgScores;
  },
});

// --- Difficulty Attempts Distribution ---
export const difficultyAttempts = query({
  handler: async (ctx) => {
    const attempts = await ctx.db.query("quiz_answers").collect();
    const result: Record<string, number> = { easy: 0, medium: 0, hard: 0 };

    const lessons = await ctx.db.query("lessons").collect();
    const lessonDifficulty: Record<string, "easy" | "medium" | "hard"> = {};
    for (const l of lessons) {
      lessonDifficulty[l._id.toString()] = "medium"; // default
    }

    for (const a of attempts) {
      const diff = lessonDifficulty[a.lessonId] || "medium";
      result[diff] += 1;
    }
    return result;
  },
});

// --- Daily/Weekly Active Users ---
export const activeUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;

    let daily = 0;
    let weekly = 0;
    for (const u of users) {
      if (!u.lastActive) continue;
      const diff = now - u.lastActive;
      if (diff <= oneDay) daily += 1;
      if (diff <= oneWeek) weekly += 1;
    }

    return { daily, weekly };
  },
});

// --- XP Leaderboard (Top 10) ---
export const xpLeaderboard = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const sorted = users
      .sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0))
      .slice(0, 10)
      .map((u) => ({ userId: u._id.toString(), name: u.name || u.email, totalXP: u.totalXP || 0 }));
    return sorted;
  },
});

// --- User Activity Heatmap (hourly by lastActive) ---
export const userActivityHeatmap = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const activity: { day: number; hour: number; count: number }[] = [];

    // init empty 7x24 grid
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        activity.push({ day, hour, count: 0 });
      }
    }

    const now = new Date();
    for (const u of users) {
      if (!u.lastActive) continue;
      const d = new Date(u.lastActive);
      const day = (d.getDay() + 6) % 7; // 0 = Monday
      const hour = d.getHours();
      const idx = day * 24 + hour;
      activity[idx].count += 1;
    }

    return activity;
  },
});

// Average quiz scores per lesson

export const averageQuizScoresPerLesson = query({
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();
    const attempts = await ctx.db.query("user_quiz_attempts").collect();

    return lessons.map((lesson) => {
      const lessonAttempts = attempts.filter(
        (a) => a.lessonId === lesson._id.toString()
      );

      const averageScore =
        lessonAttempts.length > 0
          ? lessonAttempts.reduce((sum, a) => sum + a.score, 0) /
            lessonAttempts.length
          : 0;

      return {
        lessonId: lesson._id.toString(),
        title: lesson.title,
        averageScore,
      };
    });
  },
});



// --- User attempt type distribution (mcq / writing / drag) ---
export const userAttemptTypeDistribution = query({
  handler: async (ctx) => {
    const attempts = await ctx.db.query("quiz_answers").collect();
    const distribution = { mcq: 0, writing: 0, drag: 0 };

    for (const a of attempts) {
      if (distribution[a.type] !== undefined) distribution[a.type]++;
    }

    return distribution;
  },
});