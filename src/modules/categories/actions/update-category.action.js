'use server';

import { CategoryService } from '../services/category.service.js';

/**
 * Server action to update a category
 * @param {string} id - Category ID
 * @param {Object} formData - Form data containing category information to update
 * @param {string} formData.name - Category name
 * @param {string} formData.imageUrl - Category image URL
 * @param {string} formData.description - Category description (optional)
 * @returns {Promise<Object>} Result object with success/error
 */
export async function updateCategoryAction(id, formData) {
  try {
    const categoryService = new CategoryService();
    const category = await categoryService.updateCategory(id, formData);

    return {
      success: true,
      data: category,
      message: 'Category updated successfully',
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: error.message || 'Failed to update category',
    };
  }
}