package main

import (
	"pixelgamez-backend/controllers"
	"pixelgamez-backend/middleware"

	"github.com/gofiber/fiber/v2"
)

func setupAuthRoutes(api fiber.Router) {
	auth := api.Group("/auth")

	auth.Post("/register", controllers.Register)
	auth.Post("/login", controllers.Login)
	auth.Post("/logout", controllers.Logout)
	
	// Protected routes
	auth.Get("/me", middleware.RequireAuth, controllers.GetMe)
	
	// TODO: implement other auth routes (google, avatar, banner, profile, bio, favorite, etc.)
}

func setupGameRoutes(api fiber.Router) {
	games := api.Group("/games")
	
	games.Get("/plays", controllers.GetGamePlays)
	games.Post("/:id/play", controllers.TrackGamePlay)
	
	// proxy-game is top-level in original app
	api.Get("/proxy-game", controllers.ProxyGame)
}

func setupUserRoutes(api fiber.Router) {
	users := api.Group("/users")
	
	users.Get("/search", controllers.SearchUsers)
	users.Get("/lookup/:name", controllers.LookupUser)
	users.Get("/:id", controllers.GetUser)
}

func setupFriendRoutes(api fiber.Router) {
	friends := api.Group("/friends")
	
	friends.Get("/", middleware.RequireAuth, controllers.GetFriends)
	friends.Get("/status/:targetId", middleware.RequireAuth, controllers.GetFriendshipStatus)
	friends.Post("/follow/:targetId", middleware.RequireAuth, controllers.FollowUser)
	friends.Post("/unfollow/:targetId", middleware.RequireAuth, controllers.UnfollowUser)
}

func setupDeveloperRoutes(api fiber.Router) {
	developer := api.Group("/developer")
	
	developer.Get("/games", controllers.GetDeveloperGames)
	developer.Get("/my-games", middleware.RequireAuth, controllers.GetMyGames)
	developer.Post("/submit", middleware.RequireAuth, controllers.SubmitGame)
}

func setupAdminRoutes(api fiber.Router) {
	admin := api.Group("/admin", middleware.RequireAuth)
	
	admin.Get("/pending", controllers.GetPendingSubmissions)
	admin.Post("/approve/:id", controllers.ApproveSubmission)
	admin.Post("/reject/:id", controllers.RejectSubmission)
	
	admin.Get("/analytics", controllers.GetAnalytics)
	// admin.Get("/analytics/:id", controllers.GetAnalyticsSingle) // Not implemented for now
	
	admin.Get("/ads", controllers.GetAds)
	admin.Post("/ads", controllers.CreateAd)
	admin.Post("/ads/:id/toggle", controllers.ToggleAd)
	admin.Delete("/ads/:id", controllers.DeleteAd)
	
	admin.Post("/notifications", controllers.CreateNotification)
	admin.Delete("/notifications/:id", controllers.DeleteNotification)
	
	admin.Get("/inquiries", controllers.GetInquiries)
	admin.Post("/inquiries/:id/read", controllers.ReadInquiry)

	api.Get("/notifications", middleware.RequireAuth, controllers.GetNotifications)
}

func setupChatRoutes(api fiber.Router) {
	chat := api.Group("/chat", middleware.RequireAuth)
	
	chat.Get("/conversations", controllers.GetConversations)
	chat.Post("/conversations", controllers.CreateConversation)
	chat.Get("/messages/:conversationId", controllers.GetMessages)
	chat.Post("/messages", controllers.CreateMessage)
}

