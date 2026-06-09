'use server';

import { TextContentService } from '../services/text-content.service.js';

/**
 * Get text content (public access)
 * @returns {Promise<Object>} Result object with success/error and data
 */
export async function getTextContentAction() {
  try {
    const textContentService = new TextContentService();
    const content = await textContentService.getTextContent();

    return {
      success: true,
      data: content,
    };
  } catch (error) {
    console.error('Error fetching text content:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch text content',
      data: null,
    };
  }
}