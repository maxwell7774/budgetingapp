package api

import (
	"encoding/json"
	"log"
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

type Collection struct {
	TotalItems int64           `json:"total_items"`
	Page       int64           `json:"page"`
	PageSize   int64           `json:"page_size"`
	TotalPages int64           `json:"total_pages"`
	Links      map[string]Link `json:"_links"`
	Embedded   Embedded        `json:"_embedded"`
}

func getPaginationFromQuery(query url.Values) (page, pageSize int64) {
	pageQuery := query.Get("page")
	page = 1
	if pageQuery != "" {
		pageParsed, err := strconv.ParseInt(pageQuery, 0, 64)
		if err == nil {
			page = pageParsed
		}
	}

	pageSizeQuery := query.Get("page_size")
	pageSize = 25
	if pageSizeQuery != "" {
		pageSizeParsed, err := strconv.ParseInt(pageSizeQuery, 0, 64)
		if err == nil {
			pageSize = pageSizeParsed
		}
	}

	return page, pageSize
}

func (c *Collection) GeneratePaginationLinks() {
	if c.Links == nil {
		c.Links = make(map[string]Link)
	}
	c.TotalPages = c.TotalItems / c.PageSize
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
