/* القرآن الكريم + الختمة الجماعية
   النص: alquran.cloud (الرسم العثماني) — التلاوات: العفاسي، المعيقلي، الدوسري (Islamic Network) */
(() => {
  const NAMES = ['الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة', 'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس', 'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر', 'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه', 'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان', 'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم', 'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر', 'يس', 'الصافات', 'ص', 'الزمر', 'غافر', 'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية', 'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق', 'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن', 'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة', 'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق', 'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج', 'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة', 'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس', 'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج', 'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد', 'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين', 'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات', 'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل', 'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر', 'المسد', 'الإخلاص', 'الفلق', 'الناس'];
  const COUNTS = [7, 286, 200, 176, 120, 165, 206, 75, 129, 109, 123, 111, 43, 52, 99, 128, 111, 110, 98, 135, 112, 78, 118, 64, 77, 227, 93, 88, 69, 60, 34, 30, 73, 54, 45, 83, 182, 88, 75, 85, 54, 53, 89, 59, 37, 35, 38, 29, 18, 45, 60, 49, 62, 55, 78, 96, 29, 22, 24, 13, 14, 11, 11, 18, 12, 12, 30, 52, 52, 44, 28, 28, 20, 56, 40, 31, 50, 40, 46, 42, 29, 19, 36, 25, 22, 17, 19, 26, 30, 20, 15, 21, 11, 8, 8, 19, 5, 8, 8, 11, 11, 8, 3, 9, 5, 4, 7, 3, 6, 3, 5, 4, 5, 6];
  // بداية كل جزء: [السورة، الآية]
  const JUZ = [[1, 1], [2, 142], [2, 253], [3, 93], [4, 24], [4, 148], [5, 82], [6, 111], [7, 88], [8, 41], [9, 93], [11, 6], [12, 53], [15, 1], [17, 1], [18, 75], [21, 1], [23, 1], [25, 21], [27, 56], [29, 46], [33, 31], [36, 28], [39, 32], [41, 47], [46, 1], [51, 31], [58, 1], [67, 1], [78, 1]];
  const API = 'https://api.alquran.cloud/v1';
  const BASMALA = 'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ';

  const START = []; { let a = 0; COUNTS.forEach((c, i) => { START[i] = a + 1; a += c; }); }
  const surahOf = (g) => { let lo = 0, hi = 113; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (START[m] <= g) lo = m; else hi = m - 1; } return lo + 1; };

  const $ = (s, r = document) => r.querySelector(s);
  const AR = (n) => Number(n).toLocaleString('ar-EG');
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ls = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const UI = () => window.AthkarUI || {};
  const toast = (m) => { try { UI().toast(m); } catch {} };
  const celebrate = () => { try { UI().celebrate(); } catch {} };
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const juzLabel = (n) => { const [s, a] = JUZ[n - 1]; return `من سورة ${NAMES[s - 1]}${a > 1 ? ` آية ${AR(a)}` : ''}`; };
  const timesTxt = (n) => n === 1 ? 'ختمة واحدة' : n === 2 ? 'ختمتين' : n <= 10 ? `${AR(n)} ختمات` : `${AR(n)} ختمة`;

  const ICON = {
    play: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5.5v13l11-6.5z"/></svg>',
    pause: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4.2" height="14" rx="1.2"/><rect x="13.8" y="5" width="4.2" height="14" rx="1.2"/></svg>',
    mark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><path d="M6 3.5h12v17l-6-4-6 4z"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    go: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round" aria-hidden="true"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h4.5v-5.5h3V20H18V10"/></svg>',
  };
  const BOOK_ART = `<svg class="art" viewBox="0 0 112 112" aria-hidden="true">
    <g class="book-light"><path d="M56 62 32 12h48z" fill="rgba(255,236,190,.16)"/></g>
    <circle cx="56" cy="30" r="3" fill="#FFE3A3" class="rise-light" style="filter:drop-shadow(0 0 6px #FFD27A)"/>
    <path d="M56 92V60" stroke="#E8C477" stroke-width="1.6"/>
    <path d="M56 60c-7-6-18-8-32-6v36c14-2 25 0 32 6" fill="rgba(232,196,119,.12)" stroke="#E8C477" stroke-width="1.7" stroke-linejoin="round"/>
    <path d="M56 60c7-6 18-8 32-6v36c-14-2-25 0-32 6" fill="rgba(232,196,119,.12)" stroke="#E8C477" stroke-width="1.7" stroke-linejoin="round"/>
    <path d="M31 64c6-.6 12 0 17 2M31 72c6-.6 12 0 17 2M31 80c6-.6 12 0 17 2M64 66c5-2 11-2.6 17-2M64 74c5-2 11-2.6 17-2M64 82c5-2 11-2.6 17-2" stroke="#E8C477" stroke-width="1" opacity=".5" fill="none"/>
    <path d="M44 100h24" stroke="#E8C477" stroke-width="1.4" stroke-linecap="round" opacity=".5"/></svg>`;

  /* ---------- الأحزاب: بداية كل حزب [السورة، الآية] (مصحف المدينة) ---------- */
  const HIZB = [[1, 1], [2, 75], [2, 142], [2, 203], [2, 253], [3, 15], [3, 93], [3, 171], [4, 24], [4, 88], [4, 148], [5, 27], [5, 82], [6, 36], [6, 111], [7, 1], [7, 88], [7, 171], [8, 41], [9, 34], [9, 93], [10, 26], [11, 6], [11, 84], [12, 53], [13, 5], [15, 1], [16, 51], [17, 1], [17, 99], [18, 75], [20, 1], [21, 1], [22, 1], [23, 1], [24, 21], [25, 21], [26, 111], [27, 56], [28, 51], [29, 46], [31, 22], [33, 31], [34, 24], [36, 28], [37, 145], [39, 32], [40, 41], [41, 47], [43, 24], [46, 1], [48, 18], [51, 31], [55, 1], [58, 1], [62, 1], [67, 1], [72, 1], [78, 1], [90, 1]];
  const hizbOf = (s, k) => { let h = 1; for (let i = 0; i < 60; i++) { const [hs, hk] = HIZB[i]; if (s > hs || (s === hs && k >= hk)) h = i + 1; else break; } return h; };
  const hizbLabel = (n) => { const [s, a] = HIZB[n - 1]; return `من سورة ${NAMES[s - 1]}${a > 1 ? ` آية ${AR(a)}` : ''}`; };
  const partName = (list) => list.length === 2 ? `الجزء ${AR(list[1] / 2)}` : `الحزب ${AR(list[0])}`;

  /* ---------- الختمة الجماعية (ختمة واحدة مستمرة للكل) ---------- */
  const grp = { state: null, err: null, loaded: false };
  const myName = () => ls.get('quran:name', '');
  const myNiyya = () => ls.get('jm:niyya', '');
  const myTag = () => ls.get('jm:tag', '');
  const devId = () => {
    let id = ls.get('jm:id', '');
    if (!/^[a-z0-9]{16,40}$/.test(id)) {
      const b = new Uint8Array(12); try { crypto.getRandomValues(b); } catch { for (let i = 0; i < 12; i++) b[i] = Math.random() * 256 | 0; }
      id = Array.from(b, (x) => x.toString(36).padStart(2, '0')).join('').slice(0, 24).replace(/[^a-z0-9]/g, 'a');
      ls.set('jm:id', id);
    }
    return id;
  };
  const isMine = (p) => !!(p && p.s === 1 && p.t && p.t === myTag());
  const grpLoad = async () => {
    try {
      const r = await fetch('/api/khatma', { cache: 'no-store' });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) grp.err = j.error === 'not_configured' ? 'nc' : 'net';
      else { grp.state = j; grp.err = null; }
    } catch { grp.err = 'net'; }
    grp.loaded = true;
    if (view && view.type === 'khatma') paintKhatma();
    if (view && view.type === 'read' && view.ctx === 'khatma-grp' && $('#qAfter') && ayahs.length) paintAfter();
    try { (UI().khatmaChanged || (() => {}))(); } catch {}
  };
  const grpPost = async (action, parts) => {
    try {
      const r = await fetch('/api/khatma', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action, parts, name: myName(), niyya: action === 'release' ? '' : myNiyya(), id: devId() }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok || !j.ok) {
        const msg = { not_configured: 'الختمة لسه ما اتفعّلتش على الموقع', rate: 'عملت تعديلات كتير ورا بعض، استنى شوية وجرّب تاني', taken: 'في حد حاجز الجزء ده، اختار حتة تانية', done_already: 'الحتة دي خلصت قراءتها، اختار حتة تانية', not_yours: 'الحجز ده مش من الموبايل ده، صاحبه بس اللي يقدر يلغيه' }[j.error] || 'في مشكلة في الاتصال، جرّب تاني';
        toast(msg); grpLoad(); return null;
      }
      if (action === 'reserve' || action === 'done') {
        const p = j.parts && j.parts[parts[0] - 1];
        if (p && p.t) ls.set('jm:tag', p.t);
      }
      grp.state = j; grp.err = null;
      if (j.completed) khatmaDone();
      try { (UI().khatmaChanged || (() => {}))(); } catch {}
      return j;
    } catch { toast('الختمة محتاجة إنترنت، اتأكد إنك متصل'); return null; }
  };

  /* ---------- نافذة سفلية ---------- */
  let sheetEl;
  const sheet = (html, bind) => {
    if (!sheetEl) {
      sheetEl = document.createElement('div');
      sheetEl.className = 'sheet q-sheet'; sheetEl.setAttribute('role', 'dialog'); sheetEl.setAttribute('aria-modal', 'true');
      sheetEl.innerHTML = '<div class="sheet-card"></div>';
      sheetEl.addEventListener('click', (e) => { if (e.target === sheetEl) closeSheet(); });
      document.body.appendChild(sheetEl);
    }
    sheetEl.firstElementChild.innerHTML = html;
    sheetEl.classList.add('show');
    if (bind) bind(sheetEl.firstElementChild);
  };
  const closeSheet = () => { if (sheetEl) sheetEl.classList.remove('show'); };

  // الاسم والنية: الاسم لازم، والنية اختيارية
  const askInfo = (then, opts = {}) => {
    sheet(`<h3>${opts.title || 'اسمك ونيتك'}</h3><p class="sub">الاسم بيظهر للناس على الحتة اللي حجزتها</p>
      <label class="q-lbl" for="qNameIn">اسمك</label>
      <input id="qNameIn" maxlength="30" placeholder="مثلًا: أحمد" value="${esc(myName())}" autocomplete="nickname">
      <label class="q-lbl" for="qNiyyaIn">نيتك <small>(اختياري)</small></label>
      <input id="qNiyyaIn" maxlength="60" placeholder="مثلًا: على روح والدي — لشفاء أمي" value="${esc(myNiyya())}">
      <p class="q-note" style="margin:6px 0 0">النية بتظهر للناس في «نوايا الختمة» عشان يدعوا لها.</p>
      <div class="row"><button class="btn ok" type="button" id="qNameOk">${opts.ok || 'تمام'}</button></div>`, (c) => {
      const inp = $('#qNameIn', c), niy = $('#qNiyyaIn', c);
      setTimeout(() => (inp.value ? niy : inp).focus(), 50);
      const ok = () => {
        const v = inp.value.replace(/\s+/g, ' ').trim().slice(0, 30); if (!v) return inp.focus();
        ls.set('quran:name', v); ls.set('jm:niyya', niy.value.replace(/\s+/g, ' ').trim().slice(0, 60));
        closeSheet(); if (then) then(); else paintKhatma();
      };
      $('#qNameOk', c).onclick = ok;
      inp.onkeydown = (e) => { if (e.key === 'Enter') niy.focus(); };
      niy.onkeydown = (e) => { if (e.key === 'Enter') ok(); };
    });
  };

  const khatmaDone = () => {
    celebrate();
    const c = grp.state ? grp.state.count : 1;
    sheet(`<h3>تمّت الختمة، الحمد لله</h3>
      <p class="sub">دي الختمة رقم ${AR(c)} على الموقع، وبدأت ختمة جديدة</p>
      <p class="dua">اللَّهُمَّ تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ،<br>وَاجْعَلِ الْقُرْآنَ رَبِيعَ قُلُوبِنَا وَنُورَ صُدُورِنَا،<br>وَحَقِّقْ لِكُلِّ مَنْ قَرَأَ نِيَّتَهُ</p>
      <div class="row"><button class="btn ok" type="button" id="qDoneOk">آمين</button></div>`, (c2) => { $('#qDoneOk', c2).onclick = () => { closeSheet(); if (view && view.type === 'khatma') renderKhatma(); }; });
  };

  /* ---------- الصفحة الرئيسية للقرآن ---------- */
  let view = null;
  const root = () => $('#quranBody');

  const renderHub = () => {
    view = { type: 'hub' };
    if ($('#qPage')) $('#qPage').hidden = true;
    $('#qTitle').textContent = 'القرآن الكريم';
    const last = ls.get('quran:last', null);
    const w = root(); w.className = 'wrap hubwrap';
    w.innerHTML = `
      <header class="q-hero">${BOOK_ART}<h2>القرآن الكريم</h2><p>اقرأ واسمع بصوت القارئ اللي تحبه</p>${reciterPicker()}<p class="q-recnote" id="qRecNote"></p><p class="q-offline" id="qOffline"></p></header>
      ${last ? `<a class="q-continue" href="#/quran/${last.t}/${last.n}/${last.g}"><span><span class="k">كمّل من حيث وقفت</span><span class="v">سورة ${NAMES[last.s - 1]} — آية ${AR(last.k)}${last.page ? ` — صفحة ${AR(last.page)}` : ''}</span></span>${ICON.go}</a>` : ''}
      <section class="q-card q-pages">
        <h3 class="q-sec-t" style="margin-top:0">اقرأ صفحة صفحة</h3>
        <p class="q-note" style="margin-top:0">زي المصحف بالظبط: ٦٠٤ صفحة، وكل صفحة برقمها.</p>
        <form class="q-goto" id="qGoto">
          <input type="text" inputmode="numeric" maxlength="3" autocomplete="off" id="qGotoIn" placeholder="رقم الصفحة (١ – ٦٠٤)" aria-label="رقم الصفحة">
          <button class="btn ok" type="submit">افتح الصفحة</button>
        </form>
        <a class="btn" href="#/quran/p/1" style="width:100%;margin-top:10px">ابدأ من أول المصحف</a>
      </section>
      <section class="q-card q-parts">
        <h3 class="q-sec-t" style="margin-top:0">الأجزاء</h3>
        <div class="juz-grid">${Array.from({ length: 30 }, (_, i) => `<a class="juz" href="#/quran/j/${i + 1}"><span class="n">${AR(i + 1)}</span></a>`).join('')}</div>
      </section>
      <section class="q-index">
        <h3 class="q-sec-t">فهرس السور</h3>
        <input class="q-search" id="qSearch" type="search" placeholder="دوّر على سورة…" aria-label="دوّر على سورة">
        <ul class="sura-list" id="qSuras"></ul>
      </section>`;
    paintRecNote();
    paintOffline();
    $('#qGoto').onsubmit = (e) => {
      e.preventDefault();
      const raw = String($('#qGotoIn').value).replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d));
      const v = parseInt(raw, 10);
      if (!(v >= 1 && v <= 604)) { toast('اكتب رقم صفحة من ١ لـ ٦٠٤'); return; }
      location.hash = `#/quran/p/${v}`;
    };
    paintSuras('');
    $('#qSearch').addEventListener('input', (e) => paintSuras(e.target.value));
  };

  /* ---------- صفحة الختمة الجماعية ---------- */
  const KHATMA_ART = `<svg class="art" viewBox="0 0 112 112" aria-hidden="true">
    <circle cx="56" cy="56" r="40" fill="none" stroke="rgba(232,196,119,.18)" stroke-width="5"/>
    <circle cx="56" cy="56" r="40" fill="none" stroke="#E8C477" stroke-width="5" stroke-linecap="round" stroke-dasharray="251" stroke-dashoffset="80" transform="rotate(-90 56 56)" style="filter:drop-shadow(0 0 6px rgba(232,196,119,.7))"/>
    <path d="M56 72V48" stroke="#E8C477" stroke-width="1.4"/>
    <path d="M56 48c-4-3.5-10-4.5-17-3.5v21c7-1 13 0 17 3.5" fill="rgba(232,196,119,.14)" stroke="#E8C477" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M56 48c4-3.5 10-4.5 17-3.5v21c-7-1-13 0-17 3.5" fill="rgba(232,196,119,.14)" stroke="#E8C477" stroke-width="1.5" stroke-linejoin="round"/>
    <circle cx="56" cy="34" r="2.6" fill="#FFE3A3" class="rise-light" style="filter:drop-shadow(0 0 6px #FFD27A)"/></svg>`;
  const renderKhatma = () => {
    view = { type: 'khatma' };
    if ($('#qPage')) $('#qPage').hidden = true;
    $('#qTitle').textContent = 'الختمة الجماعية';
    const w = root(); w.className = 'wrap';
    w.innerHTML = `
      <header class="q-hero">${KHATMA_ART}<h2>الختمة الجماعية</h2><p>احجز جزء أو حزب، واقرأه بنيتك، ونختم القرآن مع بعض</p></header>
      <section class="q-card" id="qKhatma"></section>
      <div style="height:calc(env(safe-area-inset-bottom) + 40px)"></div>`;
    paintKhatma();
    grpLoad();
  };

  const norm = (s) => s.replace(/[ً-ٰٟ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/^ال/, '').trim();
  const paintSuras = (q) => {
    const nq = norm(q || '');
    const list = NAMES.map((n, i) => i).filter((i) => !nq || norm(NAMES[i]).includes(nq) || String(i + 1) === q.trim());
    $('#qSuras').innerHTML = list.map((i) => `<li><a href="#/quran/s/${i + 1}"><span class="num"><span>${AR(i + 1)}</span></span><span class="nm">${NAMES[i]}</span><span class="meta">${AR(COUNTS[i])} آية</span></a></li>`).join('')
      || '<li class="q-msg">مفيش سورة بالاسم ده</li>';
  };

  const ringSVG = (done, total = 60, unit = 'حزب') => {
    const R = 40, C = 2 * Math.PI * R;
    return `<div class="q-ring"><svg viewBox="0 0 92 92"><circle class="bgc" cx="46" cy="46" r="${R}"/><circle class="fgc" cx="46" cy="46" r="${R}" stroke-dasharray="${C}" stroke-dashoffset="${C * (1 - done / total)}"/></svg><b><span>${AR(done)}<small>من ${AR(total)} ${unit}</small></span></b></div>`;
  };
  const hoursLeft = (p) => {
    const hold = (grp.state && grp.state.hold) || 72 * 3600e3;
    return Math.max(0, Math.ceil((p.at + hold - Date.now()) / 3600e3));
  };
  const leftTxt = (h) => h >= 48 ? `${AR(Math.ceil(h / 24))} أيام` : h >= 24 ? 'يوم' : h > 1 ? `${AR(h)} ساعة` : 'أقل من ساعة';

  const paintKhatma = () => {
    const box = $('#qKhatma'); if (!box) return;
    if (!grp.loaded && !grp.state) { box.innerHTML = '<div class="q-state" style="padding:30px 0"><div class="spin"></div>بيحمّل الختمة…</div>'; return; }
    if (!grp.state) {
      box.innerHTML = `<div class="q-sum">${ringSVG(0)}<div><h3>الختمة الجماعية</h3><p>ختمة واحدة مشتركة للكل</p></div></div>
        <p class="q-msg">${grp.err === 'nc' ? 'الختمة لسه ما اتفعّلتش على الموقع.' : 'الختمة محتاجة إنترنت. اتأكد إنك متصل وارجع للصفحة دي تاني.'}</p>`;
      return;
    }
    const st = grp.state, P = st.parts, me = myName();
    const d = P.filter((p) => p.s === 2).length, r = P.filter((p) => p.s === 1).length;
    const minePs = P.map((p, i) => [p, i + 1]).filter(([p]) => isMine(p));
    // حجوزاتي: الجزء الكامل بيتعرض مرة واحدة
    const groups = [];
    minePs.forEach(([p, h]) => {
      const pair = h % 2 === 0 ? h - 1 : h + 1, g = groups.find((x) => x.list.includes(pair));
      if (g) g.list.push(h); else groups.push({ list: [h], p });
    });
    groups.forEach((g) => g.list.sort((a, b) => a - b));
    const mineBox = groups.length ? `<div class="q-mine"><h4>اللي إنت حاجزه</h4>${groups.map((g) => {
      const whole = g.list.length === 2;
      const href = whole ? readHash('khatma-grp', 'j', g.list[1] / 2) : readHash('khatma-grp', 'h', g.list[0]);
      const sp = (ls.get(posKey('grp'), {}))[whole ? `j${g.list[1] / 2}` : `h${g.list[0]}`];
      return `<div class="q-mine-row"><div><b>${partName(g.list)}</b><span>${whole ? juzLabel(g.list[1] / 2) : hizbLabel(g.list[0])} · فاضل ${leftTxt(hoursLeft(g.p))}</span></div>
        <a class="btn ok" href="${sp ? readHash('khatma-grp', whole ? 'j' : 'h', whole ? g.list[1] / 2 : g.list[0], sp.g) : href}">${sp ? 'كمّل' : 'اقرأ'}</a></div>`;
    }).join('')}</div>` : '';
    const cell = (h) => {
      const p = P[h - 1], cls = p.s === 2 ? ' done' : p.s === 1 ? ' res' : '', mine = isMine(p) ? ' mine' : '';
      return `<span class="hz${cls}${mine}"><i>${AR(h)}</i>${p.s ? `<em>${esc(p.name)}</em>` : ''}</span>`;
    };
    const niyyat = [...new Set(P.filter((p) => p.s && p.niyya).map((p) => p.niyya))].slice(0, 30);
    const log = (st.log || []).filter((x) => x.a !== 'release').slice(0, 4);
    box.innerHTML = `<div class="q-sum">${ringSVG(d)}<div><h3>الختمة رقم ${AR(st.count + 1)}</h3><p>${AR(d)} حزب خلص${r ? ` · ${AR(r)} محجوز` : ''} · ${AR(60 - d - r)} متاح</p>${st.count ? `<span class="count">اتختم على الموقع ${timesTxt(st.count)} 🤍</span>` : ''}
        <br><button class="q-name" type="button" id="qNameBtn">${me ? `بتقرأ باسم <b>${esc(me)}</b> — تغيير` : 'اكتب اسمك ونيتك'}</button></div></div>
      ${mineBox}
      <div class="hz-grid">${Array.from({ length: 30 }, (_, i) => `<button type="button" class="hz-juz" data-j="${i + 1}" aria-label="الجزء ${AR(i + 1)}"><span class="jn">الجزء ${AR(i + 1)}</span><span class="hz-pair">${cell(2 * i + 1)}${cell(2 * i + 2)}</span></button>`).join('')}</div>
      <div class="q-legend"><span><i></i>متاح</span><span class="l-res"><i></i>حد بيقرأه</span><span class="l-done"><i></i>خلص</span></div>
      <p class="q-note">كل جزء فيه حزبين. اضغط على أي جزء، واحجزه كله أو حزب واحد منه، ولما تخلّص قراءته علّم عليه. الحجز بيفضل ٣ أيام، ولو مخلصش بيرجع متاح لغيرك. ولما الـ٦٠ حزب يخلصوا، الختمة تتعدّ وتبدأ ختمة جديدة.</p>
      ${niyyat.length ? `<div class="q-niyyat"><h4>نوايا الختمة دي</h4><p class="q-note" style="margin:0 0 8px">ادعُ لأصحابها بظهر الغيب</p><ul>${niyyat.map((x) => `<li>${esc(x)}</li>`).join('')}</ul></div>` : ''}
      ${log.length ? `<ul class="q-log">${log.map((x) => `<li>${x.a === 'khatma' ? '🤍 <b>تمّت ختمة كاملة</b>' : `<b>${esc(x.name)}</b> ${x.a === 'done' ? 'خلّص' : 'حجز'} ${partName(x.p || [])}`}</li>`).join('')}</ul>` : ''}`;
    box.querySelectorAll('.hz-juz').forEach((b) => b.onclick = () => juzSheet(+b.dataset.j));
    const nb = $('#qNameBtn', box); if (nb) nb.onclick = () => askInfo();
  };

  const juzSheet = (n) => {
    const st = grp.state; if (!st) return;
    const h1 = 2 * n - 1, h2 = 2 * n, P = st.parts, a = P[h1 - 1], b = P[h2 - 1];
    const sp = ls.get(posKey('grp'), {});
    const statTxt = (p) => p.s === 2 ? `خلّصه <b>${esc(p.name)}</b> ✓` : p.s === 1 ? (isMine(p) ? 'إنت حاجزه' : `<b>${esc(p.name)}</b> بيقرأه`) : 'متاح';
    const row = (h, p) => {
      const btns = [];
      const pos = sp[`h${h}`];
      btns.push(`<a class="btn" href="${readHash('khatma-grp', 'h', h, pos && pos.g)}">${pos ? 'كمّل' : 'اقرأه'}</a>`);
      if (p.s === 0) btns.push(`<button class="btn ok" type="button" data-act="reserve" data-p="${h}">احجزه</button>`);
      if (p.s === 0 || isMine(p)) btns.push(`<button class="btn" type="button" data-act="done" data-p="${h}">خلّصته ✓</button>`);
      if (isMine(p)) btns.push(`<button class="btn ghost" type="button" data-act="release" data-p="${h}">إلغاء</button>`);
      return `<div class="hz-row"><div class="hz-row-t"><b>الحزب ${AR(h)}</b><span>${hizbLabel(h)}</span><span class="st">${statTxt(p)}${p.niyya ? ` — <i>${esc(p.niyya)}</i>` : ''}</span></div><div class="row">${btns.join('')}</div></div>`;
    };
    const free2 = a.s === 0 && b.s === 0;
    const mine2 = isMine(a) && isMine(b);
    const posJ = sp[`j${n}`];
    const whole = [`<a class="btn" href="${readHash('khatma-grp', 'j', n, posJ && posJ.g)}">${posJ ? 'كمّل الجزء' : 'اقرأ الجزء كله'}</a>`];
    if (free2) whole.unshift(`<button class="btn ok" type="button" data-act="reserve" data-p="${h1},${h2}">احجز الجزء كله</button>`);
    if (mine2 || (free2) || (isMine(a) && b.s === 0) || (isMine(b) && a.s === 0)) whole.push(`<button class="btn" type="button" data-act="done" data-p="${h1},${h2}">خلّصت الجزء كله ✓</button>`);
    sheet(`<h3>الجزء ${AR(n)}</h3><p class="sub">${juzLabel(n)}</p>
      <div class="row">${whole.join('')}</div>
      <p class="q-or">أو حزب واحد بس</p>
      ${row(h1, a)}${row(h2, b)}`, (c) => {
      c.querySelectorAll('a').forEach((x) => x.onclick = closeSheet);
      c.querySelectorAll('[data-act]').forEach((btn) => btn.onclick = () => {
        const act = btn.dataset.act, parts = btn.dataset.p.split(',').map(Number);
        const go = async () => {
          btn.disabled = true;
          const res = await grpPost(act, parts);
          if (res && act === 'done') { const m = ls.get(posKey('grp'), {}); delete m[`j${n}`]; parts.forEach((h) => delete m[`h${h}`]); ls.set(posKey('grp'), m); }
          closeSheet(); paintKhatma();
          if (res && !res.completed) {
            toast(act === 'reserve' ? `حجزت ${partName(parts)}، ربنا يعينك` : act === 'done' ? `جزاك الله خيرًا، علّمت ${partName(parts)}` : 'اتلغى الحجز');
            const el = document.querySelector(`.hz-juz[data-j="${n}"]`); if (el) el.classList.add('pop');
          }
        };
        if (act === 'reserve') askInfo(go, { title: `احجز ${partName(parts)}`, ok: 'احجز' });
        else if (act === 'done' && !myName()) askInfo(go); else go();
      });
    });
  };

  /* ---------- القارئ ---------- */
  const mem = {};
  const stripBasmala = (s, k, text) => {
    if (k === 1 && s !== 1 && s !== 9) {
      const w = text.split(' ');
      if (w.length > 4 && w[0].startsWith('بِسْمِ')) return w.slice(4).join(' ');
    }
    return text;
  };

  /* ---------- المصحف كامل على الجهاز (من غير نت) ----------
     أول مرة الموقع يتفتح وفيه نت، المصحف كله بيتحمّل مرة واحدة ويتحفظ على الجهاز.
     بعد كده القراءة كلها (المصحف والختمة والأدعية) بتشتغل من غير نت. */
  const FULL_URL = `${API}/quran/quran-uthmani`;
  const QCACHE = 'quran-text-v1';
  let full = null, fullP = null, fullState = 'idle';
  const buildFull = (j) => {
    const all = [];
    j.data.surahs.forEach((su) => su.ayahs.forEach((a) => all.push({ g: a.number, s: su.number, k: a.numberInSurah, juz: a.juz, page: a.page, text: stripBasmala(su.number, a.numberInSurah, a.text) })));
    if (all.length !== 6236) throw new Error('incomplete');
    return all;
  };
  const peekFull = async () => {
    if (full) return full;
    try {
      const c = await caches.open(QCACHE);
      const res = await c.match(FULL_URL);
      if (!res) return null;
      full = buildFull(await res.json()); fullState = 'ready'; ls.set('quran:offline', true);
      return full;
    } catch { return null; }
  };
  const getFull = () => {
    if (full) return Promise.resolve(full);
    if (fullP) return fullP;
    fullP = (async () => {
      const cached = await peekFull(); if (cached) return cached;
      if (navigator.onLine === false) throw new Error('offline');
      fullState = 'loading'; paintOffline();
      const r = await fetch(FULL_URL, { cache: 'no-store' });
      if (!r.ok) throw new Error('http');
      const body = await r.text();
      const data = buildFull(JSON.parse(body));
      try { const c = await caches.open(QCACHE); await c.put(FULL_URL, new Response(body, { headers: { 'Content-Type': 'application/json' } })); } catch {}
      full = data; fullState = 'ready'; ls.set('quran:offline', true); paintOffline();
      return full;
    })().catch((e) => { fullP = null; fullState = 'error'; paintOffline(); throw e; });
    return fullP;
  };
  const paintOffline = () => {
    const el = $('#qOffline'); if (!el) return;
    el.className = 'q-offline ' + fullState;
    if (fullState === 'idle') {
      el.innerHTML = '';
      peekFull().then((f) => { if (f) paintOffline(); else if (navigator.onLine !== false) getFull().catch(() => {}); else { fullState = 'error'; paintOffline(); } });
      return;
    }
    if (fullState === 'ready') el.innerHTML = '<span class="dot"></span><span>المصحف كامل محفوظ على جهازك، وبيشتغل من غير نت</span>';
    else if (fullState === 'loading') el.innerHTML = '<span class="spin"></span><span>بيحمّل المصحف كامل على جهازك عشان يشتغل من غير نت…</span>';
    else el.innerHTML = '<span>المصحف محتاج إنترنت مرة واحدة بس عشان يتحفظ على جهازك</span><button type="button" id="qGetFull">حمّله دلوقتي</button>';
    const b = $('#qGetFull'); if (b) b.onclick = () => getFull().catch(() => toast('محتاج إنترنت عشان يتحمّل، جرّب تاني لما تكون متصل'));
  };
  // التحميل بيبدأ لوحده في الخلفية بعد ما الموقع يفتح
  const autoFull = () => { peekFull().then((f) => { if (!f && navigator.onLine !== false) getFull().catch(() => {}); }); };
  if (document.readyState === 'complete') setTimeout(autoFull, 4000);
  else addEventListener('load', () => setTimeout(autoFull, 4000));
  addEventListener('online', () => { if (!full) getFull().catch(() => {}); });

  const loadAyahs = async (t, n) => {
    const all = full || await peekFull();
    if (all) return all.filter((a) => (t === 'j' ? a.juz === n : t === 'h' ? hizbOf(a.s, a.k) === n : t === 'p' ? a.page === n : a.s === n)).map(({ g, s, k, juz, page, text }) => ({ g, s, k, juz, page, text }));
    if (t === 'h') { const j = await loadAyahs('j', Math.ceil(n / 2)); return j.filter((a) => hizbOf(a.s, a.k) === n); }
    // المصحف لسه ما اتحمّلش كامل: نجيب الجزء ده لوحده دلوقتي، والمصحف كامل بيكمّل تحميل في الخلفية
    getFull().catch(() => {});
    const url = t === 'j' ? `${API}/juz/${n}/quran-uthmani` : t === 'p' ? `${API}/page/${n}/quran-uthmani` : `${API}/surah/${n}/quran-uthmani`;
    if (mem[url]) return mem[url];
    const r = await fetch(url);
    if (!r.ok) throw new Error('http');
    const j = await r.json();
    const out = j.data.ayahs.map((a) => {
      const s = surahOf(a.number), k = a.numberInSurah;
      return { g: a.number, s, k, juz: a.juz, page: a.page, text: stripBasmala(s, k, a.text) };
    });
    mem[url] = out; return out;
  };

  let ayahs = [];
  const renderReader = async (t, n, target, ctx = 'quran') => {
    view = { type: 'read', t, n, ctx };
    const title = t === 'j' ? `الجزء ${AR(n)}` : t === 'h' ? `الحزب ${AR(n)}` : t === 'p' ? `صفحة ${AR(n)}` : `سورة ${NAMES[n - 1]}`;
    const sub = (t === 'j' ? juzLabel(n) : t === 'h' ? hizbLabel(n) : t === 'p' ? 'من ٦٠٤ صفحة' : `${AR(COUNTS[n - 1])} آية`) + (ctx === 'khatma-grp' ? ' — الختمة الجماعية' : '');
    $('#qTitle').textContent = title;
    const w = root(); w.className = 'wrap';
    w.innerHTML = `<header class="q-rhead"><h2>${title}</h2><p id="qSub">${sub}</p>
        <button class="q-listen" type="button" id="qListen">${ICON.play}<span>${listenLabel()}</span></button>
        <p class="q-listen-note" id="qListenNote">${listenNote()}</p>
        ${reciterPicker()}<p class="q-recnote" id="qRecNote"></p></header>
      <div class="mushaf" id="mushaf"><div class="q-state"><div class="spin"></div>بيحمّل الآيات…</div></div>
      <div id="qAfter"></div>`;
    paintRecNote();
    window.scrollTo(0, 0);
    try { ayahs = await loadAyahs(t, n); }
    catch { if (qp.resume) { qp.resume = false; stop(); } $('#mushaf').innerHTML = '<div class="q-state">المصحف لسه ما اتحفظش على جهازك. افتح الموقع مرة وإنت متصل بالإنترنت، وهيتحفظ كامل لوحده ويشتغل بعد كده من غير نت.</div>'; return; }
    if (!view || view.type !== 'read' || view.t !== t || view.n !== n || view.ctx !== ctx) return;
    let html = '', open = false, prevPage = null;
    ayahs.forEach((a, i) => {
      const newPage = t !== 'p' && a.page && a.page !== prevPage;
      if ((newPage || a.k === 1) && open) { html += '</p>'; open = false; }
      if (newPage) { html += `<div class="page-sep" data-p="${a.page}"><span>صفحة ${AR(a.page)}</span></div>`; prevPage = a.page; }
      if (a.k === 1) {
        html += `<div class="sura-head"><span>سورة ${NAMES[a.s - 1]}</span><small>${AR(COUNTS[a.s - 1])} آية</small></div>`;
        if (a.s !== 1 && a.s !== 9) html += `<div class="basmala">${BASMALA}</div>`;
      }
      if (!open) { html += '<p class="mtext">'; open = true; }
      html += `<span class="aya" data-i="${i}">${a.text}<span class="an">${AR(a.k)}</span></span> `;
    });
    if (open) html += '</p>';
    if (t === 'p') html += `<div class="page-foot">${AR(n)}</div>`;
    $('#mushaf').innerHTML = html;
    // معلومات الصفحات تحت العنوان
    {
      const pages = ayahs.map((a) => a.page).filter(Boolean);
      const extra = ctx === 'khatma-grp' ? ' — الختمة الجماعية' : '';
      if (t === 'p' && ayahs[0]) {
        const names = [...new Set(ayahs.map((a) => a.s))].map((x) => NAMES[x - 1]).join(' و');
        $('#qSub').textContent = `سورة ${names} — الجزء ${AR(ayahs[0].juz)}`;
      } else if (pages.length) {
        const a0 = Math.min(...pages), a1 = Math.max(...pages);
        $('#qSub').textContent = `${t === 'j' ? juzLabel(n) : t === 'h' ? hizbLabel(n) : `${AR(COUNTS[n - 1])} آية`} — ${a0 === a1 ? `صفحة ${AR(a0)}` : `من صفحة ${AR(a0)} لـ ${AR(a1)}`}${extra}`;
      }
    }
    paintPage();
    paintAfter();
    const pos = getPos();
    if (pos) markAya(ayahs.findIndex((a) => a.g === pos.g));
    if (target) {
      const i = ayahs.findIndex((a) => a.g === target);
      if (i >= 0) setTimeout(() => scrollToAya(i, 'auto'), 60);
    }
    if (qp.resume) resumeAfterTurn();
  };

  const paintAfter = () => {
    const { t, n, ctx } = view;
    let end = '';
    if (ctx === 'khatma-grp' && (t === 'j' || t === 'h')) {
      const parts = t === 'j' ? [2 * n - 1, 2 * n] : [n];
      const what = partName(parts);
      if (!grp.state) {
        end = `<div class="q-end"><h3>خلّصت ${what}؟</h3><p class="q-msg">الختمة محتاجة إنترنت عشان تعلّم عليها.</p></div>`;
      } else {
        const ps = parts.map((h) => grp.state.parts[h - 1]);
        const allDone = ps.every((p) => p.s === 2);
        const other = ps.find((p) => p.s === 1 && !isMine(p));
        end = `<div class="q-end"><h3>خلّصت ${what}؟</h3><p>علّم عليه في الختمة الجماعية، وربنا يتقبّل منك</p><div class="row">
          ${allDone ? `<button class="btn" type="button" disabled>${what} خلص ✓</button>`
            : other ? `<p class="q-msg">${esc(other.name)} ${parts.length === 1 ? `حاجز ${what}، فهو بس اللي يعلّم عليه` : `حاجز حتة من ${what}، فهو بس اللي يعلّم عليها`}</p>`
            : `<button class="btn ok" type="button" id="qEndGrp">خلّصته، علّم عليه ✓</button>`}</div></div>`;
      }
    }
    const maxN = t === 'j' ? 30 : t === 'h' ? 60 : t === 'p' ? 604 : 114;
    const prev = n > 1 ? readHash(ctx, t, n - 1) : '';
    const next = n < maxN ? readHash(ctx, t, n + 1) : '';
    const pl = t === 'j' ? `الجزء ${AR(n - 1)}` : t === 'h' ? `الحزب ${AR(n - 1)}` : t === 'p' ? `صفحة ${AR(n - 1)}` : `سورة ${NAMES[n - 2]}`;
    const nl = t === 'j' ? `الجزء ${AR(n + 1)}` : t === 'h' ? `الحزب ${AR(n + 1)}` : t === 'p' ? `صفحة ${AR(n + 1)}` : `سورة ${NAMES[n]}`;
    $('#qAfter').innerHTML = `${end}<nav class="q-nav">${next ? `<a class="btn" href="${next}">← ${nl}</a>` : ''}${prev ? `<a class="btn" href="${prev}">${pl} →</a>` : ''}</nav>`;
    const eg = $('#qEndGrp'); if (eg) eg.onclick = () => {
      const parts = t === 'j' ? [2 * n - 1, 2 * n] : [n];
      const go = async () => {
        eg.disabled = true;
        const r = await grpPost('done', parts);
        if (r) { const m = ls.get(posKey('grp'), {}); delete m[t + n]; parts.forEach((h) => delete m[`h${h}`]); ls.set(posKey('grp'), m); }
        if (r && !r.completed) toast(`جزاك الله خيرًا، علّمت ${partName(parts)} في الختمة`);
        paintAfter();
      };
      if (!myName()) askInfo(go); else go();
    };
  };

  /* ---------- أدعية من القرآن (بصوت الشيخ مشاري العفاسي) ---------- */
  const DUAS = [
    [17, 24, 'دعاء للوالدين'],
    [14, 41, 'للنفس وللوالدين وللمؤمنين'],
    [71, 28, 'دعاء نوح عليه السلام لوالديه وللمؤمنين'],
    [59, 10, 'لمن سبقونا بالإيمان'],
    [46, 15, 'شكر النعمة على النفس والوالدين'],
    [2, 201, 'خير الدنيا والآخرة'],
    [3, 8, 'الثبات على الهداية'],
    [3, 16, 'المغفرة والنجاة من النار'],
    [3, 147, 'المغفرة والثبات'],
    [3, 193, 'الوفاة مع الأبرار'],
    [3, 194, 'تحقيق الوعد والنجاة من الخزي'],
    [7, 23, 'دعاء آدم وحواء عليهما السلام'],
    [21, 87, 'دعاء ذي النون عليه السلام'],
    [23, 118, 'المغفرة والرحمة'],
    [18, 10, 'الرحمة والرشد'],
    [2, 250, 'الصبر والثبات'],
    [25, 74, 'صلاح الأزواج والذرية'],
    [14, 40, 'إقامة الصلاة وقبول الدعاء'],
    [2, 127, 'قبول العمل'],
    [2, 128, 'الإسلام والتوبة'],
    [2, 286, 'خواتيم سورة البقرة'],
  ];
  const loadDuas = async () => {
    if (mem.duas) return mem.duas;
    const all = full || await peekFull();
    if (all) { mem.duas = DUAS.map(([s, k, label]) => { const a = all[START[s - 1] + k - 2]; return { g: a.g, s, k, text: a.text, label }; }); return mem.duas; }
    getFull().catch(() => {});
    const out = await Promise.all(DUAS.map(async ([s, k, label]) => {
      const r = await fetch(`${API}/ayah/${s}:${k}/quran-uthmani`);
      if (!r.ok) throw new Error('http');
      const j = await r.json();
      return { g: j.data.number, s, k, text: j.data.text, label };
    }));
    mem.duas = out; return out;
  };
  const renderDuas = async () => {
    view = { type: 'read', t: 'd', n: 1 };
    if ($('#qPage')) $('#qPage').hidden = true;
    $('#qTitle').textContent = 'أدعية من القرآن';
    const w = root(); w.className = 'wrap';
    w.innerHTML = `<header class="q-rhead"><h2>أدعية من القرآن</h2><p>ادعُ بها لنفسك ولمن تحب، وردّد مع الشيخ</p>
        <button class="q-listen" type="button" id="qListen">${ICON.play}<span>${listenLabel()}</span></button>
        <p class="q-listen-note" id="qListenNote">${listenNote()}</p>
        ${reciterPicker(true)}</header>
      <div id="mushaf" class="duas"><div class="q-state"><div class="spin"></div>بيحمّل الأدعية…</div></div>
      <div id="qAfter" style="height:calc(env(safe-area-inset-bottom) + 110px)"></div>`;
    window.scrollTo(0, 0);
    try { ayahs = await loadDuas(); }
    catch { $('#mushaf').innerHTML = '<div class="q-state">محتاج إنترنت أول مرة تفتح الأدعية. بعد كده هتشتغل من غير نت.</div>'; return; }
    if (!isDuas()) return;
    $('#mushaf').innerHTML = ayahs.map((a, i) => `<article class="dua-card">
        <p class="dua-label">${esc(a.label)}</p>
        <p class="mtext"><span class="aya" data-i="${i}">${a.text}<span class="an">${AR(a.k)}</span></span></p>
        <p class="dua-ref">سورة ${NAMES[a.s - 1]} — آية ${AR(a.k)}</p></article>`).join('');
  };

  /* مكان القراءة: كل مكان ليه حفظ لوحده ومش بيدخل في التاني
     - المصحف: quran:last
     - الختمة الجماعية: khatma:pos:grp (لكل جزء وحزب مكانه) */
  const posKey = (w) => `khatma:pos:${w}`;
  const getPos = () => {
    if (!view || view.type !== 'read' || view.t === 'd') return null;
    if (view.ctx === 'quran') { const l = ls.get('quran:last', null); return l && l.t === view.t && l.n === view.n ? l : null; }
    const m = ls.get(posKey(view.ctx.split('-')[1]), {}); return m[view.t + view.n] || null;
  };
  const readHash = (ctx, t, n, g) => ctx === 'quran' ? `#/quran/${t}/${n}${g ? '/' + g : ''}` : `#/khatma/${ctx.split('-')[1]}/${t}/${n}${g ? '/' + g : ''}`;

  const markAya = (i) => {
    document.querySelectorAll('.aya.mark').forEach((e) => e.classList.remove('mark'));
    const el = document.querySelector(`.aya[data-i="${i}"]`); if (el) el.classList.add('mark');
  };
  const saveLast = (i) => {
    const a = ayahs[i]; if (!a || !view || view.type !== 'read' || view.t === 'd') return;
    const rec = { t: view.t, n: view.n, g: a.g, s: a.s, k: a.k, page: a.page, at: Date.now() };
    if (view.ctx === 'quran') ls.set('quran:last', rec);
    else { const w = view.ctx.split('-')[1], m = ls.get(posKey(w), {}); m[view.t + view.n] = rec; ls.set(posKey(w), m); }
  };
  const scrollToAya = (i, behavior) => {
    const el = document.querySelector(`.aya[data-i="${i}"]`); if (!el) return;
    const bar = $('#qBarTop') ? $('#qBarTop').offsetHeight : 60;
    const r = el.getBoundingClientRect();
    if (behavior !== 'auto' && r.top > bar + 30 && r.bottom < innerHeight - 140) return;
    window.scrollTo({ top: r.top + scrollY - bar - innerHeight * 0.22, behavior: RM || behavior === 'auto' ? 'auto' : 'smooth' });
  };

  /* رقم الصفحة اللي إنت فيها دلوقتي (في الشريط اللي فوق) */
  const paintPage = () => {
    const pill = $('#qPage'); if (!pill) return;
    if (!view || view.type !== 'read' || view.t === 'd' || !ayahs.length || !ayahs[0].page) { pill.hidden = true; return; }
    const bar = $('#qBarTop') ? $('#qBarTop').offsetHeight : 60;
    let cur = ayahs[0];
    const els = document.querySelectorAll('#mushaf .aya');
    for (const el of els) { const r = el.getBoundingClientRect(); if (r.bottom > bar + 40) { const a = ayahs[+el.dataset.i]; if (a && a.page) cur = a; break; } }
    pill.innerHTML = `<span class="sn">${NAMES[cur.s - 1]} — </span>صفحة ${AR(cur.page)}`; pill.hidden = false;
  };
  let pageRaf = 0;
  addEventListener('scroll', () => { if (pageRaf) return; pageRaf = requestAnimationFrame(() => { pageRaf = 0; paintPage(); }); }, { passive: true });

  /* حفظ مكان القراءة تلقائيًا وإنت بتنزل */
  let scrollT;
  addEventListener('scroll', () => {
    if (!view || view.type !== 'read' || qp.on) return;
    clearTimeout(scrollT);
    scrollT = setTimeout(() => {
      const bar = $('#qBarTop') ? $('#qBarTop').offsetHeight : 60;
      const els = document.querySelectorAll('.aya');
      for (const el of els) { const r = el.getBoundingClientRect(); if (r.bottom > bar + 40) { if (scrollY > 200) saveLast(+el.dataset.i); break; } }
    }, 600);
  }, { passive: true });

  /* ---------- اختيار آية ---------- */
  let selI = -1;
  const bar = () => $('#qBar');
  const showBar = (html, bind) => { const b = bar(); b.innerHTML = html; b.classList.add('show'); if (bind) bind(b); };
  const hideBar = () => { const b = bar(); if (b) b.classList.remove('show'); };
  const clearSel = () => { document.querySelectorAll('.aya.sel').forEach((e) => e.classList.remove('sel')); selI = -1; };
  const selectAya = (i) => {
    clearSel(); selI = i;
    const el = document.querySelector(`.aya[data-i="${i}"]`); if (el) el.classList.add('sel');
    const a = ayahs[i];
    showBar(`<div class="t"><b>سورة ${NAMES[a.s - 1]}</b><span>آية ${AR(a.k)}</span></div>
      <button type="button" class="main" data-b="play">${ICON.play}${ER().mode === 'surah' ? 'استمع للسورة' : 'استمع من هنا'}</button>
      ${isDuas() ? '' : `<button type="button" data-b="mark" aria-label="وقفت هنا">${ICON.mark}وقفت هنا</button>`}
      <button type="button" class="x" data-b="x" aria-label="إغلاق">${ICON.x}</button>`, (b) => {
      b.querySelector('[data-b="play"]').onclick = () => { clearSel(); playFrom(i); };
      if (b.querySelector('[data-b="mark"]')) b.querySelector('[data-b="mark"]').onclick = () => { saveLast(i); markAya(i); clearSel(); hideBar(); toast(`حفظت مكانك: سورة ${NAMES[a.s - 1]} آية ${AR(a.k)}`); };
      b.querySelector('[data-b="x"]').onclick = () => { clearSel(); hideBar(); };
    });
  };

  /* ---------- القرّاء ----------
     التلاوة المتواصلة (timed): السورة كاملة من MP3Quran، ومعاها توقيت كل آية، فالآية بتنوّر مع الشيخ.
     لو التوقيت أو الصوت مش متاح، الموقع بيرجع لوحده للتلاوة آية آية من Islamic Network. */
  const RECITERS = {
    alafasy: { name: 'مشاري العفاسي', full: 'الشيخ مشاري راشد العفاسي', mode: 'timed', read: 123, folder: 'https://cdn.mp3quran.net/audio/mishary-alafasy/r1/', fb: { mode: 'ayah', ed: 'ar.alafasy' } },
    maher: { name: 'ماهر المعيقلي', full: 'الشيخ ماهر المعيقلي (مجوَّد)', mode: 'timed', read: 133, folder: 'https://cdn.mp3quran.net/audio/maher-muaiqly/r3/', fb: { mode: 'ayah', ed: 'ar.mahermuaiqly', full: 'الشيخ ماهر المعيقلي' } },
    dossari: { name: 'ياسر الدوسري', full: 'الشيخ ياسر الدوسري', mode: 'timed', read: 92, folder: 'https://cdn.mp3quran.net/audio/yasser-dosari/r1/', fb: { mode: 'surah', ed: 'ar.yasseraldossari' } },
  };
  const timedFailed = {};
  let rid = ls.get('quran:reciter', 'alafasy'); if (!RECITERS[rid]) rid = 'alafasy';
  const R = () => RECITERS[rid];
  const isDuas = () => !!(view && view.type === 'read' && view.t === 'd');
  const asFallback = (r) => ({ ...r, ...r.fb, full: (r.fb && r.fb.full) || r.full });
  const ER = () => {
    const r = R();
    if (isDuas()) return asFallback(r.fb.mode === 'ayah' ? r : RECITERS.alafasy);
    if (r.mode === 'timed' && timedFailed[rid]) return asFallback(r);
    return r;
  };
  const ayahUrl = (g) => `https://cdn.islamic.network/quran/audio/128/${ER().ed}/${g}.mp3`;
  const surahUrl = (n) => `https://cdn.islamic.network/quran/audio-surah/128/${ER().ed}/${n}.mp3`;
  // لو الملف ما اشتغلش من موقع MP3Quran مباشرة، بنجيبه عن طريق الموقع نفسه (/mp3q/)
  const viaSite = {};
  const surahFile = (r, s) => {
    const f = `${String(s).padStart(3, '0')}.mp3`;
    return viaSite[rid] ? r.folder.replace('https://cdn.mp3quran.net/audio/', '/mp3q/') + f : r.folder + f;
  };
  const listenLabel = () => (isDuas() ? 'تشغيل الأدعية كلها ورا بعض' : ER().mode === 'surah' ? 'تشغيل السور ورا بعض' : 'تشغيل الآيات ورا بعض');
  const listenNote = () => (isDuas()
    ? `بصوت ${ER().full} — بيقرأ الأدعية واحد ورا التاني لوحده. ولو دوست على أي دعاء، تقدر تبدأ منه.`
    : ER().mode === 'surah'
      ? `بصوت ${ER().full} — بيقرأ كل سورة كاملة، والسور اللي في الصفحة ورا بعض لوحده.`
      : ER().mode === 'timed'
        ? `بصوت ${ER().full} — تلاوة متواصلة من غير وقفات، والآية بتنوّر مع الشيخ والصفحة بتنزل معاه. ولو دوست على أي آية، تقدر تبدأ منها.`
        : `بصوت ${ER().full} — بيقرأ الآيات ورا بعض لوحده لحد آخر الصفحة، والآية بتنوّر معاه. ولو دوست على أي آية، تقدر تبدأ منها.`);
  const reciterPicker = (onlyAyah) => {
    const cur = onlyAyah && R().fb.mode !== 'ayah' ? 'alafasy' : rid;
    return `<div class="q-reciters" role="radiogroup" aria-label="اختار القارئ">${Object.entries(RECITERS).filter(([, r]) => !onlyAyah || r.fb.mode === 'ayah').map(([k, r]) => `<button type="button" role="radio" aria-checked="${k === cur}" data-r="${k}" class="${k === cur ? 'on' : ''}">${r.name}</button>`).join('')}</div>`;
  };
  const paintRecNote = () => {
    const n = $('#qRecNote'); if (!n) return;
    n.textContent = isDuas() ? ''
      : ER().mode === 'surah' ? `${ER().full} متاح دلوقتي بالسورة كاملة، فالآيات مش هتنوّر وهو بيقرأ`
      : rid === 'maher' && ER().mode === 'timed' ? 'تلاوة الشيخ ماهر هنا مجوَّدة' : '';
  };
  const setReciter = (k) => {
    if (!RECITERS[k] || k === rid) return;
    stop(); rid = k; ls.set('quran:reciter', k);
    document.querySelectorAll('.q-reciters button').forEach((b) => { const on = b.dataset.r === k; b.classList.toggle('on', on); b.setAttribute('aria-checked', String(on)); });
    paintMini(); paintRecNote();
  };
  document.addEventListener('click', (e) => { const b = e.target.closest('.q-reciters button'); if (b) setReciter(b.dataset.r); });

  /* توقيت الآيات جوه تسجيل السورة (بيتجاب عن طريق الموقع نفسه) */
  const timingMem = {};
  const getTiming = async (read, s) => {
    const key = `${read}:${s}`;
    if (timingMem[key]) return timingMem[key];
    const r = await fetch(`/api/timing?read=${read}&surah=${s}`);
    if (!r.ok) throw new Error('timing');
    const arr = await r.json();
    if (!Array.isArray(arr) || !arr.length) throw new Error('timing');
    const list = arr.filter((x) => Array.isArray(x) && x[0] > 0 && x[1] >= 0).sort((a, b) => a[1] - b[1]);
    const map = {}; list.forEach(([k, st, en]) => { map[k] = [st, en]; });
    if (!map[1]) throw new Error('timing');
    return (timingMem[key] = { map, list });
  };

  /* ---------- مشغّل التلاوة ---------- */
  const qp = { el: new Audio(), next: new Audio(), idx: -1, on: false, surah: 0, tok: 0, tim: null, seeking: false, carry: false, resume: false };
  qp.el.preload = 'auto'; qp.next.preload = 'auto';
  const clearReading = () => document.querySelectorAll('.aya.reading, .sura-head.reading').forEach((e) => e.classList.remove('reading'));
  const mmss = (t) => (isFinite(t) ? `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, '0')}` : '');
  const fullSurahsInView = () => ayahs.filter((a) => a.k === 1).map((a) => a.s);
  let idxMap = null, idxFor = null;
  const idxOf = (s, k) => {
    if (idxFor !== ayahs) { idxMap = {}; ayahs.forEach((a, i) => { idxMap[`${a.s}:${a.k}`] = i; }); idxFor = ayahs; }
    return idxMap[`${s}:${k}`];
  };
  const viewLastK = (s) => { let k = 0; ayahs.forEach((a) => { if (a.s === s && a.k > k) k = a.k; }); return k; };
  const nextSurahInView = (s) => { for (const a of ayahs) if (a.s > s) return a.s; return 0; };
  const paintMini = () => {
    const lb = $('#qListen');
    if (lb) { lb.innerHTML = qp.on ? `${ICON.pause}<span>إيقاف التشغيل</span>` : `${ICON.play}<span>${listenLabel()}</span>`; }
    const ln = $('#qListenNote'); if (ln) ln.textContent = listenNote();
    if (!qp.on) { if (selI < 0) hideBar(); return; }
    const paused = qp.el.paused && qp.el.readyState > 2;
    let t1, t2;
    if (ER().mode === 'surah') { t1 = `سورة ${NAMES[qp.surah - 1]}`; t2 = `<span id="qTime">${mmss(qp.el.currentTime)}${qp.el.duration ? ' / ' + mmss(qp.el.duration) : ''}</span> — ${ER().name}`; }
    else { const a = ayahs[qp.idx]; if (!a) return; t1 = `سورة ${NAMES[a.s - 1]}`; t2 = `آية ${AR(a.k)} — ${ER().name}`; }
    showBar(`<div class="t"><b>${t1}</b><span>${t2}</span></div>
      <button type="button" class="main" data-b="pp" aria-label="${paused ? 'تشغيل' : 'إيقاف مؤقت'}">${paused ? ICON.play : ICON.pause}</button>
      <button type="button" class="x" data-b="stop" aria-label="إيقاف">${ICON.x}</button>`, (b) => {
      b.querySelector('[data-b="pp"]').onclick = () => { if (qp.el.paused) qp.el.play().catch(() => {}); else qp.el.pause(); };
      b.querySelector('[data-b="stop"]').onclick = stop;
    });
  };
  const setMedia = (title) => {
    try {
      if (!('mediaSession' in navigator)) return;
      navigator.mediaSession.metadata = new MediaMetadata({ title, artist: ER().full, album: 'القرآن الكريم — ختمة جماعية', artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }] });
      navigator.mediaSession.setActionHandler('play', () => qp.el.play());
      navigator.mediaSession.setActionHandler('pause', () => qp.el.pause());
      navigator.mediaSession.setActionHandler('stop', stop);
      const m = ER().mode;
      if (m === 'ayah' || m === 'timed') {
        navigator.mediaSession.setActionHandler('nexttrack', () => { if (qp.idx < ayahs.length - 1) playFrom(qp.idx + 1); });
        navigator.mediaSession.setActionHandler('previoustrack', () => { if (qp.idx > 0) playFrom(qp.idx - 1); });
      } else {
        navigator.mediaSession.setActionHandler('nexttrack', null);
        navigator.mediaSession.setActionHandler('previoustrack', null);
      }
    } catch {}
  };
  const lightIdx = (i) => {
    if (i === qp.idx) return;
    qp.idx = i; clearReading();
    const el = document.querySelector(`.aya[data-i="${i}"]`); if (el) el.classList.add('reading');
    scrollToAya(i); saveLast(i); markAya(i);
    const a = ayahs[i]; if (a) setMedia(`سورة ${NAMES[a.s - 1]} — آية ${AR(a.k)}`);
    paintMini();
  };

  /* آية آية — الآية اللي بعدها بتتحمّل في مشغّل تاني وهو بيقرأ، وأول ما الآية تخلص التانية بتبدأ على طول من غير وقفة تحميل */
  const showIdx = () => {
    const a = ayahs[qp.idx];
    clearReading();
    const el = document.querySelector(`.aya[data-i="${qp.idx}"]`); if (el) el.classList.add('reading');
    scrollToAya(qp.idx);
    saveLast(qp.idx); markAya(qp.idx);
    setMedia(`سورة ${NAMES[a.s - 1]} — آية ${AR(a.k)}`);
    paintMini();
  };
  const preloadNext = () => {
    const nx = ayahs[qp.idx + 1]; if (!nx) return;
    const u = ayahUrl(nx.g);
    if (qp.next.src !== u) { qp.next.src = u; try { qp.next.load(); } catch {} }
  };
  const playIdx = () => {
    const a = ayahs[qp.idx]; if (!a) return stop();
    qp.el.muted = false;
    qp.el.src = ayahUrl(a.g);
    qp.el.play().catch((e) => { if (e && e.name === 'NotAllowedError') stop(); });
    preloadNext();
    showIdx();
  };
  // الآيفون مش بيسمح للمشغّل التاني يشتغل لوحده إلا لو اتشغّل مرة مع دوسة المستخدم
  const unlockNext = () => {
    const n = qp.next; if (!n.src) return;
    n.muted = true;
    const p = n.play();
    const done = () => { if (n !== qp.el) { try { n.pause(); n.currentTime = 0; } catch {} } n.muted = false; };
    if (p && p.then) p.then(done, done); else done();
  };
  const nextAyah = () => {
    const i = qp.idx + 1, a = ayahs[i];
    if (!a) return finishView();
    const u = ayahUrl(a.g), n = qp.next;
    if (n.src === u && n.readyState >= 2 && !n.error) {
      const old = qp.el; qp.el = n; qp.next = old; qp.idx = i;
      try { old.pause(); } catch {}
      qp.el.muted = false;
      try { qp.el.currentTime = 0; } catch {}
      qp.el.play().catch(() => { qp.next = qp.el; qp.el = old; if (qp.on) playIdx(); });
      preloadNext(); showIdx();
      return;
    }
    qp.idx = i; playIdx();
  };
  /* السورة كاملة من غير توقيت */
  const playSurah = (n) => {
    qp.surah = n; clearReading();
    const i = ayahs.findIndex((a) => a.s === n && a.k === 1);
    const head = document.querySelectorAll('.sura-head')[fullSurahsInView().indexOf(n)];
    if (head) { head.classList.add('reading'); const r = head.getBoundingClientRect(); window.scrollTo({ top: r.top + scrollY - 90, behavior: RM ? 'auto' : 'smooth' }); }
    if (i >= 0) { saveLast(i); markAya(i); }
    qp.el.muted = false;
    qp.el.src = surahUrl(n);
    qp.el.play().catch((e) => { if (e && e.name === 'NotAllowedError') stop(); });
    setMedia(`سورة ${NAMES[n - 1]}`);
    paintMini();
  };
  /* متواصلة + الآية بتنوّر */
  const timedFail = (i, why) => {
    if (navigator.onLine === false) { stop(); toast('التلاوة محتاجة إنترنت، اتأكد إنك متصل'); return; }
    timedFailed[rid] = true;
    toast(`التلاوة المتواصلة مش متاحة دلوقتي، هتشتغل ${ER().mode === 'surah' ? 'بالسورة كاملة' : 'آية آية'}`);
    paintRecNote();
    if (qp.on) { qp.el.muted = false; playFrom(i); }
  };
  const playTimed = (i) => {
    const r = ER(), a = ayahs[i]; if (!a) return stop();
    const tok = ++qp.tok;
    const src = new URL(surahFile(r, a.s), location.href).href;
    const sameFile = qp.el.src === src && qp.surah === a.s && qp.tim;
    qp.surah = a.s;
    if (!sameFile) {
      qp.tim = null;
      qp.el.muted = a.k !== 1; // لو هنبدأ من نص السورة: نستنى التوقيت الأول
      qp.el.src = src;
    }
    // التشغيل لازم يبدأ مع الدوسة نفسها (الآيفون مش بيسمح غير كده)
    qp.el.play().catch((e) => { if (e && e.name === 'NotAllowedError') stop(); });
    lightIdx(i);
    getTiming(r.read, a.s).then((tim) => {
      if (tok !== qp.tok || !qp.on) return;
      qp.tim = tim;
      const startMs = a.k === 1 ? 0 : (tim.map[a.k] || [0])[0];
      const seek = () => {
        if (tok !== qp.tok) return;
        if (sameFile || a.k !== 1) { try { qp.el.currentTime = startMs / 1000; } catch {} }
        qp.el.muted = false;
      };
      if (qp.el.readyState >= 1) seek(); else qp.el.addEventListener('loadedmetadata', seek, { once: true });
    }).catch(() => { if (tok === qp.tok && qp.on) timedFail(i); });
  };
  const timedTick = () => {
    if (!qp.on || ER().mode !== 'timed' || !qp.tim || qp.el.muted || qp.carry || qp.resume) return;
    const ms = qp.el.currentTime * 1000;
    let k = 0;
    for (const [kk, st] of qp.tim.list) { if (st <= ms + 80) k = kk; else break; }
    // الصفحة أو الجزء خلص في نص السورة
    const lastK = viewLastK(qp.surah);
    if (lastK && lastK < COUNTS[qp.surah - 1] && qp.tim.map[lastK] && ms >= qp.tim.map[lastK][1] - 40) { finishView(); return; }
    if (k) { const i = idxOf(qp.surah, k); if (i !== undefined) lightIdx(i); }
  };
  /* في "اقرأ صفحة صفحة": لما الصفحة تخلص، الموقع بيقلب للصفحة اللي بعدها والشيخ مكمّل */
  const canTurn = () => !!(view && view.type === 'read' && view.t === 'p' && view.ctx === 'quran' && view.n < 604);
  const turnPage = () => {
    if (qp.carry || qp.resume) return;
    qp.carry = true; qp.resume = true;
    location.hash = readHash('quran', 'p', view.n + 1);
  };
  const resumeAfterTurn = () => {
    qp.resume = false;
    if (!qp.on) return;
    const mode = ER().mode;
    if (mode === 'timed' && ayahs[0] && ayahs[0].s === qp.surah && !qp.el.ended) {
      // نفس السورة مكمّلة: الصوت شغال زي ما هو، والآية هتنوّر لوحدها
      qp.idx = -1; timedTick(); return;
    }
    if (mode === 'surah') return stop();
    qp.idx = -1; playFrom(0);
  };
  const finishView = () => {
    if (qp.on && canTurn() && ER().mode !== 'surah') return turnPage(); stop(); const e = $('.q-end'); if (e) e.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'center' }); };

  const playFrom = (i) => {
    try { UI().stopAudio(); } catch {}
    i = Math.max(0, i);
    const mode = ER().mode;
    if (mode === 'timed') { qp.on = true; playTimed(i); return; }
    if (mode === 'surah') {
      const full = fullSurahsInView();
      let n = ayahs[i] ? ayahs[i].s : full[0];
      if (!full.includes(n)) {
        const nx = full.find((x) => x > n);
        if (!nx) { toast(`سورة ${NAMES[n - 1]} بتبدأ قبل الجزء ده. افتحها من فهرس السور عشان تسمعها كاملة`); return; }
        toast(`سورة ${NAMES[n - 1]} بتبدأ قبل الجزء ده، فالتلاوة هتبدأ من سورة ${NAMES[nx - 1]}`);
        n = nx;
      } else if (ayahs[i] && ayahs[i].k > 1) toast(`${ER().full} بيقرأ السورة من أولها`);
      qp.on = true; playSurah(n); return;
    }
    qp.on = true; qp.idx = i; playIdx(); unlockNext();
  };
  const stop = () => { qp.on = false; qp.tok++; try { qp.el.pause(); } catch {} try { qp.next.pause(); } catch {} qp.el.muted = false; qp.next.muted = false; qp.idx = -1; clearReading(); paintMini(); };
  // نفس الأحداث على المشغّلين، بس اللي شغال دلوقتي بس هو اللي بيتسمع له
  const onBoth = (ev, fn) => [qp.el, qp.next].forEach((au) => au.addEventListener(ev, (e) => { if (e.target === qp.el) fn(e); }));
  onBoth('ended', () => {
    if (!qp.on) return;
    const mode = ER().mode;
    if (mode === 'timed') {
      const nx = nextSurahInView(qp.surah);
      if (nx) { const i = idxOf(nx, ayahs.find((a) => a.s === nx).k); if (i !== undefined) return playTimed(i); }
    } else if (mode === 'surah') {
      const full = fullSurahsInView(), nx = full.find((x) => x > qp.surah);
      if (nx) return playSurah(nx);
    } else return nextAyah();
    finishView();
  });
  onBoth('error', () => {
    if (!qp.on) return;
    if (ER().mode === 'timed') {
      const i = Math.max(0, qp.idx);
      if (!viaSite[rid] && navigator.onLine !== false) { viaSite[rid] = true; qp.tim = null; qp.surah = 0; qp.idx = -1; return playTimed(i); }
      return timedFail(i);
    }
    stop();
    toast(navigator.onLine === false ? 'التلاوة محتاجة إنترنت، اتأكد إنك متصل' : `تلاوة ${ER().full} مش متاحة دلوقتي، جرّب قارئ تاني`);
  });
  onBoth('play', paintMini);
  onBoth('pause', () => { if (qp.on) paintMini(); });
  onBoth('loadedmetadata', () => { if (qp.on && ER().mode === 'surah') paintMini(); });
  onBoth('timeupdate', () => {
    if (!qp.on) return;
    if (ER().mode === 'timed') return timedTick();
    if (ER().mode !== 'surah') return;
    const t = $('#qTime'); if (t) t.textContent = `${mmss(qp.el.currentTime)}${qp.el.duration ? ' / ' + mmss(qp.el.duration) : ''}`;
  });

  document.addEventListener('click', (e) => {
    if (!view || view.type !== 'read') return;
    if (e.target.closest('#qListen')) {
      if (qp.on) return stop();
      const pos = getPos();
      let i = 0;
      if (pos) { const k = ayahs.findIndex((a) => a.g === pos.g); if (k > 0) i = k; }
      return playFrom(i);
    }
    const a = e.target.closest('.aya');
    if (a && $('#mushaf').contains(a)) {
      if (qp.on && ER().mode !== 'surah') { playFrom(+a.dataset.i); return; }
      selectAya(+a.dataset.i);
    }
  });

  /* ---------- حجم الخط ---------- */
  let qfs = ls.get('quran:fs', 1.75);
  const applyFs = () => document.documentElement.style.setProperty('--qfs', qfs + 'rem');
  applyFs();

  /* ---------- الإطار ---------- */
  const ensureShell = () => {
    const sec = $('#quran');
    if (sec.dataset.ready) return;
    sec.dataset.ready = '1';
    sec.innerHTML = `
      <div class="bar" id="qBarTop"><div class="wrap bar-row" style="max-width:1180px">
        <button class="back" type="button" id="qBack" aria-label="رجوع">${ICON.back}<span>رجوع</span></button>
        <h1 id="qTitle" style="opacity:1">القرآن الكريم</h1>
        <span class="q-pg" id="qPage" hidden></span>
        <button class="icon-btn" type="button" id="qHome" aria-label="الصفحة الرئيسية">${ICON.home}</button>
        <button class="icon-btn" type="button" id="qSmaller" aria-label="تصغير الخط"><span class="aa sm">أ-</span></button>
        <button class="icon-btn" type="button" id="qBigger" aria-label="تكبير الخط"><span class="aa">أ+</span></button>
      </div></div>
      <div class="wrap" id="quranBody"></div>
      <div class="q-bar" id="qBar" role="region" aria-label="التلاوة"></div>`;
    $('#qBack').onclick = () => {
      if (isDuas()) location.hash = '#/';
      else if (view && view.type === 'read') location.hash = view.ctx === 'quran' ? '#/quran' : '#/khatma';
      else location.hash = '#/';
    };
    $('#qHome').onclick = () => { location.hash = '#/'; };
    $('#qBigger').onclick = () => { qfs = Math.min(3, +(qfs + 0.125).toFixed(3)); applyFs(); ls.set('quran:fs', qfs); };
    $('#qSmaller').onclick = () => { qfs = Math.max(1.2, +(qfs - 0.125).toFixed(3)); applyFs(); ls.set('quran:fs', qfs); };
  };

  let from = 'quran';
  window.QuranApp = {
    show(path) {
      ensureShell();
      $('#quran').hidden = false;
      document.body.dataset.sec = 'quran';
      const p = path.split('/'); // quran/j|s|p/n/g  أو  khatma/grp/j|h/n/g
      let ctx = 'quran', t = p[1], n = parseInt(p[2], 10), g = parseInt(p[3], 10) || null;
      if (p[0] === 'khatma' && p.length >= 4 && p[1] === 'grp') {
        ctx = 'khatma-grp'; t = p[2]; n = parseInt(p[3], 10); g = parseInt(p[4], 10) || null;
        if (t !== 'j' && t !== 'h') t = 'x';
      } else if (t === 'h') t = 'x';
      const same = view && view.type === 'read' && view.t === t && view.n === n && view.ctx === ctx;
      const carry = qp.carry; qp.carry = false;
      if (!same && !(carry && t === 'p')) { qp.resume = false; stop(); clearSel(); hideBar(); }
      if (path === 'duas') {
        if (!isDuas()) { stop(); clearSel(); hideBar(); }
        from = 'duas';
        document.title = 'أدعية من القرآن — ختمة جماعية';
        renderDuas(); return;
      }
      if (path === 'khatma') {
        from = 'khatma'; stop(); clearSel(); hideBar();
        document.title = 'الختمة الجماعية للقرآن الكريم';
        renderKhatma(); window.scrollTo(0, 0); return;
      }
      if ((t === 'j' && n >= 1 && n <= 30) || (t === 'h' && n >= 1 && n <= 60) || (t === 's' && n >= 1 && n <= 114) || (t === 'p' && ctx === 'quran' && n >= 1 && n <= 604)) {
        if (same && g) { const i = ayahs.findIndex((a) => a.g === g); if (i >= 0) scrollToAya(i, 'auto'); return; }
        document.title = `${t === 'j' ? `الجزء ${AR(n)}` : t === 'h' ? `الحزب ${AR(n)}` : t === 'p' ? `صفحة ${AR(n)}` : `سورة ${NAMES[n - 1]}`} — ${ctx === 'quran' ? 'القرآن الكريم' : 'الختمة الجماعية'}`;
        if (ctx !== 'quran') grpLoad();
        renderReader(t, n, g, ctx);
      } else {
        from = 'quran';
        document.title = 'القرآن الكريم — ختمة جماعية';
        renderHub(); window.scrollTo(0, 0);
      }
    },
    hide() {
      const sec = $('#quran'); if (!sec || sec.hidden) return;
      stop(); clearSel(); hideBar(); closeSheet();
      sec.hidden = true; view = null;
    },
    stopAudio: () => stop(),
    status() {
      const last = ls.get('quran:last', null);
      return { last: last ? `سورة ${NAMES[last.s - 1]}` : '', grp: grp.state, grpErr: grp.err, loaded: grp.loaded, mine: grp.state ? grp.state.parts.filter(isMine).length : 0 };
    },
    loadKhatma: () => grpLoad(),
  };
})();
