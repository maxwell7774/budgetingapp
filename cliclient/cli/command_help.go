package cli

import (
	"slices"
	"strings"
)

func commandHelp(cfg *config, args ...string) error {
	Writeln(cfg.terminal, "Welcome to budgeting!")
	Writeln(cfg.terminal, "Usage:")

	commands := []cliCommand{}
	for _, command := range getCommands() {
		commands = append(commands, command)
	}

	slices.SortFunc(commands, func(a cliCommand, b cliCommand) int {
		return strings.Compare(a.name, b.name)
	})

	for _, command := range commands {
		Writef(cfg.terminal, "* %s: %s\n", command.name, command.description)
	}
	return nil
}
