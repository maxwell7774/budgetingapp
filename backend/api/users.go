package api

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (cfg *APIConfig) HandlerUsersGet(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
		return
	}

	usersFromDB, err := cfg.db.GetUsers(r.Context())
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve users", err)
		return
	}

	users := []User{}
	for _, u := range usersFromDB {
		users = append(users, User{
			ID:        u.ID,
			Name:      u.Name,
			Email:     u.Email,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		})
	}

	respondWithJSON(w, http.StatusOK, users)
}

type CreateUserParams struct {
	ID    uuid.UUID `json:"id"`
	Name  string    `json:"name"`
	Email string    `json:"email"`
}

func (cfg *APIConfig) HandlerUserCreate(w http.ResponseWriter, r *http.Request) {
	log.Printf("REQUEST KEY: %s\nGO KEY: %s", r.Header.Get("X-API-KEY"), cfg.goAPIKey)
	if r.Header.Get("X-API-KEY") != cfg.goAPIKey {
		respondWithError(w, http.StatusUnauthorized, "Couldn't authenticate api key from request", fmt.Errorf("API Key doesn't match"))
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := CreateUserParams{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	user, err := cfg.db.CreateUser(r.Context(), database.CreateUserParams{
		ID:    params.ID,
		Name:  params.Name,
		Email: params.Email,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create user", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, User{
		ID:        user.ID,
		Name:      user.Name,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	})
}
