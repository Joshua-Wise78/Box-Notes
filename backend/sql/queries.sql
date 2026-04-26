-- name: CreateVault :one
INSERT INTO vaults (name, description)
VALUES (?, ?)
RETURNING id, name, description, created_at;
