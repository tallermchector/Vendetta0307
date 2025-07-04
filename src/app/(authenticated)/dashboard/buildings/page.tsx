import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { protectPage } from "@/lib/auth";
import { BuildingGrid } from "@/components/buildings/BuildingGrid";
import { Building } from "lucide-react";

export default async function BuildingsPage() {
  const user = await protectPage();

  const buildingCatalog = await prisma.building.findMany({
    orderBy: {
      id_edificio: 'asc'
    }
  });
  
  const playerProperty = user.propiedades?.[0];

  if (!playerProperty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Propiedades</CardTitle>
          <CardDescription>
            No se ha encontrado ninguna propiedad para mostrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga al menos una propiedad en la base de datos.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Vista de Edificios</CardTitle>
              <CardDescription>
                Un resumen visual de todos los edificios en tu propiedad: {playerProperty.nombre}.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <BuildingGrid buildingCatalog={buildingCatalog} playerProperty={playerProperty} />
        </CardContent>
      </Card>
    </div>
  );
}
