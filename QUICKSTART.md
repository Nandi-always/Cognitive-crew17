# Installation & Development Guide

## Quick Start (5 minutes)

### 1. Prerequisites Check
```bash
node --version  # Should be 18.0.0 or higher
npm --version   # Should be 9.0.0 or higher
```

### 2. Install Dependencies
```bash
cd C:\Users\amith\OneDrive\Desktop\Cognitive-crew17
npm install
```

### 3. Configure Environment
```bash
# Copy the example environment file
copy .env.example .env.local

# Edit .env.local with your settings:
# DATABASE_URL=postgresql://user:password@localhost:5432/home_layout_ai
# NEXTAUTH_SECRET=your-secret-key-here (generate with: openssl rand -base64 32)
# OPENAI_API_KEY=sk-...
```

### 4. Database Setup
```bash
# Push Prisma schema to database
npm run db:push

# (Optional) Open Prisma Studio for visual editing
npm run db:studio
```

### 5. Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser! 🎉

## Project Structure

```
digital-home-layout-ai/
├── app/                   # Next.js 15 App Router
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Root layout
│   ├── globals.css       # Global styles
│   ├── dashboard/        # Dashboard
│   ├── workspace/        # Main editor
│   └── auth/             # Auth pages
├── components/
│   ├── ui/              # Reusable UI components
│   └── canvas/          # 2D/3D canvas components
├── lib/
│   ├── stores/          # Zustand state (layout, AI)
│   ├── hooks/           # Custom React hooks
│   ├── physics.ts       # Physics utilities
│   ├── ai-layout.ts     # Layout scoring & generation
│   ├── projects.ts      # Project database ops
│   └── db.ts           # Prisma client
├── prisma/
│   └── schema.prisma   # Database schema
├── messages/           # i18n translations
├── .vscode/            # VS Code config
├── public/             # Static assets
└── types/              # TypeScript types
```

## Available Commands

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run db:push         # Sync Prisma schema to database
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed with sample data (future)

# Code Quality
npm run lint            # Run ESLint
npm run type-check      # TypeScript type checking
npm run format          # Format with Prettier
npm run format:check    # Check formatting without changes

# Testing (future)
npm run test            # Run Jest tests
npm run test:watch      # Watch mode
npm run test:e2e        # Run Playwright E2E tests
```

## Technology Stack Cheat Sheet

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | Next.js 15 | Full-stack, zero-config, amazing DX |
| **Language** | TypeScript | Type safety, better IDE support |
| **UI Framework** | React 19 | Powerful components, hooks |
| **Styling** | Tailwind CSS | Utility-first, fast development |
| **State** | Zustand | Lightweight, simple API |
| **2D Canvas** | Konva.js | Canvas library with great drag-drop |
| **3D Graphics** | Three.js | Industry standard, powerful |
| **React 3D** | React Three Fiber | React components for Three.js |
| **Forms** | React Hook Form | Lightweight, performant |
| **Validation** | Zod | TypeScript-first validation |
| **Database** | PostgreSQL | Reliable, scalable SQL DB |
| **ORM** | Prisma | Type-safe, great DX |
| **Auth** | NextAuth.js | Next.js native, flexible |
| **i18n** | next-intl | App Router support |
| **API** | tRPC | End-to-end type safety |
| **Animations** | Framer Motion | Smooth, declarative animations |
| **Deployment** | Vercel | Next.js optimized, fast |

## Development Workflow

### Adding a New Feature

1. **Create branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```

2. **Create page/component**:
   - Pages go in `app/`
   - Components go in `components/`
   - Utilities go in `lib/`

3. **Add database schema** (if needed):
   - Edit `prisma/schema.prisma`
   - Run `npm run db:push`

4. **Add API endpoint** (if needed):
   - Create in `app/api/`
   - Use tRPC for type safety

5. **Test locally**:
   - Run `npm run dev`
   - Open http://localhost:3000
   - Test in different browsers

6. **Code quality**:
   ```bash
   npm run type-check      # Check types
   npm run lint            # Lint code
   npm run format          # Format code
   ```

7. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add amazing feature"
   git push origin feature/amazing-feature
   ```

8. **Create pull request** on GitHub

### Debugging

#### VS Code Debugger

1. Set breakpoint by clicking line number
2. Run: `npm run dev`
3. Debugger should attach automatically
4. Use Debug Console to inspect variables

#### Browser DevTools

1. Open Chrome DevTools (F12)
2. Go to Sources tab
3. Navigate to file you want to debug
4. Set breakpoint and reload

#### Prisma Debugging

```bash
# See all database queries
# Enable in .env.local:
# DATABASE_URL="file:./dev.db?query_logging=true"

npm run db:studio  # Visual database browser
```

## Common Tasks

### Add a New Page

1. Create file: `app/my-page/page.tsx`
   ```tsx
   'use client';
   
   export default function MyPage() {
     return <div>Hello World</div>;
   }
   ```

2. Access at: http://localhost:3000/my-page

### Add a Database Table

1. Edit `prisma/schema.prisma`:
   ```prisma
   model MyTable {
     id    String  @id @default(cuid())
     name  String
     // ... more fields
   }
   ```

2. Run: `npm run db:push`
3. Update code to use it

### Add a New Component

1. Create: `components/MyComponent.tsx`
   ```tsx
   'use client';
   
   export function MyComponent() {
     return <div>My Component</div>;
   }
   ```

2. Import and use:
   ```tsx
   import { MyComponent } from '@/components/MyComponent';
   ```

### Add Translation

1. Edit `messages/en.json` (English)
2. Edit `messages/hi.json` (Hindi)
3. Edit `messages/kn.json` (Kannada)

Then in component:
```tsx
'use client';
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations();
  return <h1>{t('hero.title')}</h1>;
}
```

## Performance Tips

1. **Image Optimization**: Use Next.js `Image` component
2. **Code Splitting**: Dynamic imports for large components
3. **Database**: Use `.select()` to fetch only needed fields
4. **Caching**: Set ISR revalidation for static pages
5. **Bundle Size**: Check with `npm run build`

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill the process using port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or use different port:
npm run dev -- -p 3001
```

### Database Connection Error
- Check `DATABASE_URL` in `.env.local`
- Ensure PostgreSQL is running
- Run: `npm run db:push` to sync schema

### Module Not Found
- Check spelling of imports
- Ensure file exists
- Clear node_modules: `rm -r node_modules && npm install`

### Hot Reload Not Working
- Restart dev server
- Clear `.next` folder
- Check file is saved

## Next Steps

1. ✅ Set up environment variables
2. ✅ Install dependencies
3. ✅ Set up database
4. ✅ Start dev server
5. 📚 Read ARCHITECTURE.md for design decisions
6. 🎨 Explore components in `components/`
7. 🗄️ Check database schema in `prisma/schema.prisma`
8. 🚀 Start building features!

## Getting Help

- **Next.js Docs**: https://nextjs.org/docs
- **Prisma Docs**: https://prisma.io/docs
- **Tailwind Docs**: https://tailwindcss.com/docs
- **TypeScript Handbook**: https://www.typescriptlang.org/docs/

Happy coding! 🚀
