# Makefile
.PHONY: run generate migrate-up migrate-down

run: migrate-up
	@echo "Starting Box-Notes Server..."
	go run cmd/api/main.go

generate:
	sqlc generate -f sqlc.yaml

migrate-up:
	@echo "Running database migrations..."
	migrate -path sql/migrations -database "sqlite://boxnotes.db" -verbose up

migrate-down:
	migrate -path sql/migrations -database "sqlite://boxnotes.db" -verbose down
