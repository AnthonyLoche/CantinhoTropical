import { prisma } from '@/lib/prisma';

/**
 * TextContent Repository
 * Database operations for TextContent model
 */
export class TextContentRepository {
  /**
   * Find text content (single record - singleton)
   * @returns {Promise<Object|null>}
   */
  async findFirst() {
    return await prisma.textContent.findFirst();
  }

  /**
   * Create new text content
   * @param {Object} data - Text content data
   * @returns {Promise<Object>}
   */
  async create(data) {
    return await prisma.textContent.create({
      data,
    });
  }

  /**
   * Update text content by ID
   * @param {string} id - Content ID
   * @param {Object} data - Update data
   * @returns {Promise<Object>}
   */
  async update(id, data) {
    return await prisma.textContent.update({
      where: { id },
      data,
    });
  }

  /**
   * Upsert text content (update or create)
   * @param {Object} data - Text content data
   * @returns {Promise<Object>}
   */
  async upsert(data) {
    const existing = await this.findFirst();
    
    if (existing) {
      return await this.update(existing.id, data);
    }
    
    return await this.create(data);
  }
}