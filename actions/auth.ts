"use server";

import { AuthError } from "next-auth";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/security/password";
import { signIn } from "@/auth";

const registerSchema = z
  .object({
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(254),
    password: z.string().min(8).max(128),
    confirmPassword: z.string().min(8).max(128),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas precisam ser iguais.",
    path: ["confirmPassword"],
  });

const credentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function registerUser(input: unknown) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Revise os dados informados." };
  }

  const email = parsed.data.email.toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return { success: false, message: "Este e-mail já está cadastrado." };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email,
      passwordHash,
      role: "CUSTOMER",
    },
  });

  return { success: true, message: "Conta criada com sucesso." };
}

export async function authenticateUser(input: unknown) {
  const parsed = credentialsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "E-mail ou senha inválidos." };
  }

  try {
    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/conta",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: "E-mail ou senha inválidos." };
    }

    throw error;
  }
}

export async function authenticateAdmin(input: unknown) {
  const parsed = credentialsSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: "Credenciais administrativas inválidas." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
      select: { role: true, isBlocked: true },
    });

    if (
      !user ||
      user.isBlocked ||
      (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN")
    ) {
      return {
        success: false,
        message: "Acesso administrativo não autorizado.",
      };
    }

    await signIn("credentials", {
      email: parsed.data.email.toLowerCase(),
      password: parsed.data.password,
      redirectTo: "/admin/dashboard",
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { success: false, message: "Credenciais administrativas inválidas." };
    }

    throw error;
  }
}

export async function logout() {
  await signOut({ redirectTo: "/" });
}
