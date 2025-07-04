import type { Building as BuildingType, Propiedad } from "@prisma/client";
import { BuildingCard } from "./BuildingCard";

const buildingFieldMap: Record<string, keyof Propiedad> = {
  'Oficina del Jefe': 'oficina',
  'Escuela de especialización': 'escuela',
  'Armería': 'armeria',
  'Almacén de munición': 'municion',
  'Cervecería': 'cerveceria',
  'Taberna': 'taberna',
  'Contrabando': 'contrabando',
  'Almacén de armas': 'almacenArm',
  'Depósito de munición': 'deposito',
  'Almacén de alcohol': 'almacenAlc',
  'Caja fuerte': 'caja',
  'Campo de entrenamiento': 'campo',
  'Seguridad': 'seguridad',
  'Torreta de fuego automático': 'torreta',
  'Minas ocultas': 'minas',
};

interface BuildingGridProps {
    buildingCatalog: BuildingType[];
    playerProperty: Propiedad;
}

export function BuildingGrid({ buildingCatalog, playerProperty }: BuildingGridProps) {
    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {buildingCatalog.map((building, index) => {
                const buildingKey = buildingFieldMap[building.nombre];
                const level = buildingKey ? (playerProperty[buildingKey] as number) : 0;

                return (
                    <div key={building.id_edificio} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms`}}>
                        <BuildingCard building={building} level={level} />
                    </div>
                );
            })}
        </div>
    );
}
