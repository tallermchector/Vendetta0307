import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // @BestPractice: Añadido para permitir peticiones desde el entorno de Firebase Studio.
  // @ts-ignore - Se ignora el error de tipado para allowedDevOrigins en versiones anteriores de Next.js
  experimental: {
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
