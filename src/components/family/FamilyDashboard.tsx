import { Card, CardContent } from "@/components/ui/card";
import { FamilyHeader } from "./FamilyHeader";
import { MemberList } from "./MemberList";
import { FamilyStats } from "./FamilyStats";
import type { User, Family, PlayerProfile } from "@prisma/client";

type MemberWithProfile = User & { perfil: PlayerProfile | null };
type FamilyWithMembers = Family & { miembros: MemberWithProfile[] };

interface FamilyDashboardProps {
  family: FamilyWithMembers;
}

export function FamilyDashboard({ family }: FamilyDashboardProps) {
  return (
    <div className="flex flex-col gap-6">
      <FamilyHeader family={family} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0 md:p-6">
              <MemberList members={family.miembros} />
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <FamilyStats members={family.miembros} />
        </div>
      </div>
    </div>
  );
}
