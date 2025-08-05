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
	Name      string `json:"name,omitempty"`
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

func (p *Pagination) Offset() int32 {
	return int32((p.Page - 1) * p.PageSize)
}

func (p *Pagination) Limit() int32 {
	return int32(p.PageSize)
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

type Collection struct {
	Pagination
	Self     *url.URL        `json:"-"`
	Links    map[string]Link `json:"_links"`
	Embedded Embedded        `json:"_embedded"`
}

func (c *Collection) GenerateLinks() {
	if c.PageSize <= 0 {
		return
	}

	addLink := func(name string, page int64, link Link) {
		newURL := *c.Self
		query := newURL.Query()
		query.Set("page", fmt.Sprintf("%d", page))
		query.Set("page_size", fmt.Sprintf("%d", c.PageSize))
		newURL.RawQuery = query.Encode()
		link.Href = newURL.String()
		c.Links[name] = link
	}

	addLink("self", c.Page, Link{})

	if len(c.Self.Query()) > 2 && c.Self.Query().Has("page") && c.Self.Query().Has("page_size") {
		oldQuery := c.Self.Query().Encode()
		c.Self.RawQuery = ""
		addLink("all", 1, Link{})
		c.Self.RawQuery = oldQuery
	}

	if c.Page > 1 {
		addLink("first", 1, Link{})
		addLink("prev", c.Page-1, Link{})
	}

	if c.Page < c.TotalPages {
		addLink("next", c.Page+1, Link{})
		addLink("last", c.TotalPages, Link{})
	}

	/*
		for key, val := range c.Links {
			addLink(key, c.Page, val)
		}
	*/
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

	collection.GenerateLinks()
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
