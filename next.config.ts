import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  // @BestPractice: Añadido para permitir peticiones desde el entorno de Firebase Studio.
  // @ts-ignore - Se ignora el error de tipado para allowedDevOrigins en versiones anteriores de Next.js
  experimental: {
    allowedDevOrigins: ["https://9000-firebase-studio-1751569887540.cluster-duylic2g3fbzerqpzxxbw6helm.cloudworkstations.dev"],
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
