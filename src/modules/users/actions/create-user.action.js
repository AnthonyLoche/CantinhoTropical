'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/modules/auth/auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';

export async function createUserAction(data) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return {
        success: false,
        error: 'Não autorizado',
      };
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.admin.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return {
        success: false,
        error: 'Já existe um usuário com este e-mail',
      };
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.admin.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });

    return {
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
      message: 'Usuário criado com sucesso!',
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      success: false,
      error: error.message || 'Failed to create user',
    };
  }
}