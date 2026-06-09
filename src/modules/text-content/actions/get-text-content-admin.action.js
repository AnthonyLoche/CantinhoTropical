'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { TextContentService } from '../services/text-content.service.js';

/**
 * Get text content for admin (requires authentication)
 * @returns {Promise<Object>} Result object with success/error and data
 */
export async function getTextContentAdminAction() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
        data: null,
      };
    }

    const textContentService = new TextContentService();
    const content = await textContentService.getTextContentForAdmin();

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