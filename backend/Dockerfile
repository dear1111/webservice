FROM node:18-alpine

WORKDIR /app

# ก๊อปปี้ไฟล์จัดการแพ็กเกจมาก่อนเพื่อความเร็วในการ Build
COPY package*.json ./
RUN npm install

# ก๊อปปี้โค้ดทั้งหมดตามมา
COPY . .

EXPOSE 5000

# ใช้ nodemon เพื่อให้เวลาเราแก้โค้ด backend เซิร์ฟเวอร์จะรีสตาร์ทเอง
CMD ["npm", "run", "dev"]