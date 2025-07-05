import { protectPage } from '@/lib/auth';
import { calculateProductionRates } from '@/lib/production';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Coins } from "lucide-react";
import Image from "next/image";

// Reusable component for displaying a single resource
function ResourceDisplay({
  name,
  icon,
  currentAmount,
  hourlyProduction,
}: {
  name: string;
  icon: string;
  currentAmount: string | number | bigint;
  hourlyProduction: number;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border p-4 transition-all hover:bg-muted/50">
      <div className="flex items-center gap-4">
        <Image src={icon} alt={name} width={40} height={40} />
        <div>
          <p className="text-lg font-bold font-headline">{name}</p>
          <p className="text-sm text-muted-foreground">
            Producción: <span className="font-semibold text-green-400">+{hourlyProduction.toLocaleString()} / hora</span>
          </p>
        </div>
      </div>
      <p className="text-2xl font-bold text-primary">
        {Number(currentAmount).toLocaleString()}
      </p>
    </div>
  );
}

export default async function ResourcesPage() {
  const user = await protectPage();
  const property = user.propiedades?.[0];
  const resources = user.recursos;

  if (!property || !resources) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Datos Incompletos</CardTitle>
          <CardDescription>
            No se han encontrado propiedades o recursos para este jugador.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  const productionRates = calculateProductionRates(property);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Coins className="h-6 w-6" />
            <div>
              <CardTitle>Gestión de Recursos</CardTitle>
              <CardDescription>
                Resumen de tus recursos actuales y producción por hora.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ResourceDisplay
              name="Armas"
              icon="/img/recursos/armas.svg"
              currentAmount={resources.armas}
              hourlyProduction={productionRates.armas}
            />
            <ResourceDisplay
              name="Munición"
              icon="/img/recursos/municion.svg"
              currentAmount={resources.municion}
              hourlyProduction={productionRates.municion}
            />
            <ResourceDisplay
              name="Alcohol"
              icon="/img/recursos/alcohol.svg"
              currentAmount={resources.alcohol}
              hourlyProduction={productionRates.alcohol}
            />
            <ResourceDisplay
              name="Dólares"
              icon="/img/recursos/dolares.svg"
              currentAmount={resources.dolares}
              hourlyProduction={productionRates.dolares}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}