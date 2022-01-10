module.exports = {
  async rewrites() {
    return [
      {
        source: "/backend/:rest*",
        destination: "http://localhost:8000/:rest*",
      },
    ];
  },
};
