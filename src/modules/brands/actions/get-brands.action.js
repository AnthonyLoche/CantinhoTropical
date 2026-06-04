'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';

export async function getBrandsAction() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
        data: [],
      };
    }

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