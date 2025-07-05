import type { Propiedad } from "@prisma/client";

// @BestPractice: Centralize the mapping between building names and their
// corresponding database fields. This avoids duplication and makes the code
// easier to maintain.
export const buildingFieldMap: Record<string, keyof Propiedad> = {
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
