package api

import "github.com/maxwell7774/budgetingapp/backend/internal/database"

type ApiConfig struct {
	db        *database.Queries
	jwtSecret string
}

func NewApiConfig(db *database.Queries, jwtSecret string) ApiConfig {
	return ApiConfig{
		db:        db,
		jwtSecret: jwtSecret,
	}
}
