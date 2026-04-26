// NILAM Auto-Fill v10.12
// 1117 buku sebenar. Zero arrow functions. Zero template literals. Max compatibility.
console.log('%c[NILAM] v10.12 sedang dimuatkan...','color:#a78bfa;font-weight:bold;font-size:14px');
(async function(){

var LIB_URL='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@290c9e4/books_library.json';
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
function isOurPanel(el){if(!el)return false;try{return el.closest&&el.closest('#NP');}catch(x){return false;}}
function findField(text){
  var lo=text.toLowerCase();var i,d,p,e,lb,n,att;
  var skipType={date:1,'datetime-local':1,time:1,month:1,week:1};
  var inps=document.querySelectorAll('input,select,textarea');
  for(i=0;i<inps.length;i++){e=inps[i];if(!vis(e)||isOurPanel(e)||skipType[e.type])continue;
    att=(e.placeholder||e.getAttribute('aria-label')||'').toLowerCase();
    if(att.indexOf(lo)>=0)return e;
  }
  var labels=document.querySelectorAll('label');
  for(i=0;i<labels.length;i++){lb=labels[i];
    if(lb.textContent.replace(/\*/g,'').trim().toLowerCase().indexOf(lo)<0)continue;
    if(lb.htmlFor){e=document.getElementById(lb.htmlFor);if(e&&vis(e))return e;}
    
    // Bootstrap 5: check siblings of label
    var sib=lb.nextElementSibling;
    while(sib){
      if(/input|select|textarea/i.test(sib.tagName) && vis(sib) && !isOurPanel(sib)) return sib;
      e=sib.querySelector('input,select,textarea');
      if(e && vis(e) && !isOurPanel(e)) return e;
      if(sib.tagName==='LABEL') break;
      sib=sib.nextElementSibling;
    }

    p=lb.parentElement;
    for(d=0;d<5&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=button]):not([type=submit]):not([type=date]):not([type=datetime-local]):not([type=time]):not([type=month]),select,textarea');if(e&&vis(e)&&!isOurPanel(e))return e;p=p.parentElement;}
  }
  var nodes=document.querySelectorAll('span,div,p,td');
  for(i=0;i<nodes.length;i++){n=nodes[i];
    var txt=n.textContent.replace(/\*/g,'').trim();
    if(txt.length>50||txt.length<2||txt.toLowerCase().indexOf(lo)<0)continue;
    p=n.parentElement;
    for(d=0;d<5&&p;d++){e=p.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio]):not([type=file]):not([type=button]):not([type=submit]):not([type=date]):not([type=datetime-local]):not([type=time]):not([type=month]),select,textarea');if(e&&vis(e)&&!isOurPanel(e))return e;p=p.parentElement;}
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
  el.dispatchEvent(new MouseEvent('mousedown',opts));
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
    toggle=p.querySelector('[role=combobox],[role=listbox],[class*=select],[class*=dropdown],input[readonly],.v-select,.vs__dropdown-toggle,.v-input');
    if(toggle&&vis(toggle))break; p=p.parentElement;
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
  var toggleSel='.vs__dropdown-toggle,[role=combobox],[role=listbox],[class*=v-select],[class*=dropdown],[class*=select],[class*=picker],[class*=chosen]';
  var toggles=document.querySelectorAll(toggleSel);
  for(i=0;i<toggles.length;i++){
    var toggle=toggles[i];if(!vis(toggle)||isOurPanel(toggle)||toggle.tagName==='SELECT')continue;var c=toggle;
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
  var toggles = document.querySelectorAll('.v-select, [role=combobox], [role=listbox], input[readonly], .vs__dropdown-toggle, .v-input, .v-field, .v-input__control, .v-select__selections, .v-select__slot, .v-input__append-inner, [class*="select"], .form-select, .form-control');
  for (i = 0; i < toggles.length; i++) {
    toggle = toggles[i];
    if (!vis(toggle) || isOurPanel(toggle)) continue;
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

  // Strategy 1: Vue model injection (SAFEST)
  try{
    var allEl=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian],[class*=rate]');
    for(i=0;i<allEl.length;i++){
      if(isOurPanel(allEl[i]))continue;
      var vm=allEl[i].__vue__;if(!vm)continue;
      var dt=vm.$data||vm;

      var isStar = (vm.$options && vm.$options.name && /star|rating|rate/i.test(vm.$options.name));
      var hasRatingData = (dt.rating!==undefined || dt.star!==undefined || dt.penilaian!==undefined || dt.score!==undefined);
      if(!isStar && !hasRatingData) continue;

      var keys=['rating','star','penilaian','score','rate','value','modelValue','currentValue','currentRating'];
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

  // Strategy 2: container with star/rating class
  var containers=document.querySelectorAll('[class*=star],[class*=Star],[class*=rating],[class*=Rating],[class*=penilaian],[class*=Penilaian],[class*=rate],[class*=Rate],[class*=review],[class*=Review]');
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

// Duplicate detection
function isDuplicate(){
  var sw=swalText().toLowerCase();
  if(sw&&(/duplicate|pendua|wujud|already|exist|entry/.test(sw)))return true;
  var txt=(document.body.innerText||document.body.textContent||'').toLowerCase();
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
  try{history.pushState({},'','/record/add/book');window.dispatchEvent(new PopStateEvent('popstate',{state:{}}));}catch(x){location.href='/record/add/book';}
}
async function resetForm(){
  try{
    var vueEl=document.querySelector('#app')||document.querySelector('[data-app]');
    var router=vueEl&&vueEl.__vue__&&vueEl.__vue__.$router;
    if(router){
      router.push('/').catch(function(){});
      await sleep(DELAY*2);
      await dismissAnyPopup();await sleep(DELAY);
      await dismissAnyPopup();await sleep(DELAY);
      router.push('/record/add/book').catch(function(){});
      await sleep(DELAY*6);
      await dismissAnyPopup();await sleep(DELAY);
      return true;
    }
  }catch(x){}

  for(var i=0;i<3;i++){if(clickBtn('kembali')){await sleep(DELAY*2);await dismissAnyPopup();await sleep(DELAY);}}
  if(clickBtn('tambah rekod')||clickBtn('tambah'))await sleep(DELAY*5);
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

  qs('#np-prog').textContent=(idx+1)+' / '+total;
  qs('#np-bar').style.width=((idx+1)/total*100)+'%';
  log('--- Buku '+(idx+1)+'/'+total+': '+book.title+' ---');

  if(location.pathname.indexOf('/record/add/book')<0){
    log('Navigasi ke borang...');await navToForm();await sleep(DELAY*10);
  }
  var formOk=await waitFor(function(){return allInp().length>=3?true:null;});
  if(!formOk){err('Borang tak load');return{ok:false,title:book.title};}
  await sleep(DELAY);swalClick();await checkPause();

  // === STEP 1: Maklumat Buku ===
  log('Step 1: Maklumat Buku');
  await fillField('tajuk',book.title,['title']);await sleep(DELAY);

  // Automatically select Buku Fizikal — NEVER E-Buku (causes undefined URL crash)
  if(clickBtn('buku fizikal')||clickBtn('buku bukan elektronik')||clickRadio('fizikal')){}
  await sleep(DELAY);
  // Safeguard: if URL/pautan field appeared (E-Buku selected by mistake), clear it
  var urlField=findField('pautan')||findField('url')||findField('laman');
  if(urlField){urlField.value='';log('  [!] URL field detected & cleared — E-Buku mungkin terpilih');}

  var kat=book.categoryLabel;
  var katOk=false;
  if(await fillDropdown('kategori',kat,0,true)){katOk=true;}
  else if(await bruteForceSelect(['kategori'], [kat])){log('  [OK] kategori (brute)');katOk=true;}
  else if(clickRadio(kat)||clickBtn(kat)){log('  [OK] kategori (radio/btn)');katOk=true;}
  else{log('  [!] kategori: tak jumpa');}

  await sleep(DELAY);await checkPause();

  await fillField('mukasurat',book.pages,['bilangan','muka','page']);await sleep(DELAY);
  await fillField('penulis',book.author,['pengarang','author']);await sleep(DELAY);
  await fillField('penerbit',book.publisher,['publisher']);await sleep(DELAY);
  await fillField('tahun',book.year,['year']);await sleep(DELAY);await checkPause();

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

  await sleep(DELAY);

  log('-> Seterusnya (1->2)');
  var next1=await clickNext();
  if(!next1){err('Gagal tekan Seterusnya step 1');logButtons();}
  await sleep(DELAY*5);await checkPause();

  // === STEP 2: Rumusan & Pengajaran & Rating ===
  log('Step 2: Rumusan & Penilaian');
  await waitFor(function(){return allTxt().length>0?true:null;},15000);await sleep(DELAY*2);
  var txts=allTxt();
  if(txts[0]){setVal(txts[0],book.summary);log('  [OK] Rumusan (Unik)');await sleep(DELAY);}
  if(txts[1]){setVal(txts[1],book.review);log('  [OK] Pengajaran (Unik)');await sleep(DELAY);}
  await sleep(DELAY*3);

  // Rating with retry
  var stars=Math.floor(Math.random()*3)+3;
  var starOk=await clickStarRetry(stars);
  if(starOk){log('  [OK] Rating: '+stars+' bintang');}
  else{log('  [!] Rating tak jumpa - teruskan tanpa rating');}
  await sleep(DELAY*2);await checkPause();

  log('-> Seterusnya (2->3)');
  var next2=await clickNext();
  if(!next2){
    err('Gagal tekan Seterusnya step 2');logButtons();
    // Last resort: wait and try again
    await sleep(DELAY*5);
    next2=await clickNext();
    if(!next2){
      log('  [!] Borang gagal diteruskan - skip buku ini & force reload.');logButtons();
      return{ok:false,title:book.title};
    }
  }
  await sleep(DELAY*5);

  // === STEP 3: Confirmation & Submit ===
  log('Step 3: Pengesahan & Hantar');
  var hasClickedHantar = false;
  var hantarTimer = 0;

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
          forceClick(exactBtns[ei]);await sleep(DELAY*5);hasClickedHantar=true;break;
        }
      }

      if(!hasClickedHantar && clickBtn('pasti')){log('  -> Tekan Pasti');await sleep(DELAY*6);
        if(isDuplicate()){log('DUPLIKAT (selepas Pasti) - skip');closeAllPopups();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
        continue;
      }
      if(!hasClickedHantar && clickBtn('ya')){log('  -> Tekan Ya');await sleep(DELAY*6);
        if(isDuplicate()){log('DUPLIKAT (selepas Ya) - skip');closeAllPopups();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
        continue;
      }
      if(!hasClickedHantar && clickBtn('confirm')){log('  -> Tekan Confirm');await sleep(DELAY*5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('simpan')){log('  -> Klik Simpan');await sleep(DELAY*5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('hantar')){log('  -> Klik Hantar');await sleep(DELAY*5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('submit')){log('  -> Klik Submit');await sleep(DELAY*5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('selesai')){log('  -> Klik Selesai');await sleep(DELAY*5);hasClickedHantar=true;continue;}
      if(!hasClickedHantar && clickBtn('seterusnya')){log('  -> Klik Seterusnya');await sleep(DELAY*4);continue;}
    }

    await sleep(DELAY*2);

    // Check for duplicate
    if(isDuplicate()){
      log('DUPLIKAT dikesan - skip');
      closeAllPopups();await sleep(DELAY*2);
      return{ok:false,title:book.title,dup:true};
    }

    // Check SweetAlert text
    var sw=swalText();
    if(sw){
      log('  [popup] '+sw.substring(0,100));
      if(/berjaya|success|disimpan|tahniah/i.test(sw)){log('BERJAYA!');
        try{if(window.Swal)Swal.close();}catch(x){}
        var sc=document.querySelector('.swal2-container');if(sc)sc.style.display='none';
        document.body.classList.remove('swal2-shown','swal2-height-auto');
        try{var ve=document.querySelector('#app')||document.querySelector('[data-app]');if(ve&&ve.__vue__&&ve.__vue__.$router){ve.__vue__.$router.push('/').catch(function(){});}}catch(x){}
        return{ok:true,title:book.title};}
      if(/duplicate|pendua|sudah wujud|already exist|telah wujud|entry/i.test(sw)){log('DUPLIKAT - skip');closeAllPopups();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
      if(/gagal|error|ralat|fail/i.test(sw)){
        if(/duplicate|pendua|entry|wujud/i.test(sw)){log('DUPLIKAT (error) - skip');closeAllPopups();await sleep(DELAY*2);return{ok:false,title:book.title,dup:true};}
        err('GAGAL: '+sw);swalClick();return{ok:false,title:book.title};
      }
      if(/pasti|pastikan|sahkan|confirm/i.test(sw)){log('  -> Tekan Pasti (popup)');swalClick('pasti');swalClick('ya');swalClick('ok');swalClick();await sleep(DELAY*4);continue;}
      if(/semak|kesilapan|ejaan|spell/i.test(sw)){log('  -> Dismiss semak ejaan');swalClick('ok');swalClick('teruskan');swalClick('tutup');swalClick();await dismissAnyPopup();await sleep(DELAY*3);continue;}
      if(/batalkan|cancel/i.test(sw)){log('  -> Dismiss popup');swalClick('teruskan');swalClick('ya');swalClick('ok');swalClick();await sleep(DELAY*3);continue;}
      swalClick('ok');swalClick('pasti');swalClick('ya');swalClick();await sleep(DELAY*3);continue;
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
    if(!avail.length){log('Semua buku habis! Auto-reset...');resetUsedList();updateStats();avail=BOOKS.slice();}
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
      log('Sedia buku seterusnya...');await sleep(DELAY*2);
      closeAllPopups();await sleep(DELAY);
      if(res.dup||!res.ok){
        log('Reset borang...');
        await resetForm();
      } else {
        await sleep(DELAY*2);
        await resetForm();
      }
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
  css+='.np-card{background:rgba(15,15,15,0.7);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border:1px solid rgba(255,255,255,0.1);border-radius:24px;overflow:hidden;';
  css+='box-shadow:0 30px 60px rgba(0,0,0,0.6),inset 0 1px 0 rgba(255,255,255,0.1)}';
  css+='.np-hd{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;';
  css+='background:linear-gradient(180deg,rgba(255,255,255,0.08) 0%,rgba(255,255,255,0.02) 100%);border-bottom:1px solid rgba(255,255,255,0.05);cursor:grab;touch-action:none}';
  css+='.np-hd:active{cursor:grabbing}';
  css+='.np-hd-l{display:flex;align-items:center;gap:10px}';
  css+='.np-ico{width:36px;height:36px;border-radius:12px;display:grid;place-items:center;font-size:16px;font-weight:900;color:#000;';
  css+='background:linear-gradient(135deg,#fff,#e2e8f0);box-shadow:0 4px 12px rgba(255,255,255,0.2)}';
  css+='.np-ttl{font-size:15px;font-weight:800;letter-spacing:-.4px;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,0.5)}';
  css+='.np-hd-r{display:flex;align-items:center;gap:6px}';
  css+='.np-ver{font-size:9px;font-weight:700;letter-spacing:.8px;text-transform:uppercase;color:#000;';
  css+='background:rgba(255,255,255,0.9);padding:3px 8px;border-radius:6px}';
  css+='.np-x{width:28px;height:28px;border-radius:8px;border:none;background:rgba(0,0,0,0.2);color:#fff;';
  css+='font-size:15px;cursor:pointer;display:grid;place-items:center;transition:.15s}';
  css+='.np-x:active{background:rgba(255,255,255,0.2);color:#fff}';
  css+='.np-stats{display:flex;padding:12px 20px 8px;gap:8px}';
  css+='.np-stat{flex:1;text-align:center;padding:10px 0;border-radius:12px;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.05);box-shadow:inset 0 1px 0 rgba(255,255,255,0.02)}';
  css+='.np-stat-n{font-size:20px;font-weight:800;color:#fff;line-height:1.2;font-variant-numeric:tabular-nums}';
  css+='.np-stat-l{font-size:9px;font-weight:600;color:rgba(255,255,255,.3);text-transform:uppercase;letter-spacing:.5px;margin-top:2px}';
  css+='.np-ctrl{padding:12px 20px;display:flex;flex-wrap:wrap;gap:8px}';
  css+='.np-btn{flex:1;min-width:80px;height:38px;border:none;border-radius:10px;font-size:11px;font-weight:700;';
  css+='cursor:pointer;text-transform:uppercase;letter-spacing:.4px;transition:.2s}';
  css+='.np-btn:active{transform:scale(.95)}';
  css+='.np-btn:disabled{opacity:.35;pointer-events:none}';
  css+='.b-go{background:linear-gradient(135deg,#fff,#cbd5e1);color:#000;box-shadow:0 4px 12px rgba(255,255,255,0.15)}';
  css+='.b-pa{background:rgba(0,0,0,0.3);color:#fff;border:1px solid rgba(255,255,255,0.1)}';
  css+='.b-st{background:rgba(248,113,113,.15);color:#fca5a5;border:1px solid rgba(248,113,113,.2)}';
  css+='.b-rs{flex:none;width:auto;padding:0 14px;background:rgba(0,0,0,0.2);color:#94a3b8;border:1px solid rgba(255,255,255,0.05);font-size:10px}';
  css+='.np-set{display:flex;align-items:center;gap:12px;padding:8px 20px;color:rgba(255,255,255,.5);font-size:11px;font-weight:500}';
  css+='.np-set label{min-width:48px}';
  css+='.np-set input[type=range]{flex:1;height:4px;-webkit-appearance:none;appearance:none;background:rgba(0,0,0,0.3);border-radius:4px;outline:none}';
  css+='.np-set input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:16px;height:16px;border-radius:50%;';
  css+='background:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.5);cursor:pointer}';
  css+='.np-set input[type=number]{width:50px;background:rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1);';
  css+='border-radius:8px;color:#fff;padding:6px;font-size:12px;text-align:center;font-weight:700;font-family:inherit;outline:none}';
  css+='.np-set .vl{min-width:36px;text-align:right;color:#fff;font-weight:700;font-size:11px}';
  css+='.np-prg{padding:12px 20px 8px}';
  css+='.np-bar-bg{height:6px;background:rgba(0,0,0,0.3);border-radius:9px;overflow:hidden;box-shadow:inset 0 1px 2px rgba(0,0,0,0.2)}';
  css+='.np-bar-fg{height:100%;width:0;background:linear-gradient(90deg,#fff,#cbd5e1);border-radius:9px;transition:width .6s ease;box-shadow:0 0 10px rgba(255,255,255,0.2)}';
  css+='.np-prg-t{text-align:center;font-size:10px;color:rgba(255,255,255,.25);margin-top:6px;font-weight:600;letter-spacing:.3px}';
  css+='.np-log{padding:4px 20px 16px;max-height:160px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.1) transparent}';
  css+='.np-log::-webkit-scrollbar{width:4px}.np-log::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15);border-radius:4px}';
  css+='.l{padding:3px 0;font-size:10.5px;color:rgba(255,255,255,.35);line-height:1.5;display:flex;gap:6px;border-bottom:1px solid rgba(255,255,255,.02)}';
  css+='.l .lt{color:rgba(255,255,255,.2);font-size:9px;font-family:monospace;flex-shrink:0}';
  css+='.l.ok{color:#6ee7b7}.l.er{color:#fca5a5}.l.st{color:#fff;font-weight:700}';
  css+='.np-ft{display:flex;justify-content:center;gap:24px;padding:12px 20px;border-top:1px solid rgba(255,255,255,.05);background:rgba(0,0,0,.2)}';
  css+='.np-ft-i{display:flex;align-items:center;gap:6px;font-size:12px;font-weight:700}';
  css+='.np-ft-i.g{color:#6ee7b7}.np-ft-i.r{color:#fca5a5}';
  css+='.np-dot{width:8px;height:8px;border-radius:50%}';
  css+='.np-ft-i.g .np-dot{background:#34d399;box-shadow:0 0 8px rgba(52,211,153,.5)}';
  css+='.np-ft-i.r .np-dot{background:#f87171;box-shadow:0 0 8px rgba(248,113,113,.5)}';

  var html='';
  html+='<div class="np-card">';
  html+='<div class="np-hd" id="np-hd">';
  html+='<div class="np-hd-l"><div class="np-ico">N</div><span class="np-ttl">NILAM Auto-Fill</span></div>';
  html+='<div class="np-hd-r"><span class="np-ver">v10.12</span><button class="np-x" id="np-mn">-</button></div>';
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
