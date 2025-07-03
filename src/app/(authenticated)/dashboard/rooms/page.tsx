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

// Esta data vendría de `prisma.building.findMany()`
const buildingCatalog = [
  { key: "oficina", nombre: "Oficina", descripcion: "Centro de operaciones para gestionar tus actividades.", imagen: "/img/B1K.gif" },
  { key: "escuela", nombre: "Escuela de Gángsters", descripcion: "Forma a nuevos reclutas y mejora sus habilidades.", imagen: "/img/B2K.gif" },
  { key: "armeria", nombre: "Armería", descripcion: "Produce y almacena armas para tus hombres.", imagen: "/img/B3K.gif" },
  { key: "municion", nombre: "Fábrica de Municiones", descripcion: "Fabrica munición esencial para tus armas.", imagen: "/img/B4K.gif" },
  { key: "cerveceria", nombre: "Cervecería", descripcion: "Produce alcohol para vender o mantener alta la moral.", imagen: "/img/B5K.gif" },
  { key: "taberna", nombre: "Taberna", descripcion: "Un lugar para que tus hombres se relajen y reclutar nuevos miembros.", imagen: "/img/B6K.gif" },
  { key: "contrabando", nombre: "Centro de Contrabando", descripcion: "Gestiona operaciones ilegales para obtener grandes beneficios.", imagen: "/img/B7K.gif" },
  { key: "almacenArm", nombre: "Almacén de Armas", descripcion: "Aumenta la capacidad de almacenamiento de armas.", imagen: "/img/B8K.gif" },
  { key: "deposito", nombre: "Depósito de Munición", descripcion: "Aumenta la capacidad de almacenamiento de munición.", imagen: "/img/B9K.gif" },
  { key: "almacenAlc", nombre: "Almacén de Alcohol", descripcion: "Aumenta la capacidad de almacenamiento de alcohol.", imagen: "/img/B10K.gif" },
  { key: "caja", nombre: "Caja Fuerte", descripcion: "Protege una parte de tus dólares de los robos.", imagen: "/img/B11K.gif" },
  { key: "campo", nombre: "Campo de Tiro", descripcion: "Mejora la precisión y efectividad de tus unidades.", imagen: "/img/B12K.gif" },
  { key: "seguridad", nombre: "Puesto de Seguridad", descripcion: "Mejora las defensas de tu propiedad.", imagen: "/img/B13K.gif" },
  { key: "torreta", nombre: "Torreta de Defensa", descripcion: "Defensa automatizada contra atacantes.", imagen: "/img/B14K.gif" },
  { key: "minas", nombre: "Operación Minera", descripcion: "Genera recursos brutos para tus fábricas.", imagen: "/img/B15K.gif" },
];

// Esta data vendría de `prisma.propiedad.findUnique({ where: { ... } })`
const mockPlayerProperty = {
    oficina: 5,
    escuela: 2,
    armeria: 7,
    municion: 6,
    cerveceria: 8,
    taberna: 4,
    contrabando: 1,
    almacenArm: 3,
    deposito: 3,
    almacenAlc: 4,
    caja: 2,
    campo: 5,
    seguridad: 6,
    torreta: 2,
    minas: 0,
};


type BuildingKey = keyof typeof mockPlayerProperty;

export default function RoomsPage() {
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
              {buildingCatalog.map((building) => (
                <TableRow key={building.key}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      src={building.imagen}
                      alt={`Imagen de ${building.nombre}`}
                      width={80}
                      height={80}
                      className="rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{building.nombre}</TableCell>
                  <TableCell>
                    <span className="font-bold text-lg">{mockPlayerProperty[building.key as BuildingKey]}</span>
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
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
