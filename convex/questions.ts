import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// CREATE a new question
export const createQuestion = mutation({
  args: {
    lessonId: v.id("lessons"),
    questionText: v.string(),
    options: v.array(v.string()),
    correctAnswerIndex: v.number(),
    difficulty: v.string(), // "basic", "kudlit", "word", "sentence"
  },
  handler: async (ctx, args) => {
    const questionId = await ctx.db.insert("questions", {
      lessonId: args.lessonId,
      questionText: args.questionText,
      options: args.options,
      correctAnswerIndex: args.correctAnswerIndex,
      difficulty: args.difficulty,
    });
    return questionId;
  },
});

export const getRandomQuestionsByLesson = query({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", args.lessonId))
      .collect();

    // Shuffle questions
    for (let i = questions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [questions[i], questions[j]] = [questions[j], questions[i]];
    }

    return questions;
  },
});


export const submitAnswer = mutation({
  args: {
    userId: v.id("users"),
    questionId: v.id("questions"),
    selectedAnswerIndex: v.number(),
  },
  handler: async (ctx, args) => {
    const question = await ctx.db.get(args.questionId);
    if (!question) throw new Error("Question not found");

    const isCorrect = args.selectedAnswerIndex === question.correctAnswerIndex;

    // Save the answer result
    await ctx.db.insert("answers", {
      userId: args.userId,
      questionId: args.questionId,
      isCorrect,
      timestamp: Date.now(),
    });

    return { isCorrect };
  },
});

export const getUserLessonStats = query({
  args: {
    userId: v.id("users"),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const questions = await ctx.db
      .query("questions")
      .withIndex("by_lessonId", (q) => q.eq("lessonId", args.lessonId))
      .collect();

    const questionIds = questions.map((q) => q._id.toString());

    const allAnswers = await ctx.db
      .query("answers")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .collect();

    const relevantAnswers = allAnswers.filter((a) =>
      questionIds.includes(a.questionId.toString())
    );

    const correct = relevantAnswers.filter((a) => a.isCorrect).length;
    const total = relevantAnswers.length;

    return {
      correct,
      total,
      accuracy: total > 0 ? correct / total : 0,
    };
  },
});
