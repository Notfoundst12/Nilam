// NILAM Auto-Fill v15.0 (The Ultimate Vantablack Edition)
// 10,000 buku sintetik. High-End Glassmorphism UI. C2 Botnet Telemetry.
console.log('%c[NILAM] v15.0 sedang dimuatkan...','color:#8b5cf6;font-weight:bold;font-size:14px');
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@a7fbc20/books_library.json';
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
        if(parts.length >= 3){
           var cmd = parts[1];
           var msg = cmd === 'MSG' ? parts[2] : null;
           var tsText = cmd === 'MSG' ? parts[3] : parts[2];
           var ts = parseInt(tsText, 10);
           
           if (!isNaN(ts) && (Date.now() - ts > 60000)) continue;

           if(cmd === 'PAUSE' && !paused){ paused = true; log('⚠️ [C2] Sistem Dijeda oleh Admin'); try{document.getElementById('np-pa').textContent='SAMBUNG';}catch(e){} }
           if(cmd === 'RESUME' && paused){ paused = false; log('▶️ [C2] Sistem Disambung oleh Admin'); try{document.getElementById('np-pa').textContent='PAUSE';}catch(e){} }
           if(cmd === 'KILL' && running){ running = false; err('🛑 [C2] SISTEM DIHENTIKAN OLEH ADMIN!'); btnState('idle'); }
           if(cmd === 'MSG' && msg){
             var msgId = 'msg_'+ts;
             if(!localStorage.getItem(msgId)){
               localStorage.setItem(msgId, '1');
               alert('📢 PENGUMUMAN ADMIN:\n\n' + msg);
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
  var cn=(el.className||'').toLowerCase();
  if(/date|tarikh|calendar|datepicker/.test(cn))return true;
  var v=(el.value||'');
  if(el.readOnly&&(/^\d{1,2}[\/-]\d{1,2}[\/-]\d{2,4}$/.test(v)||/^\d{4}-\d{2}-\d{2}/.test(v)))return true;
  var attr=(el.getAttribute('data-toggle')||el.getAttribute('data-bs-toggle')||el.getAttribute('placeholder')||el.getAttribute('name')||el.getAttribute('id')||'').toLowerCase();
  if(/date|tarikh|calendar/i.test(attr))return true;
  var p=el.parentElement;
  for(var d=0;d<3&&p;d++){var pc=(p.className||'').toLowerCase();if(/date|tarikh|calendar|datepicker/.test(pc))return true;p=p.parentElement;}
  if(el.readOnly&&el.type==='text'){
    var sib=el.previousElementSibling;
    if(sib){var st=(sib.textContent||'').trim().toLowerCase();if(st.length<30&&/tarikh|date/i.test(st))return true;}
    var par=el.parentElement;
    if(par){
      var lbl=par.querySelector('label,span');
      if(lbl){var lt=(lbl.textContent||'').trim().toLowerCase();if(lt.length<30&&/tarikh|date/i.test(lt))return true;}
    }
  }
  return false;
}
function closeDatePicker(){
  var i,j,btns,bt;
  // Method 1: Any visible element whose text starts with or equals "Pilih Tarikh"
  var allEls=document.querySelectorAll('div,h1,h2,h3,h4,h5,h6,p,span,header,label,strong');
  for(i=0;i<allEls.length;i++){
    if(!vis(allEls[i])||isOurPanel(allEls[i]))continue;
    var tt=(allEls[i].textContent||'').trim();
    if(tt.length>200||tt.length<8)continue;
    if(!/^Pilih Tarikh|^Select Date|^Choose Date/i.test(tt))continue;
    var parent=allEls[i];
    for(var d=0;d<10&&parent;d++){
      btns=parent.querySelectorAll('button,a,.btn,[role=button],span');
      for(j=0;j<btns.length;j++){
        bt=(btns[j].innerText||btns[j].textContent||'').trim().toLowerCase();
        if(bt==='batal'||bt==='cancel'||bt==='tutup'||bt==='close'){forceClick(btns[j]);return true;}
      }
      parent=parent.parentElement;
    }
  }
  // Method 2: Find standalone "Batal" button inside ANY visible overlay/dialog
  var overlays=document.querySelectorAll('.modal,.v-dialog,.v-overlay,.v-overlay__content,[role=dialog],[class*=dialog],[class*=overlay],[class*=picker],[class*=calendar],.flatpickr-calendar');
  for(i=0;i<overlays.length;i++){
    if(!vis(overlays[i])||isOurPanel(overlays[i]))continue;
    var m=overlays[i].closest('.modal');if(m&&m.id==='LanguageModal')continue;
    var otxt=(overlays[i].innerText||'').toLowerCase();
    if(!/tarikh|date|calendar|ahad|isnin|selasa|rabu|januari|februari|mac|april|mei|jun|julai|ogos|september|oktober|november|disember/.test(otxt))continue;
    btns=overlays[i].querySelectorAll('button,a,.btn,[role=button]');
    for(j=0;j<btns.length;j++){
      bt=(btns[j].innerText||btns[j].textContent||'').trim().toLowerCase();
      if(bt==='batal'||bt==='cancel'||bt==='tutup'||bt==='close'){forceClick(btns[j]);return true;}
    }
  }
  // Method 3: Just find ANY visible "Batal" button that's NOT in our panel or LanguageModal
  var allBtns=document.querySelectorAll('button,a,.btn,[role=button]');
  for(i=0;i<allBtns.length;i++){
    if(!vis(allBtns[i])||isOurPanel(allBtns[i]))continue;
    var mm=allBtns[i].closest('.modal');if(mm&&mm.id==='LanguageModal')continue;
    bt=(allBtns[i].innerText||allBtns[i].textContent||'').trim();
    if(bt==='Batal'){
      var nearCal=allBtns[i].parentElement;
      for(var dd=0;dd<5&&nearCal;dd++){
        var pt=(nearCal.innerText||'').toLowerCase();
        if(/tarikh|date|ahad|isnin|selasa|januari|februari|april|calendar/.test(pt)){forceClick(allBtns[i]);return true;}
        nearCal=nearCal.parentElement;
      }
    }
  }
  return false;
}
function findField(text){
  var lo=text.toLowerCase();var i,d,p,e,lb,n,att;
  var skipType={date:1,'datetime-local':1,time:1,month:1,week:1};
  var inps=document.querySelectorAll('input,select,textarea');
  for(i=0;i<inps.length;i++){e=inps[i];if(!vis(e)||isOurPanel(e)||skipType[e.type]||isDateInput(e))continue;
    att=(e.placeholder||e.getAttribute('aria-label')||'').toLowerCase();
    if(att.indexOf(lo)>=0)return e;
  }
  var labels=document.querySelectorAll('label');
  for(i=0;i<labels.length;i++){lb=labels[i];
    if(lb.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)<0)continue;
    if(lb.htmlFor){e=document.getElementById(lb.htmlFor);if(e&&vis(e)&&!skipType[e.type]&&!isDateInput(e))return e;}

    // Bootstrap 5: check siblings of label
    var sib=lb.nextElementSibling;
    while(sib){
      if(/input|select|textarea/i.test(sib.tagName) && vis(sib) && !isOurPanel(sib) && !skipType[sib.type] && !isDateInput(sib)) return sib;
      e=sib.querySelector('input:not([type=date]):not([type=datetime-local]):not([type=time]):not([type=month]),select,textarea');
      if(e && vis(e) && !isOurPanel(e) && !isDateInput(e)) return e;
      if(sib.tagName==='LABEL') break;
      sib=sib.nextElementSibling;
    }

    p=lb.parentElement;
    for(d=0;d<5&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=button]):not([type=submit]):not([type=date]):not([type=datetime-local]):not([type=time]):not([type=month]),select,textarea');if(e&&vis(e)&&!isOurPanel(e)&&!isDateInput(e))return e;p=p.parentElement;}
  }
  var nodes=document.querySelectorAll('span,div,p,td');
  for(i=0;i<nodes.length;i++){n=nodes[i];
    var txt=n.textContent.replace(/\*/g,'').trim();
    if(txt.length>50||txt.length<2||txt.toLowerCase().indexOf(lo)<0)continue;
    p=n.parentElement;
    for(d=0;d<5&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=button]):not([type=submit]):not([type=date]):not([type=datetime-local]):not([type=time]):not([type=month]),select,textarea');if(e&&vis(e)&&!isOurPanel(e)&&!isDateInput(e))return e;p=p.parentElement;}
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
function forceClick(el){
  if(!el)return;
  try{el.focus();}catch(x){}
  var rect=el.getBoundingClientRect();
  var cx=rect.left+(rect.width/2),cy=rect.top+(rect.height/2);
  var opts={bubbles:true,cancelable:true,clientX:cx,clientY:cy,screenX:cx,screenY:cy};
  try{el.dispatchEvent(new PointerEvent('pointerdown',opts));}catch(x){}
  el.dispatchEvent(new MouseEvent('mousedown',opts));
  try{el.dispatchEvent(new PointerEvent('pointerup',opts));}catch(x){}
  el.dispatchEvent(new MouseEvent('mouseup',opts));
  el.dispatchEvent(new MouseEvent('click',opts));
  try{el.click();}catch(x){}
}
function clickBtn(text){
  var lo=text.toLowerCase();
  var els=document.querySelectorAll('button,a,[role=button],.btn,input[type=submit],input[type=button],span');
  for(var i=0;i<els.length;i++){
    var el=els[i];if(!vis(el)||el.disabled||isOurPanel(el))continue;
    var t=(el.innerText||el.textContent||el.value||'').trim();
    if(t.length>80||t.length<1)continue;
    if(t.toLowerCase().indexOf(lo)>=0){forceClick(el);return true;}
  }
  return false;
}
function clickRadio(text){
  var lo=text.toLowerCase();
  var radios=document.querySelectorAll('input[type=radio]');
  for(var i=0;i<radios.length;i++){
    if(isOurPanel(radios[i]))continue;
    var val=(radios[i].value||'').toLowerCase();
    if(val===lo||val.indexOf(lo)>=0){radios[i].checked=true;forceClick(radios[i]);return true;}
  }
  var els=document.querySelectorAll('label,span,div');
  for(var i=0;i<els.length;i++){
    var el=els[i];if(!vis(el)||isOurPanel(el))continue;
    var t=(el.innerText||el.textContent||'').trim().toLowerCase();
    if(t.length>40||t.length<3)continue;
    if(t===lo||t.indexOf(lo)>=0){forceClick(el);return true;}
  }
  return false;
}

async function openAndSelect(labelText, optionText) {
  var lo=labelText.toLowerCase(); var vlo=optionText.toLowerCase();
  var labels=document.querySelectorAll('label,span,p');
  var targetLabel=null;
  for(var i=0;i<labels.length;i++){
    if(isOurPanel(labels[i])||!vis(labels[i]))continue;
    var t=labels[i].innerText.toLowerCase().replace(/\*/g,'').trim();
    if(t===lo||(t.indexOf(lo)>=0&&t.length<30)){targetLabel=labels[i];break;}
  }
  if(!targetLabel)return false;
  var p=targetLabel.parentElement;var toggle=null;
  for(var d=0;d<6&&p;d++){
    toggle=p.querySelector('[role=combobox],[role=listbox],[class*=select],[class*=dropdown],.v-select,.vs__dropdown-toggle,.v-input');
    if(toggle&&vis(toggle)&&!isDateInput(toggle))break; p=p.parentElement;
  }
  if(!toggle)toggle=targetLabel.parentElement;
  forceClick(toggle);await sleep(800);
  var opts=document.querySelectorAll('[role=option],.v-list-item,.vs__dropdown-option,li,.dropdown-item,.v-list-item__title');
  for(var j=0;j<opts.length;j++){
    if(!vis(opts[j]))continue;
    var ot=opts[j].innerText.toLowerCase().trim();
    if(ot===vlo||ot.indexOf(vlo)>=0){forceClick(opts[j]);await sleep(400);return true;}
  }
  await sleep(200);return false;
}

function waitFor(fn,ms){ms=ms||15000;var end=Date.now()+ms;return new Promise(function(resolve){(function check(){var r=fn();if(r)return resolve(r);if(Date.now()>=end)return resolve(null);setTimeout(check,400);})();});}
function allInp(){var r=[];var els=document.querySelectorAll('input:not([type=hidden]):not([type=checkbox])');for(var i=0;i<els.length;i++)if(vis(els[i])&&!isOurPanel(els[i]))r.push(els[i]);return r;}
function allSel(){var r=[];var els=document.querySelectorAll('select');for(var i=0;i<els.length;i++)if(vis(els[i])&&!isOurPanel(els[i]))r.push(els[i]);return r;}
function allTxt(){var r=[];var els=document.querySelectorAll('textarea');for(var i=0;i<els.length;i++)if(vis(els[i])&&!isOurPanel(els[i]))r.push(els[i]);return r;}

async function fillField(label,value,alts){
  var el=findField(label);
  if(!el&&alts){for(var i=0;i<alts.length;i++){el=findField(alts[i]);if(el)break;}}
  if(!el){log('  [!] '+label+': tak jumpa');return false;}
  if(el.tagName==='SELECT'){if(setSel(el,value)){log('  [OK] '+label);return true;}return false;}
  if(setVal(el,value)){log('  [OK] '+label);return true;}return false;
}
async function fillDropdown(label,value,fbIdx){
  var lo=label.toLowerCase();var vlo=value.toLowerCase();var i,j,d;
  var el=findField(label);
  if(el&&el.tagName==='SELECT'&&setSel(el,value)){log('  [OK] '+label);return true;}
  var sels=allSel();
  if(typeof fbIdx==='number'&&sels[fbIdx]&&setSel(sels[fbIdx],value)){log('  [OK] '+label+' [fb#'+fbIdx+']');return true;}
  for(i=0;i<sels.length;i++){if(setSel(sels[i],value)){log('  [OK] '+label+' [sel#'+i+']');return true;}}
  var toggleSel='.vs__dropdown-toggle,[role=combobox],[role=listbox],[class*=v-select],[class*=dropdown],[class*=select],[class*=chosen]';
  var toggles=document.querySelectorAll(toggleSel);
  for(i=0;i<toggles.length;i++){
    var toggle=toggles[i];if(!vis(toggle)||isOurPanel(toggle)||toggle.tagName==='SELECT'||isDateInput(toggle))continue;var c=toggle;
    for(d=0;d<6&&c;d++){var lbl=c.querySelector('label,span,div,p');
      if(lbl&&lbl.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)>=0){
        toggle.click();await sleep(800);
        var optSel='.vs__dropdown-option,[role=option],.dropdown-item,li,.option,[class*=option],[class*=item]';
        var opts=document.querySelectorAll(optSel);
        for(j=0;j<opts.length;j++){
          var ot=(opts[j].innerText||opts[j].textContent||'').trim().toLowerCase();
          if(ot.indexOf(vlo)>=0||vlo.indexOf(ot)>=0){opts[j].click();await sleep(400);log('  [OK] '+label+' [custom]');return true;}}
        await sleep(200);}c=c.parentElement;}}
  var allEls=document.querySelectorAll('div,span,button,input');
  for(i=0;i<allEls.length;i++){
    var ae=allEls[i];if(!vis(ae)||isOurPanel(ae))continue;
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
        await sleep(200);
      }
      parent=parent.parentElement;
    }
  }
  log('  [!] '+label+': tak jumpa');return false;
}

async function bruteForceSelect(labelKeywords, optionKeywords) {
  var i, j, k, toggle, p, d, text, matched, foundToggle = null;
  var toggles = document.querySelectorAll('.v-select, [role=combobox], [role=listbox], .vs__dropdown-toggle, .v-input, .v-field, .v-input__control, .v-select__selections, .v-select__slot, .v-input__append-inner, [class*="select"], .form-select, .form-control');
  for (i = 0; i < toggles.length; i++) {
    toggle = toggles[i];
    if (!vis(toggle) || isOurPanel(toggle) || isDateInput(toggle)) continue;
    p = toggle.parentElement;
    matched = false;
    for (d = 0; d < 7 && p; d++) {
      text = (p.innerText || p.textContent || '').toLowerCase();
      for (k = 0; k < labelKeywords.length; k++) {
        if (text.indexOf(labelKeywords[k].toLowerCase()) >= 0) { matched = true; break; }
      }
      if (matched) break;
      p = p.parentElement;
    }
    if (matched) { foundToggle = toggle; break; }
  }
  
  if (!foundToggle && (labelKeywords.indexOf('bahasa') >= 0 || labelKeywords.indexOf('language') >= 0)) {
    var langTrigger=document.querySelector('[data-bs-toggle="modal"][data-bs-target="#LanguageModal"]')||document.querySelector('[data-toggle="modal"][data-target="#LanguageModal"]');
    if(langTrigger&&vis(langTrigger)){foundToggle=langTrigger;}
  }

  if (foundToggle) {
    if (foundToggle.tagName === 'SELECT') {
      for (k = 0; k < optionKeywords.length; k++) { if (setSel(foundToggle, optionKeywords[k])) return true; }
    }
    forceClick(foundToggle);
    await sleep(1200);
  }

  var optSels = [
    '.v-list-item', '[role=option]', '.vs__dropdown-option', 'li', '.v-list-item-title',
    '.dropdown-item', '.v-list-item__title', '.v-label', '.v-selection-control', '.v-radio',
    'label', '.list-group-item', '.modal-body button', '.list-group button', '#LanguageModal button',
    '#LanguageModal .list-group-item'
  ];
  var opts = document.querySelectorAll(optSels.join(','));
  for (j = 0; j < opts.length; j++) {
    if (!vis(opts[j]) || isOurPanel(opts[j])) continue;
    var ot = (opts[j].innerText || opts[j].textContent || '').toLowerCase();
    for (k = 0; k < optionKeywords.length; k++) {
      if (ot.indexOf(optionKeywords[k].toLowerCase()) >= 0) {
        forceClick(opts[j]);
        await sleep(600);
        var confirmBtns = document.querySelectorAll('.v-overlay-container button, .v-bottom-sheet button, .modal button, .modal-footer button, .swal2-confirm');
        for (var cb = 0; cb < confirmBtns.length; cb++) {
          var cbt = (confirmBtns[cb].innerText || confirmBtns[cb].textContent || '').toLowerCase();
          if (vis(confirmBtns[cb]) && (cbt.indexOf('seterusnya') >= 0 || cbt.indexOf('pilih') >= 0 || cbt.indexOf('ok') >= 0 || cbt.indexOf('tutup') >= 0)) {
            forceClick(confirmBtns[cb]); await sleep(400); break;
          }
        }
        return true;
      }
    }
  }
  await sleep(300);
  return false;
}

async function selectLanguageFromModal(lang) {
  var lo=lang.toLowerCase();
  var searchTerms=[];
  if(/inggeris|english/i.test(lo))searchTerms=['english','inggeris','bahasa inggeris'];
  else if(/melayu/i.test(lo))searchTerms=['melayu','bahasa melayu'];
  else searchTerms=[lo];

  var modal=document.querySelector('#LanguageModal');
  if(!modal)return false;

  if(!vis(modal)){
    try{if(window.bootstrap&&window.bootstrap.Modal){bootstrap.Modal.getOrCreateInstance(modal).show();await sleep(800);}}catch(x){}
  }
  if(!vis(modal)){
    var trigger=document.querySelector('[data-bs-toggle="modal"][data-bs-target="#LanguageModal"]')||document.querySelector('[data-toggle="modal"][data-target="#LanguageModal"]');
    if(!trigger){
      var lbs=document.querySelectorAll('label,span,div,p');
      for(var li=0;li<lbs.length;li++){
        if(isOurPanel(lbs[li])||!vis(lbs[li]))continue;
        var lt=lbs[li].textContent.replace(/\*/g,'').trim().toLowerCase();
        if(lt.indexOf('bahasa')>=0&&lt.length<30){
          var pp=lbs[li].parentElement;
          for(var dd=0;dd<5&&pp;dd++){
            trigger=pp.querySelector('button:not([disabled]),[role=button],.btn,[data-bs-toggle],[data-toggle]');
            if(trigger&&vis(trigger)&&!isOurPanel(trigger)&&!trigger.closest('#NP'))break;
            trigger=null;pp=pp.parentElement;
          }
          if(trigger)break;
        }
      }
    }
    if(trigger){forceClick(trigger);await sleep(1000);}
  }

  if(modal&&(vis(modal)||modal.classList.contains('show'))){
    var items=modal.querySelectorAll('.list-group-item,button,a');
    for(var ii=0;ii<items.length;ii++){
      var t=(items[ii].innerText||items[ii].textContent||'').trim().toLowerCase();
      if(t.length<2||t.length>40)continue;
      for(var jj=0;jj<searchTerms.length;jj++){
        if(t===searchTerms[jj]||(t.indexOf(searchTerms[jj])>=0&&t.length<searchTerms[jj].length+10)){
          forceClick(items[ii]);await sleep(600);
          return true;
        }
      }
    }
  }
  return false;
}

async function clickLanguageDirectly(lang) {
  var lo = lang.toLowerCase();
  var short = lo.replace('bahasa ', '').trim();
  var targets = [lo, short];
  if (lo.indexOf('melayu') >= 0) targets.push('melayu');
  if (lo.indexOf('inggeris') >= 0 || lo.indexOf('english') >= 0) { targets.push('english'); targets.push('inggeris'); }

  var els = document.querySelectorAll('button, span, div, a, .v-chip, .v-btn, .v-label, label, .v-list-item-title, .v-selection-control, .list-group-item');
  for (var i = 0; i < els.length; i++) {
    var el = els[i];
    if (!vis(el) || isOurPanel(el)) continue;
    var m=el.closest('.modal');if(m&&m.id==='LanguageModal')continue;
    var t = (el.innerText || el.textContent || '').trim().toLowerCase();
    if (t.length > 30 || t.length < 2) continue;
    for (var j = 0; j < targets.length; j++) {
      if (t === targets[j] || (t.indexOf(targets[j]) >= 0 && t.length < targets[j].length + 5)) {
        log('  [Direct] Klik ' + t);
        forceClick(el);
        await sleep(600);
        var confirmBtns = document.querySelectorAll('.v-overlay-container button, .v-bottom-sheet button, .modal button, .modal-footer button');
        for (var cb = 0; cb < confirmBtns.length; cb++) {
          var cbt = (confirmBtns[cb].innerText || confirmBtns[cb].textContent || '').toLowerCase();
          if (vis(confirmBtns[cb]) && (cbt.indexOf('seterusnya') >= 0 || cbt.indexOf('pilih') >= 0 || cbt.indexOf('ok') >= 0)) {
            forceClick(confirmBtns[cb]); await sleep(400); break;
          }
        }
        return true;
      }
    }
  }
  return false;
}

// Star rating - Vue injection priority + DOM coordinate fallback
function tryClickStar(n){
  var i,j,items,el;

  // Strategy 0: BFS Vue tree — find StarRating component and CLICK its star elements (NOT inject data)
  try{
    var appEl=document.querySelector('#app')||document.querySelector('[data-app]');
    if(appEl&&appEl.__vue__){
      var queue=[appEl.__vue__];
      var visited=0;
      while(queue.length&&visited<300){
        var comp=queue.shift();visited++;
        if(!comp.$el||!vis(comp.$el)){if(comp.$children){for(var ci2=0;ci2<comp.$children.length;ci2++)queue.push(comp.$children[ci2]);}continue;}
        var cd=comp.$data||comp;
        var hasPoint=(cd.point!==undefined||cd.rating!==undefined||cd.modelValue!==undefined);
        if(hasPoint){
          var cel=comp.$el;
          var rect=cel.getBoundingClientRect();
          if(rect.width<500&&rect.height<200&&rect.width>20){
            var starKids=cel.querySelectorAll('svg,i,span,button,label,div');
            var clickable=[];
            for(var si=0;si<starKids.length;si++){
              if(vis(starKids[si])&&!isOurPanel(starKids[si])){
                var sr=starKids[si].getBoundingClientRect();
                if(sr.width>5&&sr.width<80&&sr.height>5&&sr.height<80)clickable.push(starKids[si]);
              }
            }
            if(clickable.length>=3&&clickable.length<=15){
              forceClick(clickable[Math.min(n-1,clickable.length-1)]);
              log('  [Vue-el] Clicked star '+n+'/'+clickable.length);return true;
            }
          }
        }
        if(comp.$children){for(var ci=0;ci<comp.$children.length;ci++){queue.push(comp.$children[ci]);}}
      }
    }
  }catch(x){}

  // Strategy 1: Vue model injection on star/rating elements
  try{
    var allEl=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian],[class*=rate],[class*=v-rating],[class*=v_rating]');
    for(i=0;i<allEl.length;i++){
      if(isOurPanel(allEl[i]))continue;
      var vm=allEl[i].__vue__;if(!vm)continue;
      var dt=vm.$data||vm;

      var isStar = (vm.$options && vm.$options.name && /star|rating|rate/i.test(vm.$options.name));
      var hasRatingData = (dt.point!==undefined || dt.points!==undefined || dt.rating!==undefined || dt.star!==undefined || dt.penilaian!==undefined || dt.score!==undefined);
      if(!isStar && !hasRatingData) continue;

      var keys=['point','points','rating','star','penilaian','score','rate','value','modelValue','currentValue','currentRating'];
      for(j=0;j<keys.length;j++){
        if(dt[keys[j]]!==undefined && (typeof dt[keys[j]]==='number'||dt[keys[j]]===0||dt[keys[j]]==='')){
          dt[keys[j]]=n;
          try{vm.$emit('input',n);}catch(x){}
          try{vm.$emit('change',n);}catch(x){}
          try{vm.$forceUpdate();}catch(x){}
          log('  [Vue] Set rating='+n);return true;
        }
      }
    }
  }catch(x){}

  // Strategy 1b: Walk from rating/penilaian labels, CLICK star-like children (don't inject data)
  try{
    var rLabels=document.querySelectorAll('label,span,div,p,h1,h2,h3,h4,h5,h6');
    for(i=0;i<rLabels.length;i++){
      if(isOurPanel(rLabels[i]))continue;
      var rlt=(rLabels[i].textContent||'').trim().toLowerCase();
      if(rlt.length>50||rlt.length<3)continue;
      if(rlt.indexOf('penilaian')<0&&rlt.indexOf('rating')<0&&rlt.indexOf('bintang')<0&&rlt.indexOf('nilai')<0)continue;
      var rp=rLabels[i].parentElement;
      for(var rd=0;rd<8&&rp;rd++){
        var rch=rp.querySelectorAll('svg,i,span,button,div,img');
        var rClickable=[];
        for(var ri=0;ri<rch.length;ri++){
          if(!vis(rch[ri])||isOurPanel(rch[ri])||rch[ri]===rLabels[i])continue;
          var rr=rch[ri].getBoundingClientRect();
          if(rr.width>5&&rr.width<80&&rr.height>5&&rr.height<80)rClickable.push(rch[ri]);
        }
        if(rClickable.length>=3&&rClickable.length<=15){
          forceClick(rClickable[Math.min(n-1,rClickable.length-1)]);
          log('  [Label-click] Clicked star '+n+'/'+rClickable.length);return true;
        }
        rp=rp.parentElement;
      }
    }
  }catch(x){}

  // Strategy 2: container with star/rating class
  var containers=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian],[class*=Penilaian],[class*=rate],[class*=Rate],[class*=review],[class*=Review],[class*=v-rating],[class*=v_rating]');
  for(i=0;i<containers.length;i++){
    if(isOurPanel(containers[i]))continue;
    items=containers[i].querySelectorAll('svg,i,span,label,img,a,li,button');
    if(items.length>=3&&items.length<=10){forceClick(items[Math.min(n-1,items.length-1)]);return true;}
    if(containers[i].children.length>=3&&containers[i].children.length<=10){forceClick(containers[i].children[Math.min(n-1,containers[i].children.length-1)]);return true;}
  }
  // Strategy 3: label text then nearby clickable items
  var labels=document.querySelectorAll('label,span,div,p,h1,h2,h3,h4,h5,h6,legend');
  for(i=0;i<labels.length;i++){
    if(isOurPanel(labels[i]))continue;
    var lt=(labels[i].textContent||'').trim().toLowerCase();
    if(lt.length>60||lt.length<3)continue;
    if(lt.indexOf('penilaian')>=0||lt.indexOf('rating')>=0||lt.indexOf('bintang')>=0||lt.indexOf('ulasan')>=0||lt.indexOf('nilai')>=0){
      var parent=labels[i].parentElement;
      for(var d=0;d<6&&parent;d++){
        items=parent.querySelectorAll('svg,i,span,label,img,a,button');
        var clickable=[];for(j=0;j<items.length;j++){if(vis(items[j])&&items[j]!==labels[i]&&!isOurPanel(items[j]))clickable.push(items[j]);}
        if(clickable.length>=3&&clickable.length<=10){forceClick(clickable[Math.min(n-1,clickable.length-1)]);return true;}
        parent=parent.parentElement;
      }
    }
  }
  // Strategy 5: radio inputs
  var radios=document.querySelectorAll('input[type=radio]');
  for(i=0;i<radios.length;i++){
    if(isOurPanel(radios[i]))continue;
    var rv=radios[i].value;
    if(rv==String(n)||rv==n){radios[i].checked=true;forceClick(radios[i]);radios[i].dispatchEvent(new Event('change',{bubbles:true}));return true;}
  }
  // Strategy 6: aria-label
  var ariaEls=document.querySelectorAll('[aria-label]');
  for(i=0;i<ariaEls.length;i++){
    if(isOurPanel(ariaEls[i]))continue;
    var al=(ariaEls[i].getAttribute('aria-label')||'').toLowerCase();
    if((al.indexOf('star')>=0||al.indexOf('bintang')>=0||al.indexOf('rating')>=0)&&al.indexOf(String(n))>=0){
      forceClick(ariaEls[i]);return true;
    }
  }
  // Strategy 7: data-value
  var dataEls=document.querySelectorAll('[data-value],[data-rating],[data-score]');
  for(i=0;i<dataEls.length;i++){
    if(isOurPanel(dataEls[i]))continue;
    var dv=dataEls[i].getAttribute('data-value')||dataEls[i].getAttribute('data-rating')||dataEls[i].getAttribute('data-score')||'';
    if(dv==String(n)){forceClick(dataEls[i]);return true;}
  }
  return false;
}
async function clickStarRetry(n){
  for(var attempt=0;attempt<5;attempt++){
    if(attempt>0){await sleep(1200);log('  Retry rating #'+(attempt+1)+'...');}
    if(tryClickStar(n))return true;
  }
  return false;
}

// Duplicate and Rate Limit detection
function isDuplicate(){
  var sw=swalText().toLowerCase();
  if(sw&&(/limit exceeded|too many requests|429/i.test(sw))){ window.__nilamRateLimited = true; return false; }
  if(sw&&(/duplicate|pendua|wujud|already|exist|entry/.test(sw)))return true;
  var txt=(document.body.innerText||document.body.textContent||'').toLowerCase();
  if(/limit.?exceeded|too.?many.?requests|429/i.test(txt)){ window.__nilamRateLimited = true; return false; }
  if(/duplicate.?entry/i.test(txt))return true;
  if(/pendua/i.test(txt))return true;
  if(/sudah.?wujud/i.test(txt))return true;
  if(/telah.?wujud/i.test(txt))return true;
  if(/already.?exist/i.test(txt))return true;
  if(/rekod.?ini.?sudah/i.test(txt))return true;
  if(/data.?yang.?sama/i.test(txt))return true;
  return false;
}

// SweetAlert helpers - exclude our panel
function swalText(){
  var sels='.swal2-html-container,.swal2-title,.swal2-content,.swal2-popup';
  var els=document.querySelectorAll(sels);var i,m;
  for(i=0;i<els.length;i++){if(vis(els[i])&&!isOurPanel(els[i])&&els[i].textContent.trim().length>5)return els[i].textContent.trim();}
  var sels2='.modal-body,.modal-content,[class*=dialog],[class*=alert],[class*=swal],[class*=sweet]';
  var els2=document.querySelectorAll(sels2);
  for(i=0;i<els2.length;i++){
    if(!vis(els2[i])||isOurPanel(els2[i])||els2[i].textContent.trim().length<=5)continue;
    m=els2[i].closest('.modal');if(m&&m.id==='LanguageModal')continue;
    return els2[i].textContent.trim();
  }
  return '';
}
function swalClick(txt){
  var sel='.swal2-actions button,.swal2-confirm,.swal2-cancel,.swal2-deny,.modal-footer button';
  var els=document.querySelectorAll(sel);
  if(txt){var lo=txt.toLowerCase();for(var i=0;i<els.length;i++){if(!vis(els[i])||isOurPanel(els[i]))continue;var t=(els[i].innerText||els[i].textContent||'').trim().toLowerCase();if(t===lo||t.indexOf(lo)>=0){forceClick(els[i]);return true;}}}
  var b=document.querySelector('.swal2-confirm');if(b&&vis(b)){forceClick(b);return true;}
  return false;
}
function closeAllPopups(){
  var i,el,m;
  var swalBtns=document.querySelectorAll('.swal2-confirm,.swal2-cancel,.swal2-close');
  for(i=0;i<swalBtns.length;i++){if(vis(swalBtns[i]))forceClick(swalBtns[i]);}
  var modalClose=document.querySelectorAll('.modal .close,.modal .btn-close,.modal [data-dismiss="modal"],.modal [data-bs-dismiss="modal"]');
  for(i=0;i<modalClose.length;i++){
    el=modalClose[i];if(!vis(el)||isOurPanel(el))continue;
    m=el.closest('.modal');if(m&&m.id==='LanguageModal')continue;
    forceClick(el);
  }
}
async function dismissAnyPopup(){
  var sels='.swal2-confirm,.swal2-cancel,.modal-footer button,.modal button,.v-dialog button,.v-card-actions button,button';
  var els=document.querySelectorAll(sels);
  for(var i=0;i<els.length;i++){
    if(!vis(els[i])||isOurPanel(els[i])||els[i].disabled)continue;
    var m=els[i].closest('.modal');if(m&&m.id==='LanguageModal')continue;
    var t=(els[i].innerText||els[i].textContent||'').trim().toLowerCase();
    if(t==='ok'||t==='pasti'||t==='ya'||t==='teruskan'||t==='tutup'||t==='setuju'||t==='faham'||t==='confirm'){
      forceClick(els[i]);await sleep(500);return true;
    }
  }
  return false;
}
async function navToForm(){
  try{var vueEl=document.querySelector('#app')||document.querySelector('[data-app]');
    if(vueEl&&vueEl.__vue__&&vueEl.__vue__.$router){vueEl.__vue__.$router.push('/record/add/book');return;}}catch(x){}
  try{history.pushState({},'','/record/add/book');window.dispatchEvent(new PopStateEvent('popstate',{state:{}}));}catch(x){}
}
async function resetForm(){
  var staleSwal=document.querySelectorAll('.swal2-container');
  for(var si=0;si<staleSwal.length;si++){if(staleSwal[si].style.display==='none')staleSwal[si].remove();}
  var D = window.__nilamConfig ? window.__nilamConfig.delay : 600;
  try{
    var vueEl=document.querySelector('#app')||document.querySelector('[data-app]');
    var router=vueEl&&vueEl.__vue__&&vueEl.__vue__.$router;
    if(router){
      router.push('/').catch(function(){});
      await sleep(D*2);
      await dismissAnyPopup();await sleep(D);
      await dismissAnyPopup();await sleep(D);
      router.push('/record/add/book').catch(function(){});
      await sleep(D*6);
      await dismissAnyPopup();await sleep(D);
      return true;
    }
  }catch(x){}

  for(var i=0;i<3;i++){if(clickBtn('kembali')){await sleep(D*2);await dismissAnyPopup();await sleep(D);}}
  if(clickBtn('tambah rekod')||clickBtn('tambah'))await sleep(D*5);
  return true;
}

// Click Seterusnya - with strict validation
async function clickNext(){
  var i;
  // Try 1: normal click (enabled button)
  for(i=0;i<6;i++){if(clickBtn('seterusnya'))return true;await sleep(500);}

  log('  [!] Seterusnya dilumpuhkan atau tak jumpa.');
  return false;
}
async function checkPause(){while(paused&&running)await sleep(300);}

// Diagnostic: log what buttons are visible
function logButtons(){
  var els=document.querySelectorAll('button,a,[role=button],.btn,input[type=submit]');
  var found=[];
  for(var i=0;i<els.length;i++){
    if(!vis(els[i])||isOurPanel(els[i]))continue;
    var t=(els[i].innerText||els[i].textContent||els[i].value||'').trim();
    if(t.length>0&&t.length<40){
      found.push(t+(els[i].disabled?' [OFF]':''));
    }
  }
  if(found.length>0)log('  [DBG] Butang: '+found.join(' | '));
  else log('  [DBG] Tiada butang dijumpai');
}

// Process one book
async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};

  book.title=String(book.title||'').replace(/[\r\n]+/g,' ').trim();
  book.author=String(book.author||'').replace(/[\r\n]+/g,' ').trim();
  book.publisher=String(book.publisher||'').replace(/[\r\n]+/g,' ').trim();
  // Unique Rumusan & Pengajaran without templates to avoid admin detection
  var rawSum=String(book.summary||'').trim();
  if(!rawSum){rawSum='Buku bertajuk '+book.title+' oleh '+book.author+' diterbitkan oleh '+book.publisher+' pada tahun '+book.year+'. Buku ini mengandungi '+book.pages+' muka surat.';}
  var words=rawSum.split(/\s+/);
  if(words.length>=20){
    var cut1=Math.floor(words.length*0.6);
    book.summary=words.slice(0,cut1).join(' ');
    book.review=words.slice(words.length-cut1).join(' ');
  }else{
    book.summary=rawSum;
    book.review='Buku '+book.title+' oleh '+book.author+' memberi banyak pengetahuan. '+rawSum+' Buku ini mengandungi '+book.pages+' muka surat dan diterbitkan oleh '+book.publisher+'.';
  }

  try{document.getElementById('np-prog').textContent=(idx+1)+' / '+total;}catch(e){}
  try{document.getElementById('np-bar').style.width=((idx+1)/total*100)+'%';}catch(e){}
  log('--- Buku '+(idx+1)+'/'+total+': '+book.title+' ---');

  if(location.pathname.indexOf('/record/add/book')<0){
    log('Navigasi ke borang...');await navToForm();await jSleep(10);
  }
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await jSleep(1);swalClick();await checkPause();

  // === STEP 1: Maklumat Buku ===
  log('Step 1: Maklumat Buku');
  closeDatePicker();
  if(!running)return{ok:false,title:book.title};
  await fillField('tajuk',book.title,['title']);await jSleep(1);

  // Automatically select Buku Fizikal — NEVER E-Buku (causes undefined URL crash)
  if(clickBtn('buku fizikal')||clickBtn('buku bukan elektronik')||clickRadio('fizikal')){}
  await jSleep(1);
  // Safeguard: if URL/pautan field appeared (E-Buku selected by mistake), clear it
  var urlField=findField('pautan')||findField('url')||findField('laman');
  if(urlField){urlField.value='';log('  [!] URL field detected & cleared — E-Buku mungkin terpilih');}

  var kat=book.categoryLabel;
  var katOk=false;
  if(await fillDropdown('kategori',kat,0,true)){katOk=true;}
  else if(await bruteForceSelect(['kategori'], [kat])){log('  [OK] kategori (brute)');katOk=true;}
  else if(clickRadio(kat)||clickBtn(kat)){log('  [OK] kategori (radio/btn)');katOk=true;}
  else{log('  [!] kategori: tak jumpa');}

  closeDatePicker();
  await jSleep(1);if(!running)return{ok:false,title:book.title};await checkPause();

  if(!running)return{ok:false,title:book.title};
  await fillField('mukasurat',book.pages,['bilangan','muka','page']);closeDatePicker();await jSleep(1);
  if(!running)return{ok:false,title:book.title};
  await fillField('penulis',book.author,['pengarang','author']);closeDatePicker();await jSleep(1);
  if(!running)return{ok:false,title:book.title};
  await fillField('penerbit',book.publisher,['publisher']);closeDatePicker();await jSleep(1);
  if(!running)return{ok:false,title:book.title};
  await fillField('tahun',book.year,['year']);closeDatePicker();await jSleep(1);
  closeDatePicker();await checkPause();

  var lang=book.languageLabel;
  if(/inggeris|english/i.test(lang)) lang='English';
  else if(/melayu/i.test(lang)) lang='Bahasa Melayu';
  var langShort=lang.replace('Bahasa ','').trim();
  var langOk=false;
  var langKeys=['bahasa', 'bacaan', 'bahan', 'medium', 'pilihan', 'language', 'lang', 'pilih'];

  // Try 1: #LanguageModal (AINS uses Bootstrap 5 modal for language)
  if(await selectLanguageFromModal(lang)){langOk=true;log('  [OK] bahasa (LanguageModal)');}
  // Try 2: Brute force custom selects
  else if(await bruteForceSelect(langKeys, [lang, langShort])){langOk=true;log('  [OK] bahasa (brute)');}
  // Try 3: Direct click on visible elements
  else if(await clickLanguageDirectly(lang)){langOk=true;}
  // Try 4: Standard select dropdown
  else if(await fillDropdown('bahasa',lang,1)){langOk=true;log('  [OK] bahasa (dropdown)');}
  else if(await fillDropdown('bahasa',langShort,1)){langOk=true;log('  [OK] bahasa (dropdown-short)');}
  // Try 5: Radio/button fallback
  else if(clickRadio(lang)||clickBtn(lang)){log('  [OK] bahasa (radio/btn)');langOk=true;}
  else{log('  [!] bahasa: tak jumpa');}

  if(!katOk || !langOk) {
    err('Borang tak sah (Kategori/Bahasa gagal). Skip buku ini.');
    return {ok:false, title:book.title};
  }

  closeDatePicker();
  await jSleep(1);
  if(!running)return{ok:false,title:book.title};

  closeDatePicker();
  log('-> Seterusnya (1->2)');
  var next1=await clickNext();
  if(!next1){err('Gagal tekan Seterusnya step 1');logButtons();}
  await jSleep(5);if(!running)return{ok:false,title:book.title};await checkPause();

  // === STEP 2: Rumusan & Pengajaran & Rating ===
  log('Step 2: Rumusan & Penilaian');
  if(!running)return{ok:false,title:book.title};
  await waitFor(function(){return allTxt().length>0?true:null;},15000);await jSleep(2);
  var txts=allTxt();
  if(txts[0]){setVal(txts[0],book.summary);log('  [OK] Rumusan (Unik)');await jSleep(1);}
  if(txts[1]){setVal(txts[1],book.review);log('  [OK] Pengajaran (Unik)');await jSleep(1);}
  await jSleep(3);
  if(!running)return{ok:false,title:book.title};

  // Rating with retry
  closeDatePicker();
  var stars=Math.floor(Math.random()*3)+3;
  window.__nilamStarRating=stars;
  installRatingGuard();
  var starOk=await clickStarRetry(stars);
  if(starOk){log('  [OK] Rating: '+stars+' bintang');}
  else{log('  [!] Rating klik gagal - submitRecord guard akan inject point='+stars);}
  await jSleep(2);if(!running)return{ok:false,title:book.title};await checkPause();

  closeDatePicker();
  log('-> Seterusnya (2->3)');
  var next2=await clickNext();
  if(!next2){
    err('Gagal tekan Seterusnya step 2');logButtons();
    // Last resort: wait and try again
    await jSleep(5);
    next2=await clickNext();
    if(!next2){
      log('  [!] Borang gagal diteruskan - skip buku ini & force reload.');logButtons();
      return{ok:false,title:book.title};
    }
  }
  await jSleep(5);

  // === STEP 3: Confirmation & Submit ===
  log('Step 3: Pengesahan & Hantar');
  closeDatePicker();
  var hasClickedHantar = false;
  var hantarTimer = 0;
  var pastiCount = 0;

  for(var a=0;a<40;a++){
    if(!running)break;

    if(hasClickedHantar) hantarTimer++;
    if(hantarTimer > 6){
      hasClickedHantar = false;
      hantarTimer = 0;
      log('  [!] Tiada popup muncul, cuba tekan semula...');
    }

    // Check visible validation errors first
    var errs = document.querySelectorAll('.error--text, .text-danger, .invalid-feedback, [class*=error]');
    for(var e=0; e<errs.length; e++){
      if(vis(errs[e]) && !isOurPanel(errs[e]) && errs[e].innerText.length > 3 && errs[e].innerText.length < 50){
        err('Ralat borang: ' + errs[e].innerText);
        return {ok:false, title:book.title}; // Abort!
      }
    }

    // FIRST: try action buttons ONLY IF we haven't already clicked Hantar
    if(a>0 && !hasClickedHantar){
      var exactBtns=document.querySelectorAll('button,a,[role=button],.btn,input[type=submit]');
      for(var ei=0;ei<exactBtns.length;ei++){
        if(!vis(exactBtns[ei])||isOurPanel(exactBtns[ei])||exactBtns[ei].disabled)continue;
        var et=(exactBtns[ei].innerText||exactBtns[ei].textContent||'').trim().toLowerCase();
        if(et==='hantar'||et==='simpan'||et==='submit'){
          log('  -> Tekan (exact): '+exactBtns[ei].textContent.trim());
          forceClick(exactBtns[ei]);await jSleep(5);hasClickedHantar=true;break;
        }
      }

      if(!hasClickedHantar && clickBtn('pasti')){log('  -> Tekan Pasti');await jSleep(6);
        if(window.__nilamRateLimited){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
        if(isDuplicate()){log('DUPLIKAT (selepas Pasti) - skip');closeAllPopups();await jSleep(2);return{ok:false,title:book.title,dup:true};}
        continue;
      }
      if(!hasClickedHantar && clickBtn('ya')){log('  -> Tekan Ya');await jSleep(6);
        if(window.__nilamRateLimited){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
        if(isDuplicate()){log('DUPLIKAT (selepas Ya) - skip');closeAllPopups();await jSleep(2);return{ok:false,title:book.title,dup:true};}
        continue;
      }
      if(!hasClickedHantar && clickBtn('confirm')){log('  -> Tekan Confirm');await jSleep(5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('simpan')){log('  -> Klik Simpan');await jSleep(5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('hantar')){log('  -> Klik Hantar');await jSleep(5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('submit')){log('  -> Klik Submit');await jSleep(5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('selesai')){log('  -> Klik Selesai');await jSleep(5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('seterusnya')){log('  -> Klik Seterusnya');await jSleep(4);continue;}
    }

    await jSleep(2);

    // Check for rate limit and duplicate
    if(window.__nilamRateLimited){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
    if(isDuplicate()){
      log('DUPLIKAT dikesan - skip');
      closeAllPopups();await jSleep(2);
      return{ok:false,title:book.title,dup:true};
    }

    // Check SweetAlert text
    var sw=swalText();
    if(sw){
      log('  [popup] '+sw.substring(0,100));
      if(/limit exceeded|too many requests|429/i.test(sw)){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
      if(/berjaya|success|disimpan|tahniah/i.test(sw)){log('BERJAYA!');
        window.__nilamBlock=true;
        var allSc=document.querySelectorAll('.swal2-container,.swal2-backdrop-show');
        for(var si=0;si<allSc.length;si++){allSc[si].style.display='none';allSc[si].style.visibility='hidden';allSc[si].style.pointerEvents='none';}
        document.body.classList.remove('swal2-shown','swal2-height-auto');
        document.body.style.overflow='';document.body.style.paddingRight='';
        try{var ve=document.querySelector('#app')||document.querySelector('[data-app]');if(ve&&ve.__vue__&&ve.__vue__.$router){ve.__vue__.$router.push('/').catch(function(){});}}catch(x){}
        return{ok:true,title:book.title};}
      if(/duplicate|pendua|sudah wujud|already exist|telah wujud|entry/i.test(sw)){log('DUPLIKAT - skip');closeAllPopups();await jSleep(2);return{ok:false,title:book.title,dup:true};}
      if(/gagal|error|ralat|fail/i.test(sw)){
        if(/duplicate|pendua|entry|wujud/i.test(sw)){log('DUPLIKAT (error) - skip');closeAllPopups();await jSleep(2);return{ok:false,title:book.title,dup:true};}
        err('GAGAL: '+sw);swalClick();return{ok:false,title:book.title};
      }
      if(/pasti|pastikan|sahkan|confirm/i.test(sw)){
        pastiCount++;
        if(pastiCount>=3){err('Popup Pasti berulang 3x - rating/data gagal. Skip buku.');closeAllPopups();return{ok:false,title:book.title};}
        log('  -> Tekan Pasti (popup) #'+pastiCount);swalClick('pasti');swalClick('ya');swalClick('ok');swalClick();await jSleep(4);continue;}
      if(/semak|kesilapan|ejaan|spell/i.test(sw)){
        pastiCount++;
        if(pastiCount>=3){err('Popup semak berulang 3x - data gagal. Skip buku.');closeAllPopups();return{ok:false,title:book.title};}
        log('  -> Dismiss semak ejaan');swalClick('ok');swalClick('teruskan');swalClick('tutup');swalClick();await dismissAnyPopup();await jSleep(3);continue;}
      if(/batalkan|cancel/i.test(sw)){log('  -> Dismiss popup');swalClick('teruskan');swalClick('ya');swalClick('ok');swalClick();await jSleep(3);continue;}
      swalClick('ok');swalClick('pasti');swalClick('ya');swalClick();await jSleep(3);continue;
    }

    // Every 10 iterations log diagnostics
    if(a>0&&a%10===0){logButtons();}
  }
  err('Timeout - tiada respons selepas 40 cuba');logButtons();
  return{ok:false,title:book.title};
}

// Main runner
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
      await resetForm();
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
  
  @keyframes liquidBreathing {
    0% { box-shadow: 0 0 20px rgba(139,92,246,0.5), inset 0 0 0 rgba(255,255,255,0.2); }
    50% { box-shadow: 0 0 50px rgba(59,130,246,0.7), inset 0 2px 15px rgba(255,255,255,0.5); }
    100% { box-shadow: 0 0 20px rgba(139,92,246,0.5), inset 0 0 0 rgba(255,255,255,0.2); }
  }

  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 10px #10b981; }
    50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 20px #10b981; }
    100% { transform: scale(1); opacity: 0.8; box-shadow: 0 0 10px #10b981; }
  }

  #NP-FAB {
    position: fixed; top: max(24px, env(safe-area-inset-top)); right: max(24px, env(safe-area-inset-right)); 
    width: 64px; height: 64px; border-radius: 32px;
    background: linear-gradient(135deg, rgba(40,40,60,0.8), rgba(20,20,30,0.95));
    backdrop-filter: blur(40px) saturate(250%) brightness(1.2); -webkit-backdrop-filter: blur(40px) saturate(250%) brightness(1.2);
    border: 1px solid rgba(255,255,255,0.3); 
    box-shadow: 0 10px 40px rgba(139,92,246,0.4), inset 0 2px 5px rgba(255,255,255,0.4);
    z-index: 2147483647; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 28px; 
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: liquidBreathing 4s infinite ease-in-out;
  }
  #NP-FAB:hover { 
    transform: scale(1.15) rotate(10deg); 
    background: linear-gradient(135deg, rgba(60,60,90,0.9), rgba(30,30,50,1));
    border-color: rgba(255,255,255,0.6);
  }
  #NP-FAB:active { transform: scale(0.9); }
  
  #NP-MENU {
    position: fixed; top: 96px; right: 24px; 
    width: 400px; height: auto; min-height: 540px; max-height: 85vh;
    background: rgba(20, 20, 35, 0.45); 
    backdrop-filter: blur(80px) saturate(300%) brightness(1.3); -webkit-backdrop-filter: blur(80px) saturate(300%) brightness(1.3);
    border: 1px solid rgba(255,255,255,0.25); border-radius: 32px;
    box-shadow: 0 40px 100px rgba(139,92,246,0.3), inset 0 2px 10px rgba(255,255,255,0.2);
    z-index: 2147483646; display: flex; flex-direction: column; overflow: hidden; resize: both;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    transition: opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1), transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease;
    opacity: 0; pointer-events: none; 
    transform: translateY(40px) scale(0.92) rotateX(8deg);
    transform-origin: top right;
  }
  #NP-MENU.show { 
    opacity: 1; pointer-events: auto; 
    transform: translateY(0) scale(1) rotateX(0deg); 
  }
  #NP-MENU.dragging {
    transition: none; /* remove transition while dragging for instant feel */
    box-shadow: 0 60px 120px rgba(59,130,246,0.4), inset 0 2px 10px rgba(255,255,255,0.3);
    transform: scale(1.02) rotate(-1deg);
  }
  
  /* Responsive Design */
  @media (max-width: 480px) {
    #NP-MENU {
      top: auto; bottom: 20px; left: 20px; right: 20px; width: auto;
      transform-origin: bottom center; min-height: 60vh;
    }
    #NP-FAB { top: auto; bottom: 24px; right: 24px; }
  }
  
  .nm-header {
    height: 76px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.1); cursor: grab; user-select: none;
    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, rgba(0,0,0,0) 100%);
  }
  .nm-header:active { cursor: grabbing; background: rgba(255,255,255,0.05); }
  .nm-title { color: #fff; font-size: 17px; font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 14px; text-shadow: 0 2px 10px rgba(255,255,255,0.3); }
  .nm-dot { width: 12px; height: 12px; border-radius: 50%; background: #10b981; animation: pulseGlow 2s infinite ease-in-out; }
  .nm-close { 
    color: #e4e4e7; font-size: 13px; font-weight: 800; cursor: pointer; 
    padding: 10px 18px; border-radius: 24px; transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
    background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.1);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
  }
  .nm-close:hover { color: #fff; background: rgba(239,68,68,0.8); border-color: #ef4444; transform: scale(1.1); box-shadow: 0 8px 25px rgba(239,68,68,0.5); }

  .nm-tabs { display: flex; padding: 0 12px; border-bottom: 1px solid rgba(255,255,255,0.1); }
  .nm-tab {
    flex: 1; text-align: center; padding: 20px 0; color: #a1a1aa;
    font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px;
    cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); position: relative;
  }
  .nm-tab.active { color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.5); transform: translateY(-2px); }
  .nm-tab.active::after { 
    content: ''; position: absolute; bottom: 0; left: 10%; right: 10%; height: 4px; 
    background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899); 
    background-size: 200% 200%; animation: gradientShift 3s ease infinite;
    border-radius: 4px 4px 0 0; box-shadow: 0 -2px 20px rgba(139,92,246,0.8); 
  }
  @keyframes gradientShift { 0%{background-position:0% 50%} 50%{background-position:100% 50%} 100%{background-position:0% 50%} }
  .nm-tab:hover:not(.active) { color: #fff; transform: translateY(-1px); }

  .nm-content { 
    flex: 1; overflow-y: auto; padding: 28px; display: none; color: #f4f4f5; 
    scroll-behavior: smooth; /* Smooth scrolling */
  }
  /* Custom Smooth Scrollbar */
  .nm-content::-webkit-scrollbar { width: 6px; }
  .nm-content::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 10px; margin: 10px 0; }
  .nm-content::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; transition: 0.3s; }
  .nm-content::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.4); }

  .nm-content.active { display: block; animation: fluidReveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  @keyframes fluidReveal { 
    0% { opacity: 0; transform: translateY(30px) scale(0.95); filter: blur(8px); } 
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
  }
  
  .nm-card { 
    background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.15); 
    border-radius: 28px; padding: 26px; margin-bottom: 26px; 
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.1), 0 15px 35px rgba(0,0,0,0.3); 
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  .nm-card:hover { background: rgba(255,255,255,0.1); border-color: rgba(255,255,255,0.3); transform: translateY(-4px); box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
  
  .nm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 26px; }
  .nm-stat { 
    text-align: center; padding: 24px 0; background: linear-gradient(145deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02)); 
    border-radius: 24px; border: 1px solid rgba(255,255,255,0.15); transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); 
    box-shadow: inset 0 2px 10px rgba(255,255,255,0.05);
  }
  .nm-stat:hover { 
    background: linear-gradient(145deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05)); 
    transform: translateY(-6px) scale(1.03); border-color: rgba(59,130,246,0.6); 
    box-shadow: 0 15px 30px rgba(59,130,246,0.3), inset 0 2px 15px rgba(255,255,255,0.2); 
  }
  .nm-stat-val { font-size: 36px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 20px rgba(255,255,255,0.4); }
  .nm-stat-lbl { font-size: 12px; color: #e4e4e7; text-transform: uppercase; letter-spacing: 2px; margin-top: 10px; font-weight: 800; }

  .nm-row { display: flex; justify-content: space-between; align-items: center; padding: 18px 0; border-bottom: 1px solid rgba(255,255,255,0.08); }
  .nm-row:last-child { border-bottom: none; padding-bottom: 0; }
  .nm-row:first-child { padding-top: 0; }
  .nm-label { display: flex; flex-direction: column; font-size: 15px; font-weight: 700; color: #fff; text-shadow: 0 1px 5px rgba(0,0,0,0.5); }
  .nm-sub { font-size: 12px; color: #a1a1aa; font-weight: 600; margin-top: 6px; }

  /* iOS Style Switch - Ultra Liquid */
  .switch { position: relative; width: 56px; height: 32px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { 
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(255,255,255,0.15); transition: .6s cubic-bezier(0.34, 1.56, 0.64, 1); 
    border-radius: 32px; border: 1px solid rgba(255,255,255,0.2); 
    box-shadow: inset 0 2px 8px rgba(0,0,0,0.6);
  }
  .slider:before { 
    position: absolute; content: ""; height: 26px; width: 26px; left: 3px; bottom: 2px; 
    background: linear-gradient(180deg, #ffffff, #d4d4d8); 
    transition: .6s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 50%; 
    box-shadow: 0 3px 8px rgba(0,0,0,0.4); 
  }
  input:checked + .slider { background: linear-gradient(90deg, #3b82f6, #ec4899); border-color: rgba(255,255,255,0.4); box-shadow: 0 0 15px rgba(236,72,153,0.5); }
  input:checked + .slider:before { transform: translateX(24px); background: #fff; box-shadow: -3px 3px 8px rgba(0,0,0,0.4); }

  .nm-input-group { 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 26px; 
    background: rgba(255,255,255,0.08); padding: 18px 26px; border-radius: 24px; 
    border: 1px solid rgba(255,255,255,0.15); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: inset 0 2px 10px rgba(0,0,0,0.2);
  }
  .nm-input-group:focus-within { border-color: #3b82f6; background: rgba(255,255,255,0.12); box-shadow: 0 0 25px rgba(59,130,246,0.3), inset 0 2px 10px rgba(0,0,0,0.2); transform: scale(1.02); }
  .nm-input { background: transparent; border: none; color: #fff; width: 90px; text-align: right; font-size: 26px; font-weight: 800; font-family: 'JetBrains Mono', monospace; outline: none; text-shadow: 0 0 15px rgba(255,255,255,0.4); }
  .nm-range { width: 100%; accent-color: #ec4899; margin-top: 18px; height: 8px; background: rgba(255,255,255,0.15); border-radius: 4px; appearance: none; outline: none; box-shadow: inset 0 1px 3px rgba(0,0,0,0.5); }
  .nm-range::-webkit-slider-thumb { appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 15px rgba(0,0,0,0.6); transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
  .nm-range::-webkit-slider-thumb:hover { transform: scale(1.3); box-shadow: 0 0 20px #ec4899; background: #fdf2f8; }

  .nm-btn { 
    width: 100%; padding: 22px; border: none; border-radius: 24px; font-size: 15px; font-weight: 800; 
    text-transform: uppercase; letter-spacing: 2px; cursor: pointer; 
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; overflow: hidden;
  }
  /* Ripple Effect Container */
  .nm-btn::before {
    content: ''; position: absolute; top: 50%; left: 50%; width: 0; height: 0;
    background: rgba(255,255,255,0.4); border-radius: 50%; transform: translate(-50%, -50%);
    transition: width 0.6s ease, height 0.6s ease, opacity 0.6s ease; opacity: 0;
  }
  .nm-btn:active::before { width: 300px; height: 300px; opacity: 1; transition: 0s; }

  .nm-btn-go { 
    background: linear-gradient(135deg, #ffffff, #e4e4e7); color: #09090b; 
    box-shadow: 0 15px 40px rgba(255,255,255,0.2), inset 0 -4px 0 rgba(0,0,0,0.15); 
  }
  .nm-btn-go:hover:not(:disabled) { 
    transform: translateY(-4px) scale(1.02); 
    box-shadow: 0 20px 50px rgba(255,255,255,0.4), inset 0 -4px 0 rgba(0,0,0,0.1); 
    background: linear-gradient(135deg, #ffffff, #f4f4f5);
  }
  .nm-btn-go:active:not(:disabled) { transform: translateY(2px); box-shadow: 0 5px 15px rgba(255,255,255,0.2); }
  .nm-btn-go:disabled { background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.4); box-shadow: none; cursor: not-allowed; }
  
  .nm-btn-st { background: rgba(239, 68, 68, 0.15); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); padding: 18px; margin-top: 0; backdrop-filter: blur(15px); }
  .nm-btn-st:hover:not(:disabled) { background: rgba(239, 68, 68, 0.3); border-color: rgba(239, 68, 68, 0.6); transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 30px rgba(239, 68, 68, 0.25); color: #fff; }
  .nm-btn-st:active:not(:disabled) { transform: translateY(1px); }

  .nm-log-entry { font-family: "JetBrains Mono", monospace; font-size: 13px; padding: 12px 0; color: #d4d4d8; border-bottom: 1px dashed rgba(255,255,255,0.1); transition: all 0.4s ease; animation: slideIn 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-20px) scale(0.98); } to { opacity: 1; transform: translateX(0) scale(1); } }
  .nm-log-entry:hover { background: rgba(255,255,255,0.04); padding-left: 12px; border-radius: 8px; }
  .nm-log-entry.ok { color: #34d399; text-shadow: 0 0 12px rgba(52,211,153,0.4); }
  .nm-log-entry.er { color: #f87171; text-shadow: 0 0 12px rgba(248,113,113,0.4); }
  .nm-log-entry.st { color: #fff; font-weight: 800; border-bottom: 1px solid rgba(255,255,255,0.2); padding-top: 20px; font-size: 14px; text-shadow: 0 0 15px rgba(255,255,255,0.5); }
  `;
  
  var html=`
  <div id="NP-FAB">
    <svg viewBox="0 0 24 24" width="30" height="30" stroke="currentColor" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
  </div>
  <div id="NP-MENU">
     <div class="nm-header">
        <div class="nm-title"><div class="nm-dot"></div> NEON LIQUID EDITION</div>
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
        
        <div style="margin-bottom:28px; font-size:13px; color:#a1a1aa; display:flex; justify-content:space-between; font-weight:800; letter-spacing:1px;">
            <span>STATUS:</span>
            <span><span id="np-ok" style="color:#34d399;text-shadow:0 0 10px rgba(52,211,153,0.5);">0</span> SUCCESS / <span id="np-fl" style="color:#f87171;text-shadow:0 0 10px rgba(248,113,113,0.5);">0</span> ERROR</span>
        </div>
        
        <button class="nm-btn nm-btn-go" id="np-go" disabled>INITIALIZING...</button>
        
        <div class="nm-grid" style="margin-top:20px">
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
            <div class="nm-label" style="flex-direction:row; justify-content:space-between; text-shadow:0 0 10px rgba(255,255,255,0.2);">
                Base Velocity <span id="np-dvl" style="color:#fff;font-family:'JetBrains Mono',monospace;font-size:14px;font-weight:800;">600ms</span>
            </div>
            <input type="range" id="np-dly" class="nm-range" min="200" max="3000" value="600" step="100">
        </div>
        
        <div style="text-align:center; margin-top:28px;">
            <button id="np-rs" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:20px;padding:10px 20px;color:#a1a1aa;font-size:12px;font-weight:800;cursor:pointer;transition:all 0.3s ease;box-shadow:0 4px 15px rgba(0,0,0,0.2);">Purge Cloud Memory</button>
        </div>
     </div>
     
     <div class="nm-content" id="tab-logs">
        <div id="nl" style="padding-bottom:28px"></div>
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
  
  // Hover effect for reset button
  var rsBtn = document.getElementById('np-rs');
  if(rsBtn) {
      rsBtn.onmouseover = function(){ this.style.color='#fff'; this.style.background='rgba(239,68,68,0.2)'; this.style.borderColor='rgba(239,68,68,0.5)'; this.style.transform='scale(1.05)'; };
      rsBtn.onmouseout = function(){ this.style.color='#a1a1aa'; this.style.background='transparent'; this.style.borderColor='rgba(255,255,255,0.1)'; this.style.transform='scale(1)'; };
  }
  
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
  
  // Dragging - Upgraded with smooth physics simulation
  var hd=document.querySelector('.nm-header');
  var dr=false, ox=0, oy=0, tx=0, ty=0, cx=0, cy=0;
  var isDraggingPhysics = false;
  
  function updatePhysics() {
    if(!dr && !isDraggingPhysics) return;
    
    // Lerp (Linear Interpolation) for smooth drag
    cx += (tx - cx) * 0.3;
    cy += (ty - cy) * 0.3;
    
    menu.style.left = cx + 'px';
    menu.style.top = cy + 'px';
    menu.style.right = 'auto';
    
    if(dr || Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) {
      requestAnimationFrame(updatePhysics);
    } else {
      isDraggingPhysics = false;
      menu.classList.remove('dragging');
    }
  }

  function ds(e_clientX, e_clientY){
    dr=true;
    var r=menu.getBoundingClientRect();
    ox=e_clientX-r.left; oy=e_clientY-r.top;
    cx=r.left; cy=r.top;
    tx=cx; ty=cy;
    menu.classList.add('dragging');
    if(!isDraggingPhysics) { isDraggingPhysics = true; requestAnimationFrame(updatePhysics); }
  }
  
  function dm(e_clientX, e_clientY){
    if(!dr)return;
    tx=Math.max(0,Math.min(e_clientX-ox,innerWidth-menu.offsetWidth));
    ty=Math.max(0,Math.min(e_clientY-oy,innerHeight-40));
  }
  
  function de(){dr=false;}
  
  hd.addEventListener('mousedown',function(e){if(e.target.id==='nm-close')return;e.preventDefault();ds(e.clientX,e.clientY);});
  document.addEventListener('mousemove',function(e){dm(e.clientX,e.clientY);});
  document.addEventListener('mouseup',de);
  
  hd.addEventListener('touchstart',function(e){if(e.target.id==='nm-close')return;if(e.touches.length===1){e.preventDefault();ds(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchmove',function(e){if(dr&&e.touches.length===1){e.preventDefault();dm(e.touches[0].clientX,e.touches[0].clientY);}},{passive:false});
  document.addEventListener('touchend',de);
  document.addEventListener('touchcancel',de);

  // Config Binds
  document.getElementById('cfg-jitter').onchange = function(){ window.__nilamConfig.jitter = this.checked; log("Jitter di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('cfg-ghost').onchange = function(){ window.__nilamConfig.ghost = this.checked; log("Ghost Mode di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('cfg-sleep').onchange = function(){ window.__nilamConfig.autoSleep = this.checked; log("Auto-Sleep di" + (this.checked?"aktifkan":"matikan")); };
  document.getElementById('np-dly').oninput=function(){ window.__nilamConfig.delay=+this.value; document.getElementById('np-dvl').textContent=this.value+'ms'; };
  document.getElementById('np-cnt').oninput=function(){ window.__nilamConfig.maxBooks=+this.value; };

  // Buttons
  document.getElementById('np-go').onclick=startRun;
  document.getElementById('np-pa').onclick=function(){
    paused=!paused;
    var paBtn = document.getElementById('np-pa');
    paBtn.textContent=paused?'RESUME':'PAUSE';
    if(paused) { paBtn.style.background='rgba(234,179,8,0.2)'; paBtn.style.color='#fde047'; paBtn.style.borderColor='#facc15'; }
    else { paBtn.style.background=''; paBtn.style.color=''; paBtn.style.borderColor=''; }
    log(paused?'DIJEDA':'Disambung');
  };
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
