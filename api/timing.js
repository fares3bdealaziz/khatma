// توقيت كل آية جوه تسجيل السورة الكاملة (من MP3Quran.net)
// الموقع بيجيبه من هنا، عشان الموبايل ما يتعاملش مع الموقع التاني مباشرة.
// النتيجة بتتحفظ عند فيرسل سنة كاملة، فالطلب بيروح لـ MP3Quran مرة واحدة بس لكل سورة.

const ALLOWED = new Set([123, 133, 92]); // العفاسي، المعيقلي (مجوَّد)، الدوسري

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  let read, surah;
  try {
    const q = req.query || Object.fromEntries(new URL(req.url, 'http://x').searchParams);
    read = parseInt(q.read, 10);
    surah = parseInt(q.surah, 10);
  } catch { /* تجاهل */ }
  if (!ALLOWED.has(read) || !(surah >= 1 && surah <= 114)) {
    res.statusCode = 400;
    return res.end(JSON.stringify({ ok: false, error: 'bad_request' }));
  }
  try {
    const r = await fetch(`https://mp3quran.net/api/v3/ayat_timing?surah=${surah}&read=${read}`, { headers: { Accept: 'application/json' } });
    if (!r.ok) throw new Error(`upstream ${r.status}`);
    const j = await r.json();
    const rows = Array.isArray(j) ? j : Array.isArray(j && j.data) ? j.data : [];
    const out = rows
      .map((x) => [parseInt(x.ayah, 10), Math.round(Number(x.start_time)), Math.round(Number(x.end_time))])
      .filter(([a, s, e]) => a > 0 && Number.isFinite(s) && Number.isFinite(e) && e >= s);
    if (!out.length) throw new Error('empty');
    res.setHeader('Cache-Control', 'public, max-age=604800, s-maxage=31536000, stale-while-revalidate=86400');
    return res.end(JSON.stringify(out));
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Cache-Control', 'no-store');
    return res.end(JSON.stringify({ ok: false, error: 'upstream' }));
  }
};
