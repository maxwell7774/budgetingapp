package cli

import (
	"bufio"
	"context"
	"fmt"
	"os"
	"strconv"
)

func commandListPlanCategories(cfg *config, args ...string) error {
	plans, err := cfg.apiClient.GetPlans(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plans: %w", err)
	}

	if len(plans) == 0 {
		return fmt.Errorf("No plans found...")
	}

	scanner := bufio.NewScanner(os.Stdin)

	fmt.Println("----------PLANS----------")
	for i, p := range plans {
		fmt.Printf("%d. %s\n", i+1, p.Name)
	}

	fmt.Printf("Please select a plan: ")
	scanner.Scan()
	planIndex, err := strconv.Atoi(scanner.Text())
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

	fmt.Println()
	fmt.Printf("----------%s Categories----------\n", plan.Name)
	for _, c := range categories {
		fmt.Printf("* Name: %s, Deposit: %d, Withdrawl: %d\n", c.Name, c.Deposit, c.Withdrawl)
	}

	return nil
}
