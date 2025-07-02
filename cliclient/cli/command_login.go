package cli

import (
	"context"
	"fmt"
	"strings"

)

func commandLogin(cfg *config, args ...string) error {
	if len(args) == 0 {
		return fmt.Errorf("A user email must be provided")
	}
	userEmail := strings.ToLower(args[0])

	users, err := cfg.apiClient.GetUsers(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve users")
	}

	for _, u := range users{
		if strings.ToLower(u.Email) == userEmail {
			line := fmt.Sprintf("Hello %s!\n", u.FirstName)
			cfg.terminal.Write([]byte(line))
			cfg.userID = &u.ID
			break
		}
	}

	if cfg.userID == nil {
		return fmt.Errorf("Please register user before logging in.")
	}

	return nil
}
