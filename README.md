# Nagmouz 2.0

A monorepo project containing two applications:

- **Nujmooz**: Voice-interactive AI chat assistant
- **Orbit**: Admin Dashboard

## 🚀 Features

### Nujmooz

- Voice-based interaction with AI assistant
- Real-time transcription using Whisper
- Natural responses with ElevenLabs text-to-speech
- Project brief generation
- PDF export functionality
- Trello integration for project management

### Orbit

- Project management dashboard
- Client relationship management
- Brief tracking and management
- Team feedback system
- Analytics and reporting
- Dark mode support

## 🛠️ Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase for:
  - Authentication
  - Database
  - Storage
  - Real-time subscriptions
- OpenAI GPT-4 & Whisper
- ElevenLabs Text-to-Speech
- Trello API integration
- PWA support

## 📦 Project Structure

```
nagmouz-2.0/
├── apps/
│   ├── nujmooz/          # Voice assistant app
│   └── orbit/            # Admin dashboard
├── packages/
│   └── ui/              # Shared UI components
└── supabase/            # Database schema and migrations
```

## 🔧 Local Development

### Prerequisites

- Node.js 18 or later
- pnpm 10.12.4 or later
- Docker (optional, for local database)

### Environment Setup

1. Install dependencies:

```bash
pnpm install
```

2. Set up environment variables:

```bash
# Copy environment templates
cp apps/orbit/.env.example apps/orbit/.env.local
cp apps/nujmooz/.env.example apps/nujmooz/.env.local
```

3. Update the environment variables in each `.env.local` file with your credentials.

### Development Commands

```bash
# Start both apps in development mode
make dev

# Start individual apps
make orbit-dev    # Start Orbit only
make nujmooz-dev  # Start Nujmooz only

# Other useful commands
make clean        # Clean up build files and dependencies
make rebuild      # Full rebuild of the environment
make logs         # View application logs
```

## 🚀 Deployment

### Deploying to Vercel

#### Orbit (Admin Dashboard)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/orbit`
   - Build Command: `cd ../.. && pnpm build --filter=orbit...`
   - Install Command: `cd ../.. && pnpm install`
   - Output Directory: `.next`

4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   TRELLO_KEY
   TRELLO_TOKEN
   TRELLO_BOARD_ID
   TRELLO_LIST_ID
   ```

#### Nujmooz (Public Assistant)

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `apps/nujmooz`
   - Build Command: `cd ../.. && pnpm build --filter=nujmooz...`
   - Install Command: `cd ../.. && pnpm install`
   - Output Directory: `.next`

4. Add environment variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   OPENAI_API_KEY
   ELEVENLABS_API_KEY
   ELEVENLABS_VOICE_ID
   ```

### Post-Deployment

1. Configure custom domains in Vercel:
   - Orbit: `admin.yourdomain.com`
   - Nujmooz: `app.yourdomain.com`

2. Set up SSL certificates (automatic with Vercel)

3. Configure environment variables in Vercel UI

## 🔍 Monitoring & Maintenance

### Error Tracking

- Vercel Analytics enabled
- Error logging to external service

### Performance Monitoring

- Vercel Edge Analytics
- Real User Monitoring
- Performance metrics tracking

### Security

- Regular dependency updates
- Environment variable audits
- Security scanning

## 📝 Contributing

1. Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:

```bash
git add .
git commit -m "feat: your feature description"
```

3. Push and create a pull request:

```bash
git push origin feature/your-feature-name
```

## 📄 License

This project is private and confidential. All rights reserved.

## 🤝 Support

For support or questions, please contact the development team.
