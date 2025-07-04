import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Swords, Shell, Martini, DollarSign, Shield } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import type { PlayerRecruitment } from "@prisma/client";
import { protectPage } from "@/lib/auth";
import { recruitUnit } from "@/actions/recruitment";

// Helper component to display a single resource cost for Desktop
function ResourceCost({ icon: Icon, value, label }: { icon: React.ElementType, value: number, label: string }) {
  if (value === 0) return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={label}>
      <Icon className="h-3.5 w-3.5 text-primary/80" />
      <span>{value.toLocaleString()}</span>
    </div>
  );
}

// Helper component for mobile resource costs
function MobileResourceCost({ icon: Icon, value }: { icon: React.ElementType, value: number }) {
  if (value === 0) return null;
  return (
    <div className="flex items-center gap-1">
      <Icon className="h-3 w-3 text-destructive" />
      <span>{value.toLocaleString()}</span>
    </div>
  );
}

export default async function RecruitmentPage() {
  const user = await protectPage();

  const recruitmentCatalog = await prisma.recruitment.findMany({
    orderBy: {
      id_recruitment: 'asc'
    }
  });
  
  const playerProfile = user.perfil;

  if (!playerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Perfil de Jugador</CardTitle>
          <CardDescription>No se ha encontrado un perfil para este jugador.</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga un perfil de jugador creado.</p>
        </CardContent>
      </Card>
    )
  }
  
  const playerRecruitmentsMap = new Map<number, PlayerRecruitment>();
  if (playerProfile.recruitments) {
      for (const pr of playerProfile.recruitments) {
          playerRecruitmentsMap.set(pr.id_recruitment, pr);
      }
  }

  async function handleRecruit(formData: FormData) {
    "use server";

    const id_recruitment = Number(formData.get('id_recruitment'));
    const quantity = Number(formData.get('quantity'));

    if (isNaN(id_recruitment) || isNaN(quantity) || quantity <= 0) {
      console.error("Invalid form data for recruitment");
      return;
    }
    
    const result = await recruitUnit({ id_recruitment, quantity });
    
    if (result?.error) {
        console.error(`Error de reclutamiento: ${result.error}`);
    }

    if (result?.success) {
        console.log(`Éxito: ${result.success}`);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <UserPlus className="h-6 w-6" />
            <div>
              <CardTitle>Centro de Reclutamiento</CardTitle>
              <CardDescription>
                Recluta unidades para fortalecer tu imperio y defender tus intereses.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 md:p-6 md:pt-0">
          {/* Desktop View */}
          <div className="relative hidden w-full overflow-auto md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidad</TableHead>
                  <TableHead className="hidden md:table-cell">Descripción</TableHead>
                  <TableHead>Estadísticas</TableHead>
                  <TableHead>Costo</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead className="text-right w-[200px]">Reclutar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruitmentCatalog.map((unit, index) => {
                  const playerUnit = playerRecruitmentsMap.get(unit.id_recruitment);
                  const currentQuantity = playerUnit ? playerUnit.quantity : 0;
                  
                  return (
                    <TableRow 
                      key={unit.id_recruitment}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms`}}
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Image
                              src={unit.imagen_url.startsWith('/') ? unit.imagen_url : 'https://placehold.co/80x80.png'}
                              data-ai-hint="mafia soldier"
                              alt={`Icono de ${unit.nombre}`}
                              width={64}
                              height={64}
                              className="rounded-md object-cover border hidden sm:block"
                          />
                          <div className="font-medium text-base">{unit.nombre}</div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-xs max-w-xs">
                        {unit.descripcion}
                      </TableCell>
                      <TableCell>
                          <div className="flex flex-col gap-1.5 text-xs">
                            <div className="flex items-center gap-2" title="Ataque">
                                  <Swords className="h-3.5 w-3.5 text-destructive" />
                                  <span>{unit.ata.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2" title="Defensa">
                                  <Shield className="h-3.5 w-3.5 text-blue-400" />
                                  <span>{unit.def.toLocaleString()}</span>
                            </div>
                          </div>
                      </TableCell>
                      <TableCell>
                          <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                              <ResourceCost icon={Swords} value={unit.c_armas} label="Armas" />
                              <ResourceCost icon={Shell} value={unit.c_municion} label="Munición" />
                              <ResourceCost icon={Martini} value={unit.c_alcohol} label="Alcohol" />
                              <ResourceCost icon={DollarSign} value={unit.c_dolares} label="Dólares" />
                          </div>
                      </TableCell>
                      <TableCell>
                          <div className="font-bold text-lg">{currentQuantity}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={handleRecruit} className="flex items-center gap-2 justify-end">
                          <input type="hidden" name="id_recruitment" value={unit.id_recruitment} />
                          <Input
                            type="number"
                            name="quantity"
                            min="1"
                            placeholder="Cant."
                            className="w-20 h-9"
                            required
                          />
                          <Button type="submit" size="sm">
                            <UserPlus className="mr-2 h-4 w-4" />
                            Reclutar
                          </Button>
                        </form>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* Mobile View */}
          <div className="divide-y divide-border md:hidden">
            {recruitmentCatalog.map((unit, index) => {
              const playerUnit = playerRecruitmentsMap.get(unit.id_recruitment);
              const currentQuantity = playerUnit ? playerUnit.quantity : 0;
              return (
                <div key={unit.id_recruitment} className="p-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <p className="font-bold text-base">{unit.nombre}</p>
                      <p className="text-sm text-muted-foreground">Tienes: {currentQuantity}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 text-xs">
                        <div className="flex items-center gap-2" title="Ataque">
                            <Swords className="h-3.5 w-3.5 text-destructive" />
                            <span>{unit.ata.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-2" title="Defensa">
                            <Shield className="h-3.5 w-3.5 text-blue-400" />
                            <span>{unit.def.toLocaleString()}</span>
                        </div>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                      <p className="text-xs font-semibold text-muted-foreground">Costo por unidad:</p>
                      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <MobileResourceCost icon={Swords} value={unit.c_armas} />
                        <MobileResourceCost icon={Shell} value={unit.c_municion} />
                        <MobileResourceCost icon={Martini} value={unit.c_alcohol} />
                        <MobileResourceCost icon={DollarSign} value={unit.c_dolares} />
                      </div>
                  </div>

                  <form action={handleRecruit} className="mt-4 flex items-center gap-2">
                    <input type="hidden" name="id_recruitment" value={unit.id_recruitment} />
                    <Input
                      type="number"
                      name="quantity"
                      min="1"
                      placeholder="Cant."
                      className="w-24 h-9"
                      required
                    />
                    <Button type="submit" size="sm" className="flex-grow">
                      <UserPlus className="mr-2 h-4 w-4" />
                      Reclutar
                    </Button>
                  </form>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}