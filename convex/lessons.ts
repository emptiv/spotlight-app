import { v } from "convex/values";
import { mutation } from "./_generated/server";

// CREATE a lesson
export const createLesson = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    const lessonId = await ctx.db.insert("lessons", {
      title: args.title,
      description: args.description,
      order: args.order,
    });
    return lessonId;
  },
});
