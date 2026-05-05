import re

with open('n_working.js', 'r', encoding='utf-8') as f:
    working = f.read()
    
with open('n.js', 'r', encoding='utf-8') as f:
    apex = f.read()

# Extract DOM helpers and doBook from n_working.js
start_idx = working.find('function vis(el)')
end_idx = working.find('// Main runner')

dom_logic = working[start_idx:end_idx]

# Inject into apex right before start()
a_end = apex.find('async function start()')

new_apex = apex[:a_end] + dom_logic + "\n  " + apex[a_end:]

with open('n.js', 'w', encoding='utf-8') as f:
    f.write(new_apex)
print("Merged successfully.")
