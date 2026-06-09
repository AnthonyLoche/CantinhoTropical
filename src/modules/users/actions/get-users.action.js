'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';

export async function getUsersAction({ search = '' } = {}) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
        data: [],
      };
    }

    const where = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { email: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const users = await prisma.admin.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    const serializedUsers = users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));

    return {
      success: true,
      data: serializedUsers,
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
      data: [],
    };
  }
}