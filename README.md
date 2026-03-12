# 🎁 Multi-Platform Donation Webhook Tracker

Aplikasi untuk menangani webhook donasi dari **SocialBuzz**, **Saweria**, dan **BagiBagi** dalam satu tempat.

## ✨ Fitur

- ✅ Support 3 platform donasi (SocialBuzz, Saweria, BagiBagi)
- ✅ Real-time donation tracking
- ✅ Donation history dengan localStorage
- ✅ Web dashboard untuk melihat donasi
- ✅ Webhook tester built-in
- ✅ Responsive design

---

## 🚀 Deploy ke Vercel (Recommended)

### Step 1: Siapkan Repository
```bash
git init
git add .
git commit -m "Initial commit"
```

### Step 2: Push ke GitHub
1. Buat repository baru di GitHub
2. Push code Anda:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy ke Vercel
1. Kunjungi https://vercel.com
2. Click **"New Project"**
3. Import GitHub repository Anda
4. Vercel akan auto-detect Next.js/Node.js config
5. Click **Deploy**

### Step 4: Setup Environment Variables di Vercel Dashboard
1. Buka project settings
2. Ke tab **Environment Variables**
3. Tambahkan:
   - `SAWERIA_STREAMING_KEY` = Your Saweria key
   - `BAGIBAGI_WEBHOOK_TOKEN` = Your BagiBagi token
4. Redeploy

---

## 📌 Webhook URLs (Setelah Deploy ke Vercel)

Vercel akan memberi URL seperti: `https://your-project.vercel.app`

**Gunakan di Dashboard Saweria:**
```
https://your-project.vercel.app/webhook/saweria
```

**Gunakan di Dashboard BagiBagi:**
```
https://your-project.vercel.app/webhook/bagibagi
```

---

## 🧪 Testing Lokal

### Prerequisites
```bash
npm install
```

### Jalankan Server
```bash
npm start
```

### Test Webhook
Buka browser:
```
http://localhost:3000/webhook-test.html
```

### Lihat Dashboard
```
http://localhost:3000
```

---

## 📂 Project Structure

```
Nuvasa-main/
├── server.js              # Main Express server
├── package.json           # Dependencies
├── vercel.json           # Vercel configuration
├── .env.example          # Environment variables template
└── public/
    ├── index.html        # Dashboard/Landing page
    ├── webhook-test.html # Webhook tester
    ├── styles.css        # Styling
    └── script.js         # Client-side logic
```

---

## 🔧 Konfigurasi Saweria

1. Login ke https://saweria.co
2. Buka **Integration** → **Webhook**
3. Enable HTTP Webhook
4. Masukkan URL: `https://your-project.vercel.app/webhook/saweria`
5. Dapatkan **Streaming Key** dari settings
6. Set di Vercel environment variable `SAWERIA_STREAMING_KEY`

---

## 🔧 Konfigurasi BagiBagi

1. Login ke https://bagibagi.co
2. Buka **Stream Overlay** → **Integration**
3. Tab **Custom Webhook Integration**
4. Masukkan URL: `https://your-project.vercel.app/webhook/bagibagi`
5. Dapatkan **Webhook Token** dari settings
6. Set di Vercel environment variable `BAGIBAGI_WEBHOOK_TOKEN`

---

## 📊 Endpoints

| Method | Endpoint | Deskripsi |
|--------|----------|-----------|
| GET | `/` | Dashboard |
| GET | `/data` | JSON data donasi terakhir |
| GET | `/webhook-test.html` | Testing page |
| POST | `/webhook/saweria` | Saweria webhook |
| POST | `/webhook/bagibagi` | BagiBagi webhook |
| POST | `/webhook/socialbuzz` | SocialBuzz webhook |

---

## 🛠️ Environment Variables

Buat file `.env` lokal (copy dari `.env.example`):

```env
SAWERIA_STREAMING_KEY=your_key_here
BAGIBAGI_WEBHOOK_TOKEN=your_token_here
```

---

## 📝 License

MIT License - Bebas digunakan dan dimodifikasi

---

## 👨‍💻 Support

Untuk bantuan atau error, cek console di:
- Browser: F12 → Console
- Server: Terminal output
- Vercel: Dashboard → Deployments → Logs

---

**Selamat! Aplikasi Anda siap untuk menerima donasi dari 3 platform! 🎉**
