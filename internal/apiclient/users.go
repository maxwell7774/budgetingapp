package apiclient

import (
	"bytes"
	"context"
	"encoding/json"
	"io"
	"net/http"

	"github.com/maxwell7774/budgetingapp/backend/api"
)

func (c *Client) CreateUser(ctx context.Context, u api.CreateUserParams) (api.User, error) {
	url := baseURL + "/users"

	rDat, err := json.Marshal(u)
	if err != nil {
		return api.User{}, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(rDat))
	if err != nil {
		return api.User{}, err
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return api.User{}, err
	}
	defer resp.Body.Close()

	dat, err := io.ReadAll(resp.Body)
	if err != nil {
		return api.User{}, err
	}

	user := api.User{}
	err = json.Unmarshal(dat, &user)
	if err != nil {
		return api.User{}, err
	}

	return user, nil
}

func (c *Client) GetUsers(ctx context.Context) ([]api.User, error) {
	url := baseURL + "/users"

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

	users := []api.User{}
	err = json.Unmarshal(dat, &users)
	if err != nil {
		return nil, err
	}

	return users, nil
}
