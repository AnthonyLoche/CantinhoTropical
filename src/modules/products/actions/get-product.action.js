'use server';

import { ProductService } from '../services/product.service.js';

/**
 * Server action to get a product by ID
 * @param {string|Object} params - Product ID string or object with id property
 * @param {boolean} includeVariants - Include product variants (default: true)
 * @returns {Promise<Object>} Result object with success/error
 */
export async function getProductAction(params, includeVariants = true) {
  try {
    // Extrair o ID (suporta string ou objeto)
    let id;
    if (typeof params === 'string') {
      id = params;
    } else if (params && typeof params === 'object') {
      id = params.id;
    } else {
      return {
        success: false,
        error: 'ID do produto é obrigatório',
      };
    }

    if (!id) {
      return {
        success: false,
        error: 'ID do produto é obrigatório',
      };
    }

    const productService = new ProductService();
    const product = await productService.getProductById(id, includeVariants);

    if (!product) {
      return {
        success: false,
        error: 'Produto não encontrado',
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
      error: error.message || 'Erro ao buscar produto',
    };
  }
}