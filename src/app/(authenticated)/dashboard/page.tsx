import { protectPage } from "@/lib/auth";
import { PlayerInfoSection } from "@/components/dashboard/PlayerInfoSection";
import { ActionIcons } from "@/components/dashboard/ActionIcons";
import { StatusSection } from "@/components/dashboard/StatusSection";
import { SideStatusCards } from "@/components/dashboard/SideStatusCards";
import { StatsBar } from "@/components/dashboard/StatsBar";

export default async function DashboardPage() {
  const user = await protectPage();

  const playerProfile = user.perfil;
  
  return (
    <div className="flex flex-col gap-6">
      {/* Player Info & Actions Section */}
      <section className="relative animate-fade-in-up" style={{ animationDelay: '100ms' }}>
        <PlayerInfoSection user={user} />
        <ActionIcons />
      </section>

      {/* Content Sections */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
        <StatusSection />
        <SideStatusCards />
      </section>
      
      {/* Bottom Stats Bar */}
      <section className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
        <StatsBar playerProfile={playerProfile} />
      </section>
    </div>
  );
}
