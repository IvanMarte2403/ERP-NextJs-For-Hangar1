// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        /* Proxy cualquier llamada que empiece con /api/…  */
        source: "/api/:path*",
        destination: "https://hangarbrain-326894472204.us-central1.run.app/:path*", // ←  nota la “/” faltante
      },
    ];
  },
};

module.exports = nextConfig; // ←  CommonJS para evitar el error “Unexpected token 'export'”
