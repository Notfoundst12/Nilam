import re

with open('/root/NilamAutomationTools/n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Upgrade fetch to Proxy to bypass toString() detection
fetch_patch = """
    var _origFetch=window.fetch;
    window.fetch=new Proxy(_origFetch, {
      apply: function(target, thisArg, args) {
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
            if(args[1].body.indexOf('"'+f+'":') < 0 && args[1].body.indexOf('\\\\\"'+f+'\\\\\":') < 0){
              args[1].body = args[1].body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
              args[1].body = args[1].body.replace('\\\\\"type\\\\\":\\\\\"book\\\\\"', '\\\\\"type\\\\\":\\\\\"book\\\\\",\\\\\"'+f+'\\\\\":'+rtg);
            }
          }
          var m = args[1].body.match(/"user"\\s*:\\s*([^,|}]+)/);
          if(m && m[1]) window.__v_cache_uid = m[1].replace(/["']/g,'').trim();
        }
        return Reflect.apply(target, thisArg, args);
      }
    });
"""

# Replace old fetch override
content = re.sub(r'var _origFetch=window\.fetch;[\s\S]*?return _origFetch\.apply\(this,args\);\n    };', fetch_patch.strip(), content)

# 2. Upgrade XHR to Proxy
xhr_patch = """
    var _origSend=XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send=new Proxy(_origSend, {
      apply: function(target, thisArg, args) {
        var body = args[0];
        if(typeof body==='string' && body.indexOf('"type":"book"')>=0){
          var rtg = window.__nilamStarRating || 5;
          var fields = ['point','rating','score','star'];
          for(var i=0; i<fields.length; i++){
            var f = fields[i];
            if(body.indexOf('"'+f+'":') < 0 && body.indexOf('\\\\\"'+f+'\\\\\":') < 0){
              body = body.replace('"type":"book"', '"type":"book","'+f+'":'+rtg);
              body = body.replace('\\\\\"type\\\\\":\\\\\"book\\\\\"', '\\\\\"type\\\\\":\\\\\"book\\\\\",\\\\\"'+f+'\\\\\":'+rtg);
            }
          }
          var m = body.match(/"user"\\s*:\\s*([^,|}]+)/);
          if(m && m[1]) window.__v_cache_uid = m[1].replace(/["']/g,'').trim();
          args[0] = body;
        }
        return Reflect.apply(target, thisArg, args);
      }
    });
"""
content = re.sub(r'var _origSend=XMLHttpRequest\.prototype\.send;[\s\S]*?return _origSend\.call\(this,body\);\n    };', xhr_patch.strip(), content)

# 3. Upgrade forceClick to send PointerEvents with bounding client rect coordinates
click_patch = """
function forceClick(el){
  if(!el)return;
  var r = {left:0, top:0, width:10, height:10};
  try { r = el.getBoundingClientRect(); } catch(e){}
  var cx = r.left + (r.width / 2) + (Math.random() * 4 - 2);
  var cy = r.top + (r.height / 2) + (Math.random() * 4 - 2);
  var opts={bubbles:true,cancelable:true,view:window,detail:1,screenX:cx,screenY:cy,clientX:cx,clientY:cy,ctrlKey:false,altKey:false,shiftKey:false,metaKey:false,button:0,buttons:1,relatedTarget:null,isPrimary:true,pointerType:'mouse'};
  try{el.dispatchEvent(new PointerEvent('pointerover',opts));}catch(e){}
  try{el.dispatchEvent(new PointerEvent('pointerenter',opts));}catch(e){}
  try{el.dispatchEvent(new PointerEvent('pointerdown',opts));}catch(e){}
  try{el.dispatchEvent(new MouseEvent('mousedown',opts));}catch(e){}
  try{el.dispatchEvent(new PointerEvent('pointerup',opts));}catch(e){}
  try{el.dispatchEvent(new MouseEvent('mouseup',opts));}catch(e){}
  try{el.dispatchEvent(new MouseEvent('click',opts));}catch(e){}
  try{el.click();}catch(e){}
}
"""
content = re.sub(r'function forceClick\(el\)\{[\s\S]*?try\{el\.click\(\);\}catch\(x\)\{\}\n\}', click_patch.strip(), content)

# 4. Anti-Debugging / Anti-Devtools check override
# If AINS tries to detect devtools, we disable debugger
anti_debug = """
  // Anti-anti-debugging
  var _Function = window.Function;
  window.Function = new Proxy(_Function, {
    construct(target, args) {
      if (args && args[0] && args[0].indexOf('debugger') !== -1) {
        return function() {};
      }
      return Reflect.construct(target, args);
    }
  });
"""
content = content.replace('// --- CORE FUNCTIONS & SPOOFING ---', '// --- CORE FUNCTIONS & SPOOFING ---\n' + anti_debug)

# Increase Version
content = content.replace('v16.0 (PHANTOM STEALTH EDITION)', 'v17.0 (ZERO-TRUST STEALTH EDITION)')
content = content.replace('v16.0 PHANTOM', 'v17.0 ZERO-TRUST')
content = content.replace('PHANTOM STEALTH EDITION', 'ZERO-TRUST STEALTH EDITION')

with open('/root/NilamAutomationTools/n.js', 'w', encoding='utf-8') as f:
    f.write(content)

print("Zero-Trust Stealth Patch Applied!")
