package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type PlanCategory struct {
	ID        uuid.UUID `json:"id"`
	PlanID    uuid.UUID `json:"plan_id"`
	Name      string    `json:"name"`
	Deposit   int32     `json:"deposit"`
	Withdrawl int32     `json:"withdrawl"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

func (cfg *ApiConfig) HandlerPlanCategoriesGet(w http.ResponseWriter, r *http.Request) {
	planID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Not a valid id", err)
		return
	}

	planCategoriesDB, err := cfg.DB.GetPlanCategories(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan categories", err)
		return
	}
	planCats := []PlanCategory{}
	for _, p := range planCategoriesDB {
		planCats = append(planCats, PlanCategory{
			ID:        p.ID,
			PlanID:    p.PlanID,
			Name:      p.Name,
			Deposit:   p.Deposit,
			Withdrawl: p.Withdrawl,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		})
	}

	respondWithJSON(w, http.StatusOK, planCats)
}

type CreatePlanCategoryParams struct {
	PlanID    uuid.UUID `json:"plan_id"`
	Name      string    `json:"name"`
	Deposit   int32     `json:"deposit"`
	Withdrawl int32     `json:"withdrawl"`
}

func (cfg *ApiConfig) HandlerPlanCategoryCreate(w http.ResponseWriter, r *http.Request) {

	decoder := json.NewDecoder(r.Body)
	params := CreatePlanCategoryParams{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	plan_category, err := cfg.DB.CreatePlanCategory(r.Context(), database.CreatePlanCategoryParams{
		PlanID:    params.PlanID,
		Name:      params.Name,
		Deposit:   params.Deposit,
		Withdrawl: params.Withdrawl,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create category", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, PlanCategory{
		ID:        plan_category.ID,
		PlanID:    plan_category.PlanID,
		Name:      plan_category.Name,
		Deposit:   plan_category.Deposit,
		Withdrawl: plan_category.Withdrawl,
		CreatedAt: plan_category.CreatedAt,
		UpdatedAt: plan_category.UpdatedAt,
	})
}
