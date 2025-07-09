package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/api"
)

func (c *Client) GetPlanLineItems(ctx context.Context, planID uuid.UUID) ([]api.LineItem, error) {
	url := baseURL + "/plans/" + planID.String() + "/line-items"

	req, err := http.NewRequestWithContext(ctx, "GET", url, nil)
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

	if resp.StatusCode != http.StatusOK {
		msg := api.ErrorResponse{}
		err = json.Unmarshal(dat, &msg)
		if err != nil {
			return nil, err
		}

		return nil, fmt.Errorf("%s: %s", resp.Status, msg.Error)
	}

	lineItems := []api.LineItem{}
	err = json.Unmarshal(dat, &lineItems)
	if err != nil {
		return nil, err
	}

	return lineItems, nil
}

func (c *Client) CreateLineItem(ctx context.Context, params api.CreateLineItemParams) (api.LineItem, error) {
	url := baseURL + "/line-items"

	rDat, err := json.Marshal(params)
	if err != nil {
		return api.LineItem{}, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(rDat))
	if err != nil {
		return api.LineItem{}, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return api.LineItem{}, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.LineItem{}, err
	}

	if resp.StatusCode != http.StatusCreated {
		msg := api.ErrorResponse{}
		err = json.Unmarshal(dat, &msg)
		if err != nil {
			return api.LineItem{}, err
		}

		return api.LineItem{}, fmt.Errorf("%s: %s", resp.Status, msg.Error)
	}

	lineItem := api.LineItem{}
	err = json.Unmarshal(dat, &lineItem)
	if err != nil {
		return api.LineItem{}, err
	}

	return lineItem, nil
}
