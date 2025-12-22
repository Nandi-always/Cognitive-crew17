# API Documentation

## REST API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout
- `GET /api/auth/session` - Get current session

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### AI Layout
- `POST /api/ai/generate-layout` - Generate layout from text
- `POST /api/ai/optimize-layout` - Optimize existing layout
- `POST /api/ai/score-layout` - Score layout efficiency
- `POST /api/ai/chat` - AI chat endpoint

### Export
- `POST /api/export/pdf` - Export layout as PDF
- `POST /api/export/png` - Export layout as PNG
- `POST /api/export/gltf` - Export 3D model

## tRPC API

### Project Routes
```typescript
router.project.create()      // Create project
router.project.list()        // List projects
router.project.get(id)       // Get project
router.project.update()      // Update project
router.project.delete(id)    // Delete project
```

### AI Routes
```typescript
router.ai.generateLayout()   // Generate from text
router.ai.scoreLayout()      // Score layout
router.ai.optimizeLayout()   // Optimize layout
router.ai.chat()             // Chat interaction
```

## WebSocket Events (Real-time)

### Collaboration
```
layout:update       // Layout changed
cursor:move         // User cursor moved
presence:joined     // User joined
presence:left       // User left
conflict:merge      // Merge simultaneous edits
```

## Rate Limits

- `100 requests/minute` - General API
- `10 requests/minute` - AI endpoints
- `5 generations/hour` - Layout generation
- `1000 exports/month` - Export feature

## Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad request / validation error |
| 401 | Unauthorized / not authenticated |
| 403 | Forbidden / no permission |
| 404 | Not found |
| 429 | Rate limit exceeded |
| 500 | Server error |
| 503 | Service unavailable |

## Example Requests

### Generate Layout
```bash
curl -X POST http://localhost:3000/api/ai/generate-layout \
  -H "Content-Type: application/json" \
  -d '{
    "text": "2 BHK, 900 sq ft, open kitchen, lots of natural light",
    "style": "modern"
  }'
```

### Create Project
```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{
    "name": "My Home",
    "area": 900,
    "bhk": 2,
    "style": "modern"
  }'
```

### Score Layout
```bash
curl -X POST http://localhost:3000/api/ai/score-layout \
  -H "Content-Type: application/json" \
  -d '{
    "layout": {
      "rooms": [...],
      "furniture": [...]
    }
  }'
```

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection
- `NEXTAUTH_URL` - App URL
- `NEXTAUTH_SECRET` - Session secret

Optional:
- `OPENAI_API_KEY` - For AI features
- `GOOGLE_CLIENT_ID` - For OAuth
- `CLOUDINARY_CLOUD_NAME` - For uploads

See `.env.example` for all options.
