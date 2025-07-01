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

func HandlerLineItemsGet(cfg *ApiConfig) {
	planID, err := uuid.Parse(cfg.Req.PathValue("id"))
	if err != nil {
		respondWithError(cfg.Resp, http.StatusNotFound, "Not a valid id", err)
		return
	}

	lineItemsDB, err := cfg.DB.GetLineItems(cfg.Req.Context(), planID)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't retrieve line items", err)
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

	respondWithJSON(cfg.Resp, http.StatusOK, lineItems)
}

func HandlerLineItemDeposit(cfg *ApiConfig) {
	type parameters struct {
		PlanID         uuid.UUID `json:"plan_id"`
		PlanCategoryID uuid.UUID `json:"plan_category_id"`
		Description    string    `json:"description"`
		Amount         int32     `json:"amount"`
	}

	decoder := json.NewDecoder(cfg.Req.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	lineItem, err := cfg.DB.CreateLineItem(cfg.Req.Context(), database.CreateLineItemParams{
		PlanID:         params.PlanID,
		PlanCategoryID: params.PlanCategoryID,
		Description:    params.Description,
		Deposit:        params.Amount,
		Withdrawl:      0,
	})
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	respondWithJSON(cfg.Resp, http.StatusCreated, LineItem{
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

func HandlerLineItemWithdrawl(cfg *ApiConfig) {
	type parameters struct {
		PlanID         uuid.UUID `json:"plan_id"`
		PlanCategoryID uuid.UUID `json:"plan_category_id"`
		Description    string    `json:"description"`
		Amount         int32     `json:"amount"`
	}

	decoder := json.NewDecoder(cfg.Req.Body)
	params := parameters{}
	err := decoder.Decode(&params)
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	lineItem, err := cfg.DB.CreateLineItem(cfg.Req.Context(), database.CreateLineItemParams{
		PlanID:         params.PlanID,
		PlanCategoryID: params.PlanCategoryID,
		Description:    params.Description,
		Deposit:        0,
		Withdrawl:      params.Amount,
	})
	if err != nil {
		respondWithError(cfg.Resp, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	respondWithJSON(cfg.Resp, http.StatusCreated, LineItem{
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
