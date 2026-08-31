# Hasil Pengujian RAG vs Base Model

## Pertanyaan 1
**Apa saja dokumen wajib yang harus dibawa saat apply visa turis Jepang (single-entry)?**

### ❌ Tanpa Knowledge Base (Base Model)
Dokumen wajib yang harus dibawa saat mengajukan visa turis Jepang (single-entry) meliputi:

1. Formulir permohonan visa Jepang yang sudah diisi dan ditandatangani.
2. Paspor yang valid minimal enam bulan dari tanggal kedatangan ke Jepang.
3. Foto paspor (kopi scan) yang menunjukkan halaman informasi dan halaman visa.
4. Tiket penerbangan yang sudah dipesan.
5. Bukti pemesanan akomodasi (misalnya, konfirmasi hotel atau surat undangan dari teman/keluarga).
6. Bukti keuangan yang menunjukkan kemampuan finansial untuk mendukung diri sendiri selama di Jepang (misalnya, pernyataan bank terakhir tiga bulan atau surat garansi keuangan).
7. Jadwal perjalanan yang mencakup tanggal dan tempat yang akan dikunjungi.
8. Surat undangan atau bukti hubungan jika Anda diundang oleh seseorang di Jepang.

### ✅ Dengan Knowledge Base (RAG)
Valid Passport, Visa application form, Photo, Flight itinerary, Valid Passport, One of the following documents to prove ability to pay travel expenses during your stay in Japan (Income certificate or tax return issued by a public agency, Bank statement, balance certificate etc.), Itinerary in Japan.

**Dokumen Sumber**: `single-entry-short-term-visa-japan.pdf`

---

## Pertanyaan 2
**Berapa lama waktu proses pembuatan visa kunjungan singkat ke Jepang?**

### ❌ Tanpa Knowledge Base (Base Model)
Proses pembuatan visa kunjungan singkat (visa kunjungan) ke Jepang biasanya membutuhkan waktu sekitar 4-5 hari kerja. Namun, waktu ini bisa bervariasi tergantung pada beberapa faktor seperti musim libur, jumlah pengiriman aplikasi, dan prosedur tambahan yang mungkin diperlukan.

### ✅ Dengan Knowledge Base (RAG)
It takes approximately one week to process the application for a short visit visa to Japan.

**Dokumen Sumber**: `single-entry-short-term-visa-japan.pdf`

---

## Pertanyaan 3
**Apakah saya wajib melampirkan surat undangan (invitation letter) untuk visa turis Jepang?**

### ❌ Tanpa Knowledge Base (Base Model)
Tidak, surat undangan (invitation letter) tidak diperlukan untuk visa turis Jepang. Namun, disarankan untuk melampirkan bukti reservasi hotel dan jadwal penerbangan untuk membantu proses visa.

### ✅ Dengan Knowledge Base (RAG)
Yes, you are required to attach an invitation letter for a Japan tourist visa. The invitation letter should be addressed to the Japanese Ambassador or Consul General, detailing the planned activities in Japan, the inviting person's name, address, and phone number, and the visa applicant's full name in the Latin alphabet.

**Dokumen Sumber**: `single-entry-short-term-visa-japan.pdf`

---

## Pertanyaan 4
**Berapa maksimal durasi tinggal untuk visa kunjungan singkat (short-term visa) di Jepang?**

### ❌ Tanpa Knowledge Base (Base Model)
Maksimal durasi tinggal untuk visa kunjungan singkat (short-term visa) di Jepang adalah 90 hari.

### ✅ Dengan Knowledge Base (RAG)
Sorry, the context does not provide information about the maximum duration of stay for a short-term visa in Japan.

**Dokumen Sumber**: `single-entry-short-term-visa-japan.pdf`

---

## Pertanyaan 5
**Apakah tiket penerbangan pulang-pergi (round-trip) wajib dilampirkan sebagai syarat dokumen?**

### ❌ Tanpa Knowledge Base (Base Model)
Biasanya, tiket penerbangan pulang-pergi (round-trip) tidak wajib dilampirkan sebagai syarat dokumen saat mengajukan visa atau izin masuk ke suatu negara. Namun, beberapa negara mungkin meminta bukti reservasi penerbangan atau tiket sebagai bagian dari proses aplikasi. Hal ini tergantung pada kebijakan imigrasi negara tersebut.

### ✅ Dengan Knowledge Base (RAG)
Reservations and payments for airline tickets, accommodations, transportation, etc. are not required at the time of visa application.

**Dokumen Sumber**: `single-entry-short-term-visa-japan.pdf`

---

### Catatan
> **Kesimpulan Pengujian:**
> Sistem RAG memberikan jawaban yang jauh lebih **akurat dan sesuai regulasi spesifik** berdasarkan dokumen yang diunggah. Selain itu, RAG berhasil mencegah halusinasi (terlihat di Pertanyaan 4 dan 5) di mana Base Model memberikan jawaban generik atau salah, sedangkan RAG memberikan fakta dari dokumen atau menolak menjawab jika dokumen tidak memuat informasi tersebut.

