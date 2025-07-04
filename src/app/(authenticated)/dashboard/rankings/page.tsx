import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function RankingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Construction className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Clasificaciones</CardTitle>
              <CardDescription>
                Este módulo está actualmente en construcción.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Vuelve pronto para ver las nuevas funcionalidades.</p>
        </CardContent>
      </Card>
    </div>
  );
}
