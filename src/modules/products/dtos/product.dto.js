/**
 * Product DTO
 * Formats product data for API responses
 */
export class ProductDTO {
  /**
   * Format a single product
   * @param {Object} product - Product from Prisma
   * @returns {Object} Formatted product
   */
  static format(product) {
    if (!product) return null;

    return {
      id: product.id,
      name: product.name,
      description: product.description || "",
      price: product.price ? Number(product.price) : 0,
      stockQuantity: product.stockQuantity || 0,
      imageUrl: product.imageUrl,
      active: product.active,
      featured: product.featured,
      hint: product.hint || "",
      howUse: product.how_use || "",
      ingredients: product.ingredients || "",
      brandId: product.brandId, // ← Verifique se está aqui
      categoryId: product.categoryId, // ← Verifique se está aqui
      brand: product.brand
        ? {
            id: product.brand.id,
            name: product.brand.name,
            imageUrl: product.brand.imageUrl,
          }
        : null,
      category: product.category
        ? {
            id: product.category.id,
            name: product.category.name,
            description: product.category.description,
            imageUrl: product.category.imageUrl,
          }
        : null,
      variants: product.variants
        ? product.variants.map((v) => ({
            id: v.id,
            label: v.label,
            quantity: v.quantity,
            price: Number(v.price),
          }))
        : [],
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  }

  /**
   * Format multiple products
   * @param {Array} products - Array of products
   * @returns {Array} Formatted products
   */
  static formatMany(products) {
    return products.map((p) => this.format(p));
  }

  /**
   * Format a single variant
   * @param {Object} variant - Variant from Prisma
   * @returns {Object} Formatted variant
   */
  static formatVariant(variant) {
    if (!variant) return null;

    return {
      id: variant.id,
      label: variant.label,
      quantity: variant.quantity,
      price: Number(variant.price),
      productId: variant.productId,
    };
  }

  /**
   * Format multiple variants
   * @param {Array} variants - Array of variants
   * @returns {Array} Formatted variants
   */
  static formatVariants(variants) {
    return variants.map((v) => this.formatVariant(v));
  }
}
