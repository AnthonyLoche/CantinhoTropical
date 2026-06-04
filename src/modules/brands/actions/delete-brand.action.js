'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { BrandService } from '../services/brand.service.js';
import { Prisma } from '@prisma/client';

/**
 * Server action to delete a brand
 * @param {Object|string} params - Parameters object with id or just the id string
 * @param {string} params.id - Brand ID (if object)
 * @returns {Promise<Object>} Result object with success/error
 */
export async function deleteBrandAction(params) {
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
        error: 'ID da marca é obrigatório',
      };
    }

    if (!id) {
      return {
        success: false,
        error: 'ID da marca é obrigatório',
      };
    }

    console.log('🗑️ Deleting brand with ID:', id);

    const brandService = new BrandService();
    await brandService.deleteBrand(id);

    console.log('✅ Brand deleted successfully:', id);

    return {
      success: true,
      message: 'Marca excluída com sucesso!',
    };
  } catch (error) {
    console.error('❌ Error deleting brand:', error);
    
    // 🔥 Tratar erro de chave estrangeira (marca tem produtos e não tem Cascade)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Não é possível excluir esta marca pois existem produtos vinculados a ela. Remova ou reassocie os produtos primeiro.',
        };
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to delete brand',
    };
  }
}