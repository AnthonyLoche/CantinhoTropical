'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { ProductService } from '../services/product.service.js';

/**
 * Server action to delete a product
 * @param {Object} params - Parameters
 * @param {string} params.id - Product ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function deleteProductAction(params) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    // Extrair o ID corretamente
    const id = typeof params === 'string' ? params : params?.id;
    
    if (!id) {
      return {
        success: false,
        error: 'ID do produto é obrigatório',
      };
    }

    console.log('🗑️ Deleting product with ID:', id);

    const productService = new ProductService();
    const deletedProduct = await productService.deleteProduct(id);

    console.log('✅ Product deleted successfully:', id);

    return {
      success: true,
      data: deletedProduct,
      message: 'Product deleted successfully',
    };
  } catch (error) {
    console.error('❌ Error deleting product:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete product',
    };
  }
}