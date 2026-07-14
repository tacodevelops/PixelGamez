package controllers

import (
	"context"
	"strconv"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func SearchUsers(c *fiber.Ctx) error {
	q := c.Query("q")
	if q == "" {
		return c.JSON([]interface{}{})
	}
	
	users, err := database.Client.User.FindMany(
		db.User.DisplayName.Contains(q), // Note: case sensitive in typical DB without special care
	).Select(
		db.User.ID.Field(),
		db.User.DisplayName.Field(),
		db.User.AvatarURL.Field(),
	).Take(10).Exec(context.Background())
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Search failed"})
	}
	
	var result []map[string]interface{}
	for _, user := range users {
		result = append(result, map[string]interface{}{
			"id":          user.ID,
			"displayName": user.DisplayName,
			"avatarUrl":   user.AvatarURL,
		})
	}
	
	if len(result) == 0 {
		return c.JSON([]interface{}{})
	}
	
	return c.JSON(result)
}

func GetUser(c *fiber.Ctx) error {
	idParam := c.Params("id")
	
	var user *db.UserModel
	var err error
	
	if playerId, parseErr := strconv.Atoi(idParam); parseErr == nil {
		user, err = database.Client.User.FindFirst(
			db.User.PlayerID.Equals(playerId),
		).With(
			db.User.FavoriteGames.Fetch(),
		).Exec(context.Background())
	} else {
		user, err = database.Client.User.FindUnique(
			db.User.ID.Equals(idParam),
		).With(
			db.User.FavoriteGames.Fetch(),
		).Exec(context.Background())
	}
	
	if err != nil || user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found."})
	}
	
	ctx := context.Background()
	followers, _ := database.Client.Follow.FindMany(
		db.Follow.FollowingID.Equals(user.ID),
	).Exec(ctx)
	followersCount := len(followers)
	
	following, _ := database.Client.Follow.FindMany(
		db.Follow.FollowerID.Equals(user.ID),
	).Exec(ctx)
	followingCount := len(following)
	
	allSubmissions, _ := database.Client.Submission.FindMany(
		db.Submission.UserID.Equals(user.ID),
		db.Submission.Status.Equals("approved"),
	).Exec(ctx)
	
	var submissions []map[string]interface{}
	for _, sub := range allSubmissions {
		submissions = append(submissions, map[string]interface{}{
			"id":               sub.ID,
			"title":            sub.Title,
			"description":      sub.Description,
			"category":         sub.Category,
			"gameType":         sub.GameType,
			"embedUrl":         sub.EmbedURL,
			"thumbnail":        sub.Thumbnail,
			"thumbnailFileUrl": sub.ThumbnailFileURL,
			"bannerUrl":        sub.BannerURL,
		})
	}
	
	if submissions == nil {
		submissions = []map[string]interface{}{}
	}
	
	favGameIds := []string{}
	for _, fg := range user.FavoriteGames() {
		favGameIds = append(favGameIds, fg.ID)
	}
	
	return c.JSON(fiber.Map{
		"user": fiber.Map{
			"id":                  user.ID,
			"playerId":            user.PlayerID,
			"displayName":         user.DisplayName,
			"avatarUrl":           user.AvatarURL,
			"bannerUrl":           user.BannerURL,
			"country":             user.Country,
			"aboutMe":             user.AboutMe,
			"workingOn":           user.WorkingOn,
			"recentGames":         user.RecentGames,
			"createdAt":           user.CreatedAt.Format(time.RFC3339),
			"favoriteGames":       favGameIds,
		},
		"submissions":    submissions,
		"followersCount": followersCount,
		"followingCount": followingCount,
	})
}

func LookupUser(c *fiber.Ctx) error {
	name := c.Params("name")
	
	user, err := database.Client.User.FindFirst(
		db.User.DisplayName.Equals(name), // Note: case sensitive without raw sql
	).Exec(context.Background())
	
	if err != nil || user == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found."})
	}
	
	idToReturn := user.ID
	if user.PlayerID != 0 {
		return c.JSON(fiber.Map{
			"id":          user.PlayerID,
			"displayName": user.DisplayName,
		})
	}
	
	return c.JSON(fiber.Map{
		"id":          idToReturn,
		"displayName": user.DisplayName,
	})
}
