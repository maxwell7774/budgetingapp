package cli

import (
	"bufio"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/maxwell7774/budgetingapp/internal/apiclient"
)

func StartRepl() {
	client := apiclient.NewClient(5 * time.Second)

	cfg := &config{
		apiClient: client,
	}

	scanner := bufio.NewScanner(os.Stdin)

	for true {
		fmt.Print("Budgeting > ")
		scanner.Scan()
		words := cleanInput(scanner.Text())

		if len(words) == 0 {
			continue
		}

		fmt.Println()

		commandName := words[0]
		args := words[1:]

		command, exists := getCommands()[commandName]
		if !exists {
			fmt.Println("Unknown command")
			continue
		}

		err := command.callback(cfg, args...)
		if err != nil {
			fmt.Println(err)
		}

		fmt.Println()
	}
}

func cleanInput(text string) []string {
	text = strings.ToLower(text)
	return strings.Fields(text)
}
