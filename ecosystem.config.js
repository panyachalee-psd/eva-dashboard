require('dotenv').config();

// module.exports = {
//     apps: [
//         {
//             name: 'NWL-WEB-SERVICE',
//             script: './dist/index.js',
//             interpreter: 'node',
//             instances: 1,
//             exec_mode: 'fork',
//             watch: true,
//             ignore_watch: ['node_modules', 'dist/**/*.js.map', 'logs'],
//             env: {
//                 NODE_ENV: 'development',
//                 PORT: process.env.PORT || 3002,
//             },
//             error_file: './logs/err.log',
//             out_file: './logs/out.log',
//             log_date_format: 'YYYY-MM-DD HH:mm:ss',
//         },
//     ],
// };
 

// ecosystem.config.js
module.exports = {
  apps : [{
    name: "eva-dashboard", // ชื่อ Application ของคุณ
    script: "npm",        // สั่งรันผ่าน npm
    args: "run start",    // ใช้ script 'start' ที่กำหนดไว้ใน package.json
    instances: 1,         // จำนวน Process ที่ต้องการรัน (สำหรับ Static Site มักจะเป็น 1)
    exec_mode: "fork",    // โหมดการรัน
    watch: false,         // ปิด watch เพื่อไม่ให้รีสตาร์ทเมื่อไฟล์เปลี่ยนใน Production
    env: {
      NODE_ENV: "production",
      PORT: 3002          // กำหนดพอร์ต (ต้องตรงกับใน script 'start')
    },
    // การตั้งค่า Log File (ไม่บังคับ แต่แนะนำ)
    error_file: "./logs/eva-dashboard-err.log",
    out_file: "./logs/eva-dashboard-out.log",
    log_date_format: "YYYY-MM-DD HH:mm Z"
  }]
};