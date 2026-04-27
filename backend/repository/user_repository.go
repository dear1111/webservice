package repository

import (
	"database/sql"
	"backend/domain" // สมมติว่า module ของคุณชื่อ backend
)

type UserRepository struct {
	DB *sql.DB
}

func NewUserRepository(db *sql.DB) *UserRepository {
	return &UserRepository{DB: db}
}

// 1. สมัครสมาชิก (Register) - ตรงกับ 'INSERT INTO users...'
func (r *UserRepository) Create(user *domain.User) error {
	query := `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, created_at, plan_id`
	// บันทึกและดึงค่าที่ Database สร้างให้ (id, created_at) กลับมาใส่ใน struct
	err := r.DB.QueryRow(query, user.Email, user.Password).Scan(&user.ID, &user.CreatedAt, &user.PlanID)
	return err
}

// 2. ค้นหาผู้ใช้ด้วยอีเมล (Login) - ตรงกับ 'SELECT * FROM users WHERE email...'
func (r *UserRepository) GetByEmail(email string) (*domain.User, error) {
	query := `SELECT id, email, password, plan_id, created_at FROM users WHERE email = $1`
	row := r.DB.QueryRow(query, email)

	var user domain.User
	err := row.Scan(&user.ID, &user.Email, &user.Password, &user.PlanID, &user.CreatedAt)
	if err != nil {
		return nil, err // ถ้าไม่เจอ user หรือ error ให้ส่ง nil กลับไป
	}
	return &user, nil
}

// 3. เปลี่ยนรหัสผ่าน (Reset Password)
func (r *UserRepository) UpdatePassword(email, newPassword string) error {
	query := `UPDATE users SET password = $1 WHERE email = $2`
	_, err := r.DB.Exec(query, newPassword, email)
	return err
}

// 4. อัปเกรด Plan (Upgrade Plan)
func (r *UserRepository) UpdatePlan(userID, planID int) error {
	query := `UPDATE users SET plan_id = $1 WHERE id = $2`
	_, err := r.DB.Exec(query, planID, userID)
	return err
}