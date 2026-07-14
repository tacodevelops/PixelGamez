package controllers

import (
	"context"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func GetFriends(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	
	ctx := context.Background()
	
	// Get follows
	follows, err := database.Client.Follow.FindMany(
		db.Follow.FollowerID.Equals(userId),
	).With(
		db.Follow.Following.Fetch(),
	).Exec(ctx)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch friends"})
	}
	
	// Also get followers to determine mutual friends
	followers, _ := database.Client.Follow.FindMany(
		db.Follow.FollowingID.Equals(userId),
	).With(
		db.Follow.Follower.Fetch(),
	).Exec(ctx)
	
	followersMap := make(map[string]bool)
	for _, f := range followers {
		followersMap[f.Follower().ID] = true
	}
	
	var friends []map[string]interface{}
	for _, f := range follows {
		followingUser := f.Following()
		isMutual := followersMap[followingUser.ID]
		
		friends = append(friends, map[string]interface{}{
			"id":          followingUser.ID,
			"playerId":    followingUser.PlayerID,
			"displayName": followingUser.DisplayName,
			"avatarUrl":   followingUser.AvatarURL,
			"bannerUrl":   followingUser.BannerURL,
			"country":     followingUser.Country,
			"isMutual":    isMutual,
		})
	}
	
	if friends == nil {
		friends = []map[string]interface{}{}
	}
	
	return c.JSON(fiber.Map{
		"friends": friends,
	})
}

func GetFriendshipStatus(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	targetId := c.Params("targetId")
	
	if userId == targetId {
		return c.JSON(fiber.Map{"status": "self"})
	}
	
	ctx := context.Background()
	
	isFollowing, _ := database.Client.Follow.FindFirst(
		db.Follow.FollowerID.Equals(userId),
		db.Follow.FollowingID.Equals(targetId),
	).Exec(ctx)
	
	isFollowedBy, _ := database.Client.Follow.FindFirst(
		db.Follow.FollowerID.Equals(targetId),
		db.Follow.FollowingID.Equals(userId),
	).Exec(ctx)
	
	status := "none"
	if isFollowing != nil && isFollowedBy != nil {
		status = "friends"
	} else if isFollowing != nil {
		status = "following"
	} else if isFollowedBy != nil {
		status = "followed_by"
	}
	
	return c.JSON(fiber.Map{"status": status})
}

func FollowUser(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	targetId := c.Params("targetId")
	
	if userId == targetId {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Cannot follow yourself"})
	}
	
	ctx := context.Background()
	
	// Check if already following
	existing, _ := database.Client.Follow.FindFirst(
		db.Follow.FollowerID.Equals(userId),
		db.Follow.FollowingID.Equals(targetId),
	).Exec(ctx)
	
	if existing != nil {
		return c.JSON(fiber.Map{"success": true, "follow": existing})
	}
	
	follow, err := database.Client.Follow.CreateOne(
		db.Follow.Follower.Link(db.User.ID.Equals(userId)),
		db.Follow.Following.Link(db.User.ID.Equals(targetId)),
	).Exec(ctx)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to follow"})
	}
	
	return c.JSON(fiber.Map{"success": true, "follow": follow})
}

func UnfollowUser(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	targetId := c.Params("targetId")
	
	ctx := context.Background()
	
	existing, _ := database.Client.Follow.FindFirst(
		db.Follow.FollowerID.Equals(userId),
		db.Follow.FollowingID.Equals(targetId),
	).Exec(ctx)
	
	if existing != nil {
		database.Client.Follow.FindUnique(
			db.Follow.ID.Equals(existing.ID),
		).Delete().Exec(ctx)
	}
	
	return c.JSON(fiber.Map{"success": true})
}
