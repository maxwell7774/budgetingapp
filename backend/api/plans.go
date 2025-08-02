package api

import (
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
	self := PlansURL + "/" + p.ID.String()
	p.Links = map[string]Link{
		"self": {
			Href: self,
		},
		"update": {
			Href:   self,
			Method: "PUT",
		},
		"delete": {
			Href:   self,
			Method: "DELETE",
		},
	}
}

func (cfg *ApiConfig) HandlerPlansGetForOwner(w http.ResponseWriter, r *http.Request) {
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

	totalPlans, err := cfg.db.CountPlansForOwner(r.Context(), userID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plans count", err)
		return
	}
	pagination := getPaginationFromQuery(r.URL.Query(), totalPlans)

	plansDB, err := cfg.db.GetPlansForOwner(r.Context(), userID)
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
	})
}

func (cfg *ApiConfig) HandlerPlanGetByID(w http.ResponseWriter, r *http.Request) {
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

	respondWithJSON(w, http.StatusOK, Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
		Links: map[string]Link{
			"self": {
				Href: PlansURL + "/" + plan.ID.String(),
			},
		},
	})
}

type CreatePlanParams struct {
	Name string `json:"name"`
}

func (cfg *ApiConfig) HandlerPlanCreate(w http.ResponseWriter, r *http.Request) {
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

	plan, err := cfg.db.CreatePlan(r.Context(), database.CreatePlanParams{
		OwnerID: userID,
		Name:    params.Name,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't create plan", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, Plan{
		ID:        plan.ID,
		OwnerID:   plan.OwnerID,
		Name:      plan.Name,
		CreatedAt: plan.CreatedAt,
		UpdatedAt: plan.UpdatedAt,
	})
}
