'use server';

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';

import prisma from '@/lib/prisma';
import { createSession, deleteSession } from '@/lib/session';

// @BestPractice: Use .trim() to remove leading/trailing whitespace from user input.
const registerSchema = z.object({
  username: z.string().trim().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().trim().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
});

const loginSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});


export async function registerUser(values: z.infer<typeof registerSchema>): Promise<{ success: true; } | { error: string; }> {
  const validatedFields = registerSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: 'Campos inválidos.' };
  }

  const { username, email, password } = validatedFields.data;
  
  // @Security: Hash the password securely using bcrypt before storing it.
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

  // @Security: After successful registration, create a session for the user immediately.
  // This avoids passing sensitive info like userId in URL params.
  await createSession({ userId: newUser.id_usuario });

  return { success: true };
}


export async function loginUser(values: z.infer<typeof loginSchema>): Promise<{ error: string } | { success: true; redirectTo: string; }> {
    try {
        const validatedFields = loginSchema.safeParse(values);

        if (!validatedFields.success) {
            return { error: "Datos de inicio de sesión inválidos." };
        }

        const { email, password } = validatedFields.data;

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // @Security: Use a generic error message to prevent email enumeration.
            return { error: "El correo electrónico o la contraseña son incorrectos." };
        }
        
        const passwordsMatch = await bcrypt.compare(password, user.pass);

        if (!passwordsMatch) {
             // @Security: Use a generic error message.
            return { error: "El correo electrónico o la contraseña son incorrectos." };
        }
        
        await createSession({ userId: user.id_usuario });

        // @BestPractice: Check if the user has completed the registration flow by checking for a profile.
        const profile = await prisma.playerProfile.findUnique({
            where: { id_usuario: user.id_usuario },
        });

        if (!profile) {
            // If registration is incomplete, return the redirect path for the client to handle.
            return { success: true, redirectTo: '/register/create-property' };
        }
        
        // On full success, return the redirect path for the client to handle.
        return { success: true, redirectTo: '/dashboard' };

    } catch (error: any) {
        // Log the unexpected error for debugging purposes on the server.
        console.error("Error inesperado durante el inicio de sesión:", error);
        
        // Return a generic, user-friendly error message.
        return { error: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." };
    }
}

export async function sendPasswordResetLink(values: z.infer<typeof forgotPasswordSchema>) {
    const validatedFields = forgotPasswordSchema.safeParse(values);

    if (!validatedFields.success) {
        return { error: "Correo electrónico inválido." };
    }
    const { email } = validatedFields.data;
    
    const user = await prisma.user.findUnique({ where: { email } });

    // @Security: To prevent user enumeration, always return a generic success message
    // regardless of whether the user exists or not.
    if (!user) {
        return { success: "Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña."};
    }

    // In a real application, here you would generate a secure, single-use token,
    // save its hash to the database with an expiration, and email the user a link.
    console.log(`Password reset link for ${email} would be sent here.`);

    return { success: "Si existe una cuenta con ese correo, se ha enviado un enlace para restablecer la contraseña."};
}


export async function logoutUser() {
  // @Security: This server action securely deletes the session cookie.
  await deleteSession();
  // @BestPractice: Redirect the user to the login page after destroying the session.
  redirect('/login');
}
