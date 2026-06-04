'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { ProductService } from '../services/product.service.js';
import { Prisma } from '@prisma/client';

/**
 * Server action to update a product
 * @param {Object} data - Product data object
 * @param {string} data.id - Product ID
 * @param {string} data.name - Product name
 * @param {string} data.description - Product description (optional)
 * @param {number} data.price - Product price
 * @param {number} data.stockQuantity - Product stock quantity
 * @param {string} data.image - Product image URL
 * @param {boolean} data.active - Product active status
 * @param {boolean} data.featured - Product featured status
 * @param {string} data.brandId - Brand ID
 * @param {string} data.categoryId - Category ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function updateProductAction(data) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    console.log('📝 Updating product with data:', JSON.stringify(data, null, 2));

    // Extrair o ID
    const id = data.id;
    if (!id) {
      return {
        success: false,
        error: 'ID do produto é obrigatório',
      };
    }

    // Validar campos obrigatórios
    if (!data.name || data.name.trim() === '') {
      return {
        success: false,
        error: 'Nome do produto é obrigatório',
      };
    }

    if (!data.price) {
      return {
        success: false,
        error: 'Preço do produto é obrigatório',
      };
    }

    // Preparar os dados para o serviço
    const productData = {
      name: data.name.trim(),
      description: data.description || '',
      price: parseFloat(data.price),
      stockQuantity: parseInt(data.stockQuantity) || parseInt(data.stock) || 0,
      imageUrl: data.image || data.imageUrl,
      active: data.active === true || data.active === 'true',
      featured: data.featured === true || data.featured === 'true',
      brandId: data.brandId,
      categoryId: data.categoryId,
    };

    console.log('📤 Sending to ProductService:', productData);

    const productService = new ProductService();
    const product = await productService.updateProduct(id, productData);

    console.log('✅ Product updated successfully:', product.id);

    return {
      success: true,
      data: product,
      message: 'Produto atualizado com sucesso!',
    };
  } catch (error) {
    console.error('❌ Error updating product:', error);
    
    // 🔥 Tratar erro de chave estrangeira
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2003') {
        return {
          success: false,
          error: 'Marca ou categoria inválida. Verifique os dados e tente novamente.',
        };
      }
      if (error.code === 'P2025') {
        return {
          success: false,
          error: 'Produto não encontrado.',
        };
      }
    }
    
    return {
      success: false,
      error: error.message || 'Failed to update product',
    };
  }
}