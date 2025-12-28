# AstroChat - Vedic Astrology Consultation Platform

A modern web application that connects users with AI-powered Vedic astrologers for personalized astrological guidance. Built with Next.js, TypeScript, Tailwind CSS, and OpenAI.

![AstroChat](https://via.placeholder.com/800x400?text=AstroChat+Preview)

## Features

- **Beautiful Landing Page**: Cosmic-themed design with animated stars background
- **User Authentication**: Register/Login system (mock implementation - ready for database integration)
- **Astrologer Listing**: Browse astrologers with filters (language, specialization, rating, price)
- **Real-time Chat**: Chat with AI astrologers powered by OpenAI
- **Vedic Astrology**: Authentic Indian astrology responses (not Western astrology)
- **Responsive Design**: Works seamlessly on desktop and mobile

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI**: OpenAI GPT-4o-mini
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure environment variables**:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # OpenAI chat API endpoint
│   ├── astrologers/
│   │   └── page.tsx          # Astrologer listing page
│   ├── chat/
│   │   └── [id]/
│   │       └── page.tsx      # Chat with astrologer page
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── register/
│   │   └── page.tsx          # Registration page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Home/landing page
├── components/
│   ├── AstrologerCard.tsx    # Astrologer profile card
│   ├── Footer.tsx            # Site footer
│   ├── Navbar.tsx            # Navigation bar
│   └── StarsBackground.tsx   # Animated stars background
├── data/
│   └── astrologers.ts        # Astrologer data and helpers
├── lib/
│   └── AuthContext.tsx       # Authentication context provider
└── types/
    └── index.ts              # TypeScript type definitions
```

## Usage

1. **Create an Account**: Click "Sign Up" and register with your details
2. **Browse Astrologers**: Navigate to "Chat with Astrologer" to see all available astrologers
3. **Start a Chat**: Click "Chat Now" on any online astrologer's card
4. **Get Guidance**: Ask questions about love, career, health, or any life concerns

## Customization

### Adding New Astrologers

Edit `src/data/astrologers.ts` to add or modify astrologer profiles:

```typescript
{
  id: 'ast_new',
  name: 'Pandit New Astrologer',
  image: 'https://example.com/image.jpg',
  specializations: ['Vedic Astrology', 'Kundli Reading'],
  languages: ['Hindi', 'English'],
  experience: 10,
  rating: 4.8,
  // ... more fields
}
```

### Modifying AI Behavior

The AI astrologer prompt is defined in `src/app/api/chat/route.ts`. Modify the `generateAstrologerPrompt` function to customize responses.

## TODO: Database Integration

The current implementation uses localStorage for mock authentication. To add real user storage:

1. **Choose a Database**: MongoDB, PostgreSQL, or Firebase
2. **Update AuthContext**: Replace localStorage calls with API calls
3. **Add API Routes**: Create `/api/auth/login` and `/api/auth/register` endpoints
4. **Implement Sessions**: Use NextAuth.js or JWT tokens

Example locations marked with `// TODO:` comments in the code:
- `src/lib/AuthContext.tsx` - User authentication
- `.env.example` - Database connection string placeholder

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app can be deployed to any platform supporting Next.js:
- Railway
- Render
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY` | Your OpenAI API key | Yes |
| `DATABASE_URL` | Database connection string | No (for future use) |

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is for educational purposes. Feel free to use and modify.

## Acknowledgments

- Inspired by [AstroTalk](https://astrotalk.com)
- Built with [Next.js](https://nextjs.org)
- Styled with [Tailwind CSS](https://tailwindcss.com)
- AI powered by [OpenAI](https://openai.com)
