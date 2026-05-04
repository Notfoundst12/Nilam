# API Reference & C2 Telemetry Payload

Dokumen ini menerangkan struktur data yang digunakan untuk komunikasi di antara skrip klien (`n.js`) dan pangkalan data Supabase yang bertindak sebagai pusat kawalan (Command & Control / C2) kepada Bot Telegram.

## 1. Endpoint Supabase
*   **Base URL:** `https://yzjsmtxhpdlsniqpcuoa.supabase.co/rest/v1/nilam_used_books`
*   **Kaedah Pengesahan:** Bearer Token (Anon Key) berserta pengepala `apikey`.

## 2. Struktur Payload Telemetri (Heartbeat)
Setiap klien yang berjalan akan menghantar isyarat "heartbeat" untuk dipaparkan di Papan Pemuka Telegram Bot.

**Format Data:**
```text
__TEL__|{uid}|{timestamp}|{ok_count}|{fail_count}|{target_count}|{status_message}
```

**Penjelasan Medan:**
*   `uid`: ID Pelajar rasmi (diekstrak dari AINS) atau ID Sementara (cth: `Pelajar-1234`).
*   `timestamp`: Masa UNIX dalam milisaat.
*   `ok_count`: Bilangan buku yang berjaya diisi.
*   `fail_count`: Bilangan buku yang gagal/duplikat.
*   `target_count`: Jumlah sasaran pengisian buku bagi sesi tersebut.
*   `status_message`: Mesej ringkas semasa (cth: "Auto-Sleep (429 Limit)", "Sedang submit buku...").

## 3. Struktur Arahan Pusat Kawalan (C2 Commands)
Bot Telegram menghantar arahan (Command) kepada klien secara masa nyata dengan memasukkan baris perintah ke dalam pangkalan data.

**Format Data:**
```text
__CMD__|{ACTION}|{TIMESTAMP}
__CMD__|MSG|{TEXT}|{TIMESTAMP}
```

**Senarai Arahan (ACTION):**
*   `PAUSE`: Menghentikan sementara sesi automasi pada klien.
*   `RESUME`: Menyambung semula sesi automasi.
*   `KILL`: Mematikan skrip klien dengan serta-merta. Gelung (loop) klien akan terbatal.
*   `MSG`: Memaparkan pengumuman (Alert) berbentuk teks kepada pengguna di pelayar web. Hanya dipaparkan sekali sahaja berdasarkan ID masa.

## 4. Mekanisme "Garbage Collection" (Klien)
Bagi mengelakkan pangkalan data C2 padat dengan data telemetri usang:
*   Skrip klien akan melakukan arahan `DELETE` (`title=ilike.__TEL__|{uid}|*`) terlebih dahulu sebelum membuat hantaran `POST` telemetri yang baharu.

## 5. Pangkalan Data Buku Terpakai (Used Books Sync)
Untuk mengelakkan pengisian buku yang bertindih:
*   Klien akan mengambil semua rentetan buku (yang tidak bermula dengan awalan `__TEL__` atau `__CMD__`).
*   Setiap kali buku berjaya dihantar ke AINS, tajuk buku akan dihantar ke Supabase melalui operasi `POST` dengan pengepala `Prefer: resolution=ignore-duplicates`.