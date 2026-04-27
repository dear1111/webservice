package domain

import "time"

// User โครงสร้างข้อมูลที่ตรงกับตาราง users ใน Database
type User struct {
	ID        int       `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"` // ใส่ "-" เพื่อบอกว่าตอนส่ง JSON กลับไปให้ Frontend ห้ามส่ง Password เด็ดขาด (เพื่อความปลอดภัย)
	PlanID    int       `json:"plan_id"`
	CreatedAt time.Time `json:"created_at"`
}