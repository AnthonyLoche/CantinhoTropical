// DTO for Brand
export class BrandDTO {
  /**
   * Format brand data for output
   * @param {Object} brand - Brand object from Prisma
   * @returns {Object} Formatted brand
   */
  static format(brand) {
    if (!brand) return null;

    return {
      id: brand.id,
      name: brand.name,
      imageUrl: brand.imageUrl,
      createdAt: brand.createdAt,
      updatedAt: brand.updatedAt,
    };
  }

  /**
   * Format array of brands
   * @param {Array} brands - Array of brand objects
   * @returns {Array} Formatted brands
   */
  static formatMany(brands) {
    return brands.map(this.format);
  }
}