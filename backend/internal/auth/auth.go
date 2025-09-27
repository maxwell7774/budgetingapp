package auth

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/lestrrat-go/httprc/v3"
	"github.com/lestrrat-go/jwx/v3/jwk"
	"github.com/lestrrat-go/jwx/v3/jwt"
)

type User struct {
	ID    uuid.UUID
	name  string
	email string
}

var (
	ErrMissingUserID = errors.New("missing user id")
	ErrUserIDParsing = errors.New("couldn't parse userID")
)

var (
	keysetCache *jwk.Cache
	keysetURL   string
)

func CreateKeysetCache(jwksURL string) {
	keysetURL = jwksURL
	c, err := jwk.NewCache(context.Background(), httprc.NewClient())
	if err != nil {
		log.Fatal("Couldn't start jwks cache for authentication")
	}

	log.Println("Starting up jwk keyset cache.")
	log.Println("Waiting to connect to authorization server...")
	err = c.Register(
		context.Background(),
		"http://localhost:3000/api/auth/jwks",
		jwk.WithMaxInterval(24*time.Hour*7),
		jwk.WithMinInterval(15*time.Minute),
	)
	if err != nil {
		log.Fatal("Couldn't register jwks")
	}
	log.Println("Authorization server has been connected.")

	keysetCache = c
}

func CleanupKeysetCache() {
	if keysetCache == nil {
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := keysetCache.Shutdown(ctx); err != nil {
		log.Printf("Error shutting down JWKS cache: %v", err)
	}
}

func UserFromRequest(r *http.Request) (User, error) {
	keyset, err := keysetCache.CachedSet(keysetURL)
	if err != nil {
		return User{}, fmt.Errorf("cached jwks: %w", err)
	}

	token, err := jwt.ParseRequest(r, jwt.WithKeySet(keyset))
	if err != nil {
		return User{}, fmt.Errorf("parse request: %w", err)
	}

	userIDString, exists := token.Subject()
	if !exists {
		return User{}, ErrMissingUserID
	}

	userID, err := uuid.Parse(userIDString)
	if err != nil {
		return User{}, ErrUserIDParsing
	}

	var name string
	var email string

	token.Get("name", &name)
	token.Get("email", &email)

	user := User{
		ID:    userID,
		name:  name,
		email: email,
	}

	log.Printf("User: %v", user)

	return user, nil

}
