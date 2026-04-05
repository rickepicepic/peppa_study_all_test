SHELL := /bin/bash

.PHONY: dev test compose-up compose-down compose-ps migrate smoke

dev:
	go run ./cmd/server

test:
	go test ./...

compose-up:
	docker compose up -d

compose-down:
	docker compose down

compose-ps:
	docker compose ps

migrate:
	@for f in db/migrations/*.up.sql; do \
		echo "apply $$f"; \
		docker exec -i nlp-mysql mysql -uroot -proot nlp < $$f; \
	done

smoke:
	bash ./scripts/smoke.sh
