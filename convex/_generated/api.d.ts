/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as getWords from "../getWords.js";
import type * as get_dashboard_data from "../get_dashboard_data.js";
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as queries_getConvexUserIdByClerkId from "../queries/getConvexUserIdByClerkId.js";
import type * as quiz from "../quiz.js";
import type * as typing from "../typing.js";
import type * as user_achievements from "../user_achievements.js";
import type * as user_lesson_progress from "../user_lesson_progress.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  getWords: typeof getWords;
  get_dashboard_data: typeof get_dashboard_data;
  http: typeof http;
  lessons: typeof lessons;
  "queries/getConvexUserIdByClerkId": typeof queries_getConvexUserIdByClerkId;
  quiz: typeof quiz;
  typing: typeof typing;
  user_achievements: typeof user_achievements;
  user_lesson_progress: typeof user_lesson_progress;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
