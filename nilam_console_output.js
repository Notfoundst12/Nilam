// NILAM Auto-Fill v3.0 - Console DevTools Script
// Fetch & paste sahaja. Semua buku sudah tersedia.
(async () => {

  // ============================================================
  //  LIBRARY BUKU (Auto-generated, format siap)
  // ============================================================
  const BOOKS = [
    {
      title: "Sang Kancil dan Buaya",
      author: "Pak Pandir",
      publisher: "Pustaka Rakyat",
      year: "2020",
      pages: "24",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Kisah kancil yang cerdik berjaya menyeberangi sungai dengan menipu buaya supaya berbaris menjadi jambatan. Cerita ini mengajar kita tentang kepentingan menggunakan akal fikiran dalam menghadapi cabaran hidup.",
      review: "Selepas membaca buku ini saya belajar bahawa kecerdikan dan kebijaksanaan lebih penting daripada kekuatan fizikal semata-mata dalam menyelesaikan masalah kehidupan seharian."
    },
    {
      title: "The Adventure of Sherlock Holmes",
      author: "Arthur Conan Doyle",
      publisher: "George Newnes",
      year: "1892",
      pages: "307",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Inggeris",
      summary: "A collection of twelve detective stories featuring the famous Sherlock Holmes and his companion Dr Watson as they solve mysterious crimes across Victorian London using brilliant deductive reasoning.",
      review: "After reading this book I learned the importance of observation and logical thinking in solving problems and that every detail no matter how small can be significant in understanding the truth."
    },
    {
      title: "Sejarah Pembentukan Malaysia",
      author: "Ahmad Bin Ali",
      publisher: "Dewan Bahasa dan Pustaka",
      year: "2015",
      pages: "150",
      categoryLabel: "Bukan Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Buku ini mengisahkan perjalanan sejarah pembentukan Malaysia dari zaman Kesultanan Melayu Melaka sehingga kemerdekaan dan penubuhan Malaysia pada tahun 1963 dengan penuh fakta yang menarik.",
      review: "Selepas membaca buku ini saya lebih menghargai pengorbanan para pejuang kemerdekaan dan memahami betapa pentingnya perpaduan kaum dalam membina sebuah negara yang aman dan makmur."
    },
    {
      title: "Misteri Pulau Harapan",
      author: "Azman Ismail",
      publisher: "Pustaka Ilmu",
      year: "2023",
      pages: "120",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Kisah sekumpulan remaja yang menemui rahsia di sebuah pulau terpencil yang penuh misteri dan terpaksa menggunakan keberanian serta kebijaksanaan untuk menyelamatkan diri daripada bahaya yang mengancam.",
      review: "Selepas membaca buku ini saya belajar tentang kepentingan kerja berpasukan dan keberanian dalam menghadapi situasi yang mencabar serta tidak mudah berputus asa dalam hidup."
    },
    {
      title: "Misteri Hutan Belantara",
      author: "Siti Nurhaliza Ahmad",
      publisher: "Penerbit Fajar",
      year: "2024",
      pages: "150",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Kisah pengembaraan seorang remaja bernama Aiman di dalam hutan belantara yang penuh dengan cabaran dan rahsia alam semula jadi yang menakjubkan dan mengajarkan erti ketabahan hati.",
      review: "Selepas membaca buku ini saya memahami bahawa alam semula jadi perlu dijaga dan dipelihara kerana ia merupakan anugerah yang sangat berharga untuk generasi akan datang."
    },
    {
      title: "Charlotte's Web",
      author: "E.B. White",
      publisher: "Harper and Brothers",
      year: "1952",
      pages: "184",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Inggeris",
      summary: "The story of a young pig named Wilbur who befriends a clever spider named Charlotte that saves his life by writing words in her web praising the pig and proving that friendship transcends all boundaries.",
      review: "After reading this book I learned that true friendship means being willing to sacrifice for those we care about and that even the smallest creatures can make the biggest difference in our lives."
    },
    {
      title: "Sains dan Teknologi Masa Kini",
      author: "Dr Aminah Yusof",
      publisher: "Penerbit Universiti Malaya",
      year: "2021",
      pages: "180",
      categoryLabel: "Bukan Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Buku ini membincangkan perkembangan sains dan teknologi terkini termasuk kecerdasan buatan robotik dan tenaga boleh baharu yang memberi kesan besar kepada kehidupan manusia di seluruh dunia.",
      review: "Selepas membaca buku ini saya lebih memahami kepentingan sains dan teknologi dalam kehidupan seharian dan bersemangat untuk terus mendalami bidang STEM demi masa depan yang lebih cerah."
    },
    {
      title: "The Little Prince",
      author: "Antoine de Saint-Exupery",
      publisher: "Reynal and Hitchcock",
      year: "1943",
      pages: "96",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Inggeris",
      summary: "A poetic tale about a young prince who travels from planet to planet learning about life love and human nature from the various characters he meets along his extraordinary journey through the universe.",
      review: "After reading this book I understood that the most important things in life are invisible to the eye and that we must look with our hearts to truly see what matters most."
    },
    {
      title: "Hikayat Hang Tuah",
      author: "Tun Sri Lanang",
      publisher: "Dewan Bahasa dan Pustaka",
      year: "2010",
      pages: "280",
      categoryLabel: "Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Hikayat yang mengisahkan kepahlawanan Hang Tuah dan sahabatnya dalam mempertahankan kerajaan Melayu Melaka serta nilai kesetiaan dan keberanian yang menjadi teras budaya Melayu sejak zaman dahulu.",
      review: "Selepas membaca buku ini saya kagum dengan semangat kesetiaan dan kepahlawanan Hang Tuah yang sanggup berkorban demi raja dan tanah air serta mengajarkan nilai patriotisme kepada generasi muda."
    },
    {
      title: "Panduan Kewangan Pelajar",
      author: "Mohd Rizal Hassan",
      publisher: "PTS Media Group",
      year: "2022",
      pages: "95",
      categoryLabel: "Bukan Fiksyen",
      languageLabel: "Bahasa Melayu",
      summary: "Buku panduan yang mengajar pelajar tentang pengurusan kewangan asas termasuk cara menyimpan wang membuat bajet dan memahami nilai wang sejak usia muda untuk masa depan yang lebih terjamin.",
      review: "Selepas membaca buku ini saya mula menyimpan wang saku dan membuat perancangan kewangan yang lebih baik kerana memahami betapa pentingnya pengurusan wang yang bijak sejak awal lagi."
    }
  ];

  // ============================================================
  //  CONFIG
  // ============================================================
  const W = { t: 500, s: 1800, p: 4000, sv: 3500 };
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ============================================================
  //  LOGGING
  // ============================================================
  const _l = (m, c) => { console.log(`%c[NILAM] ${m}`, `color:${c};font-weight:bold`); pLog(m); };
  const log = m => _l(m, '#00e676');
  const wrn = m => _l(m, '#ffab00');
  const err = m => _l(m, '#ff1744');

  // ============================================================
  //  UI PANEL (Beautiful + Draggable)
  // ============================================================
  function makeUI() {
    if (document.getElementById('NP')) document.getElementById('NP').remove();
    const p = document.createElement('div');
    p.id = 'NP';
    p.innerHTML = `
    <style>
      #NP{position:fixed;top:20px;right:20px;width:380px;z-index:2147483647;font-family:'Segoe UI',system-ui,-apple-system,sans-serif}
      #NP *{box-sizing:border-box}
      #np-card{background:linear-gradient(135deg,#0f0c29,#302b63,#24243e);border-radius:16px;
        box-shadow:0 20px 60px rgba(0,0,0,.5),0 0 0 1px rgba(255,255,255,.08);
        overflow:hidden;backdrop-filter:blur(20px)}
      #np-head{padding:16px 20px;cursor:grab;user-select:none;display:flex;align-items:center;
        justify-content:space-between;border-bottom:1px solid rgba(255,255,255,.06)}
      #np-head:active{cursor:grabbing}
      #np-title{display:flex;align-items:center;gap:10px}
      #np-title b{color:#fff;font-size:15px;letter-spacing:.3px}
      #np-badge{font-size:10px;background:linear-gradient(135deg,#667eea,#764ba2);color:#fff;
        padding:3px 10px;border-radius:20px;font-weight:600;letter-spacing:.5px}
      #np-prog{margin:0 20px;padding:12px 0}
      #np-pbar{height:6px;background:rgba(255,255,255,.08);border-radius:99px;overflow:hidden}
      #np-pfill{height:100%;width:0%;background:linear-gradient(90deg,#667eea,#764ba2,#f093fb);
        border-radius:99px;transition:width .6s cubic-bezier(.4,0,.2,1)}
      #np-ptext{color:rgba(255,255,255,.5);font-size:11px;margin-top:6px;text-align:right}
      #np-log{padding:0 20px 16px;max-height:220px;overflow-y:auto;scrollbar-width:thin;
        scrollbar-color:rgba(255,255,255,.1) transparent}
      #np-log::-webkit-scrollbar{width:4px}
      #np-log::-webkit-scrollbar-track{background:transparent}
      #np-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:4px}
      .np-entry{padding:6px 0;border-bottom:1px solid rgba(255,255,255,.04);
        font-size:11.5px;color:rgba(255,255,255,.55);line-height:1.5;display:flex;gap:8px}
      .np-entry .np-time{color:rgba(255,255,255,.25);flex-shrink:0;font-size:10px;font-family:monospace}
      .np-ok{color:#69f0ae!important}.np-wrn{color:#ffd740!important}.np-err{color:#ff5252!important}
      .np-step{color:#b388ff!important;font-weight:600}
      #np-foot{padding:12px 20px;background:rgba(0,0,0,.2);border-top:1px solid rgba(255,255,255,.05);
        display:flex;justify-content:center;gap:16px;font-size:13px}
      .np-stat{display:flex;align-items:center;gap:5px;color:rgba(255,255,255,.6)}
      .np-dot{width:8px;height:8px;border-radius:50%;display:inline-block}
      #np-books{padding:8px 20px 12px;max-height:140px;overflow-y:auto;scrollbar-width:thin;
        scrollbar-color:rgba(255,255,255,.1) transparent}
      .np-book{display:flex;align-items:center;gap:8px;padding:5px 8px;border-radius:8px;
        font-size:11px;color:rgba(255,255,255,.45);margin-bottom:2px}
      .np-book.active{background:rgba(102,126,234,.15);color:#b388ff}
      .np-book.done{color:#69f0ae}.np-book.fail{color:#ff5252}
      .np-num{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;
        font-size:9px;font-weight:700;background:rgba(255,255,255,.06);flex-shrink:0}
      .np-book.active .np-num{background:rgba(102,126,234,.3)}
      .np-book.done .np-num{background:rgba(105,240,174,.15)}
      #np-min{background:none;border:none;color:rgba(255,255,255,.4);cursor:pointer;font-size:18px;
        padding:0 4px;line-height:1}
      #np-min:hover{color:#fff}
    </style>
    <div id="np-card">
      <div id="np-head">
        <div id="np-title"><b>NILAM Auto-Fill</b></div>
        <div style="display:flex;align-items:center;gap:8px">
          <span id="np-badge">v3.0</span>
          <button id="np-min" title="Minimize">&#x2212;</button>
        </div>
      </div>
      <div id="np-books"></div>
      <div id="np-prog">
        <div id="np-pbar"><div id="np-pfill"></div></div>
        <div id="np-ptext">Sedia...</div>
      </div>
      <div id="np-log"></div>
      <div id="np-foot">
        <span class="np-stat"><span class="np-dot" style="background:#69f0ae"></span><span id="np-ok">0</span> Berjaya</span>
        <span class="np-stat"><span class="np-dot" style="background:#ff5252"></span><span id="np-fail">0</span> Gagal</span>
      </div>
    </div>`;
    document.body.appendChild(p);

    // Draggable
    const head = document.getElementById('np-head');
    let dragging = false, ox, oy;
    head.addEventListener('mousedown', e => { dragging = true; const r = p.getBoundingClientRect(); ox = e.clientX - r.left; oy = e.clientY - r.top; });
    document.addEventListener('mousemove', e => { if (!dragging) return; p.style.left = (e.clientX - ox) + 'px'; p.style.top = (e.clientY - oy) + 'px'; p.style.right = 'auto'; });
    document.addEventListener('mouseup', () => { dragging = false; });

    // Minimize
    let mini = false;
    document.getElementById('np-min').onclick = () => {
      mini = !mini;
      for (const id of ['np-books','np-prog','np-log']) {
        const el = document.getElementById(id);
        if (el) el.style.display = mini ? 'none' : '';
      }
      document.getElementById('np-min').innerHTML = mini ? '&#x2b;' : '&#x2212;';
    };

    // Book list
    const bl = document.getElementById('np-books');
    BOOKS.forEach((b, i) => {
      bl.innerHTML += `<div class="np-book" id="np-b${i}"><span class="np-num">${i+1}</span>${b.title}</div>`;
    });
  }

  function pLog(msg) {
    const el = document.getElementById('np-log');
    if (!el) return;
    const t = new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const cls = /BERJAYA|OK/.test(msg)?'np-ok': /TIDAK|GAGAL|RALAT/.test(msg)?'np-err': /Step \d/.test(msg)?'np-step':'';
    el.innerHTML += `<div class="np-entry ${cls}"><span class="np-time">${t}</span><span>${msg}</span></div>`;
    el.scrollTop = el.scrollHeight;
  }

  function setBook(i, status) {
    const el = document.getElementById('np-b'+i);
    if (!el) return;
    el.className = 'np-book ' + status;
  }

  function setProg(cur, total) {
    const f = document.getElementById('np-pfill');
    const t = document.getElementById('np-ptext');
    if (f) f.style.width = `${((cur+1)/total)*100}%`;
    if (t) t.textContent = `Buku ${cur+1} daripada ${total}`;
  }

  function setStats(ok, fail) {
    const o = document.getElementById('np-ok');
    const f = document.getElementById('np-fail');
    if (o) o.textContent = ok;
    if (f) f.textContent = fail;
  }

  // ============================================================
  //  STATE (survives page reload)
  // ============================================================
  const SK = '__nilam3__';
  const loadSt = () => { try { return JSON.parse(sessionStorage.getItem(SK)); } catch { return null; } };
  const saveSt = (i, r) => sessionStorage.setItem(SK, JSON.stringify({i,r}));
  const clearSt = () => sessionStorage.removeItem(SK);

  // ============================================================
  //  DOM HELPERS
  // ============================================================
  const vis = el => el && (el.offsetParent!==null||el.offsetWidth>0||el.offsetHeight>0);

  function findLabel(text) {
    const lo = text.toLowerCase();
    for (const lb of document.querySelectorAll('label')) {
      const t = lb.textContent.replace(/\*/g,'').trim().toLowerCase();
      if (!t.includes(lo)) continue;
      if (lb.htmlFor) { const e = document.getElementById(lb.htmlFor); if (e&&vis(e)) return e; }
      let p = lb.parentElement;
      for (let d=0;d<6&&p;d++) {
        const e = p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');
        if (e&&vis(e)) return e;
        p = p.parentElement;
      }
    }
    for (const n of document.querySelectorAll('span,div,p,td,th')) {
      const t = n.textContent.replace(/\*/g,'').trim();
      if (t.length>50||t.length<2||!t.toLowerCase().includes(lo)) continue;
      let p = n.parentElement;
      for (let d=0;d<6&&p;d++) {
        const e = p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');
        if (e&&vis(e)) return e;
        p = p.parentElement;
      }
    }
    return null;
  }

  const aInp = () => [...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])')].filter(vis);
  const aSel = () => [...document.querySelectorAll('select')].filter(vis);
  const aTxt = () => [...document.querySelectorAll('textarea')].filter(vis);

  // ============================================================
  //  VALUE SETTERS (Vue-compatible)
  // ============================================================
  function setVal(el, v) {
    if (!el) return false;
    try{el.focus();}catch(_){}
    const s = String(v);
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype :
                  el instanceof HTMLSelectElement ? HTMLSelectElement.prototype :
                  HTMLInputElement.prototype;
    const desc = Object.getOwnPropertyDescriptor(proto,'value');
    if (desc&&desc.set) desc.set.call(el,s); else el.value=s;
    for (const ev of ['input','change','blur'])
      el.dispatchEvent(new Event(ev,{bubbles:true}));
    if (el.__vue__) try{el.__vue__.$emit('input',s);}catch(_){}
    if (el._assign) try{el._assign(s);}catch(_){}
    return true;
  }

  function setSel(el, text) {
    if (!el||el.tagName!=='SELECT') return false;
    const lo = text.toLowerCase();
    for (const o of el.options) {
      if (o.text.toLowerCase().includes(lo)||o.value.toLowerCase().includes(lo)) {
        el.value = o.value;
        for (const ev of ['input','change']) el.dispatchEvent(new Event(ev,{bubbles:true}));
        return true;
      }
    }
    return false;
  }

  function clickT(text, scope) {
    const lo = text.toLowerCase();
    for (const el of (scope||document).querySelectorAll('button,a,[role=button],.btn,span,label,div')) {
      if (!vis(el)) continue;
      const t = (el.innerText||el.textContent||'').trim();
      if (t.length>80||t.length<1) continue;
      if (t.toLowerCase().includes(lo)) {
        try{el.scrollIntoView({block:'center',behavior:'instant'});}catch(_){}
        el.click();
        return true;
      }
    }
    return false;
  }

  async function waitEl(fn, ms) {
    const end = Date.now()+(ms||15000);
    while (Date.now()<end) { const r=fn(); if(r) return r; await sleep(W.t); }
    return null;
  }

  // ============================================================
  //  DROPDOWN (native + vue-select + custom)
  // ============================================================
  async function fillDD(label, value, fbIdx) {
    const lo = label.toLowerCase();
    const vlo = value.toLowerCase();

    const el = findLabel(label);
    if (el&&el.tagName==='SELECT'&&setSel(el,value)) { log(`  ${label}: ${value}`); return true; }

    const sels = aSel();
    if (typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)) {
      log(`  ${label}: ${value} [select#${fbIdx}]`);
      return true;
    }

    for (const toggle of document.querySelectorAll(
      '.vs__dropdown-toggle,[class*=v-select],[role=combobox],[role=listbox],[class*=dropdown],[class*=select-trigger],[class*=multiselect]'
    )) {
      if (!vis(toggle)) continue;
      let c = toggle;
      for (let d=0;d<6&&c;d++) {
        const lbl = c.querySelector('label,span,div,p');
        if (lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().includes(lo)) {
          toggle.click(); await sleep(600);
          for (const opt of document.querySelectorAll(
            '.vs__dropdown-option,[role=option],.dropdown-item,li,.option,[class*=option],[class*=select-item]'
          )) {
            if ((opt.innerText||opt.textContent||'').trim().toLowerCase().includes(vlo)) {
              opt.click(); await sleep(400);
              log(`  ${label}: ${value} [custom]`);
              return true;
            }
          }
          document.body.click(); await sleep(200);
        }
        c = c.parentElement;
      }
    }

    for (const el of document.querySelectorAll('[class*=select],[class*=dropdown],select')) {
      if (!vis(el)) continue;
      let c = el.parentElement;
      for (let d=0;d<5&&c;d++) {
        const lbl = c.querySelector('label,span');
        if (lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().includes(lo)) {
          el.click(); await sleep(500);
          for (const opt of document.querySelectorAll('li,[role=option],[class*=option]')) {
            if ((opt.innerText||opt.textContent||'').trim().toLowerCase().includes(vlo)) {
              opt.click(); await sleep(300);
              log(`  ${label}: ${value} [fb]`);
              return true;
            }
          }
        }
        c = c.parentElement;
      }
    }

    wrn(`  ${label}: TIDAK DIJUMPAI`);
    console.log('[DEBUG] Semua selects:', sels.map((s,i)=>({i,name:s.name,id:s.id,opts:[...s.options].map(o=>o.text)})));
    return false;
  }

  // ============================================================
  //  STAR RATING
  // ============================================================
  function clickStar(n) {
    for (const c of document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian]')) {
      const items = c.querySelectorAll('svg,i,span,label,path,polygon');
      if (items.length>=n) { items[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true})); items[n-1].click(); return true; }
    }
    const rText = [...document.querySelectorAll('*')].find(e=>
      e.children.length===0&&/penilaian|rating|bintang/i.test(e.textContent)
    );
    if (rText) {
      let sib = rText.parentElement;
      for (let d=0;d<5&&sib;d++) {
        const svgs = [...sib.querySelectorAll('svg')];
        if (svgs.length>=n) { svgs[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true})); return true; }
        sib = sib.parentElement;
      }
    }
    return false;
  }

  // ============================================================
  //  SWAL (handle Ya, OK, Berjaya)
  // ============================================================
  function swalTxt() {
    const e = document.querySelector('.swal2-html-container,.swal2-title,.swal2-content');
    return e ? e.textContent.trim() : '';
  }
  function swalClick(btnText) {
    if (btnText) {
      for (const b of document.querySelectorAll('.swal2-confirm,.swal2-deny,.swal2-cancel,.swal2-close,button')) {
        const t = (b.innerText||b.textContent||'').trim().toLowerCase();
        if (t.includes(btnText.toLowerCase())) { b.click(); return true; }
      }
    }
    const b = document.querySelector('.swal2-confirm,.swal2-close');
    if (b) { b.click(); return true; }
    return false;
  }

  // ============================================================
  //  FILL FIELD
  // ============================================================
  async function fill(label, value, alts) {
    let el = findLabel(label);
    if (!el&&alts) for (const a of alts) { el=findLabel(a); if(el) break; }
    if (el) {
      if (el.tagName==='SELECT') { if(setSel(el,value)){log(`  ${label}: ${value}`);return true;} }
      else { if(setVal(el,value)){log(`  ${label}: ${value}`);return true;} }
    }
    wrn(`  ${label}: TIDAK DIJUMPAI`);
    return false;
  }

  // ============================================================
  //  PROCESS ONE BOOK
  // ============================================================
  async function doBook(book, idx, total) {
    setBook(idx, 'active');
    setProg(idx, total);
    log(`--- Buku ${idx+1}/${total}: ${book.title} ---`);

    if (!location.pathname.includes('/record/add/book')) {
      log('Navigasi ke borang...');
      if (location.pathname.includes('/record/add')&&!location.pathname.includes('/book')) {
        await sleep(W.s);
        clickT('buku'); await sleep(800); clickT('seterusnya'); await sleep(W.p);
      } else {
        location.href='/record/add/book'; await sleep(W.p);
      }
    }

    const ok = await waitEl(()=>aInp().length>=3?true:null, 15000);
    if (!ok) { err('Borang tidak dimuatkan!'); setBook(idx,'fail'); return {ok:false,title:book.title,note:'Borang tak load'}; }
    await sleep(W.t);
    swalClick();

    // STEP 1
    log('Step 1: Maklumat Buku');
    await fill('tajuk', book.title, ['title']);                  await sleep(300);
    clickT('e-buku'); log('  Jenis: E-Buku');                   await sleep(300);
    await fillDD('kategori', book.categoryLabel, 0);             await sleep(300);
    await fill('mukasurat', book.pages, ['bilangan','muka','page']); await sleep(300);
    await fill('penulis', book.author, ['pengarang','author']);   await sleep(300);
    await fill('penerbit', book.publisher, ['publisher']);        await sleep(300);
    await fill('tahun', book.year, ['terbitan','year']);          await sleep(300);
    await fillDD('bahasa', book.languageLabel, 1);               await sleep(400);

    log('Klik Seterusnya...');
    clickT('seterusnya'); await sleep(W.s);

    // STEP 2
    log('Step 2: Rumusan & Pengajaran');
    await waitEl(()=>aTxt().length>0?true:null, 12000);
    await sleep(W.t);

    const txts = aTxt();
    if (txts.length>=1) { setVal(txts[0], book.summary); log(`  Rumusan: ${book.summary.substring(0,35)}...`); }
    else {
      const r = findLabel('rumusan')||findLabel('sinopsis')||findLabel('ringkasan');
      if (r) { setVal(r,book.summary); log('  Rumusan: OK (label)'); }
      else wrn('  Rumusan: TIDAK DIJUMPAI');
    }
    await sleep(400);

    if (txts.length>=2) { setVal(txts[1], book.review); log(`  Pengajaran: ${book.review.substring(0,35)}...`); }
    else {
      const p = findLabel('pengajaran')||findLabel('ulasan')||findLabel('belajar');
      if (p) { setVal(p,book.review); log('  Pengajaran: OK (label)'); }
      else wrn('  Pengajaran: TIDAK DIJUMPAI');
    }
    await sleep(400);

    if (clickStar(5)) log('  Rating: 5 bintang');
    else wrn('  Rating: tidak dijumpai');
    await sleep(400);

    log('Klik Seterusnya...');
    clickT('seterusnya'); await sleep(W.s);

    // STEP 3+
    for (let a=0;a<6;a++) {
      await sleep(800);
      const sw = swalTxt();

      if (/berjaya|success|disimpan|tahniah/i.test(sw)) {
        log('BERJAYA!'); swalClick('ok'); swalClick();
        setBook(idx,'done');
        return {ok:true,title:book.title,note:sw};
      }
      if (/pasti|confirm|sahkan|adakah/i.test(sw)) {
        log('  Popup pengesahan -> Klik Ya...');
        swalClick('ya'); await sleep(W.sv);
        const sw2 = swalTxt();
        if (/berjaya|success|disimpan|tahniah/i.test(sw2)) {
          log('BERJAYA!'); swalClick('ok'); swalClick();
          setBook(idx,'done');
          return {ok:true,title:book.title,note:sw2};
        }
        continue;
      }
      if (/gagal|error|ralat|fail/i.test(sw)) {
        err(`GAGAL: ${sw}`); swalClick();
        setBook(idx,'fail');
        return {ok:false,title:book.title,note:sw};
      }

      if (clickT('simpan')||clickT('hantar')||clickT('submit')||clickT('selesai')) {
        log('  Klik simpan/hantar...'); await sleep(W.sv); continue;
      }
      if (clickT('seterusnya')) {
        log('  Klik Seterusnya...'); await sleep(W.s); continue;
      }
      break;
    }

    await sleep(1000);
    const fin = swalTxt();
    if (/berjaya|success|disimpan|tahniah/i.test(fin)) {
      swalClick('ok'); swalClick(); setBook(idx,'done');
      return {ok:true,title:book.title,note:fin};
    }
    swalClick(); setBook(idx,'fail');
    return {ok:false,title:book.title,note:fin||'Tiada maklumbalas'};
  }

  // ============================================================
  //  MAIN
  // ============================================================
  makeUI();

  let st = loadSt();
  let si = 0, results = [];
  if (st&&st.i>0&&st.i<BOOKS.length) {
    si=st.i; results=st.r||[];
    log(`Menyambung dari buku #${si+1}...`);
    for (let j=0;j<si;j++) setBook(j,'done');
  } else {
    clearSt();
    log(`${BOOKS.length} buku sedia. Memulakan...`);
  }

  let okC=results.filter(r=>r.ok).length, failC=results.filter(r=>!r.ok).length;
  setStats(okC,failC);

  for (let i=si;i<BOOKS.length;i++) {
    saveSt(i, results);

    const res = await doBook(BOOKS[i], i, BOOKS.length);
    results.push(res);
    if (res.ok) okC++; else failC++;
    setStats(okC,failC);
    saveSt(i+1, results);

    if (i<BOOKS.length-1) {
      log('Sedia untuk buku seterusnya...');
      await sleep(W.s);
      swalClick('ok'); swalClick(); await sleep(500);

      let nav = clickT('tambah lagi')||clickT('tambah rekod')||clickT('mula masukkan');
      if (!nav) {
        try {
          const app = document.querySelector('#app');
          const router = app?.__vue_app__?.config?.globalProperties?.$router || app?.__vue__?.$router;
          if (router) { router.push('/record/add/book'); nav=true; }
        } catch(_) {}
      }
      if (!nav) location.href='/record/add';
      await sleep(W.p);

      if (location.pathname.includes('/record/add')&&!location.pathname.includes('/book')) {
        clickT('buku'); await sleep(800); clickT('seterusnya'); await sleep(W.p);
      }
    }
  }

  setProg(BOOKS.length-1, BOOKS.length);
  clearSt();
  log('=== SELESAI ===');
  const badge = document.getElementById('np-badge');
  if (badge) { badge.textContent='Selesai'; badge.style.background='linear-gradient(135deg,#00c853,#69f0ae)'; }
  console.table(results.map((r,i)=>({No:i+1,Tajuk:r.title,Status:r.ok?'BERJAYA':'GAGAL',Nota:r.note||''})));

})();
