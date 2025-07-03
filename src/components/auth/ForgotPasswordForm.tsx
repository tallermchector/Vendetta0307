"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Mail, KeyRound, ArrowLeft } from "lucide-react";
import { sendPasswordResetLink } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
});

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      sendPasswordResetLink(values).then(data => {
        if(data.success) {
          setSubmitted(true);
        } else if (data.error) {
           toast({
              title: "Error",
              description: data.error,
              variant: "destructive",
            });
        }
      }).catch(() => {
        toast({
            title: "Error",
            description: "Algo salió mal. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
      })
    });
  }
  
  if (submitted) {
    return (
      <Card className="w-full max-w-md border-border/60">
        <CardHeader className="text-center">
          <KeyRound className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-2xl font-headline mt-4">Revisa tu correo</CardTitle>
          <CardDescription>
            Si tu cuenta existe, hemos enviado un enlace para restablecer la contraseña a <span className="font-medium text-foreground">{form.getValues("email")}</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
           <Button variant="outline" className="w-full" asChild>
              <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver a Iniciar sesión
              </Link>
           </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">¿Olvidaste tu contraseña?</CardTitle>
        <CardDescription>
          No te preocupes, te enviaremos instrucciones para restablecerla.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="nombre@ejemplo.com" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando..." : <>
                <KeyRound className="mr-2 h-4 w-4" />
                Enviar enlace de restablecimiento
              </>}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="ghost" asChild>
            <Link href="/login">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Iniciar sesión
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
