'use client';

import { useFormStatus, useFormState } from 'react-dom';
import { useEffect } from 'react';
import { handleInvitation } from '@/actions/family';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { LogIn, XCircle } from 'lucide-react';

const initialState: { success?: string; error?: string } = {};

type HandleInvitationFormProps = {
    invitationId: number;
    actionType: 'accept' | 'decline';
}

function SubmitButton({ actionType }: { actionType: 'accept' | 'decline' }) {
    const { pending } = useFormStatus();

    if (actionType === 'accept') {
        return (
            <Button type="submit" size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-500" disabled={pending}>
                {pending ? 'Aceptando...' : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" /> Aceptar
                    </>
                )}
            </Button>
        );
    }
    return (
        <Button type="submit" size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-500" disabled={pending}>
            {pending ? 'Rechazando...' : (
                <>
                    <XCircle className="mr-2 h-4 w-4" /> Rechazar
                </>
            )}
        </Button>
    );
}

export function HandleInvitationForm({ invitationId, actionType }: HandleInvitationFormProps) {
    const { toast } = useToast();
    const [state, formAction] = useFormState(handleInvitation, initialState);
    
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
            <input type="hidden" name="invitationId" value={invitationId} />
            <input type="hidden" name="action" value={actionType} />
            <SubmitButton actionType={actionType} />
        </form>
    );
}
