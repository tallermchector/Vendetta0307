import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Shield, Swords, Users } from "lucide-react";
import type { User, PlayerProfile } from "@prisma/client";

type MemberWithProfile = User & { perfil: PlayerProfile | null };

interface FamilyStatsProps {
  members: MemberWithProfile[];
}

export function FamilyStats({ members }: FamilyStatsProps) {
    const totalPoints = members.reduce((sum, member) => {
        if (member.perfil) {
            return sum + (member.perfil.puntos_edificios ?? 0) + (member.perfil.puntos_entrenamiento ?? 0) + (member.perfil.puntos_tropas ?? 0);
        }
        return sum;
    }, 0);
    
    const averagePoints = members.length > 0 ? totalPoints / members.length : 0;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Estadísticas de la Familia</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Miembros</span>
          </div>
          <span className="font-bold text-lg">{members.length}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Swords className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Puntos Totales</span>
          </div>
          <span className="font-bold text-lg">{totalPoints.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <BarChart className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Puntos (Promedio)</span>
          </div>
          <span className="font-bold text-lg">{Math.round(averagePoints).toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between rounded-md bg-muted/50 p-3">
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Ranking</span>
          </div>
          <span className="font-bold text-lg">#1</span>
        </div>
      </CardContent>
    </Card>
  );
}
