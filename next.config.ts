import fs from 'fs';
import path from 'path';

// Leemos el package.json para extraer el nombre del proyecto automáticamente
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const projectName = packageJson.name || 'next-app';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desvía toda la compilación y la caché pesada al SSD rápido C:
  distDir: `C:/temp_next_cache/${projectName}`,

  // Tus otras configuraciones de Next.js van aquí abajo...
};

export default nextConfig;
