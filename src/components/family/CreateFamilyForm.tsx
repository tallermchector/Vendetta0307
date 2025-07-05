'use client';

import { useEffect, useRef } from 'react';
import { useFormState, useFormStatus } from 'react-dom';
import { createFamily } from '@/actions/family';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';

const initialState: { success?: string; error?: string } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Fundando...' : (
        <>
          <PlusCircle className="mr-2 h-4 w-4" />
          Fundar Familia
        </>
      )}
    </Button>
  );
}

export function CreateFamilyForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(createFamily, initialState);
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
        <Label htmlFor="name">Nombre de la Familia</Label>
        <Input id="name" name="name" placeholder="Ej: Los Corleone" required />
      </div>
      <div>
        <Label htmlFor="tag">Tag de la Familia (2-5 caracteres)</Label>
        <Input id="tag" name="tag" placeholder="Ej: FLC" required minLength={2} maxLength={5} />
      </div>
      <SubmitButton />
    </form>
  );
}
