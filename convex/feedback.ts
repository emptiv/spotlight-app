import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Get survey questions (ordered)
export const getSurveyQuestions = query({
  args: { surveyId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("survey_questions")
      .withIndex("by_survey_order", (q) => q.eq("surveyId", args.surveyId))
      .order("asc")
      .collect();
  },
});

// ✅ Submit feedback (one per user per survey)
export const submitFeedback = mutation({
  args: {
    userId: v.string(),
    surveyId: v.string(),
    userInfo: v.object({
      name: v.optional(v.string()),
      course: v.string(),
      year: v.string(),
    }),
    responses: v.array(
      v.object({
        questionId: v.string(),
        value: v.optional(v.number()),
        response: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_feedback")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("surveyId"), args.surveyId))
      .first(); // safer than .unique()

    if (existing) {
      throw new Error("Feedback already submitted for this survey.");
    }

    return await ctx.db.insert("user_feedback", {
      userId: args.userId,
      surveyId: args.surveyId,
      userInfo: args.userInfo,
      responses: args.responses,
      createdAt: Date.now(),
    });
  },
});

// ✅ Check if user has completed a survey
export const hasSubmittedFeedback = query({
  args: { userId: v.string(), surveyId: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("user_feedback")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .filter((q) => q.eq(q.field("surveyId"), args.surveyId))
      .first();

    return !!existing; // true if completed
  },
});
