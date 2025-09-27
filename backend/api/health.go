package api

import (
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
)

func (cfg *APIConfig) HandlerPing(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
		return
	}

	respondWithJSON(w, http.StatusOK, "Ping Successful")
}
