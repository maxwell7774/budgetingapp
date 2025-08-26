package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

func main() {
	err := godotenv.Load("backend/.env")
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	dbURL := os.Getenv("DB_URL")
	if dbURL == "" {
		log.Fatal("DB_URL must be set")
	}

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error opening database connection: %v", err)
	}

	dbQueries := database.New(db)

	err = dbQueries.ResetLineItems(context.Background())
	if err != nil {
		log.Fatalf("Couldn't reset line items: %v", err)
	}

	err = dbQueries.ResetPlanCategories(context.Background())
	if err != nil {
		log.Fatalf("Couldn't reset plan categories: %v", err)
	}

	err = dbQueries.ResetPlans(context.Background())
	if err != nil {
		log.Fatalf("Couldn't reset plans: %v", err)
	}

	err = dbQueries.ResetRefreshTokens(context.Background())
	if err != nil {
		log.Fatalf("Couldn't reset refresh tokens: %v", err)
	}

	err = dbQueries.ResetUsers(context.Background())
	if err != nil {
		log.Fatalf("Couldn't reset users: %v", err)
	}

	hashedPassword, err := auth.HashPassword("password")
	if err != nil {
		log.Fatalf("Couldn't hash user password: %v", err)
	}

	user1, err := dbQueries.CreateUser(context.Background(), database.CreateUserParams{
		FirstName:      "John",
		LastName:       "Allen",
		Email:          "user1@example.com",
		HashedPassword: hashedPassword,
	})
	if err != nil {
		log.Fatalf("Couldn't create user 1: %v", err)
	}

	user2, err := dbQueries.CreateUser(context.Background(), database.CreateUserParams{
		FirstName:      "Tom",
		LastName:       "Jones",
		Email:          "user2@example.com",
		HashedPassword: hashedPassword,
	})
	if err != nil {
		log.Fatalf("Couldn't create user 2: %v", err)
	}

	user3, err := dbQueries.CreateUser(context.Background(), database.CreateUserParams{
		FirstName:      "Susan",
		LastName:       "Doe",
		Email:          "user3@example.com",
		HashedPassword: hashedPassword,
	})
	if err != nil {
		log.Fatalf("Couldn't create user 3: %v", err)
	}

	users := []database.User{user1, user2, user3}

	for _, u := range users {
		for j := 1; j <= 3; j++ {
			plan, err := dbQueries.CreatePlan(context.Background(), database.CreatePlanParams{
				OwnerID: u.ID,
				Name:    fmt.Sprintf("%s plan number %d", u.FirstName, j),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s plan number %d: %v", u.FirstName, j, err)
			}

			pc1, err := dbQueries.CreatePlanCategory(context.Background(), database.CreatePlanCategoryParams{
				PlanID:     plan.ID,
				Name:       "Income",
				Deposit:    int32(len(u.FirstName) * 250 * j),
				Withdrawal: 0,
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Income: %v", u.FirstName, err)
			}

			pc2, err := dbQueries.CreatePlanCategory(context.Background(), database.CreatePlanCategoryParams{
				PlanID:     plan.ID,
				Name:       "Groceries",
				Deposit:    0,
				Withdrawal: int32(len(u.FirstName) * 50 * j),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Groceries: %v", u.FirstName, err)
			}

			pc3, err := dbQueries.CreatePlanCategory(context.Background(), database.CreatePlanCategoryParams{
				PlanID:     plan.ID,
				Name:       "Bills",
				Deposit:    0,
				Withdrawal: int32(len(u.FirstName) * 25 * j),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Bills: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc1.ID,
				Description:    fmt.Sprintf("%s 1st check", u.FirstName),
				Deposit:        2 * pc1.Deposit / 3,
				Withdrawal:     0,
			})
			if err != nil {
				log.Fatalf("Couldn't create %s 1st check: %v", u.FirstName, err)
			}

			// _, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
			// 	UserID:         u.ID,
			// 	PlanCategoryID: pc1.ID,
			// 	Description:    fmt.Sprintf("%s 2nd check", u.FirstName),
			// 	Deposit:        pc1.Deposit / 2,
			// 	Withdrawal:     0,
			// })
			// if err != nil {
			// 	log.Fatalf("Couldn't create %s 2nd check: %v", u.FirstName, err)
			// }

			walmartTrip1Withdrawal := int32(len(u.FirstName) * 25)
			if j == 2 {
				walmartTrip1Withdrawal = pc1.Deposit + 100
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc2.ID,
				Description:    fmt.Sprintf("%s Walmart trip 1", u.FirstName),
				Deposit:        0,
				Withdrawal:     walmartTrip1Withdrawal,
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Walmart trip 1: %v", u.FirstName, err)
			}

			walmartTrip2, err := dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc2.ID,
				Description:    fmt.Sprintf("%s Walmart trip 2", u.FirstName),
				Deposit:        0,
				Withdrawal:     int32(len(u.FirstName) * 10),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Walmart trip 2: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc2.ID,
				Description:    fmt.Sprintf("%s Costco trip", u.FirstName),
				Deposit:        0,
				Withdrawal:     int32(len(u.FirstName) * 5),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Costco trip: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc2.ID,
				Description:    fmt.Sprintf("%s Walmart trip 2 refund", u.FirstName),
				Deposit:        walmartTrip2.Withdrawal,
				Withdrawal:     0,
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Walmart trip 2 refund: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc3.ID,
				Description:    fmt.Sprintf("%s Electric bill", u.FirstName),
				Deposit:        0,
				Withdrawal:     int32(len(u.FirstName) * 7),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Electric bill: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc3.ID,
				Description:    fmt.Sprintf("%s Gas bill", u.FirstName),
				Deposit:        0,
				Withdrawal:     int32(len(u.FirstName) * 3),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Gas bill: %v", u.FirstName, err)
			}

			_, err = dbQueries.CreateLineItem(context.Background(), database.CreateLineItemParams{
				UserID:         u.ID,
				PlanCategoryID: pc3.ID,
				Description:    fmt.Sprintf("%s Insurance", u.FirstName),
				Deposit:        0,
				Withdrawal:     int32(len(u.FirstName) * 12),
			})
			if err != nil {
				log.Fatalf("Couldn't create %s Insurance: %v", u.FirstName, err)
			}

		}
	}

}
