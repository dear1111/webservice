package domain

type ShopMargin struct {
	ShopName string  `json:"shop_name"`
	Margin   float64 `json:"margin"`
}

type Sentiment struct {
	Score  int    `json:"score"` // เช่น +10, -5
	Reason string `json:"reason"`
}

type PremiumFeatures struct {
	Tier          int          `json:"tier"` // 1=Free, 2=Plus, 3=Pro
	Historical    []float64    `json:"historical_1y,omitempty"`
	TopShops      []ShopMargin `json:"top_shops,omitempty"`
	Prediction    float64      `json:"prediction,omitempty"`
	NewsSentiment Sentiment    `json:"news_sentiment,omitempty"`
}
