package cli

import (
	"github.com/maxwell7774/budgetingapp/backend/api"
	"github.com/maxwell7774/budgetingapp/internal/apiclient"
	"golang.org/x/term"
)

type config struct {
	apiClient   apiclient.Client
	user        *api.User
	terminal    *term.Terminal
	isRunning   bool
	commandMode bool
}
