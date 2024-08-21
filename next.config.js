// next.config.js
module.exports = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'https://openapi.somosclear.com/api/:path*', // Proxy to API
        },
      ];
    },
  };
  