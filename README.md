<div align="center">

# 🏥 Symptocare

<img src="./logosymptocare.png" alt="Symptocare Banner" width="100%" />

<br/>

<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Poppins&size=32&pause=1000&color=00B894&center=true&vCenter=true&width=850&lines=AI-Powered+Healthcare+Platform;HackOdisha5.0+Project;Doctor+%7C+Patient+%7C+AI+Ecosystem" />
</p>

<br/>

<p align="center">
  <img src="https://img.shields.io/badge/Hackathon-HackOdisha5.0-1E90FF?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Team-Alpha-00C853?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Containerized-Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Deployment-Vercel-black?style=for-the-badge&logo=vercel" />
</p>

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,typescript,tailwind,supabase,python,flask,docker,git,vscode" />
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=sarthakmahapatra05&label=Project+Views&color=00b894&style=for-the-badge" />
</p>

</div>

---

# ✨ About The Project

**Symptocare** is a modern AI-powered healthcare ecosystem developed during **HackOdisha5.0** by **Team Alpha**.

The platform bridges the gap between patients and healthcare providers through intelligent symptom analysis, personalized healthcare recommendations, real-time communication, and doctor-patient connectivity.

Symptocare combines the power of:

- 🧠 Artificial Intelligence
- 🏥 Healthcare Management
- 💬 Real-time Communication
- 📊 Personalized Health Tracking
- 🌐 Modern Full-Stack Web Development

---

# 🚀 Features

🧠 AI-powered symptom analysis  
🏥 Doctor-patient appointment management  
📊 Personalized healthcare dashboard  
💬 Real-time chat system  
🌐 Multi-role authentication system  
📱 Mobile responsive UI  
👨‍⚕️ Doctor recommendation engine  
📈 Health tracking and monitoring  
🐳 Dockerized full-stack deployment  
🧑‍🤝‍🧑 Fitgram social wellness community  

---

# 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| **Frontend** | Next.js 14, React, TypeScript |
| **Styling** | Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes, Flask |
| **Database** | Supabase (PostgreSQL) |
| **Authentication** | Supabase Auth |
| **Machine Learning** | Scikit-learn, Python |
| **Deployment** | Docker, Vercel |
| **Package Manager** | pnpm |

---

# 👥 Team Alpha

| Member | Role | GitHub |
|---|---|---|
| **Shreya Sahu** | Frontend Developer | [@shreyasahu](https://github.com/shreyaexo1) |
| **Ranjana Pradhan** | Frontend Developer & PPT Presentation | [@ranjanapradhan](https://github.com/RanjanaPradhan) |
| **Adyasha Panda** | AI Integration & Backend Developer | [@adyashapanda](https://github.com/adyasha-panda-stack) |
| **Sarthak Mahapatra** | Database Manager & Docker Integration | [@sarthakmahapatra05](https://github.com/sarthakmahapatra05) |
| **Aditi Pandey** | Team Management & Deployment | [@ADITI02-DEV](https://github.com/ADITI02-DEV) |

---

# 🏗️ Project Structure

```bash
HackOdisha5.0/
│
├── app/
│   ├── auth/
│   ├── dashboard/
│   ├── onboarding/
│   ├── profile/
│   ├── fitgram/
│   ├── chat/
│   ├── appointments/
│   └── questionnaire/
│
├── components/
│
├── lib/
│   ├── auth.ts
│   ├── supabase.ts
│   └── questionnaire-questions.ts
│
├── ml-service/
│   ├── app.py
│   ├── models/
│   ├── train_models.py
│   └── requirements.txt
│
├── app/api/
│   ├── analyze-symptoms/
│   └── recommend-doctor/
│
├── public/
├── styles/
├── Dockerfile
├── docker-compose.yml
└── README.md
```

---

# 🚀 Quick Start

# 🔹 Clone Repository

```bash
git clone <repository-url>

cd HackOdisha5.0
```

---

# 🔹 Install Dependencies

```bash
pnpm install
```

or

```bash
npm install
```

---

# 🔹 Configure Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url

NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

ML_SERVICE_URL=http://localhost:5000
```

---

# 🔹 Start Development Server

```bash
pnpm dev
```

or

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:3000
```

---

# 🐳 Docker Setup

# 🔹 Start All Services

```bash
docker-compose up
```

---

# 🔹 Start In Background

```bash
docker-compose up -d
```

---

# 🔹 Build And Start

```bash
docker-compose up --build
```

---

# 🔹 Stop Services

```bash
docker-compose down
```

---

# 🔹 View Logs

```bash
docker-compose logs -f app
```

---

# 🧠 ML Service Setup

The application uses custom machine learning models for AI-powered symptom analysis.

---

# 🔹 Install Python Dependencies

```bash
cd ml-service

pip install -r requirements.txt
```

---

# 🔹 Train Models

```bash
python train_models.py
```

---

# 🔹 Start ML Service

```bash
python app.py
```

ML Service runs on:

```bash
http://localhost:5000
```

---

# 📊 Core Modules

| Module | Description |
|---|---|
| 🧠 Symptom Analysis | AI-based disease prediction system |
| 👨‍⚕️ Doctor Portal | Appointment & consultation management |
| 📱 Dashboard | Personalized health monitoring |
| 💬 Real-time Chat | Doctor-patient communication |
| 🧑‍🤝‍🧑 Fitgram | Social wellness platform |
| 🔐 Authentication | Secure multi-role login system |

---

# 🌐 Deployment

## 🚀 Recommended Platforms

| Service | Platform |
|---|---|
| Frontend | Vercel |
| Backend / ML Service | Docker / VPS |
| Database | Supabase |

---

# 📝 Available Scripts

```bash
# Development
pnpm dev

# Build Production
pnpm build

# Start Production
pnpm start

# Lint
pnpm lint

# Train ML Models
python train_models.py

# Start ML API
python app.py
```

---

# 🔧 Troubleshooting

## Docker Build Issues

```bash
docker-compose build --no-cache
```

---

## Dependency Installation Issues

```bash
pnpm install
```

---

## ML Service Issues

```bash
pip install -r requirements.txt
```

---

# 🌟 Future Improvements

- 📱 Mobile application
- 🧠 Advanced deep learning models
- 🩺 Telemedicine video consultation
- ☁️ Cloud-native infrastructure
- 📊 Advanced analytics dashboard
- 🔔 Smart health notifications
- 🌍 Multi-language support

---

# 🙏 Acknowledgments

- ❤️ HackOdisha5.0 organizers
- 👥 Team Alpha members
- ⚡ Supabase platform
- ▲ Next.js community
- 🐳 Docker ecosystem

---

# 📄 License

This project is licensed under the MIT License.

---

<div align="center">

# ⭐ Built With ❤️ By Team Alpha During HackOdisha5.0 ⭐

### Empowering Healthcare Through AI & Innovation

</div>
