import { z } from 'zod';

/**
 * Schema for creating a category
 */
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  description: z.string().optional(),
});