package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type Plan struct {
	ID        uuid.UUID `json:"id"`
	OwnerID   uuid.UUID `json:"owner_id"`
	Name      string    `json:"name"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func HandlerPlansGetForOwner(cfg *ApiConfig) {
	plansDB, err := cfg.DB.GetPlansForOwner(cfg.Req.Context(), cfg.User.ID)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't retrieve plans", err)
		return
	}

	plans := []Plan{}
	for _, p := range plansDB {
		plans = append(plans, Plan{
			ID:        p.ID,
			OwnerID:   p.OwnerID,
			Name:      p.Name,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		})
	}

	respondWithJSON(cfg.Resp, http.StatusCreated, plans)
}

type CreatePlanParams struct {
		Name string `json:"name"`
}

func HandlerPlanCreate(cfg *ApiConfig) {
	decoder := json.NewDecoder(cfg.Req.Body)
	params := CreatePlanParams{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	plan, err := cfg.DB.CreatePlan(cfg.Req.Context(), database.CreatePlanParams{
		OwnerID: cfg.User.ID,
		Name:    params.Name,
	})
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't create plan", err)
		return
	}

	respondWithJSON(cfg.Resp, http.StatusCreated, Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
	})
}
