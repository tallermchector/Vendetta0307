import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { FileText, Mail, Move, Swords, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { protectPage } from "@/lib/auth";
import { StatsBar } from "@/components/dashboard/StatsBar";

function StatBadge({
  count,
  Icon,
  className,
}: {
  count: number;
  Icon: React.ElementType;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 items-center justify-center rounded-md border border-primary/50 bg-background transition-colors hover:bg-primary/10",
        className
      )}
    >
      <Icon className="h-5 w-5 text-primary" />
      <div className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
        {count}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const user = await protectPage();

  const playerProfile = user.perfil;
  const family = user.familia;
  // Tomamos solo la primera propiedad para la vista general
  const property = user.propiedades?.[0]; 

  return (
    <div className="flex flex-col gap-6">
      {/* Player Info & Actions Section */}
      <section className="relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Col 1: Player */}
            <Card className="flex items-center p-4">
              <Avatar className="h-16 w-16 border-2 border-primary">
                <AvatarImage src="https://placehold.co/128x128.png" data-ai-hint="mafia boss" alt="Avatar del jugador" />
                <AvatarFallback>
                  <User className="h-8 w-8" />
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
        
        {/* Action Icons - Positioned absolutely on top of the grid */}
        <div className="absolute top-4 right-4 hidden md:flex flex-col gap-3">
          <StatBadge Icon={Mail} count={5} />
          <StatBadge Icon={FileText} count={12} />
          <StatBadge Icon={Swords} count={2} />
          <StatBadge Icon={Move} count={1} />
        </div>
      </section>

      {/* Content Sections */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Misiones</p>
                        <p className="text-sm text-muted-foreground">3 misiones activas</p>
                    </div>
                    <Button variant="outline" size="sm">Ver misiones</Button>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Construcción</p>
                        <p className="text-sm text-muted-foreground">2 edificios en cola</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Mostrar todo</Link>
                    </Button>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Reclutamiento</p>
                        <p className="text-sm text-muted-foreground">5 unidades en cola</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Mostrar todo</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-green-400">ÓPTIMA</p>
                    <p className="text-sm text-muted-foreground">Tus defensas están al máximo.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Entrenamiento</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">3/5 Unidades</p>
                    <p className="text-sm text-muted-foreground">Entrenando sicarios...</p>
                </CardContent>
            </Card>
        </div>
      </section>
      
      {/* Bottom Stats Bar */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <StatsBar playerProfile={playerProfile} properties={user.propiedades} />
      </section>
    </div>
  );
}
