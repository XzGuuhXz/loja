"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const idSchema = z.string().cuid();

export async function toggleFavorite(productId: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, requiresLogin: true, message: "Entre na sua conta para favoritar produtos." };
  if (!idSchema.safeParse(productId).success) return { success: false, message: "Produto inválido." };

  const product = await prisma.product.findFirst({ where: { id: productId, isActive: true }, select: { id: true, slug: true } });
  if (!product) return { success: false, message: "Produto não encontrado." };

  const existing = await prisma.favorite.findUnique({ where: { userId_productId: { userId: session.user.id, productId } } });
  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } });
    revalidatePath("/conta/favoritos");
    revalidatePath("/produtos");
    return { success: true, favorited: false };
  }

  await prisma.favorite.create({ data: { userId: session.user.id, productId } });
  revalidatePath("/conta/favoritos");
  revalidatePath("/produtos");
  return { success: true, favorited: true };
}
