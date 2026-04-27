package http

import (
	"backend/usecase"
	"backend/domain"
	"github.com/gofiber/fiber/v2"
	"strconv"
)

type APIKeyHandler struct {
	APIKeyUsecase *usecase.APIKeyUsecase
}

func NewAPIKeyHandler(app *fiber.App, us *usecase.APIKeyUsecase) {
	handler := &APIKeyHandler{APIKeyUsecase: us}

	api := app.Group("/api")
	api.Post("/keys", handler.CreateKey)
	api.Get("/keys/:userId", handler.GetKeysByUser)
	api.Get("/gold-prices", handler.GetGoldPrices)
}

func (h *APIKeyHandler) CreateKey(c *fiber.Ctx) error {
	var body struct {
		UserID int    `json:"userId"`
		Name   string `json:"name"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	apiKey, err := h.APIKeyUsecase.CreateKey(body.UserID, body.Name)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(apiKey)
}

func (h *APIKeyHandler) GetKeysByUser(c *fiber.Ctx) error {
	// รับค่า userId จาก URL (params) แล้วแปลงเป็น int
	userIDStr := c.Params("userId")
	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "User ID ไม่ถูกต้อง"})
	}

	keys, err := h.APIKeyUsecase.GetKeysByUser(userID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "ไม่สามารถดึงข้อมูล API Keys ได้"})
	}

	// ถ้าไม่มีคีย์เลย ให้ส่ง Array เปล่าๆ กลับไปแทน null
	if keys == nil {
		keys = make([]domain.APIKey, 0) // *ต้อง import "backend/domain" เพิ่มเติมถ้าใช้บรรทัดนี้
	}

	return c.JSON(keys)
}

func (h *APIKeyHandler) GetGoldPrices(c *fiber.Ctx) error {
	// ดึง Key จาก Header ตามโค้ดเดิมของคุณ
	apiKey := c.Get("x-api-key")
	if apiKey == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "กรุณาแนบ API Key ใน Header (x-api-key)"})
	}

	goldData, err := h.APIKeyUsecase.GetGoldPrices(apiKey)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"success": true,
		"message": "ดึงข้อมูลสำเร็จจาก AurumIndex!",
		"data":    goldData,
	})
}