'use server';

import { ProductService } from '../services/product.service.js';

/**
 * Server action to update a product
 * @param {string} id - Product ID
 * @param {Object} formData - Form data containing product information to update
 * @param {string} formData.name - Product name
 * @param {string} formData.description - Product description (optional)
 * @param {number} formData.price - Product price
 * @param {number} formData.stockQuantity - Product stock quantity
 * @param {string} formData.imageUrl - Product image URL
 * @param {boolean} formData.active - Product active status
 * @param {boolean} formData.featured - Product featured status
 * @param {string} formData.brandId - Brand ID
 * @param {string} formData.categoryId - Category ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function updateProductAction(id, formData) {
  try {
    const productService = new ProductService();
    const product = await productService.updateProduct(id, formData);

    return {
      success: true,
      data: product,
      message: 'Product updated successfully',
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.message || 'Failed to update product',
    };
  }
}