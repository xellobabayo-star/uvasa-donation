<div align="center">

```
███╗   ██╗██╗   ██╗██╗   ██╗ █████╗ ███████╗ █████╗
████╗  ██║██║   ██║██║   ██║██╔══██╗██╔════╝██╔══██╗
██╔██╗ ██║██║   ██║██║   ██║███████║███████╗███████║
██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║╚════██║██╔══██║
██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║███████║██║  ██║
╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

### 🎁 Multi-Platform Donation Webhook Tracker

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
[![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![License](https://img.shields.io/badge/License-MIT-ff6b9d?style=for-the-badge)](LICENSE)

> **Satu server untuk semua donasi — SocialBuzz, Saweria, dan BagiBagi terpusat dalam satu dashboard real-time.**

</div>

---

## ✨ Fitur Unggulan

<table>
<tr>
<td width="50%">

### 🔗 Multi-Platform
- Support **SocialBuzz**, **Saweria**, **BagiBagi**
- Satu URL, tiga platform sekaligus
- Webhook verification per platform
- Auto-detect format payload

</td>
<td width="50%">

### 📊 Real-Time Dashboard
- Live donation feed tanpa refresh
- History donasi dengan localStorage
- Jumlah & nominal donasi terakumulasi
- Responsive di mobile & desktop

</td>
</tr>
<tr>
<td width="50%">

### 🧪 Built-in Tester
- Test webhook tanpa setup external
- Simulasi payload tiap platform
- Debug mode dengan log detail
- JSON response viewer

</td>
<td width="50%">

### ☁️ Deploy-Ready
- Zero-config Vercel deployment
- Environment variable support
- Serverless compatible
- Auto HTTPS dari Vercel

</td>
</tr>
</table>

---

## 🖥️ Preview Dashboard

```
┌──────────────────────────────────────────────────────────────┐
│  🎁 NUVASA — Donation Tracker              [ LIVE ● ]        │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│   💰 Total Hari Ini        📦 Total Donasi                   │
│   ─────────────────        ────────────────                  │
│      Rp 850.000                  12                          │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│  📋 Donasi Terbaru                                           │
│                                                              │
│  ● [SAWERIA]     Budi Santoso    Rp 50.000   "Gas terus!"   │
│  ● [BAGIBAGI]    Anonim          Rp 10.000   "Semangat"     │
│  ● [SOCIALBUZZ]  Rizky_dev       Rp 100.000  "Keep coding"  │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Deploy ke Vercel

### 1 — Clone & Push ke GitHub

```bash
git init
git add .
git commit -m "feat: initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nuvasa.git
git branch -M main
git push -u origin main
```

### 2 — Deploy

```bash
# Pakai Vercel CLI
npm i -g vercel
vercel
```

Atau lewat dashboard: [vercel.com](https://vercel.com) → **New Project** → Import GitHub repo → **Deploy** ✅

### 3 — Set Environment Variables

Di Vercel Dashboard → **Project Settings** → **Environment Variables**:

```env
SAWERIA_STREAMING_KEY     =  your_saweria_key
BAGIBAGI_WEBHOOK_TOKEN    =  your_bagibagi_token
```

Redeploy setelah set env. Done! 🎉

---

## 📌 Webhook URLs

Setelah deploy, URL kamu akan jadi `https://your-project.vercel.app`

| Platform | Webhook URL |
|----------|------------|
| 🟡 **Saweria** | `https://your-project.vercel.app/webhook/saweria` |
| 🟢 **BagiBagi** | `https://your-project.vercel.app/webhook/bagibagi` |
| 🔵 **SocialBuzz** | `https://your-project.vercel.app/webhook/socialbuzz` |

---

## ⚙️ Setup Per Platform

<details>
<summary><b>🟡 Saweria</b></summary>

1. Login ke [saweria.co](https://saweria.co)
2. **Integration** → **Webhook** → Enable HTTP Webhook
3. Masukkan URL: `https://your-project.vercel.app/webhook/saweria`
4. Copy **Streaming Key** dari settings
5. Tambahkan ke Vercel env sebagai `SAWERIA_STREAMING_KEY`

</details>

<details>
<summary><b>🟢 BagiBagi</b></summary>

1. Login ke [bagibagi.co](https://bagibagi.co)
2. **Stream Overlay** → **Integration** → **Custom Webhook**
3. Masukkan URL: `https://your-project.vercel.app/webhook/bagibagi`
4. Copy **Webhook Token** dari settings
5. Tambahkan ke Vercel env sebagai `BAGIBAGI_WEBHOOK_TOKEN`

</details>

<details>
<summary><b>🔵 SocialBuzz</b></summary>

1. Login ke SocialBuzz dashboard
2. Buka **Settings** → **Webhook Integration**
3. Masukkan URL: `https://your-project.vercel.app/webhook/socialbuzz`
4. Tidak butuh env variable tambahan

</details>

---

## 🧪 Testing Lokal

```bash
# Install dependencies
npm install

# Copy konfigurasi
cp .env.example .env

# Jalankan server
npm start
```

| URL | Deskripsi |
|-----|-----------|
| `http://localhost:3000` | Dashboard utama |
| `http://localhost:3000/webhook-test.html` | Webhook tester |
| `http://localhost:3000/data` | Raw JSON data donasi |

---

## 📡 API Endpoints

| Method | Endpoint | Auth | Deskripsi |
|--------|----------|------|-----------|
| `GET` | `/` | — | Dashboard |
| `GET` | `/data` | — | JSON donasi terbaru |
| `GET` | `/webhook-test.html` | — | Testing page |
| `POST` | `/webhook/saweria` | Header key | Terima donasi Saweria |
| `POST` | `/webhook/bagibagi` | Token | Terima donasi BagiBagi |
| `POST` | `/webhook/socialbuzz` | — | Terima donasi SocialBuzz |

---

## 📁 Struktur Project

```
nuvasa/
├── server.js               ← Express server + webhook handlers
├── package.json
├── vercel.json             ← Vercel serverless config
├── .env.example            ← Template environment variables
└── public/
    ├── index.html          ← Dashboard real-time
    ├── webhook-test.html   ← Built-in webhook tester
    ├── styles.css          ← UI styling
    └── script.js           ← Client-side logic
```

---

## 🛠️ Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Runtime | Node.js 18+ |
| Framework | Express.js |
| Storage | localStorage (client-side) |
| Deploy | Vercel Serverless |
| Realtime | Polling / SSE |

---

## 🔧 Konfigurasi `.env`

```env
# ─── Saweria ──────────────────────────────────
SAWERIA_STREAMING_KEY=your_saweria_streaming_key

# ─── BagiBagi ─────────────────────────────────
BAGIBAGI_WEBHOOK_TOKEN=your_bagibagi_token
```

---

<div align="center">

**Made with ❤️ — Satu server, semua platform donasi.**

*Dibuat untuk streamer & content creator Indonesia.*

</div>
