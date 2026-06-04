import { z } from 'zod';

/**
 * Schema for updating a category
 * All fields are optional for update
 */
export const updateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
  description: z.string().optional(),
});