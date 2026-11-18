// A tiny database layer that works with two databases:
//  - SQLite (built into Node) for local development and tests, when DATABASE_URL is empty
//  - PostgreSQL in production, when DATABASE_URL is set
// Queries are written once, using Postgres-style placeholders ($1, $2, ...).

const SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
  id {{ID}},
  craft TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  image TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'example',   -- 'example' until sourced from a named maker
  sort_order INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS enquiries (
  id {{ID}},
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new',       -- 'new' or 'replied'
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS enquiry_items (
  id {{ID}},
  enquiry_id INTEGER NOT NULL REFERENCES enquiries(id),
  product_id INTEGER NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1
);
CREATE TABLE IF NOT EXISTS subscribers (
  id {{ID}},
  email TEXT NOT NULL UNIQUE,
  created_at TEXT NOT NULL
);
`;

export async function openDb(url = process.env.DATABASE_URL || '') {
  if (url && url.startsWith('postgres')) return openPostgres(url);
  return openSqlite(url || 'kalakari.db');
}

async function openSqlite(file) {
  const { DatabaseSync } = await import('node:sqlite');
  const db = new DatabaseSync(file);
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(SCHEMA.replaceAll('{{ID}}', 'INTEGER PRIMARY KEY AUTOINCREMENT'));
  // SQLite understands numbered placeholders as ?1, ?2 ...
  const prep = (sql) => db.prepare(sql.replace(/\$(\d+)/g, '?$1'));
  const api = {
    async all(sql, params = []) { return prep(sql).all(...params); },
    async get(sql, params = []) { return prep(sql).get(...params); },
    async transaction(fn) {
      db.exec('BEGIN');
      try { const result = await fn(api); db.exec('COMMIT'); return result; }
      catch (err) { db.exec('ROLLBACK'); throw err; }
    },
    async close() { db.close(); },
  };
  return api;
}

async function openPostgres(url) {
  const { default: pg } = await import('pg');
  const pool = new pg.Pool({ connectionString: url, ssl: url.includes('localhost') ? false : { rejectUnauthorized: false } });
  await pool.query(SCHEMA.replaceAll('{{ID}}', 'SERIAL PRIMARY KEY'));
  const wrap = (runner) => ({
    async all(sql, params = []) { return (await runner.query(sql, params)).rows; },
    async get(sql, params = []) { return (await runner.query(sql, params)).rows[0]; },
  });
  return {
    ...wrap(pool),
    async transaction(fn) {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const result = await fn(wrap(client));
        await client.query('COMMIT');
        return result;
      } catch (err) { await client.query('ROLLBACK'); throw err; }
      finally { client.release(); }
    },
    async close() { await pool.end(); },
  };
}
