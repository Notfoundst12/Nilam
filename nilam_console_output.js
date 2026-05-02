// NILAM Auto-Fill v11.0 (Ghost Edition)
// 10,000 buku sintetik. Zero arrow functions. Zero template literals. Max compatibility.
console.log('%c[NILAM] v11.0 sedang dimuatkan...','color:#a78bfa;font-weight:bold;font-size:14px');
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/books_library.json';
var UK='__nilam_used__';
var BOOKS=[],DELAY=600,running=false,paused=false;
window.__nilamConfig = { jitter: true, ghost: true, autoSleep: true, delay: 600, maxBooks: 5 };


// Supabase Cloud Memory config
var SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books';
var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw';

// Anti-Fingerprinting / Device Spoofing
function installSpoofer() {
  if(!window.__nilamConfig.ghost) return;
  try {
    var agents = [
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36 Edg/121.0.0.0",
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:122.0) Gecko/20100101 Firefox/122.0"
    ];
    var randomAgent = agents[Math.floor(Math.random() * agents.length)];
    
    // Spoof User Agent
    Object.defineProperty(navigator, 'userAgent', { get: function () { return randomAgent; } });
    
    // Spoof Hardware Concurrency (Cores)
    var cores = [4, 8, 16];
    var randomCore = cores[Math.floor(Math.random() * cores.length)];
    Object.defineProperty(navigator, 'hardwareConcurrency', { get: function () { return randomCore; } });

    // Spoof Device Memory
    var mems = [8, 16, 32];
    var randomMem = mems[Math.floor(Math.random() * mems.length)];
    Object.defineProperty(navigator, 'deviceMemory', { get: function () { return randomMem; } });
    
    console.log("[NILAM] 👻 Ghost Mode: IP & Peranti berjaya dikaburkan.");
  } catch(e) {}
}
installSpoofer();


// CRITICAL: Prevent ains.moe.gov.myundefined redirect + FORCE inject rating point
function installNavGuard(){
  // Guard 1: Intercept Swal.fire
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

  // Guard 2: SAFE Network Interceptor (REGEX ONLY - DO NOT PARSE JSON)
  // This preserves key order, encryption signatures (provider field), and whitespace.
  if(!window.__nilamXhrPatched){
    window.__nilamXhrPatched=true;
    var _origSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send=function(body){
      if(typeof body==='string' && body.indexOf('"type":"book"')>=0){
        var rtg = window.__nilamStarRating || 5;
        // Inject fields if missing (handles both escaped and non-escaped JSON)
        var fields = ['point', 'rating', 'score', 'star'];
        for(var i=0; i<fields.length; i++){
          var f = fields[i];
          if(body.indexOf('"'+f+'":') < 0 && body.indexOf('\\"'+f+'\\":') < 0){
            body = body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
            body = body.replace('\\"type\\":\\"book\\"', '\\"type\\":\\"book\\",\\"'+f+'\\":'+rtg);
          }
        }
        console.log('[NILAM] XHR String Intercept: Injected rating fields safely.');
        // Extract User ID for Telemetry
        var m = body.match(/"user"\s*:\s*([^,|}]+)/);
        if(m && m[1]) {
            window.__nilamUserId = m[1].replace(/["']/g,'').trim();
            console.log('[NILAM] Telemetry: UID captured -> ' + window.__nilamUserId);
        }
      }
      return _origSend.call(this,body);
    };

    var _origFetch=window.fetch;
    window.fetch=function(){
      var args = arguments;
      // Rate Limit Bypass: Append random query param to submit URL to bust WAF cache
      try {
        if (args[0] && typeof args[0] === 'string' && args[0].indexOf('/api/nilam-records/submit') >= 0) {
           args[0] = args[0] + (args[0].indexOf('?')>=0 ? '&' : '?') + '_t=' + Date.now();
        }
      } catch(e) {}

      if(args[1] && typeof args[1].body==='string' && args[1].body.indexOf('"type":"book"')>=0){
        var rtg = window.__nilamStarRating || 5;
        var fields = ['point', 'rating', 'score', 'star'];
        for(var i=0; i<fields.length; i++){
          var f = fields[i];
          if(args[1].body.indexOf('"'+f+'":') < 0 && args[1].body.indexOf('\\"'+f+'\\":') < 0){
            args[1].body = args[1].body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
            args[1].body = args[1].body.replace('\\"type\\":\\"book\\"', '\\"type\\":\\"book\\",\\"'+f+'\\":'+rtg);
          }
        }
        console.log('[NILAM] Fetch String Intercept: Injected rating fields safely.');
        // Extract User ID for Telemetry
        var m = args[1].body.match(/"user"\s*:\s*([^,|}]+)/);
        if(m && m[1]) {
            window.__nilamUserId = m[1].replace(/["']/g,'').trim();
            console.log('[NILAM] Telemetry: UID captured -> ' + window.__nilamUserId);
        }
      }
      return _origFetch.apply(this,args);
    };
  }

  // Guard 3: Patch Vue router
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

// Aggressive Vue tree scanner to force set rating data
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

      // Inject into any object that looks like it holds book data
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
          installRatingGuard(); // Re-scan before submit
          return _orig.apply(this,arguments);
        };
      }

      if(c.$children){for(var ci=0;ci<c.$children.length;ci++)queue.push(c.$children[ci]);}
      // Vue 3 support
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

// Heartbeat Telemetry
async function sendTelemetry(ok, fail, tgt, statusMsg) {
  var uid = window.__nilamUserId;
  if (!uid || uid === "Guest") {
    try {
      // Direct extraction from common storage/state
      var app = document.querySelector('#app') || document.querySelector('[data-app]');
      var root = app && (app.__vue__ || app.__vue_app__);
      if (root && root.$store && root.$store.state && root.$store.state.user) {
        uid = root.$store.state.user.id || root.$store.state.user.name;
      }
      if (!uid) {
        for (var i = 0; i < localStorage.length; i++) {
          var k = localStorage.key(i), v = localStorage.getItem(k);
          if (k.indexOf('user')>=0 || k.indexOf('auth')>=0) {
            if (v && v.indexOf('id')>=0) {
              try { var j = JSON.parse(v); if(j.id) uid=j.id; else if(j.user&&j.user.id) uid=j.user.id; } catch(e){}
            }
          }
        }
      }
    } catch(e){}
    if(!uid) uid = "User-" + Math.floor(Math.random()*9000+1000);
    window.__nilamUserId = uid;
  }

  var payload = '__TEL__|' + uid + '|' + Date.now() + '|' + ok + '|' + fail + '|' + tgt + '|' + statusMsg;
  var headers = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Content-Type': 'application/json' };

  try {
    // Delete old ping and post new one
    await fetch(SUPA_URL + '?title=like.__TEL__|' + uid + '|*', { method: 'DELETE', headers: headers });
    await fetch(SUPA_URL, { method: 'POST', headers: headers, body: JSON.stringify({ title: payload }) });
  } catch(e){
    console.warn('[NILAM] Telemetry Ping Failed', e);
  }
}

// Cloud Memory using Supabase + Local Fallback/Merge
async function getUsed(){
  var combined = [];
  try {
    var r = await fetch(SUPA_URL + '?select=title', {
      headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY }
    });
    if (r.ok) {
      var d = await r.json();
      combined = d.map(function(x) { return x.title }).filter(function(t) { return t.indexOf('__TEL__|') !== 0; });
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

// C2 Command & Control Fetcher
async function checkC2() {
  try {
    var r = await fetch(SUPA_URL + '?select=title&title=like.__CMD__|*', { headers: { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY } });
    if(r.ok){
      var d = await r.json();
      for(var i=0; i<d.length; i++){
        var parts = d[i].title.split('|');
        if(parts.length >= 2){
           var cmd = parts[1];
           if(cmd === 'PAUSE' && !paused){ paused = true; log('⚠️ [C2] Sistem Dijeda oleh Admin'); try{document.getElementById('np-pa').textContent='Sambung';}catch(e){} }
           if(cmd === 'RESUME' && paused){ paused = false; log('▶️ [C2] Sistem Disambung oleh Admin'); try{document.getElementById('np-pa').textContent='Pause';}catch(e){} }
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

async function markUsed(t){
  try {
    // Local first for immediate feedback
    var u = JSON.parse(localStorage.getItem(UK)) || [];
    if (u.indexOf(t) < 0) {
      u.push(t);
      localStorage.setItem(UK, JSON.stringify(u));
    }
    // Cloud second with await to prevent race conditions
    await fetch(SUPA_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify({ title: t })
    });
  } catch (e) {
    console.error('[NILAM] markUsed failed', e);
  }
}
async function resetUsedList(){
  localStorage.removeItem(UK);
  try{await fetch(SUPA_URL+'?title=not.eq.random_string',{method:'DELETE',headers:{'apikey':SUPA_KEY,'Authorization':'Bearer '+SUPA_KEY}});}catch(e){}
}

function pLog(m){var el=document.getElementById('nl');if(!el)return;
  var t=new Date().toLocaleTimeString('ms-MY',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  var c='';if(/BERJAYA/.test(m))c='ok';else if(/GAGAL|RALAT|TIDAK|\[X\]/.test(m))c='er';else if(/Step \d/.test(m))c='st';
  el.innerHTML+='<div class="nm-log-entry '+c+'"><span style="color:#64748b;margin-right:5px">['+t+']</span>'+m+'</div>';el.scrollTop=1e6;}
function log(m){console.log('%c[NILAM] '+m,'color:#8b5cf6;font-weight:bold');pLog(m);}
function err(m){console.error('[NILAM] '+m);pLog('[X] '+m);}

function vis(el){return el&&(el.offsetParent!==null||el.offsetWidth>0);}
function isOurPanel(el){if(!el)return false;try{return el.closest&&el.closest('#NP-MENU') || el.closest('#NP-FAB');}catch(x){return false;}}
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
            if(trigger&&vis(trigger)&&!isOurPanel(trigger)&&!trigger.closest('#NP-MENU')&&!trigger.closest('#NP-FAB'))break;
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

function tryClickStar(n){
  var i,j,items,el;

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
        if(comp.$children){for(var ci=0;ci<c.$children.length;ci++){queue.push(comp.$children[ci]);}}
      }
    }
  }catch(x){}

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

  var containers=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian],[class*=Penilaian],[class*=rate],[class*=Rate],[class*=review],[class*=Review],[class*=v-rating],[class*=v_rating]');
  for(i=0;i<containers.length;i++){
    if(isOurPanel(containers[i]))continue;
    items=containers[i].querySelectorAll('svg,i,span,label,img,a,li,button');
    if(items.length>=3&&items.length<=10){forceClick(items[Math.min(n-1,items.length-1)]);return true;}
    if(containers[i].children.length>=3&&containers[i].children.length<=10){forceClick(containers[i].children[Math.min(n-1,containers[i].children.length-1)]);return true;}
  }
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
  var radios=document.querySelectorAll('input[type=radio]');
  for(i=0;i<radios.length;i++){
    if(isOurPanel(radios[i]))continue;
    var rv=radios[i].value;
    if(rv==String(n)||rv==n){radios[i].checked=true;forceClick(radios[i]);radios[i].dispatchEvent(new Event('change',{bubbles:true}));return true;}
  }
  var ariaEls=document.querySelectorAll('[aria-label]');
  for(i=0;i<ariaEls.length;i++){
    if(isOurPanel(ariaEls[i]))continue;
    var al=(ariaEls[i].getAttribute('aria-label')||'').toLowerCase();
    if((al.indexOf('star')>=0||al.indexOf('bintang')>=0||al.indexOf('rating')>=0)&&al.indexOf(String(n))>=0){
      forceClick(ariaEls[i]);return true;
    }
  }
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
    if(attempt>0){await jSleep(1.2);log('  Retry rating #'+(attempt+1)+'...');}
    if(tryClickStar(n))return true;
  }
  return false;
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
  if(/telah.?wujud/i.test(txt))return true;
  if(/already.?exist/i.test(txt))return true;
  if(/rekod.?ini.?sudah/i.test(txt))return true;
  if(/data.?yang.?sama/i.test(txt))return true;
  return false;
}

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
      forceClick(els[i]);await jSleep(0.5);return true;
    }
  }
  return false;
}
async function navToForm(){
  try{var vueEl=document.querySelector('#app')||document.querySelector('[data-app]');
    if(vueEl&&vueEl.__vue__&&vueEl.__vue__.$router){vueEl.__vue__.$router.push('/record/add/book');return;}}catch(x){}
  try{history.pushState({},'','/record/add/book');window.dispatchEvent(new PopStateEvent('popstate',{state:{}}));}catch(x){location.href='/record/add/book';}
}
async function resetForm(){
  var staleSwal=document.querySelectorAll('.swal2-container');
  for(var si=0;si<staleSwal.length;si++){if(staleSwal[si].style.display==='none')staleSwal[si].remove();}
  try{
    var vueEl=document.querySelector('#app')||document.querySelector('[data-app]');
    var router=vueEl&&vueEl.__vue__&&vueEl.__vue__.$router;
    if(router){
      router.push('/').catch(function(){});
      await jSleep(2);
      await dismissAnyPopup();await jSleep(1);
      await dismissAnyPopup();await jSleep(1);
      router.push('/record/add/book').catch(function(){});
      await jSleep(6);
      await dismissAnyPopup();await jSleep(1);
      return true;
    }
  }catch(x){}

  for(var i=0;i<3;i++){if(clickBtn('kembali')){await jSleep(2);await dismissAnyPopup();await jSleep(1);}}
  if(clickBtn('tambah rekod')||clickBtn('tambah'))await jSleep(5);
  return true;
}

async function clickNext(){
  var i;
  for(i=0;i<6;i++){if(clickBtn('seterusnya'))return true;await jSleep(0.5);}

  log('  [!] Seterusnya dilumpuhkan atau tak jumpa.');
  return false;
}
async function checkPause(){while(paused&&running)await sleep(300);}

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

async function doBook(book,idx,total){
  if(!running)return{ok:false,title:book.title};

  book.title=String(book.title||'').replace(/[\r\n]+/g,' ').trim();
  book.author=String(book.author||'').replace(/[\r\n]+/g,' ').trim();
  book.publisher=String(book.publisher||'').replace(/[\r\n]+/g,' ').trim();
  
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

  if(location.pathname.indexOf('/record/add/book')<0){
    log('Navigasi ke borang...');await navToForm();await jSleep(10);
  }
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await jSleep(1);swalClick();await checkPause();

  log('Step 1: Maklumat Buku');
  closeDatePicker();
  if(!running)return{ok:false,title:book.title};
  await fillField('tajuk',book.title,['title']);await jSleep(1);

  if(clickBtn('buku fizikal')||clickBtn('buku bukan elektronik')||clickRadio('fizikal')){}
  await jSleep(1);
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

  if(await selectLanguageFromModal(lang)){langOk=true;log('  [OK] bahasa (LanguageModal)');}
  else if(await bruteForceSelect(langKeys, [lang, langShort])){langOk=true;log('  [OK] bahasa (brute)');}
  else if(await clickLanguageDirectly(lang)){langOk=true;}
  else if(await fillDropdown('bahasa',lang,1)){langOk=true;log('  [OK] bahasa (dropdown)');}
  else if(await fillDropdown('bahasa',langShort,1)){langOk=true;log('  [OK] bahasa (dropdown-short)');}
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

  log('Step 2: Rumusan & Penilaian');
  if(!running)return{ok:false,title:book.title};
  await waitFor(function(){return allTxt().length>0?true:null;},15000);await jSleep(2);
  var txts=allTxt();
  if(txts[0]){setVal(txts[0],book.summary);log('  [OK] Rumusan (Unik)');await jSleep(1);}
  if(txts[1]){setVal(txts[1],book.review);log('  [OK] Pengajaran (Unik)');await jSleep(1);}
  await jSleep(3);
  if(!running)return{ok:false,title:book.title};

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
    await jSleep(5);
    next2=await clickNext();
    if(!next2){
      log('  [!] Borang gagal diteruskan - skip buku ini & force reload.');logButtons();
      return{ok:false,title:book.title};
    }
  }
  await jSleep(5);

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

    var errs = document.querySelectorAll('.error--text, .text-danger, .invalid-feedback, [class*=error]');
    for(var e=0; e<errs.length; e++){
      if(vis(errs[e]) && !isOurPanel(errs[e]) && errs[e].innerText.length > 3 && errs[e].innerText.length < 50){
        err('Ralat borang: ' + errs[e].innerText);
        return {ok:false, title:book.title};
      }
    }

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

    if(window.__nilamRateLimited){ log('  [!] WAF Rate Limit dikesan!'); closeAllPopups(); return {ok:false, title:book.title, rateLimited:true}; }
    if(isDuplicate()){
      log('DUPLIKAT dikesan - skip');
      closeAllPopups();await jSleep(2);
      return{ok:false,title:book.title,dup:true};
    }

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

    if(a>0&&a%10===0){logButtons();}
  }
  err('Timeout - tiada respons selepas 40 cuba');logButtons();
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
  sendTelemetry(0, 0, window.__nilamConfig ? window.__nilamConfig.maxBooks : 100, 'Bermula...');

  var ok=0,fail=0,dup=0,target=window.__nilamConfig ? window.__nilamConfig.maxBooks : 100;
  var idx=0;
  while(ok+fail<target&&running){
    sendTelemetry(ok, fail, target, 'Sedang submit buku...');
    await checkC2();
    if(!running) break;
    var used=await getUsed();
    var avail=[];for(var y=0;y<BOOKS.length;y++){if(used.indexOf(BOOKS[y].title)<0)avail.push(BOOKS[y]);}
    if(!avail.length){log('Semua buku habis! Auto-reset...');await resetUsedList();await updateStats();avail=BOOKS.slice();}
    var book=avail[0];
    await markUsed(book.title);
    await updateStats();
    var res=await doBook(book,idx,target);
    if(res.ok){ok++;}
    else if(res.dup){dup++;log('Duplikat #'+dup+' - cuba buku lain...');}
    else if(res.rateLimited){
      log('Sistem berehat sementara (Auto-Sleep 3 minit) mengelakkan ban...');
      sendTelemetry(ok, fail, target, 'Auto-Sleep (429 Limit Exceeded)');
      try{document.getElementById('np-waf-info').style.display='flex';}catch(x){}
      await jSleep(180000/window.__nilamConfig.delay); 
      try{document.getElementById('np-waf-info').style.display='none';}catch(x){}
      idx--; 
      window.__nilamRateLimited = false;
      continue; 
    }
    else{fail++;}
    try{document.getElementById('np-ok').textContent=ok;document.getElementById('np-fl').textContent=fail;}catch(e){}
    idx++;
    if(ok+fail<target&&running){
      log('Sedia buku seterusnya...');await jSleep(2);
      closeAllPopups();await jSleep(1);
      if(res.dup||!res.ok){
        log('Reset borang...');
        await resetForm();
      } else {
        await jSleep(2);
        await resetForm();
      }
    }
  }
  log('== SELESAI == OK:'+ok+' Gagal:'+fail+' Duplikat:'+dup);
  sendTelemetry(ok, fail, target, 'Selesai / Berhenti');
  running=false;
  try{document.getElementById('np-go').disabled=false;document.getElementById('np-go').textContent='MULA SEKARANG';}catch(e){}
  try{document.getElementById('np-pa').disabled=true;document.getElementById('np-st').disabled=true;}catch(e){}
}

function updateStats(){
  getUsed().then(used => {
    try{document.getElementById('np-lib').textContent=BOOKS.length;}catch(e){}
    try{document.getElementById('np-rem').textContent=BOOKS.length-used.length;}catch(e){}
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

function makeUI(){
  var old=document.getElementById('NP-FAB');if(old)old.remove();
  var oldMenu=document.getElementById('NP-MENU');if(oldMenu)oldMenu.remove();
  
  var w=document.createElement('div');
  var css=`
  @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;800&display=swap");
  #NP-FAB { position:fixed; top:20px; left:20px; width:50px; height:50px; border-radius:25px; background:linear-gradient(135deg, #8b5cf6, #3b82f6); box-shadow:0 0 20px rgba(139,92,246,0.5); z-index:2147483647; cursor:pointer; display:flex; align-items:center; justify-content:center; color:#fff; font-size:24px; font-weight:bold; font-family:'Poppins',sans-serif; transition:0.3s; border:2px solid #fff; }
  #NP-FAB:hover { transform:scale(1.1); }
  #NP-MENU { position:fixed; top:80px; left:20px; width:340px; height:480px; background:rgba(15,23,42,0.95); backdrop-filter:blur(10px); border:1px solid #334155; border-radius:16px; z-index:2147483646; display:flex; flex-direction:column; overflow:hidden; resize:both; box-shadow:0 25px 50px -12px rgba(0,0,0,0.5); font-family:'Poppins',sans-serif; transition:0.3s; opacity:0; pointer-events:none; transform:translateY(-20px); }
  #NP-MENU.show { opacity:1; pointer-events:auto; transform:translateY(0); }
  .nm-header { height:45px; background:linear-gradient(90deg, #1e293b, #0f172a); display:flex; align-items:center; padding:0 15px; cursor:move; user-select:none; font-weight:800; color:#e2e8f0; border-bottom:1px solid #334155; justify-content:space-between; font-size:14px; letter-spacing:1px; }
  .nm-tabs { display:flex; background:#0f172a; border-bottom:1px solid #334155; }
  .nm-tab { flex:1; text-align:center; padding:12px 0; color:#64748b; cursor:pointer; font-size:11px; font-weight:600; text-transform:uppercase; letter-spacing:1px; border-bottom:2px solid transparent; transition:0.2s; }
  .nm-tab.active { color:#8b5cf6; border-bottom-color:#8b5cf6; background:#1e293b; }
  .nm-tab:hover:not(.active) { color:#cbd5e1; }
  .nm-content { flex:1; overflow-y:auto; padding:15px; display:none; color:#cbd5e1; font-size:13px; scrollbar-width:thin; scrollbar-color:#475569 transparent; }
  .nm-content::-webkit-scrollbar { width:6px; }
  .nm-content::-webkit-scrollbar-thumb { background:#475569; border-radius:3px; }
  .nm-content.active { display:block; }
  
  /* Toggle Switch */
  .nm-row { display:flex; justify-content:space-between; align-items:center; padding:12px 0; border-bottom:1px solid rgba(255,255,255,0.05); }
  .nm-row label { font-weight:600; font-size:12px; color:#e2e8f0; display:flex; flex-direction:column;}
  .nm-row label span { font-size:9px; color:#64748b; font-weight:400; margin-top:2px; }
  .switch { position:relative; display:inline-block; width:44px; height:24px; }
  .switch input { opacity:0; width:0; height:0; }
  .slider { position:absolute; cursor:pointer; top:0; left:0; right:0; bottom:0; background-color:#334155; transition:.4s; border-radius:24px; }
  .slider:before { position:absolute; content:""; height:18px; width:18px; left:3px; bottom:3px; background-color:white; transition:.4s; border-radius:50%; }
  input:checked + .slider { background-color:#8b5cf6; }
  input:checked + .slider:before { transform:translateX(20px); }
  
  /* UI Elements */
  .nm-btn { width:100%; padding:12px; border:none; border-radius:8px; font-weight:800; font-size:13px; cursor:pointer; transition:0.2s; text-transform:uppercase; letter-spacing:1px; margin-top:10px; }
  .nm-btn-go { background:linear-gradient(135deg, #8b5cf6, #3b82f6); color:#fff; box-shadow:0 4px 15px rgba(139,92,246,0.3); }
  .nm-btn-go:hover { box-shadow:0 6px 20px rgba(139,92,246,0.5); transform:translateY(-1px); }
  .nm-btn-go:disabled { background:#334155; color:#64748b; box-shadow:none; transform:none; cursor:not-allowed; }
  .nm-btn-st { background:rgba(239,68,68,0.1); color:#ef4444; border:1px solid rgba(239,68,68,0.3); }
  .nm-btn-st:hover { background:rgba(239,68,68,0.2); }
  .nm-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:15px; }
  .nm-stat-card { background:rgba(0,0,0,0.2); border:1px solid rgba(255,255,255,0.05); padding:10px; border-radius:8px; text-align:center; }
  .nm-stat-num { font-size:22px; font-weight:800; color:#fff; }
  .nm-stat-lbl { font-size:10px; color:#64748b; text-transform:uppercase; font-weight:600; }
  
  .nm-range { width:100%; margin-top:5px; accent-color:#8b5cf6; }
  .nm-input { background:rgba(0,0,0,0.3); border:1px solid #334155; color:#fff; padding:6px 10px; border-radius:6px; width:60px; text-align:center; font-weight:bold; outline:none; }
  
  .nm-log-entry { font-family:'Courier New', monospace; font-size:11px; padding:3px 0; border-bottom:1px dashed rgba(255,255,255,0.05); color:#94a3b8; }
  .nm-log-entry.ok { color:#34d399; }
  .nm-log-entry.err { color:#f87171; }
  `;
  
  var html=`
  <div id="NP-FAB">🚀</div>
  <div id="NP-MENU">
     <div class="nm-header">
        <span style="display:flex;align-items:center;gap:8px"><div style="width:8px;height:8px;background:#10b981;border-radius:50%;box-shadow:0 0 8px #10b981"></div> NILAM PRO MOD</span>
        <span id="nm-close" style="cursor:pointer;color:#94a3b8;font-size:12px">TUTUP</span>
     </div>
     <div class="nm-tabs">
        <div class="nm-tab active" data-target="tab-home">Panel</div>
        <div class="nm-tab" data-target="tab-feat">Features</div>
        <div class="nm-tab" data-target="tab-logs">Logs</div>
     </div>
     
     <div class="nm-content active" id="tab-home">
        <div class="nm-grid">
           <div class="nm-stat-card"><div class="nm-stat-num" id="np-lib">-</div><div class="nm-stat-lbl">Total Data</div></div>
           <div class="nm-stat-card"><div class="nm-stat-num" id="np-usd">0</div><div class="nm-stat-lbl">Telah Guna</div></div>
        </div>
        
        <div class="nm-row" style="border:none;padding-bottom:0">
            <label>Jumlah Buku (Sesi ini)</label>
            <input type="number" id="np-cnt" class="nm-input" min="1" max="500" value="5">
        </div>
        <div style="margin-bottom:15px; font-size:11px; color:#64748b; text-align:right">Progress: <span id="np-ok" style="color:#34d399;font-weight:bold">0</span> OK | <span id="np-fl" style="color:#f87171;font-weight:bold">0</span> FAIL</div>
        
        <button class="nm-btn nm-btn-go" id="np-go" disabled>INITIALIZING...</button>
        <div class="nm-grid" style="margin-top:10px">
            <button class="nm-btn nm-btn-st" id="np-pa" style="margin-top:0" disabled>PAUSE</button>
            <button class="nm-btn nm-btn-st" id="np-st" style="margin-top:0" disabled>STOP</button>
        </div>
        <div style="text-align:center;margin-top:15px"><a href="#" id="np-rs" style="color:#64748b;font-size:10px;text-decoration:none">Reset Cloud Memory</a></div>
     </div>
     
     <div class="nm-content" id="tab-feat">
        <div class="nm-row">
            <label>Smart Jitter (Anti-Bot)<span>Bypass pengesanan robot (WAF)</span></label>
            <label class="switch"><input type="checkbox" id="cfg-jitter" checked><span class="slider"></span></label>
        </div>
        <div class="nm-row">
            <label>Ghost Mode (Anti-FP)<span>Spoof OS, Browser & RAM</span></label>
            <label class="switch"><input type="checkbox" id="cfg-ghost" checked><span class="slider"></span></label>
        </div>
        <div class="nm-row">
            <label>Smart Auto-Sleep<span>Tidur 3 minit jika kena Rate Limit</span></label>
            <label class="switch"><input type="checkbox" id="cfg-sleep" checked><span class="slider"></span></label>
        </div>
        
        <div style="margin-top:20px">
            <label style="font-size:12px;font-weight:600;color:#e2e8f0">Base Speed / Delay: <span id="np-dvl" style="color:#8b5cf6">600ms</span></label>
            <input type="range" id="np-dly" class="nm-range" min="200" max="3000" value="600" step="100">
        </div>
     </div>
     
     <div class="nm-content" id="tab-logs">
        <div id="nl"></div>
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
  document.getElementById('np-rs').onclick=async function(){if(confirm('Reset memori awan?')){await resetUsedList();await updateStats();log('Pangkalan data direset');}};
}

// Init
makeUI();
installNavGuard();
installRatingGuard();
log('Memuat turun 10,000 buku...');

try{
  var r=await fetch(LIB_URL + '?v=' + Date.now());if(!r.ok)throw new Error('HTTP '+r.status);
  BOOKS=await r.json();
  log(BOOKS.length+' buku sebenar dimuatkan');
  await updateStats();
  var go=document.getElementById('np-go');
  go.disabled=false;go.textContent='MULA SEKARANG';
  go.className='nm-btn nm-btn-go';
  sendTelemetry(0, 0, 0, 'Standby (Mod Menu Dimuatkan)');
}catch(e){
  err('Gagal muat: '+e.message);
}

})();
