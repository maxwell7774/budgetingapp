package api

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"net/url"
	"strconv"
)

type Link struct {
	Href      string `json:"href"`
	Method    string `json:"method,omitempty"`
	Title     string `json:"title,omitempty"`
	Templated bool   `json:"templated,omitempty"`
}

type Item interface {
	GenerateLinks()
}

type Embedded struct {
	Items []Item `json:"items"`
}

type Pagination struct {
	TotalItems int64 `json:"total_items"`
	Page       int64 `json:"page"`
	PageSize   int64 `json:"page_size"`
	TotalPages int64 `json:"total_pages"`
}

type Collection struct {
	Pagination
	Self     *url.URL        `json:"-"`
	Links    map[string]Link `json:"_links"`
	Embedded Embedded        `json:"_embedded"`
}

func getPaginationFromQuery(query url.Values, totalItems int64) (pagination Pagination) {
	pageQuery := query.Get("page")
	var page int64 = 1
	if pageQuery != "" {
		pageParsed, err := strconv.ParseInt(pageQuery, 0, 64)
		if err == nil {
			page = pageParsed
		}
	}

	pageSizeQuery := query.Get("page_size")
	var pageSize int64 = 25
	if pageSizeQuery != "" {
		pageSizeParsed, err := strconv.ParseInt(pageSizeQuery, 0, 64)
		if err == nil {
			pageSize = pageSizeParsed
		}
	}

	totalPages := int64(math.Ceil(float64(totalItems) / float64(pageSize)))

	if page > totalPages {
		page = totalPages
	}

	if page < 1 {
		page = 1
	}

	if pageSize < 0 {
		pageSize = 25
	}

	return Pagination{
		Page:       page,
		PageSize:   pageSize,
		TotalPages: totalPages,
		TotalItems: totalItems,
	}
}

func (c *Collection) GeneratePaginationLinks() {
	if c.PageSize <= 0 {
		return
	}

	self := *c.Self
	query := self.Query()
	query.Set("page", fmt.Sprintf("%d", c.Page))
	query.Set("page_size", fmt.Sprintf("%d", c.PageSize))
	self.RawQuery = query.Encode()
	c.Links["self"] = Link{
		Href: self.String(),
	}

	if len(self.Query()) > 2 &&
		self.Query().Has("page") &&
		self.Query().Has("page_size") {
		all := *c.Self
		query = url.Values{}
		query.Add("page", "1")
		query.Add("page_size", fmt.Sprintf("%d", c.PageSize))
		all.RawQuery = query.Encode()
		c.Links["all"] = Link{
			Href: all.String(),
		}
	}

	if c.Page > 1 {
		first := *c.Self
		query := first.Query()
		query.Set("page", "1")
		first.RawQuery = query.Encode()
		c.Links["first"] = Link{
			Href: first.String(),
		}

		prev := *c.Self
		query = prev.Query()
		query.Set("page", fmt.Sprintf("%d", c.Page-1))
		prev.RawQuery = query.Encode()
		c.Links["prev"] = Link{
			Href: prev.String(),
		}
	}

	if c.Page < c.TotalPages {
		next := *c.Self
		query := next.Query()
		query.Set("page", fmt.Sprintf("%d", c.Page+1))
		next.RawQuery = query.Encode()
		c.Links["next"] = Link{
			Href: next.String(),
		}

		last := *c.Self
		query = next.Query()
		query.Set("page", fmt.Sprintf("%d", c.Page+1))
		last.RawQuery = query.Encode()
		c.Links["last"] = Link{
			Href: last.String(),
		}
	}

}

type ErrorResponse struct {
	Error string `json:"error"`
}

func respondWithError(w http.ResponseWriter, code int, msg string, err error) {
	if err != nil {
		log.Println(err)
	}

	if code > 499 {
		log.Printf("Responding with 5XX error: %s", msg)
	}

	respondWithJSON(w, code, ErrorResponse{
		Error: msg,
	})
}

func respondWithItem(w http.ResponseWriter, code int, item Item) {
	item.GenerateLinks()
	respondWithJSON(w, code, item)
}

func respondWithCollection(w http.ResponseWriter, code int, collection Collection) {
	if collection.Links == nil {
		collection.Links = make(map[string]Link)
	}

	collection.GeneratePaginationLinks()
	for _, i := range collection.Embedded.Items {
		i.GenerateLinks()
	}
	respondWithJSON(w, code, collection)
}

func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	dat, err := json.Marshal(payload)
	if err != nil {
		log.Printf("Error marshalling JSON: %s", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.WriteHeader(code)
	w.Write(dat)
}
