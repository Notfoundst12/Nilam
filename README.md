# NILAM Auto-Fill Tool

Alat automasi untuk mengisi rekod bacaan NILAM di portal AINS (ains.moe.gov.my) secara automatik.

## Fail Penting

| Fail | Fungsi |
|------|--------|
| `books.csv` | Senarai buku (edit ini untuk tambah/ubah buku) |
| `generate_script.py` | Jana skrip console dari books.csv |
| `nilam_console_output.js` | Skrip siap paste ke DevTools Console |
| `nilam_probe.js` | (Opsyenal) Skrip diagnostik untuk periksa elemen borang |

## Cara Guna (Langkah demi Langkah)

### Langkah 1: Edit books.csv

Buka `books.csv` dan masukkan buku anda. Format:

```
Title,Language,Year,Author,Publisher,Type,Pages,Summary,Activity
Sang Kancil,BM,2020,Pak Pandir,Pustaka Rakyat,Buku Fiksyen,24,Kisah kancil cerdik,Rumusan
```

**Kolum penting:**
- `Language`: `BM` atau `BI`
- `Type`: `Buku Fiksyen` atau `Buku Bukan Fiksyen`
- `Activity`: `Rumusan`, `Bercerita`, `Lain-lain`, dll.
- `Summary`: Minimum 10 perkataan (akan diisi automatik jika kurang)

### Langkah 2: Jana skrip console

Di terminal VPS, jalankan:

```bash
python3 generate_script.py
```

Ini akan hasilkan fail `nilam_console_output.js`.

### Langkah 3: Salin skrip

Salin **semua** kandungan `nilam_console_output.js` ke clipboard.

```bash
cat nilam_console_output.js
```

Atau buka fail tersebut dan Select All + Copy.

### Langkah 4: Login ke AINS

1. Buka browser di **laptop** (bukan VPS)
2. Pergi ke https://ains.moe.gov.my
3. Login dengan akaun pelajar

### Langkah 5: Buka Console & Paste

1. Tekan **F12** untuk buka DevTools
2. Klik tab **Console**
3. Paste skrip yang telah disalin
4. Tekan **Enter**

Panel kawalan "NILAM Auto-Fill" akan muncul di penjuru kanan atas.
Skrip akan mula mengisi borang secara automatik.

### Langkah 6: Pantau progress

- Panel menunjukkan progress bar dan log setiap langkah
- Setiap buku akan ditandakan BERJAYA atau SEMAK
- Jadual keputusan dipaparkan di console bila selesai

## Jika Skrip Gagal?

### Jalankan Probe dulu

Salin `nilam_probe.js` dan paste ke Console pada halaman borang (`/record/add/book`).
Ia akan scan semua elemen dan paparkan hasilnya. Hantar output ini untuk analisis.

### Jika halaman reload

Skrip menggunakan `sessionStorage` untuk ingat progress.
Jika halaman reload, paste skrip semula - ia akan sambung dari buku terakhir.

### Reset progress

Jika mahu mula semula dari buku pertama:

```javascript
sessionStorage.removeItem('__nilam_state__');
```

## Struktur CSV

```
Title        - Tajuk buku (wajib)
Language     - BM atau BI (wajib)
Year         - Tahun terbitan
Author       - Nama pengarang (wajib)
Publisher    - Nama penerbit (wajib)
Type         - "Buku Fiksyen" atau "Buku Bukan Fiksyen" (wajib)
Pages        - Bilangan muka surat (minimum 20)
Summary      - Sinopsis/rumusan (minimum 10 perkataan)
Activity     - Jenis aktiviti: Rumusan, Bercerita, Lain-lain
```
