// NILAM Auto-Fill v7.1
(async()=>{
'use strict';

const LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@aef7bad/books_library.json';
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const qs=s=>document.querySelector(s);
const UK='__nilam_used__';
const getUsed=()=>{try{return JSON.parse(localStorage.getItem(UK))||[];}catch{return[];}};
const markUsed=t=>{const u=getUsed();if(!u.includes(t)){u.push(t);localStorage.setItem(UK,JSON.stringify(u));}};
const resetUsed=()=>localStorage.removeItem(UK);

let BOOKS=[],DELAY=600,running=false,paused=false;

const pLog=m=>{const el=document.getElementById('nl');if(!el)return;
  const t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  const c=/BERJAYA/.test(m)?'ok':/GAGAL|RALAT|TIDAK/.test(m)?'er':/Step \d/.test(m)?'st':'';
  el.innerHTML+=`<div class="l ${c}"><span class="lt">${t}</span>${m}</div>`;el.scrollTop=1e6;};
const log=m=>{console.log('%c[NILAM] '+m,'color:#a78bfa;font-weight:bold');pLog(m);};
const err=m=>{console.error('[NILAM] '+m);pLog('[X] '+m);};

// DOM helpers
const vis=el=>el&&(el.offsetParent!==null||el.offsetWidth>0);
function findField(text){
  const lo=text.toLowerCase();
  for(const lb of document.querySelectorAll('label')){
    if(!lb.textContent.replace(/\*/g,'').trim().toLowerCase().includes(lo))continue;
    if(lb.htmlFor){const e=document.getElementById(lb.htmlFor);if(e&&vis(e))return e;}
    let p=lb.parentElement;
    for(let d=0;d<6&&p;d++){const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}
  }
  for(const n of document.querySelectorAll('span,div,p,td')){
    const t=n.textContent.replace(/\*/g,'').trim();
    if(t.length>50||t.length<2||!t.toLowerCase().includes(lo))continue;
    let p=n.parentElement;
    for(let d=0;d<6&&p;d++){const e=p.querySelector('input:not([type=hidden]):not([type=checkbox]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}
  }
  return null;
}
function setVal(el,v){if(!el)return false;const s=String(v);try{el.focus();}catch(_){}
  const P=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:el instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  const d=Object.getOwnPropertyDescriptor(P,'value');if(d&&d.set)d.set.call(el,s);else el.value=s;
  ['input','change','blur'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));
  if(el.__vue__)try{el.__vue__.$emit('input',s);}catch(_){}
  return true;}
function setSel(el,txt){if(!el||el.tagName!=='SELECT')return false;const lo=txt.toLowerCase();
  for(const o of el.options){if(o.text.toLowerCase().includes(lo)||o.value.toLowerCase().includes(lo)){el.value=o.value;['input','change'].forEach(e=>el.dispatchEvent(new Event(e,{bubbles:true})));return true;}}return false;}
function clickBtn(text){const lo=text.toLowerCase();
  for(const el of document.querySelectorAll('button,a,[role=button],.btn,input[type=submit],input[type=button],span')){
    if(!vis(el)||el.disabled)continue;const t=(el.innerText||el.textContent||el.value||'').trim();
    if(t.length>80||t.length<1)continue;if(t.toLowerCase().includes(lo)){el.click();return true;}}return false;}
async function waitFor(fn,ms=15000){const end=Date.now()+ms;while(Date.now()<end){const r=fn();if(r)return r;await sleep(400);}return null;}
const allInp=()=>[...document.querySelectorAll('input:not([type=hidden]):not([type=checkbox])')].filter(vis);
const allSel=()=>[...document.querySelectorAll('select')].filter(vis);
const allTxt=()=>[...document.querySelectorAll('textarea')].filter(vis);

async function fillField(label,value,alts){
  let el=findField(label);
  if(!el&&alts)for(const a of alts){el=findField(a);if(el)break;}
  if(!el){log('  [!] '+label+': tak jumpa');return false;}
  if(el.tagName==='SELECT')return setSel(el,value)?(log('  [OK] '+label),true):false;
  return setVal(el,value)?(log('  [OK] '+label),true):false;
}
async function fillDropdown(label,value,fbIdx){
  const el=findField(label);
  if(el&&el.tagName==='SELECT'&&setSel(el,value)){log('  [OK] '+label);return true;}
  const sels=allSel();
  if(typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)){log('  [OK] '+label+' [fb]');return true;}
  for(const toggle of document.querySelectorAll('.vs__dropdown-toggle,[role=combobox],[class*=v-select],[class*=dropdown]')){
    if(!vis(toggle))continue;let c=toggle;
    for(let d=0;d<6&&c;d++){const lbl=c.querySelector('label,span');
      if(lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().includes(label.toLowerCase())){
        toggle.click();await sleep(600);
        for(const opt of document.querySelectorAll('.vs__dropdown-option,[role=option],li,[class*=option]')){
          if((opt.innerText||'').trim().toLowerCase().includes(value.toLowerCase())){opt.click();await sleep(400);log('  [OK] '+label);return true;}}
        document.body.click();await sleep(200);}c=c.parentElement;}}
  log('  [!] '+label+': tak jumpa');return false;
}
function clickStar(n){
  for(const c of document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating]')){
    const items=c.querySelectorAll('svg,i,span,path');if(items.length>=n){items[n-1].click();return true;}}return false;}
function swalText(){
  var s='.swal2-html-container,.swal2-title,.swal2-content,.modal-body,.dialog-body,[class*=modal],[class*=dialog],[class*=popup],[class*=alert]';
  for(var el of document.querySelectorAll(s)){if(vis(el)&&el.textContent.trim().length>10)return el.textContent.trim();}
  return '';
}
function forceClick(el){
  if(!el)return;
  el.focus();
  el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true}));
  el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true}));
  el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  el.click();
}
function swalClick(txt){
  var sel='.swal2-actions button,.swal2-confirm,.swal2-cancel,.swal2-deny,.modal-footer button,[class*=modal] button,[class*=dialog] button,[class*=popup] button,[class*=alert] button,button';
  if(txt){var lo=txt.toLowerCase();for(var b of document.querySelectorAll(sel)){if(!vis(b))continue;var t=(b.innerText||b.textContent||'').trim().toLowerCase();if(t===lo||t.includes(lo)){forceClick(b);return true;}}}
  var b=document.querySelector('.swal2-confirm');if(b&&vis(b)){forceClick(b);return true;}
  return false;
}
async function clickNext(){for(let i=0;i<8;i++){if(clickBtn('seterusnya'))return true;await sleep(500);}return false;}
async function checkPause(){while(paused&&running)await sleep(300);}

// Process one book
async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};
  qs('#np-prog').textContent=(idx+1)+' / '+total;
  qs('#np-bar').style.width=((idx+1)/total*100)+'%';
  log('--- Buku '+(idx+1)+'/'+total+': '+book.title+' ---');

  // Navigate if needed
  if(!location.pathname.includes('/record/add/book')){
    log('Navigasi ke borang...');location.href='/record/add/book';await sleep(DELAY*10);
  }
  if(!await waitFor(()=>allInp().length>=3)){err('Borang tak load');return{ok:false,title:book.title};}
  await sleep(DELAY);swalClick();await checkPause();

  // Step 1
  log('Step 1: Maklumat Buku');
  await fillField('tajuk',book.title,['title']);await sleep(DELAY);
  clickBtn('e-buku');await sleep(DELAY);
  await fillDropdown('kategori',book.categoryLabel,0);await sleep(DELAY);await checkPause();
  await fillField('mukasurat',book.pages,['bilangan','muka','page']);await sleep(DELAY);
  await fillField('penulis',book.author,['pengarang','author']);await sleep(DELAY);
  await fillField('penerbit',book.publisher,['publisher']);await sleep(DELAY);
  await fillField('tahun',book.year,['terbitan','year']);await sleep(DELAY);await checkPause();
  await fillDropdown('bahasa',book.languageLabel,1);await sleep(DELAY);

  log('-> Seterusnya');await clickNext();await sleep(DELAY*4);await checkPause();

  // Step 2
  log('Step 2: Rumusan & Pengajaran');
  await waitFor(()=>allTxt().length>0,12000);await sleep(DELAY);
  const txts=allTxt();
  if(txts[0])setVal(txts[0],book.summary);
  if(txts[1])setVal(txts[1],book.review);
  clickStar(5);
  await sleep(DELAY);await checkPause();

  log('-> Seterusnya');await clickNext();await sleep(DELAY*4);

  // Step 3: Wait for Pasti confirmation, then success
  log('Step 3: Menunggu popup...');
  for(var a=0;a<30;a++){
    if(!running)break;await sleep(DELAY*2);
    // Check all visible buttons for "Pasti"
    var allBtns=[...document.querySelectorAll('button,a,[role=button]')].filter(vis);
    for(var btn of allBtns){
      var bt=(btn.innerText||btn.textContent||'').trim().toLowerCase();
      if(bt==='pasti'||bt==='ya'||bt==='confirm'){
        log('  -> Tekan: '+btn.textContent.trim());
        forceClick(btn);
        await sleep(DELAY*5);
        break;
      }
    }
    var sw=swalText();
    if(/berjaya|success|disimpan|tahniah/i.test(sw)){log('BERJAYA!');swalClick('ok');swalClick();return{ok:true,title:book.title};}
    if(/duplicate|pendua|sudah wujud|already exist/i.test(sw)){log('DUPLIKAT - skip, buku lain');swalClick('ok');swalClick();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
    if(/gagal|error|ralat|fail/i.test(sw)){err('GAGAL: '+sw);swalClick();return{ok:false,title:book.title};}
    // Also check if success button appeared
    for(var btn of allBtns){
      var bt=(btn.innerText||btn.textContent||'').trim().toLowerCase();
      if(bt==='ok'&&document.querySelector('.swal2-popup,.swal2-container,[class*=modal],[class*=dialog]')){
        forceClick(btn);await sleep(DELAY*2);
        var sw2=swalText();
        if(!sw2||/berjaya|success/i.test(sw2)){log('BERJAYA!');return{ok:true,title:book.title};}
      }
    }
    if(clickBtn('simpan')||clickBtn('hantar')||clickBtn('submit')||clickBtn('selesai')){log('  -> Klik simpan/hantar');await sleep(DELAY*4);continue;}
    if(clickBtn('seterusnya')){await sleep(DELAY*3);continue;}
  }
  return{ok:false,title:book.title};
}

// Main runner
async function startRun(){
  if(running||!BOOKS.length)return;running=true;paused=false;
  btnState('run');
  var used0=getUsed();
  var avail0=BOOKS.filter(function(b){return !used0.includes(b.title);});
  if(!avail0.length){err('Semua buku habis dipakai! Tekan Reset.');running=false;btnState('idle');return;}
  log('Memulakan... ('+avail0.length+' buku tersedia)');

  var ok=0,fail=0,dup=0,target=Math.min(+qs('#np-cnt').value||5,100);
  var idx=0;
  while(ok+fail<target&&running){
    var used=getUsed();
    var avail=BOOKS.filter(function(b){return !used.includes(b.title);});
    if(!avail.length){err('Semua buku habis dipakai! Tekan Reset.');break;}
    var book=avail[0];
    markUsed(book.title);
    updateStats();
    var res=await doBook(book,idx,target);
    if(res.ok){ok++;}
    else if(res.dup){dup++;log('Duplikat #'+dup+' - cuba buku lain...');}
    else{fail++;}
    qs('#np-ok').textContent=ok;qs('#np-fl').textContent=fail;
    idx++;
    if(ok+fail<target&&running){
      log('Sedia buku seterusnya...');await sleep(DELAY*3);
      swalClick('ok');swalClick();await sleep(DELAY);
      clickBtn('tambah lagi')||clickBtn('tambah rekod');
      await sleep(DELAY*8);
    }
  }
  log('== SELESAI == OK:'+ok+' Gagal:'+fail+' Duplikat:'+dup);
  running=false;btnState('idle');
}

// UI
function updateStats(){
  const used=getUsed();
  qs('#np-lib').textContent=BOOKS.length;
  qs('#np-rem').textContent=BOOKS.length-used.length;
  qs('#np-usd').textContent=used.length;
}
function btnState(s){
  const go=qs('#np-go'),pa=qs('#np-pa'),st=qs('#np-st');
  if(s==='run'){go.disabled=true;go.textContent='Berjalan...';pa.disabled=false;st.disabled=false;}
  else{go.disabled=false;go.textContent='Mula';pa.disabled=true;st.disabled=true;pa.textContent='Pause';}
}

function makeUI(){
  if(qs('#NP'))qs('#NP').remove();
  const w=document.createElement('div');w.id='NP';
  w.innerHTML=`<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
*{box-sizing:border-box}
#NP{position:fixed;top:12px;right:12px;width:360px;max-width:calc(100vw - 24px);z-index:2147483647;
  font-family:'Inter',-apple-system,system-ui,sans-serif;font-size:13px;touch-action:none;user-select:none;-webkit-user-select:none}
@media(max-width:440px){#NP{width:calc(100vw - 16px);right:8px;top:8px;font-size:12px}}

/* Card */
.np-card{background:#0f0b1e;border:1px solid rgba(147,130,255,.15);border-radius:20px;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 0 1px rgba(147,130,255,.06),0 0 100px -20px rgba(124,58,237,.12)}

/* Header */
.np-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;
  background:linear-gradient(135deg,rgba(124,58,237,.1),rgba(99,102,241,.06));cursor:grab;touch-action:none}
.np-hd:active{cursor:grabbing}
.np-hd-l{display:flex;align-items:center;gap:10px}
.np-ico{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:17px;
  background:linear-gradient(135deg,#7c3aed,#6366f1);box-shadow:0 4px 14px rgba(99,102,241,.45)}
.np-ttl{font-size:14px;font-weight:800;letter-spacing:-.4px;color:#c4b5fd}
.np-hd-r{display:flex;align-items:center;gap:6px}
.np-ver{font-size:8px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#7c3aed;
  background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.18);padding:2px 8px;border-radius:6px}
.np-x{width:26px;height:26px;border-radius:8px;border:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.3);
  font-size:15px;cursor:pointer;display:grid;place-items:center;transition:.15s}
.np-x:active{background:rgba(124,58,237,.25);color:#fff}

/* Stats row */
.np-stats{display:flex;padding:8px 18px;gap:6px}
.np-stat{flex:1;text-align:center;padding:8px 0;border-radius:10px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.08)}
.np-stat-n{font-size:18px;font-weight:800;color:#c4b5fd;line-height:1.2}
.np-stat-l{font-size:9px;font-weight:600;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}

/* Controls */
.np-ctrl{padding:12px 18px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(124,58,237,.06)}
.np-btn{flex:1;min-width:80px;height:38px;border:none;border-radius:10px;font-size:11px;font-weight:700;
  cursor:pointer;text-transform:uppercase;letter-spacing:.4px;transition:.2s}
.np-btn:active{transform:scale(.95)}
.np-btn:disabled{opacity:.35;pointer-events:none}
.b-go{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;box-shadow:0 4px 16px rgba(109,40,217,.35)}
.b-go:not(:disabled):active{box-shadow:0 2px 8px rgba(109,40,217,.5)}
.b-pa{background:rgba(251,191,36,.08);color:#fcd34d;border:1px solid rgba(251,191,36,.12)}
.b-st{background:rgba(248,113,113,.08);color:#fca5a5;border:1px solid rgba(248,113,113,.1)}
.b-rs{flex:none;width:auto;padding:0 12px;background:rgba(124,58,237,.08);color:#a78bfa;border:1px solid rgba(124,58,237,.1);font-size:10px}

/* Settings row */
.np-set{display:flex;align-items:center;gap:8px;padding:6px 18px;color:rgba(255,255,255,.35);font-size:11px;font-weight:500}
.np-set label{min-width:48px}
.np-set input[type=range]{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:rgba(124,58,237,.15);border-radius:4px;outline:none}
.np-set input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;
  background:#7c3aed;box-shadow:0 2px 6px rgba(124,58,237,.4);cursor:pointer}
.np-set input[type=number]{width:50px;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.12);
  border-radius:7px;color:#c4b5fd;padding:5px;font-size:12px;text-align:center;font-weight:700;font-family:inherit;outline:none}
.np-set .vl{min-width:36px;text-align:right;color:#a78bfa;font-weight:700;font-size:11px}

/* Progress */
.np-prg{padding:10px 18px 6px}
.np-bar-bg{height:5px;background:rgba(124,58,237,.1);border-radius:9px;overflow:hidden}
.np-bar-fg{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a78bfa);border-radius:9px;transition:width .6s ease;box-shadow:0 0 10px rgba(124,58,237,.3)}
.np-prg-t{text-align:center;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;font-weight:600;letter-spacing:.3px}

/* Log */
.np-log{padding:4px 18px 12px;max-height:140px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(124,58,237,.15) transparent}
.np-log::-webkit-scrollbar{width:3px}.np-log::-webkit-scrollbar-thumb{background:rgba(124,58,237,.2);border-radius:3px}
.l{padding:3px 0;font-size:10.5px;color:rgba(255,255,255,.35);line-height:1.5;display:flex;gap:6px;border-bottom:1px solid rgba(255,255,255,.02)}
.l .lt{color:rgba(124,58,237,.3);font-size:9px;font-family:monospace;flex-shrink:0}
.l.ok{color:#6ee7b7}.l.er{color:#fca5a5}.l.st{color:#c4b5fd;font-weight:700}

/* Footer */
.np-ft{display:flex;justify-content:center;gap:20px;padding:10px 18px;border-top:1px solid rgba(124,58,237,.06);background:rgba(0,0,0,.15)}
.np-ft-i{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700}
.np-ft-i.g{color:#6ee7b7}.np-ft-i.r{color:#fca5a5}
.np-dot{width:8px;height:8px;border-radius:50%}
.np-ft-i.g .np-dot{background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.5)}
.np-ft-i.r .np-dot{background:#f87171;box-shadow:0 0 8px rgba(248,113,113,.5)}
</style>
<div class="np-card">
  <div class="np-hd" id="np-hd">
    <div class="np-hd-l"><div class="np-ico">N</div><span class="np-ttl">NILAM Auto-Fill</span></div>
    <div class="np-hd-r"><span class="np-ver">v7.1</span><button class="np-x" id="np-mn">-</button></div>
  </div>
  <div id="np-body">
    <div class="np-stats">
      <div class="np-stat"><div class="np-stat-n" id="np-lib">-</div><div class="np-stat-l">Jumlah</div></div>
      <div class="np-stat"><div class="np-stat-n" id="np-rem">-</div><div class="np-stat-l">Tinggal</div></div>
      <div class="np-stat"><div class="np-stat-n" id="np-usd">0</div><div class="np-stat-l">Dipakai</div></div>
    </div>
    <div class="np-ctrl">
      <button class="np-btn b-go" id="np-go" disabled>Memuatkan...</button>
      <button class="np-btn b-pa" id="np-pa" disabled>Pause</button>
      <button class="np-btn b-st" id="np-st" disabled>Stop</button>
      <button class="np-btn b-rs" id="np-rs">Reset</button>
    </div>
    <div class="np-set">
      <label>Buku</label><input type="number" id="np-cnt" min="1" max="100" value="5">
    </div>
    <div class="np-set">
      <label>Delay</label><input type="range" id="np-dly" min="300" max="2000" value="600" step="100"><span class="vl" id="np-dvl">600ms</span>
    </div>
    <div class="np-prg">
      <div class="np-bar-bg"><div class="np-bar-fg" id="np-bar"></div></div>
      <div class="np-prg-t" id="np-prog">Memuatkan perpustakaan...</div>
    </div>
    <div class="np-log" id="nl"></div>
  </div>
  <div class="np-ft" id="np-ft">
    <div class="np-ft-i g"><span class="np-dot"></span><span id="np-ok">0</span> Berjaya</div>
    <div class="np-ft-i r"><span class="np-dot"></span><span id="np-fl">0</span> Gagal</div>
  </div>
</div>`;
  document.body.appendChild(w);

  // Drag: mouse + touch
  const hd=document.getElementById('np-hd');let dr=false,ox=0,oy=0;
  const ds=(cx,cy)=>{dr=true;const r=w.getBoundingClientRect();ox=cx-r.left;oy=cy-r.top;};
  const dm=(cx,cy)=>{if(!dr)return;w.style.left=Math.max(0,Math.min(cx-ox,innerWidth-w.offsetWidth))+'px';
    w.style.top=Math.max(0,Math.min(cy-oy,innerHeight-60))+'px';w.style.right='auto';};
  const de=()=>{dr=false;};
  hd.addEventListener('mousedown',e=>{e.preventDefault();ds(e.clientX,e.clientY);});
  document.addEventListener('mousemove',e=>dm(e.clientX,e.clientY));
  document.addEventListener('mouseup',de);
  hd.addEventListener('touchstart',e=>{if(e.touches.length===1){e.preventDefault();ds(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchmove',e=>{if(dr&&e.touches.length===1){e.preventDefault();dm(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchend',de);document.addEventListener('touchcancel',de);

  // Minimize
  let mini=false;
  document.getElementById('np-mn').onclick=()=>{mini=!mini;
    document.getElementById('np-body').style.display=mini?'none':'';
    document.getElementById('np-ft').style.display=mini?'none':'';
    document.getElementById('np-mn').textContent=mini?'+':'-';};

  // Delay slider
  document.getElementById('np-dly').oninput=function(){DELAY=+this.value;document.getElementById('np-dvl').textContent=DELAY+'ms';};

  // Buttons
  document.getElementById('np-go').onclick=startRun;
  document.getElementById('np-pa').onclick=()=>{paused=!paused;document.getElementById('np-pa').textContent=paused?'Sambung':'Pause';log(paused?'DIJEDA':'Disambung');};
  document.getElementById('np-st').onclick=()=>{running=false;paused=false;log('DIHENTIKAN');btnState('idle');};
  document.getElementById('np-rs').onclick=()=>{if(confirm('Reset semua buku yang sudah dipakai?')){resetUsed();updateStats();log('Senarai direset');}};
}

// Init
makeUI();
log('Memuat turun 1117 buku...');

try{
  const r=await fetch(LIB_URL);if(!r.ok)throw new Error('HTTP '+r.status);
  BOOKS=await r.json();
  log(BOOKS.length+' buku sebenar dimuatkan');
  updateStats();
  const go=document.getElementById('np-go');
  go.disabled=false;go.textContent='Mula';go.className='np-btn b-go';
  document.getElementById('np-prog').textContent='Sedia. Tekan MULA.';
}catch(e){
  err('Gagal muat: '+e.message);
  document.getElementById('np-prog').textContent='Gagal muat data!';
}

})();
