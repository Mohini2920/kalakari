import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, test } from 'node:test';
import { createApp } from '../src/app.js';
import { openDb } from '../src/db.js';
import { seedProducts } from '../src/seed.js';

process.env.ADMIN_KEY = 'test-key';
process.env.ALLOWED_ORIGINS = '*';
for (const v of ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD', 'NOTIFY_EMAIL']) delete process.env[v];

const ADMIN = { 'X-Admin-Key': 'test-key' };
let server; let base; let db;

// A fresh in-memory database and app (with fresh rate limits) for every test.
async function start() {
  db = await openDb(':memory:');
  await seedProducts(db);
  server = createApp(db).listen(0);
  await new Promise((r) => server.once('listening', r));
  base = `http://127.0.0.1:${server.address().port}`;
}
async function stop() {
  await new Promise((r) => server.close(r));
  await db.close();
}

const get = (path, headers = {}) => fetch(base + path, { headers });
const send = (method, path, body, headers = {}) => fetch(base + path, {
  method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body),
});
const enquiry = (overrides = {}) => ({
  name: 'Asha', email: 'asha@example.com', message: 'Is this available?',
  items: [{ product_id: 1, quantity: 2 }], ...overrides,
});

describe('Kalakari API', () => {
  beforeEach(start);
  afterEach(stop);

  test('health check', async () => {
    assert.deepEqual(await (await get('/api/health')).json(), { status: 'ok' });
  });

  test('products are seeded and can be filtered by craft', async () => {
    assert.equal((await (await get('/api/products')).json()).length, 15);
    const toda = await (await get('/api/products?craft=toda')).json();
    assert.equal(toda.length, 3);
    assert.ok(toda.every((p) => p.craft === 'toda' && p.status === 'example'));
  });

  test('unknown craft returns 404', async () => {
    assert.equal((await get('/api/products?craft=pottery')).status, 404);
  });

  test('an enquiry is saved and the admin can read it', async () => {
    assert.equal((await send('POST', '/api/enquiries', enquiry())).status, 201);
    const rows = await (await get('/api/admin/enquiries', ADMIN)).json();
    assert.equal(rows.length, 1);
    assert.equal(rows[0].status, 'new');
    assert.deepEqual(rows[0].items, [{ product_id: 1, product_name: 'Terracotta Horse Pair (Bankura Style)', quantity: 2 }]);
  });

  test('bad enquiries are rejected', async () => {
    assert.equal((await send('POST', '/api/enquiries', enquiry({ email: 'not-an-email' }))).status, 422);
    assert.equal((await send('POST', '/api/enquiries', enquiry({ items: [] }))).status, 422);
    assert.equal((await send('POST', '/api/enquiries', enquiry({ items: [{ product_id: 999 }] }))).status, 400);
  });

  test('the honeypot saves nothing', async () => {
    assert.equal((await send('POST', '/api/enquiries', enquiry({ website: 'spam.com' }))).status, 201);
    assert.deepEqual(await (await get('/api/admin/enquiries', ADMIN)).json(), []);
  });

  test('more than 5 enquiries a minute are rate-limited', async () => {
    const codes = [];
    for (let i = 0; i < 6; i++) codes.push((await send('POST', '/api/enquiries', enquiry())).status);
    assert.deepEqual(codes, [201, 201, 201, 201, 201, 429]);
  });

  test('admin endpoints need the right key', async () => {
    assert.equal((await get('/api/admin/enquiries')).status, 401);
    assert.equal((await get('/api/admin/enquiries', { 'X-Admin-Key': 'wrong' })).status, 401);
  });

  test('an enquiry can be marked replied', async () => {
    await send('POST', '/api/enquiries', enquiry());
    const res = await send('PATCH', '/api/admin/enquiries/1', { status: 'replied' }, ADMIN);
    assert.equal((await res.json()).status, 'replied');
    assert.equal((await send('PATCH', '/api/admin/enquiries/1', { status: 'deleted' }, ADMIN)).status, 422);
    assert.equal((await send('PATCH', '/api/admin/enquiries/99', { status: 'replied' }, ADMIN)).status, 404);
  });

  test('newsletter ignores duplicate emails', async () => {
    for (let i = 0; i < 2; i++) {
      assert.equal((await send('POST', '/api/subscribe', { email: 'Reader@Example.com' })).status, 201);
    }
    const subs = await (await get('/api/admin/subscribers', ADMIN)).json();
    assert.deepEqual(subs.map((s) => s.email), ['reader@example.com']);
  });
});
