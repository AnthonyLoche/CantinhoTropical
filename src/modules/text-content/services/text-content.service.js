import { prisma } from '@/lib/prisma';
import { TextContentRepository } from '../repositories/text-content.repository.js';
import { TextContentDTO } from '../dtos/text-content.dto.js';
import { 
  createTextContentSchema, 
  updateTextContentSchema 
} from '../validations/index.js';
import { DEFAULT_TEXT_CONTENT } from '../constants/text-content.constants.js';

export class TextContentService {
  constructor() {
    this.repository = new TextContentRepository();
  }

  /**
   * Get text content (singleton)
   * @returns {Promise<Object>} Formatted text content
   */
  async getTextContent() {
    let content = await this.repository.findFirst();
    
    // If no content exists, create with defaults
    if (!content) {
      content = await this.repository.create(DEFAULT_TEXT_CONTENT);
    }
    
    return TextContentDTO.format(content);
  }

  /**
   * Get text content for admin (with metadata)
   * @returns {Promise<Object>} Formatted text content for admin
   */
  async getTextContentForAdmin() {
    let content = await this.repository.findFirst();
    
    if (!content) {
      content = await this.repository.create(DEFAULT_TEXT_CONTENT);
    }
    
    return TextContentDTO.formatForAdmin(content);
  }

  /**
   * Update text content
   * @param {Object} data - Update data
   * @returns {Promise<Object>} Updated text content
   * @throws {z.ZodError} If validation fails
   */
  async updateTextContent(data) {
    // Validate input
    const validatedData = updateTextContentSchema.parse(data);
    
    // Get existing content or create if not exists
    let existingContent = await this.repository.findFirst();
    
    if (!existingContent) {
      existingContent = await this.repository.create(DEFAULT_TEXT_CONTENT);
    }
    
    // Prepare update data
    const updateData = {};
    
    if (validatedData.heroBadge !== undefined) updateData.heroBadge = validatedData.heroBadge;
    if (validatedData.heroTitle !== undefined) updateData.heroTitle = validatedData.heroTitle;
    if (validatedData.heroDescription !== undefined) updateData.heroDescription = validatedData.heroDescription;
    
    if (validatedData.categoriesTitle !== undefined) updateData.categoriesTitle = validatedData.categoriesTitle;
    if (validatedData.categoriesDescription !== undefined) updateData.categoriesDescription = validatedData.categoriesDescription;
    
    if (validatedData.aboutTitle !== undefined) updateData.aboutTitle = validatedData.aboutTitle;
    if (validatedData.aboutDescription !== undefined) updateData.aboutDescription = validatedData.aboutDescription;
    
    if (validatedData.petHotelChip !== undefined) updateData.petHotelChip = validatedData.petHotelChip;
    if (validatedData.petHotelTitle !== undefined) updateData.petHotelTitle = validatedData.petHotelTitle;
    if (validatedData.petHotelDescription !== undefined) updateData.petHotelDescription = validatedData.petHotelDescription;
    
    if (validatedData.contactTitle !== undefined) updateData.contactTitle = validatedData.contactTitle;
    if (validatedData.contactDescription !== undefined) updateData.contactDescription = validatedData.contactDescription;
    
    // Update content
    const updatedContent = await this.repository.update(existingContent.id, updateData);
    
    return TextContentDTO.format(updatedContent);
  }

  /**
   * Update single field
   * @param {string} field - Field name
   * @param {string} value - Field value
   * @returns {Promise<Object>} Updated text content
   */
  async updateField(field, value) {
    const validatedField = updateTextContentSchema.pick({ [field]: true }).parse({ [field]: value });
    
    let existingContent = await this.repository.findFirst();
    
    if (!existingContent) {
      existingContent = await this.repository.create(DEFAULT_TEXT_CONTENT);
    }
    
    const updatedContent = await this.repository.update(existingContent.id, validatedField);
    
    return TextContentDTO.format(updatedContent);
  }
}