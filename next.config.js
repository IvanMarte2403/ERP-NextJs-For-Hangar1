// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://hangarbrain-326894472204.us-central1.run.app:path*', // Proxy to API
        },
      ];
    },
  };
  