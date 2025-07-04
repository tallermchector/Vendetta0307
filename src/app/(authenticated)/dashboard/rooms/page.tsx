
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { protectPage } from "@/lib/auth";
import { RoomsHeader } from "@/components/rooms/RoomsHeader";
import { RoomsTable } from "@/components/rooms/RoomsTable";

export default async function RoomsPage() {
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
        <RoomsHeader propertyName={playerProperty.nombre} />
        <CardContent className="p-0 md:p-6 md:pt-0">
          <RoomsTable buildingCatalog={buildingCatalog} playerProperty={playerProperty} />
        </CardContent>
      </Card>
    </div>
  );
}
