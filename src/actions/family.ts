'use server';

import { z } from 'zod';
import prisma from '@/lib/prisma';
import { protectAction } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { RoleInFamily } from '@prisma/client';

// Schema for creating a family
const createFamilySchema = z.object({
  name: z.string().trim().min(3, "El nombre debe tener al menos 3 caracteres.").max(25, "El nombre no puede exceder los 25 caracteres."),
  tag: z.string().trim().min(2, "El tag debe tener 2-5 caracteres.").max(5, "El tag no puede exceder los 5 caracteres."),
});

export async function createFamily(formData: FormData): Promise<{ success?: string; error?: string }> {
  const user = await protectAction();

  if (user.id_familia) {
    return { error: 'Ya perteneces a una familia.' };
  }

  const validatedFields = createFamilySchema.safeParse({
    name: formData.get('name'),
    tag: formData.get('tag'),
  });

  if (!validatedFields.success) {
    return { error: validatedFields.error.errors.map(e => e.message).join(', ') };
  }

  const { name, tag } = validatedFields.data;

  try {
    const newFamily = await prisma.$transaction(async (tx) => {
      const family = await tx.family.create({
        data: {
          nombre: name,
          tag: tag,
        },
      });

      await tx.user.update({
        where: { id_usuario: user.id_usuario },
        data: {
          id_familia: family.id_familia,
          roleInFamily: RoleInFamily.Leader,
        },
      });

      return family;
    });

    revalidatePath('/dashboard/family');
    revalidatePath('/dashboard');
    return { success: `¡Familia '${newFamily.nombre}' creada con éxito!` };
  } catch (error) {
    if (error instanceof Error && 'code' in error && (error as any).code === 'P2002') {
        return { error: 'El nombre o el tag de la familia ya existen.' };
    }
    console.error("Error al crear la familia:", error);
    return { error: 'No se pudo crear la familia. Inténtalo de nuevo.' };
  }
}

// Schema for inviting a member
const inviteMemberSchema = z.object({
  username: z.string().trim().min(1, "El nombre de usuario es requerido."),
});

export async function inviteMember(formData: FormData): Promise<{ success?: string; error?: string }> {
    const inviter = await protectAction();

    if (!inviter.id_familia || !inviter.roleInFamily) {
        return { error: 'No perteneces a una familia.' };
    }

    if (inviter.roleInFamily !== RoleInFamily.Leader && inviter.roleInFamily !== RoleInFamily.CoLeader) {
        return { error: 'No tienes permisos para invitar a nuevos miembros.' };
    }

    const validatedFields = inviteMemberSchema.safeParse({
        username: formData.get('username'),
    });

    if (!validatedFields.success) {
        return { error: 'Nombre de usuario inválido.' };
    }

    const { username: invitedUsername } = validatedFields.data;

    if (inviter.usuario === invitedUsername) {
        return { error: 'No puedes invitarte a ti mismo.' };
    }

    const invitedUser = await prisma.user.findUnique({
        where: { usuario: invitedUsername },
    });

    if (!invitedUser) {
        return { error: `No se encontró al usuario '${invitedUsername}'.` };
    }

    if (invitedUser.id_familia) {
        return { error: 'Este jugador ya pertenece a una familia.' };
    }

    const existingInvitation = await prisma.familyInvitation.findFirst({
        where: {
            id_familia: inviter.id_familia,
            id_usuario_invitado: invitedUser.id_usuario,
        },
    });

    if (existingInvitation) {
        return { error: 'Ya has enviado una invitación a este jugador.' };
    }

    await prisma.familyInvitation.create({
        data: {
            id_familia: inviter.id_familia,
            id_usuario_invitado: invitedUser.id_usuario,
        },
    });
    
    revalidatePath('/dashboard/family');
    return { success: `Invitación enviada a ${invitedUsername}.` };
}

// Schema for handling an invitation
const handleInvitationSchema = z.object({
  invitationId: z.coerce.number().int(),
  action: z.enum(['accept', 'decline']),
});

export async function handleInvitation(formData: FormData): Promise<{ success?: string; error?: string }> {
    const user = await protectAction();
    
    const validatedFields = handleInvitationSchema.safeParse({
        invitationId: formData.get('invitationId'),
        action: formData.get('action'),
    });

    if (!validatedFields.success) {
        return { error: "Acción inválida." };
    }
    const { invitationId, action } = validatedFields.data;

    const invitation = await prisma.familyInvitation.findUnique({
        where: { id_invitation: invitationId },
    });

    if (!invitation || invitation.id_usuario_invitado !== user.id_usuario) {
        return { error: "Invitación no encontrada o no válida para ti." };
    }

    if (action === 'decline') {
        await prisma.familyInvitation.delete({ where: { id_invitation: invitationId } });
        revalidatePath('/dashboard/family');
        return { success: "Invitación rechazada." };
    }

    if (user.id_familia) {
        await prisma.familyInvitation.delete({ where: { id_invitation: invitationId } });
        return { error: "Ya perteneces a otra familia. Invitación cancelada." };
    }
    
    try {
        await prisma.$transaction(async (tx) => {
            await tx.user.update({
                where: { id_usuario: user.id_usuario },
                data: {
                    id_familia: invitation.id_familia,
                    roleInFamily: RoleInFamily.Member,
                },
            });
            await tx.familyInvitation.deleteMany({
                where: { id_usuario_invitado: user.id_usuario },
            });
        });

        revalidatePath('/dashboard/family');
        revalidatePath('/dashboard');
        return { success: "¡Bienvenido a la familia!" };

    } catch (error) {
        console.error("Error al aceptar la invitación:", error);
        return { error: "Ocurrió un error al unirse a la familia." };
    }
}

export async function leaveFamily(
  prevState: { error?: string; success?: string },
  formData: FormData
): Promise<{ success?: string; error?: string }> {
    const user = await protectAction();

    if (!user.id_familia || !user.roleInFamily) {
        return { error: 'No perteneces a ninguna familia.' };
    }
    
    if (user.roleInFamily === RoleInFamily.Leader) {
        const otherLeaders = await prisma.user.count({
            where: {
                id_familia: user.id_familia,
                roleInFamily: RoleInFamily.Leader,
                NOT: { id_usuario: user.id_usuario },
            },
        });

        if (otherLeaders === 0) {
            const memberCount = await prisma.user.count({
                where: { id_familia: user.id_familia }
            });
            
            if (memberCount > 1) {
                return { error: 'Eres el único líder. Debes promover a otro miembro a líder antes de poder irte.' };
            } else {
                 await prisma.$transaction(async (tx) => {
                    await tx.user.update({
                        where: { id_usuario: user.id_usuario },
                        data: { id_familia: null, roleInFamily: null },
                    });
                    await tx.family.delete({ where: { id_familia: user.id_familia! } });
                 });
                 revalidatePath('/dashboard/family');
                 return { success: 'Has abandonado y disuelto tu familia.' };
            }
        }
    }

    await prisma.user.update({
        where: { id_usuario: user.id_usuario },
        data: { id_familia: null, roleInFamily: null },
    });

    revalidatePath('/dashboard/family');
    revalidatePath('/dashboard');
    return { success: 'Has abandonado la familia.' };
}

// Schema for updating a member's role
const updateRoleSchema = z.object({
  memberId: z.coerce.number().int(),
  newRole: z.nativeEnum(RoleInFamily),
});

export async function updateMemberRole(
    prevState: { error?: string; success?: string },
    formData: FormData
): Promise<{ success?: string; error?: string }> {
    const adminUser = await protectAction();

    // Only Leaders can manage roles
    if (!adminUser.id_familia || adminUser.roleInFamily !== RoleInFamily.Leader) {
        return { error: 'No tienes permisos para cambiar roles.' };
    }
    
    const validatedFields = updateRoleSchema.safeParse({
        memberId: formData.get('memberId'),
        newRole: formData.get('newRole'),
    });

    if (!validatedFields.success) {
        return { error: 'Datos de formulario inválidos.' };
    }

    const { memberId, newRole } = validatedFields.data;

    // A Leader cannot change their own role using this form.
    if (memberId === adminUser.id_usuario) {
        return { error: 'No puedes cambiar tu propio rol con esta función.' };
    }
  
    const memberToUpdate = await prisma.user.findFirst({
        where: {
            id_usuario: memberId,
            id_familia: adminUser.id_familia,
        },
    });

    if (!memberToUpdate) {
        return { error: 'El miembro no se encuentra en tu familia.' };
    }
  
    // Logic to prevent removing the last leader
    if (memberToUpdate.roleInFamily === RoleInFamily.Leader && newRole !== RoleInFamily.Leader) {
        const leaderCount = await prisma.user.count({
            where: {
                id_familia: adminUser.id_familia,
                roleInFamily: RoleInFamily.Leader,
            },
        });

        if (leaderCount <= 1) {
            return { error: 'No puedes degradar al último líder de la familia. Nombra a otro líder primero.' };
        }
    }

    try {
        await prisma.user.update({
            where: { id_usuario: memberId },
            data: { roleInFamily: newRole },
        });

        revalidatePath('/dashboard/family');
        return { success: `Rol de ${memberToUpdate.usuario} actualizado a ${newRole}.` };

    } catch (error) {
        console.error("Error al actualizar rol:", error);
        return { error: 'Ocurrió un error al actualizar el rol.' };
    }
}
