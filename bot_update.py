import re

with open('/root/NilamAutomationTools/nilam_bot.py', 'r') as f:
    content = f.read()

# Make sure EVERY response uses Blockquotes and pushes PRO
upsell_msg = "\n\n<blockquote>⚠️ <b>PENTING:</b> Anda sedang menggunakan 🆓 <b>Pelan Percuma</b>.\nSistem ini akan terdedah kepada <i>WAF Block</i> dan sangat terhad. \n🚀 <b>Sila UPGRADE ke PRO sekarang untuk prestasi Maksimum!</b></blockquote>"

# Add aggressive upsell to the main menu text if user is free
content = content.replace('plan_badge = "👑 OWNER" if plan == "owner" else ("💎 PRO" if plan == "pro" else "🆓 FREE")', 
                          'plan_badge = "👑 OWNER" if plan == "owner" else ("💎 PRO" if plan == "pro" else "🆓 FREE")\n    upsell = "<blockquote>⚠️ AMARAN: Anda masih menggunakan 🆓 VERSI PERCUMA. Kelajuan skrip disekat dan terdedah kepada Ralat 429 WAF. Sila UPGRADE ke 💎 PRO SEKARANG!</blockquote>\\n\\n" if plan == "free" else ""')

content = content.replace('Sila pilih modul operasi anda di bawah:"', 'Sila pilih modul operasi anda di bawah:"\n    if plan == "free": text = text.replace("Sila pilih modul operasi anda di bawah:", upsell + "Sila pilih modul operasi anda di bawah:")')
content = content.replace('Sila pilih arahan seterusnya:"', 'Sila pilih arahan seterusnya:"\n        if plan == "free": text = text.replace("Sila pilih arahan seterusnya:", upsell + "Sila pilih arahan seterusnya:")')

# Ensure blockquotes on everything
content = content.replace('bot.reply_to(message, f"✅ Berjaya! ID pengguna <code>{target_id}</code> telah dinaik taraf ke pelan <b>PRO</b>.", parse_mode="HTML")',
                          'bot.reply_to(message, f"<blockquote>✅ <b>Berjaya!</b> ID pengguna <code>{target_id}</code> telah dinaik taraf ke pelan <b>💎 PRO</b>.</blockquote>", parse_mode="HTML")')

content = content.replace('bot.reply_to(message, f"✅ Berjaya! ID pengguna <code>{target_id}</code> telah diturunkan taraf ke pelan <b>FREE</b>.", parse_mode="HTML")',
                          'bot.reply_to(message, f"<blockquote>✅ <b>Berjaya!</b> ID pengguna <code>{target_id}</code> telah diturunkan taraf ke pelan <b>🆓 FREE</b>.</blockquote>", parse_mode="HTML")')

content = content.replace('text = "<b>📊 MODUL ANALITIK & METRIK</b>\\n\\n<blockquote>Pantau keseluruhan metrik prestasi sistem, bacaan telemetri pelajar, dan carta kelajuan.</blockquote>"',
                          'text = "<b>📊 MODUL ANALITIK & METRIK</b>\\n\\n<blockquote>Pantau keseluruhan metrik prestasi sistem, bacaan telemetri pelajar, dan carta kelajuan.</blockquote>" + (upsell if plan == "free" else "")')

content = content.replace('text = "<b>⚙️ MODUL AUTOMASI & SKRIP</b>\\n\\n<blockquote>Dapatkan skrip suntikan terkini dan urus tetapan kelajuan (Jitter) automasi.</blockquote>"',
                          'text = "<b>⚙️ MODUL AUTOMASI & SKRIP</b>\\n\\n<blockquote>Dapatkan skrip suntikan terkini dan urus tetapan kelajuan (Jitter) automasi.</blockquote>" + (upsell if plan == "free" else "")')

content = content.replace('text = "<b>📚 PANGKALAN DATA (DATABASE)</b>\\n\\n<blockquote>Urus perpustakaan buku sintetik tempatan dan selaraskan memori awan (Supabase).</blockquote>"',
                          'text = "<b>📚 PANGKALAN DATA (DATABASE)</b>\\n\\n<blockquote>Urus perpustakaan buku sintetik tempatan dan selaraskan memori awan (Supabase).</blockquote>" + (upsell if plan == "free" else "")')

content = content.replace('text = "<b>🖥️ MODUL DIAGNOSTIK SISTEM</b>\\n\\n<blockquote>Periksa kesihatan Command Center dan pelayan sasaran (AINS).</blockquote>"',
                          'text = "<b>🖥️ MODUL DIAGNOSTIK SISTEM</b>\\n\\n<blockquote>Periksa kesihatan Command Center dan pelayan sasaran (AINS).</blockquote>" + (upsell if plan == "free" else "")')

with open('/root/NilamAutomationTools/nilam_bot.py', 'w') as f:
    f.write(content)
