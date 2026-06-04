'use server';

import { prisma } from '@/lib/prisma';

/**
 * Get products with optional search - Public access
 * @param {Object} params - Search parameters
 * @param {string} params.search - Search term
 * @param {string} params.categoryId - Filter by category
 * @param {string} params.brandId - Filter by brand
 * @param {boolean} params.activeOnly - Only show active products (default: true)
 * @returns {Promise<Object>} Result with success/error and products array
 */
export async function getProductsAction({ search = '', categoryId = null, brandId = null, activeOnly = true } = {}) {
  try {
    // Build where clause
    const where = {
      ...(activeOnly && { active: true }),
    };
    
    // Search by name or description
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    
    // Filter by category
    if (categoryId) {
      where.categoryId = categoryId;
    }
    
    // Filter by brand
    if (brandId) {
      where.brandId = brandId;
    }

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