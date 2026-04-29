package http

import (
	"backend/usecase"
	"strconv"

	"github.com/gofiber/fiber/v2" // 🌟 เปลี่ยนมาใช้ Fiber
)

type GoldHandler struct {
	GoldUsecase *usecase.GoldUsecase
}

// รับค่า app *fiber.App
func NewGoldHandler(app *fiber.App, gu *usecase.GoldUsecase) {
	handler := &GoldHandler{GoldUsecase: gu}
	app.Get("/api/gold/features/:plan_id", handler.GetPremiumData)
}

func (h *GoldHandler) GetPremiumData(c *fiber.Ctx) error {
	planIDStr := c.Params("plan_id")
	planID, err := strconv.Atoi(planIDStr)
	if err != nil {
		return c.Status(400).JSON(fiber.Map{"error": "Invalid Plan ID"})
	}

	data := h.GoldUsecase.GetFeaturesByTier(planID)
	return c.Status(200).JSON(data)
}
