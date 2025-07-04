import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import type { User, PlayerProfile } from "@prisma/client";

type MemberWithProfile = User & { perfil: PlayerProfile | null };

interface MemberListProps {
  members: MemberWithProfile[];
}

export function MemberList({ members }: MemberListProps) {
  return (
    <div className="relative w-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Miembro</TableHead>
            <TableHead className="text-right">Puntos</TableHead>
            <TableHead className="hidden md:table-cell text-center">Rol</TableHead>
            <TableHead className="hidden sm:table-cell text-center">Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const totalPoints = member.perfil ? (member.perfil.puntos_edificios ?? 0) + (member.perfil.puntos_entrenamiento ?? 0) + (member.perfil.puntos_tropas ?? 0) : 0;
            
            return (
              <TableRow key={member.id_usuario}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="mafia member" />
                      <AvatarFallback>
                        <UserIcon className="h-5 w-5" />
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{member.usuario}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-mono">{totalPoints.toLocaleString()}</TableCell>
                <TableCell className="hidden md:table-cell text-center text-primary font-semibold">Miembro</TableCell>
                <TableCell className="hidden sm:table-cell text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                    </span>
                    <span className="text-muted-foreground text-xs">En línea</span>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  );
}
