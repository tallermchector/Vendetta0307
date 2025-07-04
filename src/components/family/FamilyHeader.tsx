import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, DoorOpen, Settings, Users } from "lucide-react";
import Image from "next/image";
import type { Family } from "@prisma/client";

interface FamilyHeaderProps {
  family: Family;
}

export function FamilyHeader({ family }: FamilyHeaderProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <Image
            src={family.emblema_url || 'https://placehold.co/128x128.png'}
            data-ai-hint="family crest"
            alt={`Emblema de ${family.nombre}`}
            width={100}
            height={100}
            className="rounded-lg border-2 border-primary object-cover"
          />
          <div className="flex-1 text-center sm:text-left">
            <CardTitle className="text-3xl font-headline">
              {family.nombre} [{family.tag}]
            </CardTitle>
            <CardDescription>
              La unión hace la fuerza. Gestiona tu familia y sus miembros.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Crown className="h-5 w-5" aria-label="Liderazgo" />
            </Button>
            <Button variant="outline" size="icon">
              <Settings className="h-5 w-5" aria-label="Configuración" />
            </Button>
            <Button variant="destructive" size="icon">
              <DoorOpen className="h-5 w-5" aria-label="Abandonar familia" />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
