import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all users with optional search
export const listUsers = query({
  args: { search: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();

    if (args.search) {
      const term = args.search.toLowerCase();
      return users.filter(
        (u) =>
          u.email.toLowerCase().includes(term) ||
          (u.name && u.name.toLowerCase().includes(term))
      );
    }

    return users;
  },
});

// Quick stats
export const getUserStats = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const totalUsers = users.length;

    // active in the last 7 days
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const activeThisWeek = users.filter(
      (u) => (u.lastActive ?? 0) > weekAgo
    ).length;

    // signups in the last 7 days
    const newSignups = users.filter(
      (u) => (u._creationTime ?? 0) > weekAgo
    ).length;

    return { totalUsers, activeThisWeek, newSignups };
  },
});

// Ban/delete a user
export const deleteUser = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.userId);
  },
});

// Reset user progress
export const resetUserProgress = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    // wipe progress tables
    const progress = await ctx.db
      .query("user_lesson_progress")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    for (const p of progress) {
      await ctx.db.delete(p._id);
    }

    const attempts = await ctx.db
      .query("user_quiz_attempts")
      .withIndex("by_user_lesson", (q) => q.eq("userId", args.userId))
      .collect();

    for (const a of attempts) {
      await ctx.db.delete(a._id);
    }

    // optionally reset XP
    await ctx.db.patch(args.userId, { totalXP: 0 });
  },
});
