package cli

import (
	"slices"
	"strings"
)

type cliCommand struct {
	name        string
	description string
	callback    func(*config, ...string) error
}

func getCommands() map[string]cliCommand {
	return map[string]cliCommand{
		"help": {
			name:        "help",
			description: "Displays a help message",
			callback:    commandHelp,
		},
		"register": {
			name:        "register",
			description: "Registers a new user",
			callback:    commandRegister,
		},
		"login": {
			name:        "login",
			description: "Logs a user in",
			callback:    commandLogin,
		},
		"users": {
			name:        "users",
			description: "Lists all users",
			callback:    commandListUsers,
		},
		"plans": {
			name:        "plans",
			description: "Lists all plans",
			callback:    commandListPlans,
		},
		"new-plan": {
			name:        "new-plan",
			description: "Create a new plan",
			callback:    commandCreatePlan,
		},
		"plan-categories": {
			name:        "plan-categories",
			description: "List a plan's categories",
			callback:    commandListPlanCategories,
		},
		"new-plan-category": {
			name:        "new-plan-category",
			description: "Create a new plan category",
			callback:    commandCreatePlanCategory,
		},
		"exit": {
			name:        "exit",
			description: "Exits the program",
			callback:    commandExit,
		},
	}
}

func getCommandsAsArray() []cliCommand {
	commands := []cliCommand{}
	for _, command := range getCommands() {
		commands = append(commands, command)
	}

	slices.SortFunc(commands, func(a cliCommand, b cliCommand) int {
		return strings.Compare(a.name, b.name)
	})
	return commands
}
