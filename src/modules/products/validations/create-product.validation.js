import { z } from 'zod';

/**
 * Schema for product variants
 */
export const variantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Label is required (e.g., 1kg, P, Blue)'),
  quantity: z.number().int().min(0, 'Quantity must be greater than or equal to zero').default(0),
  price: z.number().positive('Price must be greater than zero'),
});

/**
 * Schema for creating a product
 */
export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required'),
  description: z.string().optional().default(''),
  price: z.number().positive('Price must be greater than zero'),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be greater than or equal to zero').default(0),
  imageUrl: z.string().min(1, 'Image URL is required'),
  active: z.boolean().default(true),
  featured: z.boolean().default(false),
  
  // New fields
  hint: z.string().optional().default(''),
  howUse: z.string().optional().default(''),
  ingredients: z.string().optional().default(''),
  
  brandId: z.string().min(1, 'Brand is required'),
  categoryId: z.string().min(1, 'Category is required'),
  
  // Variants (optional)
  variants: z.array(variantSchema).optional().default([]),
});