import { prisma } from '@/lib/prisma';

/**
 * Brand Repository
 * Responsible for database operations on Brand model
 */
export class BrandRepository {
  /**
   * Find a brand by its ID
   * @param {string} id - Brand ID
   * @returns {Promise<Object|null>} Brand object or null
   */
  async findById(id) {
    return await prisma.brand.findUnique({
      where: { id },
    });
  }

  /**
   * Find all brands with optional filtering and pagination
   * @param {Object} options - Filter and pagination options
   * @param {string} options.search - Search term for name
   * @param {number} options.skip - Number of records to skip
   * @param {number} options.take - Number of records to take
   * @param {string} options.orderBy - Order by field (e.g., 'name')
   * @param {string} options.orderDirection - Order direction ('asc' or 'desc')
   * @returns {Promise<Array>} Array of brand objects
   */
  async findAll(options = {}) {
    const { search, skip = 0, take = 10, orderBy = 'name', orderDirection = 'asc' } = options;

    const where = {};
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive',
      };
    }

    return await prisma.brand.findMany({
      where,
      skip,
      take,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });
  }

  /**
   * Create a new brand
   * @param {Object} data - Brand data
   * @param {string} data.name - Brand name
   * @param {string} data.imageUrl - Brand image URL
   * @returns {Promise<Object>} Created brand object
   */
  async create(data) {
    return await prisma.brand.create({
      data,
    });
  }

  /**
   * Update an existing brand
   * @param {string} id - Brand ID
   * @param {Object} data - Data to update
   * @param {string} data.name - Brand name
   * @param {string} data.imageUrl - Brand image URL
   * @returns {Promise<Object>} Updated brand object
   */
  async update(id, data) {
    return await prisma.brand.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a brand by ID
   * @param {string} id - Brand ID
   * @returns {Promise<Object>} Deleted brand object
   */
  async delete(id) {
    return await prisma.brand.delete({
      where: { id },
    });
  }
}