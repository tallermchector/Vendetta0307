"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useTransition } from "react";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Globe, Satellite, Anchor, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createInitialProperty } from "@/actions/property";
import { Skeleton } from "@/components/ui/skeleton";

// Using .pipe() allows us to validate as a string first (for required fields)
// and then coerce and validate as a number. This works well with controlled
// form inputs that use empty strings for empty number fields.
const formSchema = z.object({
  name: z.string().min(3, {message: "Debe tener al menos 3 caracteres."}).default("Propiedad Principal"),
  coordX: z.string().min(1, { message: "La coordenada X es requerida."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-50" })
    .max(50, { message: "Rango: 1-50" })
  ),
  coordY: z.string().min(1, { message: "La coordenada Y es requerida."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-50" })
    .max(50, { message: "Rango: 1-50" })
  ),
  coordZ: z.string().min(1, { message: "El Sector Z es requerido."}).pipe(
    z.coerce.number({invalid_type_error: "Debe ser un número"})
    .int()
    .min(1, { message: "Rango: 1-255" })
    .max(255, { message: "Rango: 1-255" })
  ),
});

function CreatePropertyFormComponent() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // Initialize number fields with an empty string to avoid uncontrolled input errors.
    defaultValues: {
      name: "Propiedad Principal",
      coordX: "",
      coordY: "",
      coordZ: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!userId) {
        toast({
            title: "Error",
            description: "No se encontró el ID de usuario. Por favor, regístrate de nuevo.",
            variant: "destructive",
        });
        return;
    }
    
    startTransition(() => {
        createInitialProperty({ ...values, userId: parseInt(userId) })
            .then((data) => {
                if (data.error) {
                    form.setError("root", { message: data.error });
                    toast({
                        title: "Error al crear la propiedad",
                        description: data.error,
                        variant: "destructive",
                    });
                }
                if (data.success) {
                    toast({
                        title: "¡Propiedad Establecida!",
                        description: data.success,
                    });
                    router.push('/login');
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

  if (!userId) {
    return (
        <Card className="w-full max-w-lg border-border/60">
             <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Error de Usuario</CardTitle>
                <CardDescription>
                No se pudo identificar al usuario. Por favor, regresa y completa el registro nuevamente.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={() => router.push('/register')}>Volver a Registro</Button>
            </CardContent>
        </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg border-border/60">
      <CardHeader className="text-center">
        <MapPin className="mx-auto h-12 w-12 text-primary" />
        <CardTitle className="text-2xl font-headline mt-4">Establece tu Propiedad Inicial (Paso 2/2)</CardTitle>
        <CardDescription>
          Elige un nombre y las coordenadas para tu primera base de operaciones. Esta será tu fortaleza.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
             <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2"><Home className="h-4 w-4" /> Nombre de tu Propiedad</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input placeholder="Ej: El Escondite" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <FormField
                  control={form.control}
                  name="coordX"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Globe className="h-4 w-4" /> Coordenada X</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="1-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="coordY"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Globe className="h-4 w-4" /> Coordenada Y</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="1-50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <FormField
                  control={form.control}
                  name="coordZ"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2"><Satellite className="h-4 w-4" /> Sector Z</FormLabel>
                      <FormControl>
                          <Input type="number" placeholder="1-255" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            {form.formState.errors.root && (
                 <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>
            )}
            <Button type="submit" className="w-full !mt-8" disabled={isPending}>
              {isPending ? "Fundando..." : <>
                <Anchor className="mr-2 h-4 w-4" />
                Fundar y Finalizar
              </>}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}


// Dado que useSearchParams solo puede usarse en un componente de cliente envuelto en <Suspense>,
// creamos un componente contenedor.
export default function CreatePropertyForm() {
    return (
        <Suspense fallback={<CreatePropertyFormSkeleton/>}>
            <CreatePropertyFormComponent />
        </Suspense>
    )
}

function CreatePropertyFormSkeleton() {
    return (
         <Card className="w-full max-w-lg border-border/60">
            <CardHeader className="text-center">
                <Skeleton className="h-12 w-12 rounded-full mx-auto" />
                <Skeleton className="h-8 w-3/4 mx-auto mt-4" />
                <Skeleton className="h-4 w-full mx-auto mt-2" />
                <Skeleton className="h-4 w-2/3 mx-auto mt-1" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                 <Skeleton className="h-11 w-full !mt-8" />
            </CardContent>
        </Card>
    )
}
