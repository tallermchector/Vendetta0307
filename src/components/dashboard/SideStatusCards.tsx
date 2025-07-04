import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SideStatusCards() {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Seguridad</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold text-green-400">ÓPTIMA</p>
                    <p className="text-sm text-muted-foreground">Tus defensas están al máximo.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>Entrenamiento</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-2xl font-bold">3/5 Unidades</p>
                    <p className="text-sm text-muted-foreground">Entrenando sicarios...</p>
                </CardContent>
            </Card>
        </div>
    );
}
