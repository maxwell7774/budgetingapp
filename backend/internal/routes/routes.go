package routes

import (
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func NewRouter(db *database.Queries) *http.ServeMux {
	mux := http.NewServeMux()

	apiConfig := api.ApiConfig{
		DB: db,
	}

	mux.HandleFunc("GET /api/v1/users", apiConfig.HandlerUsersGet)
	mux.HandleFunc("POST /api/v1/users", apiConfig.HandlerUserCreate)

	mux.HandleFunc("GET /api/v1/plans", apiConfig.HandlerPlansGetForOwner)
	mux.HandleFunc("POST /api/v1/plans", apiConfig.HandlerPlanCreate)
	mux.HandleFunc("GET /api/v1/plans/{id}/categories", apiConfig.HandlerPlanCategoriesGet)
	mux.HandleFunc("GET /api/v1/plans/{id}/line-items", apiConfig.HandlerLineItemsGet)

	mux.HandleFunc("POST /api/v1/plan-categories", apiConfig.HandlerPlanCategoryCreate)

	mux.HandleFunc("POST /api/v1/plan-withdrawl", apiConfig.HandlerLineItemWithdrawl)
	mux.HandleFunc("POST /api/v1/plan-deposit", apiConfig.HandlerLineItemDeposit)

	return mux
}
