module.exports = {
  apps: [
    {
      name: "thullo",
      script: "pnpm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
