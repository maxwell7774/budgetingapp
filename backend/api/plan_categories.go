package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type PlanCategory struct {
	ID        uuid.UUID       `json:"id"`
	PlanID    uuid.UUID       `json:"plan_id"`
	Name      string          `json:"name"`
	Deposit   int32           `json:"deposit"`
	Withdrawl int32           `json:"withdrawl"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	Links     map[string]Link `json:"_links"`
}

func (p *PlanCategory) GenerateLinks() {
	self := "/api/v1/plan-categories/" + p.ID.String()
	p.Links = DefaultLinks(self)
}

func (cfg *ApiConfig) HandlerPlanCategoriesGet(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	planID, err := uuid.Parse(r.URL.Query().Get("plan_id"))
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Not a valid id, please include it using ?plan_id={id}", err)
		return
	}

	totalCategories, err := cfg.db.CountPlanCategoriesForPlan(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan count", err)
		return
	}

	pagination := getPaginationFromQuery(r.URL.Query(), totalCategories)

	planCategoriesDB, err := cfg.db.GetPlanCategories(r.Context(), database.GetPlanCategoriesParams{
		PlanID: planID,
		Limit:  pagination.Limit(),
		Offset: pagination.Offset(),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan categories", err)
		return
	}

	planCats := make([]Item, len(planCategoriesDB))
	for i, p := range planCategoriesDB {
		planCats[i] = &PlanCategory{
			ID:        p.ID,
			PlanID:    p.PlanID,
			Name:      p.Name,
			Deposit:   p.Deposit,
			Withdrawl: p.Withdrawl,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		}
	}

	respondWithCollection(w, http.StatusOK, Collection{
		Self:       r.URL,
		Pagination: pagination,
		Embedded: Embedded{
			Items: planCats,
		},
	})
}

type CreatePlanCategoryParams struct {
	PlanID    uuid.UUID `json:"plan_id"`
	Name      string    `json:"name"`
	Deposit   int32     `json:"deposit"`
	Withdrawl int32     `json:"withdrawl"`
}

func (cfg *ApiConfig) HandlerPlanCategoryCreate(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := CreatePlanCategoryParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	plan_category, err := cfg.db.CreatePlanCategory(r.Context(), database.CreatePlanCategoryParams{
		PlanID:    params.PlanID,
		Name:      params.Name,
		Deposit:   params.Deposit,
		Withdrawl: params.Withdrawl,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create category", err)
		return
	}

	respondWithItem(w, http.StatusCreated, &PlanCategory{
		ID:        plan_category.ID,
		PlanID:    plan_category.PlanID,
		Name:      plan_category.Name,
		Deposit:   plan_category.Deposit,
		Withdrawl: plan_category.Withdrawl,
		CreatedAt: plan_category.CreatedAt,
		UpdatedAt: plan_category.UpdatedAt,
	})
}
