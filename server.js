import http from 'http';
import { randomBytes } from 'crypto';

const PORT = process.env.PORT || 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin';

const sessions = new Map();

function parseCookies(req) {
  const header = req.headers.cookie || '';
  const cookies = {};
  header.split(';').forEach(part => {
    const [k, v] = part.trim().split('=');
    if (k) cookies[k] = decodeURIComponent(v);
  });
  return cookies;
}

function sendJSON(res, status, obj, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Set-Cookie'] = cookie;
  res.writeHead(status, headers);
  res.end(JSON.stringify(obj));
}

const server = http.createServer((req, res) => {
  // handle CORS
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  if (req.method === 'POST' && req.url === '/auth/login') {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      try {
        const { password } = JSON.parse(body || '{}');
        if (password === ADMIN_PASSWORD) {
          const token = randomBytes(16).toString('hex');
          sessions.set(token, true);
          sendJSON(res, 200, { ok: true }, `token=${token}; HttpOnly; Path=/`);
        } else {
          sendJSON(res, 401, { ok: false });
        }
      } catch {
        sendJSON(res, 400, { ok: false });
      }
    });
    return;
  }

  if (req.method === 'POST' && req.url === '/auth/logout') {
    const cookies = parseCookies(req);
    if (cookies.token) sessions.delete(cookies.token);
    sendJSON(res, 200, { ok: true }, 'token=; Max-Age=0; HttpOnly; Path=/');
    return;
  }

  if (req.method === 'GET' && req.url === '/auth/check') {
    const cookies = parseCookies(req);
    const authenticated = !!(cookies.token && sessions.has(cookies.token));
    sendJSON(res, 200, { authenticated });
    return;
  }

  if (req.url.startsWith('/admin')) {
    const cookies = parseCookies(req);
    if (!cookies.token || !sessions.has(cookies.token)) {
      sendJSON(res, 401, { error: 'Unauthorized' });
      return;
    }
    if (req.method === 'GET' && req.url === '/admin/orders') {
      sendJSON(res, 200, { orders: [] });
      return;
    }
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, () => {
  console.log(`Auth server running on port ${PORT}`);
});

