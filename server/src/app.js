import crypto from 'node:crypto';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { sendEnquiryEmail } from './notify.js';

const CRAFTS = ['terracotta', 'toda', 'dhokra', 'namda', 'sanjhi'];

// ---------- request validation ----------
const enquirySchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().max(254).pipe(z.email()),
  message: z.string().trim().max(2000).default(''),
  items: z.array(z.object({
    product_id: z.number().int().positive(),
    quantity: z.number().int().min(1).max(20).default(1),
  })).min(1).max(20),
  website: z.string().optional().default(''), // honeypot: hidden from people, bots fill it in
});
const subscribeSchema = z.object({
  email: z.string().trim().max(254).pipe(z.email()),
  website: z.string().optional().default(''),
});
const statusSchema = z.object({ status: z.enum(['new', 'replied']) });

function validate(schema, body) {
  const result = schema.safeParse(body ?? {});
  if (!result.success) {
    const err = new Error('Validation failed');
    err.status = 422;
    err.issues = result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message }));
    throw err;
  }
  return result.data;
}

const httpError = (status, detail) => Object.assign(new Error(detail), { status });

// Wraps async route handlers so thrown errors reach the error handler.
const handle = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export function createApp(db) {
  const app = express();
  app.set('trust proxy', 1); // Render sits behind a proxy; needed for per-IP rate limits
  app.use(express.json({ limit: '20kb' }));

  const origins = (process.env.ALLOWED_ORIGINS || '*').split(',').map((o) => o.trim()).filter(Boolean);
  app.use(cors({
    origin: origins.includes('*') ? '*' : origins,
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'X-Admin-Key'],
  }));

  // 5 requests per minute per IP on the public forms.
  const formLimit = rateLimit({
    windowMs: 60_000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    handler: (req, res) => res.status(429).json({ detail: 'Too many requests. Please try again in a minute.' }),
  });

  const requireAdmin = (req, res, next) => {
    const expected = process.env.ADMIN_KEY || '';
    if (!expected) return res.status(503).json({ detail: 'Admin access is not configured.' });
    const given = Buffer.from(req.get('X-Admin-Key') || '');
    const want = Buffer.from(expected);
    if (given.length !== want.length || !crypto.timingSafeEqual(given, want)) {
      return res.status(401).json({ detail: 'Invalid admin key.' });
    }
    next();
  };

  // ---------------------------- public endpoints ----------------------------
  app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

  app.get('/api/products', handle(async (req, res) => {
    const { craft } = req.query;
    if (craft && !CRAFTS.includes(craft)) throw httpError(404, 'Unknown craft.');
    const sql = 'SELECT id, craft, name, description, image, status FROM products'
      + (craft ? ' WHERE craft = $1' : '') + ' ORDER BY sort_order';
    res.json(await db.all(sql, craft ? [craft] : []));
  }));

  app.post('/api/enquiries', formLimit, handle(async (req, res) => {
    const data = validate(enquirySchema, req.body);
    const reply = { message: "Thanks, we've received your enquiry." };
    if (data.website) return res.status(201).json(reply); // honeypot: pretend it worked, save nothing

    const ids = [...new Set(data.items.map((i) => i.product_id))];
    const found = await db.all(
      `SELECT id, name FROM products WHERE id IN (${ids.map((_, i) => `$${i + 1}`).join(', ')})`, ids,
    );
    const names = new Map(found.map((p) => [Number(p.id), p.name]));
    const missing = ids.filter((id) => !names.has(id));
    if (missing.length) throw httpError(400, `Unknown product id(s): ${missing.join(', ')}`);

    // Save the enquiry and its items together: either all of it is stored, or none of it.
    const enquiryId = await db.transaction(async (tx) => {
      const row = await tx.get(
        'INSERT INTO enquiries (name, email, message, status, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [data.name, data.email, data.message, 'new', new Date().toISOString()],
      );
      for (const item of data.items) {
        await tx.get(
          'INSERT INTO enquiry_items (enquiry_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING id',
          [row.id, item.product_id, item.quantity],
        );
      }
      return row.id;
    });

    res.status(201).json(reply);
    // Send the notification after replying, so the visitor never waits on email.
    sendEnquiryEmail({
      id: enquiryId, name: data.name, email: data.email, message: data.message,
      lines: data.items.map((i) => `- ${names.get(i.product_id)} (x${i.quantity})`),
    });
  }));

  app.post('/api/subscribe', formLimit, handle(async (req, res) => {
    const data = validate(subscribeSchema, req.body);
    // Same reply whether new or already subscribed, so nobody can check who is on the list.
    if (!data.website) {
      await db.get(
        'INSERT INTO subscribers (email, created_at) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING RETURNING id',
        [data.email.toLowerCase(), new Date().toISOString()],
      );
    }
    res.status(201).json({ message: "Thanks, you're on the list." });
  }));

  // ---------------------------- admin endpoints ----------------------------
  async function loadEnquiries(where = '', params = []) {
    const rows = await db.all(`SELECT * FROM enquiries ${where} ORDER BY created_at DESC, id DESC`, params);
    if (!rows.length) return [];
    const items = await db.all(
      `SELECT ei.enquiry_id, ei.product_id, ei.quantity, p.name AS product_name
         FROM enquiry_items ei JOIN products p ON p.id = ei.product_id
        WHERE ei.enquiry_id IN (${rows.map((_, i) => `$${i + 1}`).join(', ')})
        ORDER BY ei.id`,
      rows.map((r) => r.id),
    );
    return rows.map((r) => ({
      ...r,
      items: items.filter((i) => Number(i.enquiry_id) === Number(r.id))
        .map(({ product_id, product_name, quantity }) => ({ product_id, product_name, quantity })),
    }));
  }

  app.get('/api/admin/enquiries', requireAdmin, handle(async (req, res) => {
    const { status } = req.query;
    res.json(await loadEnquiries(status ? 'WHERE status = $1' : '', status ? [status] : []));
  }));

  app.patch('/api/admin/enquiries/:id', requireAdmin, handle(async (req, res) => {
    const { status } = validate(statusSchema, req.body);
    const id = Number(req.params.id);
    const updated = await db.get('UPDATE enquiries SET status = $1 WHERE id = $2 RETURNING id', [status, id]);
    if (!updated) throw httpError(404, 'Enquiry not found.');
    res.json((await loadEnquiries('WHERE id = $1', [id]))[0]);
  }));

  app.get('/api/admin/subscribers', requireAdmin, handle(async (req, res) => {
    res.json(await db.all('SELECT email, created_at FROM subscribers ORDER BY created_at DESC'));
  }));

  // ---------------------------- errors ----------------------------
  app.use((req, res) => res.status(404).json({ detail: 'Not found.' }));
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.type === 'entity.parse.failed') return res.status(400).json({ detail: 'Invalid JSON.' });
    if (err.status === 422) return res.status(422).json({ detail: 'Please check your input.', errors: err.issues });
    if (err.status) return res.status(err.status).json({ detail: err.message });
    console.error(err);
    res.status(500).json({ detail: 'Something went wrong.' });
  });

  return app;
}
