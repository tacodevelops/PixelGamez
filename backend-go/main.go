package main

import (
	"log"

	"pixelgamez-backend/database"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/joho/godotenv"
)

func main() {
	// Load .env file if it exists
	if err := godotenv.Load("../.env"); err != nil {
		log.Println("No .env file found, relying on environment variables")
	}

	// Connect to database
	database.Connect()
	defer database.Disconnect()

	app := fiber.New(fiber.Config{
		BodyLimit: 50 * 1024 * 1024, // 50MB limit for file uploads
	})

	// Middleware
	app.Use(logger.New())
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:3000, https://pixelgamez.com",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	}))

	// API Routes Group
	api := app.Group("/api")

	api.Get("/health", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{"status": "ok", "message": "Golang Backend is running!"})
	})

	// TODO: Register controllers here
	setupAuthRoutes(api)
	setupGameRoutes(api)
	setupUserRoutes(api)
	setupFriendRoutes(api)
	setupDeveloperRoutes(api)
	setupAdminRoutes(api)
	setupChatRoutes(api)

	log.Fatal(app.Listen(":8080"))
}
