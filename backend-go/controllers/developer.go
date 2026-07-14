package controllers

import (
	"archive/zip"
	"context"
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func GetDeveloperGames(c *fiber.Ctx) error {
	ctx := context.Background()
	submissions, err := database.Client.Submission.FindMany(
		db.Submission.Status.Equals("approved"),
	).Exec(ctx)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch games"})
	}
	
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
			"plays":            sub.Plays,
			"rating":           sub.Rating,
		})
	}
	
	if result == nil {
		result = []map[string]interface{}{}
	}
	
	return c.JSON(result)
}

func GetMyGames(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()
	
	submissions, err := database.Client.Submission.FindMany(
		db.Submission.UserID.Equals(userId),
	).Exec(ctx)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch games"})
	}
	
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
			"status":           sub.Status,
			"plays":            sub.Plays,
			"rating":           sub.Rating,
		})
	}
	
	if result == nil {
		result = []map[string]interface{}{}
	}
	
	return c.JSON(result)
}

func SubmitGame(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()
	
	user, _ := database.Client.User.FindUnique(db.User.ID.Equals(userId)).Exec(ctx)
	if user == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not found"})
	}
	
	form, err := c.MultipartForm()
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to parse form"})
	}
	
	title := getFormValue(form, "title")
	description := getFormValue(form, "description")
	category := getFormValue(form, "category")
	gameType := getFormValue(form, "gameType")
	embedUrl := getFormValue(form, "embedUrl")
	thumbnail := getFormValue(form, "thumbnail")
	discordUrl := getFormValue(form, "discordUrl")
	steamUrl := getFormValue(form, "steamUrl")
	
	if title == "" || description == "" || category == "" || gameType == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing required fields."})
	}
	
	finalEmbedUrl := embedUrl
	
	bannerFiles := form.File["bannerFile"]
	if len(bannerFiles) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Game banner is required."})
	}
	bannerFile := bannerFiles[0]
	
	uploadsDir := filepath.Join(".", "..", "public", "api", "uploads")
	os.MkdirAll(uploadsDir, os.ModePerm)
	
	bannerExt := filepath.Ext(bannerFile.Filename)
	if bannerExt == "" {
		bannerExt = ".png"
	}
	bannerFilename := fmt.Sprintf("banner-%d%s", time.Now().UnixNano(), bannerExt)
	bannerPath := filepath.Join(uploadsDir, bannerFilename)
	
	if err := c.SaveFile(bannerFile, bannerPath); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save banner"})
	}
	finalBannerUrl := "/api/uploads/" + bannerFilename
	
	gameFiles := form.File["gameFile"]
	if len(gameFiles) > 0 && gameType == "html" {
		gameFile := gameFiles[0]
		gameId := fmt.Sprintf("game-%d", time.Now().UnixNano())
		gameDir := filepath.Join(".", "..", "public", "community-games", gameId)
		os.MkdirAll(gameDir, os.ModePerm)
		
		ext := strings.ToLower(filepath.Ext(gameFile.Filename))
		if ext == ".zip" {
			zipPath := filepath.Join(gameDir, "game.zip")
			c.SaveFile(gameFile, zipPath)
			unzipFile(zipPath, gameDir)
			finalEmbedUrl = "/community-games/" + gameId + "/index.html"
		} else {
			htmlPath := filepath.Join(gameDir, "index.html")
			c.SaveFile(gameFile, htmlPath)
			finalEmbedUrl = "/community-games/" + gameId + "/index.html"
		}
	}
	
	if finalEmbedUrl == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Upload a game file or provide an embed URL."})
	}
	
	sub, err := database.Client.Submission.CreateOne(
		db.Submission.Title.Set(title),
		db.Submission.Description.Set(description),
		db.Submission.Category.Set(category),
		db.Submission.GameType.Set(gameType),
		db.Submission.EmbedURL.Set(finalEmbedUrl),
		db.Submission.DeveloperName.Set(user.DisplayName),
		db.Submission.Thumbnail.Set(thumbnail),
		db.Submission.BannerURL.Set(finalBannerUrl),
		db.Submission.SteamURL.Set(steamUrl),
		db.Submission.DiscordURL.Set(discordUrl),
		db.Submission.SubmitterEmail.Set(user.Email),
		db.Submission.UserID.Set(user.ID),
	).Exec(ctx)
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to save submission"})
	}
	
	return c.JSON(fiber.Map{"success": true, "submission": fiber.Map{
		"id": sub.ID,
	}})
}

func getFormValue(form *multipart.Form, key string) string {
	if val, ok := form.Value[key]; ok && len(val) > 0 {
		return val[0]
	}
	return ""
}

func unzipFile(src, dest string) error {
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	for _, f := range r.File {
		fpath := filepath.Join(dest, f.Name)
		if !strings.HasPrefix(fpath, filepath.Clean(dest)+string(os.PathSeparator)) {
			continue // Zip slip
		}

		if f.FileInfo().IsDir() {
			os.MkdirAll(fpath, os.ModePerm)
			continue
		}

		if err := os.MkdirAll(filepath.Dir(fpath), os.ModePerm); err != nil {
			return err
		}

		outFile, err := os.OpenFile(fpath, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err != nil {
			return err
		}

		rc, err := f.Open()
		if err != nil {
			outFile.Close()
			return err
		}

		_, err = io.Copy(outFile, rc)
		outFile.Close()
		rc.Close()

		if err != nil {
			return err
		}
	}
	return nil
}
