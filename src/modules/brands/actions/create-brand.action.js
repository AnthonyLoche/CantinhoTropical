'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { BrandService } from '../services/brand.service.js';
import { uploadBrandImage } from '@/modules/uploads/services/upload.service.js';

/**
 * Server action to create a new brand
 * @param {Object} data - Brand data
 * @param {string} data.name - Brand name
 * @param {string|File} data.image - The image URL string or File object
 * @returns {Promise<Object>} Result object with success/error
 */
export async function createBrandAction(data) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    console.log('📝 Creating brand with data:', JSON.stringify(data, null, 2));

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
      const uploadResult = await uploadBrandImage(data.image);
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
        error: 'Image is required for brand creation',
      };
    }

    // Validar nome
    if (!data.name || data.name.trim() === '') {
      return {
        success: false,
        error: 'Brand name is required',
      };
    }

    // Prepare brand data
    const brandData = {
      name: data.name.trim(),
      imageUrl: imageUrl,
    };

    console.log('📤 Sending to BrandService:', brandData);

    const brandService = new BrandService();
    const brand = await brandService.createBrand(brandData);

    console.log('✅ Brand created successfully:', brand.id);

    return {
      success: true,
      data: brand,
      message: 'Brand created successfully',
    };
  } catch (error) {
    console.error('❌ Error creating brand:', error);
    return {
      success: false,
      error: error.message || 'Failed to create brand',
    };
  }
}