.PHONY: help up down logs build test migrate seed format clean

# Default goal
help:
	@echo "SkillSutra Enterprise Management Commands:"
	@echo ""
	@echo "  make up         - Start all services (Backend, Frontend, DB, Redis) via Docker Compose"
	@echo "  make down       - Stop and remove all services"
	@echo "  make logs       - Tail logs for all services"
	@echo "  make build      - Rebuild Docker images"
	@echo "  make test       - Run Pytest (Backend) and Jest (Frontend) suites"
	@echo "  make migrate    - Run Alembic database migrations"
	@echo "  make seed       - Seed the database with mock mentors and jobs"
	@echo "  make clean      - Remove __pycache__, node_modules, and dist folders"
	@echo ""

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

build:
	docker-compose build

test:
	@echo "==> Running Backend Tests (Pytest)..."
	cd server && pytest tests/
	@echo "==> Running Frontend Tests (Jest)..."
	cd web && npm run test

migrate:
	@echo "==> Upgrading PostgreSQL Database Schema..."
	cd server && alembic upgrade head

seed:
	@echo "==> Seeding Development Database..."
	cd server && python scripts/seed_dummy_data.py

format:
	@echo "==> Formatting Python Backend..."
	cd server && black . && isort .
	@echo "==> Formatting React Frontend..."
	cd web && npm run lint

clean:
	find . -type d -name "__pycache__" -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf web/node_modules web/.next
