package usecase

import "backend/domain"

type GoldUsecase struct {}

func NewGoldUsecase() *GoldUsecase {
	return &GoldUsecase{}
}

// เช็คว่า User อยู่ Tier ไหน แล้วให้ข้อมูลตามนั้น
func (u *GoldUsecase) GetFeaturesByTier(planID int) domain.PremiumFeatures {
	features := domain.PremiumFeatures{Tier: planID}

	if planID >= 2 { // Plus & Pro ได้ค่ากำเหน็จ
		features.TopShops = []domain.ShopMargin{
			{ShopName: "ฮั่วเซ่งเฮง", Margin: 100},
			{ShopName: "ออโรร่า", Margin: 150},
		}
		// จำลองข้อมูลย้อนหลัง
		features.Historical = []float64{39000, 39500, 40000, 41000} 
	}

	if planID == 3 { // Pro เท่านั้นที่ได้ AI Sentiment
		features.Prediction = 41200
		features.NewsSentiment = domain.Sentiment{
			Score:  -5,
			Reason: "มีความตึงเครียดในตะวันออกกลาง (War Risk)",
		}
	}

	return features
}