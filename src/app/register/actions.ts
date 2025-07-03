"use server";

import * as z from "zod";

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function register(values: z.infer<typeof registerSchema>) {
  // This is a stub. In a real app, you'd create a new user in your database.
  console.log("Registering user:", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (values.email.includes("test.com")) {
    return { success: "User registered successfully!" };
  }

  return { error: "An account with this email already exists." };
}
