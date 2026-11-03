# Trellod - Full Stack Task Manager

Professional task management app dengan authentication, real-time drag-drop, dan database persistence.

## 🚀 Quick Deploy (Vercel)

### Prerequisites
- Node.js 18+
- GitHub account
- Vercel account

### Steps

**1. Jalankan di terminal:**
```bash
cd D:\Website\Trello
npm install
cd client && npm install && npm run build && cd ..
```

**2. Git & GitHub:**
```bash
git config --global user.email "your@email.com"
git config --global user.name "Your Name"
git init
git add .
git commit -m "Trellod app deployment"

# Create repo di https://github.com/new
# Nama: trellod

git remote add origin https://github.com/YOUR_USERNAME/trellod.git
git branch -M main
git push -u origin main
```

**3. Deploy ke Vercel:**
- Buka https://vercel.com
- Login dengan GitHub
- Import repo `trellod`
- Set env vars:
  ```
  DATABASE_URL=file:./prisma/dev.db
  JWT_SECRET=your-secret-key
  ```
- Click Deploy

**4. Done! ✅**
- Live: `https://trellod.vercel.app`

---

## ✨ Features

- 🔐 **Authentication**: Register/Login dengan JWT
- 📋 **Boards**: Multiple boards per user
- 📝 **Lists**: Create/edit/delete lists
- 🗂️ **Cards**: Manage cards dengan descriptions
- 🎯 **Drag-Drop**: Smooth drag-drop antar lists
- 💾 **Persistent**: Data tersimpan di database
- 🎨 **Modern UI**: Professional task management

---

## 📦 Stack

- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Auth**: JWT + bcryptjs
- **Deployment**: Vercel

---

**Ready to deploy?** Push ke GitHub dan import di Vercel! 🚀
