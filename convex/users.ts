import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createUser = mutation({
  args: {
    email: v.string(),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    
    const existingUser = await ctx.db.query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique()
    
    if (existingUser) {
      console.log("User with this Clerk ID already exists:", args.clerkId);
      return;
    }

    const existingEmail = await ctx.db.query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .unique()
    
    if (existingEmail) {
      console.log("Email already in use:", args.email);
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

export const updateUserStats = mutation({
  args: {
    clerkId: v.string(),
    totalXP: v.number(),
  },
  handler: async (ctx, { clerkId, totalXP }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      totalXP: (user.totalXP ?? 0) + totalXP,
      lastActive: Date.now(), // set to current timestamp automatically
    });
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});

export const updateUserName = mutation({
  args: { userId: v.id("users"), name: v.string() },
  handler: async (ctx, { userId, name }) => {
    await ctx.db.patch(userId, { name });
  },
});