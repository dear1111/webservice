const express = require('express');
const cors = require('cors');
const { initDb } = require('./src/db'); // นำเข้าตัว init
const { register, login, subscribe } = require('./src/authController');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// รันการตั้งค่า Table
initDb();

// --- Routes ---
app.post('/api/register', register);
app.post('/api/login', login);
app.post('/api/subscribe', subscribe); // ตัวนี้คือที่เพื่อนคุณต้องเรียกใช้

app.get('/api/prices', (req, res) => {
  // Logic เดิมของคุณ...
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});