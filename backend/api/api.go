package api

import "github.com/maxwell7774/budgetingapp/backend/internal/database"

type ApiConfig struct {
	DB *database.Queries
}

const userCtxKey = "user"
