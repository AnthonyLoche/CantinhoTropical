import { z } from 'zod';

/**
 * Schema for creating a brand
 */
export const createBrandSchema = z.object({
  name: z.string().min(1, 'Brand name is required'),
  imageUrl: z.string().min(1, 'Image URL is required'),
});