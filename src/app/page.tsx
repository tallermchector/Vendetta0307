import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MoveRight } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 text-center bg-background overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-primary/[0.03] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
      <div className="z-10 flex flex-col items-center">
        <h1 className="text-6xl md:text-8xl font-bold font-headline text-transparent bg-clip-text bg-gradient-to-b from-neutral-50 to-neutral-400">
          Vendetta 01
        </h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">
          Entra en un mundo de intriga y conflicto. Tu historia comienza ahora.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/register" passHref>
            <Button size="lg" className="w-48 bg-primary hover:bg-primary/90 text-primary-foreground">
              Únete a la lucha
              <MoveRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/login" passHref>
            <Button size="lg" variant="outline" className="w-48 border-primary text-primary hover:bg-primary/10 hover:text-primary">
              Iniciar sesión
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
