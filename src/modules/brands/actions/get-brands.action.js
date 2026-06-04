'use server';

import { prisma } from '@/lib/prisma';

export async function getBrandsAction() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' },
    });

    // Serializar os dados
    const serializedBrands = brands.map((brand) => ({
      id: brand.id,
      name: brand.name,
      imageUrl: brand.imageUrl,
    }));

    return {
      success: true,
      data: serializedBrands,
    };
  } catch (error) {
    console.error('Error fetching brands:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}