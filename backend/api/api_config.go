package api

import (
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type ApiConfig struct {
	Resp http.ResponseWriter
	Req  *http.Request
	DB   *database.Queries
	User *database.User
}
