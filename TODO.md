# TODO - Vieraskirja

## Completed ✓

- [x] Add message field to Post model
- [x] Implement pagination for guestbook entries (cursor-based pagination via `getAll` endpoint)

## High Priority

- [x] Add form validation and error handling on the client side
- [x] Set up production database (PostgreSQL)
- [x] Display all guestbook entries with pagination UI

## Features

- [x] Add ability to edit/delete posts
- [x] Implement search/filter functionality
- [x] Add user avatars or profile pictures
- [x] Add email notification for new entries
- [x] Implement rate limiting to prevent spam
- [x] Add moderation/admin panel

## UI/UX Improvements

- [x] Add loading states and skeletons
- [x] Improve responsive design for mobile devices
- [x] Add animations for new post submissions
- [x] Create custom 404 and error pages
- [x] Add dark mode toggle

## Technical Debt

- [x] Add unit tests for tRPC routers
- [x] Add E2E tests with Playwright or Cypress
- [x] Set up CI/CD pipeline
- [ ] Add error monitoring (Sentry)
- [ ] Implement proper logging
- [ ] Replace in-memory rate limiting with a shared store (e.g., Upstash Redis) for multi-instance deployments
- [ ] Add API rate limiting
- [ ] Set up database migrations workflow
- [ ] Move email notifications to a background job/queue with retries and structured logging/alerting

## Documentation

- [ ] Add API documentation
- [ ] Create contributing guidelines
- [ ] Add deployment guide
- [ ] Document environment variables

## Performance

- [ ] Implement caching strategy
- [ ] Optimize database queries with proper indexes
- [ ] Add image optimization if avatars are implemented
- [ ] Implement infinite scroll or virtual scrolling

## Security

- [ ] Add CSRF protection
- [ ] Implement input sanitization for XSS prevention
- [ ] Add content security policy (CSP)
- [ ] Set up security headers
- [ ] Add SQL injection prevention checks
- [ ] Add server-side authentication/authorization for admin & moderation APIs (remove public access and hardcoded admin key)
- [ ] Introduce audit logging for admin moderation actions and failed login attempts

## Nice to Have

- [ ] Export guestbook entries to PDF/CSV
- [ ] Add emoji reactions to posts
- [ ] Implement real-time updates with WebSockets
- [ ] Add internationalization (i18n) support
- [ ] Create public API with authentication
