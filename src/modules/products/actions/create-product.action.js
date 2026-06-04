'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { ProductService } from '../services/product.service.js';
import { uploadProductImage } from '@/modules/uploads/services/upload.service.js';

/**
 * Server action to create a new product
 * @param {Object} data - Product data
 * @param {string} data.name - Product name
 * @param {string} data.description - Product description (optional)
 * @param {number|string} data.price - Product price
 * @param {number|string} data.stockQuantity - Product stock quantity
 * @param {string|File|Object} data.image - The image URL string, File object, or UploadDTO object
 * @param {boolean} data.active - Product active status
 * @param {boolean} data.featured - Product featured status
 * @param {string} data.brandId - Brand ID
 * @param {string} data.categoryId - Category ID
 * @returns {Promise<Object>} Result object with success/error
 */
export async function createProductAction(data) {
  try {
    // 🔐 Verificar autenticação
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado. Faça login novamente.',
      };
    }

    console.log('📝 Creating product with data:', JSON.stringify(data, null, 2));

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
      const uploadResult = await uploadProductImage(data.image);
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
        error: 'Image is required for product creation',
      };
    }

    // Validar campos obrigatórios
    if (!data.name || data.name.trim() === '') {
      return {
        success: false,
        error: 'Product name is required',
      };
    }

    if (!data.price) {
      return {
        success: false,
        error: 'Product price is required',
      };
    }

    // 🔥 IMPORTANTE: Usar stockQuantity em vez de stock
    const stockValue = data.stockQuantity !== undefined ? data.stockQuantity : data.stock;
    
    // Prepare product data
    const productData = {
      name: data.name.trim(),
      description: data.description || '',
      price: parseFloat(data.price),
      stockQuantity: parseInt(stockValue) || 0, // ← Mudado de 'stock' para 'stockQuantity'
      imageUrl: imageUrl,
      active: data.active === true || data.active === 'true',
      featured: data.featured === true || data.featured === 'true',
      brandId: data.brandId,
      categoryId: data.categoryId,
    };

    console.log('📤 Sending to ProductService:', productData);

    const productService = new ProductService();
    const product = await productService.createProduct(productData);

    console.log('✅ Product created successfully:', product.id);

    return {
      success: true,
      data: product,
      message: 'Product created successfully',
    };
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return {
      success: false,
      error: error.message || 'Failed to create product',
    };
  }
}