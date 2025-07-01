package cli

import (
	"bufio"
	"fmt"
	"os"
)

type cliCommand struct {
	name        string
	description string
	callback    func(*State, ...string) error
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
		"exit": {
			name:        "exit",
			description: "Exits the program",
			callback:    commandExit,
		},
	}
}

func commandRegister(s *State, args ...string) error {
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Printf("First Name: ")
	scanner.Scan()
	//firstName := scanner.Text()

	fmt.Printf("Last Name: ")
	scanner.Scan()
	//lastName := scanner.Text()

	fmt.Printf("Email: ")
	scanner.Scan()
	//email := scanner.Text()

	//req, err := http.NewRequest("GET", "http://localhost:8080/api/v1/users")

	fmt.Println("User registered!")
	return nil
}

func commandHelp(s *State, args ...string) error {
	fmt.Println()
	fmt.Println("Welcome to budgeting!")
	fmt.Println("Usage:")
	fmt.Println()

	for _, command := range getCommands() {
		fmt.Printf("%s: %s\n", command.name, command.description)
	}

	fmt.Println()
	return nil
}

func commandExit(s *State, args ...string) error {
	defer os.Exit(0)

	fmt.Println()
	fmt.Println("Exiting...")
	fmt.Println("Thank you for Budgeting!")
	fmt.Println()

	return nil
}
