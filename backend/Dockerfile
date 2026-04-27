# 1. ใช้ Image ของ Go แทน Node (เลือกใช้เวอร์ชัน alpine เพื่อให้ไฟล์มีขนาดเล็ก)
FROM golang:alpine

WORKDIR /app

# 2. ติดตั้งเครื่องมือ 'Air' สำหรับทำ Hot-reload (รับจบหน้าที่แทน nodemon)
RUN go install github.com/air-verse/air@latest

# 3. ก๊อปปี้ไฟล์จัดการแพ็กเกจ (แทนที่ package.json) มาก่อนเพื่อความเร็วในการ Build Cache
COPY go.mod go.sum ./
RUN go mod download

# 4. ก๊อปปี้โค้ดทั้งหมดตามมา
COPY . .

EXPOSE 5000

# 5. สั่งรันด้วย air เพื่อให้เวลาแก้โค้ดแล้วเซิร์ฟเวอร์รีสตาร์ทตัวเอง
CMD ["air"]