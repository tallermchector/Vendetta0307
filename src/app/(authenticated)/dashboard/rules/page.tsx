import { promises as fs } from 'fs';
import path from 'path';
import { marked } from 'marked';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollText } from "lucide-react";

// This component is a Server Component, so we can use Node.js APIs directly.
export default async function RulesPage() {
  // Construct the full path to the markdown file.
  const filePath = path.join(process.cwd(), 'src', 'content', 'rules.md');
  
  let contentHtml = '<p>Error: No se pudo cargar el reglamento.</p>';

  try {
    // Read the file content.
    const markdown = await fs.readFile(filePath, 'utf-8');
    // Parse the markdown content to HTML.
    contentHtml = await marked.parse(markdown);
  } catch (error) {
    console.error("Failed to read or parse rules.md:", error);
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <ScrollText className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Reglamento del Juego</CardTitle>
              <CardDescription>
                Estas son las reglas oficiales de Vendetta 01. Se espera que todos los jugadores las cumplan.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
            {/* 
            The 'prose' classes from @tailwindcss/typography apply default styling to raw HTML.
            We also invert it for dark mode.
            */}
          <article
            className="prose prose-neutral dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
