'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { TextContentService } from '../services/text-content.service.js';

/**
 * Update text content (admin only)
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Result object with success/error
 */
export async function updateTextContentAction(data) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    console.log('📝 Updating text content with data:', JSON.stringify(data, null, 2));

    const textContentService = new TextContentService();
    const updatedContent = await textContentService.updateTextContent(data);

    console.log('✅ Text content updated successfully');

    return {
      success: true,
      data: updatedContent,
      message: 'Conteúdo atualizado com sucesso!',
    };
  } catch (error) {
    console.error('❌ Error updating text content:', error);
    return {
      success: false,
      error: error.message || 'Failed to update text content',
    };
  }
}