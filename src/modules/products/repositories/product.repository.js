import { prisma } from '@/lib/prisma'; // Adjust the path according to your Prisma client location

/**
 * Product Repository
 * Responsible for database operations on Product model
 */
export class ProductRepository {
  /**
   * Find a product by its ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Product object or null
   */
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
      },
    });
  }

  /**
   * Find all products with optional filtering and pagination
   * @param {Object} options - Filter and pagination options
   * @param {string} options.search - Search term for name
   * @param {string} options.brandId - Filter by brand ID
   * @param {string} options.categoryId - Filter by category ID
   * @param {boolean} options.active - Filter by active status
   * @param {boolean} options.featured - Filter by featured status
   * @param {number} options.skip - Number of records to skip
   * @param {number} options.take - Number of records to take
   * @param {string} options.orderBy - Order by field (e.g., 'name', 'price')
   * @param {string} options.orderDirection - Order direction ('asc' or 'desc')
   * @returns {Promise<Array>} Array of product objects
   */
  async findAll(options = {}) {
    const {
      search,
      brandId,
      categoryId,
      active,
      featured,
      skip = 0,
      take = 10,
      orderBy = 'name',
      orderDirection = 'asc'
    } = options;

    const where = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }
    if (brandId) {
      where.brandId = brandId;
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (active !== undefined) {
      where.active = active;
    }
    if (featured !== undefined) {
      where.featured = featured;
    }

    return await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
      },
      skip,
      take,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });
  }

  /**
   * Create a new product
   * @param {Object} data - Product data
   * @param {string} data.name - Product name
   * @param {string} data.description - Product description (optional)
   * @param {number} data.price - Product price
   * @param {number} data.stockQuantity - Product stock quantity
   * @param {string} data.imageUrl - Product image URL
   * @param {boolean} data.active - Product active status
   * @param {boolean} data.featured - Product featured status
   * @param {string} data.brandId - Brand ID
   * @param {string} data.categoryId - Category ID
   * @returns {Promise<Object>} Created product object
   */
  async create(data) {
    return await prisma.product.create({
      data,
      include: {
        brand: true,
        category: true,
      },
    });
  }

  /**
   * Update an existing product
   * @param {string} id - Product ID
   * @param {Object} data - Data to update
   * @param {string} data.name - Product name
   * @param {string} data.description - Product description (optional)
   * @param {number} data.price - Product price
   * @param {number} data.stockQuantity - Product stock quantity
   * @param {string} data.imageUrl - Product image URL
   * @param {boolean} data.active - Product active status
   * @param {boolean} data.featured - Product featured status
   * @param {string} data.brandId - Brand ID
   * @param {string} data.categoryId - Category ID
   * @returns {Promise<Object>} Updated product object
   */
  async update(id, data) {
    return await prisma.product.update({
      where: { id },
      data,
      include: {
        brand: true,
        category: true,
      },
    });
  }

  /**
   * Delete a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Deleted product object
   */
  async delete(id) {
    return await prisma.product.delete({
      where: { id },
    });
  }
}