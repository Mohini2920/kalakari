# Kalakari API

The backend for [Kalakari](https://kalakarii.netlify.app), a storytelling site about five Indian handicrafts. Built with **Node.js, Express and PostgreSQL**; locally it uses Node's built-in SQLite, so there's nothing extra to install.

It replaces three things the static site used to fake:
- **Example pieces** come from the database instead of being hard-coded in `script.js`.
- **Enquiries** are saved through an API instead of a `mailto:` link, so no email address appears in the page source.
- **Newsletter signups** are stored instead of only showing a "thanks" message.

## Endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products?craft=toda` | List example pieces, optionally for one craft |
| POST | `/api/enquiries` | Save an enquiry about one or more pieces |
| POST | `/api/subscribe` | Join the newsletter (duplicates are ignored) |
| GET | `/api/admin/enquiries?status=new` | List enquiries *(admin)* |
| PATCH | `/api/admin/enquiries/:id` | Mark an enquiry `new` or `replied` *(admin)* |
| GET | `/api/admin/subscribers` | List subscribers *(admin)* |

Admin endpoints need the header `X-Admin-Key: <your ADMIN_KEY>`.

## How it protects itself
- Input validation with Zod (valid email, length limits, 1–20 items, quantity 1–20)
- Unknown product ids are rejected; an enquiry and its items are saved in one transaction
- Rate limit of 5 requests per minute per IP on the public forms
- A hidden "honeypot" field that catches simple spam bots
- CORS limited to the Kalakari site; admin key compared in constant time
- The newsletter gives the same reply for new and existing emails, so nobody can check who has signed up
- Optional email notification for new enquiries, sent after replying so a mail failure never loses an enquiry

## Data model
`products` · `enquiries` · `enquiry_items` (links an enquiry to products, with quantity) · `subscribers`

Every product has a `status`. All pieces are `example` until sourced from a named maker.

The same SQL runs on SQLite locally and PostgreSQL in production; `src/db.js` picks one based on `DATABASE_URL`.

## Run it locally

Needs Node.js 22.13 or newer.

```bash
npm install
cp .env.example .env      # then change ADMIN_KEY
npm test                  # 10 tests
npm run dev               # starts on http://127.0.0.1:8000 and restarts on file changes
```

Check it in a browser: http://127.0.0.1:8000/api/products

See saved enquiries (use your ADMIN_KEY):
```bash
curl -H "X-Admin-Key: change-me" http://127.0.0.1:8000/api/admin/enquiries
```

## Deploy (free)

1. **Database:** create a free Postgres database on [Neon](https://neon.tech) and copy its connection string.
2. **API:** on [Render](https://render.com), choose **New → Blueprint**, pick this repo, and paste the Neon string as `DATABASE_URL`. Render reads `render.yaml` and generates an `ADMIN_KEY` for you (find it under the service's **Environment** tab).
3. **Site:** put the Render URL (e.g. `https://kalakari-api.onrender.com`) into `API_PROD` at the top of the site's `script.js`, then push the site.

Render's free plan sleeps after about 15 minutes idle, so the first request afterwards can take up to a minute. The site shows a "server may be waking up" message if that happens.
