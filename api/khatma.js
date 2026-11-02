// الختمة الجماعية — ختمة واحدة مستمرة، مقسّمة لـ ٦٠ حزب (كل جزء = حزبين)
// بتشتغل على Vercel، وبتحفظ البيانات في Upstash Redis.
// كل المفاتيح بتبدأ بـ jm: عشان لو قاعدة البيانات مشتركة مع موقع تاني، مفيش حاجة تدخل في التانية.

const crypto = require('crypto');

const URL_ = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

const PARTS_KEY = 'jm:parts';   // حالة كل حزب في الختمة الحالية (h1..h60)
const COUNT_KEY = 'jm:count';   // عدد الختمات اللي خلصت
const LOG_KEY = 'jm:log';       // آخر الأحداث
const PARTS = 60;
const HOLD_MS = 3 * 24 * 3600 * 1000; // الحجز بيفضل ٣ أيام، ولو مخلصش بيرجع متاح لغيره
const RATE_MAX = 40;                  // أقصى عدد تعديلات من نفس الجهاز
const RATE_WINDOW = 600;              // خلال ١٠ دقايق

async function redis(commands) {
  const r = await fetch(`${URL_}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  const out = await r.json();
  return out.map((x) => {
    if (x.error) throw new Error(x.error);
    return x.result;
  });
}

const expired = (p, now) => p && p.s === 1 && now - (p.at || 0) > HOLD_MS;

function parseHash(arr, now) {
  const parts = Array.from({ length: PARTS }, () => ({ s: 0 }));
  for (let i = 0; i < (arr || []).length; i += 2) {
    const n = parseInt(String(arr[i]).replace('h', ''), 10);
    if (n >= 1 && n <= PARTS) {
      try {
        const v = JSON.parse(arr[i + 1]);
        parts[n - 1] = expired(v, now) ? { s: 0 } : v;
      } catch { /* تجاهل */ }
    }
  }
  return parts;
}

// اللي بيرجع للناس: من غير رقم الجهاز نفسه، بس علامة مختصرة منه
const pub = (p) => (p && p.s ? { s: p.s, name: p.name, niyya: p.niyya || '', at: p.at, t: p.t || '' } : { s: 0 });

async function readState() {
  const now = Date.now();
  const [h, c, log] = await redis([['HGETALL', PARTS_KEY], ['GET', COUNT_KEY], ['LRANGE', LOG_KEY, 0, 11]]);
  return {
    ok: true,
    count: parseInt(c || '0', 10),
    parts: parseHash(h, now).map(pub),
    hold: HOLD_MS,
    log: (log || []).map((x) => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean),
  };
}

function clean(v, max) {
  return String(v || '')
    .replace(/[\u0000-\u001F\u007F<>]/g, '')
    .replace(/(https?:\/\/|www\.)\S*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') { try { return JSON.parse(req.body); } catch { return {}; } }
  return await new Promise((resolve) => {
    let d = '';
    req.on('data', (c) => { d += c; if (d.length > 4000) req.destroy(); });
    req.on('end', () => { try { resolve(JSON.parse(d || '{}')); } catch { resolve({}); } });
    req.on('error', () => resolve({}));
  });
}

const send = (res, code, obj) => { res.statusCode = code; return res.end(JSON.stringify(obj)); };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!URL_ || !TOKEN) return send(res, 503, { ok: false, error: 'not_configured' });

  try {
    if (req.method === 'GET') return res.end(JSON.stringify(await readState()));
    if (req.method !== 'POST') return send(res, 405, { ok: false, error: 'method' });

    // حماية من العبث: حد أقصى للتعديلات من نفس الجهاز
    const ip = String((req.headers || {})['x-real-ip'] || (req.headers || {})['x-forwarded-for'] || 'x').split(',')[0].trim().slice(0, 64);
    const rk = `jm:rl:${ip}`;
    const [hits] = await redis([['INCR', rk]]);
    if (hits === 1) await redis([['EXPIRE', rk, RATE_WINDOW]]);
    if (hits > RATE_MAX) return send(res, 429, { ok: false, error: 'rate' });

    const body = await readBody(req);
    const action = body.action;
    const name = clean(body.name, 30);
    const niyya = clean(body.niyya, 60);
    const id = String(body.id || '');
    // الأحزاب المطلوبة: حزب واحد، أو حزبين جزء واحد (١و٢، ٣و٤ ...)
    const list = [...new Set((Array.isArray(body.parts) ? body.parts : []).map((x) => parseInt(x, 10)))].sort((a, b) => a - b);
    const okList = list.length === 1 ? list[0] >= 1 && list[0] <= PARTS
      : list.length === 2 && list[0] % 2 === 1 && list[1] === list[0] + 1 && list[1] <= PARTS;
    if (!['reserve', 'done', 'release'].includes(action) || !okList || !/^[a-z0-9]{16,40}$/.test(id)) {
      return send(res, 400, { ok: false, error: 'bad_request' });
    }
    if ((action === 'reserve' || action === 'done') && !name) return send(res, 400, { ok: false, error: 'name_required' });

    const t = crypto.createHash('sha256').update(id).digest('hex').slice(0, 12);
    const now = Date.now();
    const fields = list.map((n) => `h${n}`);
    const curRaw = await redis(fields.map((f) => ['HGET', PARTS_KEY, f]));
    const cur = curRaw.map((x) => { try { const v = x ? JSON.parse(x) : null; return expired(v, now) ? null : v; } catch { return null; } });
    const mine = (v) => v && v.s === 1 && v.t === t;

    if (action === 'release') {
      // الحجز يلغيه صاحبه بس، والحزب اللي خلص ما يتلغيش
      if (cur.some((v) => v && (v.s === 2 || (v.s === 1 && !mine(v))))) return send(res, 403, { ok: false, error: 'not_yours' });
      await redis([['HDEL', PARTS_KEY, ...fields]]);
      return res.end(JSON.stringify(await readState()));
    }

    // الحزب اللي خلص ما يتغيّرش، والمحجوز لحد تاني ما يتحجزش ولا يتعلّم عليه
    if (action === 'reserve' && cur.some((v) => v && v.s === 2)) return send(res, 409, { ok: false, error: 'done_already' });
    if (cur.some((v) => v && v.s === 1 && !mine(v))) return send(res, 409, { ok: false, error: 'taken' });

    const cmds = [];
    list.forEach((n, i) => {
      if (cur[i] && cur[i].s === 2) return; // خلص قبل كده
      const keepNiyya = niyya || (cur[i] && cur[i].niyya) || '';
      cmds.push(['HSET', PARTS_KEY, `h${n}`, JSON.stringify({ s: action === 'done' ? 2 : 1, name, niyya: keepNiyya, at: now, t })]);
    });
    const event = { a: action, p: list, name, at: now };
    if (niyya) event.niyya = niyya;
    cmds.push(['LPUSH', LOG_KEY, JSON.stringify(event)], ['LTRIM', LOG_KEY, 0, 29], ['HGETALL', PARTS_KEY]);
    const out = await redis(cmds);
    const parts = parseHash(out[out.length - 1], now);

    // لو الـ٦٠ حزب خلصوا: الختمة تمّت، نعدّها ونبدأ ختمة جديدة
    let completed = false;
    if (action === 'done' && parts.every((p) => p && p.s === 2)) {
      const del = await redis([['DEL', PARTS_KEY]]);
      if (del[0] === 1) {
        completed = true;
        await redis([
          ['INCR', COUNT_KEY],
          ['LPUSH', LOG_KEY, JSON.stringify({ a: 'khatma', at: now, name })],
          ['LTRIM', LOG_KEY, 0, 29],
        ]);
      }
    }
    const state = await readState();
    state.completed = completed;
    return res.end(JSON.stringify(state));
  } catch (e) {
    return send(res, 500, { ok: false, error: 'server' });
  }
};
