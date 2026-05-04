# Service Level Agreement (SLA)

**NILAM Command Center PRO**

Perjanjian Tahap Perkhidmatan (SLA) ini menggariskan komitmen kami terhadap ketersediaan perkhidmatan dan tahap sokongan untuk pengguna NILAM Command Center PRO.

## 1. Ketersediaan Sistem (Uptime)

Kami menyasarkan tahap ketersediaan sistem sebanyak **99.0%** setiap bulan bagi komponen-komponen utama berikut:
*   **Sistem Telemetri & Memori Awan (Supabase C2)**
*   **Telegram Command & Control (C2) Bot**

### 1.1. Pengecualian Downtime
Kiraaan ketersediaan sistem tidak merangkumi perkara berikut:
*   Penyelenggaraan berjadual (yang akan dimaklumkan sekurang-kurangnya 24 jam lebih awal melalui Telegram Bot).
*   *Downtime* yang berpunca daripada pihak ketiga (contohnya, masalah rangkaian awam, kegagalan penyedia pelayan/Cloud).
*   **Penafian Penting:** Sebarang kerosakan, penyelenggaraan, perubahan kod, atau halangan *Web Application Firewall* (WAF) dari pihak portal rasmi AINS Kementerian Pendidikan Malaysia (MOE) adalah **di luar kawalan kami**. Gangguan ini TIDAK akan dikira sebagai ketidakpatuhan SLA.

## 2. Sokongan Teknikal (Support Response Time)

Tahap sokongan adalah berdasarkan pelan langganan pengguna:

*   **Pengguna PRO (Berbayar):** 
    *   Masa Tindak Balas Awal (Initial Response): Dalam tempoh **24 jam bekerja**.
    *   Bantuan Keutamaan (Priority Support) untuk masalah pepijat (bug) dan isu Telegram Bot.
*   **Pengguna Percuma (Free Tier):**
    *   Tiada jaminan SLA. Bantuan diberikan tertakluk kepada kelapangan masa pentadbir (Best-effort basis).

## 3. Keselamatan dan Integriti Data

*   Sistem kami meminimumkan penyimpanan data peribadi. Log yang disimpan dalam Supabase dipadam secara berkala (Garbage Collection) dan hanya digunakan untuk tujuan C2.
*   Kami mengimplementasikan strategi perlindungan *rate limit* (Auto-Sleep) untuk mengelakkan risiko akaun disekat, namun tiada jaminan 100% bahawa akaun anda kalis tindakan penguatkuasaan oleh pentadbir portal.

## 4. Penafian Liabiliti (Limitation of Liability)

*   **Penggunaan Atas Risiko Sendiri:** Skrip automasi ini (*Phantom Stealth Edition*) adalah projek inovasi bebas dan TIDAK berafiliasi dengan Kementerian Pendidikan Malaysia (MOE) atau pemaju portal AINS.
*   Kami **tidak bertanggungjawab** ke atas sebarang akibat, tindakan tatatertib, atau penamatan akaun (ban) yang dikenakan oleh pihak MOE akibat daripada penggunaan alat ini.

---
*Dokumen ini adalah untuk tujuan maklumat am. Kami berhak meminda SLA ini mengikut keperluan dan perubahan sistem operasi pada bila-bila masa.*