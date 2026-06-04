// DTO for Category
export class CategoryDTO {
  /**
   * Format category data for output
   * @param {Object} category - Category object from Prisma
   * @returns {Object} Formatted category
   */
  static format(category) {
    if (!category) return null;

    return {
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
    };
  }

  /**
   * Format array of categories
   * @param {Array} categories - Array of category objects
   * @returns {Array} Formatted categories
   */
  static formatMany(categories) {
    return categories.map(this.format);
  }
}