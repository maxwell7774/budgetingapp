package cli

import (
	"context"
	"fmt"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func commandLogin(cfg *config, args ...string) error {
	cfg.terminal.SetPrompt("Email: ")
	email, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	password, err := cfg.terminal.ReadPassword("Password: ")
	if err != nil {
		return err
	}

	loginResponse, err := cfg.apiClient.LoginUser(context.Background(), api.LoginParams{
		Email:    email,
		Password: password,
	})
	if err != nil {
		return fmt.Errorf("Couldn't log user in: %w", err)
	}

	cfg.apiClient.SetAccessToken(loginResponse.Token)
	cfg.user = &loginResponse.User

	Writef(cfg.terminal, "LoginResponse: %v", loginResponse)

	return nil
}
