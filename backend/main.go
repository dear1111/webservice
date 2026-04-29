package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	"backend/delivery/http" // เปลี่ยนคำว่า backend เป็นชื่อโปรเจกต์ของคุณถ้าตั้งต่างกัน
	"backend/repository"
	"backend/usecase"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	_ "github.com/lib/pq" // นำเข้าไดรเวอร์สำหรับ PostgreSQL
)

// ฟังก์ชันช่วยดึงค่า Environment Variable (ถ้าไม่มีให้ใช้ค่าเริ่มต้น)
func getEnv(key, fallback string) string {
	if value, exists := os.LookupEnv(key); exists {
		return value
	}
	return fallback
}

// ฟังก์ชันเชื่อมต่อฐานข้อมูลและสร้างตาราง (แทน initDb ใน Node.js)
func initDB() *sql.DB {
	// รับค่า DATABASE_URL ตรงๆ เลย (ลิงก์ที่ก๊อปมาจาก Neon)
	dbUrl := getEnv("DATABASE_URL", "")
	
	if dbUrl == "" {
		log.Fatal("❌ ไม่พบ DATABASE_URL ใน Environment")
	}

	db, err := sql.Open("postgres", dbUrl)
	if err != nil {
		log.Fatal("❌ Error connecting to database: ", err)
	}

	if err := db.Ping(); err != nil {
		log.Fatal("❌ Cannot ping database: ", err)
	}

	createTables(db)
	return db
}

func createTables(db *sql.DB) {
	userTable := `
	CREATE TABLE IF NOT EXISTS users (
		id SERIAL PRIMARY KEY,
		email VARCHAR(255) UNIQUE NOT NULL,
		password VARCHAR(255) NOT NULL,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		plan_id INT DEFAULT 1
	);`
	if _, err := db.Exec(userTable); err != nil {
		log.Fatal("❌ Error creating users table: ", err)
	}

	apiKeyTable := `
	CREATE TABLE IF NOT EXISTS api_keys (
		id SERIAL PRIMARY KEY,
		user_id INT REFERENCES users(id) ON DELETE CASCADE,
		name VARCHAR(100) NOT NULL,
		key VARCHAR(255) UNIQUE NOT NULL,
		usage INT DEFAULT 0,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);`
	if _, err := db.Exec(apiKeyTable); err != nil {
		log.Fatal("❌ Error creating api_keys table: ", err)
	}

	fmt.Println("✅ Database, Users table & API_Keys table ready (or already exists)")
}

func main() {
	// 1. ต่อ Database
	db := initDB()
	defer db.Close()

	// 2. สร้างแอป Fiber
	app := fiber.New()
	app.Use(cors.New())    // เปิดให้ Frontend เรียกข้ามโดเมนได้เหมือน app.use(cors())
	app.Use(logger.New())  // เปิด Logger จะได้เห็นเวลาคนยิง API เข้ามาใน Terminal

	// 3. 🧩 ประกอบร่าง Clean Architecture (Wiring)
	// สร้าง Repository
	// 3. 🧩 ประกอบร่าง Clean Architecture (Wiring)
userRepo := repository.NewUserRepository(db)
apiKeyRepo := repository.NewAPIKeyRepository(db)

userUsecase := usecase.NewUserUsecase(userRepo)
apiKeyUsecase := usecase.NewAPIKeyUsecase(apiKeyRepo)
goldUsecase := usecase.NewGoldUsecase() // 🌟 เพิ่มบรรทัดนี้

// โยนเข้าไปใน Handler
http.NewUserHandler(app, userUsecase)
http.NewAPIKeyHandler(app, apiKeyUsecase)
http.NewGoldHandler(app, goldUsecase)   // 🌟 เพิ่มบรรทัดนี้ (ใช้ app และ http)

	// Route แถมของเดิมที่มีในระบบ
	app.Get("/api/pricing", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"message": "ระบบราคาทองกำลังก่อสร้างจ้า!"})
	})

	// 4. เปิดเซิร์ฟเวอร์
	port := getEnv("PORT", "5000")
	fmt.Printf("🚀 Server is running on port %s\n", port)
	log.Fatal(app.Listen(":" + port))
}