'use client';

import { useState, useEffect } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Clock } from 'lucide-react';
import Image from 'next/image';
import type { User, PlayerResources } from '@prisma/client';

// The user object passed here comes from `getCurrentUser`, which omits the password.
// We use Omit<User, 'pass'> to accurately type this object.
type UserWithResources = Omit<User, 'pass'> & { recursos: PlayerResources | null };

export default function Header({ user }: { user: UserWithResources }) {
  const resources = user.recursos;
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    // This effect runs only on the client, after hydration, avoiding a mismatch.
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString('es-ES', {
        dateStyle: 'short',
        timeStyle: 'medium',
      }));
    }, 1000); // Update every second

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
       <SidebarTrigger className="md:hidden" />
       
       <div className="flex-1"></div>

       <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2 lg:gap-x-6 text-sm font-medium text-foreground">
         
         <div className="flex items-center gap-2">
           <Image src="/img/recursos/armas.svg" alt="Armas" width={20} height={20} />
           <span className="hidden sm:inline">ARMAS</span>
           <span className="font-bold text-primary">{(Number(resources?.armas) || 0).toLocaleString()}</span>
         </div>
         
         <div className="flex items-center gap-2">
           <Image src="/img/recursos/municion.svg" alt="Munición" width={20} height={20} />
           <span className="hidden sm:inline">MUNICION</span>
           <span className="font-bold text-primary">{(Number(resources?.municion) || 0).toLocaleString()}</span>
         </div>

         <div className="flex items-center gap-2">
           <Image src="/img/recursos/alcohol.svg" alt="Alcohol" width={16} height={16} />
           <span className="hidden sm:inline">ALCOHOL</span>
           <span className="font-bold text-primary">{(Number(resources?.alcohol) || 0).toLocaleString()}</span>
         </div>

         <div className="flex items-center gap-2">
           <Image src="/img/recursos/dolares.svg" alt="Dólares" width={20} height={20} />
           <span className="hidden sm:inline">DOLARES</span>
           <span className="font-bold text-primary">{(Number(resources?.dolares) || 0).toLocaleString()}</span>
         </div>

         <div className="hidden lg:flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-md">
           <Clock className="h-5 w-5 text-primary" />
           <span className="font-bold">{currentTime || '...'}</span>
         </div>
       </div>
    </header>
  );
}
