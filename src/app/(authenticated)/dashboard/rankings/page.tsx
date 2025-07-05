
import { Card, CardContent } from "@/components/ui/card";
import { protectPage } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RankingsHeader } from "@/components/rankings/RankingsHeader";
import { RankingsTable } from "@/components/rankings/RankingsTable";
import type { RankedPlayer } from "@/lib/types"; // Importar el tipo corregido

export default async function RankingsPage() {
    const currentUser = await protectPage();

    // 1. Usa una consulta completa para obtener todos los datos necesarios.
    const playersWithProfiles = await prisma.user.findMany({
        include: {
            perfil: true,
            familia: true,
            _count: { select: { propiedades: true } },
        },
    });

    // 2. Mapea y FILTRA para crear un array base sin nulos.
    let baseRankedPlayers: Omit<RankedPlayer, 'rank'>[] = playersWithProfiles
        .map(player => {
            if (!player.perfil) {
                return null;
            }
            const totalPoints =
                Number(player.perfil.puntos_edificios) +
                Number(player.perfil.puntos_tropas) +
                Number(player.perfil.puntos_entrenamiento);

            return { ...player, totalPoints };
        })
        .filter((player): player is Omit<RankedPlayer, 'rank'> => player !== null);

    // 3. Ordena el array ya filtrado.
    const sortedPlayers = baseRankedPlayers.sort((a, b) => b.totalPoints - a.totalPoints);
    
    // 4. Mapea una última vez para añadir el rango.
    const finalRankedPlayers: RankedPlayer[] = sortedPlayers.map((player, index) => ({
        ...player,
        rank: index + 1,
    }));


    return (
        <div className="flex flex-col gap-6">
            <Card>
                <RankingsHeader />
                <CardContent className="p-0 md:p-6 md:pt-0">
                    <RankingsTable rankedPlayers={finalRankedPlayers} currentUser={currentUser} />
                </CardContent>
            </Card>
        </div>
    );
}
