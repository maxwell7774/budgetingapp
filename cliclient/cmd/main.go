package main

import (
	"github.com/maxwell7774/budgetingapp/cliclient/internal/cli"
)

func main() {
	/*
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}
	*/

	state := cli.NewState()

	cli.StartRepl(state)
}
