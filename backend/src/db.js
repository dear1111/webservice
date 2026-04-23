const { Pool } = require('pg');

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'db', // ชื่อ service ใน docker-compose
  database: process.env.DB_NAME || 'gold_db',
  password: process.env.DB_PASSWORD || 'password',
  port: 5432,
});

// ฟังก์ชันสร้าง Table เริ่มต้น (ช่วยให้งานง่ายขึ้นเยอะ)
const initDb = async () => {
  const queryText = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_premium BOOLEAN DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  try {
    await pool.query(queryText);
    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ DB Init Error:", err);
  }
};

module.exports = { pool, initDb };