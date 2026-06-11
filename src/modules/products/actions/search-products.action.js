// src/modules/products/actions/search-products.action.js
"use server";

import { prisma } from "@/lib/prisma";

export async function searchProductsAction(searchTerm) {
  if (!searchTerm || searchTerm.trim() === "") {
    return { success: true, data: [] };
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        OR: [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
          { brand: { name: { contains: searchTerm, mode: "insensitive" } } },
          { category: { name: { contains: searchTerm, mode: "insensitive" } } },
        ],
      },
      include: {
        brand: true,
        category: true,
      },
      take: 10, // Limitar a 10 resultados
    });

    return { success: true, data: products };
  } catch (error) {
    console.error("Erro ao buscar produtos:", error);
    return { success: false, data: [], error: error.message };
  }
}