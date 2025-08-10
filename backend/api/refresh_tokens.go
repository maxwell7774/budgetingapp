package api

import (
	"net/http"
	"time"

	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
)

type RefreshResponse struct {
	User
	Token string `json:"token"`
}

func (cfg *APIConfig) HandlerRefreshAccessToken(w http.ResponseWriter, r *http.Request) {
	refreshToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		refreshTokenCookie, err := r.Cookie("refresh_token")
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Couldn't find token", err)
			return
		}
		refreshToken = refreshTokenCookie.Value
	}

	user, err := cfg.db.GetUserFromRefreshToken(r.Context(), refreshToken)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't get user for refresh token", err)
		return
	}

	accessToken, err := auth.MakeJWT(
		user.ID,
		cfg.jwtSecret,
		time.Hour,
	)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate token", err)
		return
	}

	respondWithJSON(w, http.StatusOK, RefreshResponse{
		User: User{
			ID:        user.ID,
			FirstName: user.FirstName,
			LastName:  user.LastName,
			Email:     user.Email,
			CreatedAt: user.CreatedAt,
			UpdatedAt: user.UpdatedAt,
		},
		Token: accessToken,
	})
}

func (cfg *APIConfig) HandlerRevokeRefreshToken(w http.ResponseWriter, r *http.Request) {
	refreshToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		refreshTokenCookie, err := r.Cookie("refresh_token")
		if err != nil {
			respondWithError(w, http.StatusBadRequest, "Couldn't find token", err)
			return
		}
		refreshToken = refreshTokenCookie.Value
	}

	_, err = cfg.db.RevokeRefreshToken(r.Context(), refreshToken)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't revoke session", err)
		return
	}

	http.SetCookie(w, &http.Cookie{
		Name:     "refresh_token",
		Value:    refreshToken,
		HttpOnly: true,
		Secure:   false,
		SameSite: http.SameSiteStrictMode,
		MaxAge:   -1,
		Path:     "/",
	})

	w.WriteHeader(http.StatusNoContent)
}
