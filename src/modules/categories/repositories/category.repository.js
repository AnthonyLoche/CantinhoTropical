import { prisma } from '@/lib/prisma';

/**
 * Category Repository
 * Responsible for database operations on Category model
 */
export class CategoryRepository {
  /**
   * Find a category by its ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Category object or null
   */
  async findById(id) {
    return await prisma.category.findUnique({
      where: { id },
    });
  }

  /**
   * Find all categories with optional filtering and pagination
   * @param {Object} options - Filter and pagination options
   * @param {string} options.search - Search term for name
   * @param {number} options.skip - Number of records to skip
   * @param {number} options.take - Number of records to take
   * @param {string} options.orderBy - Order by field (e.g., 'name')
   * @param {string} options.orderDirection - Order direction ('asc' or 'desc')
   * @returns {Promise<Array>} Array of category objects
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

    return await prisma.category.findMany({
      where,
      skip,
      take,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });
  }

  /**
   * Create a new category
   * @param {Object} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.imageUrl - Category image URL
   * @param {string} data.description - Category description (optional)
   * @returns {Promise<Object>} Created category object
   */
  async create(data) {
    return await prisma.category.create({
      data,
    });
  }

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} data - Data to update
   * @param {string} data.name - Category name
   * @param {string} data.imageUrl - Category image URL
   * @param {string} data.description - Category description (optional)
   * @returns {Promise<Object>} Updated category object
   */
  async update(id, data) {
    return await prisma.category.update({
      where: { id },
      data,
    });
  }

  /**
   * Delete a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deleted category object
   */
  async delete(id) {
    return await prisma.category.delete({
      where: { id },
    });
  }
}