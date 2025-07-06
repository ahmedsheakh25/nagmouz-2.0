# Nagmouz 2.0 🎨

An AI-powered creative assistant built for a Gulf region studio, featuring voice interaction and team management capabilities.

## 🏗 Project Structure

```bash
apps/
  nujmooz/     # AI Assistant UI (voice-enabled)
  orbit/       # Admin Dashboard (team tools)

packages/
  ui/          # Shared UI components and config

supabase/
  schema.sql   # Database schema
```

## 🚀 Features

- **nujmooz**: Voice-interactive AI chat assistant
  - Assistant UI SDK integration
  - Voice input/output with Whisper & ElevenLabs
  - Creative brief generation
  - Multi-modal interactions

- **orbit**: Admin dashboard for team operations
  - Built with Shadcn UI
  - Project tracking & analytics
  - Team collaboration tools
  - Client management

## 🛠 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI/ML**: OpenAI GPT-4 (chat, vision, embeddings)
- **Voice**: Whisper + ElevenLabs
- **Email**: Resend
- **Project Management**: Trello API
- **Deployment**: Vercel

## 🌐 Domains

- `nujmooz.ofspace.studio` - Public assistant interface
- `orbit.ofspace.studio` - Team dashboard
- `www.ofspace.studio` - Landing page

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/nagmouz-2.0.git
   cd nagmouz-2.0
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Copy the environment template:
   ```bash
   cp env.template .env
   ```

4. Fill in your environment variables in `.env`

5. Start the development server:
   ```bash
   pnpm dev
   ```

## 📱 Mobile Strategy

The project is built with a mobile-first approach and supports:
- PWA installation on mobile devices
- Future React Native with Expo compatibility
- Shared business logic and API layer

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## 📄 License

Copyright © 2024 OfSpace Studio. All rights reserved. 