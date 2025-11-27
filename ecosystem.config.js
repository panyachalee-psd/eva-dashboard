require('dotenv').config();

module.exports = {
  apps: [
    {
      name: `NWL-CENTRALIZE-WEB`,
      script: "serve",
      instances: 1,
      autorestart: true,
      watch: false,
      samax_memory_restart: "1G",
      env: {
        PM2_SERVE_PATH: "./build",
        PM2_SERVE_PORT: 3100,
        PM2_SERVE_SPA: "true",
        NODE_ENV: 'development',
      },
    },
  ],
};
