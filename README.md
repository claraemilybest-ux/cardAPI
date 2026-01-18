# cardAPI

Simple Express-based REST API for managing "cards" stored in a local JSON file.

## Features
- JWT (HS256) authentication for all card endpoints
- CRUD for cards: create, read (with query filters), update (PUT /cards/:id — enforces unique ids), delete
- Flexible filtering: query parameters match strings, arrays and nested objects (case-insensitive)
- Simple file-based persistence: data stored in `cards.json`

## Prerequisites
- macOS
- Node.js (v14+ recommended)
- git (optional)

## Setup

1. Clone or navigate to the repo:
   - cd /Users/clara/Code/Backend/cardAPI

2. Install dependencies:
   - npm install

3. Configure environment (optional):
   - Export a JWT secret and PORT if you want custom values:
     - export JWT_SECRET="your_secret_here"
     - export PORT=4000

4. Start the server:
   - node index.js
   - Or with a specific port: PORT=4001 node index.js

If the chosen PORT is in use the server will log an error and exit.

## Data file
The API reads/writes `cards.json` in the project root. Example card shape:
```json
{
  "id": 1,
  "title": "Example Card",
  "tags": ["example","sample"],
  "meta": { "createdBy": "user1" }
}
```

## Endpoints (brief)

- POST /getToken
  - Body: { "username": "...", "password": "..." }
  - Returns: { "token": "..." } (signed with HS256, default secret `your_jwt_secret`)

- GET /cards
  - Requires Authorization: Bearer <token>
  - Optional query parameters to filter (case-insensitive, partial matches).
  - Example: /cards?title=fire&tags=magic

- POST /cards/create
  - Requires Authorization
  - Body: card object (id is assigned automatically)
  - Response: 201 created card

- PUT /cards/:id
  - Requires Authorization
  - Updates card using request body merged into the existing card.
  - If body contains `id`, it will attempt to change the card id — the endpoint enforces uniqueness and will return 400 if the new id is already taken.
  - Returns updated card.

- DELETE /cards/:id
  - Requires Authorization
  - Removes the card (returns 204)

## Quick curl examples

Obtain token:
```bash
curl -s -X POST http://localhost:3000/getToken \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass1"}' | jq
```

Use token to get cards:
```bash
TOKEN="...replace-with-token..."
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/cards
```

Update a card (example):
```bash
curl -X PUT http://localhost:3000/cards/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","id":3}'
```
If id 3 already exists the server returns 400 ("id must be unique").

## Error handling
- Invalid or missing token → 401
- Card not found → 404
- Invalid id or id conflict on update → 400
- Server errors → 500

## Notes
- Default JWT secret is `your_jwt_secret` — change in production using the JWT_SECRET env var.
- This project uses synchronous file reads/writes for simplicity; consider moving to an async DB or file operations for production.

```// filepath: /Users/clara/Code/Backend/cardAPI/README.md
# cardAPI

Simple Express-based REST API for managing "cards" stored in a local JSON file.

## Features
- JWT (HS256) authentication for all card endpoints
- CRUD for cards: create, read (with query filters), update (PUT /cards/:id — enforces unique ids), delete
- Flexible filtering: query parameters match strings, arrays and nested objects (case-insensitive)
- Simple file-based persistence: data stored in `cards.json`

## Prerequisites
- macOS
- Node.js (v14+ recommended)
- git (optional)

## Setup

1. Clone or navigate to the repo:
   - cd /Users/clara/Code/Backend/cardAPI

2. Install dependencies:
   - npm install

3. Configure environment (optional):
   - Export a JWT secret and PORT if you want custom values:
     - export JWT_SECRET="your_secret_here"
     - export PORT=4000

4. Start the server:
   - node index.js
   - Or with a specific port: PORT=4001 node index.js

If the chosen PORT is in use the server will log an error and exit.

## Data file
The API reads/writes `cards.json` in the project root. Example card shape:
```json
{
  "id": 1,
  "title": "Example Card",
  "tags": ["example","sample"],
  "meta": { "createdBy": "user1" }
}
```

## Endpoints (brief)

- POST /getToken
  - Body: { "username": "...", "password": "..." }
  - Returns: { "token": "..." } (signed with HS256, default secret `your_jwt_secret`)

- GET /cards
  - Requires Authorization: Bearer <token>
  - Optional query parameters to filter (case-insensitive, partial matches).
  - Example: /cards?title=fire&tags=magic

- POST /cards/create
  - Requires Authorization
  - Body: card object (id is assigned automatically)
  - Response: 201 created card

- PUT /cards/:id
  - Requires Authorization
  - Updates card using request body merged into the existing card.
  - If body contains `id`, it will attempt to change the card id — the endpoint enforces uniqueness and will return 400 if the new id is already taken.
  - Returns updated card.

- DELETE /cards/:id
  - Requires Authorization
  - Removes the card (returns 204)

## Quick curl examples

Obtain token:
```bash
curl -s -X POST http://localhost:3000/getToken \
  -H "Content-Type: application/json" \
  -d '{"username":"user1","password":"pass1"}' | jq
```

Use token to get cards:
```bash
TOKEN="...replace-with-token..."
curl -H "Authorization: Bearer $TOKEN" http://localhost:3000/cards
```

Update a card (example):
```bash
curl -X PUT http://localhost:3000/cards/2 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Updated Title","id":3}'
```
If id 3 already exists the server returns 400 ("id must be unique").

## Error handling
- Invalid or missing token → 401
- Card not found → 404
- Invalid id or id conflict on update → 400
- Server errors → 500

## Notes
- Default JWT secret is `your_jwt_secret` — change in production using the JWT_SECRET env var.
- This project uses synchronous file reads/writes for simplicity; consider moving to an async DB or file operations for production.

# cardAPI — Docker usage

Build the image (from repo root):
```bash
cd /Users/clara/Code/Backend/cardAPI
docker build -t cardapi:latest .
```

Or build directly with the path:
```bash
docker build -t cardapi:latest /Users/clara/Code/Backend/cardAPI
```

Run the container (detached, publish exposed ports automatically, name the container):
```bash
docker run -d -P --name cardapi cardapi:latest
```

Find the host port mapped to container port 3000:
```bash
docker port cardapi 3000
# example output: 0.0.0.0:32768
```

Open the site in your browser using the mapped host port (example):
```
http://localhost:32768/
```
For API endpoints, e.g.:
```
http://localhost:32768/getToken
```

Helpful commands:
```bash
# follow logs
docker logs -f cardapi

# stop and remove
docker stop cardapi