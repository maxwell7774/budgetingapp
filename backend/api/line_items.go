package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type LineItem struct {
	ID             uuid.UUID `json:"id"`
	PlanID         uuid.UUID `json:"plan_id"`
	PlanCategoryID uuid.UUID `json:"plan_category_id"`
	Description    string    `json:"description"`
	Deposit        int32     `json:"deposit"`
	Withdrawl      int32     `json:"withdrawl"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}

func (cfg *ApiConfig) HandlerLineItemsGet(w http.ResponseWriter, r *http.Request) {
	planID, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Not a valid id", err)
		return
	}

	lineItemsDB, err := cfg.db.GetLineItems(r.Context(), planID)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve line items", err)
		return
	}
	lineItems := []LineItem{}
	for _, p := range lineItemsDB {
		lineItems = append(lineItems, LineItem{
			ID:             p.ID,
			PlanID:         p.PlanID,
			PlanCategoryID: p.PlanCategoryID,
			Description:    p.Description,
			Deposit:        p.Deposit,
			Withdrawl:      p.Withdrawl,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
		})
	}

	respondWithJSON(w, http.StatusOK, lineItems)
}

func (cfg *ApiConfig) HandlerLineItemDeposit(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		PlanID         uuid.UUID `json:"plan_id"`
		PlanCategoryID uuid.UUID `json:"plan_category_id"`
		Description    string    `json:"description"`
		Amount         int32     `json:"amount"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	lineItem, err := cfg.db.CreateLineItem(r.Context(), database.CreateLineItemParams{
		PlanID:         params.PlanID,
		PlanCategoryID: params.PlanCategoryID,
		Description:    params.Description,
		Deposit:        params.Amount,
		Withdrawl:      0,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, LineItem{
		ID:             lineItem.ID,
		PlanID:         lineItem.PlanID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    lineItem.Description,
		Deposit:        lineItem.Deposit,
		Withdrawl:      lineItem.Withdrawl,
		CreatedAt:      lineItem.CreatedAt,
		UpdatedAt:      lineItem.UpdatedAt,
	})

}

func (cfg *ApiConfig) HandlerLineItemWithdrawl(w http.ResponseWriter, r *http.Request) {
	type parameters struct {
		PlanID         uuid.UUID `json:"plan_id"`
		PlanCategoryID uuid.UUID `json:"plan_category_id"`
		Description    string    `json:"description"`
		Amount         int32     `json:"amount"`
	}

	decoder := json.NewDecoder(r.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	lineItem, err := cfg.db.CreateLineItem(r.Context(), database.CreateLineItemParams{
		PlanID:         params.PlanID,
		PlanCategoryID: params.PlanCategoryID,
		Description:    params.Description,
		Deposit:        0,
		Withdrawl:      params.Amount,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	respondWithJSON(w, http.StatusCreated, LineItem{
		ID:             lineItem.ID,
		PlanID:         lineItem.PlanID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    lineItem.Description,
		Deposit:        lineItem.Deposit,
		Withdrawl:      lineItem.Withdrawl,
		CreatedAt:      lineItem.CreatedAt,
		UpdatedAt:      lineItem.UpdatedAt,
	})
}
