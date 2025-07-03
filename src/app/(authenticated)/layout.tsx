import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import prisma from "@/lib/prisma";
import type { Propiedad } from "@prisma/client";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Para este prototipo, obtendremos las propiedades del primer usuario.
  // En una aplicación real, se obtendría el ID del usuario que ha iniciado sesión.
  const user = await prisma.user.findFirst();
  const userProperties = user ? await prisma.propiedad.findMany({
    where: { id_usuario: user.id_usuario },
    orderBy: { nombre: 'asc' }
  }) : [];


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar properties={userProperties} />
        <div className="flex flex-1 flex-col">
          <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
