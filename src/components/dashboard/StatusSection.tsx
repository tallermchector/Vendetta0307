import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function StatusSection() {
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Estado Actual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Misiones</p>
                        <p className="text-sm text-muted-foreground">3 misiones activas</p>
                    </div>
                    <Button variant="outline" size="sm">Ver misiones</Button>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Construcción</p>
                        <p className="text-sm text-muted-foreground">2 edificios en cola</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Mostrar todo</Link>
                    </Button>
                </div>
                 <div className="flex items-center justify-between p-3 rounded-md bg-card-foreground/[0.05]">
                    <div>
                        <p className="font-semibold">Reclutamiento</p>
                        <p className="text-sm text-muted-foreground">5 unidades en cola</p>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                        <Link href="#">Mostrar todo</Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
