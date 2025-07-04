import { protectPage } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MapGrid } from '@/components/map/MapGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Map as MapIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';

// @BestPractice: Use the standard Next.js page props type for clarity and correctness.
// This ensures compatibility with build environments by defining the props inline.
export default async function MapPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const user = await protectPage();

  const sectorParam = searchParams.sector;

  // Safely get the sector from search params, handling potential arrays.
  const currentSectorParam = Array.isArray(sectorParam)
    ? sectorParam[0]
    : sectorParam;

  let currentSector = 1;
  if (currentSectorParam && !isNaN(Number(currentSectorParam))) {
      const parsedSector = Number(currentSectorParam);
      // Clamp between 1 and 255 based on schema
      currentSector = Math.max(1, Math.min(parsedSector, 255));
  }

  // Fetch all properties in the current sector
  const properties = await prisma.propiedad.findMany({
    where: {
      coord_z: currentSector,
    },
    include: {
      usuario: {
        select: {
          id_usuario: true,
          usuario: true,
        },
      },
    },
  });
  
  // Filter out properties where the user might have been deleted but the property remains
  const validProperties = properties.filter(p => p.usuario !== null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapIcon className="h-6 w-6" />
            <div>
              <CardTitle>Mapa del Sector</CardTitle>
              <CardDescription>
                Explorando el Sector {currentSector}. Pasa el cursor sobre una celda para ver detalles.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Navigation Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-4 p-2 rounded-md border bg-muted/50">
            <Button asChild variant="outline" size="sm" disabled={currentSector <= 1}>
              <Link href={`/dashboard/map?sector=${currentSector - 1}`}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Anterior
              </Link>
            </Button>
            <form action="/dashboard/map" method="GET" className="flex items-center gap-2">
              <Input
                type="number"
                name="sector"
                defaultValue={currentSector}
                className="w-24 h-9 text-center"
                min="1"
                max="255"
                aria-label="Sector"
              />
              <Button type="submit" size="sm">Ir</Button>
            </form>
            <Button asChild variant="outline" size="sm" disabled={currentSector >= 255}>
              <Link href={`/dashboard/map?sector=${currentSector + 1}`}>
                Siguiente <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
          {/* Map Grid */}
          <div className="mt-4 overflow-auto rounded-lg border">
            <MapGrid properties={validProperties} currentUser={user} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
