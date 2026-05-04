# Panduan Menyumbang (Contributing Guide)

Terima kasih kerana berminat untuk menyumbang kepada projek **NILAM Command Center PRO**. Walaupun ini adalah projek persendirian/sumber tertutup (closed-source) pada asalnya, sebarang cadangan dan tampalan (patches) amat dialu-alukan.

## 1. Etika Pembangunan (Code of Conduct)
*   Sila kekalkan rasa hormat apabila berbincang.
*   Kami mengamalkan polisi "Zero-Trust" — sebarang sumbangan kod mesti dipastikan tidak mendedahkan maklumat sensitif pengguna.
*   **DILARANG SAMA SEKALI** menghantar kod yang membolehkan akaun pengguna AINS digodam atau diakses tanpa kebenaran.

## 2. Cara Melaporkan Pepijat (Bug Reports)
Jika anda menjumpai pepijat, sila pastikan:
1.  Anda menggunakan versi terkini (`n.js` v16.0+).
2.  Nyatakan langkah-langkah untuk menghasilkan semula (reproduce) pepijat tersebut.
3.  Berikan maklumat log Console (tekan F12 di pelayar web).

## 3. Garis Panduan Kod (Coding Guidelines)
Jika anda mengubah suai fail teras seperti `n.js`:
*   **Jangan gunakan `location.href` atau `location.reload()`:** Ini akan memadam memori sistem. Gunakan fungsi "Soft DOM Reset" sedia ada.
*   **UI Vantablack:** Sebarang penambahan elemen UI mesti mematuhi kelas CSS sedia ada (contoh: `.nm-btn`, `.nm-card`) untuk mengekalkan tema *Glassmorphism*.
*   **Pemintas (Spoofing):** Kod baru tidak boleh mengganggu `Proxy` pada `window.fetch` atau `XMLHttpRequest`.

## 4. Penghantaran Pull Request (PR)
1.  Cipta cawangan (*branch*) baru untuk ciri atau pembetulan pepijat anda.
2.  Tulis penerangan komit (commit message) yang ringkas dan jelas.
3.  Pastikan anda tidak mendedahkan sebarang kunci API (API Keys) atau token Supabase dalam PR anda. Kunci sedia ada dalam kod dibenarkan kerana ia menggunakan *Row Level Security* (RLS).