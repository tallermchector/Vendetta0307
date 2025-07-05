'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { inviteMember } from '@/actions/family';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';

const initialState: { success?: string; error?: string } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Enviando...' : (
        <>
          <UserPlus className="mr-2 h-4 w-4" />
          Enviar Invitación
        </>
      )}
    </Button>
  );
}

export function InviteMemberForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(inviteMember, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Éxito', description: state.success });
      formRef.current?.reset();
    }
    if (state?.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <div>
        <Label htmlFor="username">Nombre de usuario</Label>
        <Input id="username" name="username" placeholder="Alias del jugador" required />
      </div>
      <SubmitButton />
    </form>
  );
}
