import { protectPage } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { FamilyDashboard } from "@/components/family/FamilyDashboard";
import { NoFamilyView } from "@/components/family/NoFamilyView";

export default async function FamilyPage() {
  const user = await protectPage();

  if (!user.familia) {
    return <NoFamilyView />;
  }

  // If the user has a family, fetch all members for the dashboard.
  const familyWithMembers = await prisma.family.findUnique({
    where: {
      id_familia: user.familia.id_familia,
    },
    include: {
      miembros: {
        include: {
          perfil: true,
        },
      },
    },
  });

  if (!familyWithMembers) {
      // This case is unlikely if user.familia exists, but it's good practice.
      return <NoFamilyView />;
  }

  return <FamilyDashboard family={familyWithMembers} />;
}
