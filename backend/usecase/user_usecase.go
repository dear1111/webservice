package usecase

import (
	"errors"
	"backend/domain"
	"backend/repository"
)

type UserUsecase struct {
	UserRepo *repository.UserRepository
}

func NewUserUsecase(repo *repository.UserRepository) *UserUsecase {
	return &UserUsecase{UserRepo: repo}
}

// 1. ลอจิกการสมัครสมาชิก
func (u *UserUsecase) Register(email, password string) (*domain.User, error) {
	user := &domain.User{
		Email:    email,
		Password: password,
	}
	
	err := u.UserRepo.Create(user)
	if err != nil {
		// ถ้ามี Error เกิดขึ้น (เช่น Email ซ้ำ) ให้โยน Error กลับไปให้ Handler จัดการต่อ
		return nil, err
	}
	return user, nil
}

// 2. ลอจิกการล็อกอิน (เช็คอีเมล และรหัสผ่าน)
func (u *UserUsecase) Login(email, password string) (*domain.User, error) {
	// ไปหาอีเมลใน Database
	user, err := u.UserRepo.GetByEmail(email)
	if err != nil {
		return nil, errors.New("อีเมลหรือรหัสผ่านไม่ถูกต้อง") // ไม่เจออีเมลนี้
	}

	// เอารหัสผ่านที่พิมพ์มา เทียบกับรหัสผ่านใน Database
	if user.Password != password {
		return nil, errors.New("อีเมลหรือรหัสผ่านไม่ถูกต้อง") // รหัสไม่ตรง
	}

	return user, nil
}

// 3. ลอจิกรีเซ็ตรหัสผ่าน
func (u *UserUsecase) ResetPassword(email, newPassword string) error {
	return u.UserRepo.UpdatePassword(email, newPassword)
}

// 4. ลอจิกอัปเกรดแพลน
func (u *UserUsecase) UpgradePlan(userID, planID int) error {
	return u.UserRepo.UpdatePlan(userID, planID)
}