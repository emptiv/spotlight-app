import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    
    const existingUser = await ctx.db.query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first()
    
    if (existingUser) {
      console.log("User with this email already exists:", args.email);
      return;
    }

    await ctx.db.insert("users", {
      email: args.email,
      clerkId: args.clerkId
    });
  }

});

export const getConvexUserIdByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();

    if (!user) {
      throw new Error(`No Convex user found for Clerk ID: ${args.clerkId}`);
    }

    return user._id;
  },
});