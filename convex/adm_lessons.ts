import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// --- LESSONS ---

export const listLessons = query({
  handler: async (ctx) => {
    return await ctx.db.query("lessons").order("asc").collect();
  },
});

export const addLesson = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    chapter: v.number(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("lessons", args);
  },
});


export const updateLesson = mutation({
  args: {
    id: v.id("lessons"),
    title: v.string(),
    description: v.string(),
    chapter: v.number(),
    order: v.number(),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, updates);
  },
});

export const deleteLesson = mutation({
  args: { id: v.id("lessons") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

// --- VOCABULARY ---

export const listVocab = query({
  handler: async (ctx) => {
    return await ctx.db.query("vocabulary").collect();
  },
});

export const createVocab = mutation({
  args: {
    latin: v.string(),
    baybayin: v.string(),
    difficulty: v.union(v.literal("easy"), v.literal("medium"), v.literal("hard")),
    type: v.union(v.literal("word"), v.literal("phrase"), v.literal("expression")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("vocabulary", args);
  },
});

export const deleteVocab = mutation({
  args: { id: v.id("vocabulary") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const getLessonStats = query({
  handler: async (ctx) => {
    const lessons = await ctx.db.query("lessons").collect();

    return {
      totalLessons: lessons.length,
      totalChapters: new Set(lessons.map((l) => l.chapter)).size,
      averageOrder: lessons.length
        ? lessons.reduce((sum, l) => sum + (l.order ?? 0), 0) / lessons.length
        : 0,
    };
  },
});

// --- VOCABULARY STATS ---
export const getVocabStats = query({
  handler: async (ctx) => {
    const vocab = await ctx.db.query("vocabulary").collect();

    return {
      total: vocab.length,
      easy: vocab.filter((v) => v.difficulty === "easy").length,
      medium: vocab.filter((v) => v.difficulty === "medium").length,
      hard: vocab.filter((v) => v.difficulty === "hard").length,
      words: vocab.filter((v) => v.type === "word").length,
      phrases: vocab.filter((v) => v.type === "phrase").length,
      expressions: vocab.filter((v) => v.type === "expression").length,
    };
  },
});
