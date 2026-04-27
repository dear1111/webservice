package repository

import (
	"database/sql"
	"backend/domain"
)

type APIKeyRepository struct {
	DB *sql.DB
}

func NewAPIKeyRepository(db *sql.DB) *APIKeyRepository {
	return &APIKeyRepository{DB: db}
}

// 1. สร้าง Key ใหม่ (Create API Key)
func (r *APIKeyRepository) Create(apiKey *domain.APIKey) error {
	query := `INSERT INTO api_keys (user_id, name, key) VALUES ($1, $2, $3) RETURNING id, usage, created_at`
	err := r.DB.QueryRow(query, apiKey.UserID, apiKey.Name, apiKey.Key).Scan(&apiKey.ID, &apiKey.Usage, &apiKey.CreatedAt)
	return err
}

// 2. ดึง Key ทั้งหมดของ User (Get All Keys by UserID)
func (r *APIKeyRepository) GetByUserID(userID int) ([]domain.APIKey, error) {
	query := `SELECT id, user_id, name, key, usage, created_at FROM api_keys WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := r.DB.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close() // อย่าลืมปิด connection หลังคิวรีเสร็จ

	var keys []domain.APIKey
	for rows.Next() {
		var k domain.APIKey
		err := rows.Scan(&k.ID, &k.UserID, &k.Name, &k.Key, &k.Usage, &k.CreatedAt)
		if err != nil {
			return nil, err
		}
		keys = append(keys, k)
	}
	return keys, nil
}

// 3. ค้นหา Key เพื่อใช้งาน (เช็คว่า Key ถูกไหม)
func (r *APIKeyRepository) GetByKey(key string) (*domain.APIKey, error) {
	query := `SELECT id, user_id, name, key, usage, created_at FROM api_keys WHERE key = $1`
	row := r.DB.QueryRow(query, key)

	var k domain.APIKey
	err := row.Scan(&k.ID, &k.UserID, &k.Name, &k.Key, &k.Usage, &k.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &k, nil
}

// 4. เพิ่มยอดการใช้งาน (Update Usage)
func (r *APIKeyRepository) IncrementUsage(key string) error {
	query := `UPDATE api_keys SET usage = usage + 1 WHERE key = $1`
	_, err := r.DB.Exec(query, key)
	return err
}