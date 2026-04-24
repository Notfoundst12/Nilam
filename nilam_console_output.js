// NILAM Auto-Fill v6.0
// 1117 buku SEBENAR dari Google Books. Auto-delete yang dah guna.
// Mobile-friendly, touch draggable, purple glassmorphism UI.
(async()=>{

const LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@53face1/books_library.json';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let DELAY=500,running=false,paused=false,BOOKS=[];

const UK='__nilam_used__';
const getUsed=()=>{try{return JSON.parse(localStorage.getItem(UK))||[];}catch{return[];}};
const addUsed=t=>{const u=getUsed();if(!u.includes(t)){u.push(t);localStorage.setItem(UK,JSON.stringify(u));}};
const resetUsed=()=>localStorage.removeItem(UK);

const SK='__nilam6__';
const ldSt=()=>{try{return JSON.parse(sessionStorage.getItem(SK));}catch{return null;}};
const svSt=(i,r)=>sessionStorage.setItem(SK,JSON.stringify({i,r}));
const clSt=()=>sessionStorage.removeItem(SK);

const pLog=m=>{const el=document.getElementById('np-log');if(!el)return;
  const t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const c=/BERJAYA/.test(m)?'lok':/TIDAK|GAGAL|RALAT/.test(m)?'lerr':/Step \d/.test(m)?'lstep':/WARN|Menunggu/.test(m)?'lwrn':'';
  el.innerHTML+=`<div class="le ${c}"><span class="lt">${t}</span><span>${m}</span></div>`;el.scrollTop=el.scrollHeight;};
const _l=(m,c)=>{console.log(`%c[NILAM] ${m}`,`color:${c};font-weight:bold`);pLog(m);};
const log=m=>_l(m,'#34d399');const wrn=m=>_l(m,'#fbbf24');const err=m=>_l(m,'#f87171');

// ============================================================
//  UI
// ============================================================
function makeUI(){
  if(document.getElementById('NP'))document.getElementById('NP').remove();
  const w=document.createElement('div');w.id='NP';
  w.innerHTML=`<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
#NP{position:fixed;top:10px;right:10px;width:380px;max-width:calc(100vw - 20px);z-index:2147483647;font-family:'Inter',system-ui,-apple-system,sans-serif;touch-action:none}
#NP *{box-sizing:border-box;margin:0;padding:0}
@media(max-width:480px){#NP{width:calc(100vw - 16px);right:8px;top:8px}}
.nc{background:rgba(15,10,40,.92);backdrop-filter:blur(24px) saturate(1.8);-webkit-backdrop-filter:blur(24px) saturate(1.8);
  border-radius:24px;border:1px solid rgba(139,92,246,.2);
  box-shadow:0 32px 64px rgba(0,0,0,.5),0 0 80px rgba(139,92,246,.08),inset 0 1px 0 rgba(255,255,255,.06);
  overflow:hidden;color:#e2e0f0}

.nh{padding:16px 20px 12px;cursor:grab;user-select:none;-webkit-user-select:none;display:flex;align-items:center;justify-content:space-between;
  background:linear-gradient(180deg,rgba(139,92,246,.12) 0%,transparent 100%);touch-action:none}
.nh:active{cursor:grabbing}
.nh-left{display:flex;align-items:center;gap:10px}
.nh-icon{width:32px;height:32px;border-radius:10px;background:linear-gradient(135deg,#8b5cf6,#6366f1);display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 12px rgba(99,102,241,.4);font-size:16px;flex-shrink:0}
.nh h3{font-size:15px;font-weight:800;letter-spacing:-.3px;background:linear-gradient(135deg,#c4b5fd,#a78bfa,#818cf8);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.nh-right{display:flex;align-items:center;gap:8px}
.nv{font-size:9px;background:linear-gradient(135deg,rgba(139,92,246,.25),rgba(99,102,241,.2));color:#c4b5fd;padding:3px 10px;border-radius:20px;font-weight:700;letter-spacing:.5px;border:1px solid rgba(139,92,246,.15)}
.nx{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08);color:rgba(255,255,255,.4);width:28px;height:28px;border-radius:8px;font-size:16px;cursor:pointer;
  display:flex;align-items:center;justify-content:center;transition:all .2s;line-height:1}
.nx:hover,.nx:active{color:#fff;background:rgba(139,92,246,.3);border-color:rgba(139,92,246,.4)}

.ninfo{padding:10px 20px;display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.ninfo-chip{display:flex;align-items:center;gap:5px;background:rgba(139,92,246,.08);border:1px solid rgba(139,92,246,.1);border-radius:10px;padding:5px 12px;font-size:11px;color:rgba(255,255,255,.5);font-weight:500}
.ninfo-chip b{color:#c4b5fd;font-weight:700}

.nc-ctrl{padding:14px 20px;display:flex;gap:8px;flex-wrap:wrap;align-items:center;
  border-top:1px solid rgba(139,92,246,.08);border-bottom:1px solid rgba(139,92,246,.08);
  background:rgba(139,92,246,.03)}
.nc-btn{flex:1;min-width:70px;padding:11px 8px;border:none;border-radius:12px;font-size:11.5px;font-weight:700;cursor:pointer;
  letter-spacing:.3px;text-transform:uppercase;transition:all .25s cubic-bezier(.22,1,.36,1);position:relative;overflow:hidden}
.nc-btn:active{transform:scale(.96)}
.btn-go{background:linear-gradient(135deg,#8b5cf6,#7c3aed,#6d28d9);color:#fff;box-shadow:0 4px 20px rgba(124,58,237,.35),inset 0 1px 0 rgba(255,255,255,.15)}
.btn-go:hover,.btn-go:active{box-shadow:0 6px 28px rgba(124,58,237,.5);background:linear-gradient(135deg,#a78bfa,#8b5cf6,#7c3aed)}
.btn-stop{background:rgba(248,113,113,.1);color:#fca5a5;border:1px solid rgba(248,113,113,.15)}
.btn-stop:hover,.btn-stop:active{background:rgba(248,113,113,.2)}
.btn-pause{background:rgba(251,191,36,.08);color:#fde68a;border:1px solid rgba(251,191,36,.12)}
.btn-pause:hover,.btn-pause:active{background:rgba(251,191,36,.15)}
.btn-off{opacity:.4;pointer-events:none}
.btn-reset{background:rgba(139,92,246,.08);color:#c4b5fd;font-size:10px;padding:8px 14px;flex:none;border:1px solid rgba(139,92,246,.12);border-radius:10px}
.btn-reset:hover,.btn-reset:active{background:rgba(139,92,246,.2)}

.nc-row{display:flex;align-items:center;gap:10px;width:100%;margin-top:8px}
.nc-row label{font-size:10.5px;color:rgba(255,255,255,.4);font-weight:600;white-space:nowrap;min-width:55px}
.nc-row input[type=range]{flex:1;-webkit-appearance:none;appearance:none;height:6px;border-radius:6px;background:rgba(139,92,246,.15);outline:none}
.nc-row input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#7c3aed);
  box-shadow:0 2px 8px rgba(124,58,237,.4);cursor:pointer;border:2px solid rgba(255,255,255,.2)}
.nc-row input[type=range]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,#a78bfa,#7c3aed);
  box-shadow:0 2px 8px rgba(124,58,237,.4);cursor:pointer;border:2px solid rgba(255,255,255,.2)}
.nc-row span.val{font-size:11px;color:#c4b5fd;font-weight:700;min-width:40px;text-align:right;
  background:rgba(139,92,246,.1);padding:3px 8px;border-radius:6px}
.nc-row input[type=number]{width:56px;background:rgba(139,92,246,.1);border:1px solid rgba(139,92,246,.15);border-radius:8px;
  color:#e2e0f0;padding:6px 8px;font-size:12px;text-align:center;font-weight:600;font-family:inherit;outline:none}
.nc-row input[type=number]:focus{border-color:rgba(139,92,246,.5);box-shadow:0 0 0 3px rgba(139,92,246,.1)}

.np{padding:14px 20px 10px}
.npb{height:6px;background:rgba(139,92,246,.1);border-radius:99px;overflow:hidden;position:relative}
.npf{height:100%;width:0%;background:linear-gradient(90deg,#7c3aed,#8b5cf6,#a78bfa,#c4b5fd);border-radius:99px;transition:width .8s cubic-bezier(.22,1,.36,1);
  box-shadow:0 0 12px rgba(139,92,246,.4)}
.npt{color:rgba(255,255,255,.35);font-size:10.5px;margin-top:8px;text-align:center;font-weight:600;letter-spacing:.3px}

.nl{padding:4px 20px 14px;max-height:160px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(139,92,246,.2) transparent}
.nl::-webkit-scrollbar{width:4px}.nl::-webkit-scrollbar-track{background:transparent}.nl::-webkit-scrollbar-thumb{background:rgba(139,92,246,.25);border-radius:4px}
.le{padding:4px 0;border-bottom:1px solid rgba(139,92,246,.04);font-size:11px;color:rgba(255,255,255,.4);line-height:1.5;display:flex;gap:8px;align-items:flex-start}
.le .lt{color:rgba(139,92,246,.35);font-size:9.5px;font-family:'SF Mono',Monaco,Consolas,monospace;flex-shrink:0;padding-top:1px}
.le.lok{color:#6ee7b7}.le.lwrn{color:#fde68a}.le.lerr{color:#fca5a5}.le.lstep{color:#c4b5fd;font-weight:700}

.nf{padding:12px 20px;background:linear-gradient(180deg,transparent 0%,rgba(139,92,246,.06) 100%);
  display:flex;justify-content:center;gap:24px;border-top:1px solid rgba(139,92,246,.06)}
.ns{display:flex;align-items:center;gap:7px;font-size:13px;font-weight:600}
.nd{width:10px;height:10px;border-radius:50%;display:inline-block;box-shadow:0 0 8px currentColor}
.ns-ok{color:#6ee7b7}.ns-ok .nd{background:#34d399;box-shadow:0 0 10px rgba(52,211,153,.5)}
.ns-fail{color:#fca5a5}.ns-fail .nd{background:#f87171;box-shadow:0 0 10px rgba(248,113,113,.5)}
</style>
<div class="nc">
  <div class="nh" id="np-head">
    <div class="nh-left">
      <div class="nh-icon">&#x1F4DA;</div>
      <h3>NILAM Auto-Fill</h3>
    </div>
    <div class="nh-right">
      <span class="nv">v6.0</span>
      <button class="nx" id="np-min" title="Minimize">&#x2212;</button>
    </div>
  </div>
  <div id="np-body">
    <div class="ninfo">
      <div class="ninfo-chip">Perpustakaan <b id="np-total">...</b></div>
      <div class="ninfo-chip">Tinggal <b id="np-remain">...</b></div>
      <div class="ninfo-chip">Dipakai <b id="np-used">0</b></div>
    </div>
    <div class="nc-ctrl" id="np-ctrl">
      <button class="nc-btn btn-go" id="np-start">Mula</button>
      <button class="nc-btn btn-pause btn-off" id="np-pause" disabled>Pause</button>
      <button class="nc-btn btn-stop btn-off" id="np-stop" disabled>Berhenti</button>
      <button class="nc-btn btn-reset" id="np-reset" title="Reset senarai buku yang sudah dipakai">Reset Senarai</button>
      <div class="nc-row">
        <label>Bil. buku</label>
        <input type="number" id="np-count" min="1" max="100" value="5">
      </div>
      <div class="nc-row">
        <label>Delay</label>
        <input type="range" id="np-delay" min="200" max="2000" value="500" step="100">
        <span class="val" id="np-dval">500ms</span>
      </div>
    </div>
    <div class="np" id="np-prog">
      <div class="npb"><div class="npf" id="np-pfill"></div></div>
      <div class="npt" id="np-ptext">Menunggu arahan...</div>
    </div>
    <div class="nl" id="np-log"></div>
  </div>
  <div class="nf">
    <span class="ns ns-ok"><span class="nd"></span><span id="np-ok">0</span> Berjaya</span>
    <span class="ns ns-fail"><span class="nd"></span><span id="np-fail">0</span> Gagal</span>
  </div>
</div>`;
  document.body.appendChild(w);

  // --- DRAG: mouse + touch ---
  const head=document.getElementById('np-head');
  let dr=false,ox=0,oy=0;
  function dStart(cx,cy){dr=true;const r=w.getBoundingClientRect();ox=cx-r.left;oy=cy-r.top;w.style.transition='none';}
  function dMove(cx,cy){if(!dr)return;const x=Math.max(0,Math.min(cx-ox,window.innerWidth-w.offsetWidth));
    const y=Math.max(0,Math.min(cy-oy,window.innerHeight-60));
    w.style.left=x+'px';w.style.top=y+'px';w.style.right='auto';}
  function dEnd(){dr=false;w.style.transition='';}
  head.addEventListener('mousedown',e=>{e.preventDefault();dStart(e.clientX,e.clientY);});
  document.addEventListener('mousemove',e=>{dMove(e.clientX,e.clientY);});
  document.addEventListener('mouseup',dEnd);
  head.addEventListener('touchstart',e=>{if(e.touches.length===1){e.preventDefault();const t=e.touches[0];dStart(t.clientX,t.clientY);}},{passive:false});
  document.addEventListener('touchmove',e=>{if(dr&&e.touches.length===1){e.preventDefault();const t=e.touches[0];dMove(t.clientX,t.clientY);}},{passive:false});
  document.addEventListener('touchend',dEnd);
  document.addEventListener('touchcancel',dEnd);

  let mini=false;
  document.getElementById('np-min').onclick=()=>{mini=!mini;document.getElementById('np-body').style.display=mini?'none':'';
    document.querySelector('.nf').style.display=mini?'none':'';
    document.getElementById('np-min').innerHTML=mini?'&#x2b;':'&#x2212;';};
  document.getElementById('np-delay').oninput=function(){DELAY=+this.value;document.getElementById('np-dval').textContent=DELAY+'ms';};
}

function updateInfo(){
  const used=getUsed();
  const remain=BOOKS.filter(b=>!used.includes(b.title));
  const t=document.getElementById('np-total'),r=document.getElementById('np-remain'),u=document.getElementById('np-used');
  if(t)t.textContent=BOOKS.length;if(r)r.textContent=remain.length;if(u)u.textContent=used.length;
}
function setProg(c,t){const f=document.getElementById('np-pfill'),p=document.getElementById('np-ptext');if(f)f.style.width=`${((c+1)/t)*100}%`;if(p)p.textContent=`Buku ${c+1} / ${t}`;}
function setStats(o,f){const oe=document.getElementById('np-ok'),fe=document.getElementById('np-fail');if(oe)oe.textContent=o;if(fe)fe.textContent=f;}

// ============================================================
//  DOM HELPERS
// ============================================================
const vis=el=>el&&(el.offsetParent!==null||el.offsetWidth>0||el.offsetHeight>0);
function findLabel(text){
  const lo=text.toLowerCase();
  for(const lb of document.querySelectorAll('label')){const t=lb.textContent.replace(/\*/g,'').trim().toLowerCase();if(!t.includes(lo))continue;if(lb.htmlFor){const e=document.getElementById(lb.htmlFor);if(e&&vis(e))return e;}let p=lb.parentElement;for(let d=0;d<6&&p;d++){const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}}
  for(const n of document.querySelectorAll('span,div,p,td,th')){const t=n.textContent.replace(/\*/g,'').trim();if(t.length>50||t.length<2||!t.toLowerCase().includes(lo))continue;let p=n.parentElement;for(let d=0;d<6&&p;d++){const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}}
  return null;
}
const aInp=()=>[...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox]):not([type=radio])')].filter(vis);
const aSel=()=>[...document.querySelectorAll('select')].filter(vis);
const aTxt=()=>[...document.querySelectorAll('textarea')].filter(vis);

function setVal(el,v){if(!el)return false;try{el.focus();}catch(_){}const s=String(v);
  const proto=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:el instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  const desc=Object.getOwnPropertyDescriptor(proto,'value');if(desc&&desc.set)desc.set.call(el,s);else el.value=s;
  for(const ev of['input','change','blur'])el.dispatchEvent(new Event(ev,{bubbles:true}));
  if(el.__vue__)try{el.__vue__.$emit('input',s);}catch(_){}if(el._assign)try{el._assign(s);}catch(_){}return true;}
function setSel(el,text){if(!el||el.tagName!=='SELECT')return false;const lo=text.toLowerCase();
  for(const o of el.options){if(o.text.toLowerCase().includes(lo)||o.value.toLowerCase().includes(lo)){el.value=o.value;for(const ev of['input','change'])el.dispatchEvent(new Event(ev,{bubbles:true}));return true;}}return false;}
function clickT(text,scope){const lo=text.toLowerCase();for(const el of(scope||document).querySelectorAll('button,a,[role=button],.btn,span,label,div')){if(!vis(el))continue;const t=(el.innerText||el.textContent||'').trim();if(t.length>80||t.length<1)continue;if(t.toLowerCase().includes(lo)){try{el.scrollIntoView({block:'center',behavior:'instant'});}catch(_){}el.click();return true;}}return false;}
async function waitEl(fn,ms){const end=Date.now()+(ms||15000);while(Date.now()<end){const r=fn();if(r)return r;await sleep(400);}return null;}

async function fillDD(label,value,fbIdx){
  const lo=label.toLowerCase(),vlo=value.toLowerCase();
  const el=findLabel(label);if(el&&el.tagName==='SELECT'&&setSel(el,value)){log(`  ${label}: ${value}`);return true;}
  const sels=aSel();if(typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)){log(`  ${label}: ${value} [#${fbIdx}]`);return true;}
  for(const toggle of document.querySelectorAll('.vs__dropdown-toggle,[class*=v-select],[role=combobox],[role=listbox],[class*=dropdown],[class*=select-trigger],[class*=multiselect]')){
    if(!vis(toggle))continue;let c=toggle;for(let d=0;d<6&&c;d++){const lbl=c.querySelector('label,span,div,p');
    if(lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().includes(lo)){toggle.click();await sleep(600);
    for(const opt of document.querySelectorAll('.vs__dropdown-option,[role=option],.dropdown-item,li,.option,[class*=option]')){
      if((opt.innerText||opt.textContent||'').trim().toLowerCase().includes(vlo)){opt.click();await sleep(400);log(`  ${label}: ${value} [custom]`);return true;}}
    document.body.click();await sleep(200);}c=c.parentElement;}}
  wrn(`  ${label}: TIDAK DIJUMPAI`);return false;
}

function clickStar(n){
  for(const c of document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian]')){const items=c.querySelectorAll('svg,i,span,label,path,polygon');if(items.length>=n){items[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true}));items[n-1].click();return true;}}
  const rt=[...document.querySelectorAll('*')].find(e=>e.children.length===0&&/penilaian|rating|bintang/i.test(e.textContent));
  if(rt){let s=rt.parentElement;for(let d=0;d<5&&s;d++){const svgs=[...s.querySelectorAll('svg')];if(svgs.length>=n){svgs[n-1].dispatchEvent(new MouseEvent('click',{bubbles:true}));return true;}s=s.parentElement;}}
  return false;
}

function swalTxt(){const e=document.querySelector('.swal2-html-container,.swal2-title,.swal2-content');return e?e.textContent.trim():'';}
function swalClick(btnText){for(const b of document.querySelectorAll('.swal2-confirm,.swal2-deny,.swal2-cancel,.swal2-close,.swal2-actions button,button')){const t=(b.innerText||b.textContent||'').trim().toLowerCase();if(btnText&&t.includes(btnText.toLowerCase())){b.click();return true;}}const b=document.querySelector('.swal2-confirm,.swal2-close');if(b){b.click();return true;}return false;}

async function fill(label,value,alts){let el=findLabel(label);if(!el&&alts)for(const a of alts){el=findLabel(a);if(el)break;}
  if(el){if(el.tagName==='SELECT'){if(setSel(el,value)){log(`  ${label}: ${value}`);return true;}}else{if(setVal(el,value)){log(`  ${label}: ${value}`);return true;}}}wrn(`  ${label}: TIDAK DIJUMPAI`);return false;}
async function checkPause(){while(paused&&running)await sleep(300);}

// ============================================================
//  PROCESS ONE BOOK
// ============================================================
async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title,note:'Dihentikan'};
  setProg(idx,total);
  log(`--- Buku ${idx+1}/${total}: ${book.title} ---`);

  if(!location.pathname.includes('/record/add/book')){
    log('Navigasi ke borang...');
    if(location.pathname.includes('/record/add')&&!location.pathname.includes('/book')){
      await sleep(DELAY*3);clickT('buku');await sleep(DELAY*2);clickT('seterusnya');await sleep(DELAY*6);
    }else{location.href='/record/add/book';await sleep(DELAY*8);}
  }

  const ok=await waitEl(()=>aInp().length>=3?true:null,15000);
  if(!ok){err('Borang tidak dimuatkan!');return{ok:false,title:book.title,note:'Borang tak load'};}
  await sleep(DELAY);swalClick();await checkPause();

  log('Step 1: Maklumat Buku');
  await fill('tajuk',book.title,['title']);await sleep(DELAY);await checkPause();
  clickT('e-buku');log('  Jenis: E-Buku');await sleep(DELAY);
  await fillDD('kategori',book.categoryLabel,0);await sleep(DELAY);await checkPause();
  await fill('mukasurat',book.pages,['bilangan','muka','page']);await sleep(DELAY);
  await fill('penulis',book.author,['pengarang','author']);await sleep(DELAY);
  await fill('penerbit',book.publisher,['publisher']);await sleep(DELAY);
  await fill('tahun',book.year,['terbitan','year']);await sleep(DELAY);await checkPause();
  await fillDD('bahasa',book.languageLabel,1);await sleep(DELAY);

  log('Klik Seterusnya...');clickT('seterusnya');await sleep(DELAY*3);await checkPause();

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

  for(let a=0;a<8;a++){
    if(!running)break;await sleep(DELAY*2);
    const sw=swalTxt();
    if(/berjaya|success|disimpan|tahniah/i.test(sw)){log('BERJAYA!');swalClick('ok');swalClick();addUsed(book.title);updateInfo();return{ok:true,title:book.title,note:sw};}
    if(/pasti|pastikan|confirm|sahkan|adakah|pengesahan/i.test(sw)){log('  Klik PASTI...');if(!swalClick('pasti'))swalClick('ya');await sleep(DELAY*5);
      const sw2=swalTxt();if(/berjaya|success|disimpan|tahniah/i.test(sw2)){log('BERJAYA!');swalClick('ok');swalClick();addUsed(book.title);updateInfo();return{ok:true,title:book.title,note:sw2};}continue;}
    if(/gagal|error|ralat|fail/i.test(sw)){err(`GAGAL: ${sw}`);swalClick();return{ok:false,title:book.title,note:sw};}
    if(clickT('simpan')||clickT('hantar')||clickT('submit')||clickT('selesai')){log('  Klik simpan/hantar...');await sleep(DELAY*5);continue;}
    if(clickT('seterusnya')){log('  Klik Seterusnya...');await sleep(DELAY*3);continue;}
    break;
  }

  await sleep(DELAY*2);const fin=swalTxt();
  if(/berjaya|success|disimpan|tahniah/i.test(fin)){swalClick('ok');swalClick();addUsed(book.title);updateInfo();return{ok:true,title:book.title,note:fin};}
  swalClick();return{ok:false,title:book.title,note:fin||'Tiada maklumbalas'};
}

// ============================================================
//  MAIN RUNNER
// ============================================================
async function startRun(){
  if(running)return;running=true;paused=false;
  const startBtn=document.getElementById('np-start'),pauseBtn=document.getElementById('np-pause'),stopBtn=document.getElementById('np-stop');
  startBtn.textContent='Berjalan...';startBtn.disabled=true;startBtn.className='nc-btn btn-off';
  pauseBtn.disabled=false;pauseBtn.className='nc-btn btn-pause';
  stopBtn.disabled=false;stopBtn.className='nc-btn btn-stop';

  const count=Math.min(+document.getElementById('np-count').value||5, 100);
  const used=getUsed();
  const available=BOOKS.filter(b=>!used.includes(b.title));

  if(available.length===0){err('Semua buku sudah dipakai! Tekan RESET SENARAI untuk mula semula.');running=false;return;}

  const batch=available.slice(0,count);
  log(`Memulakan ${batch.length} buku (${available.length} lagi tersedia)...`);

  let okC=0,failC=0,results=[];
  for(let i=0;i<batch.length;i++){
    if(!running)break;
    const res=await doBook(batch[i],i,batch.length);
    results.push(res);
    if(res.ok)okC++;else failC++;
    setStats(okC,failC);

    if(!running)break;
    if(i<batch.length-1){
      log('Sedia buku seterusnya...');await sleep(DELAY*3);
      swalClick('ok');swalClick();await sleep(DELAY);
      let nav=clickT('tambah lagi')||clickT('tambah rekod')||clickT('mula masukkan');
      if(!nav){try{const app=document.querySelector('#app');const router=app?.__vue_app__?.config?.globalProperties?.$router||app?.__vue__?.$router;if(router){router.push('/record/add/book');nav=true;}}catch(_){}}
      if(!nav)location.href='/record/add';
      await sleep(DELAY*8);
      if(location.pathname.includes('/record/add')&&!location.pathname.includes('/book')){clickT('buku');await sleep(DELAY*2);clickT('seterusnya');await sleep(DELAY*6);}
    }
  }

  log('=== SELESAI ===');
  startBtn.textContent='Mula';startBtn.disabled=false;startBtn.className='nc-btn btn-go';
  pauseBtn.disabled=true;pauseBtn.className='nc-btn btn-off';stopBtn.disabled=true;stopBtn.className='nc-btn btn-off';
  running=false;
  console.table(results.map((r,i)=>({No:i+1,Tajuk:r.title,Status:r.ok?'BERJAYA':'GAGAL',Nota:r.note||''})));
}

// ============================================================
//  INIT
// ============================================================
makeUI();
log('Memuat turun perpustakaan buku...');

try{
  const r=await fetch(LIB_URL);
  if(!r.ok)throw new Error('HTTP '+r.status);
  BOOKS=await r.json();
  log(`${BOOKS.length} buku sebenar dimuatkan.`);
  updateInfo();
}catch(e){
  err('Gagal muat perpustakaan: '+e.message);
  err('Cuba refresh halaman dan paste semula.');
}

document.getElementById('np-start').onclick=()=>startRun();
document.getElementById('np-pause').onclick=()=>{paused=!paused;document.getElementById('np-pause').textContent=paused?'Sambung':'Pause';log(paused?'DIJEDA...':'Disambung...');};
document.getElementById('np-stop').onclick=()=>{running=false;paused=false;log('DIHENTIKAN.');
  document.getElementById('np-start').textContent='Mula';document.getElementById('np-start').disabled=false;document.getElementById('np-start').className='nc-btn btn-go';};
document.getElementById('np-reset').onclick=()=>{if(confirm('Reset semua buku yang sudah dipakai?')){resetUsed();updateInfo();log('Senarai dipakai telah direset.');}};

log('Panel sedia. Set bilangan buku dan tekan MULA.');

})();
