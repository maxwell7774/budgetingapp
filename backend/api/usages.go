package api

import (
	"database/sql"
	"net/http"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type PlanUsage struct {
	PlanID           uuid.UUID       `json:"plan_id"`
	PlanName         string          `json:"plan_name"`
	TargetWithdrawal int64           `json:"target_withdrawal"`
	TargetDeposit    int64           `json:"target_deposit"`
	ActualWithdrawal int64           `json:"actual_withdrawal"`
	ActualDeposit    int64           `json:"actual_deposit"`
	NetWithdrawal    int64           `json:"net_withdrawal"`
	NetDeposit       int64           `json:"net_deposit"`
	Links            map[string]Link `json:"_links"`
}

func (p *PlanUsage) GenerateLinks() {
	self := "/api/v1/plans/" + p.PlanID.String() + "/usage"
	p.Links = map[string]Link{
		"self": {Href: self},
		"plan": {Href: "/api/v1/plans/" + p.PlanID.String()},
	}
}

func (cfg *APIConfig) HandlerGetAllPlanUsagesForOwner(w http.ResponseWriter, r *http.Request) {
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

	plansUsage := make([]Item, len(plansUsageDB))
	for i, p := range plansUsageDB {
		plansUsage[i] = &PlanUsage{
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

	respondWithCollection(w, http.StatusOK, Collection{
		Pagination: pagination,
		Self:       r.URL,
		Links: map[string]Link{
			"plans": {Href: "/api/v1/plans"},
			"filter": {
				Href:      r.URL.Path + "{?search,sort_col,sort_dir}",
				Templated: true,
			},
		},
		Embedded: Embedded{
			Items: plansUsage,
		},
	})
}

func (cfg *APIConfig) HandlerGetPlanUsage(w http.ResponseWriter, r *http.Request) {
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
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse plan id", err)
		return
	}

	planUsageDB, err := cfg.db.GetPlanUsageByID(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plans usages", err)
		return
	}

	planUsage := PlanUsage{
		PlanID:           planUsageDB.PlanID,
		PlanName:         planUsageDB.PlanName,
		TargetWithdrawal: planUsageDB.TargetWithdrawal,
		TargetDeposit:    planUsageDB.TargetDeposit,
		ActualWithdrawal: planUsageDB.ActualWithdrawal,
		ActualDeposit:    planUsageDB.ActualDeposit,
		NetWithdrawal:    planUsageDB.NetWithdrawal,
		NetDeposit:       planUsageDB.NetDeposit,
	}

	respondWithItem(w, http.StatusOK, &planUsage)
}

type PlanCategoryUsage struct {
	PlanID           uuid.UUID       `json:"plan_id"`
	PlanCategoryID   uuid.UUID       `json:"plan_category_id"`
	PlanCategoryName string          `json:"plan_category_name"`
	TargetWithdrawal int32           `json:"target_withdrawal"`
	TargetDeposit    int32           `json:"target_deposit"`
	ActualWithdrawal int64           `json:"actual_withdrawal"`
	ActualDeposit    int64           `json:"actual_deposit"`
	NetWithdrawal    int32           `json:"net_withdrawal"`
	NetDeposit       int32           `json:"net_deposit"`
	Links            map[string]Link `json:"_links"`
}

func (p *PlanCategoryUsage) GenerateLinks() {
	self := "/api/v1/plans/" + p.PlanCategoryID.String() + "/usage"
	p.Links = map[string]Link{
		"self":          {Href: self},
		"plan_category": {Href: "/api/v1/plan-categories/" + p.PlanCategoryID.String()},
	}
}

func (cfg *APIConfig) HandlerGetPlanCategoriesUsageForPlan(w http.ResponseWriter, r *http.Request) {
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

	planCategoriesUsageDB, err := cfg.db.GetPlanCategoriesUsageForPlan(r.Context(), database.GetPlanCategoriesUsageForPlanParams{
		PlanID: planID,
		Limit:  pagination.Limit(),
		Offset: pagination.Offset(),
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve plan categories usage", err)
		return
	}

	planCategoriesUsage := make([]Item, len(planCategoriesUsageDB))
	for i, p := range planCategoriesUsageDB {
		planCategoriesUsage[i] = &PlanCategoryUsage{
			PlanID:           p.PlanID,
			PlanCategoryID:   p.PlanCategoryID,
			PlanCategoryName: p.Name,
			TargetWithdrawal: p.TargetWithdrawal,
			TargetDeposit:    p.TargetDeposit,
			ActualWithdrawal: p.ActualWithdrawal,
			ActualDeposit:    p.ActualDeposit,
			NetWithdrawal:    p.NetWithdrawal,
			NetDeposit:       p.NetDeposit,
		}
	}

	respondWithCollection(w, http.StatusOK, Collection{
		Pagination: pagination,
		Self:       r.URL,
		Links: map[string]Link{
			"plan_categories": {Href: "/api/v1/plan-categories?plan_id=" + planID.String()},
		},
		Embedded: Embedded{
			Items: planCategoriesUsage,
		},
	})
}
