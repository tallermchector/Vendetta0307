import { Card } from "@/components/ui/card";
import type { PlayerProfile, Propiedad } from "@prisma/client";
import type { Serialized } from "@/lib/serialize";

// The PlayerProfile prop is of a serialized type because it's passed from a
// Server Component to this component, and its BigInt fields need to be
// converted to strings to avoid runtime errors.
interface StatsBarProps {
  playerProfile: Serialized<PlayerProfile> | null;
  properties: Propiedad[] | undefined;
}

export function StatsBar({ playerProfile, properties }: StatsBarProps) {
  // @Fix: The "Edificios" stat should reflect the total number of properties
  // a player owns, not the sum of building levels.
  const propertyCount = properties?.length ?? 0;

  return (
    <Card className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Entrenamiento)</p>
          <p className="text-lg font-bold">
            {Number(playerProfile?.puntos_entrenamiento || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Edificios)</p>
          <p className="text-lg font-bold">
            {Number(playerProfile?.puntos_edificios || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Puntos (Tropas)</p>
          <p className="text-lg font-bold">
            {Number(playerProfile?.puntos_tropas || 0).toLocaleString()}
          </p>
        </div>
        <div className="md:border-r md:border-border md:pr-4">
          <p className="text-xs text-muted-foreground">Edificios</p>
          <p className="text-lg font-bold">{propertyCount}</p>
        </div>
        <div className="col-span-2 md:col-span-1 border-t-2 border-border pt-4 mt-4 md:border-t-0 md:border-l-2 md:pt-0 md:mt-0 md:pl-4">
          <p className="text-xs text-muted-foreground">Lealtad</p>
          <p className="text-lg font-bold">{playerProfile?.lealtad || 100}%</p>
        </div>
      </div>
    </Card>
  );
}
