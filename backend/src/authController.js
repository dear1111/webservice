const { pool } = require('./db');

const register = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, password] // เพื่อความง่ายในโปรเจกต์ส่งครู ไม่ต้อง hash ก็ได้ครับ แต่ถ้าอยากได้คะแนนเพิ่มค่อยใส่ bcrypt
    );
    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(400).json({ success: false, message: "Email already exists" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
    if (result.rows.length > 0) {
      res.json({ success: true, user: result.rows[0] });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const subscribe = async (req, res) => {
  const { email } = req.body; // รับ email มาอัปเดตสถานะ
  try {
    await pool.query('UPDATE users SET is_premium = true WHERE email = $1', [email]);
    res.json({ success: true, message: "Subscription successful! 🏆" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = { register, login, subscribe };