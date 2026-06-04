import { z } from 'zod';

/**
 * Schema for updating a brand
 * All fields are optional for update
 */
export const updateBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required').optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
});