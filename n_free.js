// NILAM Auto-Fill v1.0 (FREE EDITION)
// Percubaan 5 buku sahaja. Ciri perlindungan dimatikan.
console.log('%c[NILAM] Versi Percuma (FREE) sedang dimuatkan...','color:#a78bfa;font-weight:bold;font-size:14px');
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/books_library.json';
var UK='__nilam_used_free__'; // Separate tracking for free version
var BOOKS=[],DELAY=3500,running=false,paused=false; // Slowed down significantly

// Supabase Cloud Memory config (Still sends telemetry but no cloud tracking for free users)
var SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw';

// Minimal Nav Guard (No WAF Bypass, no JSON injection)
function installNavGuard(){
  if(window.Swal&&window.Swal.fire){
    var _origFire=window.Swal.fire;
    window.Swal.fire=function(){
      var result=_origFire.apply(this,arguments);
      if(result&&typeof result.then==='function'){
        var _origThen=result.then;
        result.then=function(onFulfilled,onRejected){
          return _origThen.call(this,function(val){
            if(window.__nilamBlock){window.__nilamBlock=false;return new Promise(function(){});}
            if(typeof onFulfilled==='function')return onFulfilled(val);
          },onRejected);
        };
      }
      return result;
    };
  }
}

// Basic Rating Guard
function installRatingGuard(){
  try{
    var appEl=document.querySelector('#app')||document.querySelector('[data-app]');
    if(!appEl) return;
    var root = appEl.__vue__ || appEl.__vue_app__;
    if(!root) return;
    var rtg = 5;
    var queue=[root]; var visited=0;
    while(queue.length && visited<300){
      var c=queue.shift(); visited++;
      if(!c) continue;
      var targets = [c, c.$data, (c.$refs||{}), (c.form||{}), (c.record||{})];
      for(var i=0; i<targets.length; i++){
        var t = targets[i]; if(!t || typeof t !== 'object') continue;
        if(t.type === 'book' || t.title !== undefined || t.point !== undefined || t.rating !== undefined){
          if(t.point===undefined||t.point===null||t.point===0) t.point=rtg;
        }
      }
      if(typeof c.submitRecord==='function' && !c.__nilamRG){
        c.__nilamRG=true;
        var _orig=c.submitRecord;
        c.submitRecord=function(){ return _orig.apply(this,arguments); };
      }
      if(c.$children){for(var ci=0;ci<c.$children.length;ci++)queue.push(c.$children[ci]);}
      if(c._instance && c._instance.subTree) queue.push(c._instance.proxy);
    }
  }catch(x){}
}

function sleep(ms){return new Promise(function(r){setTimeout(r,ms)});}
function qs(s){return document.querySelector(s);}

// Basic Telemetry
async function sendTelemetry(ok, fail, tgt, statusMsg) {
  var uid = window.__nilamUserId || "FreeUser-" + Math.floor(Math.random()*9000+1000);
  window.__nilamUserId = uid;
  var payload = '__TEL__|' + uid + '|' + Date.now() + '|' + ok + '|' + fail + '|' + tgt + '|' + statusMsg + ' [FREE]';
  try {
    fetch(SUPA_URL + '?title=like.__TEL__|' + uid + '|*', { method: 'DELETE', headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } })
    .then(function() {
      fetch(SUPA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY },
        body: JSON.stringify({ title: payload })
      });
    });
  } catch(e){}
}

async function getUsed(){
  try { return JSON.parse(localStorage.getItem(UK)) || []; } catch (e) { return []; }
}

async function markUsed(t){
  try {
    var u = JSON.parse(localStorage.getItem(UK)) || [];
    if (u.indexOf(t) < 0) { u.push(t); localStorage.setItem(UK, JSON.stringify(u)); }
  } catch (e) {}
}

async function resetUsedList(){ localStorage.removeItem(UK); }

function pLog(m){var el=document.getElementById('nl');if(!el)return;
  var t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var c='';if(/BERJAYA/.test(m))c='ok';else if(/GAGAL|RALAT|TIDAK|\[X\]/.test(m))c='er';else if(/Step \d/.test(m))c='st';
  el.innerHTML+='<div class="l '+c+'"><span class="lt">'+t+'</span>'+m+'</div>';el.scrollTop=1e6;}
function log(m){console.log('%c[NILAM] '+m,'color:#a78bfa;font-weight:bold');pLog(m);}
function err(m){console.error('[NILAM] '+m);pLog('[X] '+m);}

function vis(el){return el&&(el.offsetParent!==null||el.offsetWidth>0);}
function isOurPanel(el){if(!el)return false;try{return el.closest&&el.closest('#NP');}catch(x){return false;}}
function isDateInput(el){
  if(!el||el.tagName!=='INPUT')return false;
  var t=el.type;if(t==='date'||t==='datetime-local'||t==='time'||t==='month'||t==='week')return true;
  return false;
}
function closeDatePicker(){
  var overlays=document.querySelectorAll('.modal,.v-dialog,.v-overlay,.v-overlay__content,[role=dialog]');
  for(var i=0;i<overlays.length;i++){
    if(!vis(overlays[i])||isOurPanel(overlays[i]))continue;
    var m=overlays[i].closest('.modal');if(m&&m.id==='LanguageModal')continue;
    var btns=overlays[i].querySelectorAll('button,a,.btn');
    for(var j=0;j<btns.length;j++){
      var bt=(btns[j].innerText||'').trim().toLowerCase();
      if(bt==='batal'||bt==='cancel'||bt==='tutup'){forceClick(btns[j]);return true;}
    }
  }
  return false;
}
function findField(text){
  var lo=text.toLowerCase();
  var inps=document.querySelectorAll('input,select,textarea');
  for(var i=0;i<inps.length;i++){
    var e=inps[i];if(!vis(e)||isOurPanel(e)||isDateInput(e))continue;
    var att=(e.placeholder||e.getAttribute('aria-label')||'').toLowerCase();
    if(att.indexOf(lo)>=0)return e;
  }
  var labels=document.querySelectorAll('label');
  for(var i=0;i<labels.length;i++){
    var lb=labels[i];
    if(lb.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)>=0){
        var p=lb.parentElement;
        for(var d=0;d<3&&p;d++){
            var e=p.querySelector('input,select,textarea');
            if(e&&vis(e)&&!isDateInput(e))return e;
            p=p.parentElement;
        }
    }
  }
  return null;
}
function setVal(el,v){if(!el)return false;var s=String(v);el.value=s;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;}
function setSel(el,txt){if(!el||el.tagName!=='SELECT')return false;var lo=txt.toLowerCase();
  for(var i=0;i<el.options.length;i++){var o=el.options[i];if(o.text.toLowerCase().indexOf(lo)>=0){el.value=o.value;el.dispatchEvent(new Event('change',{bubbles:true}));return true;}}return false;}
function forceClick(el){
  if(!el)return;
  var opts={bubbles:true,cancelable:true};
  el.dispatchEvent(new MouseEvent('mousedown',opts));el.dispatchEvent(new MouseEvent('mouseup',opts));el.dispatchEvent(new MouseEvent('click',opts));
  try{el.click();}catch(x){}
}
function clickBtn(text){
  var lo=text.toLowerCase();
  var els=document.querySelectorAll('button,a,[role=button],.btn,input[type=submit]');
  for(var i=0;i<els.length;i++){
    var el=els[i];if(!vis(el)||el.disabled||isOurPanel(el))continue;
    var t=(el.innerText||el.textContent||'').trim().toLowerCase();
    if(t.indexOf(lo)>=0){forceClick(el);return true;}
  }
  return false;
}
function clickRadio(text){
  var lo=text.toLowerCase();
  var radios=document.querySelectorAll('input[type=radio]');
  for(var i=0;i<radios.length;i++){
    var val=(radios[i].value||'').toLowerCase();
    if(val.indexOf(lo)>=0){radios[i].checked=true;forceClick(radios[i]);return true;}
  }
  return false;
}

function waitFor(fn,ms){ms=ms||15000;var end=Date.now()+ms;return new Promise(function(resolve){(function check(){var r=fn();if(r)return resolve(r);if(Date.now()>=end)return resolve(null);setTimeout(check,400);})();});}
function allInp(){var r=[];var els=document.querySelectorAll('input:not([type=hidden]):not([type=checkbox])');for(var i=0;i<els.length;i++)if(vis(els[i])&&!isOurPanel(els[i]))r.push(els[i]);return r;}
function allTxt(){var r=[];var els=document.querySelectorAll('textarea');for(var i=0;i<els.length;i++)if(vis(els[i])&&!isOurPanel(els[i]))r.push(els[i]);return r;}

async function fillField(label,value,alts){
  var el=findField(label);
  if(!el&&alts){for(var i=0;i<alts.length;i++){el=findField(alts[i]);if(el)break;}}
  if(!el) return false;
  if(el.tagName==='SELECT') return setSel(el,value);
  return setVal(el,value);
}

function swalText(){
  var els=document.querySelectorAll('.swal2-html-container,.swal2-title,.swal2-content');
  for(var i=0;i<els.length;i++)if(vis(els[i]))return els[i].textContent.trim();
  return '';
}
function swalClick(){
  var els=document.querySelectorAll('.swal2-confirm');
  if(els[0]&&vis(els[0])){forceClick(els[0]);return true;}
  return false;
}
function closeAllPopups(){
  var swalBtns=document.querySelectorAll('.swal2-confirm,.swal2-cancel,.swal2-close');
  for(var i=0;i<swalBtns.length;i++)if(vis(swalBtns[i]))forceClick(swalBtns[i]);
}

async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};

  qs('#np-prog').textContent=(idx+1)+' / '+total;
  qs('#np-bar').style.width=((idx+1)/total*100)+'%';
  log('--- Buku (FREE) '+(idx+1)+'/'+total+': '+book.title+' ---');

  if(location.pathname.indexOf('/record/add/book')<0) location.href='/record/add/book';
  
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await sleep(1000);swalClick();

  log('Step 1: Maklumat Buku');
  closeDatePicker();
  await fillField('tajuk',book.title,['title']);await sleep(1000);
  clickBtn('buku fizikal');await sleep(1000);
  await fillField('mukasurat',book.pages,['bilangan']);await sleep(1000);
  await fillField('penulis',book.author,['pengarang']);await sleep(1000);
  await fillField('penerbit',book.publisher,['publisher']);await sleep(1000);
  await fillField('tahun',book.year,['year']);await sleep(1000);
  
  clickBtn('seterusnya');
  await sleep(4000);

  log('Step 2: Rumusan & Penilaian');
  await waitFor(function(){return allTxt().length>0?true:null;},15000);await sleep(2000);
  var txts=allTxt();
  if(txts[0]) setVal(txts[0],book.summary);
  if(txts[1]) setVal(txts[1],book.review);
  await sleep(3000);

  installRatingGuard();
  var stars = document.querySelectorAll('svg,i,.v-icon');
  if(stars.length>3) forceClick(stars[3]);
  await sleep(2000);
  
  clickBtn('seterusnya');
  await sleep(4000);

  log('Step 3: Pengesahan & Hantar');
  var hasClickedHantar = false;

  for(var a=0;a<20;a++){
    if(!running)break;
    
    if(!hasClickedHantar && (clickBtn('hantar') || clickBtn('simpan') || clickBtn('submit'))){
        log('  -> Klik Hantar (Versi Percuma lambat)');
        await sleep(DELAY * 3); // Extra penalty delay for free
        hasClickedHantar=true;
    }
    
    await sleep(2000);
    
    var sw=swalText();
    if(sw){
      if(/limit exceeded|too many requests|429/i.test(sw)){ err('  [!] Kena Block! Anda guna versi percuma.'); closeAllPopups(); return {ok:false, title:book.title}; }
      if(/berjaya|success|disimpan/i.test(sw)){log('BERJAYA!');window.__nilamBlock=true;return{ok:true,title:book.title};}
      swalClick();await sleep(3000);
    }
  }
  return{ok:false,title:book.title};
}

async function startRun(){
  if(running||!BOOKS.length)return;running=true;paused=false;
  installNavGuard();
  installRatingGuard();
  btnState('run');
  
  // HARD LIMIT FOR FREE VERSION
  var maxBooks = Math.min(parseInt(qs('#np-cnt').value)||5, 5); // MAX 5
  if(parseInt(qs('#np-cnt').value) > 5) {
      alert("⚠️ Versi PERCUMA dihadkan kepada 5 buku sahaja untuk satu sesi. Sila upgrade ke versi PRO.");
  }
  
  log('Memulakan Versi PERCUMA... (Had: 5 Buku)');
  sendTelemetry(0, 0, maxBooks, 'Bermula (FREE VERSION)');

  var ok=0,fail=0,idx=0;
  while(ok+fail<maxBooks&&running){
    sendTelemetry(ok, fail, maxBooks, 'Sedang submit buku (FREE)...');
    var book=BOOKS[idx];
    if(!book) break;
    await markUsed(book.title);
    var res=await doBook(book,idx,maxBooks);
    if(res.ok) ok++; else fail++;
    qs('#np-ok').textContent=ok;qs('#np-fl').textContent=fail;
    idx++;
    if(ok+fail<maxBooks&&running){
      log('Sedia buku seterusnya (Sangat lambat)...');
      await sleep(5000); // Penalty sleep
      location.href='/record/add/book';
      await sleep(4000);
    }
  }
  log('== SELESAI (FREE) == OK:'+ok+' Gagal:'+fail);
  sendTelemetry(ok, fail, maxBooks, 'Selesai (FREE)');
  running=false;btnState('idle');
}

function updateStats(){
    qs('#np-lib').textContent=BOOKS.length;
}
function btnState(s){
  var go=qs('#np-go'),st=qs('#np-st');
  if(s==='run'){go.disabled=true;go.textContent='Berjalan...';st.disabled=false;}
  else{go.disabled=false;go.textContent='Mula';st.disabled=true;}
}

function makeUI(){
  var old=document.getElementById('NP');if(old)old.remove();
  var w=document.createElement('div');w.id='NP';
  var css='';
  css+='#NP{position:fixed;top:12px;right:12px;width:320px;z-index:2147483647;font-family:sans-serif;font-size:12px}';
  css+='.np-card{background:#2d3748;border:2px solid #94a3b8;border-radius:12px;overflow:hidden;color:#fff}';
  css+='.np-hd{background:#475569;padding:10px;text-align:center;font-weight:bold;cursor:move}';
  css+='.np-warn{background:#ef4444;color:#fff;font-size:10px;padding:4px;text-align:center;font-weight:bold}';
  css+='.np-ctrl{padding:10px;display:flex;gap:5px}';
  css+='.np-btn{flex:1;padding:8px;border:none;border-radius:6px;font-weight:bold;cursor:pointer}';
  css+='.b-go{background:#3b82f6;color:#fff}.b-st{background:#ef4444;color:#fff}';
  css+='.np-set{padding:5px 10px;display:flex;justify-content:space-between}';
  css+='.np-set input{width:50px}';
  css+='.np-prg{padding:10px;text-align:center}';
  css+='.np-log{height:100px;overflow-y:auto;background:#1e293b;padding:5px;font-family:monospace;font-size:10px}';
  
  var html='';
  html+='<div class="np-card">';
  html+='<div class="np-hd" id="np-hd">NILAM Auto-Fill (FREE)</div>';
  html+='<div class="np-warn">Had 5 Buku Saja. Tiada Bypass WAF. Agak Lambat.</div>';
  html+='<div class="np-ctrl">';
  html+='<button class="np-btn b-go" id="np-go" disabled>Tunggu...</button>';
  html+='<button class="np-btn b-st" id="np-st" disabled>Stop</button>';
  html+='</div>';
  html+='<div class="np-set"><label>Buku (Max 5)</label><input type="number" id="np-cnt" min="1" max="5" value="5"></div>';
  html+='<div class="np-prg" id="np-prog">Memuatkan...</div>';
  html+='<div class="np-log" id="nl"></div>';
  html+='<div class="np-set"><span>OK: <span id="np-ok">0</span></span><span>Fail: <span id="np-fl">0</span></span></div>';
  html+='</div>';

  var styleEl=document.createElement('style');styleEl.textContent=css;
  w.appendChild(styleEl);
  var container=document.createElement('div');container.innerHTML=html;
  w.appendChild(container.firstChild);
  document.body.appendChild(w);

  document.getElementById('np-go').onclick=startRun;
  document.getElementById('np-st').onclick=function(){running=false;log('DIHENTIKAN');btnState('idle');};
}

makeUI();
log('Memuat turun perpustakaan (FREE)...');

try{
  var r=await fetch(LIB_URL + '?v=' + Date.now());if(!r.ok)throw new Error('HTTP '+r.status);
  BOOKS=await r.json();
  var go=document.getElementById('np-go');
  go.disabled=false;go.textContent='Mula';
  document.getElementById('np-prog').textContent='Sedia. Had 5 buku.';
  sendTelemetry(0, 0, 0, 'Standby (FREE)');
}catch(e){
  err('Gagal muat: '+e.message);
}

})();