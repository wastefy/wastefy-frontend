# 🗑️ Wastefy — Frontend
> **Pantau tanggal kadaluwarsa dan kurangi pemborosan makanan.**

Wastefy adalah aplikasi manajemen stok bahan makanan segar berbasis web yang membantu pengguna memantau kondisi dan tanggal kadaluwarsa item, sehingga mengurangi pemborosan makanan di rumah tangga.

---

## ✨ Fitur Utama

- **Scan AI** — Foto buah/sayur dianalisa otomatis oleh AI untuk mendeteksi nama, jenis, dan kondisi item
- **Manajemen Stok** — Tambah, tandai terpakai, atau buang item dengan mudah
- **Notifikasi Real-time** — Peringatan otomatis via Firebase Cloud Messaging (FCM) untuk item yang akan atau sudah kadaluwarsa
- **Riwayat Item** — Lacak semua item yang pernah terpakai atau dibuang
- **Autentikasi Lengkap** — Daftar/masuk via email & password atau Google
- **Dark Mode** — Tampilan terang dan gelap

---

## 🛠️ Tech Stack

- **React** (Vite)
- **Axios** — HTTP client dengan interceptor Firebase token
- **Firebase Auth** — Autentikasi email/password & Google
- **Firebase Cloud Messaging (FCM)** — Push notification real-time
- **react-datepicker** — Date picker

---

## 🌿 Branch

| Branch | Deskripsi |
|--------|-----------|
| `main` | Branch utama (production-ready) |
| `dev` | Branch pengembangan aktif |
| `feature/dashboard` | Halaman dashboard utama |
| `feature/design-system` | Komponen UI & design system |
| `feature/forgot-password` | Fitur lupa kata sandi |
| `feature/history` | Halaman riwayat item |
| `feature/landing-page` | Halaman landing page |
| `feature/notification` | Halaman & sistem notifikasi |
| `feature/settings` | Halaman pengaturan pengguna |
| `reponsive` | Penyesuaian tampilan responsif |

> Alur kerja: `feature/*` → `dev` → `main`

---

## 🚀 Cara Menjalankan

### Prerequisites
- Node.js >= 18
- Firebase project (Auth + FCM aktif)
- Backend server berjalan

### 1. Clone repository
```bash
git clone https://github.com/username/wastefy-frontend.git
cd wastefy-frontend
```

### 2. Pindah ke branch yang diinginkan
```bash
# Branch pengembangan
git checkout dev

# Atau branch fitur tertentu
git checkout feature/dashboard
```

### 3. Install dependencies
```bash
npm install
```

### 4. Konfigurasi environment
Buat file `.env` di root project:
```env
VITE_BASE_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_VAPID_KEY=your_vapid_key
```

### 5. Jalankan aplikasi
```bash
npm run dev
```

Aplikasi berjalan di `http://localhost:5173`

---

## 📁 Struktur Project

```
src/
├── components/
│   ├── layout/          # AuthLayout, dll
│   └── icons/           # SVG icon components (IconBell, dll)
├── config/
│   └── firebase.js      # Konfigurasi Firebase
├── context/
│   └── AppContext.jsx    # Global state & semua fungsi utama
├── pages/
│   ├── auth/            # SignUpPage, LoginPage, dll
│   └── ...
├── utils/
│   └── axiosInstance.js # Axios instance + interceptor token
└── constants/           # SCREENS, TABS, BASE_URL, FRESH_ITEMS, dll
```

---

## 🔌 API Endpoints

Base URL: `https://wastefy-backend-git-dev-wastefy-project-dicoding.vercel.app`

Semua endpoint (kecuali auth) memerlukan header:
```
Authorization: Bearer <firebase_id_token>
```

### Auth
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `POST` | `/api/auth/register` | Daftar akun baru (email & password) |
| `POST` | `/api/auth/login` | Login (termasuk Google) |
| `GET` | `/api/auth/profile` | Ambil profil user yang sedang login |

### Inventory (Stok)
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/inventory` | Ambil semua item stok milik user |
| `GET` | `/api/inventory/summary` | Ambil ringkasan stok (jumlah per status) |
| `GET` | `/api/inventory/history` | Ambil riwayat item terpakai/dibuang |
| `POST` | `/api/inventory` | Tambah item baru ke stok |
| `PATCH` | `/api/inventory/:id/used` | Tandai item sebagai terpakai |
| `PATCH` | `/api/inventory/:id/wasted` | Tandai item sebagai dibuang |
| `PATCH` | `/api/inventory/:id/restore` | Kembalikan item dari riwayat ke stok |
| `DELETE` | `/api/inventory/:id` | Hapus item dari stok |

### Notifikasi
| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| `GET` | `/api/notifications/history` | Ambil riwayat notifikasi user |
| `POST` | `/api/notifications/token` | Simpan FCM token perangkat |
| `POST` | `/api/notifications/check` | Trigger pengecekan item kadaluwarsa |
| `DELETE` | `/api/notifications/token` | Hapus FCM token (saat logout) |

---

## 🤝 Kontribusi

1. Fork repository ini
2. Checkout dari `dev`: `git checkout -b feature/nama-fitur dev`
3. Commit perubahan: `git commit -m 'feat: tambah fitur X'`
4. Push ke branch: `git push origin feature/nama-fitur`
5. Buat Pull Request ke branch `dev`
