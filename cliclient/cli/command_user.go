package cli

import (
	"bufio"
	"context"
	"fmt"
	"os"

	"github.com/maxwell7774/budgetingapp/backend/api"
)


func commandRegister(cfg *config, args ...string) error {
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Printf("First Name: ")
	scanner.Scan()
	firstName := scanner.Text()

	fmt.Printf("Last Name: ")
	scanner.Scan()
	lastName := scanner.Text()

	fmt.Printf("Email: ")
	scanner.Scan()
	email := scanner.Text()

	user, err := cfg.apiClient.CreateUser(context.Background(), api.CreateUserParams{
		FirstName: firstName,
		LastName: lastName,
		Email: email,
	})
	if err != nil {
		return fmt.Errorf("Couldn't create user: %w", err)
	}
	
	fmt.Println("User registered!")
	fmt.Printf("* ID: %s\n", user.ID.String())
	fmt.Printf("* Name: %s %s\n", user.FirstName, user.LastName)
	fmt.Printf("* Email: %s\n", user.Email)
	fmt.Printf("* Created At: %s\n", user.CreatedAt.String())

	return nil
}

func commandListUsers(cfg *config, args ...string) error {
	users, err := cfg.apiClient.GetUsers(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve users: %w", err)
	}

	fmt.Println("----------USERS----------")
	for _, u := range users {
		fmt.Printf("* %s %s\n", u.FirstName, u.LastName)
	}

	return nil
}
