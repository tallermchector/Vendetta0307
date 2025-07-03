"use client";

import Link from "next/link";
import {
  Home,
  BedDouble,
  UserPlus,
  Shield,
  Target,
  Building,
  Search,
  FlaskConical,
  Users,
  Coins,
  Map,
  ClipboardList,
  Calculator,
  List,
  Mail,
  BarChart,
  Trophy,
  MessageSquare,
  MessagesSquare,
  ScrollText,
  Settings,
  LogOut,
} from "lucide-react";

import { logoutUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar as ShadcnSidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Sidebar() {
  const menuItems1 = [
    { href: "/dashboard", label: "Visión General", Icon: Home },
    { href: "/dashboard/rooms", label: "Habitaciones", Icon: BedDouble },
    { href: "/dashboard/recruitment", label: "Reclutamiento", Icon: UserPlus },
    { href: "/dashboard/security", label: "Seguridad", Icon: Shield },
    { href: "/dashboard/training", label: "Entrenamiento", Icon: Target },
    { href: "/dashboard/buildings", label: "Edificios", Icon: Building },
    { href: "/dashboard/search", label: "Buscar", Icon: Search },
  ];

  const menuItems2 = [
    { href: "/dashboard/technologies", label: "Tecnologías", Icon: FlaskConical },
    { href: "/dashboard/family", label: "Familia", Icon: Users },
    { href: "/dashboard/resources", label: "Recursos", Icon: Coins },
    { href: "/dashboard/map", label: "Mapa", Icon: Map },
    { href: "/dashboard/missions", label: "Misiones", Icon: ClipboardList },
    { href: "/dashboard/simulator", label: "Simulador", Icon: Calculator },
    { href: "/dashboard/farms", label: "Lista de granjas", Icon: List },
    { href: "/dashboard/messages", label: "Mensajes", Icon: Mail },
    { href: "/dashboard/stats", label: "Estadísticas", Icon: BarChart },
    { href: "/dashboard/rankings", label: "Clasificaciones", Icon: Trophy },
  ];

  const menuItems3 = [
    { href: "/dashboard/chat", label: "Chat", Icon: MessageSquare },
    { href: "/dashboard/forum", label: "Foro", Icon: MessagesSquare },
    { href: "/dashboard/rules", label: "Reglas", Icon: ScrollText },
    { href: "/dashboard/options", label: "Opciones", Icon: Settings },
  ];

  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center justify-between">
        <h2 className="text-2xl font-bold font-headline text-primary">VENDETTA</h2>
        <SidebarTrigger className="hidden md:flex" />
      </SidebarHeader>
      <SidebarContent className="p-0">
        <ScrollArea className="h-full">
          <div className="p-2 pt-0">
            <div className="bg-primary text-primary-foreground text-center font-bold py-2 rounded-md">
                MENU
            </div>
          </div>
          <SidebarMenu className="px-2">
              {menuItems1.map((item) => (
                  <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton asChild className="w-full justify-start">
                          <Link href={item.href}>
                              <item.Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
          </SidebarMenu>
          
          <Separator className="my-4 bg-primary" />

          <div className="px-4 mb-4">
               <Select defaultValue="40:23:220">
                  <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="40:23:220">40:23:220</SelectItem>
                      <SelectItem value="40:23:221">40:23:221</SelectItem>
                      <SelectItem value="40:23:222">40:23:222</SelectItem>
                  </SelectContent>
              </Select>
          </div>

          <SidebarMenu className="px-2">
              {menuItems2.map((item) => (
                  <SidebarMenuItem key={item.label}>
                       <SidebarMenuButton asChild className="w-full justify-start">
                          <Link href={item.href}>
                              <item.Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
          </SidebarMenu>

          <Separator className="my-4 bg-primary" />

          <SidebarMenu className="px-2 pb-4">
              {menuItems3.map((item) => (
                  <SidebarMenuItem key={item.label}>
                       <SidebarMenuButton asChild className="w-full justify-start">
                          <Link href={item.href}>
                              <item.Icon className="h-4 w-4" />
                              <span>{item.label}</span>
                          </Link>
                      </SidebarMenuButton>
                  </SidebarMenuItem>
              ))}
          </SidebarMenu>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter>
        <form action={logoutUser}>
          <Button type="submit" variant="outline" className="w-full">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </form>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
