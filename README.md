# STK Test — README

This monorepo is intended to act as submission media for STK Technical Test


## Setup instructions
Prerequisites
- Node.js 18+ and yarn (recommended) or npm
- Git
- (Optional) Docker & Docker Compose


### Production Setup

For dockerized deployment:
```bash
git clone <repo-url>
cd <repo-root>
docker compose up
```

For regular deployment:

- Backend
    - Copy `.env.example` to `.env` and set values:
    - Change DB_* values depending on your current database configuration.
    - Run `yarn db:migrate` or `npm db:migrate`.
    - Run `yarn db:generate` or `npm db:generate`.
    - Run `yarn build` or `npm build`, then;
    - Run `yarn start:prod` or `npm start:prod`.

- Frontend
    - Copy `.env.example` to `.env` and set values:
    - Adjust NEXT_PUBLIC_API to point to the backend API URL.
    - Run `yarn build` or `npm build`, then;
    - Run `yarn start` or `npm start`.


### Development Setup

- Backend
    - Copy `.env.example` to `.env` and set values:
    - Change DB_* values depending on your current database configuration.
    - Run `yarn db:migrate` or `npm db:migrate`.
    - Run `yarn db:generate` or `npm db:generate`.
    - Run `yarn start:dev` or `npm start:dev`.

- Frontend
    - Copy `.env.example` to `.env` and set values:
    - Adjust NEXT_PUBLIC_API to point to the backend API URL.
    - Run `yarn dev` or `npm dev`.

## API documentation / Swagger
The Backend's Swagger/OpenAPI is included, start the server and visit:
    - `http://localhost:3000/api`

## Technology choices and architecture decisions
- Runtime: Node.js — widely supported, fast iteration.
- Framework: Express (or lightweight alternative) — minimal, well-known routing and middleware.
- Language: TypeScript for type safety.
- Testing: Jest (unit) and supertest (integration) recommended.
- Architecture: simple layered design
    - For Backend
        - Routes -> Controllers -> Services
        - Keep controllers thin; business logic in services.
- Configuration: 12-factor app principles (env-based config), stateless app suitable for containers.
- Observability: logging (structured), and consider health endpoints (`/health`) and metrics if needed.
- Security: validate inputs, sanitize outputs, use HTTPS and secure headers in production.