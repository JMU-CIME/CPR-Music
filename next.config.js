module.exports = {
  async rewrites() {
    return [
      {
        source: '/auth-token/:rest*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/:rest*`,
      },
      {
        source: '/backend/:rest*',
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/:rest*`,
      },
    ];
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
};
