/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizeCss: false, // 🚫 matikan lightningcss biar aman di Termux
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "**", // ✅ izinkan semua path Cloudinary
      },
    ],
  },
};

export default nextConfig;
