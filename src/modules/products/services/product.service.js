import { ProductRepository } from '../repositories/product.repository.js';
import { ProductDTO } from '../dtos/product.dto.js';
import { z } from 'zod';
import { createProductSchema, updateProductSchema } from '../validations/index.js';

/**
 * Product Service
 * Contains business logic for Product operations
 */
export class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  /**
   * Get a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object|null>} Formatted product data or null
   */
  async getProductById(id) {
    const product = await this.repository.findById(id);
    return ProductDTO.format(product);
  }

  /**
   * Get all products with optional filtering
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Array>} Array of formatted product objects
   */
  async getProducts(options = {}) {
    const products = await this.repository.findAll(options);
    return ProductDTO.formatMany(products);
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
   * @returns {Promise<Object>} Created product data
   * @throws {z.ZodError} If validation fails
   */
  async createProduct(data) {
    // Validate input
    const validatedData = createProductSchema.parse(data);

    // Check if brand exists
    const brandExists = await this._checkBrandExists(validatedData.brandId);
    if (!brandExists) {
      throw new Error('Brand not found');
    }

    // Check if category exists
    const categoryExists = await this._checkCategoryExists(validatedData.categoryId);
    if (!categoryExists) {
      throw new Error('Category not found');
    }

    // Create product
    const product = await this.repository.create(validatedData);
    return ProductDTO.format(product);
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
   * @returns {Promise<Object>} Updated product data
   * @throws {z.ZodError} If validation fails
   */
  async updateProduct(id, data) {
    // Validate input
    const validatedData = updateProductSchema.parse(data);

    // Check if product exists
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // If brandId is being updated, check if new brand exists
    if (validatedData.brandId && validatedData.brandId !== existingProduct.brandId) {
      const brandExists = await this._checkBrandExists(validatedData.brandId);
      if (!brandExists) {
        throw new Error('Brand not found');
      }
    }

    // If categoryId is being updated, check if new category exists
    if (validatedData.categoryId && validatedData.categoryId !== existingProduct.categoryId) {
      const categoryExists = await this._checkCategoryExists(validatedData.categoryId);
      if (!categoryExists) {
        throw new Error('Category not found');
      }
    }

    // Update product
    const product = await this.repository.update(id, validatedData);
    return ProductDTO.format(product);
  }

  /**
   * Delete a product by ID
   * @param {string} id - Product ID
   * @returns {Promise<Object>} Deleted product data
   */
  async deleteProduct(id) {
    // Check if product exists
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Delete product
    const product = await this.repository.delete(id);
    return ProductDTO.format(product);
  }

  /**
   * Helper method to check if brand exists
   * @private
   * @param {string} brandId - Brand ID
   * @returns {Promise<boolean>} True if brand exists
   */
  async _checkBrandExists(brandId) {
    // This would ideally use a BrandRepository, but to avoid circular dependencies
    // and keep the service focused on its own domain, we'll use Prisma directly
    // In a larger app, you might want to inject brand service or use events
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });
    return !!brand;
  }

  /**
   * Helper method to check if category exists
   * @private
   * @param {string} categoryId - Category ID
   * @returns {Promise<boolean>} True if category exists
   */
  async _checkCategoryExists(categoryId) {
    // Similar to above, using Prisma directly for simplicity
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });
    return !!category;
  }
}