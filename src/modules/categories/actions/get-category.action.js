'use server';

import { CategoryService } from '../services/category.service.js';

/**
 * Server action to get a category by ID
 * @param {string} id - Category ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function getCategoryAction(id) {
  try {
    const categoryService = new CategoryService();
    const category = await categoryService.getCategoryById(id);

    if (!category) {
      return {
        success: false,
        error: 'Category not found',
      };
    }

    return {
      success: true,
      data: category,
    };
  } catch (error) {
    console.error('Error getting category:', error);
    return {
      success: false,
      error: error.message || 'Failed to get category',
    };
  }
}