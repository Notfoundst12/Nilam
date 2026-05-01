import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import json
import subprocess
import os
import urllib.request
import urllib.error
import time

# Token Bot Anda
TOKEN = '8298046313:AAHqwkuWkTbxSFSZB7DO4fNrfT1hBkMWKVs'
bot = telebot.TeleBot(TOKEN)

# Konfigurasi Supabase
SUPA_URL = 'https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books'
SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6anNtdHhocGRsc25pcXBjdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5Mzk2ODQsImV4cCI6MjA4MDUxNTY4NH0.jMq8BwvYlODSWiFv7ysM7KiDCjzviMEJFdn1Vfst3mw'

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
                    active.append(f"👤 *ID:* `{uid}`\n📈 *Prog:* {ok}/{tgt} (Fail: {fail})\n⏱️ *Status:* {status}")
        return active
    except: return []

def get_main_menu():
    markup = InlineKeyboardMarkup(row_width=2)
    markup.add(InlineKeyboardButton("📊 Dashboard", callback_data="cmd_stats"), InlineKeyboardButton("👥 Live Users", callback_data="cmd_live"))
    markup.add(InlineKeyboardButton("💻 Skrip", callback_data="cmd_script"), InlineKeyboardButton("🔄 Fetch", callback_data="cmd_fetch"))
    markup.add(InlineKeyboardButton("⚠️ Reset", callback_data="cmd_reset_confirm"), InlineKeyboardButton("❓ Info", callback_data="cmd_help"))
    return markup

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    text = "🤖 *NILAM COMMAND CENTER v10.21*\n━━━━━━━━━━━━━━━━━━━━━━\n\nSila pilih modul operasi anda:"
    bot.send_message(message.chat.id, text, parse_mode="Markdown", reply_markup=get_main_menu())

@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    chat_id, msg_id = call.message.chat.id, call.message.message_id
    if call.data == "cmd_stats":
        try:
            with open('/root/NilamAutomationTools/books_library.json', 'r') as f: total = len(json.load(f))
            used = get_used_books_count()
            text = f"📊 *DASHBOARD*\n━━━━━━━━━━━━━━━━━━━━━━\n\n📚 *Total:* `{total:,}`\n✅ *Done:* `{used:,}`\n⏳ *Left:* `{total-used:,}`\n📈 *Rate:* `{(used/total*100):.1f}%`"
            bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="cmd_back")))
        except: bot.answer_callback_query(call.id, "Ralat data")
    elif call.data == "cmd_live":
        active = get_live_users()
        text = "👥 *LIVE USERS ACTIVE*\n━━━━━━━━━━━━━━━━━━━━━━\n\n" + ("\n\n".join(active) if active else "Tiada pengguna aktif.")
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("🔄 Refresh", callback_data="cmd_live"), InlineKeyboardButton("⬅️ Kembali", callback_data="cmd_back")))
    elif call.data == "cmd_script":
        text = "💻 *SKRIP v10.21*\n\n`var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/n.js?v='+Date.now();document.head.appendChild(s);`"
        bot.edit_message_text(text, chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="cmd_back")))
    elif call.data == "cmd_back":
        bot.edit_message_text("🤖 *NILAM COMMAND CENTER v10.21*\n━━━━━━━━━━━━━━━━━━━━━━\n\nSila pilih modul operasi anda:", chat_id, msg_id, parse_mode="Markdown", reply_markup=get_main_menu())
    # ... handle others similarly
    elif call.data == "cmd_help":
        bot.edit_message_text("❓ *INFO*\nBot ini memantau pengguna skrip secara real-time menggunakan Cloud Telemetry.", chat_id, msg_id, parse_mode="Markdown", reply_markup=InlineKeyboardMarkup().add(InlineKeyboardButton("⬅️ Kembali", callback_data="cmd_back")))

if __name__ == "__main__":
    bot.polling(none_stop=True)
