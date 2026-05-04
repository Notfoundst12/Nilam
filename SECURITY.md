# Dasar Keselamatan (Security Policy)

Keselamatan projek **NILAM Command Center PRO** dan penggunanya adalah keutamaan kami, walaupun sistem ini beroperasi secara *stealth*. Kami sentiasa berusaha untuk memastikan data pengguna selamat dan identiti tersembunyi (*Ghost Mode*).

## Polisi Privasi & Data
1.  **Pengumpulan Minimum:** Kami hanya mengumpul *ID Pengguna* (UID) awan untuk tujuan metrik (telemetry) dan penyegerakan di dalam pangkalan data Supabase C2.
2.  **Zero-Trust:** Kami tidak menyimpan sebarang kata laluan (password) log masuk portal AINS pengguna.
3.  **Data Terhapus (Ephemeral Data):** *Heartbeat* telemetri dan log status dihapuskan secara automatik (Garbage Collection) sekiranya ia berusia lebih daripada 5 minit.

## Cara Melaporkan Kerentanan (Vulnerability)
Jika anda menemui sebarang isu keselamatan, pepijat kritikal yang membocorkan data, atau kepincangan dalam perlindungan *Stealth/WAF Bypass*, **TOLONG JANGAN** membuka Isu awam (Public Issue) di repositori ini. 

Sila laporkan terus kepada pembangun melalui:
*   **Telegram Admin / Bot Support:** Sila hantar tiket melalui bot C2 Telegram yang disediakan (atau hubungi terus *Owner*).

### Maklumat Yang Diperlukan
Apabila melaporkan isu keselamatan, sila sertakan:
1.  Penerangan terperinci mengenai kerentanan tersebut.
2.  Langkah-langkah untuk menghasilkan semula (reproduce) pepijat itu (jika ada).
3.  Cadangan mitigasi (jika ada).

## Polisi Sokongan Versi
Kami hanya menyokong isu keselamatan bagi versi utama yang terkini:

| Versi | Status Sokongan |
| :--- | :--- |
| **v16.x** & **v17.0** (Vantablack/Zero-Trust) | Disokong (Aktif) |
| v10.x & ke bawah (Legacy Alert UI) | Tidak Disokong |

Terima kasih kerana membantu memastikan ekosistem alat ini sentiasa selamat dan tersembunyi.