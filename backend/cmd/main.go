package main

import (
	"database/sql"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/maxwell7774/budgetingapp/backend/app"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func main() {
	err := godotenv.Load("backend/.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	port := os.Getenv("PORT")
	if port == "" {
		log.Fatal("PORT must be set, e.g. :xxxx")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL must be set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	currentUserEmail := os.Getenv("CURRENT_USER")
	if currentUserEmail == "" {
		log.Fatal("CURRENT_USER must be set")
	}

	dbQueries := database.New(db)

	app := app.NewApp(
		port,
		dbQueries,
	)

	app.Start()
}
