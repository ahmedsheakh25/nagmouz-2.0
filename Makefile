# Default shell
SHELL := /bin/bash

# Environment variables
ENV_FILE := env.template
LOCAL_ENV := .env.local

# Docker compose files
DOCKER_COMPOSE := docker-compose.yml

# Colors for terminal output
CYAN := \033[0;36m
GREEN := \033[0;32m
YELLOW := \033[0;33m
RED := \033[0;31m
NC := \033[0m # No Color

.PHONY: help setup install dev down clean rebuild logs test lint format deploy-orbit deploy-nujmooz db-push db-reset update-deps check-deps docker-up docker-down docker-logs

help: ## Show this help message
	@echo -e "$(CYAN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(CYAN)%-20s$(NC) %s\n", $$1, $$2}'

setup: ## Initial setup: copy env file and install dependencies
	@echo -e "$(GREEN)Setting up development environment...$(NC)"
	@if [ ! -f $(LOCAL_ENV) ]; then \
		cp $(ENV_FILE) $(LOCAL_ENV); \
		echo -e "$(GREEN)Created $(LOCAL_ENV) from template$(NC)"; \
	fi
	@echo -e "$(GREEN)Installing dependencies...$(NC)"
	@pnpm install
	@echo -e "$(GREEN)Setup complete!$(NC)"

install: ## Install dependencies
	@echo -e "$(GREEN)Installing dependencies...$(NC)"
	@pnpm install

dev: ## Start development environment
	@echo -e "$(GREEN)Starting development environment...$(NC)"
	@docker-compose up -d
	@echo -e "$(GREEN)Development environment is running!$(NC)"
	@echo -e "$(CYAN)Orbit: http://localhost:3000$(NC)"
	@echo -e "$(CYAN)Nujmooz: http://localhost:3001$(NC)"
	@echo -e "$(CYAN)Supabase Studio: http://localhost:54322$(NC)"

down: ## Stop development environment
	@echo -e "$(YELLOW)Stopping development environment...$(NC)"
	@docker-compose down
	@echo -e "$(GREEN)Development environment stopped$(NC)"

clean: down ## Clean up development environment and node_modules
	@echo -e "$(YELLOW)Cleaning up...$(NC)"
	@rm -rf node_modules
	@rm -rf apps/*/node_modules
	@rm -rf packages/*/node_modules
	@rm -rf apps/*/.next
	@rm -rf apps/*/dist
	@rm -rf packages/*/dist
	@echo -e "$(GREEN)Cleanup complete!$(NC)"

rebuild: clean setup dev ## Rebuild entire development environment

logs: ## Show logs from all containers
	@docker-compose logs -f

orbit-dev: ## Start only Orbit app in development mode
	@echo -e "$(GREEN)Starting Orbit app...$(NC)"
	@pnpm --filter orbit dev

nujmooz-dev: ## Start only Nujmooz app in development mode
	@echo -e "$(GREEN)Starting Nujmooz app...$(NC)"
	@pnpm --filter nujmooz dev

test: ## Run tests
	@echo -e "$(GREEN)Running tests...$(NC)"
	@pnpm test

lint: ## Run linter
	@echo -e "$(GREEN)Running linter...$(NC)"
	@pnpm lint

format: ## Format code
	@echo -e "$(GREEN)Formatting code...$(NC)"
	@pnpm format

db-reset: ## Reset Supabase database (caution: this will delete all data)
	@echo -e "$(RED)Warning: This will delete all data in the database!$(NC)"
	@read -p "Are you sure you want to continue? [y/N] " confirm; \
	if [ "$$confirm" = "y" ] || [ "$$confirm" = "Y" ]; then \
		echo -e "$(YELLOW)Resetting database...$(NC)"; \
		docker-compose down -v; \
		docker-compose up -d; \
		echo -e "$(GREEN)Database reset complete!$(NC)"; \
	else \
		echo -e "$(YELLOW)Database reset cancelled$(NC)"; \
	fi

update-deps: ## Update all dependencies
	@echo -e "$(GREEN)Updating dependencies...$(NC)"
	@pnpm update -r
	@echo -e "$(GREEN)Dependencies updated!$(NC)"

build: ## Build all applications
	@echo -e "$(GREEN)Building applications...$(NC)"
	@pnpm build

prod: ## Build and start production environment
	@echo -e "$(GREEN)Building for production...$(NC)"
	@docker build -t nagmouz .
	@echo -e "$(GREEN)Starting production environment...$(NC)"
	@docker run -d -p 3000:3000 -p 3001:3001 --name nagmouz-prod nagmouz
	@echo -e "$(GREEN)Production environment is running!$(NC)"
	@echo -e "$(CYAN)Orbit: http://localhost:3000$(NC)"
	@echo -e "$(CYAN)Nujmooz: http://localhost:3001$(NC)"

deploy-orbit:
	@echo -e "$(GREEN)Deploying Orbit to Vercel...$(NC)"
	@cd apps/orbit && vercel --prod
	@echo -e "$(GREEN)Orbit deployment complete!$(NC)"

deploy-nujmooz:
	@echo -e "$(GREEN)Deploying Nujmooz to Vercel...$(NC)"
	@cd apps/nujmooz && vercel --prod
	@echo -e "$(GREEN)Nujmooz deployment complete!$(NC)"

db-push:
	@echo -e "$(GREEN)Pushing database changes...$(NC)"
	@cd apps/orbit && pnpm supabase db push
	@echo -e "$(GREEN)Database push complete!$(NC)"

check-deps:
	@echo -e "$(GREEN)Checking for dependency vulnerabilities...$(NC)"
	@pnpm audit
	@echo -e "$(GREEN)Dependency check complete!$(NC)"

docker-up:
	@echo -e "$(GREEN)Starting Docker containers...$(NC)"
	@docker-compose up -d
	@echo -e "$(GREEN)Docker containers started!$(NC)"

docker-down:
	@echo -e "$(YELLOW)Stopping Docker containers...$(NC)"
	@docker-compose down
	@echo -e "$(GREEN)Docker containers stopped!$(NC)"

docker-logs:
	@echo -e "$(GREEN)Viewing Docker logs...$(NC)"
	@docker-compose logs -f

setup-env:
	@echo "Setting up environment files..."
	@if [ ! -f apps/orbit/.env.local ]; then \
		cp apps/orbit/env.local.env apps/orbit/.env.local; \
		echo "Created apps/orbit/.env.local"; \
	fi
	@if [ ! -f apps/nujmooz/.env.local ]; then \
		cp apps/nujmooz/env.local.env apps/nujmooz/.env.local; \
		echo "Created apps/nujmooz/.env.local"; \
	fi 