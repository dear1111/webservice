# ใช้ Node.js เวอรชัน 20 (ตามที่เพื่อนคุณตั้งไว้)
FROM node:20-alpine

WORKDIR /app

# ก๊อปปี้แค่ไฟล์ package มาก่อน
COPY package*.json ./

# ติดตั้ง dependencies ให้ครบ (จะได้มีคำสั่ง next ให้ใช้)
RUN npm install

# ก๊อปปี้ไฟล์โค้ดทั้งหมดตามมา
COPY . .

EXPOSE 3000

# รันโหมด Dev เพื่อให้เราแก้โค้ดแล้วเว็บรีเฟรชเอง (Hot Reload)
CMD ["npm", "run", "dev"]