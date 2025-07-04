import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, PlusCircle, Users } from "lucide-react";

export function NoFamilyView() {
  return (
    <div className="flex items-center justify-center h-full">
      <Card className="w-full max-w-2xl text-center">
        <CardHeader>
          <Users className="mx-auto h-16 w-16 text-primary" />
          <CardTitle className="mt-4 text-2xl font-headline">No perteneces a ninguna familia</CardTitle>
          <CardDescription>
            Las familias te permiten colaborar con otros jugadores, compartir recursos y dominar juntos.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row justify-center gap-4">
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Crear una familia
          </Button>
          <Button variant="outline">
            <Search className="mr-2 h-5 w-5" />
            Buscar familias existentes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
