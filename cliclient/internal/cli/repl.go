package cli

import (
	"bufio"
	"fmt"
	"os"
	"strings"
)

func StartRepl(s *State) {
	scanner := bufio.NewScanner(os.Stdin)

	for true {
		fmt.Print("Budgeting > ")
		scanner.Scan()
		words := cleanInput(scanner.Text())

		if len(words) == 0 {
			continue
		}

		commandName := words[0]
		args := words[1:]

		command, exists := getCommands()[commandName]
		if !exists {
			fmt.Println("Unknown command")
			continue
		}

		err := command.callback(s, args...)
		if err != nil {
			fmt.Println(err)
		}
	}
}

func cleanInput(text string) []string {
	text = strings.ToLower(text)
	return strings.Fields(text)
}
