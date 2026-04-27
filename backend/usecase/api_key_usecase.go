package usecase

import (
	"backend/domain"
	"backend/repository"
	"crypto/rand"
	"encoding/hex"
	"encoding/json" // สำคัญมาก
	"errors"
	"math"          // ใช้สำหรับ Round ราคา
	"net/http"      // สำคัญมาก
	"time"
)

type APIKeyUsecase struct {
	APIKeyRepo *repository.APIKeyRepository
}

func NewAPIKeyUsecase(repo *repository.APIKeyRepository) *APIKeyUsecase {
	return &APIKeyUsecase{APIKeyRepo: repo}
}

func generateRandomKey() string {
	bytes := make([]byte, 16)
	rand.Read(bytes)
	return "aurum_index_" + hex.EncodeToString(bytes)
}

func (u *APIKeyUsecase) CreateKey(userID int, name string) (*domain.APIKey, error) {
	newKey := generateRandomKey()
	apiKey := &domain.APIKey{
		UserID: userID,
		Name:   name,
		Key:    newKey,
	}
	err := u.APIKeyRepo.Create(apiKey)
	if err != nil {
		return nil, errors.New("ไม่สามารถบันทึก API Key ได้")
	}
	return apiKey, nil
}

func (u *APIKeyUsecase) GetKeysByUser(userID int) ([]domain.APIKey, error) {
	return u.APIKeyRepo.GetByUserID(userID)
}

// ฟังก์ชันดึงราคาจริง
func (u *APIKeyUsecase) GetGoldPrices(keyString string) (map[string]interface{}, error) {
	// 1. ตรวจสอบ Key
	_, err := u.APIKeyRepo.GetByKey(keyString)
	if err != nil {
		return nil, errors.New("API Key ไม่ถูกต้อง")
	}
	_ = u.APIKeyRepo.IncrementUsage(keyString)

	// 2. ดึงราคาจาก CoinGecko (PAX Gold)
	// สร้าง Client ที่มี Timeout เพื่อไม่ให้ระบบค้างถ้า API นอกช้า
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=thb")
	if err != nil {
		return nil, errors.New("ภายนอกขัดข้อง: " + err.Error())
	}
	defer resp.Body.Close()

	var result map[string]map[string]float64
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, errors.New("อ่านข้อมูลราคาไม่ได้")
	}

	// 3. คำนวณราคา (Ounce -> บาททอง)
	pricePerOunce := result["pax-gold"]["thb"]
	if pricePerOunce == 0 {
		return nil, errors.New("ไม่ได้รับข้อมูลราคาจากแหล่งข้อมูล")
	}

	// สูตร: (ราคา Ounce / 31.1035) * 15.244
	pricePerBaht := (pricePerOunce / 31.1035) * 15.244
	
	// ปัดเศษหลักสิบตามราคาทองไทย (เช่น 40652 -> 40650)
	finalPrice := math.Round(pricePerBaht/10) * 10

	return map[string]interface{}{
		"buy_price":  finalPrice,
		"sell_price": finalPrice + 100,
		"currency":   "THB",
		"unit":       "1 Baht Gold (15.244g)",
		"timestamp":  time.Now().Format(time.RFC3339),
	}, nil
}