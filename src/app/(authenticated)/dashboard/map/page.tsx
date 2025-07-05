import { protectPage } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { MapGrid } from '@/components/map/MapGrid';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Map as MapIcon, ArrowLeft, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { safeSerialize } from '@/lib/serialize';

// Helper function to safely parse and clamp numeric search parameters.
function getClampedCoordinate(
  param: string | string[] | undefined,
  defaultValue: number,
  min: number,
  max: number
): number {
  const valueStr = Array.isArray(param) ? param[0] : param;
  if (valueStr && !isNaN(Number(valueStr))) {
    const parsed = Number(valueStr);
    return Math.max(min, Math.min(parsed, max));
  }
  return defaultValue;
}


// @Workaround: Set searchParams to `any` to bypass a persistent and unusual
// type error in the Netlify build environment. The component's logic correctly
// handles the possible structures of searchParams.
export default async function MapPage({
  searchParams,
}: {
  searchParams: any;
}) {
  const user = await protectPage();
  const serializedUser = safeSerialize(user);

  const userProperty = user.propiedades?.[0];

  // Parse and clamp all coordinates from searchParams, with fallbacks to the user's property or defaults.
  const currentX = getClampedCoordinate(searchParams?.x, userProperty?.coord_x ?? 25, 1, 50);
  const currentY = getClampedCoordinate(searchParams?.y, userProperty?.coord_y ?? 25, 1, 50);
  const currentSector = getClampedCoordinate(searchParams?.sector, userProperty?.coord_z ?? 1, 1, 255);

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

  const baseHref = (x: number, y: number, z: number) => `/dashboard/map?x=${x}&y=${y}&sector=${z}`;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <MapIcon className="h-6 w-6" />
            <div>
              <CardTitle>Navegación del Mapa</CardTitle>
              <CardDescription>
                Explorando Sector {currentSector}, Coordenadas [{currentX}:{currentY}]. Usa los controles para moverte.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Navigation Controls */}
          <form action="/dashboard/map" method="GET" className="space-y-4 mb-4 p-4 rounded-md border bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              {/* X Coordinate Navigation */}
              <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="coord-x" className="font-semibold">Coordenada X</Label>
                  <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" disabled={currentX <= 1} className="px-2">
                          <Link href={baseHref(currentX - 1, currentY, currentSector)}>
                              <ArrowLeft className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Input
                          id="coord-x"
                          type="number"
                          name="x"
                          defaultValue={currentX}
                          className="w-20 h-9 text-center"
                          min="1"
                          max="50"
                      />
                      <Button asChild variant="outline" size="sm" disabled={currentX >= 50} className="px-2">
                          <Link href={baseHref(currentX + 1, currentY, currentSector)}>
                              <ArrowRight className="h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
              </div>

              {/* Y Coordinate Navigation */}
              <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="coord-y" className="font-semibold">Coordenada Y</Label>
                  <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" disabled={currentY <= 1} className="px-2">
                          <Link href={baseHref(currentX, currentY - 1, currentSector)}>
                              <ArrowLeft className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Input
                          id="coord-y"
                          type="number"
                          name="y"
                          defaultValue={currentY}
                          className="w-20 h-9 text-center"
                          min="1"
                          max="50"
                      />
                      <Button asChild variant="outline" size="sm" disabled={currentY >= 50} className="px-2">
                          <Link href={baseHref(currentX, currentY + 1, currentSector)}>
                              <ArrowRight className="h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
              </div>

              {/* Z (Sector) Coordinate Navigation */}
              <div className="flex flex-col items-center gap-2">
                  <Label htmlFor="coord-z" className="font-semibold">Sector Z</Label>
                  <div className="flex items-center gap-2">
                      <Button asChild variant="outline" size="sm" disabled={currentSector <= 1} className="px-2">
                          <Link href={baseHref(currentX, currentY, currentSector - 1)}>
                              <ArrowLeft className="h-4 w-4" />
                          </Link>
                      </Button>
                      <Input
                          id="coord-z"
                          type="number"
                          name="sector"
                          defaultValue={currentSector}
                          className="w-20 h-9 text-center"
                          min="1"
                          max="255"
                      />
                      <Button asChild variant="outline" size="sm" disabled={currentSector >= 255} className="px-2">
                          <Link href={baseHref(currentX, currentY, currentSector + 1)}>
                              <ArrowRight className="h-4 w-4" />
                          </Link>
                      </Button>
                  </div>
              </div>
            </div>
            {/* Central "Ir" button */}
            <div className="flex justify-center pt-2">
                <Button type="submit">Ir a Coordenadas</Button>
            </div>
          </form>

          {/* Map Grid */}
          <div className="mt-4 w-full">
            <MapGrid 
                properties={validProperties} 
                currentUser={serializedUser} 
                currentSector={currentSector}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
