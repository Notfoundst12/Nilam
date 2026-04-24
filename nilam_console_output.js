// NILAM Auto-Fill v2.0 - Console DevTools Script
// Paste skrip ini di Console pada halaman AINS (sudah login)
// Skrip akan mengisi semua buku secara automatik.
(async () => {
  // __BOOKS_PLACEHOLDER__
  const BOOKS = [
  {
    "title": "Sang Kancil dan Buaya",
    "author": "Pak Pandir",
    "publisher": "Pustaka Rakyat",
    "year": "2020",
    "pages": "24",
    "categoryLabel": "Fiksyen",
    "languageLabel": "Bahasa Melayu",
    "summary": "Kisah kancil yang cerdik menyeberangi sungai. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian.",
    "review": "Selepas membaca buku ini, saya menjalankan aktiviti Rumusan. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian."
  },
  {
    "title": "The Adventure of Sherlock Holmes",
    "author": "Arthur Conan Doyle",
    "publisher": "George Newnes",
    "year": "1892",
    "pages": "307",
    "categoryLabel": "Fiksyen",
    "languageLabel": "Bahasa Inggeris",
    "summary": "A detective solving crimes. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian.",
    "review": "Selepas membaca buku ini, saya menjalankan aktiviti Lain-lain. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian."
  },
  {
    "title": "Sejarah Malaysia",
    "author": "Ahmad Bin Ali",
    "publisher": "Dewan Bahasa dan Pustaka",
    "year": "2015",
    "pages": "150",
    "categoryLabel": "Bukan Fiksyen",
    "languageLabel": "Bahasa Melayu",
    "summary": "Sejarah pembentukan Malaysia. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian.",
    "review": "Selepas membaca buku ini, saya menjalankan aktiviti Bercerita. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian."
  },
  {
    "title": "Misteri Pulau Harapan",
    "author": "Azman Ismail",
    "publisher": "Pustaka Ilmu",
    "year": "2023",
    "pages": "120",
    "categoryLabel": "Fiksyen",
    "languageLabel": "Bahasa Melayu",
    "summary": "Kisah sekumpulan remaja yang menemui rahsia di sebuah pulau terpencil yang penuh misteri. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian.",
    "review": "Selepas membaca buku ini, saya menjalankan aktiviti Rumusan. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian."
  },
  {
    "title": "Misteri Hutan Belantara",
    "author": "Siti Nurhaliza",
    "publisher": "Penerbit Muzik",
    "year": "2024",
    "pages": "150",
    "categoryLabel": "Fiksyen",
    "languageLabel": "Bahasa Melayu",
    "summary": "Kisah pengembaraan seorang penyanyi di dalam hutan belantara yang penuh dengan cabaran dan rahsia alam. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian.",
    "review": "Selepas membaca buku ini, saya menjalankan aktiviti Rumusan. Buku ini sangat bermanfaat dan memberi pengajaran yang baik untuk diamalkan dalam kehidupan harian."
  }
];

  const WAIT = { tick: 400, step: 1500, page: 3500, save: 3000 };
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  // --- Logging ---
  const _log = (msg, color) => {
    console.log(`%c[NILAM] ${msg}`, `color:${color};font-weight:bold`);
    panelLog(msg);
  };
  const log = (m) => _log(m, '#4CAF50');
  const warn = (m) => _log(m, '#FF9800');
  const fail = (m) => _log(m, '#f44336');

  // --- UI Panel ---
  function createPanel() {
    if (document.getElementById('nilam-panel')) return;
    const d = document.createElement('div');
    d.id = 'nilam-panel';
    d.style.cssText =
      'position:fixed;top:10px;right:10px;width:360px;background:#16213e;color:#fff;' +
      'border-radius:12px;padding:16px;z-index:999999;font-family:system-ui,sans-serif;' +
      'box-shadow:0 8px 32px rgba(0,0,0,0.4);max-height:90vh;overflow:hidden';
    d.innerHTML =
      '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px">' +
      '<b style="font-size:15px">NILAM Auto-Fill</b>' +
      '<span id="np-status" style="font-size:11px;background:#0f3460;padding:3px 10px;border-radius:20px">Sedia</span></div>' +
      '<div style="background:#0f3460;border-radius:6px;height:6px;margin-bottom:10px">' +
      '<div id="np-bar" style="background:linear-gradient(90deg,#e94560,#533483);height:100%;width:0%;border-radius:6px;transition:width .4s"></div></div>' +
      '<div id="np-log" style="font-size:11px;max-height:250px;overflow-y:auto;color:#a8a8b3;line-height:1.6"></div>' +
      '<div id="np-sum" style="margin-top:10px;font-size:13px;text-align:center"></div>';
    document.body.appendChild(d);
  }

  function panelLog(msg) {
    const el = document.getElementById('np-log');
    if (!el) return;
    el.innerHTML += `<div style="border-bottom:1px solid #1a1a3e;padding:2px 0">${msg}</div>`;
    el.scrollTop = el.scrollHeight;
  }

  function setProgress(cur, total) {
    const bar = document.getElementById('np-bar');
    const st = document.getElementById('np-status');
    if (bar) bar.style.width = `${((cur + 1) / total) * 100}%`;
    if (st) st.textContent = `${cur + 1} / ${total}`;
  }

  function showDone(results) {
    const el = document.getElementById('np-sum');
    if (!el) return;
    const ok = results.filter((r) => r.ok).length;
    el.innerHTML =
      `<span style="color:#4CAF50">&#10003; ${ok} berjaya</span>` +
      ` &nbsp;|&nbsp; <span style="color:#e94560">&#10007; ${results.length - ok} perlu semak</span>`;
    const st = document.getElementById('np-status');
    if (st) { st.textContent = 'Selesai'; st.style.background = '#4CAF50'; }
  }

  // --- Session persistence (survives page reload) ---
  const STATE_KEY = '__nilam_state__';

  function loadState() {
    try { return JSON.parse(sessionStorage.getItem(STATE_KEY)); } catch { return null; }
  }

  function saveState(idx, results) {
    sessionStorage.setItem(STATE_KEY, JSON.stringify({ idx, results, ts: Date.now() }));
  }

  function clearState() {
    sessionStorage.removeItem(STATE_KEY);
  }

  // --- Element discovery (robust, multi-strategy) ---

  function visible(el) {
    return el && (el.offsetParent !== null || el.offsetWidth > 0 || el.offsetHeight > 0);
  }

  function findByLabel(labelText) {
    const lower = labelText.toLowerCase();

    for (const label of document.querySelectorAll('label')) {
      const t = label.textContent.replace(/\*/g, '').trim().toLowerCase();
      if (!t.includes(lower)) continue;
      if (label.htmlFor) {
        const el = document.getElementById(label.htmlFor);
        if (el && visible(el)) return el;
      }
      let p = label.parentElement;
      for (let d = 0; d < 5 && p; d++) {
        for (const sel of ['input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])', 'select', 'textarea']) {
          const el = p.querySelector(sel);
          if (el && visible(el)) return el;
        }
        p = p.parentElement;
      }
    }

    for (const node of document.querySelectorAll('span, div, p, td, th, h1, h2, h3, h4, h5, h6')) {
      const raw = node.textContent.replace(/\*/g, '').trim();
      if (raw.length > 60 || raw.length < 2) continue;
      if (!raw.toLowerCase().includes(lower)) continue;
      if (node.querySelector && node.querySelector('span, div, p')) {
        const childText = Array.from(node.childNodes)
          .filter((n) => n.nodeType === 3)
          .map((n) => n.textContent.trim())
          .join('');
        if (!childText.toLowerCase().includes(lower)) continue;
      }
      let p = node.parentElement;
      for (let d = 0; d < 5 && p; d++) {
        for (const sel of ['input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])', 'select', 'textarea']) {
          const el = p.querySelector(sel);
          if (el && visible(el)) return el;
        }
        p = p.parentElement;
      }
    }

    return null;
  }

  function allInputs() {
    return Array.from(document.querySelectorAll('input:not([type="hidden"]):not([type="checkbox"]):not([type="radio"])')).filter(visible);
  }
  function allSelects() {
    return Array.from(document.querySelectorAll('select')).filter(visible);
  }
  function allTextareas() {
    return Array.from(document.querySelectorAll('textarea')).filter(visible);
  }

  // --- Value setting (Vue/React compatible) ---

  function setVal(el, value) {
    if (!el) return false;
    try { el.focus(); } catch (_) {}
    const v = String(value);
    const proto =
      el instanceof HTMLTextAreaElement
        ? HTMLTextAreaElement.prototype
        : el instanceof HTMLSelectElement
          ? HTMLSelectElement.prototype
          : HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto, 'value');
    if (setter && setter.set) setter.set.call(el, v);
    else el.value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
    try { el.blur(); } catch (_) {}
    return true;
  }

  function setSelect(el, text) {
    if (!el || el.tagName !== 'SELECT') return false;
    const lower = text.toLowerCase();
    for (const o of el.options) {
      if (o.text.toLowerCase().includes(lower) || o.value.toLowerCase().includes(lower)) {
        el.value = o.value;
        el.dispatchEvent(new Event('change', { bubbles: true }));
        el.dispatchEvent(new Event('input', { bubbles: true }));
        return true;
      }
    }
    return false;
  }

  function clickBtn(text, scope) {
    const lower = text.toLowerCase();
    const root = scope || document;
    for (const el of root.querySelectorAll('button, a, [role="button"], .btn, span, label')) {
      if (!visible(el)) continue;
      const t = (el.innerText || el.textContent || '').trim();
      if (t.length > 60) continue;
      if (t.toLowerCase().includes(lower)) {
        el.scrollIntoView({ block: 'center', behavior: 'instant' });
        el.click();
        return true;
      }
    }
    return false;
  }

  async function waitFor(fn, ms) {
    const end = Date.now() + (ms || 12000);
    while (Date.now() < end) {
      const r = fn();
      if (r) return r;
      await sleep(WAIT.tick);
    }
    return null;
  }

  function swalText() {
    const el = document.querySelector('.swal2-html-container, .swal2-title, .swal2-content');
    return el ? el.textContent.trim() : '';
  }
  function swalClose() {
    const b = document.querySelector('.swal2-confirm, .swal2-close');
    if (b) { b.click(); return true; }
    return false;
  }

  // --- Custom dropdown handler (for vue-select / custom components) ---
  async function handleCustomDropdown(labelText, optionText) {
    const lower = optionText.toLowerCase();

    const toggles = document.querySelectorAll(
      '.vs__dropdown-toggle, [class*="v-select"] [class*="toggle"], [role="combobox"], [class*="dropdown-toggle"]'
    );
    for (const toggle of toggles) {
      const container = toggle.closest('[class*="col"], [class*="form-group"], .field, div');
      if (!container) continue;
      const labelEl = container.querySelector('label, span, div');
      if (!labelEl) continue;
      const lt = labelEl.textContent.replace(/\*/g, '').trim().toLowerCase();
      if (!lt.includes(labelText.toLowerCase())) continue;

      toggle.click();
      await sleep(500);

      for (const opt of document.querySelectorAll(
        '.vs__dropdown-option, [role="option"], .dropdown-item, li'
      )) {
        if ((opt.innerText || opt.textContent || '').trim().toLowerCase().includes(lower)) {
          opt.click();
          await sleep(300);
          return true;
        }
      }
    }
    return false;
  }

  // --- Fill a single field with fallbacks ---
  async function fillField(label, value, altLabels) {
    let el = findByLabel(label);
    if (!el && altLabels) {
      for (const alt of altLabels) {
        el = findByLabel(alt);
        if (el) break;
      }
    }
    if (el) {
      if (el.tagName === 'SELECT') {
        if (setSelect(el, value)) {
          log(`  ${label}: ${value}`);
          return true;
        }
      } else {
        if (setVal(el, value)) {
          log(`  ${label}: ${value}`);
          return true;
        }
      }
    }
    warn(`  ${label}: TIDAK DIJUMPAI`);
    return false;
  }

  // --- Handle dropdown (native select or custom) ---
  async function fillDropdown(label, value, fallbackIdx) {
    const el = findByLabel(label);
    if (el && el.tagName === 'SELECT') {
      if (setSelect(el, value)) {
        log(`  ${label}: ${value}`);
        return true;
      }
    }
    if (await handleCustomDropdown(label, value)) {
      log(`  ${label}: ${value} (custom)`);
      return true;
    }
    const selects = allSelects();
    if (typeof fallbackIdx === 'number' && selects[fallbackIdx]) {
      if (setSelect(selects[fallbackIdx], value)) {
        log(`  ${label}: ${value} (fallback #${fallbackIdx})`);
        return true;
      }
    }
    warn(`  ${label}: TIDAK DIJUMPAI`);
    return false;
  }

  // --- Star rating ---
  function clickStars(n) {
    const containers = document.querySelectorAll('[class*="star"], [class*="rating"], [class*="Star"], [class*="Rating"]');
    for (const c of containers) {
      const items = c.querySelectorAll('svg, i, span, label, div');
      if (items.length >= n) {
        items[n - 1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
        items[n - 1].click();
        return true;
      }
    }
    const allSvg = document.querySelectorAll('svg');
    const starSvgs = Array.from(allSvg).filter((s) => {
      const parent = s.parentElement;
      return parent && /star|rating/i.test(parent.className || '');
    });
    if (starSvgs.length >= n) {
      starSvgs[n - 1].dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return true;
    }
    return false;
  }

  // --- Navigate to add book form ---
  async function ensureOnForm() {
    const path = location.pathname;

    if (path.includes('/record/add/book')) {
      await sleep(WAIT.tick);
      return true;
    }

    if (path === '/' || path === '' || path.includes('/dashboard') || path.includes('/home')) {
      log('Di dashboard, navigasi ke borang...');
      if (!clickBtn('mula masukkan')) {
        const plus = document.querySelector('a[href*="/record"], [href*="/add"], .fab, [class*="add"]');
        if (plus) plus.click();
        else location.href = '/record/add';
      }
      await sleep(WAIT.page);
    }

    if (location.pathname.includes('/record/add') && !location.pathname.includes('/book')) {
      await sleep(WAIT.step);
      clickBtn('buku');
      await sleep(WAIT.tick * 2);
      clickBtn('seterusnya');
      await sleep(WAIT.page);
    }

    if (!location.pathname.includes('/record/add/book')) {
      location.href = '/record/add/book';
      await sleep(WAIT.page);
    }

    return location.pathname.includes('/record/add/book');
  }

  // --- Fill one book ---
  async function processBook(book, idx, total) {
    setProgress(idx, total);
    log(`--- Buku ${idx + 1}/${total}: ${book.title} ---`);

    await ensureOnForm();

    const ready = await waitFor(() => {
      const inputs = allInputs();
      return inputs.length >= 3 ? inputs : null;
    }, 15000);

    if (!ready) {
      fail('Borang tidak dimuatkan! Cuba refresh halaman dan paste skrip semula.');
      return { ok: false, title: book.title, note: 'Borang tidak dimuatkan' };
    }

    await sleep(WAIT.tick);
    swalClose();

    // ===== STEP 1: MAKLUMAT BUKU =====
    log('Step 1: Maklumat Buku');

    await fillField('tajuk', book.title, ['title']);
    await sleep(WAIT.tick);

    clickBtn('e-buku');
    log('  Jenis: E-Buku');
    await sleep(WAIT.tick);

    await fillDropdown('kategori', book.categoryLabel, 0);
    await sleep(WAIT.tick);

    await fillField('mukasurat', book.pages, ['bilangan', 'page', 'muka']);
    await sleep(WAIT.tick);

    await fillField('penulis', book.author, ['pengarang', 'author']);
    await sleep(WAIT.tick);

    await fillField('penerbit', book.publisher, ['publisher']);
    await sleep(WAIT.tick);

    await fillField('tahun', book.year, ['terbitan', 'year']);
    await sleep(WAIT.tick);

    await fillDropdown('bahasa', book.languageLabel, 1);
    await sleep(WAIT.tick);

    log('Klik Seterusnya...');
    if (!clickBtn('seterusnya')) {
      warn('Butang Seterusnya tidak dijumpai');
    }
    await sleep(WAIT.step);

    // ===== STEP 2: RUMUSAN & PENGAJARAN =====
    log('Step 2: Rumusan & Pengajaran');

    await waitFor(() => allTextareas().length > 0, 10000);
    await sleep(WAIT.tick);

    const tas = allTextareas();
    if (tas.length >= 1) {
      setVal(tas[0], book.summary);
      log(`  Rumusan: ${book.summary.substring(0, 40)}...`);
    } else {
      warn('  Rumusan textarea tidak dijumpai');
    }
    await sleep(WAIT.tick);

    if (tas.length >= 2) {
      setVal(tas[1], book.review);
      log(`  Pengajaran: ${book.review.substring(0, 40)}...`);
    } else {
      const pengajaran = findByLabel('pengajaran');
      if (pengajaran) {
        setVal(pengajaran, book.review);
        log(`  Pengajaran: ${book.review.substring(0, 40)}...`);
      } else {
        warn('  Pengajaran textarea tidak dijumpai');
      }
    }
    await sleep(WAIT.tick);

    if (clickStars(5)) {
      log('  Rating: 5 bintang');
    } else {
      warn('  Rating tidak dijumpai');
    }
    await sleep(WAIT.tick);

    log('Klik Seterusnya...');
    clickBtn('seterusnya');
    await sleep(WAIT.step);

    // ===== STEP 3+: Handle remaining steps =====
    for (let attempt = 0; attempt < 4; attempt++) {
      await sleep(WAIT.tick * 2);

      const sw = swalText();
      if (/berjaya|success|disimpan|tahniah/i.test(sw)) {
        log('BERJAYA!');
        swalClose();
        return { ok: true, title: book.title, note: sw };
      }
      if (/gagal|error|ralat|fail/i.test(sw)) {
        fail(`GAGAL: ${sw}`);
        swalClose();
        return { ok: false, title: book.title, note: sw };
      }

      if (clickBtn('simpan') || clickBtn('hantar') || clickBtn('submit') || clickBtn('selesai')) {
        log('  Klik simpan/hantar...');
        await sleep(WAIT.save);
        continue;
      }

      if (clickBtn('seterusnya')) {
        log('  Klik Seterusnya...');
        await sleep(WAIT.step);
        continue;
      }

      break;
    }

    await sleep(WAIT.tick * 2);
    const finalSw = swalText();
    if (/berjaya|success|disimpan|tahniah/i.test(finalSw)) {
      log('BERJAYA!');
      swalClose();
      return { ok: true, title: book.title, note: finalSw };
    }

    swalClose();
    return { ok: false, title: book.title, note: finalSw || 'Tiada maklumbalas' };
  }

  // ===== MAIN =====
  createPanel();

  let prev = loadState();
  let startIdx = 0;
  let results = [];

  if (prev && prev.idx > 0 && prev.idx < BOOKS.length) {
    log(`Menyambung dari buku #${prev.idx + 1} (${prev.idx} sudah selesai)`);
    startIdx = prev.idx;
    results = prev.results || [];
  } else {
    clearState();
    log(`Memulakan automasi untuk ${BOOKS.length} buku...`);
  }

  for (let i = startIdx; i < BOOKS.length; i++) {
    const result = await processBook(BOOKS[i], i, BOOKS.length);
    results.push(result);

    saveState(i + 1, results);

    if (i < BOOKS.length - 1) {
      log('Navigasi untuk buku seterusnya...');
      await sleep(WAIT.step);

      if (!clickBtn('tambah lagi') && !clickBtn('tambah rekod') && !clickBtn('rekod baru')) {
        try {
          const appEl = document.querySelector('#app');
          const router =
            appEl?.__vue_app__?.config?.globalProperties?.$router ||
            appEl?.__vue__?.$router;
          if (router) {
            router.push('/record/add/book');
          } else {
            location.href = '/record/add/book';
          }
        } catch (_) {
          location.href = '/record/add/book';
        }
      }
      await sleep(WAIT.page);
    }
  }

  // ===== SELESAI =====
  setProgress(BOOKS.length - 1, BOOKS.length);
  clearState();
  log('=== AUTOMASI SELESAI ===');
  showDone(results);
  console.table(
    results.map((r, i) => ({
      No: i + 1,
      Tajuk: r.title,
      Status: r.ok ? 'BERJAYA' : 'SEMAK',
      Nota: r.note || '',
    }))
  );
  return results;
})();
