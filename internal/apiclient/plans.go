package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func (c *Client) CreatePlan(ctx context.Context, params api.CreatePlanParams) (api.Plan, error) {
	url := baseURL + "/plans"

	rDat, err := json.Marshal(params)
	if err != nil {
		return api.Plan{}, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(rDat))
	if err != nil {
		return api.Plan{}, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return api.Plan{}, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.Plan{}, err
	}

	plan := api.Plan{}
	err = json.Unmarshal(dat, &plan)
	if err != nil {
		return api.Plan{}, err
	}
	
	return plan, nil
}

func (c *Client) GetPlans(ctx context.Context) ([]api.Plan, error) {
	url := baseURL + "/plans"

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, err
	}

	plans := []api.Plan{}
	err = json.Unmarshal(dat, &plans)
	if err != nil {
		return nil, err
	}

	return plans, nil
}
