
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";

export function RankingsHeader() {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <Trophy className="h-6 w-6 text-primary" />
        <div>
          <CardTitle>Clasificaciones Globales</CardTitle>
          <CardDescription>
            Compite por ser el jugador más poderoso.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
