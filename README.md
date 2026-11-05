# Trello Desktop App - Panduan Build & Instalasi

## 📦 Cara Membuat Aplikasi Desktop (.exe)

### Persyaratan Sistem
- Node.js v16+ (Download: https://nodejs.org)
- Windows 10/11 (untuk build Windows)

### Langkah-Langkah Build

#### Opsi 1: Otomatis (Mudah)
1. Buka Command Prompt atau PowerShell di folder `d:\Website\Trello`
2. Jalankan file batch:
   ```bash
   build.bat
   ```
3. Tunggu hingga proses selesai (~5-10 menit)
4. File `.exe` akan tersimpan di folder `dist/`

#### Opsi 2: Manual
1. Install dependencies:
   ```bash
   npm install
   npm install --save-dev electron electron-builder
   ```

2. Build aplikasi Windows:
   ```bash
   npm run build:win
   ```

3. File installer akan dibuat di `dist/Trello Desktop Setup 1.0.0.exe`

### Platform Lain
- **MacOS**: `npm run build:mac` (menghasilkan `.dmg`)
- **Linux**: `npm run build:linux` (menghasilkan `.AppImage`)

## 🚀 Menjalankan Mode Development

Untuk testing tanpa build:
```bash
npm install
npm start
```

## 📂 Struktur File
```
Trello/
├── trello.html          # Aplikasi web utama
├── main.js              # Electron main process
├── preload.js           # Electron preload script
├── package.json         # Konfigurasi npm & electron-builder
├── build.bat            # Script build otomatis Windows
├── icon.png             # Icon aplikasi (opsional)
└── dist/                # Output folder (dibuat otomatis)
    └── Trello Desktop Setup 1.0.0.exe
```

## 📥 Distribusi

Setelah build selesai, file `.exe` di folder `dist/` dapat:
- Diinstal langsung di komputer Windows manapun
- Didistribusikan ke pengguna lain tanpa perlu Node.js
- Di-upload ke GitHub Releases atau website

## 🔧 Troubleshooting

**Error: "npm tidak dikenali"**
- Install Node.js terlebih dahulu dari nodejs.org

**Build gagal di langkah electron-builder**
- Pastikan koneksi internet stabil
- Coba jalankan ulang `build.bat`

**Antivirus memblokir file .exe**
- File aman, tambahkan exception atau sign dengan code certificate

## 📝 Catatan Penting

- Ukuran file installer: ~150-200 MB (termasuk runtime Electron)
- Aplikasi desktop 100% offline, data tersimpan lokal di LocalStorage
- Tidak perlu browser, berjalan sebagai aplikasi native Windows
