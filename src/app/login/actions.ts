"use server";

import * as z from "zod";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function login(values: z.infer<typeof loginSchema>) {
  // This is a stub. In a real app, you'd validate credentials.
  console.log("Logging in with:", values);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  if (values.password === "password123" && values.email.includes("test.com")) {
    return { success: "Logged in successfully!" };
  }

  return { error: "Invalid email or password." };
}
