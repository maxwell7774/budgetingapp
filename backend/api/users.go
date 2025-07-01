package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type User struct {
	ID        uuid.UUID `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func HandlerUsersGet(cfg *ApiConfig) {
	usersFromDB, err := cfg.DB.GetUsers(cfg.Req.Context())
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't retrieve users", err)
		return
	}

	users := []User{}
	for _, u := range usersFromDB {
		users = append(users, User{
			ID:        u.ID,
			FirstName: u.FirstName,
			LastName:  u.LastName,
			Email:     u.Email,
			CreatedAt: u.CreatedAt,
			UpdatedAt: u.UpdatedAt,
		})
	}

	respondWithJSON(cfg.Resp, http.StatusOK, users)
}

func HandlerUserCreate(cfg *ApiConfig) {
	type parameters struct {
		FirstName string `json:"first_name"`
		LastName  string `json:"last_name"`
		Email     string `json:"email"`
	}

	decoder := json.NewDecoder(cfg.Req.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	user, err := cfg.DB.CreateUser(cfg.Req.Context(), database.CreateUserParams{
		FirstName: params.FirstName,
		LastName:  params.LastName,
		Email:     params.Email,
	})
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't create user", err)
		return
	}

	respondWithJSON(cfg.Resp, http.StatusCreated, User{
		ID:        user.ID,
		FirstName: user.FirstName,
		LastName:  user.LastName,
		Email:     user.Email,
		CreatedAt: user.CreatedAt,
		UpdatedAt: user.UpdatedAt,
	})
}
