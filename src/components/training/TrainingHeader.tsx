
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";

export function TrainingHeader() {
  return (
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
  );
}
