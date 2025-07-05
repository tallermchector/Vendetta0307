
import { Card, CardContent } from "@/components/ui/card";
import { protectPage } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RankingsHeader } from "@/components/rankings/RankingsHeader";
import { RankingsTable } from "@/components/rankings/RankingsTable";
import type { RankedPlayer } from "@/components/rankings/RankingsTableRow";

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

    const rankedPlayers: RankedPlayer[] = playersWithProfiles
        .map(player => {
            const perfil = player.perfil;
            if (!perfil) return null;

            const totalPoints =
                (Number(perfil.puntos_edificios) ?? 0) +
                (Number(perfil.puntos_entrenamiento) ?? 0) +
                (Number(perfil.puntos_tropas) ?? 0);

            return {
                ...player,
                totalPoints,
            };
        })
        .filter(Boolean as any as (player: RankedPlayer | null) => player is RankedPlayer)
        .sort((a, b) => b.totalPoints - a.totalPoints);

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <RankingsHeader />
                <CardContent className="p-0 md:p-6 md:pt-0">
                    <RankingsTable rankedPlayers={rankedPlayers} currentUser={currentUser} />
                </CardContent>
            </Card>
        </div>
    );
}
