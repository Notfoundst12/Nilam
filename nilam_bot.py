import telebot
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton
import json
import subprocess
import os

TOKEN = '8298046313:AAHqwkuWkTbxSFSZB7DO4fNrfT1hBkMWKVs'
bot = telebot.TeleBot(TOKEN)

@bot.message_handler(commands=['start', 'help'])
def send_welcome(message):
    markup = InlineKeyboardMarkup()
    btn1 = InlineKeyboardButton("📚 Fetch Buku", callback_data="fetch_buku")
    btn2 = InlineKeyboardButton("📊 Stats User", callback_data="stats_user")
    btn3 = InlineKeyboardButton("📜 Dapatkan Script Latest", callback_data="script_latest")
    
    markup.add(btn1)
    markup.add(btn2)
    markup.add(btn3)
    
    bot.send_message(
        message.chat.id, 
        "👋 *NILAM Automation Bot Active*\n\nSistem Pemantauan AINS v10.19\nSila pilih operasi di bawah:",
        parse_mode="Markdown",
        reply_markup=markup
    )

@bot.callback_query_handler(func=lambda call: True)
def handle_query(call):
    if call.data == "fetch_buku":
        bot.answer_callback_query(call.id, "Memulakan proses Fetch Buku...")
        bot.send_message(call.message.chat.id, "🔄 Sedang mengambil buku baru dari perpustakaan...")
        try:
            subprocess.Popen(["python3", "fetch_books3.py"])
            bot.send_message(call.message.chat.id, "✅ Proses Fetch Buku telah dimulakan (Running in background)!")
        except Exception as e:
            bot.send_message(call.message.chat.id, f"❌ Ralat semasa fetch: {str(e)}")

    elif call.data == "stats_user":
        try:
            with open('books_library.json', 'r', encoding='utf-8') as f:
                books = json.load(f)
            total_books = len(books)
            msg = (
                "📊 *STATISTIK NILAM AUTO-FILL*\n\n"
                f"📚 *Buku Tersedia:* {total_books:,} buku\n"
                "🟢 *Status Sistem:* Aktif (v10.19)\n"
                "🌐 *Penyelarasan:* CDN + Supabase"
            )
            bot.send_message(call.message.chat.id, msg, parse_mode="Markdown")
        except Exception as e:
            bot.send_message(call.message.chat.id, f"❌ Gagal membaca data: {str(e)}")

    elif call.data == "script_latest":
        script_code = (
            "🛠 *SKRIP NILAM AUTO-FILL TERKINI (v10.19)*\n\n"
            "Salin (copy) kod di bawah:\n\n"
            "`var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/gh/Notfoundst12/Nilam@main/n.js?v='+Date.now();document.head.appendChild(s);`"
        )
        bot.send_message(call.message.chat.id, script_code, parse_mode="Markdown")

if __name__ == "__main__":
    bot.polling(none_stop=True)
