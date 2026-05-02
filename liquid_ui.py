import re

with open('/root/NilamAutomationTools/n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the buildUI block
start_idx = content.find('function buildUI(){')
end_idx = content.find('// --- INIT WITH BULLETPROOF CATCH ---')

if start_idx != -1 and end_idx != -1:
    new_buildui = """function buildUI(){
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
"""

    new_content = content[:start_idx] + new_buildui + content[end_idx:]

    with open('/root/NilamAutomationTools/n.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("UI Upgraded Successfully")
else:
    print("Could not find buildUI bounds")
