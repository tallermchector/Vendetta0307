
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
import { protectPage } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export default async function RankingsPage() {
  const currentUser = await protectPage();

  const playersWithProfiles = await prisma.user.findMany({
    where: {
      perfil: {
        isNot: null,
      },
    },
    include: {
      perfil: true,
      familia: true,
      _count: {
        select: { propiedades: true },
      },
    },
  });

  const rankedPlayers = playersWithProfiles
    .map(player => {
      const perfil = player.perfil;
      if (!perfil) return null; // Should not happen due to the where clause

      const totalPoints =
        (perfil.puntos_edificios ?? 0) +
        (perfil.puntos_entrenamiento ?? 0) +
        (perfil.puntos_tropas ?? 0);

      return {
        ...player,
        totalPoints,
      };
    })
    .filter(Boolean) // Remove any nulls
    .sort((a, b) => b!.totalPoints - a!.totalPoints);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Clasificaciones Globales</CardTitle>
              <CardDescription>
                Compite por ser el jugador más poderoso.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          <div className="relative w-full overflow-auto">
             <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px] text-center">#</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Puntos (Entren.)</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Puntos (Edificios)</TableHead>
                        <TableHead className="text-right hidden md:table-cell">Puntos (Tropas)</TableHead>
                        <TableHead className="text-right">Suma Total</TableHead>
                        <TableHead className="text-right hidden sm:table-cell">Edificios</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rankedPlayers.map((player, index) => {
                        if (!player) return null;
                        const isCurrentUser = player.id_usuario === currentUser.id_usuario;
                        return (
                            <TableRow 
                                key={player.id_usuario} 
                                className={cn(isCurrentUser && 'bg-primary/10 font-bold text-primary-foreground')}
                            >
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell>
                                    {player.usuario}
                                    {player.familia && <span className="ml-1 text-muted-foreground">{`[${player.familia.tag}]`}</span>}
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                    {player.perfil?.puntos_entrenamiento.toLocaleString('es-ES') ?? 0}
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                    {player.perfil?.puntos_edificios.toLocaleString('es-ES') ?? 0}
                                </TableCell>
                                <TableCell className="text-right hidden md:table-cell">
                                    {player.perfil?.puntos_tropas.toLocaleString('es-ES') ?? 0}
                                </TableCell>
                                <TableCell className="text-right">
                                    {player.totalPoints.toLocaleString('es-ES')}
                                </TableCell>
                                <TableCell className="text-right hidden sm:table-cell">
                                    {player._count.propiedades}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
             </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
