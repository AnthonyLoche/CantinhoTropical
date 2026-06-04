'use server';

import { BrandService } from '../services/brand.service.js';

/**
 * Server action to update a brand
 * @param {string} id - Brand ID
 * @param {Object} formData - Form data containing brand information to update
 * @param {string} formData.name - Brand name
 * @param {string} formData.imageUrl - Brand image URL
 * @returns {Promise<Object>} Result object with success/error
 */
export async function updateBrandAction(id, formData) {
  try {
    const brandService = new BrandService();
    const brand = await brandService.updateBrand(id, formData);

    return {
      success: true,
      data: brand,
      message: 'Brand updated successfully',
    };
  } catch (error) {
    console.error('Error updating brand:', error);
    return {
      success: false,
      error: error.message || 'Failed to update brand',
    };
  }
}