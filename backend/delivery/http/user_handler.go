package http

import (
	"backend/usecase"
	"github.com/gofiber/fiber/v2"
)

type UserHandler struct {
	UserUsecase *usecase.UserUsecase
}

func NewUserHandler(app *fiber.App, us *usecase.UserUsecase) {
	handler := &UserHandler{UserUsecase: us}

	// ผูก Route เข้ากับฟังก์ชัน
	api := app.Group("/api")
	api.Post("/register", handler.Register)
	api.Post("/login", handler.Login)
	api.Put("/reset-password", handler.ResetPassword)
	api.Put("/upgrade-plan", handler.UpgradePlan)
}

func (h *UserHandler) Register(c *fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	user, err := h.UserUsecase.Register(body.Email, body.Password)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "อีเมลนี้ถูกใช้ไปแล้ว หรือมีข้อผิดพลาด"})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "สมัครสมาชิกสำเร็จ!",
		"user":    user,
	})
}

func (h *UserHandler) Login(c *fiber.Ctx) error {
	var body struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	user, err := h.UserUsecase.Login(body.Email, body.Password)
	if err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": err.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{
		"message": "เข้าสู่ระบบสำเร็จ!",
		"user":    fiber.Map{"id": user.ID, "email": user.Email},
	})
}

func (h *UserHandler) ResetPassword(c *fiber.Ctx) error {
	var body struct {
		Email       string `json:"email"`
		NewPassword string `json:"newPassword"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	err := h.UserUsecase.ResetPassword(body.Email, body.NewPassword)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "ไม่พบอีเมลนี้ในระบบครับ"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "เปลี่ยนรหัสผ่านสำเร็จแล้ว!"})
}

func (h *UserHandler) UpgradePlan(c *fiber.Ctx) error {
	var body struct {
		UserID int `json:"userId"`
		PlanID int `json:"planId"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "ข้อมูลไม่ถูกต้อง"})
	}

	err := h.UserUsecase.UpgradePlan(body.UserID, body.PlanID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Server error"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"success": true})
}