
import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { Prisma } from "@prisma/client";

// Define the query payload for rankings to derive the type from it.
const rankingQueryPayload = {
  include: {
    perfil: true,
    familia: true,
    _count: {
      select: { propiedades: true },
    },
  },
} satisfies Prisma.UserArgs;

// Derive the player type from the query payload.
type PlayerForRanking = Prisma.UserGetPayload<typeof rankingQueryPayload>;

// The final, enriched type for a player in the rankings table.
export type RankedPlayer = PlayerForRanking & { totalPoints: number };


interface RankingsTableRowProps {
  player: RankedPlayer;
  rank: number;
  isCurrentUser: boolean;
}

export function RankingsTableRow({ player, rank, isCurrentUser }: RankingsTableRowProps) {
  if (!player.perfil) return null;

  return (
    <TableRow 
        key={player.id_usuario} 
        className={cn(isCurrentUser && 'bg-primary/10 font-bold text-primary-foreground')}
    >
        <TableCell className="text-center">{rank}</TableCell>
        <TableCell>
            {player.usuario}
            {player.familia && <span className="ml-1 text-muted-foreground">{`[${player.familia.tag}]`}</span>}
        </TableCell>
        <TableCell className="text-right hidden md:table-cell">
            {player.perfil.puntos_entrenamiento.toLocaleString('es-ES')}
        </TableCell>
        <TableCell className="text-right hidden md:table-cell">
            {player.perfil.puntos_edificios.toLocaleString('es-ES')}
        </TableCell>
        <TableCell className="text-right hidden md:table-cell">
            {player.perfil.puntos_tropas.toLocaleString('es-ES')}
        </TableCell>
        <TableCell className="text-right">
            {player.totalPoints.toLocaleString('es-ES')}
        </TableCell>
        <TableCell className="text-right hidden sm:table-cell">
            {player._count.propiedades}
        </TableCell>
    </TableRow>
  );
}
