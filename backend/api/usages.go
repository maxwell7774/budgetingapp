package api

import (
	"database/sql"
	"net/http"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type PlanUsage struct {
	PlanID           uuid.UUID `json:"plan_id"`
	PlanName         string    `json:"plan_name"`
	TargetWithdrawal int64     `json:"target_withdrawal"`
	TargetDeposit    int64     `json:"target_deposit"`
	ActualWithdrawal int64     `json:"actual_withdrawal"`
	ActualDeposit    int64     `json:"actual_deposit"`
	NetWithdrawal    int64     `json:"net_withdrawal"`
	NetDeposit       int64     `json:"net_deposit"`
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

	plansUsageDB, err := cfg.db.GetAllPlanUsagesForOwnerID(r.Context(), database.GetAllPlanUsagesForOwnerIDParams{
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
			PlanID:           p.PlanID,
			PlanName:         p.PlanName,
			TargetWithdrawal: p.TargetWithdrawal,
			TargetDeposit:    p.TargetDeposit,
			ActualWithdrawal: p.ActualWithdrawal,
			ActualDeposit:    p.ActualDeposit,
			NetWithdrawal:    p.NetWithdrawal,
			NetDeposit:       p.NetDeposit,
		}
	}

	respondWithJSON(w, http.StatusOK, plansUsage)
}
