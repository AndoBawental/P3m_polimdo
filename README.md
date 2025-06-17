"# P3m_polimdo" 
# 📄 Proposal Management System

Sistem Manajemen Proposal Terintegrasi berbasis Web untuk memudahkan pengelolaan proposal penelitian oleh berbagai peran seperti Mahasiswa, Dosen, Reviewer, dan Admin.

---

## 🗂️ Struktur Project
proposal-management/
├── client/ # Frontend React App (Tailwind, Context API, Routing)
|-- logs/ # History 
└── server/ # Backend Express.js API (Prisma, JWT Auth, Role Middleware)

client/
|-- node_modules/
├── public/
│   ├── index.html
│   └── logo192.png
|
├── src/
│   ├── components/
│   │   ├── Layout/
│   │   │   ├── Header.js
│   │   │   ├── Sidebar.js
│   │   │   ├── Footer.js
│   │   │   ├── Navigation.js
│   │   │   └── Layout.js
|   |   |
│   │   ├── Auth/
│   │   │   ├── LoginForm.js
│   │   │   ├── RegisterForm.js
│   │   │   ├── ProtectedRoute.js
│   │   │   └── RoleBasedRedirect.js
|   |   |
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.js
│   │   │   ├── RecentItems.js
│   │   │   ├── QuickActions.js
│   │   │   ├── ProposalStatusCard.js
│   │   │   └── RecentProposals.js
|   |   |
│   │   ├── Proposals/
│   │   │   ├── ProposalList.js
│   │   │   ├── ProposalForm.js
│   │   │   ├── ProposalCard.js
│   │   │   ├── ProposalDetail.js
│   │   │   └── ProposalStatus.js
|   |   |
│   │   ├── Reviews/
│   │   │   ├── ReviewList.js
│   │   │   ├── ReviewForm.js
|   |   |   |-- ReviewDetail.js
│   │   │   └── ReviewCard.js
|   |   |
│   │   ├── Skema/
│   │   │   ├── SkemaList.js
│   │   │   ├── SkemaForm.js
│   │   │   ├── SkemaCard.js
│   │   │   └── SkemaDetail.js
|   |   |
│   │   ├── Users/
│   │   │   ├── UserList.js
│   │   │   ├── UserProfile.js
│   │   │   ├── UserCard.js
│   │   │   └── UserForm.js
|   |   |
│   │   ├── Files/
│   │   │   ├── FileUpload.js
│   │   │   ├── FileManager.js
│   │   │   ├── DocumentList.js
│   │   │   └── FileViewer.js
|   |   |
│   │   ├── Jurusan/
│   │   │   ├── JurusanList.js
│   │   │   └── JurusanForm.js
|   |   |
│   │   ├── Prodi/
│   │   │   ├── ProdiList.js
│   │   │   └── ProdiForm.js
|   |   |
│   │   └── Common/
│   │       ├── Loading.js
│   │       ├── Modal.js
│   │       ├── Table.js
│   │       ├── Pagination.js
│   │       ├── SearchBar.js
|   |       |-- AlertMessage.js
|   |       |-- ErrorAlert.js
|   |       |-- LoadingSpinner.js
│   │       └── StatusBadge.js
|   |
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Dashboard.js
│   │   ├── LandingPage.js
|   |   |
│   │   ├── Dashboard/
│   │   │   ├── AdminDashboard.js
│   │   │   ├── DosenDashboard.js
│   │   │   ├── MahasiswaDashboard.js
│   │   │   ├── ReviewerDashboard.js
│   │   │   └── RoleBasedDashboard.js
|   |   |
│   │   ├── Proposals/
│   │   │   ├── index.js
│   │   │   ├── Create.js
│   │   │   ├── Edit.js
│   │   │   └── Detail.js
|   |   |
│   │   ├── Reviews/
│   │   │   ├── index.js
│   │   │   ├── Review.js
│   │   │   └── Detail.js
|   |   |
│   │   ├── Skema/
│   │   │   ├── index.js
│   │   │   ├── Create.js
│   │   │   ├── Edit.js
│   │   │   └── Detail.js
|   |   |
│   │   ├── Users/
│   │   │   ├── index.js
|   |   |   |-- Edit.js
│   │   │   └── Profile.js
|   |   |
│   │   ├── Jurusan/
│   │   │   ├── index.js
│   │   │   ├── Create.js
|   |   |   |-- Detail.js
│   │   │   └── Edit.js
|   |   |
│   │   ├── Prodi/
│   │   │   ├── index.js
│   │   │   ├── Create.js
|   |   |   |-- Detail.js
│   │   │   └── Edit.js
|   |   |
│   │   └── NotFound.js
|   | 
│   ├── context/
│   │   ├── AuthContext.js
│   │   └── ToastContext.js
|   |
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
|   |  
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── proposalService.js
│   │   ├── reviewService.js
│   │   ├── skemaService.js
│   │   ├── userService.js
│   │   ├── dashboardService.js
│   │   ├── fileService.js 
│   │   ├── jurusanService.js
|   |   |-- pengumumanService
│   │   └── prodiService.js
|   |
│   ├── utils/
│   │   ├── constants.js
│   │   ├── helpers.js
│   │   ├── validation.js
│   │   └── formatters.js

│   ├── styles/
│   │   └── tailwind.css

│   ├── App.js
│   └── index.js

├── .gitignore
├── package.json
├── package-lock.json
├── tailwind.config.js
├── postcss.config.js
└── README.md


server/
├── config/
│   ├── database.js
|   |-- constants.js
│   └── validateEnv.js
|  
├── controllers/
│   ├── auth.Controller.js
│   ├── user.Controller.js
│   ├── proposal.Controller.js
│   ├── skema.Controller.js
│   ├── review.Controller.js
│   ├── dashboard.Controller.js
│   ├── pengumuman.controller.js 
│   ├── file.Controller.js 
│   ├── jurusanController.js
│   └── prodiController.js
|
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── proposals.js
│   ├── skema.js
│   ├── reviews.js
│   ├── dashboard.js
│   ├── files.js
│   ├── jurusan.js
|   |-- pengumuman.js
│   ├── prodi.js
│   └── index.js

├── middleware/
│   ├── auth.js
│   ├── cors.js 
│   ├── upload.js 
|   |-- errorHandler.js 
│   ├── validator.js
│   ├── logger.js
│   ├── rateLimiter.js 
│   └── roleMiddleware.js
|  
├── prisma/
│   ├── schema.prisma
│   ├── seed-p3m.js
│   └── migrations/
|   
├── uploads/ 
│   ├── documents/
│   ├── proposals/
│   ├── reviews/
│   ├── images/
│   ├── pengumuman/
│   └── temp/
|
├── utils/
│   ├── response.js
│   ├── validation.js
│   ├── constants.js
│   ├── helper.js
│   ├── dateHelper.js
│   ├── fileUpload.js 
│   └── email.js 
|
├── logs/
│   └── app.log
|
├── .env
├── .gitignore
├── package.json
├── package-lock.json
├── server.js
└── README.md

---

## 🚀 Fitur Utama

### 👤 Autentikasi & Otorisasi
- Login / Register
- Role-based Redirect & Protected Routes
- JWT-based Auth dengan Middleware Validasi

### 📊 Dashboard (Per Role)
- Admin, Dosen, Reviewer, Mahasiswa
- Statistik, Quick Actions, Recent Activity

### 📁 Manajemen Proposal
- Buat, Edit, Lihat, dan Review Proposal
- Tracking Status (Draf, Review, Revisi, Final)
- Upload Dokumen Terkait

### 🔍 Review System
- Reviewer dapat memberikan ulasan dan status
- Tracking histori review

### ⚙️ Data Master
- Skema Penelitian
- Jurusan & Program Studi
- User Management (by Admin)


---

## 🧑‍💻 Tech Stack

| Layer     | Teknologi                      |
|-----------|--------------------------------|
| Frontend  | React, Tailwind CSS, React Router |
| Backend   | Express.js, Prisma ORM, JWT    |
| Database  | PostgreSQL / MySQL             |
| Auth      | JWT, Role-based Middleware     |
| Tools     | Nodemon, ESLint, Prettier      |

---

## 📦 Instalasi Lokal

### 1. Clone Project

```bash
git clone https://github.com/AndoB-01/p3m_Polimdo.git
cd Server(untuk Menjalankan bagian Backend)
cd Client(untuk menjalankan bagian Frontend)

cd server
npm install | Untuk menginstal Library serta Dependenciesnya|
node server.js(untuk menjalankan bagian backend di terminal)

cd client
npm install | Untuk menginstal Library serta Dependenciesnya|
npm start(untuk menjalankan bagian frontend di terminal)

# Buat file .env dari .env.example
cp .env.example .env

# Generate Prisma Client & Migrasi
npx prisma generate
npx prisma migrate dev

# (Opsional) Seed data awal
node prisma/seed-p3m.js

# Start server
npm run dev

isi .env pada Server:

# ===============server/.env =========
# Environment Configuration
# ========================
NODE_ENV=development

# ========================
# Server Configuration
# ========================
PORT=5000
HOST=localhost

# ========================
# Database Configuration (MySQL)
# ========================
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL=mysql://root:@localhost:3306/p3m-polimdo

# Jika MySQL menggunakan password:
# DATABASE_URL=mysql://root:password123@localhost:3306/p3m_polimdo

# Database Pool Settings
DB_POOL_MIN=2
DB_POOL_MAX=10

# ========================
# JWT Authentication
# ========================
JWT_SECRET=p3m_polimdo_jwt_secret_key_2024_very_secure
JWT_REFRESH_SECRET=p3m_polimdo_refresh_secret_key_2024_very_secure
JWT_EXPIRES_IN=24h
JWT_REFRESH_EXPIRES_IN=7d

# ========================
# Password Security
# ========================
BCRYPT_SALT_ROUNDS=12

# ========================
# CORS Configuration
# ========================
FRONTEND_URL=http://localhost:3000
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# ========================
# File Upload Configuration
# ========================
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,jpg,jpeg,png

# Specific upload paths
PROPOSAL_UPLOAD_PATH=./uploads/proposals
DOCUMENT_UPLOAD_PATH=./uploads/documents
IMAGE_UPLOAD_PATH=./uploads/images
TEMP_UPLOAD_PATH=./uploads/temp

# ========================
# Email Configuration (SMTP)
# ========================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
EMAIL_FROM=noreply@p3mpolimdo.ac.id
EMAIL_FROM_NAME=P3M POLIMDO

# ========================
# Rate Limiting
# ========================
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# ========================
# Session Configuration
# ========================
SESSION_SECRET=p3m_session_secret_key_2024

# ========================
# Logging Configuration
# ========================
LOG_LEVEL=info
LOG_FILE_PATH=./logs
LOG_MAX_SIZE=10m
LOG_MAX_FILES=5

# ========================
# Application URLs
# ========================
APP_URL=http://localhost:5000
CLIENT_URL=http://localhost:3000

# ========================
# Security Headers
# ========================
HELMET_ENABLED=true

# ========================
# Development Settings
# ========================
DEBUG_MODE=true
API_VERSION=v1

# ========================
# Backup Configuration
# ========================
BACKUP_DIR=./backups
AUTO_BACKUP_ENABLED=false
BACKUP_SCHEDULE=0 2 * * *

# ========================
# External API Keys (if needed)
# ========================
# SINTA_API_KEY=your_sinta_api_key
# GOOGLE_CLIENT_ID=your_google_client_id
# GOOGLE_CLIENT_SECRET=your_google_client_secret

# ========================
# Redis Configuration (Optional - for caching)
# ========================
# REDIS_HOST=localhost
# REDIS_PORT=6379
# REDIS_PASSWORD=
# CACHE_TTL=3600

📁 Struktur Folder (Ringkasan)
client/src
components/ – Komponen UI (layout, auth, dashboard, dll)

pages/ – Routing Halaman per Role/Fitur

services/ – API call terstruktur

context/ – Context Global untuk Auth & App State

hooks/ – Custom Hooks

utils/ – Helpers, Formatters, Validasi

styles/ – Tailwind config

server/
controllers/ – Logika bisnis tiap fitur

routes/ – Endpoint API

middleware/ – Auth, Logger, Upload

utils/ – Response formatter, date helper, email helper

prisma/ – ORM config, schema & seed

uploads/ – Dokumen pengguna

🛡️ Hak Akses Per Role
Role	Fitur Akses
Admin	Semua fitur, manajemen user, jurusan, prodi, skema
Dosen	Input proposal, lihat status, lihat review
Mahasiswa	Upload proposal, revisi, lihat feedback
Reviewer	Memberi review, status, catatan per proposal

