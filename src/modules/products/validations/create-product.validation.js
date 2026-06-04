import { z } from 'zod';

/**
 * Schema for creating a product
 */
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero'),
  stockQuantity: z.number().int().nonnegative('Stock quantity must be greater than or equal to zero'),
  imageUrl: z.string().min(1, 'Image URL is required'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
});