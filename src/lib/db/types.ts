import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from "drizzle-zod";
import { users, posts, postLikes, queryAnalyses } from "./schema";
import z from "zod";

// User schemas
export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export const updateUserSchema = insertUserSchema.omit({
  id: true,
  createdAt: true,
  hashedPassword: true,
});

// Post schemas
export const insertPostSchema = createInsertSchema(posts, {
  title: z.string().min(1).max(100),
  content: z.string().min(1).max(5000),
  authorId: z.number(),
});
export const selectPostSchema = createSelectSchema(posts);
export const updatePostSchema = createUpdateSchema(posts, {
  title: z.string().min(1).max(100).optional(),
  content: z.string().min(1).max(5000).optional(),
});

// PostLike schemas
export const insertPostLikeSchema = createInsertSchema(postLikes);
export const selectPostLikeSchema = createSelectSchema(postLikes);

// QueryAnalysis schemas
export const insertQueryAnalysisSchema = createInsertSchema(queryAnalyses);
export const selectQueryAnalysisSchema = createSelectSchema(queryAnalyses);

// Types
export type User = typeof users.$inferSelect;
export type UserWithoutPassword = Omit<User, 'hashedPassword'>;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type PostLike = typeof postLikes.$inferSelect;
export type NewPostLike = typeof postLikes.$inferInsert;
export type QueryAnalysis = typeof queryAnalyses.$inferSelect;
export type NewQueryAnalysis = typeof queryAnalyses.$inferInsert;
