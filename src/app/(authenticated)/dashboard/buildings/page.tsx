
import { protectPage } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { buildingFieldMap } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Landmark, MapPin } from 'lucide-react';
import Image from 'next/image';

// Main component - async function for RSC
export default async function BuildingsReportPage() {
  const user = await protectPage();
  const properties = user.propiedades;
  const buildingCatalog = await prisma.building.findMany({
    orderBy: { id_edificio: 'asc' },
  });

  if (!properties || properties.length === 0) {
    // Handle case with no properties
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Landmark className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Sin Propiedades</CardTitle>
              <CardDescription>Aún no posees ninguna propiedad para mostrar.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Ve al mapa para conquistar nuevos territorios.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-8">
       <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Landmark className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Informe de Activos Inmobiliarios</CardTitle>
              <CardDescription>
                Un resumen consolidado de todos tus edificios y sus niveles en todas tus propiedades.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>

      {properties.map((property) => (
        <Card key={property.id_propiedad}>
          <CardHeader>
            <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5" />
                <div>
                    <CardTitle>{property.nombre}</CardTitle>
                    <CardDescription>Coordenadas: [{property.coord_x}:{property.coord_y}:{property.coord_z}]</CardDescription>
                </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
              {buildingCatalog.map((building) => {
                const buildingKey = buildingFieldMap[building.nombre];
                if (!buildingKey) return null; // Safety check
                const level = property[buildingKey] as number;

                return (
                  <div key={building.id_edificio} className="flex flex-col items-center gap-2 rounded-lg border p-3 text-center transition-all hover:bg-muted/50">
                    <Image
                      src={building.imagen_url.startsWith('/') ? building.imagen_url : 'https://placehold.co/80x80.png'}
                      alt={`Icono de ${building.nombre}`}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                    />
                    <p className="text-xs font-semibold leading-tight">{building.nombre}</p>
                    <p className="text-lg font-bold text-primary">Nivel {level}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
