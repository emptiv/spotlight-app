import { query } from "./_generated/server";

// 1. Badges per User
export const badgesPerUser = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const achievements = await ctx.db.query("user_achievements").collect();

    const badgeCounts: Record<string, number> = {};
    for (const a of achievements) {
      const userId = a.userId.toString();
      badgeCounts[userId] = (badgeCounts[userId] || 0) + 1;
    }

    return users.map((u) => ({
      userId: u._id.toString(),
      name: u.name || u.email || "Unknown",
      badgeCount: badgeCounts[u._id.toString()] || 0,
    }));
  },
});

// 2. Achievement Frequency
export const achievementFrequency = query({
  handler: async (ctx) => {
    const achievements = await ctx.db.query("user_achievements").collect();

    const freq: Record<string, number> = {};
    for (const a of achievements) {
      freq[a.badge] = (freq[a.badge] || 0) + 1;
    }

    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);

    return {
      mostCommon: sorted[0]
        ? { badge: sorted[0][0], count: sorted[0][1] }
        : null,
      leastCommon:
        sorted.length > 0
          ? { badge: sorted[sorted.length - 1][0], count: sorted[sorted.length - 1][1] }
          : null,
      all: sorted.map(([badge, count]) => ({ badge, count })),
    };
  },
});

// 3. Streak Keepers
export const streakKeepers = query({
  handler: async (ctx) => {
    // pull users
    const users = await ctx.db.query("users").collect();

    // streak = number of consecutive days active
    // for simplicity, assume `lastActive` is a timestamp and
    // `streakCount` is stored separately or inferred. Let's infer it:
    const today = Date.now();
    const DAY = 24 * 60 * 60 * 1000;

    // For now: streak = how many consecutive days they logged in within the last week
    const streaks = users.map((u) => {
      const lastActive = u.lastActive || 0;
      const diffDays = Math.floor((today - lastActive) / DAY);

      return {
        userId: u._id.toString(),
        name: u.name || u.email || "Unknown",
        streakCount: diffDays === 0 ? 1 : 0, // simplistic: active today = 1
      };
    });

    // Sort by streak descending
    return streaks.sort((a, b) => b.streakCount - a.streakCount).slice(0, 10);
  },
});
