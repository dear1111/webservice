const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
// const { register, login, pricing } = require('./src/authController');
const crypto = require('crypto');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || 'db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'gold_db',
  port: 5432,
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS api_keys (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        key VARCHAR(255) UNIQUE NOT NULL,
        usage INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("✅ Database, Users table & API_Keys table ready (or already exists)");
  } catch (err) {
    console.error("❌ Error initializing database:", err);
  }
};

// รันการตั้งค่า Table
initDb();

// --- Routes ---
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password]
    );
    
    res.status(201).json({
      message: "สมัครสมาชิกสำเร็จ!",
      user: result.rows[0]
    });
  } catch (err) {
    if (err.code === '23505') { // รหัส Error สำหรับ Email ซ้ำ (Unique constraint)
      return res.status(400).json({ error: "อีเมลนี้ถูกใช้ไปแล้ว" });
    }
    console.error(err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. วิ่งไปหา Email นี้ใน Database
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    
    // ถ้าไม่เจอใครใช้ Email นี้เลย
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    const user = result.rows[0];

    // 2. เอารหัสผ่านที่พิมพ์มา เทียบกับรหัสผ่านใน Database 
    // (หมายเหตุ: ตอนนี้เราเก็บรหัสผ่านแบบข้อความตรงๆ เพื่อความง่ายไปก่อน)
    if (password !== user.password) {
      return res.status(401).json({ error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" });
    }

    // 3. รหัสตรงกันเป๊ะ! ส่งสัญญาณว่าสำเร็จ
    res.status(200).json({ 
      message: "เข้าสู่ระบบสำเร็จ!", 
      user: { id: user.id, email: user.email } 
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

app.put('/api/reset-password', async (req, res) => {
  const { email, newPassword } = req.body;

  try {
    // สั่งอัปเดตรหัสผ่านใหม่ โดยหาจากอีเมล
    const result = await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2 RETURNING id',
      [newPassword, email]
    );

    // ถ้า Update ไม่สำเร็จ (ไม่มีอีเมลนี้ในตาราง)
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "ไม่พบอีเมลนี้ในระบบครับ" });
    }

    res.status(200).json({ message: "เปลี่ยนรหัสผ่านสำเร็จแล้ว!" });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดที่เซิร์ฟเวอร์" });
  }
});

// API สำหรับสร้าง Key ใหม่
app.post('/api/keys', async (req, res) => {
  try {
    const { userId, name } = req.body;
    
    // สุ่มตัวอักษร 16 byte (ออกมาเป็นตัวอักษร 32 ตัว) แล้วเติม prefix ai_live_ เข้าไป
    const newApiKey = 'ai_live_' + crypto.randomBytes(16).toString('hex');

    // บันทึกลง Database ของจริง
    const result = await pool.query(
      'INSERT INTO api_keys (user_id, name, key) VALUES ($1, $2, $3) RETURNING *',
      [userId, name, newApiKey]
    );

    // ส่งข้อมูลที่เพิ่งสร้างเสร็จกลับไปให้ Frontend
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ไม่สามารถสร้าง API Key ได้' });
  }
});

// API สำหรับดึง Key ทั้งหมดของ User
app.get('/api/keys/:userId', async (req, res) => {
  try {
    const { userId } = req.params; // รับรหัส user จาก URL

    // ดึงข้อมูลจากฐานข้อมูล โดยเรียงจากใหม่ไปเก่า
    const result = await pool.query(
      'SELECT * FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );

    // ส่งกลับไปให้ Frontend
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'ไม่สามารถดึงข้อมูล API Keys ได้' });
  }
});

// app.post('/api/pricing', pricing); // ตัวนี้คือที่เพื่อนคุณต้องเรียกใช้

app.get('/api/pricing', (req, res) => {
  res.json({ message: "ระบบราคาทองกำลังก่อสร้างจ้า!" });
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});