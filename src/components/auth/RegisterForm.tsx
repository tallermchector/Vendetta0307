"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useTransition } from "react";
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
import { User, Mail, Lock, UserPlus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { registerUser } from "@/actions/auth";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z.string().trim().min(3, { message: "El nombre de usuario debe tener al menos 3 caracteres." }),
  email: z.string().trim().email({ message: "Por favor, introduce un correo electrónico válido." }),
  password: z.string().min(8, { message: "La contraseña debe tener al menos 8 caracteres." }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
});

export default function RegisterForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(() => {
      registerUser(values)
        .then((data) => {
          if (data.error) {
            toast({
              title: "Error de registro",
              description: data.error,
              variant: "destructive",
            });
          }
          if (data.success) {
            toast({
              title: "¡Cuenta Creada!",
              description: "Paso 1/2: Ahora, establece tu propiedad inicial.",
            });
            // @Security: Redirect to the next step without exposing any user data in the URL.
            // The user's session is already active.
            router.push(`/register/create-property`);
          }
        })
        .catch(() => {
          toast({
            title: "Error",
            description: "Algo salió mal. Por favor, inténtalo de nuevo.",
            variant: "destructive",
          });
        });
    });
  }

  return (
    <Card className="w-full max-w-md border-border/60">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-headline">Crea una cuenta (Paso 1/2)</CardTitle>
        <CardDescription>Tu viaje en Vendetta Latino comienza aquí.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de usuario</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="tu_alias" {...field} className="pl-10" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                  <FormLabel>Contraseña</FormLabel>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
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
              {isPending ? "Creando cuenta..." : <>
                <UserPlus className="mr-2 h-4 w-4" />
                Siguiente Paso
              </>}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          ¿Ya tienes una cuenta?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
