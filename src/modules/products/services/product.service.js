import { prisma } from '@/lib/prisma';
import { ProductRepository } from '../repositories/product.repository.js';
import { ProductDTO } from '../dtos/product.dto.js';
import { 
  createProductSchema, 
  updateProductSchema,
  variantSchema,
  updateVariantSchema,
} from '../validations/index.js';

export class ProductService {
  constructor() {
    this.repository = new ProductRepository();
  }

  async getProductById(id) {
    const product = await this.repository.findById(id);
    return ProductDTO.format(product);
  }

  async getProducts(options = {}) {
    const products = await this.repository.findAll(options);
    return ProductDTO.formatMany(products);
  }

  async createProduct(data) {
    // Validate input
    const validatedData = createProductSchema.parse(data);

    // Check brand and category
    await this._checkBrandAndCategory(validatedData.brandId, validatedData.categoryId);

    // Prepare product data
    const productData = {
      name: validatedData.name,
      description: validatedData.description || '',
      price: validatedData.price,
      stockQuantity: validatedData.stockQuantity || 0,
      imageUrl: validatedData.imageUrl,
      active: validatedData.active !== undefined ? validatedData.active : true,
      featured: validatedData.featured !== undefined ? validatedData.featured : false,
      hint: validatedData.hint || '',
      how_use: validatedData.howUse || '',
      ingredients: validatedData.ingredients || '',
      brandId: validatedData.brandId,
      categoryId: validatedData.categoryId,
    };

    // Prepare variants
    const variants = validatedData.variants?.map(v => ({
      label: v.label,
      quantity: v.quantity || 0,
      price: v.price,
    })) || [];

    // Create product
    const product = await this.repository.create(productData, variants);
    return ProductDTO.format(product);
  }

  async updateProduct(id, data) {
    // Validate input
    const validatedData = updateProductSchema.parse(data);

    // Check if product exists
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Check brand and category if changed
    if (validatedData.brandId || validatedData.categoryId) {
      await this._checkBrandAndCategory(
        validatedData.brandId || existingProduct.brandId,
        validatedData.categoryId || existingProduct.categoryId
      );
    }

    // Prepare update data
    const updateData = {};
    if (validatedData.name !== undefined) updateData.name = validatedData.name;
    if (validatedData.description !== undefined) updateData.description = validatedData.description;
    if (validatedData.price !== undefined) updateData.price = validatedData.price;
    if (validatedData.stockQuantity !== undefined) updateData.stockQuantity = validatedData.stockQuantity;
    if (validatedData.imageUrl !== undefined) updateData.imageUrl = validatedData.imageUrl;
    if (validatedData.active !== undefined) updateData.active = validatedData.active;
    if (validatedData.featured !== undefined) updateData.featured = validatedData.featured;
    if (validatedData.hint !== undefined) updateData.hint = validatedData.hint;
    if (validatedData.howUse !== undefined) updateData.how_use = validatedData.howUse;
    if (validatedData.ingredients !== undefined) updateData.ingredients = validatedData.ingredients;
    if (validatedData.brandId !== undefined) updateData.brandId = validatedData.brandId;
    if (validatedData.categoryId !== undefined) updateData.categoryId = validatedData.categoryId;

    // Prepare variants
    let variants = null;
    if (validatedData.variants !== undefined) {
      variants = validatedData.variants.map(v => ({
        id: v.id,
        label: v.label,
        quantity: v.quantity || 0,
        price: v.price,
      }));
    }

    // Update product
    const product = await this.repository.update(id, updateData, variants);
    return ProductDTO.format(product);
  }

  async deleteProduct(id) {
    const existingProduct = await this.repository.findById(id);
    if (!existingProduct) {
      throw new Error('Product not found');
    }

    return await this.repository.delete(id);
  }

  // Variant methods
  async getVariantsByProductId(productId) {
    const product = await this.repository.findById(productId);
    return product?.variants || [];
  }

  async createVariant(productId, data) {
    const validatedData = variantSchema.parse(data);
    
    const product = await this.repository.findById(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    return await this.repository.createVariant({
      ...validatedData,
      productId,
    });
  }

  async updateVariant(id, data) {
    const validatedData = updateVariantSchema.parse(data);
    
    const variant = await this.repository.findVariantById(id);
    if (!variant) {
      throw new Error('Variant not found');
    }

    return await this.repository.updateVariant(id, validatedData);
  }

  async deleteVariant(id) {
    const variant = await this.repository.findVariantById(id);
    if (!variant) {
      throw new Error('Variant not found');
    }

    return await this.repository.deleteVariant(id);
  }

  // Private helpers
  async _checkBrandAndCategory(brandId, categoryId) {
    const brand = await prisma.brand.findUnique({ where: { id: brandId } });
    if (!brand) throw new Error('Brand not found');

    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) throw new Error('Category not found');
  }
}