
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import type { PlayerRecruitment } from "@prisma/client";
import { protectPage } from "@/lib/auth";
import { RecruitmentHeader } from "@/components/recruitment/RecruitmentHeader";
import { RecruitmentTable } from "@/components/recruitment/RecruitmentTable";

export default async function RecruitmentPage() {
  const user = await protectPage();

  const recruitmentCatalog = await prisma.recruitment.findMany({
    orderBy: {
      id_recruitment: 'asc'
    }
  });
  
  const playerProfile = user.perfil;

  if (!playerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Perfil de Jugador</CardTitle>
          <CardDescription>No se ha encontrado un perfil para este jugador.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga un perfil de jugador creado.</p>
        </CardContent>
      </Card>
    )
  }
  
  const playerRecruitmentsMap = new Map<number, PlayerRecruitment>();
  if (playerProfile.recruitments) {
      for (const pr of playerProfile.recruitments) {
          playerRecruitmentsMap.set(pr.id_recruitment, pr);
      }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <RecruitmentHeader />
        <CardContent className="p-0 md:p-6 md:pt-0">
            <RecruitmentTable 
                recruitmentCatalog={recruitmentCatalog} 
                playerRecruitmentsMap={playerRecruitmentsMap} 
            />
        </CardContent>
      </Card>
    </div>
  );
}
