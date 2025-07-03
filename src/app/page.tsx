import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <div className="text-center p-8 max-w-2xl">
        <h1 className="text-5xl md:text-7xl font-headline font-bold text-primary mb-4">
          Vendetta Latino
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          Bienvenido a la nueva generación de juegos de estrategia. Regístrate o inicia sesión para comenzar tu conquista.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild size="lg" className="font-headline">
            <Link href="/login">Iniciar Sesión</Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
            className="font-headline"
          >
            <Link href="/register">Regístrate</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
