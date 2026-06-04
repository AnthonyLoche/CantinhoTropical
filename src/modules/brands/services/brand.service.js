import { BrandRepository } from '../repositories/brand.repository';
import { BrandDTO } from '../dtos/brand.dto.js';
import { z } from 'zod';
import { createBrandSchema, updateBrandSchema } from '../validations/index'; // We'll create this file next

/**
 * Brand Service
 * Contains business logic for Brand operations
 */
export class BrandService {
  constructor() {
    this.repository = new BrandRepository();
  }

  /**
   * Get a brand by ID
   * @param {string} id - Brand ID
   * @returns {Promise<Object|null>} Formatted brand data or null
   */
  async getBrandById(id) {
    const brand = await this.repository.findById(id);
    return BrandDTO.format(brand);
  }

  /**
   * Get all brands with optional filtering
   * @param {Object} options - Filter and pagination options
   * @returns {Promise<Array>} Array of formatted brand objects
   */
  async getBrands(options = {}) {
    const brands = await this.repository.findAll(options);
    return BrandDTO.formatMany(brands);
  }

  /**
   * Create a new brand
   * @param {Object} data - Brand data
   * @param {string} data.name - Brand name
   * @param {string} data.imageUrl - Brand image URL
   * @returns {Promise<Object>} Created brand data
   * @throws {z.ZodError} If validation fails
   */
  async createBrand(data) {
    // Validate input
    const validatedData = createBrandSchema.parse(data);

    // Check if brand with same name already exists
    const existingBrand = await this.repository.findByName(validatedData.name);
    if (existingBrand) {
      throw new Error('Brand with this name already exists');
    }

    // Create brand
    const brand = await this.repository.create(validatedData);
    return BrandDTO.format(brand);
  }

  /**
   * Update an existing brand
   * @param {string} id - Brand ID
   * @param {Object} data - Data to update
   * @param {string} data.name - Brand name
   * @param {string} data.imageUrl - Brand image URL
   * @returns {Promise<Object>} Updated brand data
   * @throws {z.ZodError} If validation fails
   */
  async updateBrand(id, data) {
    // Validate input
    const validatedData = updateBrandSchema.parse(data);

    // Check if brand exists
    const existingBrand = await this.repository.findById(id);
    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    // Check if another brand with same name exists (if name is being updated)
    if (validatedData.name && validatedData.name !== existingBrand.name) {
      const brandWithSameName = await this.repository.findByName(validatedData.name);
      if (brandWithSameName) {
        throw new Error('Brand with this name already exists');
      }
    }

    // Update brand
    const brand = await this.repository.update(id, validatedData);
    return BrandDTO.format(brand);
  }

  /**
   * Delete a brand by ID
   * @param {string} id - Brand ID
   * @returns {Promise<Object>} Deleted brand data
   */
  async deleteBrand(id) {
    // Check if brand exists
    const existingBrand = await this.repository.findById(id);
    if (!existingBrand) {
      throw new Error('Brand not found');
    }

    // Delete brand
    const brand = await this.repository.delete(id);
    return BrandDTO.format(brand);
  }
}

// Helper method to find brand by name (to be added to repository)
/**
 * Find a brand by name
 * @param {string} name - Brand name
 * @returns {Promise<Object|null>} Brand object or null
 */
BrandRepository.prototype.findByName = async function(name) {
  return await prisma.brand.findFirst({
    where: { name },
  });
};