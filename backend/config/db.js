const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: {
    rejectUnauthorized: false
  }
});

pool.getConnection()
  .then(conn => {
      console.log('✅ MySQL connected successfully');
      conn.release();
  })
  .catch(err => {
      console.error('❌ MySQL connection failed:', err);
  });
const promisePool = pool.promise();

module.exports = promisePool;