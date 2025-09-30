package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
	"github.com/maxwell7774/budgetingapp/backend/internal/routes"
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

	jwksURL := os.Getenv("JWKS_URL")
	if jwksURL == "" {
		log.Fatal("JWKS_URL must be set")
	}

	goAPIKey := os.Getenv("GO_API_KEY")
	if goAPIKey == "" {
		log.Fatal("GO_API_KEY must be set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	auth.CreateKeysetCache(jwksURL)
	defer auth.CleanupKeysetCache()

	dbQueries := database.New(db)

	router := routes.NewRouter(
		dbQueries,
		goAPIKey,
	)

	log.Printf("Listening on: http://localhost%s", port)
	log.Fatal(http.ListenAndServe(port, router))
}
