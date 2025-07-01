package cli

import (
	"bufio"
	"context"
	"fmt"
	"os"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func commandListPlans(cfg *config, args ...string) error {
	plans, err := cfg.apiClient.GetPlans(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plans: %w", err)
	}

	fmt.Println("----------PLANS----------")
	for _, p := range plans {
		fmt.Printf("* %s\n", p.Name)
	}

	return nil
}

func commandCreatePlan(cfg *config, args ...string) error {
	scanner := bufio.NewScanner(os.Stdin)

	fmt.Printf("Plan Name: ")
	scanner.Scan()
	name := scanner.Text()

	plan, err := cfg.apiClient.CreatePlan(context.Background(), api.CreatePlanParams{
		Name: name,
	})
	if err != nil {
		return fmt.Errorf("Couldn't create plan: %w", err)
	}

	fmt.Println()
	fmt.Println("Plan created!")
	fmt.Printf("ID: %s\n", plan.ID.String())
	fmt.Printf("Name: %s\n", plan.Name)
	fmt.Printf("Created At: %s\n", plan.CreatedAt.String())

	return nil
}

