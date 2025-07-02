package main

import (
	"github.com/maxwell7774/budgetingapp/cliclient/cli"
)

func main() {
	/*
		err := godotenv.Load()
		if err != nil {
			log.Fatal("Error loading .env file")
		}
	*/
	cli.StartRepl()
}
