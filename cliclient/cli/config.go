package cli

import (
	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/internal/apiclient"
	"golang.org/x/term"
)

type config struct {
	apiClient apiclient.Client
	userID    *uuid.UUID
	terminal *term.Terminal
	isRunning bool
}
