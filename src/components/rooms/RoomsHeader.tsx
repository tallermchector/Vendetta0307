
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building } from "lucide-react";

interface RoomsHeaderProps {
  propertyName: string;
}

export function RoomsHeader({ propertyName }: RoomsHeaderProps) {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <Building className="h-6 w-6" />
        <div>
          <CardTitle>Gestión de Habitaciones</CardTitle>
          <CardDescription>
            Amplía y gestiona los edificios de tu propiedad: {propertyName}.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
