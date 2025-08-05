package routes

import (
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func NewRouter(db *database.Queries, jwtSecret string) *http.ServeMux {
	mux := http.NewServeMux()

	apiConfig := api.NewApiConfig(db, jwtSecret)

	mux.HandleFunc("GET /api/v1/users", apiConfig.HandlerUsersGet)
	mux.HandleFunc("POST /api/v1/users", apiConfig.HandlerUserCreate)

	mux.HandleFunc("POST /api/v1/auth/login", apiConfig.HandlerLogin)
	mux.HandleFunc("GET /api/v1/auth/refresh", apiConfig.HandlerRefreshAccessToken)
	mux.HandleFunc("POST /api/v1/auth/revoke", apiConfig.HandlerRevokeRefreshToken)

	mux.HandleFunc("GET /api/v1/plans", apiConfig.HandlerPlansGetForOwner)
	mux.HandleFunc("GET /api/v1/plans/{id}", apiConfig.HandlerPlanGetByID)
	mux.HandleFunc("POST /api/v1/plans", apiConfig.HandlerPlanCreate)
	mux.HandleFunc("GET /api/v1/plans/{id}/categories", apiConfig.HandlerPlanCategoriesGet)
	mux.HandleFunc("GET /api/v1/plans/{id}/line-items", apiConfig.HandlerLineItemsGet)
	mux.HandleFunc("PUT /api/v1/plans/{id}", apiConfig.HandlerPlanUpdateName)
	mux.HandleFunc("DELETE /api/v1/plans/{id}", apiConfig.HandlerPlanDelete)

	mux.HandleFunc("POST /api/v1/plan-categories", apiConfig.HandlerPlanCategoryCreate)

	mux.HandleFunc("POST /api/v1/line-items", apiConfig.HandlerLineItemCreate)

	return mux
}
