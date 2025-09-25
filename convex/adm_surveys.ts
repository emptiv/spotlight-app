import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- Get all surveys with their questions ---
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    const questions = await ctx.db.query("survey_questions").collect();

    const surveysMap: Record<
      string,
      { surveyId: string; questions: any[] }
    > = {};

    for (const q of questions) {
      if (!surveysMap[q.surveyId]) {
        surveysMap[q.surveyId] = { surveyId: q.surveyId, questions: [] };
      }
      surveysMap[q.surveyId].questions.push(q);
    }

    return Object.values(surveysMap).map((survey) => ({
      _id: survey.surveyId,
      title: `Survey ${survey.surveyId}`,
      questions: survey.questions.sort((a, b) => a.order - b.order),
    }));
  },
});

// --- Get survey questions for one survey ---
export const getSurveyQuestions = query({
  args: { surveyId: v.string() },
  handler: async (ctx, { surveyId }) => {
    return await ctx.db
      .query("survey_questions")
      .withIndex("by_survey_order", (q) => q.eq("surveyId", surveyId))
      .order("asc")
      .collect();
  },
});

// --- Add a new question ---
export const addQuestion = mutation({
  args: {
    surveyId: v.string(),
    questionId: v.string(),
    text: v.object({
      en: v.string(),
      fil: v.string(),
    }),
    type: v.union(v.literal("likert"), v.literal("open")),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("survey_questions", args);
  },
});

// --- Update a question ---
export const updateQuestion = mutation({
  args: {
    id: v.id("survey_questions"),
    text: v.optional(v.object({ en: v.string(), fil: v.string() })),
    type: v.optional(v.union(v.literal("likert"), v.literal("open"))),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});

// --- Remove a question ---
export const removeQuestion = mutation({
  args: { id: v.id("survey_questions") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// --- Get survey stats with user list ---
export const surveyStats = query({
  args: { surveyId: v.string() },
  handler: async (ctx, { surveyId }) => {
    // Fetch all users
    const users = await ctx.db.query("users").collect();

    // Fetch all feedback for this survey
    const feedback = await ctx.db
      .query("user_feedback")
      .withIndex("by_survey", (q) => q.eq("surveyId", surveyId))
      .collect();

    // answered = users where clerkId matches feedback.userId
    const answered = users
      .filter((u) => feedback.some((f) => f.userId === u.clerkId))
      .map((u) => {
        const fb = feedback.find((f) => f.userId === u.clerkId);
        return {
          id: u._id,
          name: u.name ?? "",
          email: u.email,
          course: fb?.userInfo?.course ?? "",
          year: fb?.userInfo?.year ?? "",
        };
      });

    const notAnswered = users
      .filter((u) => !feedback.some((f) => f.userId === u.clerkId))
      .map((u) => ({
        id: u._id,
        name: u.name ?? "",
        email: u.email,
      }));

    return {
      totalUsers: users.length,
      answeredCount: answered.length,
      notAnsweredCount: notAnswered.length,
      answered,
      notAnswered,
    };
  },
});
