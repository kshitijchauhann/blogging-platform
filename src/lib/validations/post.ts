import { z } from 'zod';

export const createPostSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  status: z.enum(['draft', 'published']).optional().default('draft'),
  content: z.any(), // Adjust based on your JSONB structure (e.g., TipTap JSON, Markdown, etc.)
  author: z.string().min(1, 'Author is required').max(255, 'Author must be less than 255 characters'),
});

export const updatePostSchema = z.object({
  id: z.number(),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  status: z.enum(['draft', 'published']),
  content: z.any(),
  author: z.string().min(1, 'Author is required').max(255, 'Author must be less than 255 characters'),
});

export const updatePostStatusSchema = z.object({
  id: z.number(),
  status: z.enum(['draft', 'published']),
});

export const deletePostSchema = z.object({
  id: z.number(),
});

export const addCategoriesToPostSchema = z.object({
  postId: z.number(),
  categoryIds: z.array(z.number()).min(1, 'At least one category ID is required'),
});

export const removeCategoriesFromPostSchema = z.object({
  postId: z.number(),
  categoryIds: z.array(z.number()).min(1, 'At least one category ID is required'),
});
