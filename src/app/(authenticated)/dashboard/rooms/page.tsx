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
import { Building, ArrowUpCircle } from "lucide-react";
import Image from "next/image";
import prisma from "@/lib/prisma";
import type { Propiedad } from "@prisma/client";
import { protectPage } from "@/lib/auth";

const buildingFieldMap: Record<string, keyof Propiedad> = {
  'Oficina': 'oficina',
  'Escuela de Gángsters': 'escuela',
  'Armería': 'armeria',
  'Fábrica de Municiones': 'municion',
  'Cervecería': 'cerveceria',
  'Taberna': 'taberna',
  'Centro de Contrabando': 'contrabando',
  'Almacén de Armas': 'almacenArm',
  'Depósito de Munición': 'deposito',
  'Almacén de Alcohol': 'almacenAlc',
  'Caja Fuerte': 'caja',
  'Campo de Tiro': 'campo',
  'Puesto de Seguridad': 'seguridad',
  'Torreta de Defensa': 'torreta',
  'Operación Minera': 'minas',
};

export default async function RoomsPage() {
  const user = await protectPage();

  const buildingCatalog = await prisma.building.findMany({
    orderBy: {
      id_edificio: 'asc'
    }
  });
  
  // Por ahora, gestionamos la primera propiedad del usuario.
  // En el futuro, se podría seleccionar la propiedad activa desde la UI.
  const playerProperty = user.propiedades?.[0];

  if (!playerProperty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sin Propiedades</CardTitle>
          <CardDescription>
            No se ha encontrado ninguna propiedad para mostrar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Asegúrate de que tu usuario tenga al menos una propiedad en la base de datos.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="h-6 w-6" />
            <div>
              <CardTitle>Gestión de Habitaciones</CardTitle>
              <CardDescription>
                Amplía y gestiona los edificios de tu propiedad actual.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px] hidden sm:table-cell">Imagen</TableHead>
                <TableHead>Edificio</TableHead>
                <TableHead>Nivel</TableHead>
                <TableHead className="hidden md:table-cell">Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buildingCatalog.map((building) => {
                const buildingKey = buildingFieldMap[building.nombre];
                const level = buildingKey ? playerProperty[buildingKey] : 0;

                return (
                  <TableRow key={building.id_edificio}>
                    <TableCell className="hidden sm:table-cell">
                      <Image
                        src={building.imagen_url || 'https://placehold.co/80x80.png'}
                        alt={`Imagen de ${building.nombre}`}
                        width={80}
                        height={80}
                        className="rounded-md object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{building.nombre}</TableCell>
                    <TableCell>
                      <span className="font-bold text-lg">{level}</span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground">
                      {building.descripcion}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <ArrowUpCircle className="mr-2 h-4 w-4" />
                        Ampliar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
