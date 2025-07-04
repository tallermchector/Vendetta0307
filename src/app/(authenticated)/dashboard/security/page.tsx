
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
import { Swords, Shield, ShieldCheck } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import type { PlayerSecurity } from "@prisma/client";
import { protectPage } from "@/lib/auth";
import { purchaseSecurity } from "@/actions/security";

// Helper component to display a single resource cost for Desktop
function ResourceCost({ type, value, label }: { type: 'armas' | 'municion' | 'alcohol' | 'dolares', value: number | bigint, label: string }) {
  if (value === 0 || value === 0n) return null;
  
  const iconMap = {
      armas: '/img/recursos/armas.svg',
      municion: '/img/recursos/municion.svg',
      alcohol: '/img/recursos/alcohol.svg',
      dolares: '/img/recursos/dolares.svg'
  };

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground" title={label}>
      <Image src={iconMap[type]} alt={label} width={14} height={14} className="h-3.5 w-3.5" />
      <span>{Number(value).toLocaleString()}</span>
    </div>
  );
}

// Helper component for mobile resource costs
function MobileResourceCost({ type, value, label }: { type: 'armas' | 'municion' | 'alcohol' | 'dolares', value: number | bigint, label: string }) {
  if (value === 0 || value === 0n) return null;
    
  const iconMap = {
      armas: '/img/recursos/armas.svg',
      municion: '/img/recursos/municion.svg',
      alcohol: '/img/recursos/alcohol.svg',
      dolares: '/img/recursos/dolares.svg'
  };

  return (
    <div className="flex items-center gap-1" title={label}>
      <Image src={iconMap[type]} alt={label} width={12} height={12} className="h-3 w-3" />
      <span className="text-destructive">{Number(value).toLocaleString()}</span>
    </div>
  );
}

export default async function SecurityPage() {
  const user = await protectPage();

  const securityCatalog = await prisma.security.findMany({
    orderBy: {
      id_security: 'asc'
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
  
  const playerSecuritiesMap = new Map<number, PlayerSecurity>();
  if (playerProfile.securities) {
      for (const ps of playerProfile.securities) {
          playerSecuritiesMap.set(ps.id_security, ps);
      }
  }

  async function handlePurchase(formData: FormData) {
    "use server";

    const id_security = Number(formData.get('id_security'));
    const quantity = Number(formData.get('quantity'));

    if (isNaN(id_security) || isNaN(quantity) || quantity <= 0) {
      console.error("Invalid form data for security purchase");
      return;
    }
    
    const result = await purchaseSecurity({ id_security, quantity });
    
    if (result?.error) {
        console.error(`Error de compra: ${result.error}`);
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
            <ShieldCheck className="h-6 w-6" />
            <div>
              <CardTitle>Centro de Seguridad</CardTitle>
              <CardDescription>
                Refuerza tus defensas para proteger tu propiedad de amenazas.
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
                  <TableHead className="text-right w-[200px]">Adquirir</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {securityCatalog.map((unit, index) => {
                  const playerUnit = playerSecuritiesMap.get(unit.id_security);
                  const currentQuantity = playerUnit ? playerUnit.quantity : 0;
                  
                  return (
                    <TableRow 
                      key={unit.id_security}
                      className="animate-fade-in-up"
                      style={{ animationDelay: `${index * 50}ms`}}
                    >
                      <TableCell>
                        <div className="flex items-center gap-4">
                          <Image
                              src={unit.imagen_url.startsWith('/') ? unit.imagen_url : 'https://placehold.co/80x80.png'}
                              data-ai-hint="security unit"
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
                              <ResourceCost type="armas" value={unit.c_armas} label="Armas" />
                              <ResourceCost type="municion" value={unit.c_municion} label="Munición" />
                              <ResourceCost type="alcohol" value={unit.c_alcohol} label="Alcohol" />
                              <ResourceCost type="dolares" value={unit.c_dolares} label="Dólares" />
                          </div>
                      </TableCell>
                      <TableCell>
                          <div className="font-bold text-lg">{currentQuantity}</div>
                      </TableCell>
                      <TableCell className="text-right">
                        <form action={handlePurchase} className="flex items-center gap-2 justify-end">
                          <input type="hidden" name="id_security" value={unit.id_security} />
                          <Input
                            type="number"
                            name="quantity"
                            min="1"
                            placeholder="Cant."
                            className="w-20 h-9"
                            required
                          />
                          <Button type="submit" size="sm">
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Adquirir
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
            {securityCatalog.map((unit, index) => {
              const playerUnit = playerSecuritiesMap.get(unit.id_security);
              const currentQuantity = playerUnit ? playerUnit.quantity : 0;
              return (
                <div key={unit.id_security} className="p-4 animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
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
                      <div className="mt-1 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <MobileResourceCost type="armas" value={unit.c_armas} label="Armas" />
                        <MobileResourceCost type="municion" value={unit.c_municion} label="Munición" />
                        <MobileResourceCost type="alcohol" value={unit.c_alcohol} label="Alcohol" />
                        <MobileResourceCost type="dolares" value={unit.c_dolares} label="Dólares" />
                      </div>
                  </div>

                  <form action={handlePurchase} className="mt-4 flex items-center gap-2">
                    <input type="hidden" name="id_security" value={unit.id_security} />
                    <Input
                      type="number"
                      name="quantity"
                      min="1"
                      placeholder="Cant."
                      className="w-24 h-9"
                      required
                    />
                    <Button type="submit" size="sm" className="flex-grow">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Adquirir
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
