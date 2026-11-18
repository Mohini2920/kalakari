import { createApp } from './app.js';
import { openDb } from './db.js';
import { seedProducts } from './seed.js';

const db = await openDb();
await seedProducts(db); // adds the 15 example pieces on first run

const port = Number(process.env.PORT || 8000);
createApp(db).listen(port, () => {
  const where = process.env.DATABASE_URL ? 'PostgreSQL' : 'SQLite (kalakari.db)';
  console.log(`Kalakari API running on http://127.0.0.1:${port}  ·  database: ${where}`);
});
