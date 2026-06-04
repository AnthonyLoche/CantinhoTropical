'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';

export async function getCategoriesAction() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
        data: [],
      };
    }

    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });

    // Serializar os dados
    const serializedCategories = categories.map((category) => ({
      id: category.id,
      name: category.name,
      description: category.description,
      imageUrl: category.imageUrl,
    }));

    return {
      success: true,
      data: serializedCategories,
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: error.message,
      data: [],
    };
  }
}