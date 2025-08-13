import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserAchievements = query({
  args: { userId: v.string() },
  handler: async (ctx, { userId }) => {
    return await ctx.db
      .query("user_achievements")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc") // newest first
      .collect();
  },
});
