// NILAM Auto-Fill v8.0
// 1117 buku sebenar. Zero arrow functions. Zero template literals. Max compatibility.
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@aef7bad/books_library.json';
var UK='__nilam_used__';
var BOOKS=[],DELAY=600,running=false,paused=false;

function sleep(ms){return new Promise(function(r){setTimeout(r,ms)});}
function qs(s){return document.querySelector(s);}
function getUsed(){try{return JSON.parse(localStorage.getItem(UK))||[];}catch(e){return[];}}
function markUsed(t){var u=getUsed();if(u.indexOf(t)<0){u.push(t);localStorage.setItem(UK,JSON.stringify(u));}}
function resetUsedList(){localStorage.removeItem(UK);}

function pLog(m){var el=document.getElementById('nl');if(!el)return;
  var t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var c='';if(/BERJAYA/.test(m))c='ok';else if(/GAGAL|RALAT|TIDAK|\[X\]/.test(m))c='er';else if(/Step \d/.test(m))c='st';
  el.innerHTML+='<div class="l '+c+'"><span class="lt">'+t+'</span>'+m+'</div>';el.scrollTop=1e6;}
function log(m){console.log('%c[NILAM] '+m,'color:#a78bfa;font-weight:bold');pLog(m);}
function err(m){console.error('[NILAM] '+m);pLog('[X] '+m);}

// DOM helpers
function vis(el){return el&&(el.offsetParent!==null||el.offsetWidth>0);}
function findField(text){
  var lo=text.toLowerCase();var i,d,p,e,lb,n;
  var labels=document.querySelectorAll('label');
  for(i=0;i<labels.length;i++){lb=labels[i];
    if(lb.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)<0)continue;
    if(lb.htmlFor){e=document.getElementById(lb.htmlFor);if(e&&vis(e))return e;}
    p=lb.parentElement;
    for(d=0;d<6&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}
  }
  var nodes=document.querySelectorAll('span,div,p,td');
  for(i=0;i<nodes.length;i++){n=nodes[i];
    var txt=n.textContent.replace(/\*/g,'').trim();
    if(txt.length>50||txt.length<2||txt.toLowerCase().indexOf(lo)<0)continue;
    p=n.parentElement;
    for(d=0;d<6&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]),select,textarea');if(e&&vis(e))return e;p=p.parentElement;}
  }
  return null;
}
function setVal(el,v){if(!el)return false;var s=String(v);try{el.focus();}catch(x){}
  var P=el instanceof HTMLTextAreaElement?HTMLTextAreaElement.prototype:el instanceof HTMLSelectElement?HTMLSelectElement.prototype:HTMLInputElement.prototype;
  var d=Object.getOwnPropertyDescriptor(P,'value');if(d&&d.set)d.set.call(el,s);else el.value=s;
  var evts=['input','change','blur'];for(var i=0;i<evts.length;i++)el.dispatchEvent(new Event(evts[i],{bubbles:true}));
  if(el.__vue__)try{el.__vue__.$emit('input',s);}catch(x){}
  return true;}
function setSel(el,txt){if(!el||el.tagName!=='SELECT')return false;var lo=txt.toLowerCase();
  var i;for(i=0;i<el.options.length;i++){var o=el.options[i];if(o.text.toLowerCase().indexOf(lo)>=0||o.value.toLowerCase().indexOf(lo)>=0){el.value=o.value;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;}}return false;}
function clickBtn(text){var lo=text.toLowerCase();var els=document.querySelectorAll('button,a,[role=button],.btn,input[type=submit],input[type=button],span');
  for(var i=0;i<els.length;i++){var el=els[i];if(!vis(el)||el.disabled)continue;var t=(el.innerText||el.textContent||el.value||'').trim();
    if(t.length>80||t.length<1)continue;if(t.toLowerCase().indexOf(lo)>=0){el.click();return true;}}return false;}
function waitFor(fn,ms){ms=ms||15000;var end=Date.now()+ms;return new Promise(function(resolve){(function check(){var r=fn();if(r)return resolve(r);if(Date.now()>=end)return resolve(null);setTimeout(check,400);})();});}
function allInp(){var r=[];var els=document.querySelectorAll('input:not([type=hidden]):not([type=checkbox])');for(var i=0;i<els.length;i++)if(vis(els[i]))r.push(els[i]);return r;}
function allSel(){var r=[];var els=document.querySelectorAll('select');for(var i=0;i<els.length;i++)if(vis(els[i]))r.push(els[i]);return r;}
function allTxt(){var r=[];var els=document.querySelectorAll('textarea');for(var i=0;i<els.length;i++)if(vis(els[i]))r.push(els[i]);return r;}

async function fillField(label,value,alts){
  var el=findField(label);
  if(!el&&alts){for(var i=0;i<alts.length;i++){el=findField(alts[i]);if(el)break;}}
  if(!el){log('  [!] '+label+': tak jumpa');return false;}
  if(el.tagName==='SELECT'){if(setSel(el,value)){log('  [OK] '+label);return true;}return false;}
  if(setVal(el,value)){log('  [OK] '+label);return true;}return false;
}
async function fillDropdown(label,value,fbIdx){
  var lo=label.toLowerCase();var vlo=value.toLowerCase();var i,j,d;
  // Strategy 1: find by label
  var el=findField(label);
  if(el&&el.tagName==='SELECT'&&setSel(el,value)){log('  [OK] '+label);return true;}
  // Strategy 2: fallback by index
  var sels=allSel();
  if(typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)){log('  [OK] '+label+' [fb#'+fbIdx+']');return true;}
  // Strategy 3: try ALL selects
  for(i=0;i<sels.length;i++){if(setSel(sels[i],value)){log('  [OK] '+label+' [sel#'+i+']');return true;}}
  // Strategy 4: vue-select / custom dropdown - search near label
  var toggleSel='.vs__dropdown-toggle,[role=combobox],[role=listbox],[class*=v-select],[class*=dropdown],[class*=select],[class*=picker],[class*=chosen]';
  var toggles=document.querySelectorAll(toggleSel);
  for(i=0;i<toggles.length;i++){
    var toggle=toggles[i];if(!vis(toggle))continue;var c=toggle;
    for(d=0;d<6&&c;d++){var lbl=c.querySelector('label,span,div,p');
      if(lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)>=0){
        toggle.click();await sleep(800);
        var optSel='.vs__dropdown-option,[role=option],.dropdown-item,li,.option,[class*=option],[class*=item]';
        var opts=document.querySelectorAll(optSel);
        for(j=0;j<opts.length;j++){
          var ot=(opts[j].innerText||opts[j].textContent||'').trim().toLowerCase();
          if(ot.indexOf(vlo)>=0||vlo.indexOf(ot)>=0){opts[j].click();await sleep(400);log('  [OK] '+label+' [custom]');return true;}}
        document.body.click();await sleep(200);}c=c.parentElement;}}
  // Strategy 5: brute force - click any dropdown-like element near label text
  var allEls=document.querySelectorAll('div,span,button,input');
  for(i=0;i<allEls.length;i++){
    var ae=allEls[i];if(!vis(ae))continue;
    var at=(ae.textContent||'').trim();
    if(at.length>50||at.length<2||at.toLowerCase().indexOf(lo)<0)continue;
    var parent=ae.parentElement;
    for(d=0;d<4&&parent;d++){
      var clickable=parent.querySelector('[class*=select],[class*=dropdown],[class*=toggle],[class*=arrow],select');
      if(clickable&&vis(clickable)){
        clickable.click();await sleep(800);
        var opts2=document.querySelectorAll('[role=option],li,[class*=option],.vs__dropdown-option');
        for(j=0;j<opts2.length;j++){
          var ot2=(opts2[j].innerText||'').trim().toLowerCase();
          if(ot2.indexOf(vlo)>=0){opts2[j].click();await sleep(400);log('  [OK] '+label+' [brute]');return true;}}
        document.body.click();await sleep(200);
      }
      parent=parent.parentElement;
    }
  }
  log('  [!] '+label+': tak jumpa');return false;
}
function clickStar(n){
  var containers=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating]');
  for(var i=0;i<containers.length;i++){var items=containers[i].querySelectorAll('svg,i,span,path');if(items.length>=n){items[n-1].click();return true;}}return false;}
function swalText(){
  var sels='.swal2-html-container,.swal2-title,.swal2-content,.swal2-popup,.modal-body,.modal-content,[class*=modal],[class*=dialog],[class*=popup],[class*=alert],[class*=swal],[class*=sweet]';
  var els=document.querySelectorAll(sels);var i;
  for(i=0;i<els.length;i++){if(vis(els[i])&&els[i].textContent.trim().length>5)return els[i].textContent.trim();}
  // Also check any overlay/popup that just appeared
  var overlays=document.querySelectorAll('[class*=overlay],[class*=backdrop],[class*=mask]');
  for(i=0;i<overlays.length;i++){if(vis(overlays[i])){var inner=overlays[i].textContent.trim();if(inner.length>5&&inner.length<500)return inner;}}
  return '';
}
function forceClick(el){
  if(!el)return;el.focus();
  el.dispatchEvent(new MouseEvent('mousedown',{bubbles:true,cancelable:true}));
  el.dispatchEvent(new MouseEvent('mouseup',{bubbles:true,cancelable:true}));
  el.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true}));
  el.click();
}
function swalClick(txt){
  var sel='.swal2-actions button,.swal2-confirm,.swal2-cancel,.swal2-deny,.modal-footer button,[class*=modal] button,[class*=popup] button,button';
  var els=document.querySelectorAll(sel);
  if(txt){var lo=txt.toLowerCase();for(var i=0;i<els.length;i++){if(!vis(els[i]))continue;var t=(els[i].innerText||els[i].textContent||'').trim().toLowerCase();if(t===lo||t.indexOf(lo)>=0){forceClick(els[i]);return true;}}}
  var b=document.querySelector('.swal2-confirm');if(b&&vis(b)){forceClick(b);return true;}
  return false;
}
async function clickNext(){for(var i=0;i<8;i++){if(clickBtn('seterusnya'))return true;await sleep(500);}return false;}
async function checkPause(){while(paused&&running)await sleep(300);}

// Process one book
async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};
  qs('#np-prog').textContent=(idx+1)+' / '+total;
  qs('#np-bar').style.width=((idx+1)/total*100)+'%';
  log('--- Buku '+(idx+1)+'/'+total+': '+book.title+' ---');

  if(location.pathname.indexOf('/record/add/book')<0){
    log('Navigasi ke borang...');location.href='/record/add/book';await sleep(DELAY*10);
  }
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await sleep(DELAY);swalClick();await checkPause();

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

  log('Step 2: Rumusan & Pengajaran');
  await waitFor(function(){return allTxt().length>0?true:null;},12000);await sleep(DELAY);
  var txts=allTxt();
  if(txts[0])setVal(txts[0],book.summary);
  if(txts[1])setVal(txts[1],book.review);
  clickStar(5);
  await sleep(DELAY);await checkPause();

  log('-> Seterusnya');await clickNext();await sleep(DELAY*4);

  // Step 3: Pasti + success detection
  log('Step 3: Menunggu popup...');
  for(var a=0;a<30;a++){
    if(!running)break;await sleep(DELAY*2);
    var btns=document.querySelectorAll('button,a,[role=button]');
    var bi;for(bi=0;bi<btns.length;bi++){
      if(!vis(btns[bi]))continue;
      var bt=(btns[bi].innerText||btns[bi].textContent||'').trim().toLowerCase();
      if(bt==='pasti'||bt==='ya'||bt==='confirm'){
        log('  -> Tekan: '+btns[bi].textContent.trim());
        forceClick(btns[bi]);await sleep(DELAY*5);break;
      }
    }
    var sw=swalText();
    if(sw)log('  [popup] '+sw.substring(0,80));
    if(/berjaya|success|disimpan|tahniah/i.test(sw)){log('BERJAYA!');swalClick('ok');swalClick();return{ok:true,title:book.title};}
    if(/duplicate|pendua|sudah wujud|already exist|telah wujud|rekod sama|entry.*exist/i.test(sw)){log('DUPLIKAT - skip');swalClick('ok');swalClick();forceClick(document.querySelector('.swal2-confirm'));await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
    if(/gagal|error|ralat|fail/i.test(sw)){
      if(/duplicate|pendua|entry/i.test(sw)){log('DUPLIKAT (dalam error) - skip');swalClick('ok');swalClick();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
      err('GAGAL: '+sw);swalClick();return{ok:false,title:book.title};}
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
  var avail0=[];for(var x=0;x<BOOKS.length;x++){if(used0.indexOf(BOOKS[x].title)<0)avail0.push(BOOKS[x]);}
  if(!avail0.length){err('Semua buku habis! Tekan Reset.');running=false;btnState('idle');return;}
  log('Memulakan... ('+avail0.length+' buku tersedia)');

  var ok=0,fail=0,dup=0,target=Math.min(parseInt(qs('#np-cnt').value)||5,100);
  var idx=0;
  while(ok+fail<target&&running){
    var used=getUsed();
    var avail=[];for(var y=0;y<BOOKS.length;y++){if(used.indexOf(BOOKS[y].title)<0)avail.push(BOOKS[y]);}
    if(!avail.length){err('Semua buku habis! Tekan Reset.');break;}
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
  var used=getUsed();
  qs('#np-lib').textContent=BOOKS.length;
  qs('#np-rem').textContent=BOOKS.length-used.length;
  qs('#np-usd').textContent=used.length;
}
function btnState(s){
  var go=qs('#np-go'),pa=qs('#np-pa'),st=qs('#np-st');
  if(s==='run'){go.disabled=true;go.textContent='Berjalan...';pa.disabled=false;st.disabled=false;}
  else{go.disabled=false;go.textContent='Mula';pa.disabled=true;st.disabled=true;pa.textContent='Pause';}
}

function makeUI(){
  var old=document.getElementById('NP');if(old)old.remove();
  var w=document.createElement('div');w.id='NP';
  var css='';
  css+='@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");';
  css+='*{box-sizing:border-box}';
  css+='#NP{position:fixed;top:12px;right:12px;width:360px;max-width:calc(100vw - 24px);z-index:2147483647;';
  css+='font-family:"Inter",-apple-system,system-ui,sans-serif;font-size:13px;touch-action:none;user-select:none;-webkit-user-select:none}';
  css+='@media(max-width:440px){#NP{width:calc(100vw - 16px);right:8px;top:8px;font-size:12px}}';
  css+='.np-card{background:#0f0b1e;border:1px solid rgba(147,130,255,.15);border-radius:20px;overflow:hidden;';
  css+='box-shadow:0 20px 60px rgba(0,0,0,.55),0 0 100px -20px rgba(124,58,237,.12)}';
  css+='.np-hd{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;';
  css+='background:linear-gradient(135deg,rgba(124,58,237,.1),rgba(99,102,241,.06));cursor:grab;touch-action:none}';
  css+='.np-hd:active{cursor:grabbing}';
  css+='.np-hd-l{display:flex;align-items:center;gap:10px}';
  css+='.np-ico{width:34px;height:34px;border-radius:11px;display:grid;place-items:center;font-size:15px;font-weight:900;color:#fff;';
  css+='background:linear-gradient(135deg,#7c3aed,#6366f1);box-shadow:0 4px 14px rgba(99,102,241,.45)}';
  css+='.np-ttl{font-size:14px;font-weight:800;letter-spacing:-.4px;color:#c4b5fd}';
  css+='.np-hd-r{display:flex;align-items:center;gap:6px}';
  css+='.np-ver{font-size:8px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#7c3aed;';
  css+='background:rgba(124,58,237,.12);border:1px solid rgba(124,58,237,.18);padding:2px 8px;border-radius:6px}';
  css+='.np-x{width:26px;height:26px;border-radius:8px;border:none;background:rgba(255,255,255,.04);color:rgba(255,255,255,.3);';
  css+='font-size:15px;cursor:pointer;display:grid;place-items:center;transition:.15s}';
  css+='.np-x:active{background:rgba(124,58,237,.25);color:#fff}';
  css+='.np-stats{display:flex;padding:8px 18px;gap:6px}';
  css+='.np-stat{flex:1;text-align:center;padding:8px 0;border-radius:10px;background:rgba(124,58,237,.06);border:1px solid rgba(124,58,237,.08)}';
  css+='.np-stat-n{font-size:18px;font-weight:800;color:#c4b5fd;line-height:1.2}';
  css+='.np-stat-l{font-size:9px;font-weight:600;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}';
  css+='.np-ctrl{padding:12px 18px;display:flex;flex-wrap:wrap;gap:6px;border-top:1px solid rgba(124,58,237,.06)}';
  css+='.np-btn{flex:1;min-width:80px;height:38px;border:none;border-radius:10px;font-size:11px;font-weight:700;';
  css+='cursor:pointer;text-transform:uppercase;letter-spacing:.4px;transition:.2s}';
  css+='.np-btn:active{transform:scale(.95)}';
  css+='.np-btn:disabled{opacity:.35;pointer-events:none}';
  css+='.b-go{background:linear-gradient(135deg,#7c3aed,#6d28d9);color:#fff;box-shadow:0 4px 16px rgba(109,40,217,.35)}';
  css+='.b-pa{background:rgba(251,191,36,.08);color:#fcd34d;border:1px solid rgba(251,191,36,.12)}';
  css+='.b-st{background:rgba(248,113,113,.08);color:#fca5a5;border:1px solid rgba(248,113,113,.1)}';
  css+='.b-rs{flex:none;width:auto;padding:0 12px;background:rgba(124,58,237,.08);color:#a78bfa;border:1px solid rgba(124,58,237,.1);font-size:10px}';
  css+='.np-set{display:flex;align-items:center;gap:8px;padding:6px 18px;color:rgba(255,255,255,.35);font-size:11px;font-weight:500}';
  css+='.np-set label{min-width:48px}';
  css+='.np-set input[type=range]{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:rgba(124,58,237,.15);border-radius:4px;outline:none}';
  css+='.np-set input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;';
  css+='background:#7c3aed;box-shadow:0 2px 6px rgba(124,58,237,.4);cursor:pointer}';
  css+='.np-set input[type=number]{width:50px;background:rgba(124,58,237,.08);border:1px solid rgba(124,58,237,.12);';
  css+='border-radius:7px;color:#c4b5fd;padding:5px;font-size:12px;text-align:center;font-weight:700;font-family:inherit;outline:none}';
  css+='.np-set .vl{min-width:36px;text-align:right;color:#a78bfa;font-weight:700;font-size:11px}';
  css+='.np-prg{padding:10px 18px 6px}';
  css+='.np-bar-bg{height:5px;background:rgba(124,58,237,.1);border-radius:9px;overflow:hidden}';
  css+='.np-bar-fg{height:100%;width:0;background:linear-gradient(90deg,#7c3aed,#a78bfa);border-radius:9px;transition:width .6s ease;box-shadow:0 0 10px rgba(124,58,237,.3)}';
  css+='.np-prg-t{text-align:center;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;font-weight:600;letter-spacing:.3px}';
  css+='.np-log{padding:4px 18px 12px;max-height:140px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(124,58,237,.15) transparent}';
  css+='.np-log::-webkit-scrollbar{width:3px}.np-log::-webkit-scrollbar-thumb{background:rgba(124,58,237,.2);border-radius:3px}';
  css+='.l{padding:3px 0;font-size:10.5px;color:rgba(255,255,255,.35);line-height:1.5;display:flex;gap:6px;border-bottom:1px solid rgba(255,255,255,.02)}';
  css+='.l .lt{color:rgba(124,58,237,.3);font-size:9px;font-family:monospace;flex-shrink:0}';
  css+='.l.ok{color:#6ee7b7}.l.er{color:#fca5a5}.l.st{color:#c4b5fd;font-weight:700}';
  css+='.np-ft{display:flex;justify-content:center;gap:20px;padding:10px 18px;border-top:1px solid rgba(124,58,237,.06);background:rgba(0,0,0,.15)}';
  css+='.np-ft-i{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700}';
  css+='.np-ft-i.g{color:#6ee7b7}.np-ft-i.r{color:#fca5a5}';
  css+='.np-dot{width:8px;height:8px;border-radius:50%}';
  css+='.np-ft-i.g .np-dot{background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.5)}';
  css+='.np-ft-i.r .np-dot{background:#f87171;box-shadow:0 0 8px rgba(248,113,113,.5)}';

  var html='';
  html+='<div class="np-card">';
  html+='<div class="np-hd" id="np-hd">';
  html+='<div class="np-hd-l"><div class="np-ico">N</div><span class="np-ttl">NILAM Auto-Fill</span></div>';
  html+='<div class="np-hd-r"><span class="np-ver">v8.0</span><button class="np-x" id="np-mn">-</button></div>';
  html+='</div>';
  html+='<div id="np-body">';
  html+='<div class="np-stats">';
  html+='<div class="np-stat"><div class="np-stat-n" id="np-lib">-</div><div class="np-stat-l">Jumlah</div></div>';
  html+='<div class="np-stat"><div class="np-stat-n" id="np-rem">-</div><div class="np-stat-l">Tinggal</div></div>';
  html+='<div class="np-stat"><div class="np-stat-n" id="np-usd">0</div><div class="np-stat-l">Dipakai</div></div>';
  html+='</div>';
  html+='<div class="np-ctrl">';
  html+='<button class="np-btn b-go" id="np-go" disabled>Memuatkan...</button>';
  html+='<button class="np-btn b-pa" id="np-pa" disabled>Pause</button>';
  html+='<button class="np-btn b-st" id="np-st" disabled>Stop</button>';
  html+='<button class="np-btn b-rs" id="np-rs">Reset</button>';
  html+='</div>';
  html+='<div class="np-set"><label>Buku</label><input type="number" id="np-cnt" min="1" max="100" value="5"></div>';
  html+='<div class="np-set"><label>Delay</label><input type="range" id="np-dly" min="300" max="2000" value="600" step="100"><span class="vl" id="np-dvl">600ms</span></div>';
  html+='<div class="np-prg"><div class="np-bar-bg"><div class="np-bar-fg" id="np-bar"></div></div>';
  html+='<div class="np-prg-t" id="np-prog">Memuatkan perpustakaan...</div></div>';
  html+='<div class="np-log" id="nl"></div>';
  html+='</div>';
  html+='<div class="np-ft" id="np-ft">';
  html+='<div class="np-ft-i g"><span class="np-dot"></span><span id="np-ok">0</span> Berjaya</div>';
  html+='<div class="np-ft-i r"><span class="np-dot"></span><span id="np-fl">0</span> Gagal</div>';
  html+='</div></div>';

  var styleEl=document.createElement('style');styleEl.textContent=css;
  w.appendChild(styleEl);
  var container=document.createElement('div');container.innerHTML=html;
  w.appendChild(container.firstChild);
  document.body.appendChild(w);

  // Drag: mouse + touch
  var hd=document.getElementById('np-hd');var dr=false,ox=0,oy=0;
  function ds(cx,cy){dr=true;var r=w.getBoundingClientRect();ox=cx-r.left;oy=cy-r.top;}
  function dm(cx,cy){if(!dr)return;w.style.left=Math.max(0,Math.min(cx-ox,innerWidth-w.offsetWidth))+'px';
    w.style.top=Math.max(0,Math.min(cy-oy,innerHeight-60))+'px';w.style.right='auto';}
  function de(){dr=false;}
  hd.addEventListener('mousedown',function(e){e.preventDefault();ds(e.clientX,e.clientY);});
  document.addEventListener('mousemove',function(e){dm(e.clientX,e.clientY);});
  document.addEventListener('mouseup',de);
  hd.addEventListener('touchstart',function(e){if(e.touches.length===1){e.preventDefault();ds(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchmove',function(e){if(dr&&e.touches.length===1){e.preventDefault();dm(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchend',de);document.addEventListener('touchcancel',de);

  // Minimize
  var mini=false;
  document.getElementById('np-mn').onclick=function(){mini=!mini;
    document.getElementById('np-body').style.display=mini?'none':'';
    document.getElementById('np-ft').style.display=mini?'none':'';
    document.getElementById('np-mn').textContent=mini?'+':'-';};

  // Delay slider
  document.getElementById('np-dly').oninput=function(){DELAY=+this.value;document.getElementById('np-dvl').textContent=DELAY+'ms';};

  // Buttons
  document.getElementById('np-go').onclick=startRun;
  document.getElementById('np-pa').onclick=function(){paused=!paused;document.getElementById('np-pa').textContent=paused?'Sambung':'Pause';log(paused?'DIJEDA':'Disambung');};
  document.getElementById('np-st').onclick=function(){running=false;paused=false;log('DIHENTIKAN');btnState('idle');};
  document.getElementById('np-rs').onclick=function(){if(confirm('Reset semua buku yang sudah dipakai?')){resetUsedList();updateStats();log('Senarai direset');}};
}

// Init
makeUI();
log('Memuat turun 1117 buku...');

try{
  var r=await fetch(LIB_URL);if(!r.ok)throw new Error('HTTP '+r.status);
  BOOKS=await r.json();
  log(BOOKS.length+' buku sebenar dimuatkan');
  updateStats();
  var go=document.getElementById('np-go');
  go.disabled=false;go.textContent='Mula';go.className='np-btn b-go';
  document.getElementById('np-prog').textContent='Sedia. Tekan MULA.';
}catch(e){
  err('Gagal muat: '+e.message);
  document.getElementById('np-prog').textContent='Gagal muat data!';
}

})();
