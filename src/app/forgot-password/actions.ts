"use server";

import * as z from "zod";

const forgotPasswordSchema = z.object({
  email: z.string().email(),
});

export async function forgotPassword(
  values: z.infer<typeof forgotPasswordSchema>
) {
  // This is a stub. In a real app, you'd generate a token and send an email.
  console.log("Sending password reset link to:", values.email);
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // To protect against user enumeration, we always return a success message.
  return {
    success:
      "If an account with that email exists, a password reset link has been sent.",
  };
}
