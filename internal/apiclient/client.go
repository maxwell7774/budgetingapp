package apiclient

import (
	"net/http"
	"time"
)

type Client struct {
	httpClient  http.Client
	accessToken string
}

func NewClient(timeout time.Duration) Client {
	return Client{
		httpClient: http.Client{
			Timeout: timeout,
		},
	}
}

type customTransport struct {
	accessToken string
	transport   http.RoundTripper
}

func (c *customTransport) RoundTrip(req *http.Request) (*http.Response, error) {
	req.Header.Set("Authorization", "Bearer "+c.accessToken)
	return c.transport.RoundTrip(req)
}

func (c *Client) SetAccessToken(accessToken string) {
	transport := customTransport{
		accessToken: accessToken,
		transport:   http.DefaultTransport,
	}
	c.httpClient.Transport = &transport
}
