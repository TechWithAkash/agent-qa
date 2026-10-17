.PHONY: help up down restart logs verify-shoplite build clean

help:
	@echo "DRISHTI AI — Make Commands"
	@echo "  make up               - Build and start all services via docker-compose"
	@echo "  make down             - Stop and remove all containers"
	@echo "  make restart          - Restart all containers"
	@echo "  make logs             - View logs from all containers"
	@echo "  make verify-shoplite  - Verify ShopLite planted defects B1-B4"
	@echo "  make clean            - Remove artifacts and temporary caches"

up:
	docker compose up --build -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f

verify-shoplite:
	@echo "Verifying ShopLite B1-B4 with BUG_SET=all (defects should be present)..."
	@PORT=3099 BUG_SET=all node apps/shoplite/src/index.js & \
	PID=$$!; \
	sleep 2; \
	python3 apps/shoplite/verify/b1.py http://localhost:3099 || echo "-> B1 Present (OK)"; \
	python3 apps/shoplite/verify/b2.py http://localhost:3099 || echo "-> B2 Present (OK)"; \
	python3 apps/shoplite/verify/b3.py http://localhost:3099 || echo "-> B3 Present (OK)"; \
	python3 apps/shoplite/verify/b4.py http://localhost:3099 || echo "-> B4 Present (OK)"; \
	kill $$PID
	@echo ""
	@echo "Verifying ShopLite B1-B4 with BUG_SET=none (defects should be absent)..."
	@PORT=3099 BUG_SET=none node apps/shoplite/src/index.js & \
	PID=$$!; \
	sleep 2; \
	python3 apps/shoplite/verify/b1.py http://localhost:3099 && \
	python3 apps/shoplite/verify/b2.py http://localhost:3099 && \
	python3 apps/shoplite/verify/b3.py http://localhost:3099 && \
	python3 apps/shoplite/verify/b4.py http://localhost:3099; \
	kill $$PID

clean:
	rm -rf data/artifacts/* data/llm_cache/* apps/backend/__pycache__ apps/runner/**/__pycache__
