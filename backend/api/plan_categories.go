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
	ID         uuid.UUID       `json:"id"`
	PlanID     uuid.UUID       `json:"plan_id"`
	Name       string          `json:"name"`
	Deposit    int64           `json:"deposit"`
	Withdrawal int64           `json:"withdrawal"`
	CreatedAt  time.Time       `json:"created_at"`
	UpdatedAt  time.Time       `json:"updated_at"`
	Links      map[string]Link `json:"_links"`
}

func (p *PlanCategory) GenerateLinks() {
	self := "/api/v1/plan-categories/" + p.ID.String()
	p.Links = DefaultLinks(self)
	p.Links["line_items"] = Link{Href: "/api/v1/line-items?category_id=" + p.ID.String()}
}

func (cfg *APIConfig) HandlerPlanCategoriesGet(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
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
			ID:         p.ID,
			PlanID:     p.PlanID,
			Name:       p.Name,
			Deposit:    p.Deposit,
			Withdrawal: p.Withdrawal,
			CreatedAt:  p.CreatedAt,
			UpdatedAt:  p.UpdatedAt,
		}
	}

	respondWithCollection(w, http.StatusOK, Collection{
		Self:       r.URL,
		Pagination: pagination,
		Links: map[string]Link{
			"create": {Href: r.URL.Path, Method: "POST"},
			"usage":  {Href: r.URL.Path + "/usage?plan_id=" + planID.String()},
		},
		Embedded: Embedded{
			Items: planCats,
		},
	})
}

func (cfg *APIConfig) HandlerPlanCategoryGetByID(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse id", err)
		return
	}

	cat, err := cfg.db.GetPlanCategoryByID(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan category", err)
		return
	}

	respondWithItem(w, http.StatusOK, &PlanCategory{
		ID:         cat.ID,
		PlanID:     cat.PlanID,
		Name:       cat.Name,
		Deposit:    cat.Deposit,
		Withdrawal: cat.Deposit,
		CreatedAt:  cat.CreatedAt,
		UpdatedAt:  cat.UpdatedAt,
	})
}

type CreatePlanCategoryParams struct {
	PlanID     uuid.UUID `json:"plan_id"`
	Name       string    `json:"name"`
	Deposit    int64     `json:"deposit"`
	Withdrawal int64     `json:"withdrawal"`
}

func (cfg *APIConfig) HandlerPlanCategoryCreate(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
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
		PlanID:     params.PlanID,
		Name:       params.Name,
		Deposit:    params.Deposit,
		Withdrawal: params.Withdrawal,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create category", err)
		return
	}

	respondWithItem(w, http.StatusCreated, &PlanCategory{
		ID:         plan_category.ID,
		PlanID:     plan_category.PlanID,
		Name:       plan_category.Name,
		Deposit:    plan_category.Deposit,
		Withdrawal: plan_category.Withdrawal,
		CreatedAt:  plan_category.CreatedAt,
		UpdatedAt:  plan_category.UpdatedAt,
	})
}

type UpdatePlanCategoryParams struct {
	Name string `json:"name"`
}

func (cfg *APIConfig) HandlerPlanCategoryUpdate(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse id", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := UpdatePlanCategoryParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode params", err)
		return
	}

	planCategory, err := cfg.db.UpdatePlanCategoryName(r.Context(), database.UpdatePlanCategoryNameParams{
		ID:   id,
		Name: params.Name,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update category", err)
		return
	}

	respondWithItem(w, http.StatusOK, &PlanCategory{
		ID:         planCategory.ID,
		PlanID:     planCategory.PlanID,
		Name:       planCategory.Name,
		Deposit:    planCategory.Deposit,
		Withdrawal: planCategory.Deposit,
		CreatedAt:  planCategory.CreatedAt,
		UpdatedAt:  planCategory.UpdatedAt,
	})
}

func (cfg *APIConfig) HandlerPlanCategoryDelete(w http.ResponseWriter, r *http.Request) {
	_, err := auth.UserFromRequest(r)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't retrieve user from request", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse id", err)
		return
	}

	err = cfg.db.DeletePlanCategory(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't delete category", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
