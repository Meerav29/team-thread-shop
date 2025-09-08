/* eslint-env node */

import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();
app.use(express.json());

const db = new sqlite3.Database('orders.db');

function run(sql: string, params: unknown[] = []): Promise<{ lastID: number; changes: number } | void> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ lastID: this.lastID, changes: this.changes });
    });
  });
}

function get<T = unknown>(sql: string, params: unknown[] = []): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row as T | undefined);
    });
  });
}

function all<T = unknown>(sql: string, params: unknown[] = []): Promise<T[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows as T[]);
    });
  });
}

async function init() {
  await run(
    `CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item TEXT NOT NULL,
      quantity INTEGER NOT NULL
    )`
  );
}

init();

app.get('/orders', async (_req, res) => {
  const orders = await all('SELECT * FROM orders');
  res.json(orders);
});

app.post('/orders', async (req, res) => {
  const { item, quantity } = req.body as { item?: string; quantity?: number };
  if (typeof item !== 'string' || typeof quantity !== 'number') {
    res.status(400).json({ error: 'Invalid order' });
    return;
  }
  const result = (await run('INSERT INTO orders (item, quantity) VALUES (?, ?)', [item, quantity])) as {
    lastID: number;
  };
  const order = await get('SELECT * FROM orders WHERE id = ?', [result.lastID]);
  res.status(201).json(order);
});

app.patch('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { item, quantity } = req.body as { item?: string; quantity?: number };
  const existing = await get('SELECT * FROM orders WHERE id = ?', [id]);
  if (!existing) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  await run(
    'UPDATE orders SET item = COALESCE(?, item), quantity = COALESCE(?, quantity) WHERE id = ?',
    [item, quantity, id]
  );
  const order = await get('SELECT * FROM orders WHERE id = ?', [id]);
  res.json(order);
});

app.delete('/orders/:id', async (req, res) => {
  const { id } = req.params;
  const result = (await run('DELETE FROM orders WHERE id = ?', [id])) as { changes: number };
  if (result.changes === 0) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

