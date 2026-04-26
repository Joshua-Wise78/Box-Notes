package main

import (
	"database/sql"
	"log"

	"backend/internal/db"
	"backend/internal/handlers"

	"github.com/gofiber/fiber/v2"

	_ "modernc.org/sqlite"
)

func main() {
	conn, err := sql.Open("sqlite", "boxnotes.db")
	if err != nil {
		log.Fatal("Cannot connect to database: ", err)
	}
	defer conn.Close()

	queries := db.New(conn)

	app := fiber.New()

	api := app.Group("/api/v1")
	api.Post("/vault", handlers.CreateVault(queries))

	log.Println("Server Starting on http://localhost:3000")
	log.Fatal(app.Listen(":3000"))
}
