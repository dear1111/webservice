package domain

import "time"

// APIKey โครงสร้างข้อมูลที่ตรงกับตาราง api_keys ใน Database
type APIKey struct {
	ID        int       `json:"id"`
	UserID    int       `json:"user_id"`
	Name      string    `json:"name"`
	Key       string    `json:"key"`
	Usage     int       `json:"usage"`
	CreatedAt time.Time `json:"created_at"`
}