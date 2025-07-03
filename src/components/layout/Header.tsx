import { SidebarTrigger } from "@/components/ui/sidebar";
import { Coins, Martini, Clock } from 'lucide-react';

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between gap-4 border-b bg-background px-4 sm:px-6">
       <SidebarTrigger className="md:hidden" />
       
       <div className="flex-1"></div>

       <div className="flex items-center justify-end gap-x-4 lg:gap-x-6 text-sm font-medium text-foreground">
         <div className="hidden sm:flex items-center gap-2">
           <span>ARMAS</span>
           <span className="font-bold text-primary">1,234K</span>
         </div>
         <div className="hidden sm:flex items-center gap-2">
           <span>MUNICION</span>
           <span className="font-bold text-primary">5,678M</span>
         </div>
         <div className="flex items-center gap-2">
           <Martini className="h-5 w-5 text-primary" />
           <span className="hidden md:inline">ALCOHOL</span>
           <span className="font-bold text-primary">9,123</span>
         </div>
         <div className="flex items-center gap-2">
           <Coins className="h-5 w-5 text-primary" />
           <span className="hidden md:inline">DOLARES</span>
           <span className="font-bold text-primary">$4.5M</span>
         </div>
         <div className="hidden lg:flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-md">
           <Clock className="h-5 w-5 text-primary" />
           <span className="font-bold">14/07/2024 22:15:43</span>
         </div>
       </div>
    </header>
  );
}
