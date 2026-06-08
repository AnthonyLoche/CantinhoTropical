import { z } from 'zod';

/**
 * Schema for product variants (update)
 */
export const updateVariantSchema = z.object({
  id: z.string().optional(),
  label: z.string().min(1, 'Label is required').optional(),
  quantity: z.number().int().min(0, 'Quantity must be greater than or equal to zero').optional(),
  price: z.number().positive('Price must be greater than zero').optional(),
});

/**
 * Schema for updating a product
 * All fields are optional for update
 */
export const updateProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').optional(),
  description: z.string().optional(),
  price: z.number().positive('Price must be greater than zero').optional(),
  stockQuantity: z.number().int().min(0, 'Stock quantity must be greater than or equal to zero').optional(),
  imageUrl: z.string().min(1, 'Image URL is required').optional(),
  active: z.boolean().optional(),
  featured: z.boolean().optional(),
  
  // New fields
  hint: z.string().optional(),
  howUse: z.string().optional(),
  ingredients: z.string().optional(),
  
  brandId: z.string().min(1, 'Brand is required').optional(),
  categoryId: z.string().min(1, 'Category is required').optional(),
  
  // Variants (optional)
  variants: z.array(updateVariantSchema).optional(),
});