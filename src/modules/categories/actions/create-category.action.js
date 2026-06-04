'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { CategoryService } from '../services/category.service.js';
import { uploadCategoryImage } from '@/modules/uploads/services/upload.service.js';

/**
 * Server action to create a new category
 * @param {Object} data - Category data
 * @param {string} data.name - Category name
 * @param {string|File|Object} data.image - The image URL string, File object, or UploadDTO object
 * @param {string} data.description - Category description (optional)
 * @returns {Promise<Object>} Result object with success/error
 */
export async function createCategoryAction(data) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    console.log('📝 Creating category with data:', JSON.stringify(data, null, 2));

    let imageUrl = null;

    // Caso 1: data.image é uma string (URL já existente)
    if (typeof data.image === 'string' && data.image.trim() !== '') {
      imageUrl = data.image;
      console.log('✅ Using existing image URL:', imageUrl);
    }
    // Caso 2: data.image é um objeto com propriedade url (UploadDTO)
    else if (data.image && typeof data.image === 'object' && data.image.url) {
      imageUrl = data.image.url;
      console.log('✅ Using UploadDTO image URL:', imageUrl);
    }
    // Caso 3: data.image é um File (precisa fazer upload)
    else if (data.image && data.image instanceof File) {
      console.log('📤 Uploading image file:', data.image.name);
      const uploadResult = await uploadCategoryImage(data.image);
      imageUrl = uploadResult.url;
      console.log('✅ Image uploaded successfully:', imageUrl);
    }
    // Caso 4: data.imageUrl (backward compatibility)
    else if (typeof data.imageUrl === 'string' && data.imageUrl.trim() !== '') {
      imageUrl = data.imageUrl;
      console.log('✅ Using imageUrl field:', imageUrl);
    }
    // Caso 5: Sem imagem - verificar se é obrigatória
    else {
      console.error('❌ No image provided. Received data:', data);
      return {
        success: false,
        error: 'Image is required for category creation',
      };
    }

    // Validar nome
    if (!data.name || data.name.trim() === '') {
      return {
        success: false,
        error: 'Category name is required',
      };
    }

    // Prepare category data
    const categoryData = {
      name: data.name.trim(),
      description: data.description || '',
      imageUrl: imageUrl,
    };

    console.log('📤 Sending to CategoryService:', categoryData);

    const categoryService = new CategoryService();
    const category = await categoryService.createCategory(categoryData);

    console.log('✅ Category created successfully:', category.id);

    return {
      success: true,
      data: category,
      message: 'Category created successfully',
    };
  } catch (error) {
    console.error('❌ Error creating category:', error);
    return {
      success: false,
      error: error.message || 'Failed to create category',
    };
  }
}