/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Only include this if your app depends on this key
  // Otherwise remove it to avoid confusion
  allowedDevOrigins: [
    // 'https://buntly.vercel.app',
    "https://871c-2400-1a00-bb20-a64f-b56c-a83b-44c9-533b.ngrok-free.app",

    //  // Remove trailing slash for consistency
  ],
  images: {
    remotePatterns: [
      {
        hostname: 'res.cloudinary.com',
      },
    ],
  },
};

module.exports = nextConfig;
