package controllers

import (
	"context"
	"strings"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"
	"pixelgamez-backend/utils"

	"github.com/gofiber/fiber/v2"
)

type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	DisplayName string `json:"displayName"`
	Code        string `json:"code"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(c *fiber.Ctx) error {
	var req RegisterRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Email == "" || req.Password == "" || req.DisplayName == "" || req.Code == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email, password, display name, and code are required."})
	}

	normalizedEmail := strings.TrimSpace(strings.ToLower(req.Email))
	displayName := strings.TrimSpace(req.DisplayName)

	ctx := context.Background()

	// 1. Check existing email
	existingUser, _ := database.Client.User.FindUnique(
		db.User.Email.Equals(normalizedEmail),
	).Exec(ctx)
	if existingUser != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "An account with this email already exists."})
	}

	existingName, _ := database.Client.User.FindFirst(
		db.User.DisplayName.Equals(displayName),
	).Exec(ctx)
	if existingName != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "This display name is already taken."})
	}

	if len(req.Password) < 6 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Password must be at least 6 characters."})
	}

	passwordHash, err := utils.HashPassword(req.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to hash password"})
	}

	role := "user"
	if normalizedEmail == "dahiruhammajam@gmail.com" {
		role = "owner"
	}

	newUser, err := database.Client.User.CreateOne(
		db.User.Email.Set(normalizedEmail),
		db.User.DisplayName.Set(displayName),
		db.User.Role.Set(role),
		db.User.PasswordHash.Set(passwordHash),
	).Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	// Try to delete verification code
	database.Client.VerificationCode.FindUnique(
		db.VerificationCode.Email.Equals(normalizedEmail),
	).Delete().Exec(ctx)

	// Send welcome message
	owner, _ := database.Client.User.FindFirst(db.User.Role.Equals("owner")).Exec(ctx)
	if owner != nil && owner.ID != newUser.ID {
		conv, err := database.Client.Conversation.CreateOne(
			db.Conversation.IsGroup.Set(false),
		).Exec(ctx)
		
		if err == nil {
			database.Client.Participant.CreateOne(
				db.Participant.Conversation.Link(db.Conversation.ID.Equals(conv.ID)),
				db.Participant.User.Link(db.User.ID.Equals(owner.ID)),
			).Exec(ctx)
			database.Client.Participant.CreateOne(
				db.Participant.Conversation.Link(db.Conversation.ID.Equals(conv.ID)),
				db.Participant.User.Link(db.User.ID.Equals(newUser.ID)),
			).Exec(ctx)

			database.Client.Message.CreateOne(
				db.Message.Conversation.Link(db.Conversation.ID.Equals(conv.ID)),
				db.Message.Sender.Link(db.User.ID.Equals(owner.ID)),
				db.Message.Text.Set("Welcome to PixelGamez, " + newUser.DisplayName + "! We're glad to have you here."),
			).Exec(ctx)
		}
	}

	token, err := utils.CreateSession(newUser.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create session"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     utils.SessionCookieName,
		Value:    token,
		HTTPOnly: true,
		MaxAge:   int(utils.SessionMaxAge.Seconds()),
		SameSite: "lax",
		Path:     "/",
	})

	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":          newUser.ID,
			"email":       newUser.Email,
			"displayName": newUser.DisplayName,
			"role":        newUser.Role,
			"avatarUrl":   newUser.AvatarURL,
		},
	})
}

func Login(c *fiber.Ctx) error {
	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request body"})
	}

	if req.Email == "" || req.Password == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email and password are required."})
	}

	normalizedEmail := strings.TrimSpace(strings.ToLower(req.Email))

	user, err := database.Client.User.FindUnique(
		db.User.Email.Equals(normalizedEmail),
	).With(
		db.User.FavoriteGames.Fetch(),
	).Exec(context.Background())

	if err != nil || user == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password."})
	}

	hash, ok := user.PasswordHash()
	if !ok || !utils.CheckPasswordHash(req.Password, hash) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid email or password."})
	}

	token, err := utils.CreateSession(user.ID)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create session"})
	}

	c.Cookie(&fiber.Cookie{
		Name:     utils.SessionCookieName,
		Value:    token,
		HTTPOnly: true,
		MaxAge:   int(utils.SessionMaxAge.Seconds()),
		SameSite: "lax",
		Path:     "/",
	})

	favGameIds := []string{}
	for _, fg := range user.FavoriteGames() {
		favGameIds = append(favGameIds, fg.ID)
	}

	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":            user.ID,
			"email":         user.Email,
			"displayName":   user.DisplayName,
			"role":          user.Role,
			"avatarUrl":     user.AvatarURL,
			"favoriteGames": favGameIds,
			"bannerUrl":     user.BannerURL,
			"country":       user.Country,
		},
	})
}

func Logout(c *fiber.Ctx) error {
	token := c.Cookies(utils.SessionCookieName)
	if token != "" {
		utils.DeleteSession(token)
	}
	
	c.ClearCookie(utils.SessionCookieName)
	return c.JSON(fiber.Map{"success": true})
}

func GetMe(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	
	user, err := database.Client.User.FindUnique(
		db.User.ID.Equals(userId),
	).With(
		db.User.FavoriteGames.Fetch(),
	).Exec(context.Background())
	
	if err != nil || user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}
	
	favGameIds := []string{}
	for _, fg := range user.FavoriteGames() {
		favGameIds = append(favGameIds, fg.ID)
	}
	
	return c.JSON(fiber.Map{
		"id":            user.ID,
		"playerId":      user.PlayerID,
		"email":         user.Email,
		"displayName":   user.DisplayName,
		"role":          user.Role,
		"avatarUrl":     user.AvatarURL,
		"favoriteGames": favGameIds,
		"bannerUrl":     user.BannerURL,
		"country":       user.Country,
		"aboutMe":       user.AboutMe,
		"workingOn":     user.WorkingOn,
		"recentGames":   user.RecentGames,
		"createdAt":     user.CreatedAt.Format(time.RFC3339),
	})
}
