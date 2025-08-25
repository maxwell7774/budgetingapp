package api

import (
	"encoding/json"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/maxwell7774/budgetingapp/backend/internal/auth"
	"github.com/maxwell7774/budgetingapp/backend/internal/database"
)

type LineItem struct {
	ID             uuid.UUID       `json:"id"`
	UserID         uuid.UUID       `json:"user_id"`
	PlanCategoryID uuid.UUID       `json:"plan_category_id"`
	Description    string          `json:"description"`
	Deposit        int32           `json:"deposit"`
	Withdrawal     int32           `json:"withdrawal"`
	CreatedAt      time.Time       `json:"created_at"`
	UpdatedAt      time.Time       `json:"updated_at"`
	Links          map[string]Link `json:"_links"`
}

func (l *LineItem) GenerateLinks() {
	self := "/api/v1/line-items/" + l.ID.String()
	l.Links = DefaultLinks(self)
	l.Links["revert"] = Link{Href: self + "/revert", Method: "POST"}
}

func (cfg *APIConfig) HandlerLineItemsGet(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	pagination := Pagination{}
	lineItemsDB := []database.LineItem{}

	planIDQuery := r.URL.Query().Get("plan_id")
	categoryIDQuery := r.URL.Query().Get("category_id")

	if planIDQuery != "" {
		planID, err := uuid.Parse(planIDQuery)
		if err != nil {
			respondWithError(w, http.StatusNotFound, "Not a valid id", err)
			return
		}

		totalLineItems, err := cfg.db.CountLineItemsForPlan(r.Context(), planID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve count of line items for plan", err)
			return
		}

		pagination = getPaginationFromQuery(r.URL.Query(), totalLineItems)

		lineItemsDB, err = cfg.db.GetLineItemsForPlan(r.Context(), database.GetLineItemsForPlanParams{
			PlanID: planID,
			Limit:  pagination.Limit(),
			Offset: pagination.Offset(),
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve line items", err)
			return
		}
	} else if categoryIDQuery != "" {
		categoryID, err := uuid.Parse(categoryIDQuery)
		if err != nil {
			respondWithError(w, http.StatusNotFound, "Not a valid id", err)
			return
		}

		totalLineItems, err := cfg.db.CountLineItemsForCategory(r.Context(), categoryID)
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve count of line items for plan", err)
			return
		}

		pagination = getPaginationFromQuery(r.URL.Query(), totalLineItems)

		lineItemsDB, err = cfg.db.GetLineItemsForCategory(r.Context(), database.GetLineItemsForCategoryParams{
			PlanCategoryID: categoryID,
			Limit:          pagination.Limit(),
			Offset:         pagination.Offset(),
		})
		if err != nil {
			respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve line items", err)
			return
		}
	} else {
		respondWithError(w, http.StatusBadRequest, "No ?plan_id={id} or ?category_id={id} query found", nil)
		return
	}

	lineItems := make([]Item, len(lineItemsDB))
	for i, p := range lineItemsDB {
		lineItems[i] = &LineItem{
			ID:             p.ID,
			UserID:         p.UserID,
			PlanCategoryID: p.PlanCategoryID,
			Description:    p.Description,
			Deposit:        p.Deposit,
			Withdrawal:     p.Withdrawal,
			CreatedAt:      p.CreatedAt,
			UpdatedAt:      p.UpdatedAt,
		}
	}

	respondWithCollection(w, http.StatusOK, Collection{
		Self:       r.URL,
		Pagination: pagination,
		Embedded: Embedded{
			Items: lineItems,
		},
		Links: map[string]Link{
			"create": {
				Href:   r.URL.Path,
				Method: "POST",
			},
		},
	})
}

func (cfg *APIConfig) HandlerLineItemGetByID(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse line item id", err)
		return
	}

	lineItem, err := cfg.db.GetLineItemByID(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve line item", err)
		return
	}

	respondWithItem(w, http.StatusOK, &LineItem{
		ID:             lineItem.ID,
		UserID:         lineItem.UserID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    lineItem.Description,
		Deposit:        lineItem.Deposit,
		Withdrawal:     lineItem.Withdrawal,
		CreatedAt:      lineItem.CreatedAt,
		UpdatedAt:      lineItem.UpdatedAt,
	})
}

type CreateLineItemParams struct {
	PlanCategoryID uuid.UUID `json:"plan_category_id"`
	Description    string    `json:"description"`
	Amount         int32     `json:"amount"`
}

func (cfg *APIConfig) HandlerLineItemCreate(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := CreateLineItemParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	planCategory, err := cfg.db.GetPlanCategoryByID(r.Context(), params.PlanCategoryID)
	if err != nil {
		respondWithError(w, http.StatusNotFound, "Plan category couldn't be retrieved", err)
		return
	}

	deposit := int32(0)
	withdrawal := int32(0)

	if planCategory.Withdrawal > 0 {
		withdrawal = params.Amount
	} else {
		deposit = params.Amount
	}

	lineItem, err := cfg.db.CreateLineItem(r.Context(), database.CreateLineItemParams{
		UserID:         userID,
		PlanCategoryID: params.PlanCategoryID,
		Description:    params.Description,
		Deposit:        deposit,
		Withdrawal:     withdrawal,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	respondWithItem(w, http.StatusCreated, &LineItem{
		ID:             lineItem.ID,
		UserID:         lineItem.UserID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    lineItem.Description,
		Deposit:        lineItem.Deposit,
		Withdrawal:     lineItem.Withdrawal,
		CreatedAt:      lineItem.CreatedAt,
		UpdatedAt:      lineItem.UpdatedAt,
	})

}

type UpdateLineItemParams struct {
	Description string `json:"description"`
}

func (cfg *APIConfig) HandlerLineItemUpdate(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse line item id", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := UpdateLineItemParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode params", err)
		return
	}

	lineItem, err := cfg.db.UpdateLineItem(r.Context(), database.UpdateLineItemParams{
		ID:          id,
		Description: params.Description,
	})
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't update line item", err)
		return
	}

	respondWithItem(w, http.StatusOK, &LineItem{
		ID:             lineItem.ID,
		UserID:         lineItem.UserID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    lineItem.Description,
		Deposit:        lineItem.Deposit,
		Withdrawal:     lineItem.Withdrawal,
		CreatedAt:      lineItem.CreatedAt,
		UpdatedAt:      lineItem.UpdatedAt,
	})
}

type RevertLineItemParams struct {
	Description string `json:"description"`
}

func (cfg *APIConfig) HandlerLineItemRevert(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	userID, err := auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse line item id", err)
		return
	}

	decoder := json.NewDecoder(r.Body)
	params := RevertLineItemParams{}
	err = decoder.Decode(&params)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't decode parameters", err)
		return
	}

	lineItem, err := cfg.db.GetLineItemByID(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't retrieve line item", err)
		return
	}

	args := database.CreateLineItemParams{
		UserID:         userID,
		PlanCategoryID: lineItem.PlanCategoryID,
		Description:    params.Description,
	}

	if lineItem.Withdrawal > 0 {
		args.Deposit = lineItem.Withdrawal
	} else {
		args.Withdrawal = lineItem.Deposit
	}

	revertedLineItem, err := cfg.db.CreateLineItem(r.Context(), args)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't add reverted line item", err)
		return
	}

	respondWithItem(w, http.StatusOK, &LineItem{
		ID:             revertedLineItem.ID,
		UserID:         revertedLineItem.UserID,
		PlanCategoryID: revertedLineItem.PlanCategoryID,
		Description:    revertedLineItem.Description,
		Deposit:        revertedLineItem.Deposit,
		Withdrawal:     revertedLineItem.Withdrawal,
		CreatedAt:      revertedLineItem.CreatedAt,
		UpdatedAt:      revertedLineItem.UpdatedAt,
	})
}

func (cfg *APIConfig) HandlerLineItemDelete(w http.ResponseWriter, r *http.Request) {
	accessToken, err := auth.GetBearerToken(r.Header)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't find jwt", err)
		return
	}

	_, err = auth.ValidateJWT(accessToken, cfg.jwtSecret)
	if err != nil {
		respondWithError(w, http.StatusUnauthorized, "Couldn't validate jwt", err)
		return
	}

	id, err := uuid.Parse(r.PathValue("id"))
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't parse line item id", err)
		return
	}

	err = cfg.db.DeleteLineItem(r.Context(), id)
	if err != nil {
		respondWithError(w, http.StatusInternalServerError, "Couldn't delete line item", err)
		return
	}

	w.WriteHeader(http.StatusNoContent)
}
