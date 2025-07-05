'use client';

import { useFormState, useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RoleInFamily, type User } from '@prisma/client';
import { updateMemberRole } from '@/actions/family';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const initialState: { success?: string; error?: string } = {};

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" size="sm" disabled={pending}>{pending ? 'Guardando...' : 'Guardar'}</Button>
}

export function ManageRoleForm({ member }: { member: User }) {
  const [state, formAction] = useFormState(updateMemberRole, initialState);
  const { toast } = useToast();
  const [selectedRole, setSelectedRole] = useState(member.roleInFamily ?? RoleInFamily.Member);

  useEffect(() => {
    if (state?.error) {
        toast({ title: 'Error', description: state.error, variant: 'destructive' });
    }
    if (state?.success) {
        toast({ title: 'Éxito', description: state.success });
    }
  }, [state, toast]);

  return (
    <form action={formAction} className="flex items-center justify-end gap-2">
      <input type="hidden" name="memberId" value={member.id_usuario} />
      <input type="hidden" name="newRole" value={selectedRole} />
      <Select defaultValue={selectedRole} onValueChange={(value) => setSelectedRole(value as RoleInFamily)}>
        <SelectTrigger className="w-[120px] h-9">
          <SelectValue placeholder="Rol" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RoleInFamily.Member}>Miembro</SelectItem>
          <SelectItem value={RoleInFamily.CoLeader}>Co-Líder</SelectItem>
          <SelectItem value={RoleInFamily.Leader}>Líder</SelectItem>
        </SelectContent>
      </Select>
      <SubmitButton />
    </form>
  );
}
