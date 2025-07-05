'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTransition } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { KeyRound, Mail, ShieldAlert, Trash2 } from 'lucide-react';
import { updatePassword, updateEmail, deleteAccount } from '@/actions/user';

// Schemas for each form
const passwordSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña actual es requerida.'),
  newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres.'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las nuevas contraseñas no coinciden.',
  path: ['confirmPassword'],
});

const emailSchema = z.object({
  newEmail: z.string().email('Por favor, introduce un correo electrónico válido.'),
  currentPassword: z.string().min(1, 'La contraseña es requerida para confirmar.'),
});

const deleteSchema = z.object({
  currentPassword: z.string().min(1, 'La contraseña es requerida.'),
});


export default function OptionsPage() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  // Password Form
  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    startTransition(() => {
      updatePassword(values).then((data) => {
        if (data.error) {
          toast({ title: 'Error', description: data.error, variant: 'destructive' });
        } else {
          toast({ title: 'Éxito', description: data.success });
          passwordForm.reset();
        }
      });
    });
  }
  
  // Email Form
  const emailForm = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: { newEmail: '', currentPassword: '' },
  });

  function onEmailSubmit(values: z.infer<typeof emailSchema>) {
    startTransition(() => {
      updateEmail(values).then((data) => {
        if (data.error) {
          toast({ title: 'Error', description: data.error, variant: 'destructive' });
        } else {
          toast({ title: 'Éxito', description: data.success });
          emailForm.reset();
        }
      });
    });
  }

  // Delete Account Form
  const deleteForm = useForm<z.infer<typeof deleteSchema>>({
    resolver: zodResolver(deleteSchema),
    defaultValues: { currentPassword: '' },
  });

  function onDeleteSubmit(values: z.infer<typeof deleteSchema>) {
    startTransition(() => {
      deleteAccount(values).then((data) => {
        if (data?.error) {
          toast({ title: 'Error de eliminación', description: data.error, variant: 'destructive' });
        }
        // On success, the action redirects, so no toast is needed.
      });
    });
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {/* Change Password Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><KeyRound/> Cambiar Contraseña</CardTitle>
          <CardDescription>Actualiza tu contraseña por una nueva.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Actual</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirmar Nueva Contraseña</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Actualizando...' : 'Actualizar Contraseña'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {/* Change Email Card */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Mail/> Cambiar Email</CardTitle>
          <CardDescription>Actualiza la dirección de correo de tu cuenta.</CardDescription>
        </CardHeader>
        <CardContent>
           <Form {...emailForm}>
            <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
              <FormField
                control={emailForm.control}
                name="newEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nuevo Correo Electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="nuevo@ejemplo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={emailForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña Actual (para confirmar)</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? 'Actualizando...' : 'Actualizar Email'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Delete Account Card */}
      <Card className="lg:col-span-1 border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive"><ShieldAlert/> Zona de Peligro</CardTitle>
          <CardDescription>Acciones irreversibles.</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertTitle>Eliminar Cuenta</AlertTitle>
            <AlertDescription>
              Esta acción es permanente. Se borrarán todos tus datos, incluyendo propiedades, recursos y progreso. No podrás recuperarlos.
            </AlertDescription>
          </Alert>
          <div className="mt-4">
             <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="w-full">
                        <Trash2 className="mr-2" />
                        Eliminar mi cuenta permanentemente
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
                        <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminarán permanentemente tus datos de nuestros servidores.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <Form {...deleteForm}>
                            <form onSubmit={deleteForm.handleSubmit(onDeleteSubmit)} className="w-full space-y-4">
                                <FormField
                                    control={deleteForm.control}
                                    name="currentPassword"
                                    render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Introduce tu contraseña para confirmar</FormLabel>
                                        <FormControl>
                                        <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                    )}
                                />
                                <div className="flex gap-2 justify-end">
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction type="submit" disabled={isPending}>
                                        {isPending ? "Eliminando..." : "Sí, eliminar cuenta"}
                                    </AlertDialogAction>
                                </div>
                            </form>
                        </Form>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
