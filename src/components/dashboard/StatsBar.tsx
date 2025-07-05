import { Card } from "@/components/ui/card";
import type { PlayerProfile, Propiedad } from "@prisma/client";

// Este mapa vincula los nombres de los edificios de la base de datos
// con los campos correspondientes en el modelo `Propiedad` de Prisma.
const buildingFieldMap: Record<string, keyof Propiedad> = {
    'Oficina del Jefe': 'oficina',
    'Escuela de especialización': 'escuela',
    'Armería': 'armeria',
    'Almacén de munición': 'municion',
    'Cervecería': 'cerveceria',
    'Taberna': 'taberna',
    'Contrabando': 'contrabando',
    'Almacén de armas': 'almacenArm',
    'Depósito de munición': 'deposito',
    'Almacén de alcohol': 'almacenAlc',
    'Caja fuerte': 'caja',
    'Campo de entrenamiento': 'campo',
    'Seguridad': 'seguridad',
    'Torreta de fuego automático': 'torreta',
    'Minas ocultas': 'minas',
};

interface StatsBarProps {
  playerProfile: PlayerProfile | null;
  properties: Propiedad[] | undefined;
}

export function StatsBar({ playerProfile, properties }: StatsBarProps) {
  // Calculamos el total de niveles de edificios sumando los niveles
  // de todos los edificios en todas las propiedades del jugador.
  const totalBuildingLevels = properties
    ? properties.reduce((totalSum, property) => {
        const propertySum = Object.values(buildingFieldMap).reduce((sum, field) => {
            const level = property[field] as number;
            return sum + (level || 0);
        }, 0);
        return totalSum + propertySum;
    }, 0)
    : 0;

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Entrenamiento)</p>
          <p className="text-lg font-bold">
            {(playerProfile?.puntos_entrenamiento || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Edificios)</p>
          <p className="text-lg font-bold">
            {(playerProfile?.puntos_edificios || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Tropas)</p>
          <p className="text-lg font-bold">
            {(playerProfile?.puntos_tropas || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Edificios</p>
          <p className="text-lg font-bold">{totalBuildingLevels}</p>
        </div>
        <div className="col-span-2 md:col-span-1 border-t-2 border-border pt-4 mt-4 md:border-t-0 md:border-l-2 md:pt-0 md:mt-0 md:pl-4">
          <p className="text-xs text-muted-foreground">Lealtad</p>
          <p className="text-lg font-bold">{playerProfile?.lealtad || 100}%</p>
        </div>
      </div>
    </Card>
  );
}
