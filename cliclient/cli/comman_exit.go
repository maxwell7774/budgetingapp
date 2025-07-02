package cli

func commandExit(cfg *config, args ...string) error {
	cfg.isRunning = false

	Writeln(cfg.terminal, "Thank you for Budgeting!")
	Writeln(cfg.terminal, "Exiting...")

	return nil
}
