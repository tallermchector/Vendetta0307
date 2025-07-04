
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
import { Separator } from "@/components/ui/separator";
import { Target, ArrowUpCircle, Clock } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import type { PlayerTraining } from "@prisma/client";
import { protectPage } from "@/lib/auth";

// Helper function to format seconds into a readable string (e.g., 1h 30m 15s)
function formatDuration(totalSeconds: number): string {
  if (totalSeconds <= 0) return "0s";

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}

// Helper component to display a single resource cost for Desktop
function ResourceCost({ type, value, label }: { type: 'armas' | 'municion' | 'alcohol' | 'dolares', value: number, label: string }) {
  if (value === 0) return null;
  
  const iconMap = {
      armas: '/img/recursos/armas.svg',
      municion: '/img/recursos/municion.svg',
      alcohol: '/img/recursos/alcohol.svg',
      dolares: '/img/recursos/dolares.svg'
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={label}>
      <Image src={iconMap[type]} alt={label} width={14} height={14} className="h-3.5 w-3.5" />
      <span>{value.toLocaleString()}</span>
    </div>
  );
}

// Helper component for mobile resource costs
function MobileResourceCost({ type, value, label }: { type: 'armas' | 'municion' | 'alcohol' | 'dolares', value: number, label: string }) {
  if (value === 0) return null;
    
  const iconMap = {
      armas: '/img/recursos/armas.svg',
      municion: '/img/recursos/municion.svg',
      alcohol: '/img/recursos/alcohol.svg',
      dolares: '/img/recursos/dolares.svg'
  };

  return (
    <div className="flex items-center gap-1" title={label}>
      <Image src={iconMap[type]} alt={label} width={12} height={12} className="h-3 w-3 text-destructive" />
      <span>{value.toLocaleString()}</span>
    </div>
  );
}

export default async function TrainingPage() {
  const user = await protectPage();

  const trainingCatalog = await prisma.training.findMany({
    orderBy: {
      id_training: 'asc'
    }
  });
  
  const playerProfile = user.perfil;

  if (!playerProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Perfil de Jugador</CardTitle>
          <CardDescription>
            No se ha encontrado un perfil para este jugador.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga un perfil de jugador creado.</p>
        </CardContent>
      </Card>
    )
  }
  
  // @Refactor: Create a Map for efficient lookup of training levels.
  const playerTrainingsMap = new Map<number, PlayerTraining>();
  if (playerProfile.trainings) {
      for (const pt of playerProfile.trainings) {
          playerTrainingsMap.set(pt.id_training, pt);
      }
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Target className="h-6 w-6" />
            <div>
              <CardTitle>Centro de Entrenamiento</CardTitle>
              <CardDescription>
                Mejora las habilidades de tus unidades para dominar el campo de batalla.
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
                  <TableHead className="w-[100px] hidden sm:table-cell">Icono</TableHead>
                  <TableHead>Entrenamiento y Nivel</TableHead>
                  <TableHead className="hidden lg:table-cell">Descripción</TableHead>
                  <TableHead className="w-[180px]">Costo de Mejora</TableHead>
                  <TableHead className="text-right w-[120px]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainingCatalog.map((training, index) => {
                  const playerTraining = playerTrainingsMap.get(training.id_training);
                  const level = playerTraining ? playerTraining.level : 0;
                  const nextLevel = level + 1;

                  const costFactor = Math.pow(training.fac_costo, level);
                  const costArmas = Math.floor(training.c_armas * costFactor);
                  const costMunicion = Math.floor(training.c_municion * costFactor);
                  const costAlcohol = Math.floor(training.c_alcohol * costFactor);
                  const costDolares = Math.floor(training.c_dolares * costFactor);

                  const baseDurationSeconds = (parseInt(training.t_horas) * 3600) + (parseInt(training.t_minutos) * 60) + parseInt(training.t_segundos);
                  const durationFactor = Math.pow(training.fac_dura, level);
                  const nextDurationSeconds = Math.floor(baseDurationSeconds * durationFactor);
                  
                  return (
                    <TableRow 
                      key={training.id_training}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms`}}
                    >
                      <TableCell className="hidden sm:table-cell">
                        <Image
                          src={training.imagen_url.startsWith('/') ? training.imagen_url : 'https://placehold.co/80x80.png'}
                          data-ai-hint="training skill icon"
                          alt={`Icono de ${training.nombre}`}
                          width={80}
                          height={80}
                          className="rounded-md object-cover border"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-base">{training.nombre}</div>
                        <div className="text-sm font-bold text-primary">Nivel {level}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-muted-foreground text-xs">
                        {training.descripcion}
                      </TableCell>
                      <TableCell>
                          <div className="flex flex-col gap-1.5">
                              <div className="font-semibold text-xs text-foreground">Al Nivel {nextLevel}:</div>
                              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                                  <ResourceCost type="armas" value={costArmas} label="Armas" />
                                  <ResourceCost type="municion" value={costMunicion} label="Munición" />
                                  <ResourceCost type="alcohol" value={costAlcohol} label="Alcohol" />
                                  <ResourceCost type="dolares" value={costDolares} label="Dólares" />
                              </div>
                              <Separator className="my-1 bg-border/60" />
                              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{formatDuration(nextDurationSeconds)}</span>
                              </div>
                          </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm">
                          <ArrowUpCircle className="mr-2 h-4 w-4" />
                          Mejorar
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
          
          {/* Mobile View */}
          <div className="divide-y divide-border md:hidden">
             {trainingCatalog.map((training, index) => {
                  const playerTraining = playerTrainingsMap.get(training.id_training);
                  const level = playerTraining ? playerTraining.level : 0;
                  const nextLevel = level + 1;

                  const costFactor = Math.pow(training.fac_costo, level);
                  const costArmas = Math.floor(training.c_armas * costFactor);
                  const costMunicion = Math.floor(training.c_municion * costFactor);
                  const costAlcohol = Math.floor(training.c_alcohol * costFactor);
                  const costDolares = Math.floor(training.c_dolares * costFactor);

                  const baseDurationSeconds = (parseInt(training.t_horas) * 3600) + (parseInt(training.t_minutos) * 60) + parseInt(training.t_segundos);
                  const durationFactor = Math.pow(training.fac_dura, level);
                  const nextDurationSeconds = Math.floor(baseDurationSeconds * durationFactor);
              
              return (
                <div key={training.id_training} className="grid grid-cols-[1fr_auto] items-start gap-4 p-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                  {/* Left Column */}
                  <div>
                    <p className="font-bold text-base">{training.nombre}</p>
                    <p className="text-sm font-bold text-primary">Nivel {level}</p>
                  </div>

                  {/* Right Column */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="text-right">
                      <p className="text-xs font-semibold text-muted-foreground">Al Nivel {nextLevel}:</p>
                      <div className="mt-1 flex flex-wrap justify-end gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <MobileResourceCost type="armas" value={costArmas} label="Armas" />
                        <MobileResourceCost type="municion" value={costMunicion} label="Munición" />
                        <MobileResourceCost type="alcohol" value={costAlcohol} label="Alcohol" />
                        <MobileResourceCost type="dolares" value={costDolares} label="Dólares" />
                      </div>
                      <div className="mt-2 flex items-center justify-end gap-1.5 text-xs font-semibold text-muted-foreground">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatDuration(nextDurationSeconds)}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      <ArrowUpCircle className="mr-2 h-4 w-4" />
                      Mejorar
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
