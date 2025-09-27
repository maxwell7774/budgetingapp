package api

import "github.com/maxwell7774/budgetingapp/backend/internal/database"

type APIConfig struct {
	db        *database.Queries
	jwtSecret string
}

func NewAPIConfig(db *database.Queries) APIConfig {
	return APIConfig{
		db: db,
	}
}
