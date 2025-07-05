
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { RankingsTableRow, type RankedPlayer } from "./RankingsTableRow";
import type { AuthenticatedUser } from "@/lib/auth";

interface RankingsTableProps {
  rankedPlayers: RankedPlayer[];
  currentUser: AuthenticatedUser;
}

export function RankingsTable({ rankedPlayers, currentUser }: RankingsTableProps) {
  return (
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
              {rankedPlayers.map((player, index) => (
                  <RankingsTableRow 
                      key={player.id_usuario}
                      player={player}
                      rank={index + 1}
                      isCurrentUser={player.id_usuario === currentUser.id_usuario}
                  />
              ))}
          </TableBody>
       </Table>
    </div>
  );
}
