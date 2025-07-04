import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Building as BuildingType } from "@prisma/client";

interface BuildingCardProps {
  building: BuildingType;
  level: number;
}

export function BuildingCard({ building, level }: BuildingCardProps) {
  return (
    <Card>
      <CardHeader className="p-0">
        <Image
          src={building.imagen_url.startsWith('/') ? building.imagen_url : 'https://placehold.co/400x300.png'}
          data-ai-hint="mafia building room"
          alt={`Imagen de ${building.nombre}`}
          width={400}
          height={300}
          className="rounded-t-lg object-cover aspect-[4/3]"
        />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg truncate">{building.nombre}</CardTitle>
        <p className="font-bold text-primary">Nivel {level}</p>
      </CardContent>
    </Card>
  );
}
