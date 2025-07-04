import type { User, Family, Propiedad } from '@prisma/client';
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";
import Image from "next/image";

type UserForInfo = Omit<User, 'pass'> & {
  familia: Family | null;
  propiedades: Propiedad[];
};

interface PlayerInfoSectionProps {
    user: UserForInfo;
}

export function PlayerInfoSection({ user }: PlayerInfoSectionProps) {
  const family = user.familia;
  const property = user.propiedades?.[0]; 

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {/* Col 1: Player */}
      <Card className="flex items-center p-4">
        <Avatar className="h-16 w-16 border-2 border-primary">
          <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="mafia boss" alt="Avatar del jugador" />
          <AvatarFallback>
            <UserIcon className="h-8 w-8" />
          </AvatarFallback>
        </Avatar>
        <div className="ml-4">
          <p className="text-sm text-muted-foreground">Jugador</p>
          <h2 className="text-2xl font-bold font-headline">{user.usuario}</h2>
        </div>
      </Card>

      {/* Col 2: Overview */}
      <Card className="relative overflow-hidden">
        <Image
          src="https://placehold.co/600x400.png"
          data-ai-hint="dark city building"
          alt="Vista del edificio"
          width={600}
          height={400}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        <div className="absolute bottom-0 left-0 p-4 text-white">
          <p className="text-sm font-semibold">Visión General - {property?.nombre || 'Propiedad'}</p>
          <h2 className="text-2xl font-bold font-headline">{property ? `[${property.coord_x}:${property.coord_y}:${property.coord_z}]` : '[N/A]'}</h2>
        </div>
      </Card>

      {/* Col 3: Family */}
      <Card className="flex flex-col items-center justify-center p-4">
        <div className="relative h-16 w-16">
          <Image
            src={family?.emblema_url || "https://placehold.co/128x128.png"}
            data-ai-hint="family crest"
            alt="Emblema de la familia"
            width={128}
            height={128}
            className="rounded-full object-cover border-2 border-primary"
          />
        </div>
        <div className="mt-2 text-center">
          <p className="text-sm text-muted-foreground">Familia</p>
          <h2 className="text-xl font-bold font-headline">{family?.nombre || 'Sin Familia'}</h2>
        </div>
      </Card>
    </div>
  );
}
