# Symptocare 🏥
<img src="./logosymptocare.png" alt="Header Banner" width="100%" />

[![HackOdisha5.0](https://img.shields.io/badge/Hackathon-HackOdisha5.0-blue)](https://hackodisha.com)
[![Team Alpha](https://img.shields.io/badge/Team-Alpha-green)](https://github.com/team-alpha)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://docker.com)
[![Vercel](https://img.shields.io/badge/Vercel-Ready-black?logo=vercel)](https://vercel.com)

A comprehensive healthcare platform built during **HackOdisha5.0** hackathon by **Team Alpha**. Symptocare empowers users with AI-driven symptom analysis, personalized health insights, and seamless doctor-patient connectivity.

## 🌟 Features

- **AI-Powered Symptom Analysis**: Intelligent questionnaire system for conditions like diabetes, hypertension, and asthma
- **Doctor-Patient Portal**: Secure appointment booking and consultation management
- **Personalized Dashboard**: Health tracking and progress monitoring
- **Fitgram Social**: Community-driven wellness sharing
- **Multi-Role Authentication**: Support for patients, doctors, and administrators
- **Real-time Chat**: Instant communication between users and healthcare providers
- **Docker Containerization**: Easy deployment and scaling

## 👥 Team Alpha

| Name | Role | GitHub |
|------|------|--------|
| **Shreya Sahu** | Frontend Developer | [@shreyasahu](https://github.com/shreyaexo1) |
| **Ranjana Pradhan** | Frontend Developer & PPT Presentation | [@ranjanapradhan](https://github.com/RanjanaPradhan) |
| **Adyasha Panda** | AI Integration & Backend Developer | [@adyashapanda](https://github.com/adyasha-panda-stack) |
| **Sarthak Mahapatra** | Database Manager & Docker Integration | [@sarthakmahapatra](https://github.com/sarthakmahapatra05) |
| **Aditi Pandey** | Team Management & Deployment | [@aditipandey](https://github.com/ADITI02-DEV) |

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Docker & Docker Compose (optional, for containerized development)

### Local Development

#### Option 1: Using Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd HackOdisha5.0
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Supabase: http://localhost:5432

#### Option 2: Traditional Development

1. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your Supabase credentials
   ```

3. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000

## 🐳 Docker Commands

### Development
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Build and start
docker-compose up --build

# Stop services
docker-compose down

# View logs
docker-compose logs -f app
```

### Production Build
```bash
# Build production image
docker build -t symptocare .

# Run production container
docker run -p 3000:3000 symptocare
```

## 📁 Project Structure

```
HackOdisha5.0/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── onboarding/        # Onboarding flow
│   ├── profile/           # User profile
│   ├── fitgram/           # Social features
│   ├── chat/              # Real-time chat
│   ├── appointments/      # Appointment management
│   └── questionnaire/      # AI symptom analysis
├── components/            # Reusable UI components
├── lib/                   # Utility functions
│   ├── auth.ts           # Authentication helpers
│   └── supabase.ts       # Supabase client
├── public/               # Static assets
├── styles/               # Global styles
├── Dockerfile           # Docker configuration
├── docker-compose.yml   # Docker Compose setup
└── .dockerignore       # Docker ignore file
```

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Integration**: Custom ML models for symptom analysis
- **Deployment**: Docker, Vercel
- **Package Manager**: pnpm

## 📝 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:push      # Push schema changes to Supabase
pnpm db:studio    # Open Supabase Studio
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test with Docker: `docker-compose up --build`
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **HackOdisha5.0** organizers for the amazing hackathon experience
- **Team Alpha** for the collaborative effort and dedication
- **Supabase** for the excellent backend-as-a-service platform
- **Next.js** community for the powerful React framework

---

**Built with ❤️ by Team Alpha during HackOdisha5.0**
