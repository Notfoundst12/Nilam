// NILAM Auto-Fill v15.0 (The Ultimate Vantablack Edition)
// 10,000 buku sintetik. High-End Glassmorphism UI. C2 Botnet Telemetry.
console.log('%c[NILAM] v15.0 sedang dimuatkan...','color:#8b5cf6;font-weight:bold;font-size:14px');
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/books_library.json';
var UK='__nilam_used__';
var BOOKS=[], running=false, paused=false;
window.__nilamConfig = { jitter: true, ghost: true, autoSleep: true, delay: 600, maxBooks: 5 };

// Supabase Cloud Memory config
var SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw';

// --- CORE FUNCTIONS & SPOOFING ---
function installSpoofer() {
  if(!window.__nilamConfig.ghost) return;
  try {
    var agents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0"
    ];
    Object.defineProperty(navigator, 'userAgent', { get: function () { return agents[Math.floor(Math.random() * agents.length)]; } });
    var cores = [4, 8, 16];
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: function () { return cores[Math.floor(Math.random() * cores.length)]; } });
    var mems = [8, 16, 32];
    Object.defineProperty(navigator, 'deviceMemory', { get: function () { return mems[Math.floor(Math.random() * mems.length)]; } });
    console.log("[NILAM] 👻 Ghost Mode Aktif.");
  } catch(e) {}
}

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

  if(!window.__nilamXhrPatched){
    window.__nilamXhrPatched=true;
    var _origSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send=function(body){
      if(typeof body==='string' && body.indexOf('"type":"book"')>=0){
        var rtg = window.__nilamStarRating || 5;
        var fields = ['point','rating','score','star'];
        for(var i=0; i<fields.length; i++){
          var f = fields[i];
          if(body.indexOf('"'+f+'":') < 0 && body.indexOf('\\"'+f+'\\":') < 0){
            body = body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
            body = body.replace('\\"type\\":\\"book\\"', '\\"type\\":\\"book\\",\\"'+f+'\\":'+rtg);
          }
        }
        var m = body.match(/"user"\s*:\s*([^,|}]+)/);
        if(m && m[1]) window.__nilamUserId = m[1].replace(/["']/g,'').trim();
      }
      return _origSend.call(this,body);
    };

    var _origFetch=window.fetch;
    window.fetch=function(){
      var args = arguments;
      try {
        if (args[0] && typeof args[0] === 'string' && args[0].indexOf('/api/nilam-records/submit') >= 0) {
           args[0] = args[0] + (args[0].indexOf('?')>=0 ? '&' : '?') + '_t=' + Date.now();
        }
      } catch(e) {}

      if(args[1] && typeof args[1].body==='string' && args[1].body.indexOf('"type":"book"')>=0){
        var rtg = window.__nilamStarRating || 5;
        var fields = ['point','rating','score','star'];
        for(var i=0; i<fields.length; i++){
          var f = fields[i];
          if(args[1].body.indexOf('"'+f+'":') < 0 && args[1].body.indexOf('\\"'+f+'\\":') < 0){
            args[1].body = args[1].body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
            args[1].body = args[1].body.replace('\\"type\\":\\"book\\"', '\\"type\\":\\"book\\",\\"'+f+'\\":'+rtg);
          }
        }
        var m = args[1].body.match(/"user"\s*:\s*([^,|}]+)/);
        if(m && m[1]) window.__nilamUserId = m[1].replace(/["']/g,'').trim();
      }
      return _origFetch.apply(this,args);
    };
  }

  try{
    var ve=document.querySelector('#app')||document.querySelector('[data-app]');
    var router = (ve && ve.__vue__ && ve.__vue__.$router) || (ve && ve.__vue_app__ && ve.__vue_app__.config.globalProperties.$router);
    if(router){
      var _origPush=router.push;
      router.push=function(loc){
        if(!loc || (typeof loc==='string' && /undefined/.test(loc))) return Promise.resolve();
        return _origPush.apply(router,arguments);
      };
    }
  }catch(x){}
}

function installRatingGuard(){
  try{
    var appEl=document.querySelector('#app')||document.querySelector('[data-app]');
    if(!appEl) return;
    var root = appEl.__vue__ || appEl.__vue_app__;
    if(!root) return;
    var rtg = window.__nilamStarRating || 5;
    var queue=[root]; var visited=0;
    while(queue.length && visited<800){
      var c=queue.shift(); visited++;
      if(!c) continue;
      var targets = [c, c.$data, (c.$refs||{}), (c.form||{}), (c.record||{})];
      for(var i=0; i<targets.length; i++){
        var t = targets[i]; if(!t || typeof t !== 'object') continue;
        if(t.type === 'book' || t.title !== undefined || t.point !== undefined || t.rating !== undefined){
          if(t.point===undefined||t.point===null||t.point===0) t.point=rtg;
          if(t.rating===undefined||t.rating===null||t.rating===0) t.rating=rtg;
          if(t.score===undefined||t.score===null||t.score===0) t.score=rtg;
        }
      }
      if(typeof c.submitRecord==='function' && !c.__nilamRG){
        c.__nilamRG=true;
        var _orig=c.submitRecord;
        c.submitRecord=function(){
          installRatingGuard();
          return _orig.apply(this,arguments);
        };
      }
      if(c.$children){for(var ci=0;ci<c.$children.length;ci++)queue.push(c.$children[ci]);}
      if(c._instance && c._instance.subTree) queue.push(c._instance.proxy);
    }
  }catch(x){}
}

function sleep(ms){return new Promise(function(r){setTimeout(r,ms)});}
async function jSleep(mult){
  var base = window.__nilamConfig.delay * (mult || 1);
  var jitter = window.__nilamConfig.jitter ? (Math.floor(Math.random() * 1500) + 500) : 0;
  await sleep(base + jitter);
}
function qs(s){return document.querySelector(s);}

// Heartbeat Telemetry & C2
async function sendTelemetry(ok, fail, tgt, statusMsg) {
  var uid = window.__nilamUserId;
  if (!uid || uid === "Guest") {
    try {
      var app = document.querySelector('#app') || document.querySelector('[data-app]');
      var root = app && (app.__vue__ || app.__vue_app__);
      if (root && root.$store && root.$store.state && root.$store.state.user) {
        uid = root.$store.state.user.id || root.$store.state.user.name;
      } else {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i), v = localStorage.getItem(k);
          if (k.indexOf('user')>=0 || k.indexOf('auth')>=0) {
            if (v && v.indexOf('user')>=0) {
              try { var j = JSON.parse(v); if (j.user && j.user.id) uid = j.user.id; } catch(e){}
            }
          }
        }
      }
    } catch(e){}
    if(!uid) uid = "Pelajar-" + Math.floor(Math.random()*9000+1000);
    window.__nilamUserId = uid;
  }
  var payload = '__TEL__|' + uid + '|' + Date.now() + '|' + ok + '|' + fail + '|' + tgt + '|' + statusMsg;
  try {
    // Safe PostgREST wildcard for deleting old pings
    fetch(SUPA_URL + '?title=ilike.__TEL__|' + uid + '|*', { method: 'DELETE', headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } })
    .then(function() {
      fetch(SUPA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY },
        body: JSON.stringify({ title: payload })
      });
    });
  } catch(e){}
}

async function checkC2() {
  try {
    var r = await fetch(SUPA_URL + '?select=title&title=ilike.__CMD__|*', { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } });
    if(r.ok){
      var d = await r.json();
      for(var i=0; i<d.length; i++){
        var parts = d[i].title.split('|');
        if(parts.length >= 2){
           var cmd = parts[1];
           if(cmd === 'PAUSE' && !paused){ paused = true; log('⚠️ [C2] Sistem Dijeda oleh Admin'); try{document.getElementById('np-pa').textContent='SAMBUNG';}catch(e){} }
           if(cmd === 'RESUME' && paused){ paused = false; log('▶️ [C2] Sistem Disambung oleh Admin'); try{document.getElementById('np-pa').textContent='PAUSE';}catch(e){} }
           if(cmd === 'KILL' && running){ running = false; err('🛑 [C2] SISTEM DIHENTIKAN OLEH ADMIN!'); btnState('idle'); }
           if(cmd === 'MSG' && parts[2]){
             var msgId = 'msg_'+parts[2].substring(0,15).replace(/\s+/g,'');
             if(!localStorage.getItem(msgId)){
               localStorage.setItem(msgId, '1');
               alert('📢 PENGUMUMAN ADMIN:\n\n' + parts[2]);
             }
           }
        }
      }
    }
  } catch(e){}
}

async function getUsed(){
  var combined = [];
  try {
    var r = await fetch(SUPA_URL + '?select=title', { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } });
    if (r.ok) {
      var d = await r.json();
      combined = d.map(function(x) { return x.title }).filter(function(t) { return t.indexOf('__TEL__|') !== 0 && t.indexOf('__CMD__|') !== 0; });
    }
  } catch (e) {
    console.warn('[NILAM] Cloud getUsed failed, using local only', e);
  }
  try {
    var local = JSON.parse(localStorage.getItem(UK)) || [];
    for (var i = 0; i < local.length; i++) {
      if (combined.indexOf(local[i]) < 0) combined.push(local[i]);
    }
  } catch (e) {}
  return combined;
}

async function markUsed(t){
  try {
    var u = JSON.parse(localStorage.getItem(UK)) || [];
    if (u.indexOf(t) < 0) { u.push(t); localStorage.setItem(UK, JSON.stringify(u)); }
    await fetch(SUPA_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Prefer': 'resolution=ignore-duplicates' },
      body: JSON.stringify({ title: t })
    });
  } catch (e) {}
}

async function resetUsedList(){
  localStorage.removeItem(UK);
  try{await fetch(SUPA_URL+'?title=not.eq.random_string',{method:'DELETE',headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY}});}catch(e){}
}

// --- ULTIMATE HIGH-END VISUAL DESIGN (VANTABLACK GLASSMORPHISM) ---
function pLog(m){
  var el=document.getElementById('nl');if(!el)return;
  var t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var c='';if(/BERJAYA/.test(m))c='ok';else if(/GAGAL|RALAT|TIDAK|\[X\]/.test(m))c='er';else if(/Step \d/.test(m))c='st';
  el.innerHTML+='<div class="nm-log-entry '+c+'"><span style="color:#52525b;margin-right:10px;font-family:inherit;">['+t+']</span>'+m+'</div>';
  el.scrollTop=1e6;
}
function log(m){console.log('%c[NILAM] '+m,'color:#8b5cf6;font-weight:bold');pLog(m);}
function err(m){console.error('[NILAM] '+m);pLog('[X] '+m);}

function vis(el){return el&&(el.offsetParent!==null||el.offsetWidth>0);}
function isOurPanel(el){if(!el)return false;try{return el.closest&&el.closest('#NILAM-ULTIMATE');}catch(x){return false;}}

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

function isDuplicate(){
  var sw=swalText().toLowerCase();
  if(sw&&(/limit exceeded|too many requests|429/i.test(sw))){ window.__nilamRateLimited = true; return false; }
  if(sw&&(/duplicate|pendua|wujud|already|exist|entry/.test(sw)))return true;
  var txt=(document.body.innerText||document.body.textContent||'').toLowerCase();
  if(/limit.?exceeded|too.?many.?requests|429/i.test(txt)){ window.__nilamRateLimited = true; return false; }
  if(/duplicate.?entry/i.test(txt))return true;
  if(/pendua/i.test(txt))return true;
  if(/sudah.?wujud/i.test(txt))return true;
  return false;
}

async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};

  // AI-Smart Review Generation
  var titlesArray = book.title.split(' ');
  var mainTopic = titlesArray.length > 1 ? titlesArray[0] + ' ' + titlesArray[1] : book.title;
  var rawSum=String(book.summary||'').trim();
  if(!rawSum){
    var sumTmpls = [
      'Buku "'+book.title+'" ini mengupas secara terperinci tentang '+mainTopic.toLowerCase()+'. Penulis '+book.author+' berjaya menyampaikan isi kandungan dengan sangat jelas.',
      'Karya "'+book.title+'" terbitan '+book.publisher+' ini membawa pembaca menyelami dunia '+mainTopic.toLowerCase()+'. Plot dan penerangannya sangat menarik.',
      'Satu naskhah hebat bertajuk "'+book.title+'" yang menerangkan konsep '+mainTopic.toLowerCase()+'. Sangat sesuai dibaca oleh semua peringkat umur.'
    ];
    rawSum = sumTmpls[Math.floor(Math.random() * sumTmpls.length)];
  }
  var revTmpls = [
    'Selepas membaca buku ini, saya mendapat inspirasi baharu mengenai '+mainTopic.toLowerCase()+'. Ia membuka minda saya untuk berfikir secara kritis.',
    'Buku ini banyak mengajar saya tentang nilai-nilai murni berkaitan '+mainTopic.toLowerCase()+'. Saya sangat mengesyorkan buku ini kepada rakan-rakan.',
    'Secara keseluruhannya, karya '+book.author+' ini amat padat dengan pengajaran. '+mainTopic+' digarap dengan begitu baik sekali.',
    'Saya berasa sangat teruja selepas membaca buku ini. Pemahaman saya tentang '+mainTopic.toLowerCase()+' menjadi lebih mendalam.'
  ];
  book.summary=rawSum;
  book.review=revTmpls[Math.floor(Math.random() * revTmpls.length)];

  try{document.getElementById('np-prog').textContent=(idx+1)+' / '+total;}catch(e){}
  try{document.getElementById('np-bar').style.width=((idx+1)/total*100)+'%';}catch(e){}
  log('--- Buku '+(idx+1)+'/'+total+': '+book.title+' ---');

  if(location.pathname.indexOf('/record/add/book')<0) location.href='/record/add/book';
  
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await jSleep(1);swalClick();

  log('Step 1: Maklumat Buku');
  closeDatePicker();
  await fillField('tajuk',book.title,['title']);await jSleep(1);
  clickBtn('buku fizikal');await jSleep(1);
  await fillField('mukasurat',book.pages,['bilangan']);await jSleep(1);
  await fillField('penulis',book.author,['pengarang']);await jSleep(1);
  await fillField('penerbit',book.publisher,['publisher']);await jSleep(1);
  await fillField('tahun',book.year,['year']);await jSleep(1);
  
  clickBtn('seterusnya');
  await jSleep(4);

  log('Step 2: Rumusan & Penilaian');
  await waitFor(function(){return allTxt().length>0?true:null;},15000);await jSleep(2);
  var txts=allTxt();
  if(txts[0]) setVal(txts[0],book.summary);
  if(txts[1]) setVal(txts[1],book.review);
  await jSleep(3);

  installRatingGuard();
  var stars = document.querySelectorAll('svg,i,.v-icon');
  if(stars.length>3) forceClick(stars[3]);
  await jSleep(2);
  
  clickBtn('seterusnya');
  await jSleep(4);

  log('Step 3: Pengesahan & Hantar');
  var hasClickedHantar = false;

  for(var a=0;a<20;a++){
    if(!running)break;
    
    if(!hasClickedHantar && (clickBtn('hantar') || clickBtn('simpan') || clickBtn('submit'))){
        log('  -> Klik Hantar');
        await jSleep(4);
        hasClickedHantar=true;
    }
    
    await jSleep(2);
    
    if(window.__nilamRateLimited){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
    if(isDuplicate()){log('DUPLIKAT dikesan - skip'); closeAllPopups(); return{ok:false,title:book.title,dup:true};}

    var sw=swalText();
    if(sw){
      if(/limit exceeded|too many requests|429/i.test(sw)){ err('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
      if(/berjaya|success|disimpan/i.test(sw)){log('BERJAYA!');window.__nilamBlock=true;return{ok:true,title:book.title};}
      if(/duplicate|pendua|sudah wujud/i.test(sw)){log('DUPLIKAT - skip');closeAllPopups();return{ok:false,title:book.title,dup:true};}
      swalClick();await jSleep(3);
    }
  }
  return{ok:false,title:book.title};
}

async function startRun(){
  if(running||!BOOKS.length)return;running=true;paused=false;
  installNavGuard();
  installRatingGuard();
  
  try{document.getElementById('np-go').disabled=true;document.getElementById('np-go').textContent='BERJALAN...';}catch(e){}
  try{document.getElementById('np-pa').disabled=false;document.getElementById('np-st').disabled=false;}catch(e){}

  var used0=await getUsed();
  var avail0=[];for(var x=0;x<BOOKS.length;x++){if(used0.indexOf(BOOKS[x].title)<0)avail0.push(BOOKS[x]);}
  if(!avail0.length){err('Semua buku habis! Tekan Reset.');running=false;try{document.getElementById('np-go').disabled=false;document.getElementById('np-go').textContent='MULA SEKARANG';}catch(e){}return;}
  log('Memulakan... ('+avail0.length+' buku tersedia)');
  
  var target=window.__nilamConfig ? window.__nilamConfig.maxBooks : 100;
  sendTelemetry(0, 0, target, 'Bermula...');

  var ok=0,fail=0,dup=0,idx=0;
  while(ok+fail<target&&running){
    sendTelemetry(ok, fail, target, 'Sedang submit buku...');
    await checkC2();
    if(!running) break;
    var used=await getUsed();
    var avail=[];for(var y=0;y<BOOKS.length;y++){if(used.indexOf(BOOKS[y].title)<0)avail.push(BOOKS[y]);}
    if(!avail.length){log('Semua buku habis! Auto-reset...');await resetUsedList();await updateStats();avail=BOOKS.slice();}
    var book=avail[0];
    await markUsed(book.title);
    updateStats();
    var res=await doBook(book,idx,target);
    if(res.ok){ok++;}
    else if(res.dup){dup++;log('Duplikat - cuba buku lain...');}
    else if(res.rateLimited){
      log('Sistem berehat sementara (Auto-Sleep 3 minit) mengelakkan ban...');
      sendTelemetry(ok, fail, target, 'Auto-Sleep (429 Limit)');
      await jSleep(180000/window.__nilamConfig.delay); 
      idx--; 
      window.__nilamRateLimited = false;
      continue; 
    }
    else{fail++;}
    try{document.getElementById('np-ok').textContent=ok;document.getElementById('np-fl').textContent=fail;}catch(e){}
    idx++;
    if(ok+fail<target&&running){
      log('Sedia buku seterusnya...');
      await jSleep(3);
      location.href='/record/add/book';
      await jSleep(3);
    }
  }
  log('== SELESAI == OK:'+ok+' Gagal:'+fail+' Duplikat:'+dup);
  sendTelemetry(ok, fail, target, 'Selesai');
  running=false;
  try{document.getElementById('np-go').disabled=false;document.getElementById('np-go').textContent='MULA SEKARANG';}catch(e){}
  try{document.getElementById('np-pa').disabled=true;document.getElementById('np-st').disabled=true;}catch(e){}
}

function updateStats(){
  getUsed().then(used => {
    try{document.getElementById('np-lib').textContent=BOOKS.length;}catch(e){}
    try{document.getElementById('np-usd').textContent=used.length;}catch(e){}
  });
}
function btnState(s){
  try{
      var go=document.getElementById('np-go'),pa=document.getElementById('np-pa'),st=document.getElementById('np-st');
      if(s==='run'){go.disabled=true;go.textContent='Berjalan...';pa.disabled=false;st.disabled=false;}
      else{go.disabled=false;go.textContent='MULA SEKARANG';pa.disabled=true;st.disabled=true;pa.textContent='PAUSE';}
  }catch(e){}
}

function buildUI(){
  // HARD RESET ALL PREVIOUS UIs to prevent overlapping
  var killList = ['NP', 'NP-FAB', 'NP-MENU', 'NILAM-ROOT', 'NILAM-ULTIMATE'];
  for(var i=0; i<killList.length; i++) {
      var k = document.getElementById(killList[i]);
      if(k) k.remove();
  }
  
  var w=document.createElement('div');
  w.id = 'NILAM-ULTIMATE';
  var css=`
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap");
  
  #NP-FAB {
    position: fixed; top: 24px; right: 24px; width: 60px; height: 60px; border-radius: 30px;
    background: rgba(5,5,5,0.75); backdrop-filter: blur(24px) saturate(180%); -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 10px 40px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
    z-index: 2147483647; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 26px; transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
  #NP-FAB:hover { transform: scale(1.05) rotate(5deg); background: rgba(15,15,15,0.9); box-shadow: 0 15px 50px rgba(139,92,246,0.2), inset 0 1px 1px rgba(255,255,255,0.2); }
  
  #NP-MENU {
    position: fixed; top: 96px; right: 24px; width: 380px; height: auto; min-height: 520px;
    background: #050505; backdrop-filter: blur(40px) saturate(150%); -webkit-backdrop-filter: blur(40px) saturate(150%);
    border: 1px solid rgba(255,255,255,0.08); border-radius: 28px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.8), inset 0 1px 2px rgba(255,255,255,0.05);
    z-index: 2147483646; display: flex; flex-direction: column; overflow: hidden; resize: both;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    opacity: 0; pointer-events: none; transform: translateY(-20px) scale(0.96);
  }
  #NP-MENU.show { opacity: 1; pointer-events: auto; transform: translateY(0) scale(1); }
  
  .nm-header {
    height: 64px; padding: 0 24px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.04); cursor: grab; user-select: none;
    background: radial-gradient(120% 100% at 50% 0%, rgba(255,255,255,0.05) 0%, rgba(0,0,0,0) 100%);
  }
  .nm-header:active { cursor: grabbing; }
  .nm-title { color: #fff; font-size: 15px; font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 10px; }
  .nm-dot { width: 8px; height: 8px; border-radius: 50%; background: #10b981; box-shadow: 0 0 12px #10b981; }
  .nm-close { color: #a1a1aa; font-size: 12px; font-weight: 700; cursor: pointer; padding: 6px 12px; border-radius: 20px; transition: 0.2s; background: rgba(255,255,255,0.03); }
  .nm-close:hover { color: #fff; background: rgba(255,255,255,0.1); }

  .nm-tabs { display: flex; padding: 0 16px; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .nm-tab {
    flex: 1; text-align: center; padding: 16px 0; color: #71717a;
    font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); position: relative;
  }
  .nm-tab.active { color: #fff; }
  .nm-tab.active::after { content: ''; position: absolute; bottom: -1px; left: 30%; right: 30%; height: 2px; background: #fff; border-radius: 2px 2px 0 0; box-shadow: 0 -2px 10px rgba(255,255,255,0.5); }
  .nm-tab:hover:not(.active) { color: #a1a1aa; }

  .nm-content { flex: 1; overflow-y: auto; padding: 24px; display: none; color: #e4e4e7; scrollbar-width: none; }
  .nm-content::-webkit-scrollbar { display: none; }
  .nm-content.active { display: block; animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
  
  .nm-card { 
    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); 
    border-radius: 20px; padding: 20px; margin-bottom: 20px; 
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.02), 0 4px 20px rgba(0,0,0,0.2); 
  }
  
  .nm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .nm-stat { text-align: center; padding: 16px 0; background: rgba(255,255,255,0.03); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); transition: 0.3s; }
  .nm-stat:hover { background: rgba(255,255,255,0.05); transform: translateY(-2px); }
  .nm-stat-val { font-size: 26px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace; }
  .nm-stat-lbl { font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1px; margin-top: 6px; font-weight: 700; }

  .nm-row { display: flex; justify-content: space-between; align-items: center; padding: 14px 0; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .nm-row:last-child { border-bottom: none; }
  .nm-label { display: flex; flex-direction: column; font-size: 13px; font-weight: 600; color: #fff; }
  .nm-sub { font-size: 10px; color: #71717a; font-weight: 500; margin-top: 4px; }

  /* iOS Style Switch */
  .switch { position: relative; width: 48px; height: 26px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: rgba(255,255,255,0.1); transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 26px; border: 1px solid rgba(255,255,255,0.05); }
  .slider:before { position: absolute; content: ""; height: 20px; width: 20px; left: 3px; bottom: 2px; background: #fff; transition: .4s cubic-bezier(0.16, 1, 0.3, 1); border-radius: 50%; box-shadow: 0 2px 5px rgba(0,0,0,0.2); }
  input:checked + .slider { background: #fff; }
  input:checked + .slider:before { transform: translateX(20px); background: #050505; }

  .nm-input-group { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background: rgba(255,255,255,0.03); padding: 12px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
  .nm-input { background: transparent; border: none; color: #fff; width: 70px; text-align: right; font-size: 18px; font-weight: 800; font-family: 'JetBrains Mono', monospace; outline: none; }
  .nm-range { width: 100%; accent-color: #fff; margin-top: 12px; }

  .nm-btn { width: 100%; padding: 18px; border: none; border-radius: 16px; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; cursor: pointer; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); color: #050505; margin-top: 10px; }
  .nm-btn-go { background: #fff; box-shadow: 0 8px 20px rgba(255,255,255,0.15); }
  .nm-btn-go:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 12px 25px rgba(255,255,255,0.25); }
  .nm-btn-go:disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); box-shadow: none; cursor: not-allowed; }
  
  .nm-btn-st { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); padding: 14px; margin-top: 0; }
  .nm-btn-st:hover:not(:disabled) { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.4); }

  .nm-log-entry { font-family: "JetBrains Mono", monospace; font-size: 11px; padding: 8px 0; color: #a1a1aa; border-bottom: 1px dashed rgba(255,255,255,0.05); }
  .nm-log-entry.ok { color: #34d399; }
  .nm-log-entry.er { color: #f87171; }
  .nm-log-entry.st { color: #fff; font-weight: 700; }
  `;
  
  var html=`
  <div id="NP-FAB">
    <svg viewBox="0 0 24 24" width="28" height="28" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  </div>
  <div id="NP-MENU">
     <div class="nm-header">
        <div class="nm-title"><div class="nm-dot"></div> VANTABLACK EDITION</div>
        <div class="nm-close" id="nm-close">HIDE</div>
     </div>
     <div class="nm-tabs">
        <div class="nm-tab active" data-target="tab-home">Mission Control</div>
        <div class="nm-tab" data-target="tab-feat">Defenses</div>
        <div class="nm-tab" data-target="tab-logs">Terminal</div>
     </div>
     
     <div class="nm-content active" id="tab-home">
        <div class="nm-grid">
           <div class="nm-stat"><div class="nm-stat-val" id="np-lib">-</div><div class="nm-stat-lbl">Global Books</div></div>
           <div class="nm-stat"><div class="nm-stat-val" id="np-usd">0</div><div class="nm-stat-lbl">Synced</div></div>
        </div>
        
        <div class="nm-input-group">
            <div class="nm-label">Target Execution<span class="nm-sub">Books per session</span></div>
            <input type="number" id="np-cnt" class="nm-input" min="1" max="500" value="5">
        </div>
        
        <div style="margin-bottom:24px; font-size:12px; color:#71717a; display:flex; justify-content:space-between; font-weight:700;">
            <span>STATUS:</span>
            <span><span id="np-ok" style="color:#34d399">0</span> SUCCESS / <span id="np-fl" style="color:#f87171">0</span> ERROR</span>
        </div>
        
        <button class="nm-btn nm-btn-go" id="np-go" disabled>INITIALIZING...</button>
        
        <div class="nm-grid" style="margin-top:16px">
            <button class="nm-btn nm-btn-st" id="np-pa" disabled>PAUSE</button>
            <button class="nm-btn nm-btn-st" id="np-st" disabled>HALT</button>
        </div>
     </div>
     
     <div class="nm-content" id="tab-feat">
        <div class="nm-card">
            <div class="nm-row">
                <div class="nm-label">Human Jitter<span class="nm-sub">Defeats timing analysis (WAF)</span></div>
                <label class="switch"><input type="checkbox" id="cfg-jitter" checked><span class="slider"></span></label>
            </div>
            <div class="nm-row">
                <div class="nm-label">Ghost Identity<span class="nm-sub">Spoofs OS, Device & RAM</span></div>
                <label class="switch"><input type="checkbox" id="cfg-ghost" checked><span class="slider"></span></label>
            </div>
            <div class="nm-row">
                <div class="nm-label">Smart Sleep<span class="nm-sub">Auto-cools on HTTP 429</span></div>
                <label class="switch"><input type="checkbox" id="cfg-sleep" checked><span class="slider"></span></label>
            </div>
        </div>
        
        <div class="nm-card">
            <div class="nm-label" style="flex-direction:row; justify-content:space-between">
                Base Velocity <span id="np-dvl" style="color:#fff;font-family:'JetBrains Mono',monospace;font-size:12px">600ms</span>
            </div>
            <input type="range" id="np-dly" class="nm-range" min="200" max="3000" value="600" step="100">
        </div>
        
        <div style="text-align:center; margin-top:24px;">
            <button id="np-rs" style="background:transparent;border:none;color:#71717a;font-size:11px;font-weight:700;cursor:pointer;transition:0.2s">Purge Cloud Memory</button>
        </div>
     </div>
     
     <div class="nm-content" id="tab-logs">
        <div id="nl" style="padding-bottom:24px"></div>
     </div>
  </div>
  `;
  
  var styleEl=document.createElement('style');styleEl.textContent=css;
  w.appendChild(styleEl);
  w.innerHTML += html;
  document.body.appendChild(w);
  
  var menu = document.getElementById('NP-MENU');
  var fab = document.getElementById('NP-FAB');
  var isMenuOpen = false;
  
  fab.onclick = function(){
      isMenuOpen = !isMenuOpen;
      menu.classList.toggle('show', isMenuOpen);
  };
  document.getElementById('nm-close').onclick = function(){
      isMenuOpen = false; menu.classList.remove('show');
  };
  
  // Tabs
  var tabs = document.querySelectorAll('.nm-tab');
  var contents = document.querySelectorAll('.nm-content');
  tabs.forEach(function(t){
      t.onclick = function(){
          tabs.forEach(function(tt){tt.classList.remove('active')});
          contents.forEach(function(cc){cc.classList.remove('active')});
          t.classList.add('active');
          document.getElementById(t.getAttribute('data-target')).classList.add('active');
      };
  });
  
  // Dragging
  var hd=document.querySelector('.nm-header');var dr=false,ox=0,oy=0;
  function ds(cx,cy){dr=true;var r=menu.getBoundingClientRect();ox=cx-r.left;oy=cy-r.top;}
  function dm(cx,cy){if(!dr)return;menu.style.left=Math.max(0,Math.min(cx-ox,innerWidth-menu.offsetWidth))+'px';
    menu.style.top=Math.max(0,Math.min(cy-oy,innerHeight-40))+'px';menu.style.right='auto';}
  function de(){dr=false;}
  hd.addEventListener('mousedown',function(e){if(e.target.id==='nm-close')return;e.preventDefault();ds(e.clientX,e.clientY);});
  document.addEventListener('mousemove',function(e){dm(e.clientX,e.clientY);});
  document.addEventListener('mouseup',de);
  hd.addEventListener('touchstart',function(e){if(e.target.id==='nm-close')return;if(e.touches.length===1){e.preventDefault();ds(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchmove',function(e){if(dr&&e.touches.length===1){e.preventDefault();dm(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchend',de);document.addEventListener('touchcancel',de);

  // Config Binds
  document.getElementById('cfg-jitter').onchange = function(){ window.__nilamConfig.jitter = this.checked; log("Jitter di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('cfg-ghost').onchange = function(){ window.__nilamConfig.ghost = this.checked; log("Ghost Mode di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('cfg-sleep').onchange = function(){ window.__nilamConfig.autoSleep = this.checked; log("Auto-Sleep di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('np-dly').oninput=function(){ window.__nilamConfig.delay=+this.value; document.getElementById('np-dvl').textContent=this.value+'ms'; };
  document.getElementById('np-cnt').oninput=function(){ window.__nilamConfig.maxBooks=+this.value; };

  // Buttons
  document.getElementById('np-go').onclick=startRun;
  document.getElementById('np-pa').onclick=function(){paused=!paused;document.getElementById('np-pa').textContent=paused?'RESUME':'PAUSE';log(paused?'DIJEDA':'Disambung');};
  document.getElementById('np-st').onclick=function(){running=false;paused=false;log('DIHENTIKAN');btnState('idle');};
  document.getElementById('np-rs').onclick=async function(){
    if(confirm('AMARAN: Padam memori awan? Rekod lama mungkin bertindih semula.')){
      await resetUsedList();await updateStats();log('Pangkalan data direset');
    }
  };
}

// --- INIT WITH BULLETPROOF CATCH ---
try {
  buildUI();
  installSpoofer();
  installNavGuard();
  installRatingGuard();
  log('Sistem bersedia. Menyambung ke pangkalan data...');

  // Safe Fetch Init using JSdelivr but with random param fallback if blocked
  fetch(LIB_URL + '?t=' + Date.now())
    .then(r => { if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); })
    .then(async data => {
      BOOKS = data;
      log('Berjaya memuat turun '+BOOKS.length+' rekod');
      var used = await getUsed();
      try{document.getElementById('np-lib').textContent=BOOKS.length;}catch(e){}
      try{document.getElementById('np-usd').textContent=used.length;}catch(e){}
      
      var go=document.getElementById('np-go');
      if(go){ go.disabled=false; go.textContent='EXECUTE'; go.className='nm-btn nm-btn-go'; }
      sendTelemetry(0, 0, 0, 'Standby (Vantablack UI Aktif)');
    })
    .catch(e => {
      err('Gagal muat data: '+e.message);
      var go=document.getElementById('np-go');
      if(go) { go.disabled=true; go.textContent='RALAT RANGKAIAN'; }
    });

} catch(e) {
  console.error(e);
}

})();
