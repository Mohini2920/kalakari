# Kalakari: Tale of Indian Handicrafts

**Live site:** [kalakarii.netlify.app](https://kalakarii.netlify.app)

Kalakari is a storytelling website about five Indian handicrafts that are running short on people to carry them forward: **Terracotta, Toda Embroidery, Dhokra, Namda and Sanjhi**.

It is not an online store. Each craft page first explains why the craft matters and who still makes it, and only then shows ways to help. The shop is deliberately **pre-launch and enquiry-only**: the pieces shown are examples, and nothing is sold until it can be sourced from a named maker at a fair price.

> "The problem I wanted to address wasn't simply access to handicrafts. It was awareness and understanding. I wanted users to first understand the cultural value and the people behind a craft, and then decide how they want to support it."

---

## What's in this repo

```
kalakari/
├── index.html            Home: why the project exists, map, the five crafts
├── terracotta.html       ┐
├── toda.html             │
├── dhokra.html           ├ One page per craft
├── namda.html            │
├── sanjhi.html           ┘
├── support.html          Ways to help beyond buying
├── script.js             Theme toggle, enquiry list, forms, API calls
├── style.css             Styles, light and dark theme
├── images/  videos/      Product photos and artisan videos
├── render.yaml           Deploy config for the API (Render)
└── server/               Backend API (Node.js + Express)
```

## The website

Every craft page follows the same six-part story, with a sticky section nav and a reading-progress bar:

1. **Story**: where the craft comes from
2. **Cultural significance**: what it means to the people who make it
3. **How it's made**: a step-by-step process timeline
4. **Meet the artisan**: who still practises it
5. **Why it's at risk**: risks specific to that craft
6. **Preservation efforts**: GI tags, organisations and what is (and isn't) working

Then come the example pieces and the sources used for that page.

**Features**
- Responsive layout for mobile, tablet and desktop
- Light and dark theme, remembered between visits
- An enquiry list with a short form (name, email, message) instead of a checkout
- A newsletter signup in the footer
- Keyboard-friendly dialogs with focus trapping, and support for reduced motion
- Sources listed at the bottom of every craft page

## The backend (`server/`)

A small REST API that replaced the parts of the site that used to be faked:

| Before | Now |
|---|---|
| Product list hard-coded in `script.js` | Served from the database |
| Enquiry button opened a `mailto:` link, exposing an email address | Enquiries saved through the API |
| Newsletter form only showed a "thanks" message | Signups stored, duplicates ignored |

**Stack:** Node.js, Express, PostgreSQL in deployment, SQLite (built into Node) for local development, Zod, express-rate-limit, Nodemailer.

### Endpoints

| Method | Path | What it does |
|---|---|---|
| GET | `/api/health` | Health check |
| GET | `/api/products?craft=toda` | List example pieces, optionally for one craft |
| POST | `/api/enquiries` | Save an enquiry about one or more pieces |
| POST | `/api/subscribe` | Join the newsletter |
| GET | `/api/admin/enquiries` | List enquiries *(admin key required)* |
| PATCH | `/api/admin/enquiries/:id` | Mark an enquiry `new` or `replied` *(admin)* |
| GET | `/api/admin/subscribers` | List subscribers *(admin)* |

### Design choices
- **One SQL layer, two databases.** Queries are written once; `server/src/db.js` runs them on SQLite locally and PostgreSQL in deployment, depending on `DATABASE_URL`.
- **Validation** with Zod: valid emails, length limits, 1–20 pieces per enquiry.
- **Spam protection**: 5 requests per minute per IP on public forms, plus a hidden honeypot field.
- **Transactions**: an enquiry and its items are saved together or not at all.
- **Privacy**: the newsletter gives the same reply for new and existing emails, so nobody can check who has signed up.
- **Admin routes** are protected by a secret key compared in constant time.
- **Product status**: every piece is `example` until it is sourced from a named maker.
- **Graceful fallback**: if the API is asleep or unreachable, the site still shows the pieces from a built-in list.

### Tests
10 automated tests using Node's built-in test runner, covering validation, the honeypot, rate limiting, admin access, status updates and duplicate signups.

## Run it locally

You need **Node.js 22.13 or newer**. No database install is needed.

**1. Start the API**
```bash
cd server
npm install
cp .env.example .env      # then set your own ADMIN_KEY
npm test                  # 10 tests
npm run dev               # http://127.0.0.1:8000
```

**2. Serve the site** in a second terminal, from the repo root:
```bash
npx http-server -p 5500 -c-1 -a 127.0.0.1
```
Open **http://localhost:5500**, add a piece to the enquiry list and send it. Then check it was saved:
```bash
curl -H "X-Admin-Key: <your ADMIN_KEY>" http://127.0.0.1:8000/api/admin/enquiries
```

## Deploy

- **Site:** Netlify serves the repo root as a static site.
- **Database:** a free PostgreSQL database on [Neon](https://neon.tech).
- **API:** on [Render](https://render.com), choose **New → Blueprint** and select this repo. `render.yaml` points Render at `server/`. Paste the Neon connection string as `DATABASE_URL`; an `ADMIN_KEY` is generated for you.
- Then set `API_PROD` at the top of `script.js` to the Render URL.

Render's free plan sleeps when idle, so the first request after a quiet spell can take up to a minute.

## Content and sources

Facts on each craft page are linked to their sources at the bottom of that page. Where a claim couldn't be verified it has been softened or removed. For example, Sanjhi is described as "widely described as endangered" rather than "government-listed". Corrections are welcome: open an issue with a source.

Kalakari has not yet sourced from any named artisan, and the "Meet the artisan" sections say so.

## Author

**Mohini Joshi**, [github.com/Mohini2920](https://github.com/Mohini2920)
