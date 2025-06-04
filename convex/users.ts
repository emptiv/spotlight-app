import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    
    const existingUser = await ctx.db.query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first()
    
      if (existingUser) return

    await ctx.db.insert("users", {
      email: args.email,
      clerkId: args.clerkId
    });
  }

});

