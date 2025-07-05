'use client';

import { useEffect } from 'react';
import { useFormState, useFormStatus } from 'react-dom';

import { leaveFamily } from '@/actions/family';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogOut } from 'lucide-react';

const initialState: { success?: string; error?: string } = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="destructive" size="sm" disabled={pending}>
      {pending ? (
        'Abandonando...'
      ) : (
        <>
          <LogOut className="mr-2 h-4 w-4" />
          Abandonar Familia
        </>
      )}
    </Button>
  );
}

export function LeaveFamilyForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(leaveFamily, initialState);

  useEffect(() => {
    if (state?.success) {
      toast({ title: 'Éxito', description: state.success });
    }
    if (state?.error) {
      toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
  }, [state, toast]);

  return (
    <form action={formAction}>
      <SubmitButton />
    </form>
  );
}
