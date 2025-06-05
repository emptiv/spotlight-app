import { v } from "convex/values";
import { mutation } from "./_generated/server";

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

