package cli

import (
	"fmt"
	"os"
)

func commandExit(cfg *config, args ...string) error {
	defer os.Exit(0)

	fmt.Println()
	fmt.Println("Exiting...")
	fmt.Println("Thank you for Budgeting!")
	fmt.Println()

	return nil
}
