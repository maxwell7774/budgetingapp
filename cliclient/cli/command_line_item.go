package cli

import (
	"context"
	"fmt"
	"strconv"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func commandListLineItemsForPlan(cfg *config, args ...string) error {
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

	lineItems, err := cfg.apiClient.GetPlanLineItems(context.Background(), plan.ID)
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plan line items: %w", err)
	}

	if len(lineItems) == 0 {
		return fmt.Errorf("No line items found...")
	}

	Writef(cfg.terminal, "\n----------%s Line Items----------\n", plan.Name)

	for _, l := range lineItems {
		Writef(cfg.terminal, "* Description: %s, Deposit: %d, Withdrawal: %d\n", l.Description, l.Deposit, l.Withdrawal)
	}

	return nil
}

func commandCreateLineItem(cfg *config, args ...string) error {
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

	Writeln(cfg.terminal, "----------CATEGORIES----------")
	for i, c := range categories {
		Writef(cfg.terminal, "%d. %s\n", i+1, c.Name)
	}

	cfg.terminal.SetPrompt("Please select a category: ")
	line, err = cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	categoryIndex, err := strconv.Atoi(line)
	if err != nil {
		return fmt.Errorf("Please enter a valid selection.")
	}
	categoryIndex -= 1
	if categoryIndex < 0 || categoryIndex >= len(categories) {
		return fmt.Errorf("Please enter a valid selection.")
	}

	category := categories[categoryIndex]

	params := api.CreateLineItemParams{
		PlanID:         category.PlanID,
		PlanCategoryID: category.ID,
	}

	cfg.terminal.SetPrompt("Description: ")
	params.Description, err = cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	cfg.terminal.SetPrompt("Amount: ")
	line, err = cfg.terminal.ReadLine()
	if err != nil {
		return err
	}
	amount, err := strconv.Atoi(line)
	if err != nil {
		return err
	}
	params.Amount = int32(amount)

	lineItem, err := cfg.apiClient.CreateLineItem(context.Background(), params)
	if err != nil {
		return err
	}

	Writeln(cfg.terminal, "Line Category Created!")
	Writef(cfg.terminal, "* Description: %s\n", lineItem.Description)
	Writef(cfg.terminal, "* Plan: %s\n", plan.Name)
	Writef(cfg.terminal, "* Category: %s\n", category.Name)
	Writef(cfg.terminal, "* Deposit: %d\n", lineItem.Deposit)
	Writef(cfg.terminal, "* Withdrawal: %d\n", lineItem.Withdrawal)
	Writef(cfg.terminal, "* CreatedAt: %s\n", lineItem.CreatedAt)
	Writef(cfg.terminal, "* UpdatedAt: %s\n", lineItem.UpdatedAt)

	return nil
}
