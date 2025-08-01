package api

import (
	"encoding/json"
	"log"
	"net/http"
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
	TotalItems int             `json:"total_items"`
	Page       int             `json:"page"`
	PageSize   int             `json:"page_size"`
	Links      map[string]Link `json:"_links"`
	Embedded   Embedded        `json:"_embedded"`
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
