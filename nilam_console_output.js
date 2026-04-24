// NILAM Auto-Fill v4.0 - Console DevTools Script
// Panel kawalan muncul dulu. Tekan MULA bila sedia.
(async () => {

  const BOOKS = [
    { title:"Sang Kancil dan Buaya", author:"Pak Pandir", publisher:"Pustaka Rakyat", year:"2020", pages:"24", categoryLabel:"Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Kisah kancil yang cerdik berjaya menyeberangi sungai dengan menipu buaya supaya berbaris menjadi jambatan. Cerita ini mengajar kita tentang kepentingan menggunakan akal fikiran dalam menghadapi cabaran hidup.",
      review:"Selepas membaca buku ini saya belajar bahawa kecerdikan dan kebijaksanaan lebih penting daripada kekuatan fizikal semata-mata dalam menyelesaikan masalah kehidupan seharian." },
    { title:"The Adventure of Sherlock Holmes", author:"Arthur Conan Doyle", publisher:"George Newnes", year:"1892", pages:"307", categoryLabel:"Fiksyen", languageLabel:"Bahasa Inggeris",
      summary:"A collection of twelve detective stories featuring the famous Sherlock Holmes and his companion Dr Watson as they solve mysterious crimes across Victorian London using brilliant deductive reasoning.",
      review:"After reading this book I learned the importance of observation and logical thinking in solving problems and that every detail no matter how small can be significant in understanding the truth." },
    { title:"Sejarah Pembentukan Malaysia", author:"Ahmad Bin Ali", publisher:"Dewan Bahasa dan Pustaka", year:"2015", pages:"150", categoryLabel:"Bukan Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Buku ini mengisahkan perjalanan sejarah pembentukan Malaysia dari zaman Kesultanan Melayu Melaka sehingga kemerdekaan dan penubuhan Malaysia pada tahun 1963 dengan penuh fakta yang menarik.",
      review:"Selepas membaca buku ini saya lebih menghargai pengorbanan para pejuang kemerdekaan dan memahami betapa pentingnya perpaduan kaum dalam membina sebuah negara yang aman dan makmur." },
    { title:"Misteri Pulau Harapan", author:"Azman Ismail", publisher:"Pustaka Ilmu", year:"2023", pages:"120", categoryLabel:"Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Kisah sekumpulan remaja yang menemui rahsia di sebuah pulau terpencil yang penuh misteri dan terpaksa menggunakan keberanian serta kebijaksanaan untuk menyelamatkan diri daripada bahaya yang mengancam.",
      review:"Selepas membaca buku ini saya belajar tentang kepentingan kerja berpasukan dan keberanian dalam menghadapi situasi yang mencabar serta tidak mudah berputus asa dalam hidup." },
    { title:"Misteri Hutan Belantara", author:"Siti Nurhaliza Ahmad", publisher:"Penerbit Fajar", year:"2024", pages:"150", categoryLabel:"Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Kisah pengembaraan seorang remaja bernama Aiman di dalam hutan belantara yang penuh dengan cabaran dan rahsia alam semula jadi yang menakjubkan dan mengajarkan erti ketabahan hati.",
      review:"Selepas membaca buku ini saya memahami bahawa alam semula jadi perlu dijaga dan dipelihara kerana ia merupakan anugerah yang sangat berharga untuk generasi akan datang." },
    { title:"Charlotte's Web", author:"E.B. White", publisher:"Harper and Brothers", year:"1952", pages:"184", categoryLabel:"Fiksyen", languageLabel:"Bahasa Inggeris",
      summary:"The story of a young pig named Wilbur who befriends a clever spider named Charlotte that saves his life by writing words in her web praising the pig and proving that friendship transcends all boundaries.",
      review:"After reading this book I learned that true friendship means being willing to sacrifice for those we care about and that even the smallest creatures can make the biggest difference in our lives." },
    { title:"Sains dan Teknologi Masa Kini", author:"Dr Aminah Yusof", publisher:"Penerbit Universiti Malaya", year:"2021", pages:"180", categoryLabel:"Bukan Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Buku ini membincangkan perkembangan sains dan teknologi terkini termasuk kecerdasan buatan robotik dan tenaga boleh baharu yang memberi kesan besar kepada kehidupan manusia di seluruh dunia.",
      review:"Selepas membaca buku ini saya lebih memahami kepentingan sains dan teknologi dalam kehidupan seharian dan bersemangat untuk terus mendalami bidang STEM demi masa depan yang lebih cerah." },
    { title:"The Little Prince", author:"Antoine de Saint-Exupery", publisher:"Reynal and Hitchcock", year:"1943", pages:"96", categoryLabel:"Fiksyen", languageLabel:"Bahasa Inggeris",
      summary:"A poetic tale about a young prince who travels from planet to planet learning about life love and human nature from the various characters he meets along his extraordinary journey through the universe.",
      review:"After reading this book I understood that the most important things in life are invisible to the eye and that we must look with our hearts to truly see what matters most." },
    { title:"Hikayat Hang Tuah", author:"Tun Sri Lanang", publisher:"Dewan Bahasa dan Pustaka", year:"2010", pages:"280", categoryLabel:"Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Hikayat yang mengisahkan kepahlawanan Hang Tuah dan sahabatnya dalam mempertahankan kerajaan Melayu Melaka serta nilai kesetiaan dan keberanian yang menjadi teras budaya Melayu sejak zaman dahulu.",
      review:"Selepas membaca buku ini saya kagum dengan semangat kesetiaan dan kepahlawanan Hang Tuah yang sanggup berkorban demi raja dan tanah air serta mengajarkan nilai patriotisme kepada generasi muda." },
    { title:"Panduan Kewangan Pelajar", author:"Mohd Rizal Hassan", publisher:"PTS Media Group", year:"2022", pages:"95", categoryLabel:"Bukan Fiksyen", languageLabel:"Bahasa Melayu",
      summary:"Buku panduan yang mengajar pelajar tentang pengurusan kewangan asas termasuk cara menyimpan wang membuat bajet dan memahami nilai wang sejak usia muda untuk masa depan yang lebih terjamin.",
      review:"Selepas membaca buku ini saya mula menyimpan wang saku dan membuat perancangan kewangan yang lebih baik kerana memahami betapa pentingnya pengurusan wang yang bijak sejak awal lagi." }
  ];

  // ============================================================
  //  GLOBALS
  // ============================================================
  let DELAY = 500;
  let running = false;
  let paused = false;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  // ============================================================
  //  UI
  // ============================================================
  function makeUI() {
    if (document.getElementById('NP')) document.getElementById('NP').remove();
    const w = document.createElement('div'); w.id='NP';
    w.innerHTML = `<style>
#NP{position:fixed;top:16px;right:16px;width:400px;z-index:2147483647;font-family:'Segoe UI',system-ui,sans-serif}
#NP *{box-sizing:border-box;margin:0;padding:0}
.nc{background:linear-gradient(145deg,#0a0a1a 0%,#1a1040 50%,#0d0d2b 100%);border-radius:20px;
  box-shadow:0 24px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,255,255,.07),inset 0 1px 0 rgba(255,255,255,.05);
  overflow:hidden;color:#fff}
.nh{padding:18px 22px 14px;cursor:grab;user-select:none;display:flex;align-items:center;justify-content:space-between}
.nh:active{cursor:grabbing}
.nh h3{font-size:16px;font-weight:700;background:linear-gradient(135deg,#a78bfa,#818cf8,#6366f1);
  -webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:.5px}
.nv{font-size:9px;background:rgba(139,92,246,.2);color:#a78bfa;padding:2px 8px;border-radius:12px;font-weight:600}
.nx{background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;padding:0 6px;line-height:1;transition:color .2s}
.nx:hover{color:#fff}
.nb{padding:0 22px 14px;max-height:160px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent}
.nb::-webkit-scrollbar{width:3px}.nb::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
.bi{display:flex;align-items:center;gap:10px;padding:7px 12px;border-radius:10px;font-size:11.5px;
  color:rgba(255,255,255,.35);margin-bottom:3px;transition:all .3s}
.bi.active{background:rgba(139,92,246,.12);color:#c4b5fd}
.bi.done{color:#34d399}.bi.done .bn{background:rgba(52,211,153,.15);color:#34d399}
.bi.fail{color:#f87171}.bi.fail .bn{background:rgba(248,113,113,.15);color:#f87171}
.bn{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  font-size:9px;font-weight:700;background:rgba(255,255,255,.05);flex-shrink:0;transition:all .3s}
.bi.active .bn{background:rgba(139,92,246,.25);color:#a78bfa}
.np{padding:14px 22px}
.npb{height:5px;background:rgba(255,255,255,.06);border-radius:99px;overflow:hidden}
.npf{height:100%;width:0%;background:linear-gradient(90deg,#8b5cf6,#6366f1,#a78bfa);border-radius:99px;
  transition:width .8s cubic-bezier(.22,1,.36,1)}
.npt{color:rgba(255,255,255,.35);font-size:10.5px;margin-top:6px;text-align:right;font-weight:500}
.nc-ctrl{padding:14px 22px;display:flex;gap:10px;flex-wrap:wrap;align-items:center;
  border-top:1px solid rgba(255,255,255,.04);border-bottom:1px solid rgba(255,255,255,.04)}
.nc-ctrl label{font-size:10.5px;color:rgba(255,255,255,.4);font-weight:500}
.nc-btn{flex:1;padding:10px 0;border:none;border-radius:10px;font-size:12px;font-weight:700;
  cursor:pointer;letter-spacing:.5px;transition:all .2s}
.nc-btn:hover{transform:translateY(-1px)}
.btn-go{background:linear-gradient(135deg,#8b5cf6,#6366f1);color:#fff;box-shadow:0 4px 15px rgba(99,102,241,.3)}
.btn-go:hover{box-shadow:0 6px 20px rgba(99,102,241,.4)}
.btn-stop{background:rgba(248,113,113,.15);color:#f87171}
.btn-pause{background:rgba(251,191,36,.12);color:#fbbf24}
.btn-off{background:rgba(255,255,255,.06);color:rgba(255,255,255,.3)}
.nc-delay{display:flex;align-items:center;gap:8px;width:100%}
.nc-delay input[type=range]{flex:1;accent-color:#8b5cf6;height:4px}
.nc-delay span{font-size:11px;color:#a78bfa;font-weight:600;min-width:35px;text-align:right}
.nl{padding:0 22px 16px;max-height:180px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.08) transparent}
.nl::-webkit-scrollbar{width:3px}.nl::-webkit-scrollbar-thumb{background:rgba(255,255,255,.1);border-radius:3px}
.le{padding:5px 0;border-bottom:1px solid rgba(255,255,255,.03);font-size:11px;
  color:rgba(255,255,255,.4);line-height:1.5;display:flex;gap:8px}
.le .lt{color:rgba(255,255,255,.18);font-size:9.5px;font-family:'Cascadia Code',monospace;flex-shrink:0}
.le.lok{color:#34d399}.le.lwrn{color:#fbbf24}.le.lerr{color:#f87171}.le.lstep{color:#a78bfa;font-weight:600}
.nf{padding:14px 22px;background:rgba(0,0,0,.15);display:flex;justify-content:center;gap:20px;font-size:13px}
.ns{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,.5);font-weight:500}
.nd{width:9px;height:9px;border-radius:50%;display:inline-block}
</style>
<div class="nc">
  <div class="nh" id="np-head">
    <h3>NILAM Auto-Fill</h3>
    <div style="display:flex;align-items:center;gap:10px">
      <span class="nv">v4.0</span>
      <button class="nx" id="np-min" title="Minimize/Maximize">&#x2212;</button>
    </div>
  </div>
  <div id="np-body">
    <div class="nb" id="np-books"></div>
    <div class="nc-ctrl" id="np-ctrl">
      <button class="nc-btn btn-go" id="np-start">MULA</button>
      <button class="nc-btn btn-pause btn-off" id="np-pause" disabled>PAUSE</button>
      <button class="nc-btn btn-stop btn-off" id="np-stop" disabled>BERHENTI</button>
      <div class="nc-delay">
        <label>Delay:</label>
        <input type="range" id="np-delay" min="200" max="2000" value="500" step="100">
        <span id="np-dval">500ms</span>
      </div>
    </div>
    <div class="np" id="np-prog">
      <div class="npb"><div class="npf" id="np-pfill"></div></div>
      <div class="npt" id="np-ptext">Menunggu arahan...</div>
    </div>
    <div class="nl" id="np-log"></div>
  </div>
  <div class="nf">
    <span class="ns"><span class="nd" style="background:#34d399"></span><span id="np-ok">0</span> Berjaya</span>
    <span class="ns"><span class="nd" style="background:#f87171"></span><span id="np-fail">0</span> Gagal</span>
  </div>
</div>`;
    document.body.appendChild(w);

    // Drag
    const head=document.getElementById('np-head'); let dr=false,ox,oy;
    head.onmousedown=e=>{dr=true;const r=w.getBoundingClientRect();ox=e.clientX-r.left;oy=e.clientY-r.top;};
    document.onmousemove=e=>{if(!dr)return;w.style.left=(e.clientX-ox)+'px';w.style.top=(e.clientY-oy)+'px';w.style.right='auto';};
    document.onmouseup=()=>{dr=false;};

    // Minimize
    let mini=false;
    document.getElementById('np-min').onclick=()=>{
      mini=!mini;
      document.getElementById('np-body').style.display=mini?'none':'';
      document.getElementById('np-min').innerHTML=mini?'&#x2b;':'&#x2212;';
    };

    // Delay slider
    const slider=document.getElementById('np-delay');
    const dval=document.getElementById('np-dval');
    slider.oninput=()=>{DELAY=+slider.value;dval.textContent=DELAY+'ms';};

    // Book list
    const bl=document.getElementById('np-books');
    BOOKS.forEach((b,i)=>{bl.innerHTML+=`<div class="bi" id="np-b${i}"><span class="bn">${i+1}</span>${b.title}</div>`;});
  }

  function pLog(m){
    const el=document.getElementById('np-log'); if(!el)return;
    const t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
    const c=/BERJAYA/.test(m)?'lok':/TIDAK|GAGAL|RALAT/.test(m)?'lerr':/Step \d/.test(m)?'lstep':/WARN/.test(m)?'lwrn':'';
    el.innerHTML+=`<div class="le ${c}"><span class="lt">${t}</span><span>${m}</span></div>`;
    el.scrollTop=el.scrollHeight;
  }
  const _l=(m,c)=>{console.log(`%c[NILAM] ${m}`,`color:${c};font-weight:bold`);pLog(m);};
  const log=m=>_l(m,'#34d399');
  const wrn=m=>_l(m,'#fbbf24');
  const err=m=>_l(m,'#f87171');

  function setBook(i,s){const e=document.getElementById('np-b'+i);if(e)e.className='bi '+s;}
  function setProg(c,t){
    const f=document.getElementById('np-pfill'),p=document.getElementById('np-ptext');
    if(f)f.style.width=`${((c+1)/t)*100}%`;
    if(p)p.textContent=`Buku ${c+1} / ${t}`;
  }
  function setStats(o,f){
    const oe=document.getElementById('np-ok'),fe=document.getElementById('np-fail');
    if(oe)oe.textContent=o;if(fe)fe.textContent=f;
  }

  // ============================================================
  //  STATE
  // ============================================================
  const SK='__nilam4__';
  const ldSt=()=>{try{return JSON.parse(sessionStorage.getItem(SK));}catch{return null;}};
  const svSt=(i,r)=>sessionStorage.setItem(SK,JSON.stringify({i,r}));
  const clSt=()=>sessionStorage.removeItem(SK);

  // ============================================================
  //  DOM
  // ============================================================
  const vis=el=>el&&(el.offsetParent!==null||el.offsetWidth>0||el.offsetHeight>0);

  function findLabel(text){
    const lo=text.toLowerCase();
    for(const lb of document.querySelectorAll('label')){
      const t=lb.textContent.replace(/\*/g,'').trim().toLowerCase();
      if(!t.includes(lo))continue;
      if(lb.htmlFor){const e=document.getElementById(lb.htmlFor);if(e&&vis(e))return e;}
      let p=lb.parentElement;
      for(let d=0;d<6&&p;d++){
        const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');
        if(e&&vis(e))return e;p=p.parentElement;
      }
    }
    for(const n of document.querySelectorAll('span,div,p,td,th')){
      const t=n.textContent.replace(/\*/g,'').trim();
      if(t.length>50||t.length<2||!t.toLowerCase().includes(lo))continue;
      let p=n.parentElement;
      for(let d=0;d<6&&p;d++){
        const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');
        if(e&&vis(e))return e;p=p.parentElement;
      }
    }
    return null;
  }

  const aInp=()=>[...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])')].filter(vis);
  const aSel=()=>[...document.querySelectorAll('select')].filter(vis);
  const aTxt=()=>[...document.querySelectorAll('textarea')].filter(vis);

  // ============================================================
  //  VALUE SET (Vue-compatible)
  // ============================================================
  function setVal(el,v){
    if(!el)return false;
    try{el.focus();}catch(_){}
    const s=String(v);
    const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:
                el instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
    const desc=Object.getOwnPropertyDescriptor(proto,'value');
    if(desc&&desc.set)desc.set.call(el,s);else el.value=s;
    for(const ev of['input','change','blur'])el.dispatchEvent(new Event(ev,{bubbles:true}));
    if(el.__vue__)try{el.__vue__.$emit('input',s);}catch(_){}
    if(el._assign)try{el._assign(s);}catch(_){}
    return true;
  }

  function setSel(el,text){
    if(!el||el.tagName!=='SELECT')return false;
    const lo=text.toLowerCase();
    for(const o of el.options){
      if(o.text.toLowerCase().includes(lo)||o.value.toLowerCase().includes(lo)){
        el.value=o.value;
        for(const ev of['input','change'])el.dispatchEvent(new Event(ev,{bubbles:true}));
        return true;
      }
    }
    return false;
  }

  function clickT(text,scope){
    const lo=text.toLowerCase();
    for(const el of(scope||document).querySelectorAll('button,a,[role=button],.btn,span,label,div')){
      if(!vis(el))continue;
      const t=(el.innerText||el.textContent||'').trim();
      if(t.length>80||t.length<1)continue;
      if(t.toLowerCase().includes(lo)){
        try{el.scrollIntoView({block:'center',behavior:'instant'});}catch(_){}
        el.click();return true;
      }
    }
    return false;
  }

  async function waitEl(fn,ms){
    const end=Date.now()+(ms||15000);
    while(Date.now()<end){const r=fn();if(r)return r;await sleep(400);}
    return null;
  }

  // ============================================================
  //  DROPDOWN
  // ============================================================
  async function fillDD(label,value,fbIdx){
    const lo=label.toLowerCase(),vlo=value.toLowerCase();
    const el=findLabel(label);
    if(el&&el.tagName==='SELECT'&&setSel(el,value)){log(`  ${label}: ${value}`);return true;}
    const sels=aSel();
    if(typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)){log(`  ${label}: ${value} [#${fbIdx}]`);return true;}
    for(const toggle of document.querySelectorAll('.vs__dropdown-toggle,[class*=v-select],[role=combobox],[role=listbox],[class*=dropdown],[class*=select-trigger],[class*=multiselect]')){
      if(!vis(toggle))continue;
      let c=toggle;
      for(let d=0;d<6&&c;d++){
        const lbl=c.querySelector('label,span,div,p');
        if(lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().includes(lo)){
          toggle.click();await sleep(600);
          for(const opt of document.querySelectorAll('.vs__dropdown-option,[role=option],.dropdown-item,li,.option,[class*=option]')){
            if((opt.innerText||opt.textContent||'').trim().toLowerCase().includes(vlo)){
              opt.click();await sleep(400);log(`  ${label}: ${value} [custom]`);return true;
            }
          }
          document.body.click();await sleep(200);
        }
        c=c.parentElement;
      }
    }
    wrn(`  ${label}: TIDAK DIJUMPAI`);
    return false;
  }

  // ============================================================
  //  STAR RATING
  // ============================================================
  function clickStar(n){
    for(const c of document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian]')){
      const items=c.querySelectorAll('svg,i,span,label,path,polygon');
      if(items.length>=n){items[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true}));items[n-1].click();return true;}
    }
    const rt=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/penilaian|rating|bintang/i.test(e.textContent));
    if(rt){let s=rt.parentElement;for(let d=0;d<5&&s;d++){const svgs=[...s.querySelectorAll('svg')];if(svgs.length>=n){svgs[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true}));return true;}s=s.parentElement;}}
    return false;
  }

  // ============================================================
  //  SWAL - handle Pasti, Ya, OK, Berjaya
  // ============================================================
  function swalTxt(){const e=document.querySelector('.swal2-html-container,.swal2-title,.swal2-content');return e?e.textContent.trim():'';}
  function swalClick(btnText){
    for(const b of document.querySelectorAll('.swal2-confirm,.swal2-deny,.swal2-cancel,.swal2-close,.swal2-actions button,button')){
      const t=(b.innerText||b.textContent||'').trim().toLowerCase();
      if(btnText&&t.includes(btnText.toLowerCase())){b.click();return true;}
    }
    const b=document.querySelector('.swal2-confirm,.swal2-close');
    if(b){b.click();return true;}
    return false;
  }

  // ============================================================
  //  FILL FIELD
  // ============================================================
  async function fill(label,value,alts){
    let el=findLabel(label);
    if(!el&&alts)for(const a of alts){el=findLabel(a);if(el)break;}
    if(el){
      if(el.tagName==='SELECT'){if(setSel(el,value)){log(`  ${label}: ${value}`);return true;}}
      else{if(setVal(el,value)){log(`  ${label}: ${value}`);return true;}}
    }
    wrn(`  ${label}: TIDAK DIJUMPAI`);
    return false;
  }

  // ============================================================
  //  PAUSE CHECK
  // ============================================================
  async function checkPause(){
    while(paused&&running){await sleep(300);}
  }

  // ============================================================
  //  PROCESS ONE BOOK
  // ============================================================
  async function doBook(book,idx,total){
    if(!running)return{ok:false,title:book.title,note:'Dihentikan'};
    setBook(idx,'active');setProg(idx,total);
    log(`--- Buku ${idx+1}/${total}: ${book.title} ---`);

    if(!location.pathname.includes('/record/add/book')){
      log('Navigasi ke borang...');
      if(location.pathname.includes('/record/add')&&!location.pathname.includes('/book')){
        await sleep(DELAY*3);clickT('buku');await sleep(DELAY*2);clickT('seterusnya');await sleep(DELAY*6);
      }else{location.href='/record/add/book';await sleep(DELAY*8);}
    }

    const ok=await waitEl(()=>aInp().length>=3?true:null,15000);
    if(!ok){err('Borang tidak dimuatkan!');setBook(idx,'fail');return{ok:false,title:book.title,note:'Borang tak load'};}
    await sleep(DELAY);swalClick();await checkPause();

    // STEP 1
    log('Step 1: Maklumat Buku');
    await fill('tajuk',book.title,['title']);                    await sleep(DELAY);await checkPause();
    clickT('e-buku');log('  Jenis: E-Buku');                     await sleep(DELAY);
    await fillDD('kategori',book.categoryLabel,0);               await sleep(DELAY);await checkPause();
    await fill('mukasurat',book.pages,['bilangan','muka','page']);await sleep(DELAY);
    await fill('penulis',book.author,['pengarang','author']);     await sleep(DELAY);
    await fill('penerbit',book.publisher,['publisher']);          await sleep(DELAY);
    await fill('tahun',book.year,['terbitan','year']);            await sleep(DELAY);await checkPause();
    await fillDD('bahasa',book.languageLabel,1);                 await sleep(DELAY);

    log('Klik Seterusnya...');clickT('seterusnya');await sleep(DELAY*3);await checkPause();

    // STEP 2
    log('Step 2: Rumusan & Pengajaran');
    await waitEl(()=>aTxt().length>0?true:null,12000);await sleep(DELAY);

    const txts=aTxt();
    if(txts.length>=1){setVal(txts[0],book.summary);log(`  Rumusan: ${book.summary.substring(0,35)}...`);}
    else{const r=findLabel('rumusan')||findLabel('sinopsis');if(r){setVal(r,book.summary);log('  Rumusan: OK');}else wrn('  Rumusan: TIDAK DIJUMPAI');}
    await sleep(DELAY);

    if(txts.length>=2){setVal(txts[1],book.review);log(`  Pengajaran: ${book.review.substring(0,35)}...`);}
    else{const p=findLabel('pengajaran')||findLabel('ulasan');if(p){setVal(p,book.review);log('  Pengajaran: OK');}else wrn('  Pengajaran: TIDAK DIJUMPAI');}
    await sleep(DELAY);

    if(clickStar(5))log('  Rating: 5 bintang');else wrn('  Rating: tidak dijumpai');
    await sleep(DELAY);await checkPause();

    log('Klik Seterusnya...');clickT('seterusnya');await sleep(DELAY*3);

    // STEP 3+ : Handle popups including PASTI
    for(let a=0;a<8;a++){
      if(!running)break;
      await sleep(DELAY*2);
      const sw=swalTxt();

      if(/berjaya|success|disimpan|tahniah/i.test(sw)){
        log('BERJAYA!');swalClick('ok');swalClick();setBook(idx,'done');
        return{ok:true,title:book.title,note:sw};
      }
      // PASTI / Ya / Confirm popup
      if(/pasti|pastikan|confirm|sahkan|adakah|pengesahan/i.test(sw)){
        log('  Popup pengesahan -> Klik PASTI...');
        if(!swalClick('pasti'))swalClick('ya');  // Try "Pasti" first, then "Ya"
        await sleep(DELAY*5);
        const sw2=swalTxt();
        if(/berjaya|success|disimpan|tahniah/i.test(sw2)){
          log('BERJAYA!');swalClick('ok');swalClick();setBook(idx,'done');
          return{ok:true,title:book.title,note:sw2};
        }
        continue;
      }
      if(/gagal|error|ralat|fail/i.test(sw)){
        err(`GAGAL: ${sw}`);swalClick();setBook(idx,'fail');
        return{ok:false,title:book.title,note:sw};
      }

      if(clickT('simpan')||clickT('hantar')||clickT('submit')||clickT('selesai')){
        log('  Klik simpan/hantar...');await sleep(DELAY*5);continue;
      }
      if(clickT('seterusnya')){log('  Klik Seterusnya...');await sleep(DELAY*3);continue;}
      break;
    }

    await sleep(DELAY*2);
    const fin=swalTxt();
    if(/berjaya|success|disimpan|tahniah/i.test(fin)){swalClick('ok');swalClick();setBook(idx,'done');return{ok:true,title:book.title,note:fin};}
    swalClick();setBook(idx,'fail');
    return{ok:false,title:book.title,note:fin||'Tiada maklumbalas'};
  }

  // ============================================================
  //  MAIN RUNNER
  // ============================================================
  async function startRun(){
    if(running)return;
    running=true;paused=false;

    const startBtn=document.getElementById('np-start');
    const pauseBtn=document.getElementById('np-pause');
    const stopBtn=document.getElementById('np-stop');
    startBtn.textContent='BERJALAN...';startBtn.disabled=true;startBtn.className='nc-btn btn-off';
    pauseBtn.disabled=false;pauseBtn.className='nc-btn btn-pause';
    stopBtn.disabled=false;stopBtn.className='nc-btn btn-stop';

    let st=ldSt(),si=0,results=[];
    if(st&&st.i>0&&st.i<BOOKS.length){
      si=st.i;results=st.r||[];
      log(`Menyambung dari buku #${si+1}...`);
      for(let j=0;j<si;j++)setBook(j,'done');
    }else{clSt();log(`${BOOKS.length} buku sedia. Memulakan...`);}

    let okC=results.filter(r=>r.ok).length,failC=results.filter(r=>!r.ok).length;
    setStats(okC,failC);

    for(let i=si;i<BOOKS.length;i++){
      if(!running)break;
      svSt(i,results);
      const res=await doBook(BOOKS[i],i,BOOKS.length);
      results.push(res);
      if(res.ok)okC++;else failC++;
      setStats(okC,failC);
      svSt(i+1,results);

      if(!running)break;
      if(i<BOOKS.length-1){
        log('Sedia buku seterusnya...');await sleep(DELAY*3);
        swalClick('ok');swalClick();await sleep(DELAY);
        let nav=clickT('tambah lagi')||clickT('tambah rekod')||clickT('mula masukkan');
        if(!nav){try{const app=document.querySelector('#app');const router=app?.__vue_app__?.config?.globalProperties?.$router||app?.__vue__?.$router;if(router){router.push('/record/add/book');nav=true;}}catch(_){}}
        if(!nav)location.href='/record/add';
        await sleep(DELAY*8);
        if(location.pathname.includes('/record/add')&&!location.pathname.includes('/book')){
          clickT('buku');await sleep(DELAY*2);clickT('seterusnya');await sleep(DELAY*6);
        }
      }
    }

    clSt();log('=== SELESAI ===');
    startBtn.textContent='SIAP';startBtn.className='nc-btn btn-go';
    pauseBtn.disabled=true;pauseBtn.className='nc-btn btn-off';
    stopBtn.disabled=true;stopBtn.className='nc-btn btn-off';
    running=false;
    console.table(results.map((r,i)=>({No:i+1,Tajuk:r.title,Status:r.ok?'BERJAYA':'GAGAL',Nota:r.note||''})));
  }

  // ============================================================
  //  INIT
  // ============================================================
  makeUI();

  document.getElementById('np-start').onclick=()=>startRun();
  document.getElementById('np-pause').onclick=()=>{
    paused=!paused;
    const btn=document.getElementById('np-pause');
    btn.textContent=paused?'SAMBUNG':'PAUSE';
    log(paused?'DIJEDA...':'Disambung semula...');
  };
  document.getElementById('np-stop').onclick=()=>{
    running=false;paused=false;
    log('DIHENTIKAN oleh pengguna.');
    document.getElementById('np-start').textContent='MULA';
    document.getElementById('np-start').disabled=false;
    document.getElementById('np-start').className='nc-btn btn-go';
  };

  log('Panel sedia. Laraskan delay dan tekan MULA.');

})();
