
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserPlus } from "lucide-react";

export function RecruitmentHeader() {
  return (
    <CardHeader>
      <div className="flex items-center gap-3">
        <UserPlus className="h-6 w-6" />
        <div>
          <CardTitle>Centro de Reclutamiento</CardTitle>
          <CardDescription>
            Recluta unidades para fortalecer tu imperio y defender tus intereses.
          </CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
