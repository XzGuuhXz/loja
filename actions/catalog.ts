"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

const categorySchema = z.object({ name: z.string().trim().min(2).max(80), slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().max(500).optional() });
const productSchema = z.object({ categoryId: z.string().min(1), name: z.string().trim().min(2).max(160), slug: z.string().trim().min(2).max(160).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/), description: z.string().trim().min(10).max(5000), sku: z.string().trim().min(2).max(60).regex(/^[A-Za-z0-9_-]+$/), price: z.coerce.number().positive().max(99999999.99), comparePrice: z.coerce.number().positive().max(99999999.99).optional().or(z.literal("")), stock: z.coerce.number().int().min(0).max(1000000), isFeatured: z.coerce.boolean().default(false) });
const imageSchema = z.object({ url: z.string().url().max(2048), alt: z.string().trim().max(250).optional().or(z.literal("")) });

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) throw new Error("Acesso administrativo negado.");
  return session.user;
}

export async function createCategory(input: unknown) {
  await requireAdmin(); const parsed = categorySchema.safeParse(input); if (!parsed.success) return { success: false, message: "Dados da categoria inválidos." };
  try { await prisma.category.create({ data: parsed.data }); revalidatePath("/produtos"); revalidatePath("/admin/categorias"); return { success: true }; } catch { return { success: false, message: "Não foi possível criar a categoria." }; }
}
export async function deleteCategory(id: string) {
  await requireAdmin(); if (!z.string().cuid().safeParse(id).success) return { success: false, message: "Categoria inválida." };
  const products = await prisma.product.count({ where: { categoryId: id } }); if (products > 0) return { success: false, message: "Remova ou mova os produtos antes de excluir." };
  await prisma.category.delete({ where: { id } }); revalidatePath("/produtos"); revalidatePath("/admin/categorias"); return { success: true };
}
export async function createProduct(input: unknown) {
  await requireAdmin(); const parsed = productSchema.safeParse(input); if (!parsed.success) return { success: false, message: "Revise os dados do produto." };
  try { await prisma.product.create({ data: { ...parsed.data, comparePrice: parsed.data.comparePrice === "" ? null : parsed.data.comparePrice } }); revalidatePath("/produtos"); revalidatePath("/admin/produtos"); return { success: true }; } catch { return { success: false, message: "SKU ou slug já pode estar em uso." }; }
}
export async function deleteProduct(id: string) {
  await requireAdmin(); if (!z.string().cuid().safeParse(id).success) return { success: false, message: "Produto inválido." };
  const orderItems = await prisma.orderItem.count({ where: { productId: id } }); if (orderItems > 0) await prisma.product.update({ where: { id }, data: { isActive: false } }); else await prisma.product.delete({ where: { id } });
  revalidatePath("/produtos"); revalidatePath("/admin/produtos"); return { success: true };
}

export async function addProductImage(productId: string, input: unknown) {
  await requireAdmin();
  if (!z.string().cuid().safeParse(productId).success) return { success: false, message: "Produto inválido." };
  const parsed = imageSchema.safeParse(input); if (!parsed.success) return { success: false, message: "URL ou texto alternativo inválido." };
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } }); if (!product) return { success: false, message: "Produto não encontrado." };
  const last = await prisma.productImage.findFirst({ where: { productId }, orderBy: { position: "desc" }, select: { position: true } });
  await prisma.productImage.create({ data: { productId, url: parsed.data.url, alt: parsed.data.alt || null, position: (last?.position ?? -1) + 1 } });
  revalidatePath(`/produtos/${productId}`); revalidatePath("/produtos"); revalidatePath(`/admin/produtos/${productId}/editar`); return { success: true };
}

export async function deleteProductImage(imageId: string) {
  await requireAdmin(); if (!z.string().cuid().safeParse(imageId).success) return { success: false, message: "Imagem inválida." };
  const image = await prisma.productImage.findUnique({ where: { id: imageId }, select: { productId: true } }); if (!image) return { success: false, message: "Imagem não encontrada." };
  await prisma.productImage.delete({ where: { id: imageId } });
  const remaining = await prisma.productImage.findMany({ where: { productId: image.productId }, orderBy: { position: "asc" }, select: { id: true } });
  await prisma.$transaction(remaining.map((item, index) => prisma.productImage.update({ where: { id: item.id }, data: { position: index } })));
  revalidatePath(`/produtos/${image.productId}`); revalidatePath("/produtos"); revalidatePath(`/admin/produtos/${image.productId}/editar`); return { success: true };
}

export async function setPrimaryProductImage(imageId: string) {
  await requireAdmin(); if (!z.string().cuid().safeParse(imageId).success) return { success: false, message: "Imagem inválida." };
  const image = await prisma.productImage.findUnique({ where: { id: imageId }, select: { id: true, productId: true } }); if (!image) return { success: false, message: "Imagem não encontrada." };
  const images = await prisma.productImage.findMany({ where: { productId: image.productId }, orderBy: { position: "asc" }, select: { id: true } });
  const ordered = [image.id, ...images.filter((item) => item.id !== image.id).map((item) => item.id)];
  await prisma.$transaction(ordered.map((id, position) => prisma.productImage.update({ where: { id }, data: { position } })));
  revalidatePath(`/produtos/${image.productId}`); revalidatePath("/produtos"); revalidatePath(`/admin/produtos/${image.productId}/editar`); return { success: true };
}
