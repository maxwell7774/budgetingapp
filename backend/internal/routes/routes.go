package routes

import (
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func NewRouter(db *database.Queries, jwtSecret string) http.Handler {
	mux := http.NewServeMux()

	apiConfig := api.NewApiConfig(db, jwtSecret)

	mux.HandleFunc("GET /api/v1/users", apiConfig.HandlerUsersGet)
	mux.HandleFunc("POST /api/v1/users", apiConfig.HandlerUserCreate)

	mux.HandleFunc("POST /api/v1/login", apiConfig.HandlerLogin)

	mux.HandleFunc("GET /api/v1/plans", apiConfig.HandlerPlansGetForOwner)
	mux.HandleFunc("POST /api/v1/plans", apiConfig.HandlerPlanCreate)
	mux.HandleFunc("GET /api/v1/plans/{id}/categories", apiConfig.HandlerPlanCategoriesGet)
	mux.HandleFunc("GET /api/v1/plans/{id}/line-items", apiConfig.HandlerLineItemsGet)

	mux.HandleFunc("POST /api/v1/plan-categories", apiConfig.HandlerPlanCategoryCreate)

	mux.HandleFunc("POST /api/v1/line-items", apiConfig.HandlerLineItemCreate)

	mux.HandleFunc("POST /api/v1/refresh", apiConfig.HandlerRefreshAccessToken)
	mux.HandleFunc("POST /api/v1/revoke", apiConfig.HandlerRevokeRefreshToken)

	wrappedMux := enableCORS(mux)

	return wrappedMux
}

func enableCORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		w.Header().Set("Access-Control-Allow-Origin", "*") // Replace with your React app's origin
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Handle preflight (OPTIONS) requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Pass the request to the next handler
		next.ServeHTTP(w, r)
	})
}
