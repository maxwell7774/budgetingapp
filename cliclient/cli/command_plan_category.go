package cli

import (
	"context"
	"fmt"
	"strconv"
	"strings"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func commandListPlanCategories(cfg *config, args ...string) error {
	plans, err := cfg.apiClient.GetPlans(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plans: %w", err)
	}

	if len(plans) == 0 {
		return fmt.Errorf("No plans found...")
	}

	Writeln(cfg.terminal, "----------PLANS----------")
	for i, p := range plans {
		Writef(cfg.terminal, "%d. %s\n", i+1, p.Name)
	}

	cfg.terminal.SetPrompt("Please select a plan: ")
	line, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	planIndex, err := strconv.Atoi(line)
	if err != nil {
		return fmt.Errorf("Please enter a valid selection.")
	}
	planIndex -= 1
	if planIndex < 0 || planIndex >= len(plans) {
		return fmt.Errorf("Please enter a valid selection.")
	}

	plan := plans[planIndex]

	categories, err := cfg.apiClient.GetPlanCategories(context.Background(), plan.ID)
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plan categories: %w", err)
	}

	if len(categories) == 0 {
		return fmt.Errorf("No categories found...")
	}

	Writef(cfg.terminal, "\n----------%s Categories----------\n", plan.Name)

	for _, c := range categories {
		Writef(cfg.terminal, "* Name: %s, Deposit: %d, Withdrawal: %d\n", c.Name, c.Deposit, c.Withdrawal)
	}

	return nil
}

func commandCreatePlanCategory(cfg *config, args ...string) error {
	plans, err := cfg.apiClient.GetPlans(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plans: %w", err)
	}

	if len(plans) == 0 {
		return fmt.Errorf("No plans found...")
	}

	params := api.CreatePlanCategoryParams{}

	Writeln(cfg.terminal, "----------PLANS----------")
	for i, p := range plans {
		Writef(cfg.terminal, "%d. %s\n", i+1, p.Name)
	}

	cfg.terminal.SetPrompt("Plan selection: ")
	line, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}
	planIndex, err := strconv.Atoi(line)
	if err != nil {
		return fmt.Errorf("Please enter a valid plan selection.")
	}
	planIndex -= 1
	if planIndex < 0 || planIndex >= len(plans) {
		return fmt.Errorf("Please enter a valid plan selection.")
	}
	params.PlanID = plans[planIndex].ID

	cfg.terminal.SetPrompt("Category Name: ")
	params.Name, err = cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	cfg.terminal.SetPrompt("Withdrawal or Deposit (enter w or d): ")
	line, err = cfg.terminal.ReadLine()
	if err != nil {
		return err
	}
	typeOfCategory := strings.ToLower(line)

	switch typeOfCategory {
	case "w":
		cfg.terminal.SetPrompt("Withdrawal Goal: ")
		line, err = cfg.terminal.ReadLine()
		if err != nil {
			return err
		}

		withdrawal, err := strconv.Atoi(line)
		if err != nil {
			return fmt.Errorf("Not a valid deposit amount: %w", err)
		}

		params.Withdrawal = int32(withdrawal)
		params.Deposit = 0
	case "d":
		cfg.terminal.SetPrompt("Deposit Goal: ")
		line, err = cfg.terminal.ReadLine()
		if err != nil {
			return err
		}

		deposit, err := strconv.Atoi(line)
		if err != nil {
			return fmt.Errorf("Not a valid deposit amount: %w", err)
		}

		params.Deposit = int32(deposit)
		params.Withdrawal = 0
	default:
		return fmt.Errorf("You didn't select withdrawal or deposit...")
	}

	category, err := cfg.apiClient.CreatePlanCategory(context.Background(), params)
	if err != nil {
		return fmt.Errorf("Couldn't create plan category: %w", err)
	}

	Writeln(cfg.terminal, "----------NEW CATEGORY----------")
	Writef(cfg.terminal, "* ID: %s\n", category.ID)
	Writef(cfg.terminal, "* Name: %s\n", category.Name)
	Writef(cfg.terminal, "* Deposit: %d\n", category.Deposit)
	Writef(cfg.terminal, "* Withdrawal: %d\n", category.Withdrawal)
	Writef(cfg.terminal, "* Created At: %s\n", category.CreatedAt.String())

	return nil
}
