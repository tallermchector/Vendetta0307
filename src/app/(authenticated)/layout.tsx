import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { protectPage } from "@/lib/auth";
import { safeSerialize } from "@/lib/serialize";

// This layout is protected by the middleware, but we can add an
// extra layer of protection here by calling protectPage().
// This also gives us access to the user object for the layout.
export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await protectPage();

  // @Security: Serialize the resources before passing them to the client component Header.
  // This prevents the "cannot serialize BigInt" error.
  const serializedResources = user.recursos ? safeSerialize(user.recursos) : null;


  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <Sidebar properties={user.propiedades || []} />
        <div className="flex flex-1 flex-col">
          <Header resources={serializedResources} />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 animate-fade-in-up">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
