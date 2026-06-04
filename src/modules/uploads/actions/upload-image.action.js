'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { uploadProductImage, uploadBrandImage, uploadCategoryImage } from '@/modules/uploads/services/upload.service.js';

/**
 * Validates that the provided file is an image and under 5MB
 */
function validateImageFile(file) {
  if (!file) {
    throw new Error('Image file is required');
  }

  if (!(file instanceof File)) {
    throw new Error('Invalid file object');
  }

  const validImageTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  if (!validImageTypes.includes(file.type)) {
    throw new Error('File must be an image (JPEG, PNG, WebP, or GIF)');
  }

  const maxSizeInBytes = 5 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('Image file size must be less than 5MB');
  }
}

/**
 * Server action to upload an image
 */
export async function uploadImageAction(formData) {
  try {
    // 🔐 VERIFICAR AUTENTICAÇÃO - MÉTODO MAIS ROBUSTO
    let session = null;
    try {
      session = await getServerSession(authOptions);
      console.log('Session found:', !!session);
      if (session?.user) {
        console.log('User email:', session.user.email);
      }
    } catch (sessionError) {
      console.error('Error getting session:', sessionError);
      return {
        success: false,
        error: 'Erro ao verificar autenticação',
      };
    }
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    const image = formData.get('image');
    const type = formData.get('type');

    // Validate inputs
    validateImageFile(image);

    if (!type || !['product', 'brand', 'category'].includes(type)) {
      throw new Error('Invalid image type. Must be product, brand, or category');
    }

    // Upload based on type - now returns a plain object
    let uploadResult;
    switch (type) {
      case 'product':
        uploadResult = await uploadProductImage(image);
        break;
      case 'brand':
        uploadResult = await uploadBrandImage(image);
        break;
      case 'category':
        uploadResult = await uploadCategoryImage(image);
        break;
      default:
        throw new Error('Invalid image type');
    }

    // Verificar se o upload foi bem sucedido
    if (!uploadResult || !uploadResult.url) {
      throw new Error('Upload failed - no URL returned');
    }

    // Return a plain serializable object (uploadResult is already a plain object from createUploadDTO)
    return {
      success: true,
      data: uploadResult, // This is already a plain object, not a class instance
      message: 'Image uploaded successfully',
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    return {
      success: false,
      error: error.message || 'Failed to upload image',
    };
  }
}