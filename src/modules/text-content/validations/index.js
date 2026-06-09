import { z } from 'zod';

/**
 * Schema for creating text content
 */
export const createTextContentSchema = z.object({
  heroBadge: z.string().optional().default(""),
  heroTitle: z.string().optional().default(""),
  heroDescription: z.string().optional().default(""),
  categoriesTitle: z.string().optional().default(""),
  categoriesDescription: z.string().optional().default(""),
  aboutTitle: z.string().optional().default(""),
  aboutDescription: z.string().optional().default(""),
  petHotelChip: z.string().optional().default(""),
  petHotelTitle: z.string().optional().default(""),
  petHotelDescription: z.string().optional().default(""),
  contactTitle: z.string().optional().default(""),
  contactDescription: z.string().optional().default(""),
});

/**
 * Schema for updating text content
 * All fields are optional
 */
export const updateTextContentSchema = z.object({
  heroBadge: z.string().optional(),
  heroTitle: z.string().optional(),
  heroDescription: z.string().optional(),
  categoriesTitle: z.string().optional(),
  categoriesDescription: z.string().optional(),
  aboutTitle: z.string().optional(),
  aboutDescription: z.string().optional(),
  petHotelChip: z.string().optional(),
  petHotelTitle: z.string().optional(),
  petHotelDescription: z.string().optional(),
  contactTitle: z.string().optional(),
  contactDescription: z.string().optional(),
});