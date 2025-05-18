
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Only include this if your app depends on this key
  // Otherwise remove it to avoid confusion
  allowedDevOrigins: [
    'https://grubrush.vercel.app',
    // "https://871c-2400-1a00-bb20-a64f-b56c-a83b-44c9-533b.ngrok-free.app",

  ],
  images: {
    remotePatterns: [
      {
      protocol: 'https',
      hostname: 'res.cloudinary.com',
    },
    {
      protocol: 'https',
      hostname: 'ui-avatars.com',
    },
    {
      protocol: 'https',
      hostname: 'www.themealdb.com',
    },
    {
      protocol: 'https',
      hostname: 'avatars.githubusercontent.com',
    },
    {
      protocol: 'https',
      hostname: 'img.clerk.com',
    },
    ],
  },
};

module.exports = nextConfig;
