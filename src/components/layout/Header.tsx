import { SidebarTrigger } from "@/components/ui/sidebar";
import { Coins, Martini, Clock } from 'lucide-react';
import type { User, PlayerResources } from '@prisma/client';

type UserWithResources = User & { recursos: PlayerResources | null };

export default function Header({ user }: { user: UserWithResources }) {
  const resources = user.recursos;
  
  // En un juego real, la hora debería venir del servidor y estar sincronizada.
  // Para el prototipo, usamos la hora del cliente.
  const currentTime = new Date().toLocaleString('es-ES', {
    dateStyle: 'short',
    timeStyle: 'medium',
  });

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
       <SidebarTrigger className="md:hidden" />
       
       <div className="flex-1"></div>

       <div className="flex items-center justify-end gap-x-4 lg:gap-x-6 text-sm font-medium text-foreground">
         <div className="hidden sm:flex items-center gap-2">
           <span>ARMAS</span>
           <span className="font-bold text-primary">{(Number(resources?.armas) || 0).toLocaleString()}</span>
         </div>
         <div className="hidden sm:flex items-center gap-2">
           <span>MUNICION</span>
           <span className="font-bold text-primary">{(Number(resources?.municion) || 0).toLocaleString()}</span>
         </div>
         <div className="flex items-center gap-2">
           <Martini className="h-5 w-5 text-primary" />
           <span className="hidden md:inline">ALCOHOL</span>
           <span className="font-bold text-primary">{(Number(resources?.alcohol) || 0).toLocaleString()}</span>
         </div>
         <div className="flex items-center gap-2">
           <Coins className="h-5 w-5 text-primary" />
           <span className="hidden md:inline">DOLARES</span>
           <span className="font-bold text-primary">{(Number(resources?.dolares) || 0).toLocaleString()}</span>
         </div>
         <div className="hidden lg:flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-md">
           <Clock className="h-5 w-5 text-primary" />
           <span className="font-bold">{currentTime}</span>
         </div>
       </div>
    </header>
  );
}
