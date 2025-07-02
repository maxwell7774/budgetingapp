package cli

import (
	"log"
	"os"
	"strings"
	"time"

	"github.com/maxwell7774/budgetingapp/internal/apiclient"
	"golang.org/x/term"
)

const (
	mainPrompt = "Budgeting > "
)

func StartRepl() {
	client := apiclient.NewClient(5 * time.Second)

	fd := int(os.Stdin.Fd())
	originalTermState, err := term.MakeRaw(fd)
	if err != nil {
		log.Fatalf("Couldn't set terminal to raw mode: %v", err)
	}
	defer term.Restore(fd, originalTermState)

	terminal := term.NewTerminal(os.Stdin, mainPrompt)

	cfg := &config{
		apiClient: client,
		userID:    nil,
		terminal: terminal,
		isRunning: true,
	}

	for cfg.isRunning {
		line, err := terminal.ReadLine()
		if err != nil {
			terminal.Write([]byte("\nExiting program...\n"))
			break
		}
		terminal.Write([]byte("\n"))

		words := cleanInput(line)

		if len(words) == 0 {
			continue
		}

		commandName := words[0]
		args := words[1:]

		command, exists := getCommands()[commandName]
		if !exists {
			terminal.Write([]byte("Unknown command"))
			continue
		}

		err = command.callback(cfg, args...)
		if err != nil {
			terminal.Write([]byte(err.Error()))
		}
		terminal.Write([]byte("\n"))
	}
}

func cleanInput(text string) []string {
	text = strings.ToLower(text)
	return strings.Fields(text)
}
