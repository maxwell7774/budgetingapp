package api

import (
	"database/sql"
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func (cfg *APIConfig) HandlerPlansUsage(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	totalPlans, err := cfg.db.CountPlansForOwner(r.Context(), database.CountPlansForOwnerParams{
		OwnerID: userID,
		Keyword: sql.NullString{Valid: true, String: r.URL.Query().Get("search")},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plans count", err)
		return
	}
	pagination := getPaginationFromQuery(r.URL.Query(), totalPlans)

	plansUsage, err := cfg.db.GetPlansUsageForOwner(r.Context(), database.GetPlansUsageForOwnerParams{})
}
