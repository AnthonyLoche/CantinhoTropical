import { CategoryRepository } from '../repositories/category.repository.js';
import { CategoryDTO } from '../dtos/category.dto.js';
import { z } from 'zod';
import { createCategorySchema } from '../validations/create-category.validation.js';
import { updateCategorySchema } from '../validations/update-category.validation.js';

/**
 * Category Service
 * Contains business logic for Category operations
 */
export class CategoryService {
  constructor() {
    this.repository = new CategoryRepository();
  }

  /**
   * Get a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object|null>} Formatted category data or null
   */
  async getCategoryById(id) {
    const category = await this.repository.findById(id);
    return CategoryDTO.format(category);
  }

  /**
   * Get all categories with optional filtering
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Array>} Array of formatted category objects
   */
  async getCategories(options = {}) {
    const categories = await this.repository.findAll(options);
    return CategoryDTO.formatMany(categories);
  }

  /**
   * Create a new category
   * @param {Object} data - Category data
   * @param {string} data.name - Category name
   * @param {string} data.imageUrl - Category image URL
   * @param {string} data.description - Category description (optional)
   * @returns {Promise<Object>} Created category data
   * @throws {z.ZodError} If validation fails
   */
  async createCategory(data) {
    // Validate input
    const validatedData = createCategorySchema.parse(data);

    // Check if category with same name already exists
    const existingCategory = await this.repository.findByName(validatedData.name);
    if (existingCategory) {
      throw new Error('Category with this name already exists');
    }

    // Create category
    const category = await this.repository.create(validatedData);
    return CategoryDTO.format(category);
  }

  /**
   * Update an existing category
   * @param {string} id - Category ID
   * @param {Object} data - Data to update
   * @param {string} data.name - Category name
   * @param {string} data.imageUrl - Category image URL
   * @param {string} data.description - Category description (optional)
   * @returns {Promise<Object>} Updated category data
   * @throws {z.ZodError} If validation fails
   */
  async updateCategory(id, data) {
    // Validate input
    const validatedData = updateCategorySchema.parse(data);

    // Check if category exists
    const existingCategory = await this.repository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Check if another category with same name exists (if name is being updated)
    if (validatedData.name && validatedData.name !== existingCategory.name) {
      const categoryWithSameName = await this.repository.findByName(validatedData.name);
      if (categoryWithSameName) {
        throw new Error('Category with this name already exists');
      }
    }

    // Update category
    const category = await this.repository.update(id, validatedData);
    return CategoryDTO.format(category);
  }

  /**
   * Delete a category by ID
   * @param {string} id - Category ID
   * @returns {Promise<Object>} Deleted category data
   */
  async deleteCategory(id) {
    // Check if category exists
    const existingCategory = await this.repository.findById(id);
    if (!existingCategory) {
      throw new Error('Category not found');
    }

    // Delete category
    const category = await this.repository.delete(id);
    return CategoryDTO.format(category);
  }
}

// Helper method to find category by name (to be added to repository)
/**
 * Find a category by name
 * @param {string} name - Category name
 * @returns {Promise<Object|null>} Category object or null
 */
CategoryRepository.prototype.findByName = async function(name) {
  return await prisma.category.findFirst({
    where: { name },
  });
};