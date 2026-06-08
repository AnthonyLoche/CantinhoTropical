import { prisma } from '@/lib/prisma';

export class ProductRepository {
  async findById(id) {
    return await prisma.product.findUnique({
      where: { id },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });
  }

  async findAll(options = {}) {
    const {
      search,
      brandId,
      categoryId,
      active,
      featured,
      skip = 0,
      take = 10,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = options;

    const where = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }
    if (brandId) where.brandId = brandId;
    if (categoryId) where.categoryId = categoryId;
    if (active !== undefined) where.active = active;
    if (featured !== undefined) where.featured = featured;

    return await prisma.product.findMany({
      where,
      include: {
        brand: true,
        category: true,
        variants: true,
      },
      skip,
      take,
      orderBy: {
        [orderBy]: orderDirection,
      },
    });
  }

  async create(data, variants = []) {
    return await prisma.product.create({
      data: {
        ...data,
        variants: variants.length > 0 ? {
          create: variants,
        } : undefined,
      },
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });
  }

  async update(id, data, variants = null) {
    // Primeiro, buscar as variantes existentes
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: { variants: true },
    });

    if (!existingProduct) {
      throw new Error('Product not found');
    }

    // Preparar os dados de atualização
    const updateData = { ...data };
    
    // Remover variants do updateData pois será tratado separadamente
    delete updateData.variants;

    if (variants !== null) {
      // IDs das variantes existentes
      const existingVariantIds = existingProduct.variants.map(v => v.id);
      
      // IDs das variantes que vieram na requisição (para atualizar)
      const updateVariantIds = variants.filter(v => v.id).map(v => v.id);
      
      // IDs para deletar (existem no banco mas não vieram na requisição)
      const deleteVariantIds = existingVariantIds.filter(id => !updateVariantIds.includes(id));
      
      // Variantes para criar (sem id)
      const createVariants = variants.filter(v => !v.id).map(v => ({
        label: v.label,
        quantity: v.quantity,
        price: v.price,
      }));
      
      // Variantes para atualizar (com id)
      const updateVariants = variants.filter(v => v.id).map(v => ({
        where: { id: v.id },
        data: {
          label: v.label,
          quantity: v.quantity,
          price: v.price,
        },
      }));

      updateData.variants = {
        ...(deleteVariantIds.length > 0 && { deleteMany: { id: { in: deleteVariantIds } } }),
        ...(createVariants.length > 0 && { create: createVariants }),
        ...(updateVariants.length > 0 && { update: updateVariants }),
      };
    }

    return await prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        brand: true,
        category: true,
        variants: true,
      },
    });
  }

  async delete(id) {
    return await prisma.product.delete({
      where: { id },
    });
  }

  async findVariantById(id) {
    return await prisma.productVariants.findUnique({
      where: { id },
    });
  }

  async createVariant(data) {
    return await prisma.productVariants.create({
      data,
    });
  }

  async updateVariant(id, data) {
    return await prisma.productVariants.update({
      where: { id },
      data,
    });
  }

  async deleteVariant(id) {
    return await prisma.productVariants.delete({
      where: { id },
    });
  }
}