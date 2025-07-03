'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';

const registerSchema = z.object({
  username: z.string().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});


export async function registerUser(values: z.infer<typeof registerSchema>): Promise<{ success: true; userId: number; } | { error: string; }> {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
  }

  const { username, email, password } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUserByEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUserByEmail) {
    return { error: 'El correo electrónico ya está en uso.' };
  }

  const existingUserByUsername = await prisma.user.findUnique({
    where: { usuario: username },
  });
  
  if (existingUserByUsername) {
    return { error: 'El nombre de usuario ya está en uso.' };
  }

  const newUser = await prisma.user.create({
    data: {
      usuario: username,
      email: email,
      pass: hashedPassword,
      idioma: 'es',
    },
  });

  return { success: true, userId: newUser.id_usuario };
}


export async function loginUser(values: z.infer<typeof loginSchema>): Promise<{ success: true; } | { error: string; }> {
    const validatedFields = loginSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Campos inválidos." };
    }

    const { email, password } = validatedFields.data;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return { error: "El correo electrónico no está registrado." };
    }

    const passwordsMatch = await bcrypt.compare(password, user.pass);

    if (!passwordsMatch) {
        return { error: "La contraseña es incorrecta." };
    }
    
    await createSession({ userId: user.id_usuario });

    return { success: true };
}

export async function sendPasswordResetLink(values: z.infer<typeof forgotPasswordSchema>) {
    const validatedFields = forgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Correo electrónico inválido." };
    }
    const { email } = validatedFields.data;
    
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return { success: "Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña."};
    }

    // En una aplicación real, aquí se generaría un token y se enviaría un correo electrónico.
    console.log(`Password reset link for ${email} would be sent here.`);

    return { success: "Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña."};
}


export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}
