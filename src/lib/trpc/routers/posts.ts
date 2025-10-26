import { router, publicProcedure } from '../init';
import { postsTable, categories, postCategories } from '@/lib/db/schema';
import { eq, desc, and, sql, inArray } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';
import { TRPCError } from '@trpc/server';
import {
  createPostSchema,
  updatePostSchema,
  deletePostSchema,
  updatePostStatusSchema,
  addCategoriesToPostSchema,
  removeCategoriesFromPostSchema,
} from '@/lib/validations/post';
import { z } from 'zod';

export const postsRouter = router({
  // Get all posts
  getAll: publicProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'published']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { status, limit = 50, offset = 0 } = input || {};

      const whereConditions = status
        ? eq(postsTable.status, status)
        : undefined;

      const allPosts = await ctx.db
        .select()
        .from(postsTable)
        .where(whereConditions)
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return allPosts;
    }),

  // Get single post by ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, input),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const post = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.slug, input),
        with: {
          postCategories: {
            with: {
              category: true,
            },
          },
        },
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      return post;
    }),

  // Get published posts only
  getPublished: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { limit = 50, offset = 0 } = input || {};

      const publishedPosts = await ctx.db
        .select()
        .from(postsTable)
        .where(eq(postsTable.status, 'published'))
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return publishedPosts;
    }),

  // Get posts by author
  getByAuthor: publicProcedure
    .input(
      z.object({
        author: z.string(),
        status: z.enum(['draft', 'published']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { author, status, limit, offset } = input;

      const whereConditions = status
        ? and(
            eq(postsTable.author, author),
            eq(postsTable.status, status)
          )
        : eq(postsTable.author, author);

      const authorPosts = await ctx.db
        .select()
        .from(postsTable)
        .where(whereConditions)
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return authorPosts;
    }),

  // Create new post (with auto-generated slug)
  create: publicProcedure
    .input(createPostSchema)
    .mutation(async ({ ctx, input }) => {
      // Generate slug from title
      let slug = slugify(input.title);
      let slugSuffix = 0;

      // Check if slug already exists and make it unique if needed
      let existingPost = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.slug, slug),
      });

      while (existingPost) {
        slugSuffix++;
        slug = `${slugify(input.title)}-${slugSuffix}`;
        existingPost = await ctx.db.query.postsTable.findFirst({
          where: eq(postsTable.slug, slug),
        });
      }

      // Insert into database
      const [newPost] = await ctx.db
        .insert(postsTable)
        .values({
          title: input.title,
          slug: slug,
          status: input.status || 'draft',
          content: input.content,
          author: input.author,
        })
        .returning();

      return newPost;
    }),

  // Update post
  update: publicProcedure
    .input(updatePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const existingPost = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Generate new slug from updated title
      let newSlug = slugify(input.title);

      // Check if new slug conflicts with another post
      if (newSlug !== existingPost.slug) {
        let slugSuffix = 0;
        let slugConflict = await ctx.db.query.postsTable.findFirst({
          where: eq(postsTable.slug, newSlug),
        });

        while (slugConflict && slugConflict.id !== input.id) {
          slugSuffix++;
          newSlug = `${slugify(input.title)}-${slugSuffix}`;
          slugConflict = await ctx.db.query.postsTable.findFirst({
            where: eq(postsTable.slug, newSlug),
          });
        }
      }

      // Update post
      const [updatedPost] = await ctx.db
        .update(postsTable)
        .set({
          title: input.title,
          slug: newSlug,
          status: input.status,
          content: input.content,
          author: input.author,
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, input.id))
        .returning();

      return updatedPost;
    }),

  // Update post status only (draft/published)
  updateStatus: publicProcedure
    .input(updatePostStatusSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const existingPost = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Update status
      const [updatedPost] = await ctx.db
        .update(postsTable)
        .set({
          status: input.status,
          updatedAt: new Date(),
        })
        .where(eq(postsTable.id, input.id))
        .returning();

      return updatedPost;
    }),

  // Delete post
  delete: publicProcedure
    .input(deletePostSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if post exists
      const existingPost = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, input.id),
      });

      if (!existingPost) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Delete post
      await ctx.db
        .delete(postsTable)
        .where(eq(postsTable.id, input.id));

      return { success: true, id: input.id };
    }),

  // Get post count
  getCount: publicProcedure
    .input(
      z.object({
        status: z.enum(['draft', 'published']).optional(),
        author: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { status, author } = input || {};

      let whereConditions;
      
      if (status && author) {
        whereConditions = and(
          eq(postsTable.status, status),
          eq(postsTable.author, author)
        );
      } else if (status) {
        whereConditions = eq(postsTable.status, status);
      } else if (author) {
        whereConditions = eq(postsTable.author, author);
      }

      const result = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(postsTable)
        .where(whereConditions);

      return { count: Number(result[0].count) };
    }),

  // Get posts by category
  getByCategory: publicProcedure
    .input(
      z.object({
        categoryId: z.number(),
        status: z.enum(['draft', 'published']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categoryId, status, limit, offset } = input;

      // Get post IDs for this category
      const postCategoryLinks = await ctx.db
        .select({ postId: postCategories.postId })
        .from(postCategories)
        .where(eq(postCategories.categoryId, categoryId));

      if (postCategoryLinks.length === 0) {
        return [];
      }

      const postIds = postCategoryLinks.map(link => link.postId);

      const whereConditions = status
        ? and(
            inArray(postsTable.id, postIds),
            eq(postsTable.status, status)
          )
        : inArray(postsTable.id, postIds);

      const posts = await ctx.db
        .select()
        .from(postsTable)
        .where(whereConditions)
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return posts;
    }),

  // Get posts by category slug
  getByCategorySlug: publicProcedure
    .input(
      z.object({
        categorySlug: z.string(),
        status: z.enum(['draft', 'published']).optional(),
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const { categorySlug, status, limit, offset } = input;

      // Find category by slug
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, categorySlug),
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Get post IDs for this category
      const postCategoryLinks = await ctx.db
        .select({ postId: postCategories.postId })
        .from(postCategories)
        .where(eq(postCategories.categoryId, category.id));

      if (postCategoryLinks.length === 0) {
        return [];
      }

      const postIds = postCategoryLinks.map(link => link.postId);

      const whereConditions = status
        ? and(
            inArray(postsTable.id, postIds),
            eq(postsTable.status, status)
          )
        : inArray(postsTable.id, postIds);

      const posts = await ctx.db
        .select()
        .from(postsTable)
        .where(whereConditions)
        .orderBy(desc(postsTable.createdAt))
        .limit(limit)
        .offset(offset);

      return posts;
    }),

  // Add categories to post
  addCategories: publicProcedure
    .input(addCategoriesToPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId, categoryIds } = input;

      // Check if post exists
      const post = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Verify all categories exist
      const existingCategories = await ctx.db
        .select({ id: categories.id })
        .from(categories)
        .where(inArray(categories.id, categoryIds));

      if (existingCategories.length !== categoryIds.length) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'One or more categories not found',
        });
      }

      // Get existing post-category relationships
      const existing = await ctx.db
        .select({ categoryId: postCategories.categoryId })
        .from(postCategories)
        .where(eq(postCategories.postId, postId));

      const existingCategoryIds = existing.map(e => e.categoryId);

      // Filter out already existing relationships
      const newCategoryIds = categoryIds.filter(
        id => !existingCategoryIds.includes(id)
      );

      if (newCategoryIds.length === 0) {
        return { success: true, message: 'Categories already assigned' };
      }

      // Insert new relationships
      await ctx.db.insert(postCategories).values(
        newCategoryIds.map(categoryId => ({
          postId,
          categoryId,
        }))
      );

      return { success: true, added: newCategoryIds.length };
    }),

  // Remove categories from post
  removeCategories: publicProcedure
    .input(removeCategoriesFromPostSchema)
    .mutation(async ({ ctx, input }) => {
      const { postId, categoryIds } = input;

      // Check if post exists
      const post = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Delete relationships
      await ctx.db
        .delete(postCategories)
        .where(
          and(
            eq(postCategories.postId, postId),
            inArray(postCategories.categoryId, categoryIds)
          )
        );

      return { success: true, removed: categoryIds.length };
    }),

  // Set categories for post (replaces all existing)
  setCategories: publicProcedure
    .input(
      z.object({
        postId: z.number(),
        categoryIds: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { postId, categoryIds } = input;

      // Check if post exists
      const post = await ctx.db.query.postsTable.findFirst({
        where: eq(postsTable.id, postId),
      });

      if (!post) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Post not found',
        });
      }

      // Verify all categories exist if any provided
      if (categoryIds.length > 0) {
        const existingCategories = await ctx.db
          .select({ id: categories.id })
          .from(categories)
          .where(inArray(categories.id, categoryIds));

        if (existingCategories.length !== categoryIds.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'One or more categories not found',
          });
        }
      }

      // Delete all existing relationships
      await ctx.db
        .delete(postCategories)
        .where(eq(postCategories.postId, postId));

      // Insert new relationships if any
      if (categoryIds.length > 0) {
        await ctx.db.insert(postCategories).values(
          categoryIds.map(categoryId => ({
            postId,
            categoryId,
          }))
        );
      }

      return { success: true, count: categoryIds.length };
    }),
});
