'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';

/**
 * Get products with optional search
 * @param {Object} params - Search parameters
 * @param {string} params.search - Search term
 * @returns {Promise<Object>} Result with success/error and products array
 */
export async function getProductsAction({ search = '' } = {}) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
        data: [],
      };
    }

    // Build where clause for search
    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { id: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    // Fetch products with relations
    const products = await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // 🔥 Converter Decimal para number e extrair IDs dos relacionamentos
    const serializedProducts = products.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: Number(product.price), // Converter Decimal para number
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      active: product.active,
      featured: product.featured,
      brandId: product.brandId,
      categoryId: product.categoryId,
      // Manter os objetos relacionados se necessário
      brand: product.brand ? {
        id: product.brand.id,
        name: product.brand.name,
        imageUrl: product.brand.imageUrl,
      } : null,
      category: product.category ? {
        id: product.category.id,
        name: product.category.name,
        description: product.category.description,
        imageUrl: product.category.imageUrl,
      } : null,
      createdAt: product.createdAt?.toISOString(),
      updatedAt: product.updatedAt?.toISOString(),
    }));

    return {
      success: true,
      data: serializedProducts,
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch products',
      data: [],
    };
  }
}