package api

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type Plan struct {
	ID        uuid.UUID       `json:"id"`
	OwnerID   uuid.UUID       `json:"owner_id"`
	Name      string          `json:"name"`
	CreatedAt time.Time       `json:"created_at"`
	UpdatedAt time.Time       `json:"updated_at"`
	Links     map[string]Link `json:"_links"`
}

func (p *Plan) GenerateLinks() {
	self := "/api/v1/plans/" + p.ID.String()
	p.Links = DefaultLinks(self)
	p.Links["usage"] = Link{Href: self + "/usage"}
	p.Links["plan_categories"] = Link{Href: "/api/v1/plan-categories?plan_id=" + p.ID.String()}
	p.Links["plan_categories_usage"] = Link{Href: "/api/v1/plan-categories/usage?plan_id=" + p.ID.String()}
}

func (cfg *APIConfig) HandlerPlansGetForOwner(w http.ResponseWriter, r *http.Request) {
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

	plansDB, err := cfg.db.GetPlansForOwner(r.Context(), database.GetPlansForOwnerParams{
		OwnerID: userID,
		Limit:   pagination.Limit(),
		Offset:  pagination.Offset(),
		Keyword: sql.NullString{Valid: true, String: r.URL.Query().Get("search")},
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plans", err)
		return
	}

	plans := make([]Item, len(plansDB))
	for i, p := range plansDB {
		plans[i] = &Plan{
			ID:        p.ID,
			OwnerID:   p.OwnerID,
			Name:      p.Name,
			CreatedAt: p.CreatedAt,
			UpdatedAt: p.UpdatedAt,
		}
	}

	respondWithCollection(w, http.StatusOK, Collection{
		Self:       r.URL,
		Pagination: pagination,
		Embedded: Embedded{
			Items: plans,
		},
		Links: map[string]Link{
			"filter": {
				Href:      r.URL.Path + "{?search,sort_col,sort_dir}",
				Templated: true,
			},
			"create": {
				Href:   r.URL.Path,
				Method: "POST",
			},
			"usage": {
				Href: r.URL.Path + "/usage?" + r.URL.Query().Encode(),
			},
		},
	})
}

func (cfg *APIConfig) HandlerPlanGetByID(w http.ResponseWriter, r *http.Request) {
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

	planID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusBadRequest, "Couldn't parse path value id", err)
		return
	}

	plan, err := cfg.db.GetPlanByID(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan", err)
		return
	}

	if userID != plan.OwnerID {
		respondWithError(w, http.StatusUnauthorized, "User is not the owner of this plan", nil)
		return
	}

	respondWithItem(w, http.StatusOK, &Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
	})
}

type CreatePlanParams struct {
	Name string `json:"name"`
}

func (cfg *APIConfig) HandlerPlanCreate(w http.ResponseWriter, r *http.Request) {
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

	decoder := json.NewDecoder(r.Body)
	params := CreatePlanParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	if len(params.Name) == 0 {
		respondWithError(w, http.StatusBadRequest, "Plan name is required", err)
		return
	}

	plan, err := cfg.db.CreatePlan(r.Context(), database.CreatePlanParams{
		OwnerID: userID,
		Name:    params.Name,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create plan", err)
		return
	}

	respondWithItem(w, http.StatusCreated, &Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
	})
}

type UpdatePlanParams struct {
	Name string `json:"name"`
}

func (cfg *APIConfig) HandlerPlanUpdateName(w http.ResponseWriter, r *http.Request) {
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

	planID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse provided ID", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := UpdatePlanParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	if params.Name == "" {
		respondWithError(w, http.StatusBadRequest, "Name was not provided", err)
		return
	}

	plan, err := cfg.db.UpdatePlanName(r.Context(), database.UpdatePlanNameParams{
		ID:   planID,
		Name: params.Name,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update plan", err)
		return
	}

	respondWithItem(w, http.StatusCreated, &Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
	})
}

func (cfg *APIConfig) HandlerPlanDelete(w http.ResponseWriter, r *http.Request) {
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

	planID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse provided ID", err)
		return
	}

	err = cfg.db.DeletePlan(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update plan", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
