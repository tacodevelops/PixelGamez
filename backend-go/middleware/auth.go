package middleware

import (
	"pixelgamez-backend/utils"

	"github.com/gofiber/fiber/v2"
)

func RequireAuth(c *fiber.Ctx) error {
	token := c.Cookies(utils.SessionCookieName)
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	session, err := utils.GetSession(token)
	if err != nil || session == nil {
		c.ClearCookie(utils.SessionCookieName)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid session"})
	}

	c.Locals("userId", session.UserID)
	c.Locals("sessionToken", session.Token)
	return c.Next()
}
