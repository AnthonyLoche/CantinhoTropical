'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { CategoryService } from '../services/category.service.js';

/**
 * Server action to delete a category
 * @param {Object|string} params - Parameters object with id or just the id string
 * @param {string} params.id - Category ID (if object)
 * @returns {Promise<Object>} Result object with success/error
 */
export async function deleteCategoryAction(params) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    // Extrair o ID corretamente (suporta tanto string quanto objeto)
    let id;
    if (typeof params === 'string') {
      id = params;
    } else if (params && typeof params === 'object') {
      id = params.id;
    } else {
      return {
        success: false,
        error: 'ID da categoria é obrigatório',
      };
    }

    if (!id) {
      return {
        success: false,
        error: 'ID da categoria é obrigatório',
      };
    }

    console.log('🗑️ Deleting category with ID:', id);

    const categoryService = new CategoryService();
    await categoryService.deleteCategory(id);

    console.log('✅ Category deleted successfully:', id);

    return {
      success: true,
      message: 'Category deleted successfully',
    };
  } catch (error) {
    console.error('❌ Error deleting category:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete category',
    };
  }
}