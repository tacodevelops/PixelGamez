package controllers

import (
	"context"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"

	"github.com/gofiber/fiber/v2"
)

func GetConversations(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()

	conversations, err := database.Client.Conversation.FindMany(
		db.Conversation.Participants.Some(
			db.Participant.UserID.Equals(userId),
		),
	).With(
		db.Conversation.Participants.Fetch().With(
			db.Participant.User.Fetch(),
		),
		db.Conversation.Messages.Fetch().OrderBy(
			db.Message.CreatedAt.Order(db.SortOrderDesc),
		).Take(1),
	).OrderBy(
		db.Conversation.CreatedAt.Order(db.SortOrderDesc),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch conversations"})
	}

	var result []map[string]interface{}
	for _, conv := range conversations {
		var participants []map[string]interface{}
		for _, p := range conv.Participants() {
			user := p.User()
			participants = append(participants, map[string]interface{}{
				"id":     p.ID,
				"userId": p.UserID,
				"user": map[string]interface{}{
					"id":          user.ID,
					"displayName": user.DisplayName,
					"avatarUrl":   user.AvatarURL,
				},
			})
		}

		var messages []map[string]interface{}
		for _, m := range conv.Messages() {
			messages = append(messages, map[string]interface{}{
				"id":        m.ID,
				"text":      m.Text,
				"createdAt": m.CreatedAt,
			})
		}

		result = append(result, map[string]interface{}{
			"id":           conv.ID,
			"isGroup":      conv.IsGroup,
			"name":         conv.Name,
			"createdAt":    conv.CreatedAt,
			"participants": participants,
			"messages":     messages,
		})
	}
	
	if result == nil {
		result = []map[string]interface{}{}
	}

	return c.JSON(result)
}

func GetMessages(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	convId := c.Params("conversationId")
	ctx := context.Background()

	isParticipant, _ := database.Client.Participant.FindFirst(
		db.Participant.ConversationID.Equals(convId),
		db.Participant.UserID.Equals(userId),
	).Exec(ctx)

	if isParticipant == nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	messages, err := database.Client.Message.FindMany(
		db.Message.ConversationID.Equals(convId),
	).With(
		db.Message.Sender.Fetch(),
	).OrderBy(
		db.Message.CreatedAt.Order(db.SortOrderAsc),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to fetch messages"})
	}

	var result []map[string]interface{}
	for _, m := range messages {
		sender := m.Sender()
		result = append(result, map[string]interface{}{
			"id":             m.ID,
			"text":           m.Text,
			"conversationId": m.ConversationID,
			"createdAt":      m.CreatedAt,
			"sender": map[string]interface{}{
				"id":          sender.ID,
				"displayName": sender.DisplayName,
				"avatarUrl":   sender.AvatarURL,
			},
		})
	}
	
	if result == nil {
		result = []map[string]interface{}{}
	}

	return c.JSON(result)
}

func CreateMessage(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()

	var body struct {
		Text           string `json:"text"`
		ConversationID string `json:"conversationId"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body"})
	}

	if body.Text == "" || body.ConversationID == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing fields"})
	}

	isParticipant, _ := database.Client.Participant.FindFirst(
		db.Participant.ConversationID.Equals(body.ConversationID),
		db.Participant.UserID.Equals(userId),
	).Exec(ctx)

	if isParticipant == nil {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	message, err := database.Client.Message.CreateOne(
		db.Message.Conversation.Link(db.Conversation.ID.Equals(body.ConversationID)),
		db.Message.Sender.Link(db.User.ID.Equals(userId)),
		db.Message.Text.Set(body.Text),
	).With(
		db.Message.Sender.Fetch(),
	).Exec(ctx)

	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create message"})
	}

	sender := message.Sender()
	return c.JSON(map[string]interface{}{
		"id":             message.ID,
		"text":           message.Text,
		"conversationId": message.ConversationID,
		"createdAt":      message.CreatedAt,
		"sender": map[string]interface{}{
			"id":          sender.ID,
			"displayName": sender.DisplayName,
			"avatarUrl":   sender.AvatarURL,
		},
	})
}

func CreateConversation(c *fiber.Ctx) error {
	userId := c.Locals("userId").(string)
	ctx := context.Background()

	var body struct {
		ParticipantIds []string `json:"participantIds"`
		IsGroup        bool     `json:"isGroup"`
		Name           *string  `json:"name"`
	}

	if err := c.BodyParser(&body); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid body"})
	}

	if len(body.ParticipantIds) == 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid participants"})
	}

	// Make unique with userId
	pMap := make(map[string]bool)
	pMap[userId] = true
	for _, pid := range body.ParticipantIds {
		pMap[pid] = true
	}
	var pIds []string
	for pid := range pMap {
		pIds = append(pIds, pid)
	}

	if !body.IsGroup && len(pIds) == 2 {
		existing, _ := database.Client.Conversation.FindFirst(
			db.Conversation.IsGroup.Equals(false),
			db.Conversation.Participants.Some(db.Participant.UserID.Equals(pIds[0])),
			db.Conversation.Participants.Some(db.Participant.UserID.Equals(pIds[1])),
		).With(
			db.Conversation.Participants.Fetch().With(
				db.Participant.User.Fetch(),
			),
			db.Conversation.Messages.Fetch().OrderBy(
				db.Message.CreatedAt.Order(db.SortOrderDesc),
			).Take(1),
		).Exec(ctx)

		if existing != nil {
			var participants []map[string]interface{}
			for _, p := range existing.Participants() {
				user := p.User()
				participants = append(participants, map[string]interface{}{
					"id":     p.ID,
					"userId": p.UserID,
					"user": map[string]interface{}{
						"id":          user.ID,
						"displayName": user.DisplayName,
						"avatarUrl":   user.AvatarURL,
					},
				})
			}

			var messages []map[string]interface{}
			for _, m := range existing.Messages() {
				messages = append(messages, map[string]interface{}{
					"id":        m.ID,
					"text":      m.Text,
					"createdAt": m.CreatedAt,
				})
			}

			return c.JSON(map[string]interface{}{
				"id":           existing.ID,
				"isGroup":      existing.IsGroup,
				"name":         existing.Name,
				"createdAt":    existing.CreatedAt,
				"participants": participants,
				"messages":     messages,
			})
		}
	}

	convQuery := database.Client.Conversation.CreateOne()
	// Wait, isGroup has a default value? Yes, false. But it's not a required field?
	// Let's just create with IsGroup
	
	if body.Name != nil {
		convQuery = database.Client.Conversation.CreateOne(
			db.Conversation.IsGroup.Set(body.IsGroup),
			db.Conversation.Name.Set(*body.Name),
		)
	} else {
		convQuery = database.Client.Conversation.CreateOne(
			db.Conversation.IsGroup.Set(body.IsGroup),
		)
	}

	conversation, err := convQuery.Exec(ctx)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create conversation"})
	}

	// Create participants
	for _, pid := range pIds {
		_, _ = database.Client.Participant.CreateOne(
			db.Participant.Conversation.Link(db.Conversation.ID.Equals(conversation.ID)),
			db.Participant.User.Link(db.User.ID.Equals(pid)),
		).Exec(ctx)
	}

	// Return just ID for simplicity as client probably refetches
	return c.JSON(map[string]interface{}{
		"id":      conversation.ID,
		"isGroup": conversation.IsGroup,
		"name":    conversation.Name,
	})
}
