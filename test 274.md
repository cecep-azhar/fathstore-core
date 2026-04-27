# Pengujian Transaksi FathStore - 27 April 2026

## Lingkungan Pengujian
- URL: http://localhost:3000
- Browser: Chrome
- Akun Test: member@gmail.com / member123

## Langkah Pengujian
1. [ ] Login ke sistem
2. [ ] Pilih produk dari katalog
3. [ ] Tambah ke keranjang
4. [ ] Proses Checkout
5. [ ] Pilih metode pembayaran
6. [ ] Konfirmasi pembayaran

## Hasil Pengujian
| Langkah | Status | Catatan |
|---------|--------|---------|
| Akses Home | Berhasil | Halaman utama dapat diakses, produk muncul. |
| Login | Gagal | Credential member@gmail.com / member123 ditolak (401). |
| Pilih Produk | Berhasil | Navigasi ke /products lancar. |
| Detail Produk | Terkendala | Beberapa produk (Classic Tee) mengalami hydration error/runtime error. |
| Keranjang | Berhasil | Item dapat masuk ke keranjang dan halaman /cart berfungsi. |
| Checkout | Berhasil | Form checkout dapat diisi dan diproses. |
| Pembayaran | Berhasil | Metode Bank Transfer berfungsi, pesanan berhasil dibuat. |

## Temuan / Kendala
- **Login**: Akun member contoh dari seeder tidak dapat masuk. Perlu pengecekan database.
- **Runtime Error**: Terdapat hydration mismatch pada halaman detail produk tertentu (`/products/exortive-classic-tee-sale`).
- **Rute**: Aplikasi menggunakan rute root (tanpa prefix `/en` atau `/id`) sebagai rute utama yang stabil.
- **Transaksi**: Alur checkout hingga success page berjalan dengan baik meskipun tanpa login (sebagai guest).

