import { v } from "convex/values";
import { query } from "./_generated/server";

export const getWords = query({
  args: {
    difficulty: v.string(),
    limit: v.number(),
    type: v.optional(v.string()), // "word", "phrase", etc.
  },
  handler: async (
    ctx: any,
    args: { difficulty: string; limit: number; type?: string }
  ) => {
    const allWords = await ctx.db
      .query("vocabulary")
      .filter((q: any) => {
        const filters = [q.eq(q.field("difficulty"), args.difficulty)];
        if (args.type) {
          filters.push(q.eq(q.field("type"), args.type));
        }
        return q.and(...filters);
      })
      .collect();

    // Shuffle the results
    const shuffled = allWords.sort(() => Math.random() - 0.5);

    // Ensure a valid limit
    const limit =
      typeof args.limit === "number" && args.limit > 0
        ? args.limit
        : shuffled.length;

    return shuffled.slice(0, Math.min(limit, shuffled.length));
  },
});
