'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { deleteSession } from '@/lib/session';
import { redirect } from 'next/navigation';

const updatePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las nuevas contraseñas no coinciden.',
    path: ['confirmPassword'],
  });

export async function updatePassword(
  values: z.infer<typeof updatePasswordSchema>
): Promise<{ success?: string; error?: string }> {
  const user = await protectAction();

  const validatedFields = updatePasswordSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map((e) => e.message).join(', ') };
  }

  const { currentPassword, newPassword } = validatedFields.data;

  const passwordMatch = await bcrypt.compare(currentPassword, user.pass);
  if (!passwordMatch) {
    return { error: 'La contraseña actual es incorrecta.' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id_usuario: user.id_usuario },
    data: { pass: hashedPassword },
  });

  revalidatePath('/dashboard/options');
  return { success: 'Contraseña actualizada con éxito.' };
}

const updateEmailSchema = z.object({
  newEmail: z.string().email('Por favor, introduce un correo electrónico válido.'),
  currentPassword: z.string().min(1, 'La contraseña es requerida para confirmar.'),
});

export async function updateEmail(
  values: z.infer<typeof updateEmailSchema>
): Promise<{ success?: string; error?: string }> {
  const user = await protectAction();

  const validatedFields = updateEmailSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map((e) => e.message).join(', ') };
  }
  
  const { newEmail, currentPassword } = validatedFields.data;

  const passwordMatch = await bcrypt.compare(currentPassword, user.pass);
  if (!passwordMatch) {
    return { error: 'La contraseña es incorrecta.' };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: newEmail },
  });

  if (existingUser && existingUser.id_usuario !== user.id_usuario) {
    return { error: 'El correo electrónico ya está en uso.' };
  }

  await prisma.user.update({
    where: { id_usuario: user.id_usuario },
    data: { email: newEmail },
  });

  revalidatePath('/dashboard/options');
  return { success: 'Correo electrónico actualizado con éxito.' };
}

const deleteAccountSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña es requerida para eliminar la cuenta.'),
});

export async function deleteAccount(
  values: z.infer<typeof deleteAccountSchema>
): Promise<{ error?: string }> {
  const user = await protectAction();

  const validatedFields = deleteAccountSchema.safeParse(values);
  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map((e) => e.message).join(', ') };
  }
  
  const { currentPassword } = validatedFields.data;
  
  const passwordMatch = await bcrypt.compare(currentPassword, user.pass);
  if (!passwordMatch) {
    return { error: 'La contraseña es incorrecta. No se puede eliminar la cuenta.' };
  }

  // Transaction to delete user and related data
  await prisma.user.delete({
      where: { id_usuario: user.id_usuario },
  });

  await deleteSession();
  redirect('/');
}
