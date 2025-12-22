# Next.js Project Architecture

## Technology Decisions

### Frontend Framework: Next.js 15
- **Why**: Full-stack capabilities, built-in optimization, seamless API routes
- **App Router**: Latest patterns, layouts, streaming SSR
- **Image Optimization**: Automatic WebP, responsive sizes
- **Code Splitting**: Automatic per-route

### Database: PostgreSQL + Prisma
- **Why**: Strong ACID guarantees, scalability, great Prisma DX
- **Benefits**: Type-safe queries, migrations, Studio visualization

### State Management: Zustand
- **Why**: Lightweight, flexible, no boilerplate
- **Data Fetching**: TanStack Query for server state

### Styling: Tailwind CSS
- **Why**: Rapid UI development, great performance, accessibility
- **Customization**: Extended theme colors, dark mode

### 2D Graphics: Konva.js
- **Why**: Canvas-based, performant, drag-drop out-of-the-box
- **Use Case**: Floor plan editor with transformations

### 3D Graphics: React Three Fiber
- **Why**: React-friendly Three.js wrapper, ecosystem (Drei, Cannon)
- **Use Case**: Interactive 3D home visualization

### Authentication: NextAuth.js
- **Why**: Next.js native, flexible providers, secure by default
- **Providers**: Email/password, Google OAuth

### Internationalization: next-intl
- **Why**: Next.js App Router support, simple API
- **Languages**: EN, HI, KN with full translations

### API Communication: tRPC
- **Why**: Full type-safety end-to-end, automatic validation
- **Advantages**: No need for separate API docs, refactoring safety

## Performance Optimizations

1. **Code Splitting**: Route-based automatic splitting
2. **Image Optimization**: Responsive images via Next.js Image component
3. **CSS Optimization**: Unused CSS purging via Tailwind
4. **Font Loading**: System fonts + Google Fonts with preload
5. **Bundle Analysis**: Webpack Bundle Analyzer integration (future)
6. **CDN Caching**: ISR (Incremental Static Regeneration) for landing

## Scalability Considerations

### Current (MVP)
- Single PostgreSQL database
- Vercel serverless functions
- File uploads to local disk (upgrade to Cloudinary)

### Medium-term
- Database connection pooling (PgBouncer)
- Redis for session management
- Caching layer for layout scores
- Static asset CDN

### Long-term
- Microservices (AI service, simulation service)
- Event streaming (Kafka) for real-time collaboration
- Multi-region deployment
- GraphQL federation (if needed)

## Security Practices

1. **Environment Variables**: Separated public/secret via .env.local
2. **SQL Injection**: Prisma parameterized queries
3. **CORS**: Configured per environment
4. **Session Security**: HTTPOnly cookies, CSRF tokens
5. **Rate Limiting**: (future) API rate limits
6. **Validation**: Zod schema validation for all inputs

## Developer Experience

- **Hot Reloading**: Fast Refresh for instant feedback
- **TypeScript**: Strict mode for safety
- **Prettier**: Code formatting
- **ESLint**: Linting rules
- **Debugging**: VS Code launch config
- **Testing**: Jest + React Testing Library setup

## Build & Deployment

- **Build Size**: ~2-3MB gzipped (target <4MB)
- **Build Time**: <60s (target <2m)
- **Deployment**: Vercel (automatic on push to main)
- **Staging**: Preview deploys on pull requests
- **Monitoring**: Vercel Analytics, Sentry (future)

## Documentation Strategy

1. **Code Comments**: Complex algorithms only
2. **READMEs**: Per major directory
3. **API Docs**: Auto-generated from tRPC schema
4. **Video Tutorials**: YouTube playlist (future)
5. **Onboarding**: In-app guided tour

This architecture balances simplicity, performance, and scalability for a modern web application.
