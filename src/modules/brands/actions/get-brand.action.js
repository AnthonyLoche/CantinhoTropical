'use server';

import { BrandService } from '../services/brand.service.js';

/**
 * Server action to get a brand by ID
 * @param {string} id - Brand ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function getBrandAction(id) {
  try {
    const brandService = new BrandService();
    const brand = await brandService.getBrandById(id);

    if (!brand) {
      return {
        success: false,
        error: 'Brand not found',
      };
    }

    return {
      success: true,
      data: brand,
    };
  } catch (error) {
    console.error('Error getting brand:', error);
    return {
      success: false,
      error: error.message || 'Failed to get brand',
    };
  }
}