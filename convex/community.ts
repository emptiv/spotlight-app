import { v } from "convex/values";
import { query } from "./_generated/server";

/**
 * Get top N users for the last 24 hours
 */
export const getDailyLeaderboard = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const since = Date.now() - 24 * 60 * 60 * 1000;

    const users = await ctx.db.query("users").collect();

    const recentUsers = users
      .filter(u => (u.lastActive ?? 0) >= since)
      .sort((a, b) => (b.totalXP ?? 0) - (a.totalXP ?? 0))
      .slice(0, limit)
      .map((u, idx) => ({
        rank: idx + 1,
        name: u.name ?? "Unknown",
        totalXP: u.totalXP ?? 0
      }));

    return recentUsers;
  },
});

/**
 * Get top N users for the last 7 days
 */
export const getWeeklyLeaderboard = query({
  args: { limit: v.number() },
  handler: async (ctx, { limit }) => {
    const since = Date.now() - 7 * 24 * 60 * 60 * 1000;

    const users = await ctx.db.query("users").collect();

    const recentUsers = users
      .filter(u => (u.lastActive ?? 0) >= since)
      .sort((a, b) => (b.totalXP ?? 0) - (a.totalXP ?? 0))
      .slice(0, limit)
      .map((u, idx) => ({
        rank: idx + 1,
        name: u.name ?? "Unknown",
        totalXP: u.totalXP ?? 0
      }));

    return recentUsers;
  },
});
