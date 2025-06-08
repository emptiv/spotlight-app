// convex/userAttempts.ts
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const saveAttempt = mutation({
  args: {
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    answers: v.record(v.string(), v.number()),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    createdAt: v.string(),
    score: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("userAttempts", args);
  },
});