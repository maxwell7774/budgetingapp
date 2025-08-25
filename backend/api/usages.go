package api

import (
	"database/sql"
	"net/http"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type PlanUsage struct {
	PlanID                 uuid.UUID `json:"plan_id"`
	TargetWithdrawalAmount int64     `json:"target_withdrawal_amount"`
	TargetDepositAmount    int64     `json:"target_deposit_amount"`
	ActualWithdrawalAmount int64     `json:"actual_withdrawal_amount"`
	ActualDepositAmount    int64     `json:"actual_deposit_amount"`
}

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

	plansUsageDB, err := cfg.db.GetPlansUsageForOwner(r.Context(), database.GetPlansUsageForOwnerParams{
		OwnerID: userID,
		Limit:   pagination.Limit(),
		Offset:  pagination.Offset(),
		Keyword: sql.NullString{Valid: true, String: r.URL.Query().Get("search")},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plans usages", err)
		return
	}

	plansUsage := make([]PlanUsage, len(plansUsageDB))
	for i, p := range plansUsageDB {
		plansUsage[i] = PlanUsage{
			PlanID:                 p.PlanID,
			TargetWithdrawalAmount: p.TargetWithdrawalAmount,
			TargetDepositAmount:    p.TargetDepositAmount,
			ActualWithdrawalAmount: p.ActualWithdrawalAmount,
			ActualDepositAmount:    p.ActualDepositAmount,
		}
	}

	respondWithJSON(w, http.StatusOK, plansUsage)
}
