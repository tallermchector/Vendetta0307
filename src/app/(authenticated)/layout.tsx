import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { protectPage } from "@/lib/auth";
import type { Propiedad, User } from "@prisma/client";

// This layout is protected by the middleware, but we can add an
// extra layer of protection here by calling protectPage().
// This also gives us access to the user object for the layout.
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await protectPage();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar properties={user.propiedades || []} />
        <div className="flex flex-1 flex-col">
          <Header user={user} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
