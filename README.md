# 🌌 SoundScape  
**Platform Playlist Musik Sosial yang Dinamis, Interaktif, dan Paling Berjiwa**

SoundScape bukan sekadar app musik.  
Ini ruang bermain, ruang berbagi, dan ruang berekspresi — tempat playlist tidak hanya didengar, tapi dihidupkan.

Dengan UI modern, audio engine yang halus, dan fitur kolaboratif real-time, SoundScape memberi pengalaman mendengarkan musik yang terasa **lebih personal**, **lebih sosial**, dan **lebih manusiawi**.

---

# 🎶 Fitur Utama

## 🖥️ Pengalaman Yang Hidup  
- Desain dark mode futuristik  
- Animasi halus ala Framer Motion  
- Drag & drop playlist  
- Player canggih dengan visualizer real-time  
- Sync musik antar perangkat tanpa delay  

## 🔐 Login & Keamanan  
- Google OAuth — login sekejap  
- JWT security layer  
- Role-based access untuk kontrol penuh  

## 🎵 Playlists & Kolaborasi  
- Buat playlist pribadi  
- Publikasikan ke komunitas  
- Kolaborasi barengan teman  
- Eksplor playlist dari seluruh pengguna  

## ⚡ Teknologi Masa Depan  
- Web Audio API streaming stabil  
- Listening session real-time  
- Support PWA  
- Offline caching otomatis  

---

# 🛠️ Tech Stack

## Frontend  
React 18 • Vite • Tailwind CSS • Framer Motion • Howler.js • Socket.io Client  

## Backend  
Node.js • Express • PostgreSQL • Prisma ORM • Passport.js • JWT • Socket.io  

## Infrastructure  
Docker • Redis • Cloudinary • Nginx • Certbot  

---

# 🚀 Cara Menjalankan

## Metode 1 — Docker (Rekomendasi)
```bash
git clone https://github.com/yourusername/soundscape.git
cd soundscape

cp .env.example .env

docker-compose up -d
```

## Metode 2 — Manual
```
Backend

cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev

Frontend

cd client
npm install
npm run dev
```

---

## ⚙️ Konfigurasi Environment
```
# Server
PORT=5000
JWT_SECRET=your-secret-key

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/soundscape"

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud
CLOUDINARY_API_KEY=your-key
CLOUDINARY_API_SECRET=your-secret

# Frontend
VITE_API_URL=http://localhost:5000/api
```

---

## 📁 Struktur Project
```
soundscape/
├── client/
│   ├── components/
│   ├── pages/
│   ├── contexts/
│   ├── hooks/
│   └── utils/
│
├── server/
│   ├── prisma/
│   ├── routes/
│   ├── middleware/
│   ├── utils/
│   └── server.js
│
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## 📡 API Endpoints
```
Auth

GET /api/auth/google
GET /api/auth/google/callback
GET /api/auth/me

Playlists

GET /api/playlists/public
GET /api/playlists/:id
POST /api/playlists
PUT /api/playlists/:id
DELETE /api/playlists/:id
POST /api/playlists/:id/like

Songs

POST /api/playlists/:id/songs
DELETE /api/playlists/:id/songs/:songId
```

---

## 🎯 Fitur Lanjutan
```
Real-time Listening

socket.on('currently-playing', (data) => {
  player.seek(data.currentTime);
});

Audio Visualizer

const analyzer = audioContext.createAnalyser();
analyzer.fftSize = 2048;
const dataArray = new Uint8Array(analyzer.frequencyBinCount);
```

---

## 🧪 Testing
```
cd server && npm test
cd client && npm test
npm run cypress:open
```

---

## 🚢 Deployment
```
VPS (Docker)

git clone https://github.com/yourusername/soundscape.git
cp .env.production .env
docker-compose -f docker-compose.prod.yml up --build -d

Vercel (Frontend)

cd client
vercel --prod
```

---

## 📄 Changelog
```
v1.0.0

Google OAuth

Playlist builder

Real-time sync

Full player + visualizer

PWA support

Public playlist


v1.1.0 (Planned)

Podcast

Lyric sync

AI recommendation engine

Collaborative playlist editing
```


---
# 🎶 SoundScape — Credits & Links

## 👥 Credit

- Developer & Maintainer : ndiidepzX
- Frontend Lead          : ndiidepzX
- Backend Lead           : ndiidepzX
- Designer               : ndiidepzX

---

## 🔗 Link Penting
[▶️ Demo Live](#)  
[📘 Dokumentasi](#)  
[🧩 API Reference](#)  
[🛣️ Roadmap](#)

---

## ❤️ Terima Kasih
SoundScape dibuat untuk semua pecinta musik yang percaya bahwa playlist adalah sebuah cerita, bukan sekadar daftar lagu.  
Tetap dengarkan. Tetap berbagi. Tetap hidup.

### 🎧 Keep Listening — Keep Sharing 🎧
