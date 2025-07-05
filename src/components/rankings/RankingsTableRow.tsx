import { TableCell, TableRow } from '@/components/ui/table';
import type { RankedPlayer } from '@/lib/types';
import { cn } from "@/lib/utils";

interface RankingsTableRowProps {
  player: RankedPlayer;
  isCurrentUser: boolean;
}

export function RankingsTableRow({ player, isCurrentUser }: RankingsTableRowProps) {
  // player.perfil is guaranteed to exist due to the filtering in the parent page.
  const perfil = player.perfil!;

  return (
    <TableRow 
        key={player.id_usuario} 
        className={cn(isCurrentUser && 'bg-primary/10 font-bold text-primary-foreground')}
    >
        <TableCell className="text-center">{player.rank}</TableCell>
        <TableCell className="font-medium">
            {player.usuario}
            {player.familia && <span className="ml-1 text-muted-foreground">{`[${player.familia.tag}]`}</span>}
        </TableCell>
        <TableCell className="text-right hidden md:table-cell">{perfil.puntos_entrenamiento.toLocaleString('es-ES')}</TableCell>
        <TableCell className="text-right hidden md:table-cell">{perfil.puntos_edificios.toLocaleString('es-ES')}</TableCell>
        <TableCell className="text-right hidden md:table-cell">{perfil.puntos_tropas.toLocaleString('es-ES')}</TableCell>
        <TableCell className="text-right">{player.totalPoints.toLocaleString('es-ES')}</TableCell>
        <TableCell className="text-right hidden sm:table-cell">{player._count.propiedades}</TableCell>
    </TableRow>
  );
};
