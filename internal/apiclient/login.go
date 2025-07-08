package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
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

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(rDat))
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

	loginResponse := api.LoginResponse{}
	err = json.Unmarshal(dat, &loginResponse)
	if err != nil {
		return api.LoginResponse{}, err
	}

	return loginResponse, nil
}
