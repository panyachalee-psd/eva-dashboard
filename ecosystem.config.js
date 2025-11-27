require('dotenv').config();

module.exports = {
    apps: [
        {
            name: 'NWL-WIM-SERVICE',
            script: './dist/index.js',
            interpreter: 'node',
            instances: 1,
            exec_mode: 'fork',
            watch: true,
            ignore_watch: ['node_modules', 'dist/**/*.js.map', 'logs'],
            env: {
                NODE_ENV: 'development',
                PORT: process.env.PORT || 3002,
            },
            error_file: './logs/err.log',
            out_file: './logs/out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
};
 