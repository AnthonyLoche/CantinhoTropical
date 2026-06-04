'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { deleteServiceImage } from '@/modules/uploads/services/upload.service.js';

/**
 * Server action to delete an image from Cloudinary
 * @param {Object} params - Parameters object
 * @param {string} params.url - The Cloudinary URL of the image to delete
 * @returns {Promise<Object>} Result object with success/error
 */
export async function deleteImageAction({ url }) {
  try {
    // 🔐 VERIFICAR AUTENTICAÇÃO
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    // Validate input
    if (!url || typeof url !== 'string') {
      throw new Error('Image URL is required');
    }

    // Delete the image from Cloudinary
    const result = await deleteServiceImage(url);

    return {
      success: true,
      data: result,
      message: 'Image deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting image:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete image',
    };
  }
}