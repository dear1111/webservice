# Stage 1: Install dependencies
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm install

# Stage 2: Build the app
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Next.js จะจัดการ Tailwind CSS ให้ตอน Build อัตโนมัติ
RUN npm run build

# Stage 3: Runner (Production)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# ก๊อปปี้เฉพาะไฟล์ที่จำเป็นจริงๆ จากการทำ standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

# รัน Next.js server
CMD ["node", "server.js"]

# docker build -t frontend .
# docker run -p 4000:3000 frontend