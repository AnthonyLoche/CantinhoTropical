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
 * @param {string} data.hint - Specialist tip (optional)
 * @param {string} data.howUse - How to use instructions (optional)
 * @param {string} data.ingredients - Ingredients list (optional)
 * @param {Array} data.variants - Product variants (optional) - each with { label, quantity, price }
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
        error: 'Imagem é obrigatória para criar o produto',
      };
    }

    // Validar campos obrigatórios
    if (!data.name || data.name.trim() === '') {
      return {
        success: false,
        error: 'Nome do produto é obrigatório',
      };
    }

    if (!data.price) {
      return {
        success: false,
        error: 'Preço do produto é obrigatório',
      };
    }

    // 🔥 IMPORTANTE: Usar stockQuantity em vez de stock
    const stockValue = data.stockQuantity !== undefined ? data.stockQuantity : data.stock;
    
    // Processar variantes
    let variants = [];
    if (data.variants && Array.isArray(data.variants) && data.variants.length > 0) {
      variants = data.variants
        .filter(v => v.label && v.label.trim() !== '') // Filtrar variantes sem label
        .map(v => ({
          label: v.label.trim(),
          quantity: parseInt(v.quantity) || 0,
          price: parseFloat(v.price) || 0,
        }));
      console.log(`📦 Processing ${variants.length} variants`);
    }
    
    // Prepare product data com os novos campos
    const productData = {
      name: data.name.trim(),
      description: data.description || '',
      price: parseFloat(data.price),
      stockQuantity: parseInt(stockValue) || 0,
      imageUrl: imageUrl,
      active: data.active === true || data.active === 'true',
      featured: data.featured === true || data.featured === 'true',
      brandId: data.brandId,
      categoryId: data.categoryId,
      // Novos campos
      hint: data.hint || '',
      howUse: data.howUse || '',
      ingredients: data.ingredients || '',
      // Variantes
      variants: variants,
    };

    console.log('📤 Sending to ProductService:', {
      ...productData,
      variants: productData.variants.length,
    });

    const productService = new ProductService();
    const product = await productService.createProduct(productData);

    console.log('✅ Product created successfully:', product.id);

    return {
      success: true,
      data: product,
      message: 'Produto criado com sucesso!',
    };
  } catch (error) {
    console.error('❌ Error creating product:', error);
    return {
      success: false,
      error: error.message || 'Erro ao criar produto',
    };
  }
}