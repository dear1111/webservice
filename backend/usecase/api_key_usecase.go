package usecase

import (
	"backend/domain"
	"backend/repository"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"math"
	"net/http"
	"sync" // 🌟 นำเข้า sync สำหรับทำ Cache
	"time"
)

// 🌟 ตัวแปร Global สำหรับเก็บ Cache ราคา
var (
	cachedGoldPrice map[string]interface{}
	lastFetchTime   time.Time
	cacheMutex      sync.Mutex
	cacheDuration   = 1 * time.Minute // ตั้งเวลาจำข้อมูลไว้ 1 นาที
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

func (u *APIKeyUsecase) GetGoldPrices(keyString string) (map[string]interface{}, error) {
	// 1. ตรวจสอบ Key ก่อนว่ามีในระบบไหม
	_, err := u.APIKeyRepo.GetByKey(keyString)
	if err != nil {
		return nil, errors.New("API Key ไม่ถูกต้อง")
	}

	// 🚀 --- ระบบ Cache ทำงานตรงนี้ ---
	cacheMutex.Lock()
	// ถ้ามีข้อมูลที่จำไว้ และยังไม่หมดอายุ 1 นาที
	if cachedGoldPrice != nil && time.Since(lastFetchTime) < cacheDuration {
		cacheMutex.Unlock() // ปลดล็อก
		
		// ตัดโควต้า User เพราะดึงข้อมูลสำเร็จจาก Cache
		_ = u.APIKeyRepo.IncrementUsage(keyString)
		return cachedGoldPrice, nil
	}
	cacheMutex.Unlock() // ปลดล็อกแล้วให้มันวิ่งไปดึงของใหม่ต่อ
	// ------------------------------

	// 2. ดึงราคาจาก CoinGecko 
	client := &http.Client{Timeout: 10 * time.Second}
	resp, err := client.Get("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=thb")
	if err != nil {
		return nil, errors.New("ภายนอกขัดข้อง: " + err.Error())
	}
	defer resp.Body.Close()

	if resp.StatusCode == http.StatusTooManyRequests {
		return nil, errors.New("ถูกจำกัดการเข้าถึงจากแหล่งข้อมูล (Rate Limit) โปรดรอสักครู่")
	} else if resp.StatusCode != http.StatusOK {
		return nil, errors.New("ไม่สามารถดึงข้อมูลราคาได้ในขณะนี้")
	}

	var result map[string]map[string]float64
	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		return nil, errors.New("อ่านข้อมูลราคาไม่ได้")
	}

	// 3. ตรวจสอบข้อมูล
	pricePerOunce, exists := result["pax-gold"]["thb"]
	if !exists || pricePerOunce == 0 {
		return nil, errors.New("ไม่ได้รับข้อมูลราคาจากแหล่งข้อมูล")
	}

	// 4. คำนวณราคา
	pricePerBaht := (pricePerOunce / 31.1035) * 15.244
	finalPrice := math.Round(pricePerBaht/10) * 10

	newPriceData := map[string]interface{}{
		"buy_price":  finalPrice,
		"sell_price": finalPrice + 100,
		"currency":   "THB",
		"unit":       "1 Baht Gold (15.244g)",
		"timestamp":  time.Now().Format(time.RFC3339),
	}

	// 🚀 --- บันทึกข้อมูลลง Cache ---
	cacheMutex.Lock()
	cachedGoldPrice = newPriceData
	lastFetchTime = time.Now()
	cacheMutex.Unlock()
	// ----------------------------

	// อัปเดต Usage เมื่อดึงข้อมูลจากเว็บนอกสำเร็จ
	_ = u.APIKeyRepo.IncrementUsage(keyString)

	return newPriceData, nil
}