'use server';

import { ProductService } from '../services/product.service.js';

/**
 * Server action to get a product by ID
 * @param {string} id - Product ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function getProductAction(id) {
  try {
    const productService = new ProductService();
    const product = await productService.getProductById(id);

    if (!product) {
      return {
        success: false,
        error: 'Product not found',
      };
    }

    return {
      success: true,
      data: product,
    };
  } catch (error) {
    console.error('Error getting product:', error);
    return {
      success: false,
      error: error.message || 'Failed to get product',
    };
  }
}