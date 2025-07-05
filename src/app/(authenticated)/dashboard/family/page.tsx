import { protectPage } from '@/lib/auth';
import prisma from '@/lib/prisma';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  UserPlus,
  Crown,
  ShieldCheck,
  User as UserIcon,
  LogIn,
  LogOut,
  PlusCircle,
  XCircle,
} from "lucide-react";
import {
  createFamily,
  inviteMember,
  handleInvitation,
} from '@/actions/family';
import { RoleInFamily, type Family, type User, type FamilyInvitation } from '@prisma/client';
import Image from 'next/image';
import { LeaveFamilyForm } from '@/components/family/LeaveFamilyForm';
import { ManageRoleForm } from '@/components/family/ManageRoleForm';


type InvitationWithFamily = FamilyInvitation & {
  familia: {
    nombre: string;
    tag: string;
  };
};

type FamilyWithMembers = Family & {
  miembros: User[];
};

export default async function FamilyPage() {
  const user = await protectPage();
  const family = user.familia;

  if (!family) {
    const invitations = await prisma.familyInvitation.findMany({
      where: { id_usuario_invitado: user.id_usuario },
      include: {
        familia: {
          select: {
            nombre: true,
            tag: true,
          }
        }
      }
    });
    return <NoFamilyView invitations={invitations} />;
  }
  
  const currentUserRole = user.roleInFamily;
  const currentUserId = user.id_usuario;

  return <FamilyView family={family} currentUserRole={currentUserRole} currentUserId={currentUserId} />;
}

// View for users WITH a family
function FamilyView({ family, currentUserRole, currentUserId }: { family: FamilyWithMembers; currentUserRole: RoleInFamily | null; currentUserId: number }) {
  const canManageMembers = currentUserRole === RoleInFamily.Leader;
  const canInvite = currentUserRole === RoleInFamily.Leader || currentUserRole === RoleInFamily.CoLeader;

  const roleIconMap: Record<RoleInFamily, React.ReactNode> = {
    [RoleInFamily.Leader]: <Crown className="h-4 w-4 text-yellow-400" />,
    [RoleInFamily.CoLeader]: <ShieldCheck className="h-4 w-4 text-blue-400" />,
    [RoleInFamily.Member]: <UserIcon className="h-4 w-4 text-muted-foreground" />,
  };
  
  const roleLabelMap: Record<RoleInFamily, string> = {
    [RoleInFamily.Leader]: "Líder",
    [RoleInFamily.CoLeader]: "Co-Líder",
    [RoleInFamily.Member]: "Miembro",
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={family.emblema_url || 'https://placehold.co/128x128.png'}
              data-ai-hint="family crest shield"
              alt={`Emblema de ${family.nombre}`}
              width={80}
              height={80}
              className="rounded-lg border-2 border-primary"
            />
            <div>
              <CardTitle className="text-3xl font-headline">
                {family.nombre} <span className="text-primary">[{family.tag}]</span>
              </CardTitle>
              <CardDescription>{family.miembros.length} miembro(s)</CardDescription>
            </div>
          </div>
          <LeaveFamilyForm />
        </CardHeader>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
              <Card>
                  <CardHeader>
                      <CardTitle>Miembros</CardTitle>
                  </CardHeader>
                  <CardContent>
                      <Table>
                          <TableHeader>
                              <TableRow>
                                  <TableHead>Nombre</TableHead>
                                  <TableHead>Rol</TableHead>
                                  <TableHead className="text-right">Acciones</TableHead>
                              </TableRow>
                          </TableHeader>
                          <TableBody>
                              {family.miembros.map((member: User) => (
                                  <TableRow key={member.id_usuario}>
                                      <TableCell className="font-medium">{member.usuario}</TableCell>
                                      <TableCell>
                                          {member.roleInFamily && (
                                            <div className="flex items-center gap-2">
                                                {roleIconMap[member.roleInFamily]}
                                                <span>{roleLabelMap[member.roleInFamily]}</span>
                                            </div>
                                          )}
                                      </TableCell>
                                      <TableCell className="text-right">
                                        {canManageMembers && member.id_usuario !== currentUserId ? (
                                            <ManageRoleForm member={member} />
                                        ) : (
                                            <Button variant="ghost" size="sm" disabled>Gestionar</Button>
                                        )}
                                      </TableCell>
                                  </TableRow>
                              ))}
                          </TableBody>
                      </Table>
                  </CardContent>
              </Card>
          </div>
          
          {canInvite && (
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Invitar Miembro</CardTitle>
                        <CardDescription>Invita a un nuevo jugador a unirse a la familia.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={inviteMember} className="space-y-4">
                            <div>
                                <Label htmlFor="username">Nombre de usuario</Label>
                                <Input id="username" name="username" placeholder="Alias del jugador" required />
                            </div>
                            <Button type="submit" className="w-full">
                                <UserPlus className="mr-2 h-4 w-4" />
                                Enviar Invitación
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
          )}
      </div>
    </div>
  );
}

// View for users WITHOUT a family
function NoFamilyView({ invitations }: { invitations: InvitationWithFamily[] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>Crea tu Propia Familia</CardTitle>
          <CardDescription>Forja tu propio destino y funda un nuevo clan.</CardDescription>
        </CardHeader>
        <CardContent>
            <form action={createFamily} className="space-y-4">
                <div>
                    <Label htmlFor="name">Nombre de la Familia</Label>
                    <Input id="name" name="name" placeholder="Ej: Los Corleone" required />
                </div>
                <div>
                    <Label htmlFor="tag">Tag de la Familia (2-5 caracteres)</Label>
                    <Input id="tag" name="tag" placeholder="Ej: FLC" required minLength={2} maxLength={5} />
                </div>
                <Button type="submit" className="w-full">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Fundar Familia
                </Button>
            </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invitaciones Pendientes</CardTitle>
          <CardDescription>
            {invitations.length > 0 ? 'Has sido invitado a unirte a estas familias.' : 'No tienes invitaciones pendientes.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {invitations.length > 0 && (
            <div className="space-y-3">
              {invitations.map(inv => (
                <div key={inv.id_invitation} className="flex items-center justify-between p-3 rounded-md border bg-muted/50">
                  <div>
                    <p className="font-semibold">{inv.familia.nombre} <span className="text-muted-foreground">[{inv.familia.tag}]</span></p>
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={handleInvitation}>
                        <input type="hidden" name="invitationId" value={inv.id_invitation} />
                        <input type="hidden" name="action" value="accept" />
                        <Button type="submit" size="sm" variant="outline" className="text-green-500 border-green-500 hover:bg-green-500/10 hover:text-green-500">
                          <LogIn className="mr-2 h-4 w-4" /> Aceptar
                        </Button>
                    </form>
                     <form action={handleInvitation}>
                        <input type="hidden" name="invitationId" value={inv.id_invitation} />
                        <input type="hidden" name="action" value="decline" />
                        <Button type="submit" size="sm" variant="outline" className="text-red-500 border-red-500 hover:bg-red-500/10 hover:text-red-500">
                           <XCircle className="mr-2 h-4 w-4" /> Rechazar
                        </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
