import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    clerkId: v.string()
  })
  .index("by_email", ["email"])
  .index("by_clerkId", ["clerkId"]),

  
  // Lessons table
  lessons: defineTable({
    title: v.string(),             
    description: v.string(),        
    order: v.number(),           
  }),

  // Questions per lesson
  questions: defineTable({
    lessonId: v.id("lessons"),
    questionText: v.string(),
    options: v.array(v.string()),     // e.g., ["ᜀ", "ᜁ", "ᜂ"]
    correctAnswerIndex: v.number(),   // e.g., 0
  }).index("by_lessonId", ["lessonId"]),

  //  User answers
  answers: defineTable({
    userId: v.id("users"),
    questionId: v.id("questions"),
    isCorrect: v.boolean(),
    timestamp: v.number(),
  }).index("by_userId", ["userId"]),

  //  Per-lesson stats for each user
  userStats: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    lastAttempt: v.string(),
  }).index("by_user_lesson", ["userId", "lessonId"]),

  userAttempts: defineTable({
    userId: v.id("users"),
    lessonId: v.id("lessons"),
    answers: v.record(v.string(), v.number()), // questionId => selectedIndex
    totalQuestions: v.number(),
    correctAnswers: v.number(),
    createdAt: v.string(), // ISO date string
  }).index("by_user_lesson", ["userId", "lessonId"]),

});