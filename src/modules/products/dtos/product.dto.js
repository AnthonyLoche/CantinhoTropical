// DTO for Product
export class ProductDTO {
  /**
   * Format product data for output
   * @param {Object} product - Product object from Prisma (with brand and category included)
   * @returns {Object} Formatted product
   */
  static format(product) {
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      stockQuantity: product.stockQuantity,
      imageUrl: product.imageUrl,
      active: product.active,
      featured: product.featured,
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
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  /**
   * Format array of products
   * @param {Array} products - Array of product objects
   * @returns {Array} Formatted products
   */
  static formatMany(products) {
    return products.map(this.format);
  }
}