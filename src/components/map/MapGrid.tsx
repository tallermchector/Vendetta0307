'use client';

import { useMemo } from 'react';
import type { Propiedad, User } from '@prisma/client';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Home, User as UserIcon } from 'lucide-react';

// Define the type for properties with the included user data
type PropertyWithUser = Propiedad & {
  usuario: {
    id_usuario: number;
    usuario: string;
  } | null;
};

// Define the type for the current user, omitting the password hash
type CurrentUser = Omit<User, 'pass'>;


interface MapGridProps {
  properties: PropertyWithUser[];
  currentUser: CurrentUser;
  currentSector: number;
}

const MAP_SIZE = 50; // As per the schema (1-50)

export function MapGrid({ properties, currentUser, currentSector }: MapGridProps) {
  // Memoize the properties map for efficient lookups
  const propertiesMap = useMemo(() => {
    const map = new Map<string, PropertyWithUser>();
    properties.forEach((prop) => {
      map.set(`${prop.coord_x}-${prop.coord_y}`, prop);
    });
    return map;
  }, [properties]);

  const cells = [];
  for (let y = 1; y <= MAP_SIZE; y++) {
    for (let x = 1; x <= MAP_SIZE; x++) {
      const property = propertiesMap.get(`${x}-${y}`);
      const cellKey = `${x}-${y}`;
      const isCurrentUserProperty = property?.id_usuario === currentUser.id_usuario;

      cells.push(
        <Tooltip key={cellKey}>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'flex aspect-square items-center justify-center border border-dashed border-white/10 transition-colors',
                 isCurrentUserProperty
                  ? 'bg-green-500/50 hover:bg-green-500/70 cursor-pointer ring-2 ring-green-400'
                  : property
                  ? 'bg-primary/50 hover:bg-primary/70 cursor-pointer'
                  : 'bg-muted/20 hover:bg-muted/40' 
              )}
            >
              {property && <Home className="h-2/5 w-2/5 text-primary-foreground" />}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <div className="flex flex-col gap-1 p-1">
              <p className="font-bold">Coordenadas: [{x}:{y}:{property?.coord_z ?? currentSector}]</p>
              {property && property.usuario ? (
                <>
                  <p className="text-sm">
                    <UserIcon className="inline-block h-4 w-4 mr-1" />
                    Propietario: <span className="font-semibold">{property.usuario.usuario}</span>
                  </p>
                  <p className="text-sm">
                    <Home className="inline-block h-4 w-4 mr-1" />
                    Propiedad: <span className="font-semibold">{property.nombre}</span>
                  </p>
                </>
              ) : (
                <p className="text-sm text-muted-foreground">Este solar está libre.</p>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    }
  }

  return (
    <TooltipProvider>
      <div 
        className="grid bg-background rounded-md border"
        style={{ gridTemplateColumns: `repeat(${MAP_SIZE}, minmax(0, 1fr))` }}
      >
        {cells}
      </div>
    </TooltipProvider>
  );
}
