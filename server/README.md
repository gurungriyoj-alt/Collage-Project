# CoursePath API

Express + MongoDB backend for the CoursePath frontend.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — point at a local MongoDB (`mongodb://127.0.0.1:27017/coursepath`) or a MongoDB Atlas connection string.
- `JWT_SECRET` — generate one with:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ```
- `CLIENT_URL` — should match wherever `npm run dev` serves your Vite frontend (default `http://localhost:5173`).

## Run

```bash
npm run dev      # starts on http://localhost:5000 with auto-restart
npm run seed     # loads the roadmap data into MongoDB
```

Check it's alive:
```bash
curl http://localhost:5000/api/health
```

## Connecting the frontend

In the frontend's `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

This matches `src/api/axios.js`'s default baseURL, so no code changes are needed there.

## Endpoints

| Method | Route                              | Auth        | Description                        |
|--------|-------------------------------------|-------------|-------------------------------------|
| POST   | `/api/auth/register`               | —           | Create account, returns `{token, user}` |
| POST   | `/api/auth/login`                  | —           | Log in, returns `{token, user}`    |
| GET    | `/api/auth/me`                     | user        | Get current user from token        |
| GET    | `/api/roadmaps`                    | —           | List roadmaps (`?category=`, `?search=`) |
| GET    | `/api/roadmaps/:slug`              | —           | One roadmap by slug                |
| POST   | `/api/roadmaps`                    | admin       | Create a roadmap                   |
| PUT    | `/api/roadmaps/:slug`              | admin       | Update a roadmap                   |
| DELETE | `/api/roadmaps/:slug`              | admin       | Delete a roadmap                   |
| GET    | `/api/progress/:slug`              | user        | Get your completed step IDs        |
| PUT    | `/api/progress/:slug/steps/:stepId`| user        | Toggle one step done/undone        |

## Notes on wiring this into the existing frontend

1. **`RoadmapDetail.jsx` currently imports `mockRoadmaps` and uses array
   index (`i`) as the step identifier.** Once you switch it to fetch from
   `GET /api/roadmaps/:slug`, each step will have a real Mongo `_id`
   instead — swap `toggleStep(i)` to use `step._id`, and call
   `PUT /api/progress/:slug/steps/:stepId` instead of local `useState`.
2. **To make a user an admin** (for creating/editing roadmaps), there's no
   signup flag for this on purpose — flip it directly in MongoDB:
   ```js
   db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
   ```
3. Passwords are hashed with bcrypt before saving (see `User.js`'s
   pre-save hook) — never stored in plain text.
