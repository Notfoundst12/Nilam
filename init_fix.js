// ============================================================
//  INIT
// ============================================================
makeUI();

let BOOKS = [];
const LIB_LOADED = (async () => {
  log('Memuat turun perpustakaan (1000+ buku)...');
  try {
    const r = await fetch(LIB_URL);
    if(!r.ok) throw new Error('HTTP ' + r.status);
    BOOKS = await r.json();
    log(`${BOOKS.length} buku dari perpustakaan dimuatkan.`);
  } catch(e) {
    err('Gagal muat perpustakaan awam: ' + e.message);
  }

  if (Array.isArray(INJECTED_BOOKS) && INJECTED_BOOKS.length > 0) {
    const titles = new Set(BOOKS.map(b => b.title.toLowerCase()));
    let added = 0;
    INJECTED_BOOKS.forEach(b => {
      if (!titles.has(b.title.toLowerCase())) {
        BOOKS.push(b);
        added++;
      }
    });
    log(`${added} buku dari CSV ditambah.`);
  }
  updateInfo();
})();
