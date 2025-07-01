package app

import (
	"log"
	"net/http"
	"os"

	"github.com/maxwell7774/budgetingapp/backend/api"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type App struct {
	db   *database.Queries
	mux  *http.ServeMux
	port string
}

type AppHandler func(*api.ApiConfig)

func NewApp(port string, db *database.Queries) *App {
	return &App{
		db:   db,
		mux:  http.NewServeMux(),
		port: port,
	}
}

func (app *App) HandleFunc(route string, handler AppHandler) {
	app.mux.HandleFunc(route, func(w http.ResponseWriter, r *http.Request) {
		user, err := app.db.GetUser(r.Context(), os.Getenv("CURRENT_USER"))
		if err != nil {
			log.Fatalf("Error getting user: %v", err)
		}

		c := api.ApiConfig{
			Resp: w,
			Req:  r,
			DB:   app.db,
			User: &user,
		}
		handler(&c)
	})
}

func (app *App) Start() {
	app.HandleFunc("GET /api/v1/users", api.HandlerUsersGet)
	app.HandleFunc("POST /api/v1/users", api.HandlerUserCreate)

	app.HandleFunc("GET /api/v1/plans", api.HandlerPlansGetForOwner)
	app.HandleFunc("POST /api/v1/plans", api.HandlerPlanCreate)
	app.HandleFunc("GET /api/v1/plans/{id}/categories", api.HandlerPlanCategoriesGet)
	app.HandleFunc("GET /api/v1/plans/{id}/line-items", api.HandlerLineItemsGet)

	app.HandleFunc("POST /api/v1/plan-categories", api.HandlerPlanCategoryCreate)

	app.HandleFunc("POST /api/v1/plan-withdrawl", api.HandlerLineItemWithdrawl)
	app.HandleFunc("POST /api/v1/plan-deposit", api.HandlerLineItemDeposit)

	log.Printf("Listening on port %s", app.port)
	log.Fatal(http.ListenAndServe(app.port, app.mux))
}
