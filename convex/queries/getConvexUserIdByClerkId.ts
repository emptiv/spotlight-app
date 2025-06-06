import { v } from "convex/values";
import { query } from "../_generated/server";

export const getConvexUserIdByClerkId = query({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .first();

    if (!user) return null;

    return user._id;
  },
});