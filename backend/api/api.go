package api

import "github.com/maxwell7774/budgetingapp/backend/internal/database"

type APIConfig struct {
	db       *database.Queries
	goAPIKey string
}

func NewAPIConfig(db *database.Queries, goAPIKey string) APIConfig {
	return APIConfig{
		db:       db,
		goAPIKey: goAPIKey,
	}
}
