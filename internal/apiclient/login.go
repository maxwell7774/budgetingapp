package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func (c *Client) LoginUser(ctx context.Context, l api.LoginParams) (api.LoginResponse, error) {
	url := baseURL + "/login"

	rDat, err := json.Marshal(l)
	if err != nil {
		return api.LoginResponse{}, err
	}

	req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewBuffer(rDat))
	if err != nil {
		return api.LoginResponse{}, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return api.LoginResponse{}, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.LoginResponse{}, err
	}

	if resp.StatusCode != http.StatusOK {
		msg := api.ErrorResponse{}
		err = json.Unmarshal(dat, &msg)
		if err != nil {
			return api.LoginResponse{}, err
		}

		return api.LoginResponse{}, fmt.Errorf("%s: %s", resp.Status, msg.Error)
	}

	loginResponse := api.LoginResponse{}
	err = json.Unmarshal(dat, &loginResponse)
	if err != nil {
		return api.LoginResponse{}, err
	}

	return loginResponse, nil
}
