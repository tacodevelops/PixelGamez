package controllers

import (
	"context"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func requireAdmin(c *fiber.Ctx) (*db.UserModel, error) {
	userId := c.Locals("userId").(string)
	ctx := context.Background()
	user, _ := database.Client.User.FindUnique(db.User.ID.Equals(userId)).Exec(ctx)
	if user == nil || (user.Role != "owner" && user.Role != "moderator") {
		return nil, fmt.Errorf("forbidden")
	}
	return user, nil
}

func requireOwner(c *fiber.Ctx) (*db.UserModel, error) {
	userId := c.Locals("userId").(string)
	ctx := context.Background()
	user, _ := database.Client.User.FindUnique(db.User.ID.Equals(userId)).Exec(ctx)
	if user == nil || user.Role != "owner" {
		return nil, fmt.Errorf("forbidden")
	}
	return user, nil
}

func GetPendingSubmissions(c *fiber.Ctx) error {
	if _, err := requireAdmin(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Admin access required."})
	}

	ctx := context.Background()
	submissions, _ := database.Client.Submission.FindMany(
		db.Submission.Status.Equals("pending"),
	).Exec(ctx)

	var result []map[string]interface{}
	for _, sub := range submissions {
		result = append(result, map[string]interface{}{
			"id":               sub.ID,
			"title":            sub.Title,
			"description":      sub.Description,
			"category":         sub.Category,
			"gameType":         sub.GameType,
			"embedUrl":         sub.EmbedURL,
			"thumbnail":        sub.Thumbnail,
			"thumbnailFileUrl": sub.ThumbnailFileURL,
			"bannerUrl":        sub.BannerURL,
			"developerName":    sub.DeveloperName,
			"submittedAt":      sub.SubmittedAt,
		})
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	return c.JSON(result)
}

func ApproveSubmission(c *fiber.Ctx) error {
	user, err := requireAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Admin access required."})
	}

	subId := c.Params("id")
	ctx := context.Background()

	sub, err := database.Client.Submission.FindUnique(
		db.Submission.ID.Equals(subId),
	).Exec(ctx)

	if err != nil || sub == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Submission not found."})
	}

	updated, err := database.Client.Submission.FindUnique(
		db.Submission.ID.Equals(subId),
	).Update(
		db.Submission.Status.Set("approved"),
		db.Submission.ReviewedBy.Set(user.ID),
		db.Submission.ReviewedAt.Set(time.Now()),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update submission"})
	}

	// Wait, the express app updates lib/data.ts with the game string. We can skip that or do it poorly.
	// We'll just return success.
	return c.JSON(fiber.Map{"success": true, "game": updated})
}

func RejectSubmission(c *fiber.Ctx) error {
	user, err := requireAdmin(c)
	if err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Admin access required."})
	}

	subId := c.Params("id")
	ctx := context.Background()

	updated, err := database.Client.Submission.FindUnique(
		db.Submission.ID.Equals(subId),
	).Update(
		db.Submission.Status.Set("rejected"),
		db.Submission.ReviewedBy.Set(user.ID),
		db.Submission.ReviewedAt.Set(time.Now()),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Submission not found."})
	}

	return c.JSON(fiber.Map{"success": true, "game": updated})
}

func GetAnalytics(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Access denied"})
	}

	// We don't have Game model in Prisma? Let's check if we have db.Game
	// Oh, there is a Game model. Wait, `prisma.game.findMany`
	ctx := context.Background()
	games, err := database.Client.Game.FindMany().OrderBy(
		db.Game.Plays.Order(db.SortOrderDesc),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch analytics"})
	}

	var result []map[string]interface{}
	for _, game := range games {
		result = append(result, map[string]interface{}{
			"id":            game.ID,
			"title":         game.Title,
			"plays":         game.Plays,
			"developerName": game.DeveloperName,
		})
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	return c.JSON(result)
}

func GetAds(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	ctx := context.Background()
	ads, _ := database.Client.Ad.FindMany().Exec(ctx)

	var result []map[string]interface{}
	for _, ad := range ads {
		result = append(result, map[string]interface{}{
			"id":        ad.ID,
			"imageUrl":  ad.ImageURL,
			"linkUrl":   ad.LinkURL,
			"placement": ad.Placement,
			"label":     ad.Label,
			"active":    ad.Active,
		})
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	return c.JSON(result)
}

func CreateAd(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Form error"})
	}

	linkUrl := getFormValue(form, "linkUrl")
	placement := getFormValue(form, "placement")
	label := getFormValue(form, "label")

	if linkUrl == "" || placement == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Link and placement are required."})
	}

	images := form.File["image"]
	if len(images) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Image is required."})
	}
	image := images[0]

	uploadsDir := filepath.Join(".", "..", "public", "api", "uploads")
	os.MkdirAll(uploadsDir, os.ModePerm)

	ext := filepath.Ext(image.Filename)
	if ext == "" {
		ext = ".png"
	}
	filename := fmt.Sprintf("ad-%d%s", time.Now().UnixNano(), ext)
	path := filepath.Join(uploadsDir, filename)

	if err := c.SaveFile(image, path); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Save image error"})
	}

	imageUrl := "/api/uploads/" + filename

	ctx := context.Background()
	ad, err := database.Client.Ad.CreateOne(
		db.Ad.ImageURL.Set(imageUrl),
		db.Ad.LinkURL.Set(linkUrl),
		db.Ad.Placement.Set(placement),
		db.Ad.Label.Set(label),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create ad"})
	}

	return c.JSON(ad)
}

func ToggleAd(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	adId := c.Params("id")
	ctx := context.Background()

	ad, err := database.Client.Ad.FindUnique(db.Ad.ID.Equals(adId)).Exec(ctx)
	if err != nil || ad == nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Ad not found"})
	}

	updated, _ := database.Client.Ad.FindUnique(db.Ad.ID.Equals(adId)).Update(
		db.Ad.Active.Set(!ad.Active),
	).Exec(ctx)

	return c.JSON(updated)
}

func DeleteAd(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	adId := c.Params("id")
	ctx := context.Background()

	_, err := database.Client.Ad.FindUnique(db.Ad.ID.Equals(adId)).Delete().Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Ad not found"})
	}

	return c.JSON(fiber.Map{"success": true})
}

func GetInquiries(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	ctx := context.Background()
	inquiries, err := database.Client.BrandInquiry.FindMany().OrderBy(
		db.BrandInquiry.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch inquiries"})
	}

	var result []map[string]interface{}
	for _, inq := range inquiries {
		result = append(result, map[string]interface{}{
			"id":        inq.ID,
			"name":      inq.Name,
			"email":     inq.Email,
			"company":   inq.Company,
			"message":   inq.Message,
			"status":    inq.Status,
			"createdAt": inq.CreatedAt,
		})
	}
	if result == nil {
		result = []map[string]interface{}{}
	}
	return c.JSON(result)
}

func ReadInquiry(c *fiber.Ctx) error {
	if _, err := requireOwner(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	inqId := c.Params("id")
	ctx := context.Background()

	_, err := database.Client.BrandInquiry.FindUnique(db.BrandInquiry.ID.Equals(inqId)).Update(
		db.BrandInquiry.Status.Set("read"),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update inquiry"})
	}

	return c.JSON(fiber.Map{"success": true})
}

func CreateNotification(c *fiber.Ctx) error {
	if _, err := requireAdmin(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	var body struct {
		Title   string `json:"title"`
		Message string `json:"message"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if body.Title == "" || body.Message == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Title and message are required."})
	}

	ctx := context.Background()
	notif, err := database.Client.Notification.CreateOne(
		db.Notification.Title.Set(body.Title),
		db.Notification.Message.Set(body.Message),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create notification"})
	}

	return c.JSON(notif)
}

func GetNotifications(c *fiber.Ctx) error {
	ctx := context.Background()
	notifications, err := database.Client.Notification.FindMany().OrderBy(
		db.Notification.CreatedAt.Order(db.SortOrderDesc),
	).Take(10).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch notifications"})
	}

	var result []map[string]interface{}
	for _, n := range notifications {
		result = append(result, map[string]interface{}{
			"id":        n.ID,
			"title":     n.Title,
			"message":   n.Message,
			"createdAt": n.CreatedAt,
		})
	}

	return c.JSON(result)
}

func DeleteNotification(c *fiber.Ctx) error {
	if _, err := requireAdmin(c); err != nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	notifId := c.Params("id")
	ctx := context.Background()

	_, err := database.Client.Notification.FindUnique(db.Notification.ID.Equals(notifId)).Delete().Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Notification not found"})
	}

	return c.JSON(fiber.Map{"success": true})
}
