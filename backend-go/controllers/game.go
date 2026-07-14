package controllers

import (
	"context"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"strings"
	"sync"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

var (
	playsCache      map[string]int
	playsCacheMutex sync.RWMutex
	playsCacheTime  time.Time
)

func GetGamePlays(c *fiber.Ctx) error {
	playsCacheMutex.RLock()
	if playsCache != nil && time.Since(playsCacheTime) < 10*time.Second {
		defer playsCacheMutex.RUnlock()
		return c.JSON(playsCache)
	}
	playsCacheMutex.RUnlock()

	playsCacheMutex.Lock()
	defer playsCacheMutex.Unlock()

	// Double check
	if playsCache != nil && time.Since(playsCacheTime) < 10*time.Second {
		return c.JSON(playsCache)
	}

	games, err := database.Client.Game.FindMany().Select(
		db.Game.ID.Field(),
		db.Game.Plays.Field(),
	).Exec(context.Background())
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch plays"})
	}
	
	playsMap := make(map[string]int)
	for _, game := range games {
		playsMap[game.ID] = game.Plays
	}
	
	playsCache = playsMap
	playsCacheTime = time.Now()
	
	return c.JSON(playsMap)
}

func TrackGamePlay(c *fiber.Ctx) error {
	gameId := c.Params("id")
	
	_, err := database.Client.Game.FindUnique(
		db.Game.ID.Equals(gameId),
	).Update(
		db.Game.Plays.Increment(1),
	).Exec(context.Background())
	
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to track play"})
	}
	
	return c.JSON(fiber.Map{"success": true})
}

func ProxyGame(c *fiber.Ctx) error {
	targetUrlStr := c.Query("url")
	if targetUrlStr == "" {
		return c.Status(fiber.StatusBadRequest).SendString("URL required")
	}
	
	targetUrl, err := url.Parse(targetUrlStr)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).SendString("Invalid URL")
	}
	
	client := &http.Client{}
	req, err := http.NewRequest("GET", targetUrlStr, nil)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to create request")
	}
	
	req.Header.Set("Referer", "https://itch.io/")
	req.Header.Set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")
	
	resp, err := client.Do(req)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Proxy error")
	}
	defer resp.Body.Close()
	
	if resp.StatusCode != http.StatusOK {
		return c.Status(resp.StatusCode).SendString("Proxy error")
	}
	
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).SendString("Failed to read response body")
	}
	html := string(bodyBytes)
	
	baseUrlStr := targetUrl.Scheme + "://" + targetUrl.Host + targetUrl.Path
	if !strings.HasSuffix(baseUrlStr, "/") {
		lastSlashIdx := strings.LastIndex(baseUrlStr, "/")
		if lastSlashIdx != -1 && lastSlashIdx > 8 { // skip "https://"
			baseUrlStr = baseUrlStr[:lastSlashIdx+1]
		} else {
			baseUrlStr += "/"
		}
	}
	
	injectCss := "<style>\nhtml, body { width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; overflow: hidden !important; background-color: #000 !important; }\ncanvas, #canvas-container, #unity-container, #game-container, iframe { width: 100% !important; height: 100% !important; max-width: none !important; max-height: none !important; margin: 0 !important; object-fit: contain !important; }\n</style>"
	
	headTag := "<head>"
	headReplacement := "<head><base href=\"" + baseUrlStr + "\">" + injectCss
	if strings.Contains(strings.ToLower(html), headTag) {
		html = strings.Replace(html, headTag, headReplacement, 1)
	} else {
		html = headReplacement + "</head>" + html
	}
	
	re := regexp.MustCompile("(?i)<script[^>]*src=[\"']https://static\\.itch\\.io/htmlgame\\.js[\"'][^>]*></script>")
	html = re.ReplaceAllString(html, "")
	
	c.Set("Content-Type", "text/html")
	return c.SendString(html)
}
