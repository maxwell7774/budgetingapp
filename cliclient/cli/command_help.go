package cli

import (
	"fmt"
	"slices"
	"strings"
)

func commandHelp(cfg *config, args ...string) error {
	fmt.Println("Welcome to budgeting!")
	fmt.Println("Usage:")
	fmt.Println()

	commands := []cliCommand{}
	for _, command := range getCommands() {
		commands = append(commands, command)
	}

	slices.SortFunc(commands, func(a cliCommand, b cliCommand) int {
		return strings.Compare(a.name, b.name)
	})

	for _, command := range commands {
		fmt.Printf("%s: %s\n", command.name, command.description)
	}
	return nil
}
