"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Globe, Satellite, Anchor, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { createInitialProperty } from "@/actions/property";

// @Fix: This schema validates form inputs as strings. The robust numeric validation
// (min/max range) is handled by the server action's schema. This resolves
// the type mismatch with defaultValues.
const formSchema = z.object({
  name: z.string().trim().min(3, {message: "Debe tener al menos 3 caracteres."}).default("Propiedad Principal"),
  coordX: z.string().min(1, { message: "La coordenada X es requerida."}),
  coordY: z.string().min(1, { message: "La coordenada Y es requerida."}),
  coordZ: z.string().min(1, { message: "El Sector Z es requerido."}),
});


export default function CreatePropertyForm() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
    startTransition(() => {
        // @Security: The action now gets the user ID from the secure session,
        // and handles its own validation and coercion from string to number.
        createInitialProperty(values)
            .then((data) => {
                // If the action returns a value, it's always an error object.
                // A successful action results in a redirect, which doesn't resolve here.
                if (data?.error) {
                    form.setError("root", { message: data.error });
                    toast({
                        title: "Error al crear la propiedad",
                        description: data.error,
                        variant: "destructive",
                    });
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
