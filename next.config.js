module.exports = {
  async rewrites() {
    return [
      {
        source: "/auth-token/:rest*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/:rest*`,
      },
      {
        source: "/backend/:rest*",
        destination: `${process.env.NEXT_PUBLIC_BACKEND_HOST}/:rest*`,
      },
    ];
  },
};
