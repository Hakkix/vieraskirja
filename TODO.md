# TODO - Vieraskirja

## ✅ Completed

### Core Features
- [x] Add message field to Post model
- [x] Implement pagination for guestbook entries (cursor-based pagination via `getAll` endpoint)
- [x] Add form validation and error handling on the client side
- [x] Set up production database (PostgreSQL)
- [x] Display all guestbook entries with pagination UI
- [x] Add ability to edit/delete posts (via admin panel)
- [x] Implement search/filter functionality
- [x] Add user avatars (DiceBear auto-generated avatars)
- [x] Add email notification for new entries (Resend integration)
- [x] Implement rate limiting to prevent spam
- [x] Add moderation/admin panel

### UI/UX
- [x] Add loading states and skeletons
- [x] Improve responsive design for mobile devices
- [x] Add animations for new post submissions
- [x] Create custom 404 and error pages
- [x] Add dark mode toggle

### Testing & Quality
- [x] Add unit tests for tRPC routers
- [x] Add E2E tests with Playwright or Cypress
- [x] Set up CI/CD pipeline

## 🚧 In Progress / High Priority

### Technical Debt
- [ ] Replace in-memory rate limiting with a shared store (e.g., Upstash Redis) for multi-instance deployments
- [ ] Move email notifications to a background job/queue with retries and structured logging/alerting
- [ ] Set up database migrations workflow (currently using `db push`)

### Security Improvements
- [ ] Add server-side authentication/authorization for admin & moderation APIs (remove public access and hardcoded admin key)
- [ ] Introduce audit logging for admin moderation actions and failed login attempts
- [ ] Add CSRF protection
- [ ] Implement input sanitization for XSS prevention (basic protection exists, needs enhancement)
- [ ] Add content security policy (CSP)
- [ ] Set up security headers

## 📋 Documentation

- [x] Document environment variables (in README.md and CLAUDE.md)
- [x] Add deployment guide (in README.md and CLAUDE.md)
- [ ] Add API documentation (tRPC endpoints documented in CLAUDE.md, need OpenAPI/Swagger)
- [ ] Create contributing guidelines

## ⚡ Performance

- [ ] Implement caching strategy (Redis/Upstash for API responses)
- [ ] Optimize database queries with proper indexes (basic indexes exist, needs review)
- [ ] Implement virtual scrolling for very long lists (currently using cursor-based pagination)

## 🔍 Monitoring & Observability

- [ ] Add error monitoring (Sentry or similar)
- [ ] Implement proper structured logging
- [ ] Add performance monitoring (Web Vitals, API response times)
- [ ] Set up database query performance monitoring

## 🎨 Nice to Have

- [ ] Export guestbook entries to PDF/CSV
- [ ] Add emoji reactions to posts
- [ ] Implement real-time updates with WebSockets or Server-Sent Events
- [ ] Add internationalization (i18n) support (currently Finnish/English mixed)
- [ ] Create public API with authentication
- [ ] Add user accounts with authentication (currently anonymous posting)
- [ ] Image uploads for posts
- [ ] Reply/comment threading

## 📝 Notes

- Most core features are complete and working in production
- Main focus areas should be security hardening and scalability improvements
- The app is currently using in-memory rate limiting which won't work across multiple server instances
- Admin authentication is basic and should be replaced with proper auth system (NextAuth.js recommended)
