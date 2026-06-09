'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function updateUserAction(data) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
      };
    }

    // Verificar se usuário existe
    const existingUser = await prisma.admin.findUnique({
      where: { id: data.id },
    });

    if (!existingUser) {
      return {
        success: false,
        error: 'Usuário não encontrado',
      };
    }

    // Preparar dados para atualização
    const updateData = {
      name: data.name,
      email: data.email,
    };

    // Se senha foi fornecida, atualizar
    if (data.password && data.password.trim() !== '') {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    const user = await prisma.admin.update({
      where: { id: data.id },
      data: updateData,
    });

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        updatedAt: user.updatedAt,
      },
      message: 'Usuário atualizado com sucesso!',
    };
  } catch (error) {
    console.error('Error updating user:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user',
    };
  }
}