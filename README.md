# Nagmouz 2.0

A monorepo containing two applications:
1. **Nujmooz** - A voice-interactive AI chat assistant
2. **Orbit** - An admin dashboard for team operations

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

## 🏗️ Setup

1. Clone the repository:
```bash
git clone https://github.com/your-username/nagmouz-2.0.git
cd nagmouz-2.0
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Fill in the required environment variables:
- Supabase configuration
- OpenAI API key
- ElevenLabs API key
- Trello credentials

5. Start the development server:
```bash
pnpm dev
```

## 🌐 Deployment

The project is configured for deployment on Vercel:

1. Create two new projects on Vercel:
   - `nujmooz.ofspace.studio` for the voice assistant
   - `orbit.ofspace.studio` for the admin dashboard

2. Configure environment variables in Vercel:
   - Add all required API keys and credentials
   - Set up domain configuration

3. Deploy:
```bash
vercel --prod
```

## 🔑 Environment Variables

Required environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# ElevenLabs
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id

# Trello
TRELLO_KEY=your_trello_key
TRELLO_TOKEN=your_trello_token
TRELLO_BOARD_ID=your_board_id
TRELLO_LIST_ID=your_list_id
```

## 📱 PWA Support

Both applications are configured as Progressive Web Apps:
- Installable on mobile devices
- Offline support
- Push notifications (coming soon)

## 🧪 Testing

Run tests:
```bash
pnpm test
```

## 📄 License

MIT License - see LICENSE file for details 