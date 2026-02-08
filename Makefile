# Makefile for Clinical Lab Management Application
# 
# This Makefile provides convenient shortcuts for common development tasks.
# It simplifies Docker and Django commands into easy-to-remember targets.
#
# For development teams new to Make:
# - Run `make help` to see all available commands
# - Run `make <command>` to execute a command
# - Example: `make start` starts all Docker containers
#
# Prerequisites:
# - Docker and Docker Compose installed
# - Make installed (usually pre-installed on Linux/Mac)

# Docker Compose command (use v2 plugin by default)
DOCKER_COMPOSE := docker compose

.PHONY: help start stop restart logs clean install migrate makemigrations superuser shell test

# Default target - show help
help:
	@echo "Clinical Lab Management - Development Commands"
	@echo "================================================"
	@echo ""
	@echo "Setup & Installation:"
	@echo "  make install          - Install all dependencies (first time setup)"
	@echo "  make setup            - Complete initial setup (install + migrate + superuser)"
	@echo ""
	@echo "Docker Management:"
	@echo "  make start            - Start all Docker containers (Nginx only exposed)"
	@echo "  make dev-start        - Start with all ports exposed (for debugging)"
	@echo "  make stop             - Stop all Docker containers"
	@echo "  make restart          - Restart all Docker containers"
	@echo "  make build            - Rebuild Docker images"
	@echo "  make logs             - Show logs from all containers"
	@echo "  make logs-backend     - Show backend logs only"
	@echo "  make logs-frontend    - Show frontend logs only"
	@echo ""
	@echo "Local Development (No Docker):"
	@echo "  make local-setup      - Setup local development environment"
	@echo "  make local-backend    - Run backend locally (Django dev server)"
	@echo "  make local-frontend   - Run frontend locally (Next.js dev server)"
	@echo "  make local-db         - Start only DB & Redis in Docker (for local dev)"
	@echo "  make local-stop       - Stop local DB & Redis containers"
	@echo ""
	@echo "Database:"
	@echo "  make migrate          - Run Django migrations"
	@echo "  make makemigrations   - Create new Django migrations"
	@echo "  make migrate-app APP=<appname>  - Migrate specific app"
	@echo "  make db-reset         - Reset database (WARNING: deletes all data)"
	@echo ""
	@echo "Django:"
	@echo "  make superuser        - Create Django superuser"
	@echo "  make shell            - Open Django shell"
	@echo "  make shell-db         - Open PostgreSQL shell"
	@echo "  make collectstatic    - Collect static files"
	@echo ""
	@echo "Testing & Quality:"
	@echo "  make test             - Run all tests"
	@echo "  make test-backend     - Run backend tests only"
	@echo "  make lint             - Run linters (flake8, black, eslint)"
	@echo "  make format           - Auto-format code (black, prettier)"
	@echo ""
	@echo "Cleanup:"
	@echo "  make clean            - Stop containers and remove volumes (fresh start)"
	@echo "  make clean-all        - Remove all Docker artifacts"
	@echo ""

# ==============================================================================
# SETUP & INSTALLATION
# ==============================================================================

install:
	@echo "Installing backend dependencies..."
	docker compose run --rm backend pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	docker compose run --rm frontend npm install
	@echo "Installation complete!"

setup: install migrate superuser
	@echo "Setup complete! You can now run 'make start'"

# ==============================================================================
# DOCKER MANAGEMENT
# ==============================================================================

start:
	@echo "Starting all services (Nginx only exposed - production-like)..."
	$(DOCKER_COMPOSE) up -d
	@echo "Services started! Access via Nginx:"
	@echo "  Main App: http://localhost"
	@echo ""
	@echo "Note: Backend and Frontend are NOT directly accessible"
	@echo "All traffic routes through Nginx for security"
	@echo ""
	@echo "For direct port access during debugging, use: make dev-start"

dev-start:
	@echo "Starting all services with direct port access (for debugging)..."
	$(DOCKER_COMPOSE) -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "Services started with direct access:"
	@echo "  Main App (Nginx): http://localhost"
	@echo "  Frontend Direct:  http://localhost:3000"
	@echo "  Backend Direct:   http://localhost:8000"
	@echo "  Django Admin:     http://localhost:8000/admin"
	@echo "  PostgreSQL:       localhost:5432"
	@echo "  Redis:            localhost:6379"
	@echo ""
	@echo "WARNING: This exposes all services. Use 'make start' for production-like setup."

stop:
	@echo "Stopping all services..."
	$(DOCKER_COMPOSE) stop

restart: stop start

build:
	@echo "Building Docker images..."
	$(DOCKER_COMPOSE) build

logs:
	$(DOCKER_COMPOSE) logs -f

logs-backend:
	$(DOCKER_COMPOSE) logs -f backend

logs-frontend:
	$(DOCKER_COMPOSE) logs -f frontend

# ==============================================================================
# DATABASE
# ==============================================================================

migrate:
	@echo "Running database migrations..."
	docker compose exec backend python manage.py migrate

makemigrations:
	@echo "Creating new migrations..."
	docker compose exec backend python manage.py makemigrations

migrate-app:
	@echo "Migrating app: $(APP)..."
	docker compose exec backend python manage.py migrate $(APP)

db-reset:
	@echo "WARNING: This will delete all data!"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		docker compose down -v; \
		docker compose up -d db redis; \
		sleep 5; \
		docker compose run --rm backend python manage.py migrate; \
		echo "Database reset complete!"; \
	fi

# ==============================================================================
# DJANGO COMMANDS
# ==============================================================================

superuser:
	@echo "Creating Django superuser..."
	docker compose exec backend python manage.py createsuperuser

shell:
	@echo "Opening Django shell..."
	docker compose exec backend python manage.py shell

shell-db:
	@echo "Opening PostgreSQL shell..."
	docker compose exec db psql -U postgres -d clinical_lab_db

collectstatic:
	@echo "Collecting static files..."
	docker compose exec backend python manage.py collectstatic --noinput

# ==============================================================================
# TESTING & QUALITY
# ==============================================================================

test:
	@echo "Running all tests..."
	docker compose exec backend pytest
	docker compose exec frontend npm test

test-backend:
	@echo "Running backend tests..."
	docker compose exec backend pytest -v --cov

lint:
	@echo "Running linters..."
	docker compose exec backend flake8 .
	docker compose exec backend black --check .
	docker compose exec frontend npm run lint

format:
	@echo "Auto-formatting code..."
	docker compose exec backend black .
	docker compose exec backend isort .
	docker compose exec frontend npm run format

# ==============================================================================
# CLEANUP
# ==============================================================================

clean:
	@echo "Stopping containers and removing volumes..."
	docker compose down -v
	@echo "Cleanup complete!"

clean-all:
	@echo "Removing all Docker artifacts..."
	docker compose down -v --rmi all --remove-orphans
	@echo "All cleaned up!"

# ==============================================================================
# PRODUCTION DEPLOYMENT
# ==============================================================================

prod-build:
	@echo "Building production images..."
	docker compose -f docker compose.yml -f docker compose.prod.yml build

prod-up:
	@echo "Starting production environment..."
	docker compose -f docker compose.yml -f docker compose.prod.yml up -d

prod-down:
	@echo "Stopping production environment..."
	docker compose -f docker compose.yml -f docker compose.prod.yml down

# ==============================================================================
# LOCAL DEVELOPMENT (Without Docker for better debugging)
# ==============================================================================

# Python venv paths
VENV_DIR := backend/venv
VENV_PYTHON := $(VENV_DIR)/bin/python3
VENV_PIP := $(VENV_DIR)/bin/pip

# Setup local development environment
local-setup:
	@echo "Setting up local development environment..."
	@echo ""
	@echo "1. Creating Python virtual environment..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		cd backend && python3 -m venv venv; \
		echo "✓ Virtual environment created"; \
	else \
		echo "✓ Virtual environment already exists"; \
	fi
	@echo ""
	@echo "2. Installing Python dependencies..."
	$(VENV_PIP) install -r backend/requirements.txt
	@echo ""
	@echo "3. Installing Node.js dependencies..."
	cd frontend && sudo npm install
	@echo ""
	@echo "4. Starting DB and Redis containers..."
	$(DOCKER_COMPOSE) up -d db redis
	@echo ""
	@echo "Waiting for database to be ready..."
	@sleep 5
	@echo ""
	@echo "5. Running migrations..."
	cd backend && ../$(VENV_PYTHON) manage.py migrate
	@echo ""
	@echo "✓ Local setup complete!"
	@echo ""
	@echo "Virtual environment created at: $(VENV_DIR)"
	@echo ""
	@echo "Next steps:"
	@echo "  1. Run 'make local-db' to start DB & Redis"
	@echo "  2. Run 'make local-backend' in one terminal"
	@echo "  3. Run 'make local-frontend' in another terminal"
	@echo ""

# Start only database and Redis for local development
local-db:
	@echo "Starting PostgreSQL and Redis containers..."
	$(DOCKER_COMPOSE) up -d db redis
	@echo ""
	@echo "✓ Database and Redis are running:"
	@echo "  PostgreSQL: localhost:5432"
	@echo "  Redis:      localhost:6379"
	@echo ""
	@echo "Now you can run:"
	@echo "  make local-backend   (in one terminal)"
	@echo "  make local-frontend  (in another terminal)"

# Stop local DB and Redis
local-stop:
	@echo "Stopping PostgreSQL and Redis..."
	$(DOCKER_COMPOSE) stop db redis

# Run Django backend locally
local-backend:
	@echo "Starting Django development server locally..."
	@echo "=============================================="
	@echo ""
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "⚠️  Virtual environment not found!"; \
		echo "   Run 'make local-setup' first"; \
		exit 1; \
	fi
	@if [ ! -f backend/.env.local ]; then \
		echo "⚠️  Warning: backend/.env.local not found!"; \
		echo "   Creating it from .env..."; \
		cp backend/.env backend/.env.local; \
		sed -i 's/DATABASE_HOST=db/DATABASE_HOST=localhost/g' backend/.env.local; \
		sed -i 's/REDIS_HOST=redis/REDIS_HOST=localhost/g' backend/.env.local; \
	fi
	@echo "Backend will be available at:"
	@echo "  http://localhost:8000"
	@echo "  http://localhost:8000/admin"
	@echo ""
	@echo "Using virtual environment: $(VENV_DIR)"
	@echo "Using .env.local for configuration"
	@echo "Press Ctrl+C to stop"
	@echo ""
	@cd backend && cp .env.local .env && ../$(VENV_PYTHON) manage.py runserver 0.0.0.0:8000

# Run Next.js frontend locally
local-frontend:
	@echo "Starting Next.js development server locally..."
	@echo "==============================================="
	@echo ""
	@echo "Frontend will be available at:"
	@echo "  http://localhost:3000"
	@echo ""
	@echo "Press Ctrl+C to stop"
	@echo ""
	cd frontend && sudo npm run dev

# Quick command to run both backend and frontend locally
# Note: This requires 'tmux' or you can run them in separate terminals
local-dev:
	@echo "To run local development:"
	@echo ""
	@echo "Terminal 1: make local-backend"
	@echo "Terminal 2: make local-frontend"
	@echo ""
	@echo "Or use tmux/screen to run both together"

# Install local Python dependencies (for backend)
local-install-backend:
	@echo "Installing Python dependencies locally..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "Creating virtual environment..."; \
		cd backend && python3 -m venv venv; \
	fi
	$(VENV_PIP) install -r backend/requirements.txt
	@echo "✓ Backend dependencies installed in virtual environment"

# Install local Node dependencies (for frontend)
local-install-frontend:
	@echo "Installing Node.js dependencies locally..."
	cd frontend && npm install
	@echo "✓ Frontend dependencies installed"

# Run backend migrations locally
local-migrate:
	@echo "Running migrations locally..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "⚠️  Virtual environment not found! Run 'make local-setup' first"; \
		exit 1; \
	fi
	cd backend && ../$(VENV_PYTHON) manage.py migrate

# Create superuser locally
local-superuser:
	@echo "Creating Django superuser locally..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "⚠️  Virtual environment not found! Run 'make local-setup' first"; \
		exit 1; \
	fi
	cd backend && ../$(VENV_PYTHON) manage.py createsuperuser

# Open Django shell locally
local-shell:
	@echo "Opening Django shell locally..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "⚠️  Virtual environment not found! Run 'make local-setup' first"; \
		exit 1; \
	fi
	cd backend && ../$(VENV_PYTHON) manage.py shell

# Run backend tests locally
local-test-backend:
	@echo "Running backend tests locally..."
	@if [ ! -d "$(VENV_DIR)" ]; then \
		echo "⚠️  Virtual environment not found! Run 'make local-setup' first"; \
		exit 1; \
	fi
	cd backend && ../$(VENV_PYTHON) -m pytest -v

# Run frontend tests locally
local-test-frontend:
	@echo "Running frontend tests locally..."
	cd frontend && npm test

# ==============================================================================
# UTILITY COMMANDS
# ==============================================================================

# Check if Docker is running
check-docker:
	@docker info > /dev/null 2>&1 || (echo "Docker is not running. Please start Docker." && exit 1)

# Show container status
status:
	@docker compose ps

# Show container resource usage
stats:
	@docker stats --no-stream

# Backup database
backup-db:
	@echo "Creating database backup..."
	@mkdir -p backups
	docker compose exec -T db pg_dump -U postgres clinical_lab_db > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "Backup created in backups/ directory"

# Restore database
restore-db:
	@echo "WARNING: This will overwrite current database!"
	@read -p "Backup file path: " backup_file; \
	docker compose exec -T db psql -U postgres clinical_lab_db < $$backup_file
	@echo "Database restored!"
