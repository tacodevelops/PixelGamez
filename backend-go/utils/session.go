package utils

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"time"

	"pixelgamez-backend/database"
	"pixelgamez-backend/prisma/db"
)

const SessionCookieName = "pgz_session"
const SessionMaxAge = 30 * 24 * time.Hour // 30 days

func GenerateRandomToken() (string, error) {
	bytes := make([]byte, 32)
	if _, err := rand.Read(bytes); err != nil {
		return "", err
	}
	return hex.EncodeToString(bytes), nil
}

func CreateSession(userId string) (string, error) {
	token, err := GenerateRandomToken()
	if err != nil {
		return "", err
	}
	
	expiresAt := time.Now().Add(SessionMaxAge)
	
	_, err = database.Client.Session.CreateOne(
		db.Session.Token.Set(token),
		db.Session.ExpiresAt.Set(expiresAt),
		db.Session.User.Link(
			db.User.ID.Equals(userId),
		),
	).Exec(context.Background())
	
	if err != nil {
		return "", err
	}
	
	return token, nil
}

func GetSession(token string) (*db.SessionModel, error) {
	if token == "" {
		return nil, nil
	}
	
	session, err := database.Client.Session.FindUnique(
		db.Session.Token.Equals(token),
	).Exec(context.Background())
	
	if err != nil {
		return nil, err
	}
	
	if session.ExpiresAt.Before(time.Now()) {
		database.Client.Session.FindUnique(
			db.Session.Token.Equals(token),
		).Delete().Exec(context.Background())
		return nil, nil
	}
	
	return session, nil
}

func DeleteSession(token string) error {
	_, err := database.Client.Session.FindUnique(
		db.Session.Token.Equals(token),
	).Delete().Exec(context.Background())
	return err
}
