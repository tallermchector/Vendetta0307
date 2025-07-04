
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { protectPage } from "@/lib/auth";
import { TrainingHeader } from "@/components/training/TrainingHeader";
import { TrainingTable } from "@/components/training/TrainingTable";

export default async function TrainingPage() {
  const user = await protectPage();

  const trainingCatalog = await prisma.training.findMany({
    orderBy: {
      id_training: 'asc'
    }
  });
  
  const playerProfile = user.perfil;

  if (!playerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Perfil de Jugador</CardTitle>
          <CardDescription>
            No se ha encontrado un perfil para este jugador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga un perfil de jugador creado.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <TrainingHeader />
        <CardContent className="p-0 md:p-6 md:pt-0">
          <TrainingTable trainingCatalog={trainingCatalog} playerProfile={playerProfile} />
        </CardContent>
      </Card>
    </div>
  );
}
