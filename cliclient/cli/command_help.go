package cli

func commandHelp(cfg *config, args ...string) error {
	Writeln(cfg.terminal, "Welcome to budgeting!")
	Writeln(cfg.terminal, "Usage:")

	commands := getCommandsAsArray()

	for _, command := range commands {
		Writef(cfg.terminal, "* %s: %s\n", command.name, command.description)
	}
	return nil
}
