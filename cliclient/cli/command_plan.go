package cli

import (
	"context"
	"fmt"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func commandListPlans(cfg *config, args ...string) error {
	plans, err := cfg.apiClient.GetPlans(context.Background())
	if err != nil {
		return fmt.Errorf("Couldn't retrieve plans: %w", err)
	}

	Writeln(cfg.terminal, "----------PLANS----------")
	for _, p := range plans {
		Writef(cfg.terminal, "* %s\n", p.Name)
	}

	return nil
}

func commandCreatePlan(cfg *config, args ...string) error {
	defer cfg.terminal.SetPrompt(mainPrompt)

	cfg.terminal.SetPrompt("Plan Name: ")
	name, err := cfg.terminal.ReadLine()
	if err != nil {
		return err
	}

	plan, err := cfg.apiClient.CreatePlan(context.Background(), api.CreatePlanParams{
		Name: name,
	})
	if err != nil {
		return fmt.Errorf("Couldn't create plan: %w", err)
	}

	Writeln(cfg.terminal, "Plan created!")
	Writef(cfg.terminal, "ID: %s\n", plan.ID.String())
	Writef(cfg.terminal, "Name: %s\n", plan.Name)
	Writef(cfg.terminal, "Created At: %s\n", plan.CreatedAt.String())

	return nil
}
