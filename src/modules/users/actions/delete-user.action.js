'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';

export async function deleteUserAction(id) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
      };
    }

    // Não permitir excluir o próprio usuário
    if (session.user.id === id) {
      return {
        success: false,
        error: 'Não é possível excluir o próprio usuário',
      };
    }

    const user = await prisma.admin.delete({
      where: { id },
    });

    return {
      success: true,
      data: user,
      message: 'Usuário excluído com sucesso!',
    };
  } catch (error) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user',
    };
  }
}