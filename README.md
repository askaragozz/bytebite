# ByteBite

A full-stack food delivery platform built with Java/Spring Boot and React. Three user roles — customers, restaurant owners, and drivers — interact through a REST API backed by an event-driven architecture.

Built as a portfolio project to demonstrate production-style backend patterns: JWT authentication, Kafka events, RabbitMQ notifications, Redis caching, Elasticsearch search, and Docker containerisation.

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | Java 21, Spring Boot 3, Spring Security (JWT), Spring Data JPA |
| Database | PostgreSQL |
| Messaging | Apache Kafka (order events), RabbitMQ (status notifications) |
| Caching | Redis |
| Search | Elasticsearch |
| Frontend | React 19, Vite, Tailwind CSS |
| Infrastructure | Docker, Docker Compose |

---

## Architecture

**Three roles:**

- **Customer** — browse restaurants, search by cuisine (Elasticsearch phrase-prefix), build a cart, place orders
- **Restaurant Owner** — manage restaurants and menus, view incoming orders, update order status, assign a driver to each order
- **Driver** — view assigned deliveries, update delivery status; marking a delivery as `DELIVERED` automatically syncs the linked order to `DELIVERED`

**Order flow:**

```
Customer places order
  → order-placed event published to Kafka
  → Owner updates status (CONFIRMED → PREPARING → OUT_FOR_DELIVERY)
  → Owner assigns driver + delivery address
  → Driver marks delivery DELIVERED
  → Order status synced to DELIVERED automatically
```

RabbitMQ carries status-change notifications to the relevant user. Redis caches restaurant listings with automatic invalidation on write.

---

## Running locally

### Option 1 — Full Docker (recommended)

```bash
docker compose up --build
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Swagger UI: http://localhost:8080/swagger-ui.html

### Option 2 — Dev mode (infra in Docker, processes local)

```bash
# Start infrastructure
docker compose up -d db kafka rabbitmq redis elasticsearch

# Start backend (in one terminal)
mvn spring-boot:run -f backend/pom.xml

# Start frontend (in another terminal)
npm run dev --prefix frontend
```

The backend runs with the `dev` Spring profile by default, which seeds the database on startup.

---

## Seed accounts

The `dev` profile seeds 9 accounts, 11 restaurants, and 46 menu items automatically. All passwords are `password`.

| Email | Role |
|---|---|
| customer@bytebite.dev | Customer |
| bob@bytebite.dev | Customer |
| carol@bytebite.dev | Customer |
| mario@bytebite.dev | Restaurant Owner |
| sarah@bytebite.dev | Restaurant Owner |
| james@bytebite.dev | Restaurant Owner |
| dave@bytebite.dev | Driver |
| eva@bytebite.dev | Driver |
| frank@bytebite.dev | Driver |

---

## API documentation

Swagger UI is available at `/swagger-ui.html` when the backend is running. All protected endpoints require a Bearer token — log in via `POST /api/auth/login` and paste the token into the Authorize dialog.
