package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/api"
)

func (c *Client) GetPlanCategories(ctx context.Context, planID uuid.UUID) ([]api.PlanCategory, error) {
	url := baseURL + "/plans/" + planID.String() + "/categories"

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

	planCategories := []api.PlanCategory{}
	err = json.Unmarshal(dat, &planCategories)
	if err != nil {
		return nil, err
	}

	return planCategories, nil
}

func (c *Client) CreatePlanCategory(ctx context.Context, params api.CreatePlanCategoryParams) (api.PlanCategory, error) {
	url := baseURL + "/plan-categories"

	rDat, err := json.Marshal(params)
	if err != nil {
		return api.PlanCategory{}, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(rDat))
	if err != nil {
		return api.PlanCategory{}, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return api.PlanCategory{}, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.PlanCategory{}, err
	}

	planCategory := api.PlanCategory{}
	err = json.Unmarshal(dat, &planCategory)
	if err != nil {
		return api.PlanCategory{}, err
	}

	return planCategory, nil
}
