import { router, publicProcedure } from '../init';
import { categories, postCategories } from '@/lib/db/schema';
import { eq, desc, sql } from 'drizzle-orm';
import { slugify } from '@/lib/utils/slugify';
import { TRPCError } from '@trpc/server';
import {
  createCategorySchema,
  updateCategorySchema,
  deleteCategorySchema,
} from '@/lib/validations/category';
import { z } from 'zod';

export const categoriesRouter = router({
  // Get all categories
  getAll: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db
      .select()
      .from(categories)
      .orderBy(desc(categories.createdAt));
    
    return allCategories;
  }),

  // Get all categories with post counts
  getAllWithCounts: publicProcedure.query(async ({ ctx }) => {
    const allCategories = await ctx.db
      .select({
        id: categories.id,
        name: categories.name,
        slug: categories.slug,
        description: categories.description,
        createdAt: categories.createdAt,
        updatedAt: categories.updatedAt,
        postCount: sql<number>`count(${postCategories.postId})`,
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .groupBy(categories.id)
      .orderBy(desc(categories.createdAt));
    
    return allCategories;
  }),

  // Get single category by ID
  getById: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input),
        with: {
          postCategories: {
            with: {
              post: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),

  // Get single category by slug
  getBySlug: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const category = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, input),
        with: {
          postCategories: {
            with: {
              post: true,
            },
          },
        },
      });

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      return category;
    }),

  // Create new category (with auto-generated slug)
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Generate slug from name
      const slug = slugify(input.name);

      // Check if slug already exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.slug, slug),
      });

      if (existingCategory) {
        throw new TRPCError({
          code: 'CONFLICT',
          message: 'A category with this name already exists',
        });
      }

      // Insert into database
      const [newCategory] = await ctx.db
        .insert(categories)
        .values({
          name: input.name,
          slug: slug,
          description: input.description || null,
        })
        .returning();

      return newCategory;
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Generate new slug from updated name
      const newSlug = slugify(input.name);

      // Check if new slug conflicts with another category
      if (newSlug !== existingCategory.slug) {
        const slugConflict = await ctx.db.query.categories.findFirst({
          where: eq(categories.slug, newSlug),
        });

        if (slugConflict && slugConflict.id !== input.id) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A category with this name already exists',
          });
        }
      }

      // Update category
      const [updatedCategory] = await ctx.db
        .update(categories)
        .set({
          name: input.name,
          slug: newSlug,
          description: input.description || null,
          updatedAt: new Date(),
        })
        .where(eq(categories.id, input.id))
        .returning();

      return updatedCategory;
    }),

  // Delete category
  delete: publicProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ ctx, input }) => {
      // Check if category exists
      const existingCategory = await ctx.db.query.categories.findFirst({
        where: eq(categories.id, input.id),
      });

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        });
      }

      // Check if category is used in posts
      const postCount = await ctx.db
        .select({ count: sql<number>`count(*)` })
        .from(postCategories)
        .where(eq(postCategories.categoryId, input.id));

      const count = Number(postCount[0].count);

      if (count > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: `Cannot delete category. It is assigned to ${count} post(s). Remove the category from all posts first.`,
        });
      }

      // Delete category (relationships are already cascade deleted in schema)
      await ctx.db
        .delete(categories)
        .where(eq(categories.id, input.id));

      return { success: true, id: input.id };
    }),
});
