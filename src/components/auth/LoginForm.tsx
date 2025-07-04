"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
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
import { LogIn, Mail, Lock } from "lucide-react";
import { loginUser } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es obligatoria." }),
});

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      loginUser(values).then((data) => {
        if (data.success && data.redirect) {
          // Case: Successful login
          toast({
            title: "¡Bienvenido de nuevo!",
            description: "Redirigiendo a tu panel de control...",
          });
          router.push(data.redirect);
        } else if (data.error) {
          // Case: Incomplete registration or other login errors
          toast({
            title: data.redirect ? "Registro Incompleto" : "Error de inicio de sesión",
            description: data.error,
            variant: "destructive",
          });
          if (data.redirect) {
             // Redirect to property creation after showing the toast, giving the user time to read it.
             setTimeout(() => router.push(data.redirect as string), 2000);
          }
        }
      }).catch(() => {
        toast({
            title: "Error inesperado",
            description: "Algo salió mal. Por favor, inténtalo de nuevo.",
            variant: "destructive",
        });
      });
    });
  }

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Bienvenido de nuevo</CardTitle>
        <CardDescription>Introduce tus credenciales para acceder a tu cuenta.</CardDescription>
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
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Contraseña</FormLabel>
                    <Link href="/forgot-password"
                      className="text-sm font-medium text-primary/80 hover:text-primary transition-colors">
                      ¿Olvidaste la contraseña?
                    </Link>
                  </div>
                  <FormControl>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input type="password" placeholder="••••••••" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Iniciando sesión..." : <>
                <LogIn className="mr-2 h-4 w-4" />
                Iniciar sesión
              </>}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿No tienes una cuenta?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Regístrate
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
