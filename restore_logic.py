import re

with open('/root/NilamAutomationTools/n.js', 'r', encoding='utf-8') as f:
    current = f.read()

with open('/root/NilamAutomationTools/n_working.js', 'r', encoding='utf-8') as f:
    working = f.read()

# 1. Extract the full, working helper functions from n_working.js
# We need everything from `function isDateInput` to `async function startRun()`
start_idx = working.find('function isDateInput(el){')
end_idx = working.find('async function startRun(){')

working_helpers_and_dobook = working[start_idx:end_idx]

# 2. Extract the new AI review logic from current n.js to inject into the restored doBook
ai_logic_start = current.find('// AI-Smart Review Generation')
ai_logic_end = current.find("try{document.getElementById('np-prog').textContent=(idx+1)+' / '+total;}catch(e){}")

if ai_logic_start != -1 and ai_logic_end != -1:
    ai_logic = current[ai_logic_start:ai_logic_end]
    
    # Replace the old static review logic in the working doBook with the new AI logic
    old_review_start = working_helpers_and_dobook.find('// Unique Rumusan')
    old_review_end = working_helpers_and_dobook.find("qs('#np-prog').textContent=(idx+1)+' / '+total;")
    
    if old_review_start != -1 and old_review_end != -1:
        working_helpers_and_dobook = working_helpers_and_dobook[:old_review_start] + ai_logic + working_helpers_and_dobook[old_review_end:]


# 3. Replace the truncated helpers in current n.js with the working ones
cur_start_idx = current.find('function isDateInput(el){')
cur_end_idx = current.find('async function startRun(){')

if cur_start_idx != -1 and cur_end_idx != -1:
    new_njs = current[:cur_start_idx] + working_helpers_and_dobook + current[cur_end_idx:]
    
    # 4. Ensure we remove the old np-prog and np-bar to prevent TypeError when Pause on Caught Exceptions is enabled
    new_njs = new_njs.replace("qs('#np-prog').textContent=(idx+1)+' / '+total;", "try{document.getElementById('np-prog').textContent=(idx+1)+' / '+total;}catch(e){}")
    new_njs = new_njs.replace("qs('#np-bar').style.width=((idx+1)/total*100)+'%';", "try{document.getElementById('np-bar').style.width=((idx+1)/total*100)+'%';}catch(e){}")
    
    with open('/root/NilamAutomationTools/n.js', 'w', encoding='utf-8') as f:
        f.write(new_njs)
    print("Logic restored successfully!")
else:
    print("Failed to find indices in current n.js")
