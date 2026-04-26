package handlers

import (
	"database/sql"

	"backend/internal/db"

	"github.com/gofiber/fiber/v2"
)

type CreateVaultRequest struct {
	Name        string `json:"name"`
	Description string `json:"description"`
}

func CreateVault(queries *db.Queries) fiber.Handler {
	return func(c *fiber.Ctx) error {
		var payload CreateVaultRequest

		if err := c.BodyParser(&payload); err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid request body",
			})
		}

		if payload.Name == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Vault name is required.",
			})
		}

		vault, err := queries.CreateVault(c.Context(), db.CreateVaultParams{
			Name: payload.Name,
			Description: sql.NullString{
				String: payload.Description,
				Valid:  payload.Description != "",
			},
		})
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Failed to create vault",
			})
		}

		return c.Status(fiber.StatusCreated).JSON(vault)
	}
}
