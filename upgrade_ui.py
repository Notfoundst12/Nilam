import re

with open('/root/NilamAutomationTools/n.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the CSS block
css_start = content.find('  var css=`')
css_end = content.find('  `;\n  \n  var html=`')

if css_start != -1 and css_end != -1:
    new_css = """  var css=`
  @import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;700&display=swap");
  
  @keyframes liquidBreathing {
    0% { box-shadow: 0 0 20px rgba(139,92,246,0.2), inset 0 0 0 rgba(255,255,255,0.1); }
    50% { box-shadow: 0 0 40px rgba(59,130,246,0.4), inset 0 2px 10px rgba(255,255,255,0.3); }
    100% { box-shadow: 0 0 20px rgba(139,92,246,0.2), inset 0 0 0 rgba(255,255,255,0.1); }
  }

  @keyframes pulseGlow {
    0% { transform: scale(1); opacity: 0.8; }
    50% { transform: scale(1.1); opacity: 1; }
    100% { transform: scale(1); opacity: 0.8; }
  }

  #NP-FAB {
    position: fixed; top: max(24px, env(safe-area-inset-top)); right: max(24px, env(safe-area-inset-right)); 
    width: 64px; height: 64px; border-radius: 32px;
    background: linear-gradient(135deg, rgba(20,20,20,0.8), rgba(5,5,5,0.95));
    backdrop-filter: blur(30px) saturate(200%); -webkit-backdrop-filter: blur(30px) saturate(200%);
    border: 1px solid rgba(255,255,255,0.15); 
    box-shadow: 0 10px 40px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.2);
    z-index: 2147483647; cursor: pointer; display: flex; align-items: center; justify-content: center;
    color: #fff; font-size: 28px; 
    transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    animation: liquidBreathing 6s infinite ease-in-out;
  }
  #NP-FAB:hover { 
    transform: scale(1.1) rotate(8deg); 
    background: linear-gradient(135deg, rgba(30,30,30,0.9), rgba(10,10,10,1));
    border-color: rgba(139,92,246,0.6);
  }
  #NP-FAB:active { transform: scale(0.95); }
  
  #NP-MENU {
    position: fixed; top: 96px; right: 24px; 
    width: 400px; height: auto; min-height: 540px; max-height: 85vh;
    background: rgba(8,8,12,0.65); 
    backdrop-filter: blur(60px) saturate(250%); -webkit-backdrop-filter: blur(60px) saturate(250%);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 32px;
    box-shadow: 0 50px 100px rgba(0,0,0,0.9), inset 0 1px 3px rgba(255,255,255,0.15);
    z-index: 2147483646; display: flex; flex-direction: column; overflow: hidden; resize: both;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
    transition: all 0.6s cubic-bezier(0.22, 1, 0.36, 1);
    opacity: 0; pointer-events: none; 
    transform: translateY(30px) scale(0.95) rotateX(5deg);
    transform-origin: top right;
  }
  #NP-MENU.show { 
    opacity: 1; pointer-events: auto; 
    transform: translateY(0) scale(1) rotateX(0deg); 
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
    height: 72px; padding: 0 28px; display: flex; align-items: center; justify-content: space-between;
    border-bottom: 1px solid rgba(255,255,255,0.05); cursor: grab; user-select: none;
    background: linear-gradient(180deg, rgba(255,255,255,0.08) 0%, rgba(0,0,0,0) 100%);
  }
  .nm-header:active { cursor: grabbing; background: rgba(255,255,255,0.02); }
  .nm-title { color: #fff; font-size: 16px; font-weight: 800; letter-spacing: 0.5px; display: flex; align-items: center; gap: 12px; }
  .nm-dot { width: 10px; height: 10px; border-radius: 50%; background: #10b981; animation: pulseGlow 2s infinite ease-in-out; }
  .nm-close { 
    color: #a1a1aa; font-size: 12px; font-weight: 700; cursor: pointer; 
    padding: 8px 16px; border-radius: 24px; transition: all 0.3s ease; 
    background: rgba(255,255,255,0.05); border: 1px solid transparent;
  }
  .nm-close:hover { color: #fff; background: rgba(255,255,255,0.15); border-color: rgba(255,255,255,0.2); transform: scale(1.05); }

  .nm-tabs { display: flex; padding: 0 8px; border-bottom: 1px solid rgba(255,255,255,0.05); }
  .nm-tab {
    flex: 1; text-align: center; padding: 18px 0; color: #71717a;
    font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;
    cursor: pointer; transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1); position: relative;
  }
  .nm-tab.active { color: #fff; text-shadow: 0 0 10px rgba(255,255,255,0.3); }
  .nm-tab.active::after { 
    content: ''; position: absolute; bottom: 0; left: 15%; right: 15%; height: 3px; 
    background: linear-gradient(90deg, #8b5cf6, #3b82f6); 
    border-radius: 3px 3px 0 0; box-shadow: 0 -2px 15px rgba(139,92,246,0.6); 
  }
  .nm-tab:hover:not(.active) { color: #d4d4d8; }

  .nm-content { flex: 1; overflow-y: auto; padding: 28px; display: none; color: #e4e4e7; scrollbar-width: none; }
  .nm-content::-webkit-scrollbar { display: none; }
  .nm-content.active { display: block; animation: fluidReveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
  @keyframes fluidReveal { 
    0% { opacity: 0; transform: translateY(20px) scale(0.98); filter: blur(5px); } 
    100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); } 
  }
  
  .nm-card { 
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
    border-radius: 24px; padding: 24px; margin-bottom: 24px; 
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 30px rgba(0,0,0,0.3); 
    transition: all 0.3s ease;
  }
  .nm-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.12); transform: translateY(-2px); }
  
  .nm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
  .nm-stat { 
    text-align: center; padding: 20px 0; background: linear-gradient(145deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01)); 
    border-radius: 20px; border: 1px solid rgba(255,255,255,0.08); transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); 
  }
  .nm-stat:hover { background: linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); transform: translateY(-4px) scale(1.02); border-color: rgba(139,92,246,0.3); box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
  .nm-stat-val { font-size: 32px; font-weight: 800; color: #fff; font-family: 'JetBrains Mono', monospace; text-shadow: 0 0 15px rgba(255,255,255,0.2); }
  .nm-stat-lbl { font-size: 11px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 8px; font-weight: 700; }

  .nm-row { display: flex; justify-content: space-between; align-items: center; padding: 16px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
  .nm-row:last-child { border-bottom: none; padding-bottom: 0; }
  .nm-row:first-child { padding-top: 0; }
  .nm-label { display: flex; flex-direction: column; font-size: 14px; font-weight: 600; color: #fff; }
  .nm-sub { font-size: 11px; color: #71717a; font-weight: 500; margin-top: 5px; }

  /* iOS Style Switch - Liquid */
  .switch { position: relative; width: 52px; height: 30px; }
  .switch input { opacity: 0; width: 0; height: 0; }
  .slider { 
    position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; 
    background: rgba(255,255,255,0.1); transition: .5s cubic-bezier(0.34, 1.56, 0.64, 1); 
    border-radius: 30px; border: 1px solid rgba(255,255,255,0.05); 
    box-shadow: inset 0 2px 5px rgba(0,0,0,0.5);
  }
  .slider:before { 
    position: absolute; content: ""; height: 24px; width: 24px; left: 3px; bottom: 2px; 
    background: linear-gradient(180deg, #fff, #e4e4e7); 
    transition: .5s cubic-bezier(0.34, 1.56, 0.64, 1); border-radius: 50%; 
    box-shadow: 0 2px 5px rgba(0,0,0,0.3); 
  }
  input:checked + .slider { background: linear-gradient(90deg, #8b5cf6, #3b82f6); border-color: transparent; }
  input:checked + .slider:before { transform: translateX(22px); background: #fff; box-shadow: -2px 2px 5px rgba(0,0,0,0.3); }

  .nm-input-group { 
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; 
    background: rgba(255,255,255,0.04); padding: 16px 24px; border-radius: 20px; 
    border: 1px solid rgba(255,255,255,0.08); transition: 0.3s;
  }
  .nm-input-group:focus-within { border-color: rgba(139,92,246,0.5); background: rgba(255,255,255,0.06); box-shadow: 0 0 20px rgba(139,92,246,0.15); }
  .nm-input { background: transparent; border: none; color: #fff; width: 80px; text-align: right; font-size: 22px; font-weight: 800; font-family: 'JetBrains Mono', monospace; outline: none; }
  .nm-range { width: 100%; accent-color: #8b5cf6; margin-top: 16px; height: 6px; background: rgba(255,255,255,0.1); border-radius: 3px; appearance: none; outline: none; }
  .nm-range::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 10px rgba(0,0,0,0.5); transition: 0.2s; }
  .nm-range::-webkit-slider-thumb:hover { transform: scale(1.2); }

  .nm-btn { 
    width: 100%; padding: 20px; border: none; border-radius: 20px; font-size: 14px; font-weight: 800; 
    text-transform: uppercase; letter-spacing: 1.5px; cursor: pointer; 
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); position: relative; overflow: hidden;
  }
  .nm-btn::after {
    content: ''; position: absolute; top: 0; left: -100%; width: 50%; height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent);
    transform: skewX(-20deg); transition: 0.5s;
  }
  .nm-btn:hover::after { left: 150%; }
  
  .nm-btn-go { 
    background: linear-gradient(135deg, #fff, #e4e4e7); color: #050505; 
    box-shadow: 0 10px 30px rgba(255,255,255,0.15), inset 0 -3px 0 rgba(0,0,0,0.1); 
  }
  .nm-btn-go:hover:not(:disabled) { transform: translateY(-3px) scale(1.02); box-shadow: 0 15px 40px rgba(255,255,255,0.25), inset 0 -3px 0 rgba(0,0,0,0.1); }
  .nm-btn-go:active:not(:disabled) { transform: translateY(1px); box-shadow: 0 5px 15px rgba(255,255,255,0.1); }
  .nm-btn-go:disabled { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.3); box-shadow: none; cursor: not-allowed; }
  
  .nm-btn-st { background: rgba(239, 68, 68, 0.1); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.2); padding: 16px; margin-top: 0; backdrop-filter: blur(10px); }
  .nm-btn-st:hover:not(:disabled) { background: rgba(239, 68, 68, 0.2); border-color: rgba(239, 68, 68, 0.5); transform: translateY(-2px); box-shadow: 0 10px 20px rgba(239, 68, 68, 0.15); }

  .nm-log-entry { font-family: "JetBrains Mono", monospace; font-size: 12px; padding: 10px 0; color: #a1a1aa; border-bottom: 1px dashed rgba(255,255,255,0.05); transition: 0.3s; animation: slideIn 0.3s ease-out; }
  @keyframes slideIn { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
  .nm-log-entry:hover { background: rgba(255,255,255,0.02); padding-left: 8px; }
  .nm-log-entry.ok { color: #34d399; text-shadow: 0 0 10px rgba(52,211,153,0.3); }
  .nm-log-entry.er { color: #f87171; text-shadow: 0 0 10px rgba(248,113,113,0.3); }
  .nm-log-entry.st { color: #fff; font-weight: 700; border-bottom: 1px solid rgba(255,255,255,0.1); padding-top: 16px; }
"""
    
    new_content = content[:css_start] + new_css + content[css_end:]
    
    with open('/root/NilamAutomationTools/n.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("UI Upgraded Successfully")

