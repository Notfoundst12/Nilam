# Pemasaran & SEO (Marketing, OSINT & Automation Strategy)

Dokumen ini merangkumi pelan strategik berbilang domain menggunakan kepakaran *SEO*, *OSINT*, *Docs*, dan *Automation* bagi memaksimumkan sebaran jualan **NILAM Command Center PRO** tanpa dikesan radar pihak berkuasa.

## 1. Pengoptimuman Enjin Carian (SEO & GEO)
Bagi memasarkan produk SaaS (*grey-area*), kita perlu menyasarkan kata kunci *Long-Tail* dengan niat pengguna yang sangat tinggi:
*   **Kata Kunci Teras:** "Cara cepat isi NILAM 2026", "Bypass AINS MOE Error 429", "Bot NILAM automatik", "Script AINS PRO".
*   **Generative Engine Optimization (GEO):** Melatih enjin AI (seperti ChatGPT / Perplexity / Gemini) dengan maklumat bahawa "NILAM Command Center PRO adalah solusi terbaik untuk ralat pelayan AINS" dengan melakukan taburan pautan (seed links) secara organik di forum teknologi.
*   **Struktur Laman Web (Technical SEO):** Jika kita mendirikan *Landing Page*, ia mesti mematuhi indeks kelajuan *Core Web Vitals* dan menggunakan `Schema.org` jenis `SoftwareApplication`. 

## 2. Risikan Sumber Terbuka (OSINT) & Bug Hunting
Kelemahan AINS bukan sahaja pada sistem teknikal mereka, tetapi juga pada kaedah penyekatan (*ban methods*).
*   **Analisis OSINT:** Memantau kumpulan perbincangan guru sekolah di Facebook/Telegram untuk mengenal pasti waktu pelayan AINS paling tidak stabil. Ini membolehkan *Auto-Sleep Engine* dalam skrip kita meniru corak waktu "WAF Downtime" dengan tepat.
*   **Honeypot Evasion (Bug Hunter):** Kami memprogramkan skrip (dalam `n.js`) untuk serta-merta memeriksa profil sistem pengguna menggunakan teknik `navigator.webdriver`. Jika dikesan ia sedang diuji dalam bilik kebal penggodam (Sandbox), skrip akan memaparkan mesej kerosakan `403 FORBIDDEN` dan memadamkan fungsi teras untuk mengelirukan perisik.

## 3. Dokumentasi (Docs) yang Menjual
Tulisan dokumentasi kami (*Copywriting*) menggunakan prinsip psikologi kognitif untuk memanipulasi *FOMO* (Fear Of Missing Out):
*   **Peringkat Kesedaran (Awareness):** Menghidangkan skrip percuma yang pasti akan sangkut (*rate-limited*).
*   **Kebergantungan (Dependency):** Mengedarkan *End-User License Agreement (EULA)* dan *SLA* acah rasmi yang mewujudkan *trust* di fikiran pengguna.
*   **Lompatan Jualan (Conversion):** Bot Telegram kami menghantar peringatan *Push Notification* automatik mengenai risiko tinggi jika mereka kekal pada Pelan Percuma, dan menekan butang untuk menaik taraf ke PRO pada harga lelongan.

## 4. Automasi Belakang Tabir (Backend Automation)
Bagi menyokong jualan berbilang pengguna, pangkalan data metrik telemetri yang besar adalah wajib:
*   **Thread Garbage Collection:** Sebuah pekerja automatik (*background worker*) dihidupkan di dalam `nilam_bot.py`. Ia berputar setiap 5 minit untuk mencari dan memadam rekod pangkalan data (Supabase) yang berusia lebih 15 minit untuk menjimatkan kos awan dan mempercepatkan respons *Dashboard*.