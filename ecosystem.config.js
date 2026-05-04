module.exports = {
  apps: [
    {
      name: 'jaribooti-dispatcher',
      script: '/root/agent-system/dispatcher.js',
      args: '--project jaribooti',
      cwd: '/root/agent-system',
      env: {
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY,
        NODE_ENV: 'production',
      },
      autorestart: true,
      watch: false,
      instance_var: 'INSTANCE',
      max_restarts: 3,
      min_uptime: '10s',
      exp_backoff_restart_delay: 100,
    },
  ],
};
