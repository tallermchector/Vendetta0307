"use server";

import * as z from "zod";

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(values: z.infer<typeof registerSchema>) {
  // This is a stub. In a real app, you'd create a new user in your database.
  console.log("Registrando usuario:", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (values.email.includes("test.com")) {
    return { success: "¡Usuario registrado con éxito!" };
  }

  return { error: "Ya existe una cuenta con este correo electrónico." };
}
