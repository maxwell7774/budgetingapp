package cli

import (
	"context"
	"fmt"

	"github.com/maxwell7774/budgetingapp/backend/api"
)


func commandRegister(cfg *config, args ...string) error {
	cfg.terminal.SetPrompt("First Name: ")
	firstName, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	cfg.terminal.SetPrompt("Last Name: ")
	lastName, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	cfg.terminal.SetPrompt("Email: ")
	email, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	password, err := cfg.terminal.ReadPassword("Password: ")
	if err != nil {
		return err
	}

	user, err := cfg.apiClient.CreateUser(context.Background(), api.CreateUserParams{
		FirstName: firstName,
		LastName: lastName,
		Email: email,
		Password: password,
	})
	if err != nil {
		return fmt.Errorf("Couldn't create user: %w", err)
	}
	
	Writeln(cfg.terminal, "User registered!")
	Writef(cfg.terminal, "* ID: %s\n", user.ID.String())
	Writef(cfg.terminal, "* Name: %s %s\n", user.FirstName, user.LastName)
	Writef(cfg.terminal, "* Email: %s\n", user.Email)
	Writef(cfg.terminal, "* Created At: %s\n", user.CreatedAt.String())

	return nil
}

func commandListUsers(cfg *config, args ...string) error {
	users, err := cfg.apiClient.GetUsers(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve users: %w", err)
	}

	Writeln(cfg.terminal, "----------USERS----------")
	for _, u := range users {
		Writef(cfg.terminal, "* %s %s\n", u.FirstName, u.LastName)
	}

	return nil
}
