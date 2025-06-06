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
import type * as http from "../http.js";
import type * as lessons from "../lessons.js";
import type * as queries_getConvexUserIdByClerkId from "../queries/getConvexUserIdByClerkId.js";
import type * as questions from "../questions.js";
import type * as userAttempts from "../userAttempts.js";
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
  http: typeof http;
  lessons: typeof lessons;
  "queries/getConvexUserIdByClerkId": typeof queries_getConvexUserIdByClerkId;
  questions: typeof questions;
  userAttempts: typeof userAttempts;
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
